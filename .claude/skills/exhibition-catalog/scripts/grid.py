"""사진 위에 좌표 격자를 그린다. 그림 네 모서리 좌표를 눈으로 읽을 때 쓴다.
사용: python3 -I grid.py <출력폴더> <사진1> [사진2 ...]
결과: <출력폴더>/grid_<파일명>.jpg (원본 좌표계, 100px 하늘색 / 500px 빨간 선과 숫자)
"""
import sys, os
from PIL import Image, ImageOps, ImageDraw, ImageFont
out = sys.argv[1]; os.makedirs(out, exist_ok=True)
try:
    font = ImageFont.truetype("/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc", 40)
except Exception:
    font = ImageFont.load_default()
for path in sys.argv[2:]:
    im = ImageOps.exif_transpose(Image.open(path)).convert("RGB"); W, H = im.size
    d = ImageDraw.Draw(im)
    for x in range(0, W, 100):
        big = x % 500 == 0
        d.line([(x, 0), (x, H)], fill=(255, 0, 0) if big else (0, 200, 255), width=5 if big else 2)
        if big: d.text((x + 6, 6), str(x), fill=(255, 0, 0), font=font)
    for y in range(0, H, 100):
        big = y % 500 == 0
        d.line([(0, y), (W, y)], fill=(255, 0, 0) if big else (0, 200, 255), width=5 if big else 2)
        if big: d.text((6, y + 6), str(y), fill=(255, 0, 0), font=font)
    im.thumbnail((1300, 1300))
    name = os.path.splitext(os.path.basename(path))[0]
    im.save(os.path.join(out, f"grid_{name}.jpg"), quality=80)
    print(name, W, H)
