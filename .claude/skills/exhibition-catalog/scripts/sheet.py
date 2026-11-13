"""작품 목록 사진을 한 장에 모아 눈으로 확인한다.
사용: python3 -I sheet.py <앱 폴더> <출력.png>
"""
import sys, glob
from PIL import Image
fs = sorted(glob.glob(f"{sys.argv[1]}/public/works/thumb/*.webp"))
ims = [Image.open(f) for f in fs]
for i in ims: i.thumbnail((300, 300))
cols = 4; rows = (len(ims) + cols - 1) // cols
o = Image.new("RGB", (cols * 310, rows * 310), "white")
for k, i in enumerate(ims): o.paste(i, ((k % cols) * 310, (k // cols) * 310))
o.save(sys.argv[2]); print(len(ims), "works")
