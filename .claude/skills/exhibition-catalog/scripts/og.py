"""카톡 미리보기 이미지(1200x630)를 대표작으로 만든다.
사용: python3 -I og.py <앱 폴더> <대표작 file 이름>
"""
import sys
from PIL import Image
app, f = sys.argv[1], sys.argv[2]
c = Image.open(f"{app}/assets-src/works/{f}.webp").convert("RGB")
bg = Image.new("RGB", (1200, 630), (251, 250, 247))
c.thumbnail((1200, 630)); bg.paste(c, ((1200 - c.width) // 2, (630 - c.height) // 2))
bg.save(f"{app}/public/og.jpg", "JPEG", quality=88); print("ok")
