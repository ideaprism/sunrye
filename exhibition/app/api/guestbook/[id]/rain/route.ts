import { NextResponse } from "next/server"
import { rain, works } from "@/lib/content"
import { setRain } from "@/lib/guestbook-server"
import { ID_RE } from "@/lib/guestbook-shared"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  let body: Record<string, unknown> = {}
  try {
    body = await req.json()
  } catch {}
  const token = String(body.token ?? "")
  const list = Array.isArray(body.works) ? body.works : []
  const nums = [...new Set(list.map(Number))].filter((n) => Number.isInteger(n) && n >= 1 && n <= works.length)
  if (!ID_RE.test(id) || !/^[0-9a-f]{32}$/.test(token)) {
    return NextResponse.json({ error: "방명록에 글을 남기신 뒤에 꽃에 물을 주실 수 있어요." }, { status: 403 })
  }
  if (nums.length > rain.max) {
    return NextResponse.json({ error: `물은 ${rain.max}개 작품까지 주실 수 있어요.` }, { status: 400 })
  }
  try {
    const r = await setRain(id, token, nums)
    if (r.error === "not_found") return NextResponse.json({ error: "남기신 글을 찾을 수 없어요. 글을 다시 남겨 주세요." }, { status: 404 })
    if (r.error) return NextResponse.json({ error: "방명록에 글을 남기신 뒤에 꽃에 물을 주실 수 있어요." }, { status: 403 })
    return NextResponse.json({ entry: r.entry })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "물을 주지 못했어요. 잠시 후 다시 눌러 주세요." }, { status: 502 })
  }
}
