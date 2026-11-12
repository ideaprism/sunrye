import "server-only"
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto"
import { del, head, list, put } from "@vercel/blob"
import { revalidateTag, unstable_cache } from "next/cache"
import { rain as rainConfig } from "./content"
import type { Entry, Settings } from "./guestbook-shared"

// 방명록 글 1건 = Vercel Blob 파일 1개 (guestbook/<시각>-<무작위>.json)
// 배포와 무관하게 저장 공간에 남는다. 관리는 /admin 화면에서 한다
const PREFIX = "guestbook/"
const TAG = "guestbook"

type Stored = {
  created_at: string
  updated_at?: string
  name: string
  message: string
  flower: string
  hidden?: boolean // 관리자가 숨긴 글
  rain?: number[] // 비를 내린 작품 번호 (최대 3개)
  pin?: string // HMAC(서버 비밀값, id:비밀번호). 비밀번호 원문은 저장하지 않는다
}

export const guestbookReady = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN)
export const pinReady = () => Boolean(process.env.GUESTBOOK_SECRET)

const pathOf = (id: string) => `${PREFIX}${id}.json`

const pinHash = (id: string, pin: string) =>
  createHmac("sha256", process.env.GUESTBOOK_SECRET!).update(`${id}:${pin}`).digest("hex")

const toEntry = (id: string, d: Stored): Entry => ({
  id,
  created_at: String(d.created_at),
  updated_at: d.updated_at ? String(d.updated_at) : undefined,
  name: String(d.name),
  message: String(d.message),
  flower: String(d.flower),
  has_pin: Boolean(d.pin),
  rain: Array.isArray(d.rain) ? d.rain.filter((n) => Number.isInteger(n)) : [],
  hidden: Boolean(d.hidden),
})

async function readBlob(url: string, version: number, cache: RequestCache): Promise<Stored | null> {
  // 수정된 글이 예전 내용으로 보이지 않도록 업로드 시각을 주소에 붙인다
  const res = await fetch(`${url}?v=${version}`, { cache })
  if (!res.ok) return null
  return (await res.json()) as Stored
}

async function loadAll(): Promise<Entry[]> {
  if (!guestbookReady()) return []
  const blobs: { url: string; pathname: string; uploadedAt: Date }[] = []
  let cursor: string | undefined
  do {
    const r = await list({ prefix: PREFIX, limit: 1000, cursor })
    blobs.push(...r.blobs)
    cursor = r.hasMore ? r.cursor : undefined
  } while (cursor)

  const rows = await Promise.all(
    blobs.map(async (b) => {
      try {
        const d = await readBlob(b.url, new Date(b.uploadedAt).getTime(), "force-cache")
        return d ? toEntry(b.pathname.slice(PREFIX.length).replace(/\.json$/, ""), d) : null
      } catch {
        return null
      }
    }),
  )
  return rows.filter((x): x is Entry => x !== null).sort((a, b) => b.created_at.localeCompare(a.created_at))
}

// 목록 조회 횟수를 줄이기 위해 60초 캐시. 글이 바뀌면 즉시 갱신
const cachedAll = unstable_cache(loadAll, ["guestbook-all-v2"], { tags: [TAG], revalidate: 60 })

// 방문자용: 숨긴 글 제외
export async function listEntries(): Promise<Entry[]> {
  return (await cachedAll()).filter((e) => !e.hidden).map(({ hidden: _h, ...e }) => e)
}

// 관리자용: 전부 (캐시 없이)
export async function listAllForAdmin(): Promise<Entry[]> {
  return loadAll()
}

export function clientHash(ip: string, ua: string) {
  return createHash("sha256").update(`${ip}|${ua}`).digest("hex").slice(0, 32)
}

async function write(id: string, data: Stored) {
  await put(pathOf(id), JSON.stringify(data), {
    access: "public",
    contentType: "application/json; charset=utf-8",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  })
}

// 같은 사람이 30초 안에 다시 올리는 것을 막는다 (서버 인스턴스 메모리 기준)
const recent = new Map<string, number>()
let minuteWindow = { start: 0, count: 0 }

export async function addEntry(input: { name: string; message: string; flower: string; pin: string; rain: number[]; client: string }) {
  const now = Date.now()
  for (const [k, t] of recent) if (now - t > 30_000) recent.delete(k)
  if (recent.has(input.client)) return { error: "rate_limited" as const }
  if (now - minuteWindow.start > 60_000) minuteWindow = { start: now, count: 0 }
  if (minuteWindow.count >= 30) return { error: "busy" as const }
  recent.set(input.client, now)
  minuteWindow.count++

  const id = `${now}-${randomBytes(4).toString("hex")}`
  const data: Stored = {
    created_at: new Date(now).toISOString(),
    name: input.name,
    message: input.message,
    flower: input.flower,
  }
  if (input.rain.length) data.rain = input.rain
  if (input.pin && pinReady()) data.pin = pinHash(id, input.pin)
  await write(id, data)
  revalidateTag(TAG)
  return { error: undefined, entry: toEntry(id, data), rainToken: pinReady() ? rainToken(id) : undefined }
}

// 비밀번호 틀림 제한: 글 하나당 10분에 5번
const failures = new Map<string, { n: number; since: number }>()

type Check =
  | { ok: true; url: string; data: Stored }
  | { ok: false; error: "not_found" | "no_pin" | "wrong_pin" | "locked" }

async function readById(id: string) {
  try {
    const meta = await head(pathOf(id))
    const data = await readBlob(meta.url, Date.now(), "no-store")
    return data ? { url: meta.url, data } : null
  } catch {
    return null
  }
}

async function checkPin(id: string, pin: string): Promise<Check> {
  const f = failures.get(id)
  if (f && Date.now() - f.since < 10 * 60_000 && f.n >= 5) return { ok: false, error: "locked" }
  let meta
  try {
    meta = await head(pathOf(id))
  } catch {
    return { ok: false, error: "not_found" }
  }
  const data = await readBlob(meta.url, Date.now(), "no-store")
  if (!data) return { ok: false, error: "not_found" }
  if (!data.pin || !pinReady()) return { ok: false, error: "no_pin" }
  const a = Buffer.from(pinHash(id, pin), "hex")
  const b = Buffer.from(data.pin, "hex")
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    const cur = f && Date.now() - f.since < 10 * 60_000 ? f : { n: 0, since: Date.now() }
    failures.set(id, { n: cur.n + 1, since: cur.since })
    return { ok: false, error: "wrong_pin" }
  }
  failures.delete(id)
  return { ok: true, url: meta.url, data }
}

export async function updateEntry(id: string, pin: string, patch: { name: string; message: string }) {
  const c = await checkPin(id, pin)
  if (!c.ok) return { error: c.error }
  const data: Stored = { ...c.data, name: patch.name, message: patch.message, updated_at: new Date().toISOString() }
  await write(id, data)
  revalidateTag(TAG)
  return { error: undefined, entry: toEntry(id, data) }
}

export async function deleteEntry(id: string, pin: string) {
  const c = await checkPin(id, pin)
  if (!c.ok) return { error: c.error }
  await del(c.url)
  revalidateTag(TAG)
  return { error: undefined }
}

// 비 내리기: 글을 남긴 브라우저에만 주는 열쇠(rainToken)로 확인한다
export const rainToken = (id: string) =>
  createHmac("sha256", process.env.GUESTBOOK_SECRET!).update(`rain:${id}`).digest("hex").slice(0, 32)

export async function setRain(id: string, token: string, works: number[]) {
  if (!pinReady()) return { error: "not_ready" as const }
  const a = Buffer.from(rainToken(id))
  const b = Buffer.from(token)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return { error: "bad_token" as const }
  let meta
  try {
    meta = await head(pathOf(id))
  } catch {
    return { error: "not_found" as const }
  }
  const data = await readBlob(meta.url, Date.now(), "no-store")
  if (!data) return { error: "not_found" as const }
  const next: Stored = { ...data, rain: works }
  await write(id, next)
  revalidateTag(TAG)
  return { error: undefined, entry: toEntry(id, next) }
}

// 비밀번호로 이 기기에 비 내리기 권한 받기 (다른 폰에서도 가능)
export async function claimRain(id: string, pin: string) {
  const c = await checkPin(id, pin)
  if (!c.ok) return { error: c.error }
  return { error: undefined, rainToken: rainToken(id) }
}

// ---- 설정 (관리자 화면에서 바꾼다) ----
const SETTINGS_PATH = "config/settings.json"
const SETTINGS_TAG = "settings"

async function loadSettings(): Promise<Settings> {
  const base: Settings = { showBaseline: rainConfig.showBaseline }
  if (!guestbookReady()) return base
  try {
    const meta = await head(SETTINGS_PATH)
    const res = await fetch(`${meta.url}?v=${new Date(meta.uploadedAt).getTime()}`, { cache: "force-cache" })
    if (!res.ok) return base
    return { ...base, ...(await res.json()) }
  } catch {
    return base
  }
}

const cachedSettings = unstable_cache(loadSettings, ["settings-v1"], { tags: [SETTINGS_TAG], revalidate: 300 })
export const getSettings = () => cachedSettings()

export async function saveSettings(s: Settings) {
  await put(SETTINGS_PATH, JSON.stringify(s), {
    access: "public",
    contentType: "application/json; charset=utf-8",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  })
  revalidateTag(SETTINGS_TAG)
}

// ---- 관리자 작업 ----
export async function adminUpdate(
  id: string,
  patch: { name?: string; message?: string; flower?: string; hidden?: boolean; pin?: string | null; rain?: number[] },
) {
  const cur = await readById(id)
  if (!cur) return { error: "not_found" as const }
  const next: Stored = { ...cur.data }
  if (patch.name !== undefined) next.name = patch.name
  if (patch.message !== undefined) next.message = patch.message
  if (patch.flower !== undefined) next.flower = patch.flower
  if (patch.hidden !== undefined) next.hidden = patch.hidden
  if (patch.rain !== undefined) next.rain = patch.rain
  if (patch.pin === null) delete next.pin
  else if (typeof patch.pin === "string") next.pin = pinHash(id, patch.pin)
  await write(id, next)
  revalidateTag(TAG)
  return { error: undefined, entry: toEntry(id, next) }
}

export async function adminDelete(id: string) {
  const cur = await readById(id)
  if (!cur) return { error: "not_found" as const }
  await del(cur.url)
  revalidateTag(TAG)
  return { error: undefined }
}
