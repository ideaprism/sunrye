import { NextResponse } from "next/server"
import { flowerIds, rain, works } from "@/lib/content"
import { addEntry, clientHash, getSettings, guestbookReady, listEntries } from "@/lib/guestbook-server"
import { PIN_RE } from "@/lib/guestbook-shared"
import { strip } from "@/lib/text"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const [entries, settings] = await Promise.all([listEntries(), getSettings()])
    return NextResponse.json({ entries, settings, ready: guestbookReady() }, { headers: { "Cache-Control": "no-store" } })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "load_failed" }, { status: 502 })
  }
}

export async function POST(req: Request) {
  if (!guestbookReady()) {
    return NextResponse.json({ error: "방명록을 준비하고 있어요. 조금 뒤에 다시 와 주세요." }, { status: 503 })
  }
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 })
  }

  // honeypot: 사람은 비워 둔다. 채워져 있으면 저장하지 않고 성공처럼 응답
  if (typeof body.website === "string" && body.website.length > 0) {
    return NextResponse.json({ ok: true })
  }

  const name = strip(String(body.name ?? ""))
  const message = strip(String(body.message ?? "")).replace(/\n{3,}/g, "\n\n")
  const flower = String(body.flower ?? "")
  const pin = String(body.pin ?? "")
  const rainList = [...new Set((Array.isArray(body.rain) ? (body.rain as unknown[]) : []).map((x) => Number(x)))].filter(
    (n) => Number.isInteger(n) && n >= 1 && n <= works.length,
  )
  if (rainList.length > rain.max) return NextResponse.json({ error: `물은 ${rain.max}개 작품까지 주실 수 있어요.` }, { status: 400 })
  if (name.length < 1 || [...name].length > 20) return NextResponse.json({ error: "이름은 1~20자로 적어 주세요." }, { status: 400 })
  if (message.length < 1 || [...message].length > 200) return NextResponse.json({ error: "한마디는 1~200자로 적어 주세요." }, { status: 400 })
  if (pin && !PIN_RE.test(pin)) return NextResponse.json({ error: "비밀번호는 숫자 4자리로 적어 주세요." }, { status: 400 })
  if (!flowerIds.includes(flower)) return NextResponse.json({ error: "꽃을 골라 주세요." }, { status: 400 })

  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown"
  const ua = req.headers.get("user-agent") || ""

  try {
    const res = await addEntry({ name, message, flower, pin, rain: rainList, client: clientHash(ip, ua) })
    if (res.error) {
      const map = {
        rate_limited: "조금 전에 남겨 주셨어요. 30초 뒤에 다시 남겨 주세요.",
        busy: "지금 많은 분이 남기고 계세요. 잠시 후 다시 눌러 주세요.",
        invalid: "이름과 한마디를 확인해 주세요.",
      } as const
      return NextResponse.json({ error: map[res.error] }, { status: 429 })
    }
    return NextResponse.json({ entry: res.entry, rainToken: res.rainToken }, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "저장하지 못했어요. 잠시 후 다시 눌러 주세요." }, { status: 502 })
  }
}
