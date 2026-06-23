import { NextResponse } from "next/server"
import {
  createArtworkRecord,
  readAdminArtworks,
  saveArtworkImage,
  writeAdminArtworks,
} from "@/lib/admin-artworks-store.mjs"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const artworks = await readAdminArtworks()
  return NextResponse.json({ artworks })
}

export async function POST(request: Request) {
  const formData = await request.formData()
  const current = await readAdminArtworks()
  const imagePath = await saveArtworkImage(formData.get("image"))
  const artwork = createArtworkRecord(formDataToObject(formData), current, imagePath || "/placeholder.svg")
  const artworks = [...current, artwork]
  await writeAdminArtworks(artworks)

  return NextResponse.json({ artwork, artworks }, { status: 201 })
}

function formDataToObject(formData: FormData) {
  return Object.fromEntries(
    Array.from(formData.entries()).filter(([key, value]) => key !== "image" && typeof value === "string"),
  )
}
