import { NextResponse } from "next/server"
import { adminReady, checkPassword, clearAdminCookie, setAdminCookie } from "@/lib/admin-auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

let fails = { n: 0, since: 0 }

export async function POST(req: Request) {
  if (!adminReady()) return NextResponse.json({ error: "관리자 비밀번호가 설정되지 않았어요." }, { status: 503 })
  if (Date.now() - fails.since > 15 * 60_000) fails = { n: 0, since: Date.now() }
  if (fails.n >= 10) return NextResponse.json({ error: "여러 번 틀렸어요. 15분 뒤에 다시 해 주세요." }, { status: 429 })
  const body = await req.json().catch(() => ({}))
  if (!checkPassword(String(body.password ?? ""))) {
    fails.n++
    return NextResponse.json({ error: "비밀번호가 맞지 않아요." }, { status: 401 })
  }
  await setAdminCookie()
  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  await clearAdminCookie()
  return NextResponse.json({ ok: true })
}
