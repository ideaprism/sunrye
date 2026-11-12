// 도록에 들어가는 모든 문구는 이 파일 한 곳에서 고친다. (정인영 개인전)

export const exhibition = {
  artistKo: "정인영",
  artistEn: "JUNG IN YOUNG",
  title: "희·노·애·락",
  titlePlain: "희노애락",
  periodShort: "2026. 11. 10(화) – 17(화)",
  periodFull: "2026. 11. 10(화) – 11. 17(화)",
  hours: "오전 10시 – 오후 4시",
  venueKo: "갤러리 라온",
  venueEn: "GALLERY RAON",
  address: "서울 종로구 인사동길 36, 3층",
  phone: "",
  phoneTel: "",
  email: "inyeong3134@naver.com",
  mapUrl: "https://map.naver.com/p/search/%EC%9D%B8%EC%82%AC%EB%8F%99%EA%B8%B8%2036",
  directions: [
    { line: "3호선", station: "안국역", exit: "6번 출구" },
    { line: "1·3·5호선", station: "종로3가역", exit: "5번 출구" },
  ],
}

// 이 도록에서 켜고 끄는 기능
export const features = {
  watering: false, // 꽃에 물주기 (김선례 도록 전용)
}

// 함께 전시 중인 동료 작가 도록
export const peer = {
  label: "동료작가 작품 보기",
  artist: "김선례",
  title: "부귀영화",
  note: "같은 기간, 같은 갤러리에서 함께 전시 중입니다",
  url: "https://kimsunrye.vercel.app",
  image: "https://kimsunrye.vercel.app/works/thumb/01_bugui_651x909.webp",
}

// 작가의 말: 브로셔 내용을 바탕으로 쓴 초안. 작가 확인 후 고친다.
export const statement = {
  heading: ["기쁨과 노여움, 슬픔과 즐거움이", "겹겹이 모여 한 송이 장미가 됩니다."],
  body: [
    "살아가며 마주한 여러 감정을 색과 면으로 나누고, 다시 하나로 이어 붙였습니다. 그 한가운데에서 피어나는 꽃처럼, 이번 전시 〈희·노·애·락〉이 보시는 분들의 마음에도 작은 위로와 기쁨으로 닿기를 바랍니다.",
  ],
  sign: "정인영 드림",
}

export const artist = {
  nameKo: "정인영",
  nameEn: "Jung In Young",
  tagline: "희로애락을 색과 면으로 그리는 화가",
  role: "(사)국가보훈문화예술협회 이사 · 초대작가",
  photo: "/artist.webp",
  photoAlt: "정인영 작가 사진",
  intro:
    "정인영 작가는 개인전 10회, 단체전 60여 회를 열어 온 서양화가입니다. 장미와 해바라기 같은 꽃, 바닷속 풍경을 즐겨 그리며, 최근에는 사람의 감정을 기하학적인 면과 색으로 나누어 표현한 〈희노애락〉 연작을 이어 가고 있습니다.",
  highlightTitle: "주요 이력",
  highlights: [
    { y: "2026", event: "서울 한강비엔날레", prize: "서울시의회의장상" },
    { y: "2024", event: "제31회 한국미술국제대전", prize: "문화체육부장관상" },
    { y: "2024", event: "제4회 한류미술대전", prize: "우수상" },
    { y: "", event: "개인전 10회 · 단체전 60여 회", prize: "" },
    { y: "", event: "대한민국여성미술대전", prize: "심사위원" },
  ],
  cv: [
    {
      title: "활동",
      items: [
        ["", "개인전 10회, 단체전 60여 회"],
        ["", "(사)국가보훈문화예술협회 이사, 중앙운영위원회 총무국장, 초대작가"],
        ["", "(사)한국전업미술가협회, 버질아메리카, 태평양미술가회 회원"],
        ["", "국제교류협회 부이사장"],
        ["", "대한민국여성미술대전 심사위원"],
      ],
    },
    {
      title: "수상",
      items: [
        ["2026", "서울 한강비엔날레 서울시의회의장상"],
        ["2024", "제31회 한국미술국제대전 문화체육부장관상"],
        ["2024", "제4회 한류미술대전 우수상"],
        ["", "대한민국 킨텍스 아트 엑스포 우수작가상"],
        ["2018", "코카서스3국 '코카서스 향기에 빠지다'전 우수작가상"],
        ["2016", "크로아티아·한국현대미술초대전 '아드리아해에 미치다'전 최우수작가상"],
        ["2016", "대한민국회화대전 제30~34회 특선(4회), 입선(1회)"],
        ["2016", "제9회 대한민국힐링(치유)미술대전 특선, 입선"],
        ["", "제19~22회 대한민국여성미술대전 특선 2회, 입선"],
        ["", "기타: 자랑스런미술인 최우수상, 미술문화최우수상, 베스트작가상, 창작상, 국가보훈문화예술협회 회원전 최우수상, 한국현대미술LA아트페어 우수상 외 다수"],
      ],
    },
    {
      title: "전시",
      items: [
        ["2023", "제29회 한국미술국제대전 초대작가전"],
        ["2023", "한국현대미술LA아트페어"],
        ["2022", "대한민국문화대상전 200인 특별초대전"],
        ["", "아! 대한민국 자랑스런 미술인 200인 초대전"],
        ["2021", "대한민국현대미술100인특별초대동행전"],
        ["2021", "대한민국예술문화대상전"],
        ["2020", "대한민국현대미술동행전"],
        ["2019", "대한민국현대미술흐름전"],
        ["", "한국현대미술 뉴욕아트페스티벌, 한중현대미술소통전"],
        ["2019", "한국미술전, 인사동사람들전"],
        ["2019", "(사)한국전업미술가협회 여성작가초대전"],
        ["", "갤러리 치유 '무지개'전"],
        ["2018", "현대미술동행전, 남서울작가회전 3회"],
        ["2017", "국제작은작품미술제 '작은 그림 세상을 품다'전"],
        ["", "인사동 '희망을 노래하다'전"],
        ["", "버질아메리카 아티스트 초대전 30회"],
        ["", "버질아메리카 한국지회 정기전, 버질아메리카 로스앤젤레스전"],
      ],
    },
  ] as { title: string; items: [string, string][] }[],
}

export type Work = {
  no: number
  file: string
  title: string
  year: string
  medium: string
  mediumEn: string
  size: string
  desc: string
  w: number
  h: number
}

const ACR = "캔버스에 아크릴"
const OIL = "캔버스에 유화"

// 이미지는 브로셔 사진을 반듯하게 펴서 잘라 낸 것. 원본을 받으면 같은 파일명으로 교체한다.
// 크기 표기는 브로셔 그대로 (세로 × 가로)
export const works: Work[] = [
  { no: 1, file: "02_heenoaerak2", title: "희노애락 2", year: "2026", medium: ACR, mediumEn: "acrylic on canvas", size: "60.6 × 72.7 cm", desc: "보랏빛 장미 무늬 속에 핀 붉은 장미 한 송이", w: 1560, h: 1294 },
  { no: 2, file: "01_heenoaerak1", title: "희노애락 1", year: "2026", medium: ACR, mediumEn: "acrylic on canvas", size: "91 × 116.8 cm", desc: "여러 빛깔의 기하학적 면 한가운데 핀 붉은 장미", w: 1560, h: 1207 },
  { no: 3, file: "03_heenoaerak3", title: "희노애락 3", year: "2025", medium: ACR, mediumEn: "acrylic on canvas", size: "60.6 × 72.7 cm", desc: "청록과 보라 색면이 소용돌이치며 장미 모양을 이룸", w: 1560, h: 1294 },
  { no: 4, file: "04_heenoaerak4", title: "희노애락 4", year: "2025", medium: ACR, mediumEn: "acrylic on canvas", size: "60.6 × 72.7 cm", desc: "금빛과 보랏빛 조각이 겹겹이 모인 장미", w: 1560, h: 1294 },
  { no: 5, file: "05_heenoaerak5", title: "희노애락 5", year: "2024", medium: ACR, mediumEn: "acrylic on canvas", size: "91 × 116.8 cm", desc: "푸른 색면이 깊이 빨려 들어가는 소용돌이", w: 1560, h: 1207 },
  { no: 6, file: "06_sunflower1", title: "해바라기 1", year: "2024", medium: ACR, mediumEn: "acrylic on canvas", size: "53 × 72.7 cm", desc: "붉은 바탕의 큰 해바라기와 왼쪽의 작은 해바라기 세 송이", w: 1560, h: 1126 },
  { no: 7, file: "07_sunflower2", title: "해바라기 2", year: "2024", medium: ACR, mediumEn: "acrylic on canvas", size: "60.6 × 72.7 cm", desc: "양옆 해바라기 줄 사이에 활짝 핀 해바라기", w: 1560, h: 1294 },
  { no: 8, file: "08_eoullim", title: "어울림", year: "2023", medium: OIL, mediumEn: "oil on canvas", size: "72.7 × 90.9 cm", desc: "산호와 열대어가 어울린 바닷속, 수면 위를 나는 날치", w: 1560, h: 1240 },
]

export const workSrc = (w: Work) => `/works/${w.file}.webp`
export const workThumb = (w: Work) => `/works/thumb/${w.file}.webp`
export const workAlt = (w: Work) => `${w.title}, ${w.year}, ${w.medium}, ${w.size} — ${w.desc}`

// 방명록 '마음 고르기' (전시 주제 희·노·애·락에 맞춘 색 조각). 저장 값(id)은 바꾸지 않는다
export const flowers = [
  { id: "joy", name: "기쁨", petal: "#E0A43A", core: "#F6D88A" },
  { id: "moved", name: "감동", petal: "#B3416B", core: "#E89AB4" },
  { id: "calm", name: "평온", petal: "#3E7F8C", core: "#9CCFD3" },
  { id: "cheer", name: "응원", petal: "#7A4E96", core: "#C7A9DC" },
  { id: "thanks", name: "고마움", petal: "#3E5FA8", core: "#A9BEE8" },
] as const

export type FlowerId = (typeof flowers)[number]["id"]
export const flowerIds = flowers.map((f) => f.id) as string[]

export const share = {
  title: "정인영 개인전 〈희·노·애·락〉",
  description: "2026. 11. 10(화) – 17(화) · 갤러리 라온 (서울 종로구 인사동길 36, 3층)",
  text: "정인영 개인전 〈희·노·애·락〉에 초대합니다.\n2026. 11. 10(화) – 17(화) · 인사동 갤러리 라온",
}

// 물주기 기능은 이 도록에서 쓰지 않지만, 공용 코드가 참조하므로 값만 남겨 둔다
export const rain = {
  showBaseline: false,
  max: 3,
  baseline: {} as Record<number, number>,
  guide: "",
}
