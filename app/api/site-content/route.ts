import { NextResponse } from "next/server"
import { getPublicSiteContent, readSiteContent } from "@/lib/site-content-store.mjs"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const content = await readSiteContent()
  return NextResponse.json(getPublicSiteContent(content))
}
