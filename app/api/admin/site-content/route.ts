import { NextResponse } from "next/server"
import { normalizeAboutInput, readSiteContent, writeSiteContent } from "@/lib/site-content-store.mjs"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const content = await readSiteContent()
  return NextResponse.json(content)
}

export async function PATCH(request: Request) {
  const body = await request.json()
  const current = await readSiteContent()
  const content = {
    ...current,
    about: normalizeAboutInput(body.about, current.about),
  }

  await writeSiteContent(content)
  return NextResponse.json(content)
}
