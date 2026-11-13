"""사진 속 그림을 정면으로 펴서 잘라 낸다 (원근 보정).

사용: python3 -I warp.py <jobs.json> <앱 폴더>
jobs.json 예:
[
  {"src": "/경로/사진.jpg", "file": "01_title", "quad": [[x,y],[x,y],[x,y],[x,y]]},
  ...
]
quad 순서: 왼쪽 위, 오른쪽 위, 오른쪽 아래, 왼쪽 아래 (원본 사진 좌표, 액자 안쪽 캔버스 모서리)

결과:
- <앱>/assets-src/works/<file>.webp  워터마크 없는 긴 변 1600px (원본 보관용, 사이트에 직접 쓰지 않음)
- 출력 끝에 file별 [w, h] 를 JSON으로 찍는다 → lib/content.ts 의 w, h 에 넣는다
사진 정보(EXIF)는 남지 않는다.
"""
import sys, json, os, cv2, numpy as np
from PIL import Image, ImageOps
jobs = json.load(open(sys.argv[1])); app = sys.argv[2]
os.makedirs(f"{app}/assets-src/works", exist_ok=True)
sizes = {}
for j in jobs:
    src = np.array(ImageOps.exif_transpose(Image.open(j["src"])).convert("RGB"))
    p = np.array(j["quad"], dtype=np.float32)
    w = (np.linalg.norm(p[1] - p[0]) + np.linalg.norm(p[2] - p[3])) / 2
    h = (np.linalg.norm(p[3] - p[0]) + np.linalg.norm(p[2] - p[1])) / 2
    L = 1600
    ow, oh = (L, round(L * h / w)) if w >= h else (round(L * w / h), L)
    M = cv2.getPerspectiveTransform(p, np.array([[0, 0], [ow, 0], [ow, oh], [0, oh]], dtype=np.float32))
    im = cv2.warpPerspective(src, M, (ow, oh), flags=cv2.INTER_AREA)
    mx, my = int(ow * 0.01), int(oh * 0.01)
    im = im[my:oh - my, mx:ow - mx]
    pim = Image.fromarray(im)
    pim.save(f"{app}/assets-src/works/{j['file']}.webp", "WEBP", quality=84)
    sizes[j["file"]] = list(pim.size)
print(json.dumps(sizes, ensure_ascii=False))
