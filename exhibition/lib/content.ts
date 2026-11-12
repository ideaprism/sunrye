// 도록에 들어가는 모든 문구는 이 파일 한 곳에서 고친다.

export const exhibition = {
  artistKo: "김선례",
  artistEn: "KIM SUN RYE",
  title: "부·귀·영·화",
  titlePlain: "부귀영화",
  periodShort: "2026. 11. 10(화) – 17(화)",
  periodFull: "2026. 11. 10(화) – 11. 17(화)",
  hours: "오전 10시 – 오후 4시",
  venueKo: "갤러리 라온",
  venueEn: "GALLERY RAON",
  address: "서울 종로구 인사동길 36, 3층",
  phone: "010-5293-0303",
  phoneTel: "01052930303",
  mapUrl: "https://map.naver.com/p/search/%EC%9D%B8%EC%82%AC%EB%8F%99%EA%B8%B8%2036",
  directions: [
    { line: "3호선", station: "안국역", exit: "6번 출구" },
    { line: "1·3·5호선", station: "종로3가역", exit: "5번 출구" },
  ],
}

export const statement = {
  heading: ["꽃은 단순한 생명이 아니라", "자연의 아름다움과 생명의 신비를", "담고 있는 존재입니다."],
  body: [
    "저는 꽃을 통해 사람과 소통하고, 제 안의 감정을 조용히 표현합니다. 이번 전시 〈부귀영화〉에 담은 꽃들이 보시는 분들께 작은 기쁨이 되기를 바랍니다.",
  ],
  sign: "김선례 드림",
}

export const artist = {
  nameKo: "김선례",
  nameEn: "Kim Sun Rye",
  tagline: "꽃을 마음으로 그리는 화가",
  role: "(사)국가보훈문화예술협회 초대작가",
  photo: "/artist.webp",
  photoAlt: "김선례 작가가 눈 내린 한옥 앞마당에 서 있는 모습",
  intro:
    "김선례 작가는 젊은 시절 그림 그리기를 좋아했지만, 아내이자 부모로서의 삶을 살았습니다. 일흔에 접어들면서 다시금 붓을 잡고, 살면서 느꼈던 꽃의 아름다움과 일상의 소중함을 캔버스에 담아내는 작업을 하고 있습니다. 환하게 미소 짓는 꽃처럼, 작가도 기쁜 마음으로 그림을 그리고 있습니다.",
  highlights: [
    { y: "2026", event: "제27회 대한민국여성미술대전", prize: "동상" },
    { y: "2025", event: "제26회 대한민국여성미술대전", prize: "문화체육관광부장관상(대상)" },
    { y: "2024", event: "제25회 대한민국여성미술대전", prize: "경기도지사상, 부분대상" },
    { y: "2024", event: "제38회 대한민국회화대전", prize: "서울시의회 의장상" },
    { y: "2024", event: "제4회 대한민국예술문화대상전", prize: "예술창작상" },
  ],
  cv: [
    {
      title: "수상",
      items: [
        ["2026", "제27회 대한민국여성미술대전 동상"],
        ["2026", "(사)국가보훈문화예술협회 우수회원 표창"],
        ["2025", "제26회 대한민국여성미술대전 문화체육관광부장관상(대상)"],
        ["2025", "(사)국가보훈문화예술협회 현대미술 작은 그림전 대한민국 자랑스런 미술인(우수상)"],
        ["2024", "제25회 대한민국여성미술대전 경기도지사상, 부분대상"],
        ["2024", "제38회 대한민국회화대전 서울시의회 의장상"],
        ["2024", "제38회 대한민국회화대전 입선"],
        ["2024", "제4회 대한민국예술문화대상전 예술창작상"],
        ["2024", "(사)국가보훈문화예술협회 서울특별시 전문예술 법인 올해의 우수작가상"],
        ["2024", "(사)국가보훈문화예술협회 아름다운 만남의 상"],
        ["2022", "대한민국여성미술대전 입선"],
        ["", "(사)국가보훈문화예술협회 작은그림전 (특우상, 장려상, 반고호상, 모네상, 피카소상)"],
      ],
    },
    {
      title: "전시",
      items: [
        ["2026", "개인전 (갤러리 라온)"],
        ["2026", "제14회 현대미술페스타 (개인전)"],
        ["2025", "제13회 현대미술페스타 (개인전)"],
        ["", "회원전 및 초대전 30회"],
        ["", "해외 교류전 (한중전 2회, 인도네시아 발리, 현대미술 크루즈 페스티벌)"],
      ],
    },
    {
      title: "활동",
      items: [
        ["2026", "(사)국가보훈문화예술협회 이사 추대"],
        ["2026", "(사)국가보훈문화예술협회 민간 지도자 자격증 취득"],
        ["2025", "(사)국가보훈문화예술협회 초대작가증 취득"],
        ["2024", "(사)국가보훈문화예술협회 추천작가증 취득"],
        ["2024", "(사)국가보훈문화예술협회 운영위원"],
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

const OIL = "캔버스에 유화"
const WC = "수채화"

// w, h: 이미지 픽셀 크기(레이아웃 흔들림 방지용). 원본으로 교체하면 함께 고친다.
export const works: Work[] = [
  { no: 1, file: "01_bugui_651x909", title: "부귀영화", year: "2026", medium: OIL, mediumEn: "oil on canvas", size: "65.1 × 90.9 cm", desc: "붉은 모란 꽃무리와 흐린 하늘", w: 1286, h: 1005 },
  { no: 2, file: "02_haengbokgadeuk", title: "행복가득", year: "2025", medium: WC, mediumEn: "watercolor", size: "65.1 × 53 cm", desc: "흰 달항아리에 꽂힌 목련 가지", w: 659, h: 762 },
  { no: 3, file: "03_bugui_53x45", title: "부귀영화", year: "2026", medium: OIL, mediumEn: "oil on canvas", size: "53 × 45 cm", desc: "진분홍 모란 다발", w: 636, h: 765 },
  { no: 4, file: "04_gaeulgil", title: "가을길", year: "2025", medium: WC, mediumEn: "watercolor", size: "90.9 × 72.7 cm", desc: "노랗게 물든 자작나무 숲", w: 990, h: 1400 },
  { no: 5, file: "05_sarang", title: "사랑", year: "2026", medium: OIL, mediumEn: "oil on canvas", size: "72.7 × 60.6 cm", desc: "파란 하늘 아래 해바라기", w: 834, h: 1053 },
  { no: 6, file: "06_sunsuhan_maeum", title: "순수한 마음", year: "2024", medium: WC, mediumEn: "watercolor", size: "72.7 × 60.6 cm", desc: "흰 모란 세 송이", w: 650, h: 668 },
  { no: 7, file: "07_haengbok", title: "행복", year: "2024", medium: WC, mediumEn: "watercolor", size: "72.7 × 60.6 cm", desc: "활짝 핀 분홍 모란 한 송이", w: 685, h: 700 },
  { no: 8, file: "08_kkot_4gyejeol", title: "꽃의 4계절", year: "2025", medium: WC, mediumEn: "watercolor", size: "116.8 × 91 cm", desc: "사계절 꽃과 새, 웃는 아이들", w: 1107, h: 1400 },
  { no: 9, file: "09_hwanhui", title: "환희", year: "2025", medium: WC, mediumEn: "watercolor", size: "90.9 × 72.7 cm", desc: "해바라기와 장미, 수국이 어우러진 꽃밭", w: 1002, h: 987 },
  { no: 10, file: "10_paran_haneul", title: "파란 하늘", year: "2026", medium: OIL, mediumEn: "oil on canvas", size: "45 × 53 cm", desc: "파란 하늘 아래 흰 모란", w: 660, h: 573 },
  { no: 11, file: "11_bugui_45x53", title: "부귀영화", year: "2026", medium: OIL, mediumEn: "oil on canvas", size: "45 × 53 cm", desc: "짙은 붉은 모란", w: 676, h: 571 },
]

export const workSrc = (w: Work) => `/works/${w.file}.webp`
export const workThumb = (w: Work) => `/works/thumb/${w.file}.webp`
export const workAlt = (w: Work) => `${w.title}, ${w.year}, ${w.medium}, ${w.size} — ${w.desc}`

export const flowers = [
  { id: "peony", name: "모란", petal: "#C2185B", core: "#F2C230" },
  { id: "sunflower", name: "해바라기", petal: "#F2C230", core: "#7A4E1D" },
  { id: "cherry", name: "벚꽃", petal: "#F2B8C6", core: "#D9718C" },
  { id: "hydrangea", name: "수국", petal: "#9DB4E0", core: "#5470AE" },
  { id: "magnolia", name: "목련", petal: "#F4EEE2", core: "#C9A86A" },
] as const

export type FlowerId = (typeof flowers)[number]["id"]
export const flowerIds = flowers.map((f) => f.id) as string[]

export const share = {
  title: "김선례 개인전 〈부귀영화〉",
  description: "2026. 11. 10(화) – 17(화) · 갤러리 라온 (서울 종로구 인사동길 36, 3층)",
  text: "김선례 개인전 〈부귀영화〉에 초대합니다.\n2026. 11. 10(화) – 17(화) · 인사동 갤러리 라온",
}
