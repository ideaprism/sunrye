import { NextResponse } from "next/server"
import { removeUploadedImage, saveArtworkImage } from "@/lib/admin-artworks-store.mjs"
import { deleteNewsRecord, readSiteContent, updateNewsRecord, writeSiteContent } from "@/lib/site-content-store.mjs"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface RouteContext {
  params: Promise<{
    id: string
  }>
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params
  const formData = await request.formData()
  const current = await readSiteContent()
  const existing = current.news.find((item) => String(item.id) === String(id))

  if (!existing) {
    return NextResponse.json({ error: "소식을 찾을 수 없습니다." }, { status: 404 })
  }

  const imagePath = await saveArtworkImage(formData.get("image"))
  if (imagePath) {
    await removeUploadedImage(existing.image)
  }

  const content = {
    ...current,
    news: updateNewsRecord(current.news, Number(id), formDataToObject(formData), imagePath),
  }

  await writeSiteContent(content)

  return NextResponse.json({
    newsItem: content.news.find((item) => String(item.id) === String(id)),
    content,
  })
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params
  const current = await readSiteContent()
  const existing = current.news.find((item) => String(item.id) === String(id))

  if (!existing) {
    return NextResponse.json({ error: "소식을 찾을 수 없습니다." }, { status: 404 })
  }

  await removeUploadedImage(existing.image)
  const content = {
    ...current,
    news: deleteNewsRecord(current.news, Number(id)),
  }

  await writeSiteContent(content)
  return NextResponse.json({ content })
}

function formDataToObject(formData: FormData) {
  return Object.fromEntries(
    Array.from(formData.entries()).filter(([key, value]) => key !== "image" && typeof value === "string"),
  )
}
