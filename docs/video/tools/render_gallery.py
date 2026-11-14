"""Render a perspective gallery room with the real artworks hung on the walls.

usage: python3 -I render_gallery.py <artwork_dir> <out_dir>
Ray-casts a simple box room (back wall, two side walls, oak floor, ceiling) so
every painting is mapped pixel-faithfully (no AI repainting).
"""
import glob
import os
import sys

import numpy as np
from PIL import Image, ImageFilter

SRC, OUT = sys.argv[1], sys.argv[2]
os.makedirs(OUT, exist_ok=True)

W, H = 3840, 2160
RW, RH, ZB, EYE = 8.0, 3.4, 8.0, 1.6  # room width, height, back-wall depth, eye height (m)
HALF = RW / 2
HANG_Y = 1.55
FRAME = 0.035


def srgb2lin(a):
    return np.power(a, 2.2)


def lin2srgb(a):
    return np.power(np.clip(a, 0, 1), 1 / 2.2)


TEX = {}
NAMES = {}
for f in sorted(glob.glob(os.path.join(SRC, "*.jpg"))):
    k = os.path.basename(f)[:2]
    TEX[k] = srgb2lin(np.asarray(Image.open(f).convert("RGB"), dtype=np.float32) / 255)
    NAMES[k] = os.path.basename(f)


def dims(k, longest):
    h, w = TEX[k].shape[:2]
    s = longest / max(w, h)
    return w * s, h * s


# ---- layout -------------------------------------------------------------
# wall: 0 back (u = x), 1 left (u = z), 2 right (u = z)
LAYOUT = []


def place_row(wall, keys, longest, u0, u1):
    ds = [dims(k, longest[k]) for k in keys]
    total = sum(d[0] for d in ds)
    gap = (u1 - u0 - total) / (len(keys) + 1)
    u = u0 + gap
    for k, (w, h) in zip(keys, ds):
        LAYOUT.append(dict(key=k, wall=wall, u=u + w / 2, y=HANG_Y, w=w, h=h))
        u += w + gap


place_row(0, ["03", "01", "09", "11", "07"],
          {"03": 1.0, "01": 1.05, "09": 1.25, "11": 1.05, "07": 1.0}, -HALF, HALF)
place_row(1, ["05", "06", "02"], {"05": 0.9, "06": 0.85, "02": 0.9}, 4.4, ZB)
place_row(2, ["10", "08", "04"], {"10": 0.9, "08": 0.9, "04": 0.9}, 4.4, ZB)

WALL_ALB = np.array([0.93, 0.915, 0.89], np.float32)
OAK = np.array([0.80, 0.64, 0.46], np.float32)
FRAME_ALB = srgb2lin(np.array([0.80, 0.69, 0.53], np.float32))


def sample(tex, s, t):
    """Bilinear sample tex at normalized coords s (x) and t (y, top=0)."""
    h, w = tex.shape[:2]
    x = np.clip(s * (w - 1), 0, w - 1)
    y = np.clip(t * (h - 1), 0, h - 1)
    x0 = np.floor(x).astype(np.int32)
    y0 = np.floor(y).astype(np.int32)
    x1 = np.minimum(x0 + 1, w - 1)
    y1 = np.minimum(y0 + 1, h - 1)
    fx = (x - x0)[:, None]
    fy = (y - y0)[:, None]
    a = tex[y0, x0] * (1 - fx) + tex[y0, x1] * fx
    b = tex[y1, x0] * (1 - fx) + tex[y1, x1] * fx
    return a * (1 - fy) + b * fy


def shade_wall(wall, u, y):
    """Color for points on a wall; u = x (back) or z (sides)."""
    n = u.shape[0]
    col = np.tile(WALL_ALB, (n, 1))
    light = np.full(n, 0.50 if wall == 0 else 0.42, np.float32) + 0.06 * (y / RH)
    # ambient occlusion toward corners
    if wall == 0:
        d = np.minimum.reduce([HALF - np.abs(u), y, RH - y])
    else:
        d = np.minimum.reduce([ZB - u, y, RH - y])
    ao = 1 - 0.28 * np.exp(-np.maximum(d, 0) / 0.22)
    shadow = np.ones(n, np.float32)
    for p in (q for q in LAYOUT if q["wall"] == wall):
        du = u - p["u"]
        dy = y - (p["y"] + 0.15)
        light += 0.55 * np.exp(-(du / (p["w"] * 0.75 + 0.25)) ** 2 - (dy / 0.95) ** 2)
        # soft drop shadow of the frame (light from above)
        hw = p["w"] / 2 + FRAME
        hh = p["h"] / 2 + FRAME
        qx = np.abs(du) - hw + 0.005
        qy = np.abs(y - (p["y"] - 0.035)) - hh
        sdf = np.hypot(np.maximum(qx, 0), np.maximum(qy, 0)) + np.minimum(np.maximum(qx, qy), 0)
        shadow *= 1 - 0.38 * np.exp(-np.maximum(sdf, 0) / 0.03)
    base = y < 0.09
    col[base] = np.array([0.80, 0.79, 0.77], np.float32)
    out = col * (light * ao * shadow)[:, None]
    # artworks + frames
    for p in (q for q in LAYOUT if q["wall"] == wall):
        hw, hh = p["w"] / 2, p["h"] / 2
        du = u - p["u"]
        dy = y - p["y"]
        if wall == 1:  # left wall seen from inside: +z goes to the right on the canvas
            du = du
        if wall == 2:
            du = -du
        inf = (np.abs(du) <= hw + FRAME) & (np.abs(dy) <= hh + FRAME)
        inp = (np.abs(du) <= hw) & (np.abs(dy) <= hh)
        lit = 0.92 + 0.55 * np.exp(-(dy / 0.95) ** 2)
        fr = inf & ~inp
        edge = np.minimum(hw + FRAME - np.abs(du), hh + FRAME - np.abs(dy))
        out[fr] = FRAME_ALB * (lit[fr] * (0.85 + 0.15 * np.clip(edge[fr] / FRAME, 0, 1)))[:, None]
        if inp.any():
            s = (du[inp] + hw) / (2 * hw)
            t = 1 - (dy[inp] + hh) / (2 * hh)
            c = sample(TEX[p["key"]], s, t)
            inner = np.minimum(hw - np.abs(du[inp]), hh - np.abs(dy[inp]))
            lip = 1 - 0.25 * np.exp(-inner / 0.008)  # tiny shadow from frame lip
            out[inp] = c * (lit[inp] * lip)[:, None]
    return out


def shade_floor(x, z, refl=None):
    pw, pl = 0.16, 1.7
    row = np.floor((x + HALF) / pw).astype(np.int64)
    off = ((row * 2654435761) % 1000) / 1000 * pl
    pid = np.floor((z + off) / pl).astype(np.int64)
    h = ((row * 73856093) ^ (pid * 19349663)) % 1000 / 1000
    tint = 0.90 + 0.18 * h
    grain = 1 + 0.035 * np.sin(z * 37 + h * 20 + np.sin(x * 9) * 2) + 0.02 * np.sin(z * 113 + h * 50)
    fx = (x + HALF) / pw - row
    fz = (z + off) / pl - pid
    seam = (np.minimum(fx, 1 - fx) * pw < 0.0025) | (np.minimum(fz, 1 - fz) * pl < 0.003)
    alb = srgb2lin(OAK)[None, :] * (tint * grain)[:, None]
    alb[seam] *= 0.55
    light = 0.62 + 0.25 * np.exp(-(ZB - z) / 2.0) + 0.12 * np.exp(-(HALF - np.abs(x)) / 1.2)
    col = alb * light[:, None]
    return col


def shade_ceiling(x, z):
    n = x.shape[0]
    col = np.tile(np.array([0.86, 0.855, 0.84], np.float32), (n, 1)) * 0.74
    rails = (np.abs(np.abs(x) - 2.7) < 0.022) | (np.abs(z - (ZB - 1.9)) < 0.022) & (np.abs(x) < 2.7)
    col[rails] = 0.05
    fixtures = []
    for p in LAYOUT:
        if p["wall"] == 0:
            fixtures.append((p["u"], ZB - 1.9))
        else:
            fixtures.append((-2.7 if p["wall"] == 1 else 2.7, p["u"]))
    for fxp, fzp in fixtures:
        r = np.hypot(x - fxp, z - fzp)
        col[r < 0.07] = 0.04
        col[r < 0.03] = np.array([1.6, 1.5, 1.3], np.float32)
    col *= (1 - 0.25 * np.exp(-(HALF - np.abs(x)) / 0.25))[:, None]
    return col


def trace(dx, dy):
    """Return (surface id, t) for rays from the eye. dz = 1."""
    n = dx.shape[0]
    big = np.float32(1e9)
    t = np.full(n, ZB, np.float32)
    sid = np.zeros(n, np.int8)
    with np.errstate(divide="ignore", invalid="ignore"):
        tl = np.where(dx < 0, -HALF / dx, big)
        tr = np.where(dx > 0, HALF / dx, big)
        tf = np.where(dy < 0, -EYE / dy, big)
        tc = np.where(dy > 0, (RH - EYE) / dy, big)
    for i, tt in ((1, tl), (2, tr), (3, tf), (4, tc)):
        m = tt < t
        t[m] = tt[m]
        sid[m] = i
    return sid, t


def shade(dx, dy, with_refl=True):
    sid, t = trace(dx, dy)
    X = dx * t
    Y = EYE + dy * t
    Z = t
    col = np.zeros((dx.shape[0], 3), np.float32)
    for wall in (0, 1, 2):
        m = sid == wall
        if m.any():
            u = X[m] if wall == 0 else Z[m]
            col[m] = shade_wall(wall, u, Y[m])
    m = sid == 3
    if m.any():
        col[m] = shade_floor(X[m], Z[m])
    m = sid == 4
    if m.any():
        col[m] = shade_ceiling(X[m], Z[m])
    return col, sid


def render(name, f, cx_off=0.0, cy_off=0.0, ss=2, w=W, h=H):
    img = np.zeros((h, w, 3), np.float32)
    refl = np.zeros((h, w, 3), np.float32)
    fmask = np.zeros((h, w), np.float32)
    cx, cy = w / 2 + cx_off, h / 2 + cy_off
    offs = [((i + 0.5) / ss - 0.5, (j + 0.5) / ss - 0.5) for i in range(ss) for j in range(ss)]
    rows = 135
    for r0 in range(0, h, rows):
        vv, uu = np.mgrid[r0:min(r0 + rows, h), 0:w].astype(np.float32)
        acc = np.zeros(vv.shape + (3,), np.float32)
        racc = np.zeros_like(acc)
        macc = np.zeros(vv.shape, np.float32)
        for ox, oy in offs:
            dx = ((uu + 0.5 + ox - cx) / f).ravel()
            dy = (-(vv + 0.5 + oy - cy) / f).ravel()
            c, sid = shade(dx, dy)
            fl = sid == 3
            rc = np.zeros_like(c)
            if fl.any():
                # glossy floor: mirror the ray about the floor plane
                t = -EYE / dy[fl]
                # mirrored ray starts at floor point going up; emulate with a virtual eye below floor
                mdx = dx[fl]
                mdy = -dy[fl]
                # virtual eye at (0, -EYE, 0): reuse tracer by shifting heights
                sid2, t2 = trace_virtual(mdx, mdy)
                rc[fl] = shade_virtual(mdx, mdy, sid2, t2)
            cos = np.abs(dy) / np.sqrt(dx * dx + dy * dy + 1)
            fres = (0.02 + 0.30 * (1 - cos) ** 5) * fl
            acc += c.reshape(acc.shape)
            racc += rc.reshape(acc.shape)
            macc += fres.reshape(macc.shape)
        img[r0:r0 + rows] = acc / len(offs)
        refl[r0:r0 + rows] = racc / len(offs)
        fmask[r0:r0 + rows] = macc / len(offs)
    # blur reflection, fade with distance, blend onto floor
    rimg = Image.fromarray((lin2srgb(refl) * 255).astype(np.uint8)).filter(
        ImageFilter.GaussianBlur(radius=w / 180))
    rl = srgb2lin(np.asarray(rimg, np.float32) / 255)
    img = img * (1 - fmask[..., None]) + rl * fmask[..., None]
    # vignette + grain
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    rr = np.hypot((xx - w / 2) / (w / 2), (yy - h / 2) / (h / 2))
    img *= (1 - 0.18 * np.clip(rr - 0.55, 0, 1) ** 1.5)[..., None]
    img = img * 1.12
    img = img / (1 + 0.12 * img)  # soft shoulder
    out = lin2srgb(img)
    out += np.random.default_rng(1).normal(0, 0.006, out.shape).astype(np.float32)
    Image.fromarray((np.clip(out, 0, 1) * 255 + 0.5).astype(np.uint8)).save(
        os.path.join(OUT, name), quality=94)
    print("saved", name)


def trace_virtual(dx, dy):
    """Trace from the mirrored eye (0, -EYE, 0); only walls matter (y > 0)."""
    global EYE
    e = EYE
    EYE = -e
    try:
        sid, t = trace(dx, dy)
    finally:
        EYE = e
    return sid, t


def shade_virtual(dx, dy, sid, t):
    X = dx * t
    Y = -EYE + dy * t
    Z = t
    col = np.zeros((dx.shape[0], 3), np.float32)
    for wall in (0, 1, 2):
        m = (sid == wall) & (Y > 0)
        if m.any():
            u = X[m] if wall == 0 else Z[m]
            col[m] = shade_wall(wall, u, Y[m])
    m = sid == 4
    if m.any():
        col[m] = shade_ceiling(X[m], Z[m])
    return col


if __name__ == "__main__":
    views = sys.argv[3].split(",") if len(sys.argv) > 3 else ["wide", "mid", "close"]
    for p in LAYOUT:
        print(p["key"], NAMES[p["key"]], ["back", "left", "right"][p["wall"]],
              f"u={p['u']:.2f} w={p['w']:.2f} h={p['h']:.2f}")
    hero = next(p for p in LAYOUT if p["key"] == "09")
    hy = (hero["y"] - EYE)
    if "wide" in views:
        render("frame_C_wide.jpg", 2000, cx_off=-hero["u"] * 2000 / ZB)
    if "mid" in views:
        f = 3700
        render("frame_B_mid.jpg", f, cx_off=-hero["u"] * f / ZB)
    if "close" in views:
        f = 9600
        render("frame_A_close.jpg", f, cx_off=-hero["u"] * f / ZB, cy_off=hy * f / ZB)
    if "vertical" in views:
        render("frame_V_wide_9x16.jpg", 1150, w=2160, h=3840)


def _plate_frame(i, n=150):
    import math
    hero = next(p for p in LAYOUT if p["key"] == "09")
    hy = hero["y"] - EYE
    t = i / (n - 1)
    e = t * t * (3 - 2 * t)  # smoothstep ease in/out
    f = math.exp(math.log(4800) * (1 - e) + math.log(1000) * e)
    render(f"plate/{i:04d}.jpg", f, cx_off=-hero["u"] * f / ZB, cy_off=hy * f / ZB,
           ss=2, w=1920, h=1080)


if __name__ == "__main__" and "plate" in sys.argv[3:]:
    from multiprocessing import Pool
    os.makedirs(os.path.join(OUT, "plate"), exist_ok=True)
    with Pool(4) as pool:
        pool.map(_plate_frame, range(150))
