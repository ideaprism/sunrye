"""목록용 작은 사진(640px)을 워터마크 없는 원본에서 만들고 워터마크를 넣는다.
사용: python3 scripts/thumbs.py <앱 폴더> "© 김선례" <글꼴.ttf>
"""
import sys, glob, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

app, text, font_path = sys.argv[1], sys.argv[2], sys.argv[3]
for src in sorted(glob.glob(os.path.join(app, "assets-src/works/*.webp"))):
    im = Image.open(src).convert("RGB")
    im.thumbnail((640, 640), Image.LANCZOS)
    im = im.convert("RGBA")
    W, H = im.size
    size = max(15, int(max(W, H) * 0.026))
    f = ImageFont.truetype(font_path, size)
    try:
        f.set_variation_by_axes([600])
    except Exception:
        pass
    d = ImageDraw.Draw(im)
    x0, y0, x1, y1 = d.textbbox((0, 0), text, font=f)
    m = int(max(W, H) * 0.022)
    x, y = m - x0, H - m - y1
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).text((x + 1, y + 1), text, font=f, fill=(0, 0, 0, 130))
    sh = sh.filter(ImageFilter.GaussianBlur(1))
    lay = Image.new("RGBA", im.size, (0, 0, 0, 0))
    ImageDraw.Draw(lay).text((x, y), text, font=f, fill=(255, 255, 255, 160))
    out = Image.alpha_composite(Image.alpha_composite(im, sh), lay).convert("RGB")
    out.save(os.path.join(app, "public/works/thumb", os.path.basename(src)), "WEBP", quality=80)
    print(os.path.basename(src), out.size)
