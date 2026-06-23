import { NextResponse } from "next/server"
import { readAdminArtworks } from "@/lib/admin-artworks-store.mjs"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const artworks = await readAdminArtworks()
  return NextResponse.json({
    artworks: artworks.filter((artwork) => artwork.status !== "draft"),
  })
}
