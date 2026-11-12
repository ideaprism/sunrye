import "server-only"
import { createHash } from "node:crypto"
import type { Entry } from "./guestbook-shared"

const URL_ = process.env.SUPABASE_URL
const KEY = process.env.SUPABASE_ANON_KEY

export const guestbookReady = () => Boolean(URL_ && KEY)

const headers = () => ({
  apikey: KEY!,
  Authorization: `Bearer ${KEY}`,
  "Content-Type": "application/json",
})

export async function listEntries(limit = 1000): Promise<Entry[]> {
  if (!guestbookReady()) return []
  const q = new URLSearchParams({
    select: "id,created_at,name,message,flower",
    order: "created_at.desc",
    limit: String(limit),
  })
  const r = await fetch(`${URL_}/rest/v1/guestbook?${q}`, { headers: headers(), cache: "no-store" })
  if (!r.ok) throw new Error(`guestbook list ${r.status}`)
  return r.json()
}

export function clientHash(ip: string, ua: string) {
  return createHash("sha256")
    .update(`${ip}|${ua}|${process.env.GUESTBOOK_SALT || "sunrye-2026"}`)
    .digest("hex")
    .slice(0, 32)
}

export async function addEntry(input: { name: string; message: string; flower: string; client: string }) {
  const r = await fetch(`${URL_}/rest/v1/rpc/add_guestbook_entry`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      p_name: input.name,
      p_message: input.message,
      p_flower: input.flower,
      p_client: input.client,
    }),
    cache: "no-store",
  })
  const text = await r.text()
  if (!r.ok) {
    if (text.includes("rate_limited")) return { error: "rate_limited" as const }
    if (text.includes("busy")) return { error: "busy" as const }
    if (text.includes("invalid")) return { error: "invalid" as const }
    throw new Error(`guestbook add ${r.status} ${text.slice(0, 200)}`)
  }
  const row = JSON.parse(text)
  return { error: undefined, entry: (Array.isArray(row) ? row[0] : row) as Entry }
}
