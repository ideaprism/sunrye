import { NextResponse } from "next/server"
import { saveArtworkImage } from "@/lib/admin-artworks-store.mjs"
import { createNewsRecord, readSiteContent, writeSiteContent } from "@/lib/site-content-store.mjs"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const formData = await request.formData()
  const current = await readSiteContent()
  const imagePath = await saveArtworkImage(formData.get("image"))
  const newsItem = createNewsRecord(formDataToObject(formData), current.news, imagePath)
  const content = {
    ...current,
    news: [newsItem, ...current.news],
  }

  await writeSiteContent(content)
  return NextResponse.json({ newsItem, content }, { status: 201 })
}

function formDataToObject(formData: FormData) {
  return Object.fromEntries(
    Array.from(formData.entries()).filter(([key, value]) => key !== "image" && typeof value === "string"),
  )
}
