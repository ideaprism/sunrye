import { NextResponse } from "next/server"
import { deleteEntry, guestbookReady, rainToken, updateEntry } from "@/lib/guestbook-server"
import { ID_RE, PIN_RE } from "@/lib/guestbook-shared"
import { cleanMessage, strip } from "@/lib/text"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const ERR = {
  not_found: ["이미 지워졌거나 찾을 수 없는 글이에요.", 404],
  no_pin: ["비밀번호 없이 남긴 글이라 고치거나 지울 수 없어요.", 403],
  wrong_pin: ["비밀번호가 맞지 않아요. 다시 확인해 주세요.", 403],
  locked: ["비밀번호를 여러 번 틀렸어요. 10분 뒤에 다시 해 주세요.", 429],
} as const

const fail = (code: keyof typeof ERR) => NextResponse.json({ error: ERR[code][0] }, { status: ERR[code][1] })

async function parse(req: Request, params: Promise<{ id: string }>) {
  const { id } = await params
  let body: Record<string, unknown> = {}
  try {
    body = await req.json()
  } catch {}
  const pin = String(body.pin ?? "")
  if (!guestbookReady()) return { res: NextResponse.json({ error: "방명록을 준비하고 있어요." }, { status: 503 }) }
  if (!ID_RE.test(id)) return { res: fail("not_found") }
  if (!PIN_RE.test(pin)) return { res: NextResponse.json({ error: "비밀번호 숫자 4자리를 적어 주세요." }, { status: 400 }) }
  return { id, pin, body }
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const p = await parse(req, ctx.params)
  if ("res" in p) return p.res
  const name = strip(String(p.body.name ?? ""))
  const message = cleanMessage(String(p.body.message ?? ""))
  if (name.length < 1 || [...name].length > 20) return NextResponse.json({ error: "이름은 1~20자로 적어 주세요." }, { status: 400 })
  if (message.length < 1 || [...message].length > 200) return NextResponse.json({ error: "한마디는 1~200자로 적어 주세요." }, { status: 400 })
  try {
    const r = await updateEntry(p.id, p.pin, { name, message })
    if (r.error) return fail(r.error)
    return NextResponse.json({ entry: r.entry, rainToken: rainToken(p.id) })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "고치지 못했어요. 잠시 후 다시 눌러 주세요." }, { status: 502 })
  }
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const p = await parse(req, ctx.params)
  if ("res" in p) return p.res
  try {
    const r = await deleteEntry(p.id, p.pin)
    if (r.error) return fail(r.error)
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "지우지 못했어요. 잠시 후 다시 눌러 주세요." }, { status: 502 })
  }
}
