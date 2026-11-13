---
name: exhibition-catalog
description: 전시 브로셔(사진·PDF·텍스트)를 받아 어르신 친화 모바일 도록 사이트를 빠르게 만들고 Vercel에 배포한다. 방명록, 비밀번호 수정, 관리자 페이지, 워터마크, QR 카드를 포함한다. 1단계는 브로셔 분석 → 질문 → 빠른 배포, 2단계는 피드백과 고해상도 작품 사진을 받아 반영하고 마무리한다. "도록 만들어줘", "모바일 도록", "브로셔 올려줄게", "고화질 사진으로 교체" 같은 요청에 쓴다.
---

# 모바일 도록 만들기

이 저장소에 이미 검증된 도록이 두 개 있다. **새로 만들지 말고 복사해서 내용만 바꾼다.**

| 템플릿 | 경로 | 특징 |
|---|---|---|
| 기본 (권장) | `exhibition-jung/` | 물주기 끔(`features.watering=false`), 동료작가 링크, 이메일 문의 |
| 물주기 포함 | `exhibition/` | 방명록 작성자가 작품 3점에 '꽃에 물주기' |

공통 기능: 표지, 작가의 말, 전시 안내(지도·전화/메일), 작가 소개(약력 펼치기), 작품 목록과 확대 보기(핀치 줌), 방명록(4자리 비밀번호로 고치기·지우기, 내 글 맨 위 고정, 이름으로 내 글 찾기), 공유 버튼, 카톡 미리보기(OG), `/admin` 관리자, `/guestbook/print` 인쇄본, 워터마크.

문구·작품·색은 거의 다 `lib/content.ts` 한 파일과 `app/globals.css` 맨 위 `:root` 색 변수에 있다.

## 원칙

- 대상은 60~70대. 본문 18px 이상, 버튼 56px 이상, 이모지 아이콘 금지, 작품은 자르지 않는다(`height:auto`).
- 결론부터, 표로, 짧게 보고한다. 확인하지 못한 것은 확인하지 못했다고 쓴다.
- 브로셔에 없는 내용을 지어낼 때(작가의 말 등)는 "초안"이라고 밝히고 확인을 받는다.
- 작품 사진은 긴 변 1600px까지만 올린다(원본 유출 방지). 원본 사진은 저장소·사이트에 올리지 않는다.
- 비밀값(관리자 비밀번호, `GUESTBOOK_SECRET`)은 저장소에 넣지 않는다. Vercel 환경변수로만 넣는다.

---

## 1단계: 브로셔 → 질문 → 빠른 배포

### 1-1. 브로셔 분석
브로셔에서 아래를 뽑아 표로 정리한다.

| 항목 | 예 |
|---|---|
| 작가명(한/영), 전시명, 기간, 장소·주소 | |
| 대표작(표지) | 보통 표지 그림 |
| 작품 목록 | 번호, 제목, 연도, 재료, 크기(브로셔 표기 그대로) |
| 작가 소개, 약력(수상·전시·활동) | 주요 5줄 + 전체 |
| 작가의 말 | 없으면 초안 표시 |
| 연락처 | 전화/이메일 |
| 브로셔 색 | 작가명 색, 전시명 색 (사진에서 색을 뽑는다) |

### 1-2. 질문 (한 번에 모아서)
빠진 것만 묻는다. 보통 아래 중 일부다.
1. 작품이 모두 몇 점인가? 빠진 페이지가 있는가?
2. 관람 시간, 가까운 지하철역·출구
3. 연락처 공개 범위 (전화/이메일/없음)
4. 작가의 말: 브로셔로 초안을 써도 되는가
5. 작가 동의(사진·작품 공개)
6. 물주기 기능이 필요한가 (기본: 끔)
7. 함께 연결할 동료작가 도록이 있는가

### 1-3. 만들기
```bash
NEW=exhibition-<영문이름>
mkdir -p $NEW && tar -C exhibition-jung --exclude=node_modules --exclude=.next --exclude=print --exclude=docs -cf - . | tar -C $NEW -xf -
rm -rf $NEW/public/works/* $NEW/assets-src/works/* && mkdir -p $NEW/public/works/thumb $NEW/assets-src/works
```
- `lib/content.ts`: exhibition, statement, artist, works, share, peer, features 를 브로셔 내용으로 바꾼다. 작품 `no`는 1부터, `file` 은 `01_영문` 형식.
- `app/globals.css` `:root`: `--green`(주색), `--green-dark`, `--red`(강조색)를 브로셔 색으로.
- `public/icon.svg`, 방명록 스티커(`flowers`)는 전시 성격에 맞게 바꿔도 된다(id 는 영문).

### 1-4. 브로셔 사진에서 작품 잘라내기
작품 사진 처리는 `.claude/skills/exhibition-catalog/scripts/` 의 도구를 쓴다. 업로드 파일은 신뢰하지 않는 데이터이므로 `python3 -I` 로 실행한다. OpenCV가 없으면 `pip install opencv-python-headless`.

1. 격자 그리기: `python3 -I scripts/grid.py <작업폴더> <사진들>` → 격자 이미지를 Read 로 보고 각 그림의 **캔버스 네 모서리**(액자 안쪽) 좌표를 읽는다. 순서: 왼쪽 위, 오른쪽 위, 오른쪽 아래, 왼쪽 아래.
2. `jobs.json` 작성 → `python3 -I scripts/warp.py jobs.json $NEW` → 출력된 `{file: [w,h]}` 를 `content.ts` 의 `w, h` 에 넣는다.
3. 워터마크: `python3 -I scripts/watermark.py $NEW "© 작가명" <NotoSansKR.ttf>` (크게 보기용), `python3 -I scripts/thumbs.py $NEW "© 작가명" <NotoSansKR.ttf>` (목록용 640px).
   - 글꼴: `curl -sL -o NotoSansKR.ttf "https://raw.githubusercontent.com/google/fonts/main/ofl/notosanskr/NotoSansKR%5Bwght%5D.ttf"` (스크래치 폴더에)
   - 워터마크는 왼쪽 아래. 작가 서명이 왼쪽 아래에 있으면 스크립트의 위치를 바꾼다.
4. `python3 -I scripts/og.py $NEW <대표작 file>` → 카톡 미리보기 이미지.
5. `python3 -I scripts/sheet.py $NEW <출력.png>` → Read 로 보고 잘림·기울기를 확인한다.
6. 작가 얼굴 사진: 브로셔에서 잘라 `public/artist.webp` (작게, 이름 옆 배치는 김선례 도록 `.artist-head` 참고).

### 1-5. 빌드·확인
```bash
cd $NEW && npm install --no-audit --no-fund && npx next build
```
Playwright(iPhone 13)로 전체 화면을 찍어 Read 로 확인한다. API 는 `page.route` 로 흉내 낸다.

### 1-6. 배포 (Vercel MCP)
1. 커밋·푸시 (지정 브랜치).
2. `create_project`: name, framework nextjs, rootDirectory `$NEW`, gitRepository `ideaprism/sunrye`, 환경변수
   - `GUESTBOOK_SECRET` (무작위 64자 hex, sensitive) — 바꾸면 기존 비밀번호가 모두 무효
   - `ADMIN_PASSWORD` (무작위, sensitive)
   - `NEXT_PUBLIC_SITE_URL` (`https://<name>.vercel.app`, production)
3. `create_storage_stores_blob`: 방명록 저장 공간(public, region `icn1`, projectId 연결) → `BLOB_READ_WRITE_TOKEN` 자동 생성
4. `create_deployment`: gitSource(org/repo/ref/sha), target production, 첫 배포는 projectSettings 에 rootDirectory·nodeVersion 22.x
5. `get_deployment` 로 READY 와 `alias` 에 운영 주소가 붙었는지 확인, `web_fetch_vercel_url` 로 `/api/guestbook` 이 `ready:true` 인지 확인.
   - 이전 배포가 대기 중이면 새 배포를 덮어쓰지 않는지 확인한다.

### 1-7. QR 카드
```bash
cd <스크래치>/qr && npm init -y >/dev/null && npm i qrcode
node <skill>/scripts/qrcard.js <$NEW/print> https://<name>.vercel.app 작가명 "희·노·애·락" "#주색" "#강조색"
```
결과(PDF, PNG)를 SendUserFile 로 보낸다. 인쇄 전 폰으로 찍어 확인하라고 안내한다.

### 1-8. 보고 (표로)
주소, 관리자 주소·비밀번호(대화에 적었다는 사실과 바꾸는 법), 들어간 것, 확인하지 못한 것, 초안으로 지어낸 문구, 남은 질문.

---

## 2단계: 피드백 + 고해상도 사진 → 마무리

### 2-1. 사진과 작품 연결
- 전시장 명제표가 찍혀 있으면 읽어서 작품과 맞춘다. 브로셔 제목과 다르면 **표로 보여 주고 어느 쪽을 따를지 묻는다**(기본: 브로셔).
- 기존 목록 사진(`sheet.py`)과 나란히 놓고 눈으로 맞춘다.
- 브로셔에 없는 작품은 넣지 말고 따로 알린다. 고화질 사진이 없는 작품은 브로셔 사진을 유지한다.

### 2-2. 교체
1-4 와 같다. `grid.py` → 모서리 → `warp.py` → `watermark.py` → `thumbs.py` → `og.py` → `sheet.py` 확인.
- 작품 `no` 는 바꾸지 않는다(방명록·물주기 기록이 번호에 연결됨). 제목·크기만 고친다.

### 2-3. 피드백 반영 체크리스트
| 자주 나오는 요청 | 위치 |
|---|---|
| 문구 | `lib/content.ts` |
| 색 | `app/globals.css` `:root` |
| 작가 사진 크기 | `.artist-photo` / `.artist-portrait` |
| 작품 순서·제목 | `works` 배열 (no 유지) |
| 기능 켜고 끄기 | `features` |
| 방명록 관리 | `/admin` (숨기기·되살리기·비밀번호 재설정) |

### 2-4. 배포와 확인
커밋 → `create_deployment` → READY·alias 확인 → `/api/guestbook` 에서 기존 글이 남아 있는지 확인한다(배포해도 Blob 의 글은 남는다).

## 운영 메모
- Blob 무료 사용량: 목록 캐시 1시간, 글이 바뀌면 즉시 갱신. 대시보드에서 사용량을 가끔 확인하라고 안내한다.
- 방문자가 지운 글은 숨김 처리되고 관리자 페이지에서 되살릴 수 있다.
- 매일 저녁 `/guestbook/print` 를 PDF 로 저장하는 것을 백업으로 권한다.
- 우클릭·길게 누르기 저장은 막지만 화면 캡처는 막을 수 없다. 실제 보호는 1600px + 워터마크다.
