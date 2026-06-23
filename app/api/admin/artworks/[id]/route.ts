import { NextResponse } from "next/server"
import {
  deleteArtworkRecord,
  readAdminArtworks,
  removeUploadedImage,
  saveArtworkImage,
  updateArtworkRecord,
  writeAdminArtworks,
} from "@/lib/admin-artworks-store.mjs"

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
  const current = await readAdminArtworks()
  const existing = current.find((artwork) => String(artwork.id) === String(id))

  if (!existing) {
    return NextResponse.json({ error: "작품을 찾을 수 없습니다." }, { status: 404 })
  }

  const imagePath = await saveArtworkImage(formData.get("image"))
  if (imagePath) {
    await removeUploadedImage(existing.image)
  }

  const artworks = updateArtworkRecord(current, Number(id), formDataToObject(formData), imagePath)
  await writeAdminArtworks(artworks)

  return NextResponse.json({
    artwork: artworks.find((artwork) => String(artwork.id) === String(id)),
    artworks,
  })
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params
  const current = await readAdminArtworks()
  const existing = current.find((artwork) => String(artwork.id) === String(id))

  if (!existing) {
    return NextResponse.json({ error: "작품을 찾을 수 없습니다." }, { status: 404 })
  }

  await removeUploadedImage(existing.image)
  const artworks = deleteArtworkRecord(current, Number(id))
  await writeAdminArtworks(artworks)

  return NextResponse.json({ artworks })
}

function formDataToObject(formData: FormData) {
  return Object.fromEntries(
    Array.from(formData.entries()).filter(([key, value]) => key !== "image" && typeof value === "string"),
  )
}
