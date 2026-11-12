import { NextResponse } from "next/server"
import { isAdmin } from "@/lib/admin-auth"
import { getSettings, saveSettings } from "@/lib/guestbook-server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function PUT(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "login" }, { status: 401 })
  const b = await req.json().catch(() => ({}))
  const cur = await getSettings()
  const next = { ...cur, showBaseline: b.showBaseline === undefined ? cur.showBaseline : Boolean(b.showBaseline) }
  await saveSettings(next)
  return NextResponse.json({ settings: next })
}
