# 김선례 작가 갤러리 영상: 물조리개 스티커 하나로 갤러리가 정원이 된다 (15초)

> 대상: https://kimsunrye.vercel.app/
> 사용 작품: 업로드한 신작 11점 (2024–2026)
> 작성일: 2026-11-14 (v2, 업로드 작품 기준으로 전면 교체)

## 0. 결론

| 항목 | 결정 |
|---|---|
| 스티커를 붙일 작품 | **09 「환희」(2025)**. 온갖 꽃과 나비가 있어서 나비가 그림 밖으로 날아오르는 첫 장면을 만들 수 있음 |
| 시점 | **관람객 1인칭(POV)**. 화면 밖에서 손만 들어와 스티커를 붙임. 줌아웃해도 사람 얼굴이나 몸을 만들 필요가 없어 AI가 망칠 부분이 줄어듦 |
| 화면비 | 16:9 (세로 9:16은 그림이 너무 작아져서 제외) |
| 제작 방식 | **3컷을 이어 붙임.** 컷마다 첫 프레임과 끝 프레임을 지정해서 원화가 바뀌지 않게 붙잡아 둠 |
| 전시장 | AI로 생성하지 않고 **11점 원화를 원근에 맞춰 벽에 직접 합성** (그림 픽셀이 그대로 유지됨) |

---

## 1. 에셋 (생성 완료)

| 파일 | 용도 | 비고 |
|---|---|---|
| `assets/frame_A_close.jpg` (3840×2160) | **Shot 1 첫 프레임**. 「환희」 클로즈업 | 좌우에 부귀영화1·2 일부 |
| `assets/frame_B_mid.jpg` (3840×2160) | Shot 2 중간 확인용 (정면 벽 5점) | |
| `assets/frame_C_wide.jpg` (3840×2160) | **Shot 2 끝 프레임이자 Shot 3 첫 프레임**. 전시장 전체 | 11점 모두 보임 |
| `assets/zoomout_guide_5s.mp4` (1080p, 5초) | 줌아웃 동선 가이드 | A에서 C까지 실제 카메라 동선. 영상 참조(모션 레퍼런스) 입력용이고, 편집할 때 타이밍 기준으로도 씀 |
| `tools/render_gallery.py` | 위 이미지와 영상을 만든 스크립트 | 작품 배치를 바꿔 다시 만들 때 사용 |
| (생성 필요) frame_D_garden | **Shot 3 끝 프레임**. 정원으로 바뀐 갤러리 | §3 프롬프트로 생성 |
| (생성 필요) 물조리개 스티커 | 실촬영용 인쇄물, 또는 참조 이미지 | §4 프롬프트로 생성 |

### 작품 배치 (frame_C 기준)

| 벽 | 왼쪽 → 오른쪽 |
|---|---|
| 왼쪽 벽 | 05 사랑(해바라기) · 06 순수한마음(흰 모란) · 02 행복가득(달항아리 목련) |
| **정면 벽** | 03 부귀영화3 · 01 부귀영화1 · **09 환희 ★** · 11 부귀영화2 · 07 행복(분홍 모란) |
| 오른쪽 벽 | 04 가을길(자작나무) · 08 꽃의4계절 · 10 파란하늘(흰 모란) |

---

## 2. 15초 콘티

| 시간 | 컷 | 화면 | 카메라 | 사운드 |
|---|---|---|---|---|
| 0–4초 | **Shot 1** 스티커 | 「환희」 클로즈업. 오른쪽 아래에서 손이 들어와 액자 모서리에 물조리개 스티커를 "톡" 붙임. 스티커 주둥이에서 물방울이 떨어져 그림에 스며들자 물감이 번지고, 그림 속 나비 3마리가 날갯짓을 시작함 | 고정에 가깝게, 아주 느린 푸시인 | 피아노 단음, 스티커 "톡", 물방울 "또르르" |
| 4–9초 | **Shot 2** 줌아웃 + 깨어남 | 나비가 그림 밖으로 날아오르고 카메라가 뒤로 빠짐. 가운데에서 바깥쪽으로 물결처럼 **작품이 하나씩 차례로 살아남** (아래 표) | 부드러운 줌아웃 (가이드 영상과 같은 동선) | 첼로·하프 진입, 작품마다 하프 음 하나씩 |
| 9–13.5초 | **Shot 3** 정원 | 꽃과 덩굴이 액자 밖으로 흘러나와 벽과 바닥을 덮음. 흰 벽은 수채 물감이 씻겨 나가듯 사라지고, 바닥은 잔디, 천장은 파란 하늘로 바뀜. 갤러리 전체가 만개한 정원이 됨 | 고정 또는 아주 느린 상승 | 현악 크레셴도, 새소리, 바람 |
| 13.5–15초 | 엔드카드 (편집) | 정원 위에 문구: 「김선례 · 꽃을 마음으로 그리는 수채화가」 + `kimsunrye.vercel.app` | 고정 | 피아노로 돌아와 마무리 |

### 작품별로 살아나는 방식 (Shot 2·3 프롬프트에 그대로 사용)

| 작품 | 움직임 |
|---|---|
| 09 환희 ★ | 나비가 그림 밖으로 날아오르고, 꽃밭 전체가 바람에 일렁임 |
| 01·11·03 부귀영화 1·2·3 | 붉은 모란 봉오리가 차례로 열리고, 잎이 흔들림 |
| 07 행복 | 분홍 모란이 숨 쉬듯 부풀며 만개함 |
| 06 순수한마음 | 흰 모란 꽃잎이 한 겹씩 펼쳐짐 |
| 10 파란하늘 | 흰 모란 봉오리가 터지고 하늘의 구름이 흐름 |
| 05 사랑 | 해바라기가 빛 쪽으로 고개를 돌림 |
| 02 행복가득 | 달항아리에서 목련 가지가 자라나며 흰 목련이 핌 |
| 04 가을길 | 자작나무의 금빛 잎이 그림 밖으로 흩날림 |
| 08 꽃의4계절 | 사계절 꽃이 차례로 번지듯 피어남 |

---

## 3. 정원 끝 프레임 이미지 프롬프트 (frame_D_garden)

이미지 편집 AI에 **`frame_C_wide.jpg`를 참조 이미지로** 넣고 생성. 정원 구성은 각 작품 요소를 모아 배치함: 가운데는 환희의 꽃밭, 좌우는 모란 화단, 뒤쪽은 자작나무 숲과 파란 하늘, 그리고 달항아리와 목련.

```
Transform this art gallery into a real, lush garden in full bloom, keeping exactly the same camera
position, perspective and horizon line. The white walls and ceiling dissolve into an open blue sky
with soft clouds. The wooden floor becomes a soft green lawn with a gentle stone path leading to the
center. In the center, where the main painting was, a vibrant mixed flowerbed of sunflowers, red
poppies, pink roses, purple hydrangeas, daisies and blue anemones, with butterflies flying. On the
left and right, abundant beds of deep magenta, pink and white tree peonies. On the far left,
sunflowers facing the sun and a white Korean moon jar with a blooming white magnolia branch. In the
background, a grove of white birch trees with golden autumn leaves. Warm spring sunlight,
photorealistic, rich but natural colors, 16:9.
```

---

## 4. 물조리개 스티커 프롬프트

```
A cute die-cut sticker of a small watering can, soft mint-green can with a pink flower decal,
three tiny water droplets falling from the spout, thick white sticker border,
flat illustration with subtle watercolor texture, transparent background, centered, no text.
```

---

## 5. 영상 생성 프롬프트 (3컷, 이미지에서 영상으로)

### Shot 1 (0–4초)
- **첫 프레임:** `frame_A_close.jpg`  /  **끝 프레임:** 지정 안 함
```
First-person view in a quiet, warmly lit art gallery, looking at a framed watercolor painting
full of colorful flowers and butterflies. A visitor's hand enters from the lower right and gently
presses a small mint-green watering-can sticker onto the lower-right corner of the wooden frame.
Tiny water droplets drip from the sticker's spout onto the painting; where they touch, the
watercolor softly blooms like pigment on wet paper. The painted flowers begin to sway and the
painted butterflies start flapping their wings. Very slow push-in, photorealistic, calm.
The painting's composition and colors stay exactly the same.
```

### Shot 2 (4–9초)
- **첫 프레임:** Shot 1의 마지막 프레임 (없으면 `frame_A_close.jpg`)  /  **끝 프레임:** `frame_C_wide.jpg`
- 모션 레퍼런스를 받는 툴이면 `zoomout_guide_5s.mp4`도 함께 입력
```
Smooth, continuous camera zoom-out from the flower painting to reveal the whole gallery.
Butterflies fly out of the painting into the room. As the camera pulls back, a wave of life
spreads from the center painting outward, one artwork after another: red peony buds open,
a pink peony swells into full bloom, white peony petals unfold, sunflowers turn toward the light,
a magnolia branch grows from a white moon jar and blossoms, golden birch leaves drift out of their
frame, and seasonal flowers spread like watercolor. Each painting keeps its own composition and
style; only the flowers move. Photorealistic gallery, warm light, gentle and magical but natural.
```

### Shot 3 (9–15초)
- **첫 프레임:** `frame_C_wide.jpg`  /  **끝 프레임:** `frame_D_garden` (§3에서 생성)
```
Flowers, vines and petals spill out of every painting frame, flowing across the white walls and
the wooden floor. The walls wash away like watercolor dissolving in water, revealing open blue sky;
the floor turns into green lawn; peonies, sunflowers, roses and hydrangeas bloom everywhere;
a birch grove with golden leaves appears in the distance; butterflies and petals drift in warm
sunlight. The whole gallery becomes a lush garden in full bloom. Static camera with a very slow
rise, cinematic, photorealistic.
```

### 네거티브 프롬프트 (지원하는 툴만)
```
sparkles, glitter, magic particles, glowing light beams, explosion, fire, neon, cartoon, anime,
text, watermark, logo, distorted hands, extra fingers, warped frames, repainted artworks,
changed painting composition, people's faces, fast cuts, shaky camera
```

### (참고) 15초를 한 번에 만드는 프롬프트
첫 프레임만 지정하는 방식이라서, **줌아웃할 때 나머지 10점을 AI가 마음대로 그려 넣게 됨.** 원화 전시 영상으로는 쓸 수 없으니 분위기만 미리 보는 용도로 쓸 것.

---

## 6. 배경음악

| 항목 | 내용 |
|---|---|
| 분위기 | 고요한 설렘 → 작품이 하나씩 깨어나는 경이로움 → 정원이 완성되는 벅참 |
| 장르 | 네오클래식, 시네마틱 어쿠스틱 (피아노 + 현악 + 하프 + 첼레스타) |
| 템포·조성 | 75 BPM, F major |
| 구조 | 0–4초 피아노 아르페지오 / 4–9초 첼로와 하프 진입, **작품이 깨어날 때마다 하프·첼레스타 음 하나씩** / 9–13.5초 현악 풀 크레셴도 / 13.5–15초 피아노 단독으로 잔향 |
| 효과음 | 스티커 "톡"(2초), 물방울(3초), 나비 날갯짓(4초), 꽃봉오리가 열리는 바스락 소리(5–9초), 새소리와 바람(10초부터) |
| 한국적 색채 (선택) | 「부귀영화」 모란과 달항아리가 중심이므로, 4–9초 구간에 **가야금 뜯는 소리**를 하프 대신 쓰면 정체성이 살아남. 9초 이후는 현악 위주 |
| 피할 것 | EDM 드롭, 트레일러식 붐(boom), 보컬 |

**음악 생성 AI용 프롬프트**
```
Instrumental, 15 seconds, neoclassical cinematic, 75 BPM, F major. Opens with a soft solo piano
arpeggio; at 4 seconds warm cello enters with delicate plucked notes (harp or gayageum) appearing
one by one like flowers waking up; at 9 seconds strings swell into a hopeful, blooming crescendo
with celesta sparkles; ends softly on solo piano. Tender, wonder, spring garden. No vocals, no drums.
```

---

## 7. 리스크와 대응 (직설)

| 리스크 | 심각도 | 대응 |
|---|---|---|
| **원화 왜곡**: 영상 AI가 움직임을 넣는 과정에서 그림을 다시 그림 | 최상 | 컷마다 첫·끝 프레임으로 고정함. 「부귀영화」 3점은 서로 비슷해서 AI가 섞어버리기 쉬우니 결과를 반드시 원화와 비교할 것 |
| **줌아웃 중 작품 뭉개짐**: 5초 동안 11점을 모두 움직이라고 하면 프레임이 무너짐 | 상 | 움직임을 정면 벽 5점에 집중하고 옆 벽은 미세하게만. 실패하면 **가이드 영상(원화 고정) 위에 나비와 꽃잎 효과만 편집으로 얹는** 방식으로 전환 |
| **손과 스티커 변형** | 중 | Shot 1의 손은 휴대폰으로 실제 촬영(그림 출력물이나 화면 위에 실제 스티커)한 뒤 합성하는 게 가장 확실함 |
| **합성 전시장이 CG처럼 보임** | 중 | 이미지 AI의 "사진처럼 보이게(photoreal)" 편집을 **낮은 강도**로 한 번 거칠 수 있음. 단, 그림 영역은 잠그고(마스크) 벽·바닥·조명만 바꿀 것 |
| **실제 전시장이 아님** | 중 | 실제 개인전 사진이 있으면 그걸로 바꾸는 게 신뢰도가 더 높음. 이 영상은 "상상 속 갤러리"로 포지셔닝하면 문제없음 |
| 음원 저작권 | 하 | AI 생성 음원이나 로열티프리 음원 사용. 생성 툴의 상업 이용 약관 확인 |

---

## 8. 작업 순서

1. §3 프롬프트로 frame_D_garden 생성 (참조 이미지: frame_C_wide)
2. Shot 1 생성 (A) → 마지막 프레임 추출
3. Shot 2 생성 (Shot 1 마지막 프레임 → C, 가이드 영상 참조)
4. Shot 3 생성 (C → D)
5. 편집: 컷 연결 지점 0.3초 크로스페이드, 음악·효과음 얹기, 13.5초부터 엔드카드
