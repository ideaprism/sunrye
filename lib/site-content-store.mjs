import { existsSync } from "node:fs"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

const projectRoot = process.cwd()
const dataDir = path.join(projectRoot, "data")
const dataFile = path.join(dataDir, "site-content.json")

export const newsTypes = ["전시", "수상", "공지", "활동", "미디어", "출간"]

export function getDefaultSiteContent() {
  return {
    about: {
      artistName: "김선례 작가",
      subtitle: "꽃을 마음으로 그리는 수채화가",
      intro:
        "김선례 작가는 어린 시절부터 그림을 좋아했고, 가족과 삶을 돌보는 시간 속에서도 마음 한편에 그림을 품어 왔습니다. 70대에 다시 붓을 들며 꽃과 자연의 아름다움, 일상의 소중함을 수채화로 담아내고 있습니다.",
      familyIntro:
        "예술을 사랑하는 마음은 가족 안에서도 이어지고 있습니다. 가족 작가들은 각자의 개성과 시선으로 작품 활동을 이어가며 서로에게 영감을 주고 있습니다.",
      philosophy:
        "꽃은 단순한 생명이 아니라 자연의 아름다움과 생명의 신비를 담고 있는 존재입니다. 저는 꽃을 통해 사람과 소통하고, 제 안의 감정을 조용히 표현합니다.",
      history: [
        "2022. 10. 첫 작품 그림 공모전 참여",
        "2022. 12. 제6회 대한민국 수채화대전 입선",
        "2023. 03. 제1회 작품 그림 축전 참여",
        "2024. 04. 제2회 작품 그림전 참여",
        "2024. 07. 제5회 대한민국 미술대전 입상",
        "2024. 12. 제8회 대한민국 수채화대전 수상",
        "2025. 01. 국제 보훈문화예술협회 초대작가 선정",
        "2025. 03. 국제 보훈문화예술협회 회원전 참여",
      ],
    },
    news: [
      {
        id: 1,
        title: "서울 아트페어 전시 참여",
        date: "2025.06.25",
        type: "전시",
        image: "/images/exhibition-poster-2025.jpg",
        content:
          "김선례 작가의 수채화 작품이 서울 아트페어 전시에 소개됩니다. 꽃과 자연을 주제로 한 작품들을 현장에서 만나볼 수 있습니다.",
        location: "서울 전시장",
        period: "2025.06.25 - 2025.06.29",
        status: "published",
      },
      {
        id: 2,
        title: "국제 보훈문화예술협회 초대작가 선정",
        date: "2025.01.15",
        type: "수상",
        image: "/images/artist-photo.jpg",
        content:
          "김선례 작가가 국제 보훈문화예술협회 초대작가로 선정되었습니다. 꾸준한 작품 활동과 예술적 성취를 인정받은 결과입니다.",
        location: "",
        period: "",
        status: "published",
      },
      {
        id: 3,
        title: "수채화 신작 공개",
        date: "2024.12.15",
        type: "공지",
        image: "/images/rose-garden.jpg",
        content: "꽃과 정원을 주제로 한 새로운 수채화 작품들이 갤러리에 추가되었습니다.",
        location: "",
        period: "",
        status: "published",
      },
    ],
  }
}

export function normalizeAboutInput(input = {}, fallback = getDefaultSiteContent().about) {
  const intro = clean(input.intro ?? fallback.intro)

  return {
    artistName: clean(input.artistName ?? fallback.artistName) || "김선례 작가",
    subtitle: clean(input.subtitle ?? fallback.subtitle) || "꽃을 그리는 작가",
    intro,
    familyIntro: clean(input.familyIntro ?? fallback.familyIntro),
    philosophy: clean(input.philosophy ?? fallback.philosophy),
    history: normalizeHistory(input.historyText ?? input.history ?? fallback.history),
  }
}

export function normalizeNewsInput(input = {}, fallback = {}) {
  const type = clean(input.type ?? fallback.type ?? "공지")
  const status = input.status === "draft" ? "draft" : "published"

  return {
    title: clean(input.title ?? fallback.title),
    date: clean(input.date ?? fallback.date ?? new Date().toISOString().slice(0, 10).replaceAll("-", ".")),
    type: newsTypes.includes(type) ? type : "공지",
    image: clean(input.image ?? fallback.image ?? "/placeholder.svg") || "/placeholder.svg",
    content: clean(input.content ?? fallback.content),
    location: clean(input.location ?? fallback.location),
    period: clean(input.period ?? fallback.period),
    status,
  }
}

export function getNextNewsId(news) {
  return news.reduce((maxId, item) => Math.max(maxId, Number(item.id) || 0), 0) + 1
}

export function createNewsRecord(input, news, imagePath) {
  const normalized = normalizeNewsInput({ ...input, image: imagePath || input.image })
  const now = new Date().toISOString()

  return {
    id: getNextNewsId(news),
    ...normalized,
    createdAt: now,
    updatedAt: now,
  }
}

export function updateNewsRecord(news, id, patch, imagePath) {
  const newsId = Number(id)
  const now = new Date().toISOString()

  return news.map((item) => {
    if (Number(item.id) !== newsId) return item

    return {
      ...item,
      ...normalizeNewsInput({ ...patch, image: imagePath || patch.image }, item),
      updatedAt: now,
    }
  })
}

export function deleteNewsRecord(news, id) {
  const newsId = Number(id)
  return news.filter((item) => Number(item.id) !== newsId)
}

export async function readSiteContent() {
  if (!existsSync(dataFile)) {
    return getDefaultSiteContent()
  }

  const raw = await readFile(dataFile, "utf8")
  const parsed = JSON.parse(raw)
  const fallback = getDefaultSiteContent()

  return {
    about: normalizeAboutInput(parsed.about, fallback.about),
    news: Array.isArray(parsed.news) ? parsed.news.map((item) => ({ ...normalizeNewsInput(item), id: item.id })) : fallback.news,
  }
}

export async function writeSiteContent(content) {
  await mkdir(dataDir, { recursive: true })
  await writeFile(dataFile, `${JSON.stringify(content, null, 2)}\n`, "utf8")
  return content
}

export function getPublicSiteContent(content) {
  return {
    about: content.about,
    news: content.news.filter((item) => item.status !== "draft"),
  }
}

function normalizeHistory(value) {
  if (Array.isArray(value)) {
    return value.map(clean).filter(Boolean)
  }

  return String(value || "")
    .split(/\r?\n/)
    .map(clean)
    .filter(Boolean)
}

function clean(value) {
  return String(value ?? "").trim()
}
