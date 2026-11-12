import "server-only"
import { createHash, randomBytes } from "node:crypto"
import { list, put } from "@vercel/blob"
import { revalidateTag, unstable_cache } from "next/cache"
import type { Entry } from "./guestbook-shared"

// 방명록 글 1건 = Vercel Blob 파일 1개 (guestbook/<시각>-<무작위>.json)
// 글 숨기기: Vercel 대시보드 > Storage > kimsunrye-guestbook 에서 해당 파일 삭제
const PREFIX = "guestbook/"
const TAG = "guestbook"

export const guestbookReady = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN)

async function loadAll(): Promise<Entry[]> {
  if (!guestbookReady()) return []
  const blobs: { url: string; pathname: string }[] = []
  let cursor: string | undefined
  do {
    const r = await list({ prefix: PREFIX, limit: 1000, cursor })
    blobs.push(...r.blobs)
    cursor = r.hasMore ? r.cursor : undefined
  } while (cursor)

  const rows = await Promise.all(
    blobs.map(async (b) => {
      try {
        // 파일 내용은 바뀌지 않으므로 캐시해도 된다
        const res = await fetch(b.url, { cache: "force-cache" })
        if (!res.ok) return null
        const d = await res.json()
        return {
          id: b.pathname.slice(PREFIX.length).replace(/\.json$/, ""),
          created_at: String(d.created_at),
          name: String(d.name),
          message: String(d.message),
          flower: String(d.flower),
        } as Entry
      } catch {
        return null
      }
    }),
  )
  return rows.filter((x): x is Entry => x !== null).sort((a, b) => b.created_at.localeCompare(a.created_at))
}

// 목록 조회 횟수를 줄이기 위해 60초 캐시. 새 글이 올라오면 즉시 갱신
const cachedAll = unstable_cache(loadAll, ["guestbook-all-v1"], { tags: [TAG], revalidate: 60 })

export async function listEntries(): Promise<Entry[]> {
  return cachedAll()
}

export function clientHash(ip: string, ua: string) {
  return createHash("sha256").update(`${ip}|${ua}`).digest("hex").slice(0, 32)
}

// 같은 사람이 30초 안에 다시 올리는 것을 막는다 (서버 인스턴스 메모리 기준)
const recent = new Map<string, number>()
let minuteWindow = { start: 0, count: 0 }

export async function addEntry(input: { name: string; message: string; flower: string; client: string }) {
  const now = Date.now()
  for (const [k, t] of recent) if (now - t > 30_000) recent.delete(k)
  if (recent.has(input.client)) return { error: "rate_limited" as const }
  if (now - minuteWindow.start > 60_000) minuteWindow = { start: now, count: 0 }
  if (minuteWindow.count >= 30) return { error: "busy" as const }
  recent.set(input.client, now)
  minuteWindow.count++

  const created_at = new Date(now).toISOString()
  const id = `${now}-${randomBytes(4).toString("hex")}`
  await put(
    `${PREFIX}${id}.json`,
    JSON.stringify({ created_at, name: input.name, message: input.message, flower: input.flower }),
    { access: "public", contentType: "application/json; charset=utf-8", addRandomSuffix: false, cacheControlMaxAge: 31536000 },
  )
  revalidateTag(TAG)
  const entry: Entry = { id, created_at, name: input.name, message: input.message, flower: input.flower }
  return { error: undefined, entry }
}
