import { NextResponse } from "next/server"
import { isAdmin } from "@/lib/admin-auth"
import { flowerIds, works } from "@/lib/content"
import { adminDelete, adminUpdate } from "@/lib/guestbook-server"
import { ID_RE, PIN_RE } from "@/lib/guestbook-shared"
import { cleanMessage, strip } from "@/lib/text"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const bad = (m: string) => NextResponse.json({ error: m }, { status: 400 })

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "login" }, { status: 401 })
  const { id } = await ctx.params
  if (!ID_RE.test(id)) return bad("잘못된 글 번호예요.")
  const b = await req.json().catch(() => ({}))
  const patch: Parameters<typeof adminUpdate>[1] = {}
  if (b.name !== undefined) {
    const v = strip(String(b.name))
    if (v.length < 1 || [...v].length > 20) return bad("이름은 1~20자")
    patch.name = v
  }
  if (b.message !== undefined) {
    const v = cleanMessage(String(b.message))
    if (v.length < 1 || [...v].length > 200) return bad("한마디는 1~200자")
    patch.message = v
  }
  if (b.flower !== undefined) {
    if (!flowerIds.includes(String(b.flower))) return bad("꽃 종류가 잘못됐어요.")
    patch.flower = String(b.flower)
  }
  if (b.hidden !== undefined) patch.hidden = Boolean(b.hidden)
  if (b.pin !== undefined) {
    if (b.pin === null || b.pin === "") patch.pin = null
    else if (PIN_RE.test(String(b.pin))) patch.pin = String(b.pin)
    else return bad("비밀번호는 숫자 4자리")
  }
  if (b.rain !== undefined) {
    const nums = [...new Set((Array.isArray(b.rain) ? (b.rain as unknown[]) : []).map((x) => Number(x)))].filter(
      (n: number) => Number.isInteger(n) && n >= 1 && n <= works.length,
    )
    if (nums.length > 3) return bad("물주기는 최대 3개")
    patch.rain = nums
  }
  const r = await adminUpdate(id, patch)
  if (r.error) return NextResponse.json({ error: "글을 찾을 수 없어요." }, { status: 404 })
  return NextResponse.json({ entry: r.entry })
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "login" }, { status: 401 })
  const { id } = await ctx.params
  if (!ID_RE.test(id)) return bad("잘못된 글 번호예요.")
  const r = await adminDelete(id)
  if (r.error) return NextResponse.json({ error: "글을 찾을 수 없어요." }, { status: 404 })
  return NextResponse.json({ ok: true })
}
