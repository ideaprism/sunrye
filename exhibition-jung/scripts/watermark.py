"""작품 이미지에 '© 작가명' 워터마크를 넣는다.

원본(워터마크 없는 1600px)은 assets-src/works/ 에 두고, 결과는 public/works/ 에 쓴다.
서명이 보통 오른쪽 아래에 있으므로 워터마크는 왼쪽 아래에 넣는다.

사용: python3 scripts/watermark.py <앱 폴더> "© 김선례" <글꼴.ttf>
"""
import sys, glob, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

app, text, font_path = sys.argv[1], sys.argv[2], sys.argv[3]
src_dir = os.path.join(app, "assets-src/works")
dst_dir = os.path.join(app, "public/works")

for src in sorted(glob.glob(os.path.join(src_dir, "*.webp"))):
    im = Image.open(src).convert("RGBA")
    W, H = im.size
    size = max(16, int(max(W, H) * 0.024))
    f = ImageFont.truetype(font_path, size)
    try:
        f.set_variation_by_axes([600])
    except Exception:
        pass
    d = ImageDraw.Draw(im)
    x0, y0, x1, y1 = d.textbbox((0, 0), text, font=f)
    m = int(max(W, H) * 0.022)
    x, y = m - x0, H - m - y1
    shadow = Image.new("RGBA", im.size, (0, 0, 0, 0))
    ImageDraw.Draw(shadow).text((x + 1, y + 1), text, font=f, fill=(0, 0, 0, 120))
    shadow = shadow.filter(ImageFilter.GaussianBlur(max(1, size // 10)))
    layer = Image.new("RGBA", im.size, (0, 0, 0, 0))
    ImageDraw.Draw(layer).text((x, y), text, font=f, fill=(255, 255, 255, 150))
    out = Image.alpha_composite(Image.alpha_composite(im, shadow), layer).convert("RGB")
    out.save(os.path.join(dst_dir, os.path.basename(src)), "WEBP", quality=84)
    print(os.path.basename(src), out.size)
