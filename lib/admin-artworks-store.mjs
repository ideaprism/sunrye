import { existsSync } from "node:fs"
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises"
import path from "node:path"
import { artworks as seedArtworks } from "./artworks-data.mjs"

const projectRoot = process.cwd()
const dataDir = path.join(projectRoot, "data")
const dataFile = path.join(dataDir, "artworks.json")
const uploadDir = path.join(projectRoot, "public", "uploads")

export const artworkCategories = [
  { value: "landscape", label: "풍경화" },
  { value: "flower", label: "꽃" },
  { value: "fruit", label: "과일" },
]

export function getNextArtworkId(artworks) {
  return artworks.reduce((maxId, artwork) => Math.max(maxId, Number(artwork.id) || 0), 0) + 1
}

export function normalizeArtworkInput(input = {}, fallback = {}) {
  const title = String(input.title ?? fallback.title ?? "").trim()
  const description = String(input.description ?? fallback.description ?? "").trim()
  const summary = String(input.summary ?? fallback.summary ?? "").trim() || description
  const category = String(input.category ?? fallback.category ?? "flower").trim()
  const year = String(input.year ?? fallback.year ?? new Date().getFullYear()).trim()
  const medium = String(input.medium ?? fallback.medium ?? "수채화").trim() || "수채화"
  const size = String(input.size ?? fallback.size ?? "크기 미정").trim() || "크기 미정"
  const inspiration = String(input.inspiration ?? fallback.inspiration ?? "").trim()
  const price = String(input.price ?? fallback.price ?? "문의").trim() || "문의"
  const technique = String(input.technique ?? fallback.technique ?? "종이에 수채화").trim() || "종이에 수채화"
  const status = input.status === "draft" ? "draft" : "published"

  return {
    title,
    description,
    summary,
    category: artworkCategories.some((item) => item.value === category) ? category : "flower",
    year,
    medium,
    size,
    inspiration,
    price,
    technique,
    status,
  }
}

export function createArtworkRecord(input, artworks, imagePath = "/placeholder.svg") {
  const normalized = normalizeArtworkInput(input)
  const now = new Date().toISOString()

  return {
    id: getNextArtworkId(artworks),
    ...normalized,
    image: imagePath,
    createdAt: now,
    updatedAt: now,
  }
}

export function updateArtworkRecord(artworks, id, patch, imagePath) {
  const artworkId = Number(id)
  const now = new Date().toISOString()

  return artworks.map((artwork) => {
    if (Number(artwork.id) !== artworkId) return artwork

    return {
      ...artwork,
      ...normalizeArtworkInput(patch, artwork),
      image: imagePath || artwork.image,
      updatedAt: now,
    }
  })
}

export function deleteArtworkRecord(artworks, id) {
  const artworkId = Number(id)
  return artworks.filter((artwork) => Number(artwork.id) !== artworkId)
}

export function getSeedAdminArtworks() {
  const now = new Date().toISOString()
  return seedArtworks.map((artwork) => ({
    ...artwork,
    price: artwork.price || "문의",
    technique: artwork.technique || "종이에 수채화",
    status: "published",
    createdAt: artwork.createdAt || now,
    updatedAt: artwork.updatedAt || now,
  }))
}

export async function readAdminArtworks() {
  if (!existsSync(dataFile)) {
    return getSeedAdminArtworks()
  }

  const raw = await readFile(dataFile, "utf8")
  const parsed = JSON.parse(raw)
  return Array.isArray(parsed) ? parsed : getSeedAdminArtworks()
}

export async function writeAdminArtworks(artworks) {
  await mkdir(dataDir, { recursive: true })
  await writeFile(dataFile, `${JSON.stringify(artworks, null, 2)}\n`, "utf8")
  return artworks
}

export async function saveArtworkImage(file) {
  if (!file || typeof file.arrayBuffer !== "function" || file.size === 0) {
    return ""
  }

  await mkdir(uploadDir, { recursive: true })
  const extension = getImageExtension(file.name, file.type)
  const filename = `${Date.now()}-${crypto.randomUUID()}${extension}`
  const target = path.join(uploadDir, filename)
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(target, buffer)
  return `/uploads/${filename}`
}

export async function removeUploadedImage(imagePath) {
  if (!imagePath || !String(imagePath).startsWith("/uploads/")) return
  const target = path.join(projectRoot, "public", imagePath)
  const resolved = path.resolve(target)
  const safeRoot = path.resolve(uploadDir)

  if (!resolved.startsWith(safeRoot)) return

  try {
    await unlink(resolved)
  } catch {
    // The record can still be deleted if the image file is already gone.
  }
}

function getImageExtension(name = "", type = "") {
  const extension = path.extname(name).toLowerCase()
  if ([".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(extension)) return extension
  if (type === "image/png") return ".png"
  if (type === "image/webp") return ".webp"
  if (type === "image/gif") return ".gif"
  return ".jpg"
}
