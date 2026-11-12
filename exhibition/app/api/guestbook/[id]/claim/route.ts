import { NextResponse } from "next/server"
import { claimRain } from "@/lib/guestbook-server"
import { ID_RE, PIN_RE } from "@/lib/guestbook-shared"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MSG = {
  not_found: "글을 찾을 수 없어요.",
  no_pin: "비밀번호 없이 남긴 글이에요.",
  wrong_pin: "비밀번호가 맞지 않아요. 다시 확인해 주세요.",
  locked: "비밀번호를 여러 번 틀렸어요. 10분 뒤에 다시 해 주세요.",
} as const

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const b = await req.json().catch(() => ({}))
  const pin = String(b.pin ?? "")
  if (!ID_RE.test(id) || !PIN_RE.test(pin)) return NextResponse.json({ error: "비밀번호 숫자 4자리를 적어 주세요." }, { status: 400 })
  const r = await claimRain(id, pin)
  if (r.error) return NextResponse.json({ error: MSG[r.error] }, { status: 403 })
  return NextResponse.json({ rainToken: r.rainToken })
}
