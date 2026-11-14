# 김선례 작가 갤러리 홍보영상 — 「물뿌리개 스티커, 정원이 피어나다」 (15초)

> 대상: https://kimsunrye.vercel.app/ (소스 저장소 `ideaprism/sunrye`의 작품 데이터·이미지 기준으로 작성)
> 작성일: 2026-11-14

## 0. 결론

| 항목 | 결정 |
|---|---|
| 주인공 작품 | **「장미들의 향기로운 합창」** (수채화, 80×100cm) — 화면 전체가 꽃이라 "그림 → 실제 정원" 전환이 가장 자연스러움 |
| 예비 작품 | 「분홍 진달래의 연가」 — 원래 풍경화(연못+정원)라 공간 확장형 연출에 유리 |
| 화면비 | **16:9** 권장 (주인공 작품이 가로 1.67:1). 쇼츠(9:16)로 갈 거면 세로 작품 「햇살을 품은 해바라기의 미소」로 교체 |
| 제작 방식 | 15초 단일 생성이 안 되는 툴이면 **5초 × 3컷** 분할 생성 후 편집으로 연결 |
| 톤 | 수채화의 번짐 → 실사 꽃으로 "물들듯이" 전환. 폭발·마법 이펙트 금지 |

---

## 1. 에셋 목록

| # | 에셋 | 소스 | 비고 |
|---|---|---|---|
| A1 | 주인공 작품 사진 | `public/images/rose-garden.jpg` (2780×1668) | 액자 포함 촬영본. 그대로 벽에 걸린 컷으로 사용 |
| A2 | 예비 작품 | `public/images/azalea-pond.jpg` (2544×1784) | |
| A3 | 세로형 대안 | `public/images/sunflower-window.jpg` (1796×2412) | 9:16용 |
| A4 | 벽면 보조 작품 (좌·우에 걸 그림) | `white-peonies.jpg`, `pink-peony.jpg`, `yellow-roses.jpg`, `white-magnolia.jpg` | 실제 작가 작품으로 벽을 채워야 "김선례 전시"로 보임 |
| A5 | 전시장 배경 | **생성 필요** (저장소에 전시장 사진 없음) — §2 프롬프트 | 실제 전시장 사진이 있으면 그걸 우선 사용 |
| A6 | 물뿌리개 스티커 | **생성 필요** — §3 프롬프트 | 투명 배경 PNG |
| A7 | 엔드카드 | 직접 제작 | 「김선례 작가 · 꽃을 마음으로 그리는 수채화가」 + `kimsunrye.vercel.app` / 사이트 메인색 핑크 `#EC4899`, 보조 그린 |

**제작 순서:** A5 전시장 생성 → A1을 벽에 합성(참조 이미지 편집) → 원화 왜곡 여부 확인 → 이 이미지를 영상 첫 프레임으로 사용

---

## 2. 전시장 이미지 프롬프트 (A5)

**한 줄 요약:** 따뜻한 조명의 소규모 화이트큐브 갤러리, 정면 벽 중앙에 장미 수채화 1점, 좌우에 꽃 수채화, 관람객 1명 뒷모습.

```
A small, intimate contemporary art gallery in Seoul, white walls, warm light-oak wooden floor,
soft track spotlights from the ceiling. On the center of the front wall hangs one large framed
watercolor painting of pink roses in a light wooden frame (use the reference image exactly,
do not repaint it). Smaller framed watercolor paintings of peonies and magnolias hang on the
side walls. A single visitor in a beige coat stands in front of the painting, seen from behind,
holding a small round sticker. Calm, quiet afternoon atmosphere, photorealistic, 35mm lens,
eye level, shallow depth of field, 16:9.
```

- 참조 이미지: A1(`rose-garden.jpg`) 필수 첨부. 좌우 벽은 A4 첨부.
- 주의: 실제 「인사동 한국미술관」 간판·로고는 넣지 말 것(무단 상표 사용 리스크).

---

## 3. 물뿌리개 스티커 프롬프트 (A6)

```
A cute die-cut sticker of a small watering can, soft mint-green can with a pink flower decal,
three tiny water droplets falling from the spout, thick white sticker border,
flat illustration with subtle watercolor texture, transparent background, centered, no text.
```

- 실제 촬영(실물 스티커 + 손 클로즈업)을 섞을 계획이면 이 PNG를 인쇄해서 쓰면 됨.

---

## 4. 15초 콘티

| 시간 | 컷 | 화면 | 카메라 | 사운드 |
|---|---|---|---|---|
| 0–3초 | ① 도입 | 조용한 전시장, 관람객이 장미 그림 앞에 섬 | 느린 달리인 | 피아노 단음, 실내 앰비언스 |
| 3–5초 | ② 스티커 | 손 클로즈업: 물뿌리개 스티커를 액자 모서리에 "톡" 붙임 | 클로즈업 고정 | 스티커 "톡" + 물방울 "또르르" |
| 5–8초 | ③ 깨어남 | 스티커에서 물방울이 그림 위로 번짐 → 물감이 촉촉해지며 장미 꽃잎이 실제로 움직이고 봉오리가 열림 | 그림으로 푸시인 | 현악 진입, 하프 글리산도 |
| 8–12초 | ④ 정원 확장 | 꽃이 액자 밖으로 흘러넘쳐 벽·바닥을 타고 퍼짐 → 전시장 전체가 실사 장미 정원으로 변함, 꽃잎이 흩날림 | 풀아웃 + 살짝 상승 | 풀 오케스트라 고조, 새소리 |
| 12–15초 | ⑤ 엔드 | 정원 한가운데 관람객이 미소. 페이드 → 엔드카드 | 고정 | 피아노로 회귀하며 마무리 |

---

## 5. 영상 생성 프롬프트

### 5-1. 15초 단일 프롬프트 (이미지→영상, 첫 프레임 = §2 결과물)

```
Image-to-video, 15 seconds, 16:9, photorealistic, cinematic, gentle pacing.
A quiet, warmly lit art gallery. A visitor stands before a large framed watercolor painting of
pink roses. Close-up: the visitor's hand presses a small mint-green watering-can sticker onto
the corner of the frame. Tiny water droplets drip from the sticker's spout onto the painting.
Where the water touches, the watercolor softly blooms and becomes wet and alive: painted rose
petals begin to sway, buds slowly unfurl, and the painted flowers turn into real, three-dimensional
pink roses. The roses spill gently out of the frame, climbing the white walls and spreading
across the wooden floor, until the whole gallery transforms into a lush real rose garden in full
bloom, soft sunlight streaming in, petals drifting in the air. The visitor looks around in wonder
and smiles. Camera: slow dolly-in, close-up on the sticker, push into the painting, then a slow
pull-back and slight crane up to reveal the garden. Transitions feel like watercolor pigment
spreading on wet paper, not magic sparks. Keep the original painting's composition and colors
faithful at the start.
```

### 5-2. 3컷 분할 (툴이 5초 단위일 때)

| 컷 | 첫 프레임 | 프롬프트 |
|---|---|---|
| Shot A (0–5초) | §2 전시장 이미지 | `Slow dolly-in toward a framed pink rose watercolor in a quiet gallery. A visitor's hand enters and presses a small mint-green watering-can sticker onto the frame corner. Tiny water droplets fall from the sticker onto the painting. Photorealistic, warm light, calm.` |
| Shot B (5–10초) | Shot A 마지막 프레임 | `Extreme close-up of the watercolor roses. Where water droplets land, pigment blooms like wet watercolor and the painted roses come alive: petals sway, buds unfurl, painted flowers become real three-dimensional roses that begin to spill out over the frame. Slow push-in, soft natural light.` |
| Shot C (10–15초) | Shot B 마지막 프레임 (가능하면 끝 프레임에 "장미 정원이 된 전시장" 이미지 지정) | `Slow pull-back and gentle crane up: real roses flow across the white gallery walls and floor until the entire gallery becomes a lush rose garden in full bloom, sunlight streaming in, petals drifting. The visitor stands in the middle, turning around with a soft smile. Cinematic, photorealistic.` |

### 5-3. 네거티브 프롬프트 (지원하는 툴만)

```
sparkles, glitter, magic particles, explosion, fire, neon glow, cartoon, anime, text, watermark,
logo, distorted hands, extra fingers, warped frame, melting faces, fast cuts, shaky camera
```

---

## 6. 배경음악

| 항목 | 내용 |
|---|---|
| 분위기 | 고요한 설렘 → 경이로움. "피어난다"는 느낌의 따뜻한 상승형 |
| 장르 | 네오클래식 / 시네마틱 어쿠스틱 (피아노 + 현악 + 하프) |
| 템포 | 70–80 BPM, 장조 (D 또는 F major) |
| 구조 | 0–5초 피아노 단음 아르페지오 / 5–8초 첼로·하프 진입 / 8–12초 현악 풀 크레셴도 + 첼레스타 반짝임 / 12–15초 피아노 단독으로 잔향 마무리 |
| 효과음 | 스티커 "톡"(3초), 물방울 "또르르"(4초), 꽃봉오리 열리는 미세한 바스락(6–8초), 새소리·바람(9초~) |
| 피할 것 | EDM 드롭, 트레일러식 붐(boom), 가사 있는 보컬 — 70대 작가의 수채화 정서와 충돌 |

**음악 생성 AI용 프롬프트**

```
Instrumental, 15 seconds, neoclassical cinematic, 75 BPM, F major. Starts with a soft, intimate
solo piano arpeggio, then warm cello and harp enter, building to a gentle, uplifting string
swell with celesta sparkles, like flowers blooming in spring sunlight. Ends softly on solo piano.
Hopeful, tender, wonder. No vocals, no drums.
```

---

## 7. 리스크와 대응 (직설)

| 리스크 | 왜 문제인가 | 대응 |
|---|---|---|
| **원화 왜곡** | 영상 AI가 첫 프레임부터 그림을 "다시 그려" 작가 화풍이 사라짐. 작가 홍보영상에서 가장 치명적 | 0–5초는 움직임 최소화, 원화는 이미지 편집 단계에서 합성해 고정. 결과물에서 원화와 다르면 그 컷은 실제 사진 슬라이드로 대체 |
| **손·스티커 붕괴** | 손가락 개수, 스티커 모양이 프레임마다 변형되기 쉬움 | 스티커 붙이는 3초는 실제 촬영(폰으로 손+스티커 클로즈업)이 가장 확실 |
| **전시장 사실성** | 저장소에 실제 전시장 사진이 없음 → 생성 공간은 "아무 갤러리"로 보임 | 2025 인사동 개인전 현장 사진이 있으면 그걸 첫 프레임으로 쓰는 게 신뢰도 훨씬 높음 |
| **"마법" 과잉** | 반짝이·파티클이 들어가면 싸구려 광고 느낌 | 전환을 "젖은 종이에 물감 번짐"으로 명시(프롬프트 반영됨) |
| **15초 길이** | 툴마다 1회 생성 길이가 다름 | 5초×3컷 분할 + 컷 경계를 "마지막 프레임 → 다음 첫 프레임"으로 이어 붙이기 |
| **음원 저작권** | 기성곡 사용 시 SNS 업로드 차단 가능 | AI 생성 음원 또는 로열티프리 사용, 생성 툴의 상업 이용 약관 확인 |

---

## 8. 다음 결정 필요

1. 화면비: 16:9(유튜브·사이트) vs 9:16(쇼츠·릴스)
2. 실제 전시장 사진 보유 여부 — 있으면 A5 생성 단계 생략
3. 사용할 영상 생성 툴 — 툴이 정해지면 그 툴 문법(첫/끝 프레임, 길이)에 맞춰 프롬프트 재조정
