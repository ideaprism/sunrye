import { NextResponse } from "next/server"
import { isAdmin } from "@/lib/admin-auth"
import { getSettings, listAllForAdmin } from "@/lib/guestbook-server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "login" }, { status: 401 })
  const [entries, settings] = await Promise.all([listAllForAdmin(), getSettings()])
  return NextResponse.json({ entries, settings }, { headers: { "Cache-Control": "no-store" } })
}
