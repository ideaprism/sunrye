const galleryImagePattern = /^\/images\/([^/]+\.(?:jpe?g|png|webp))$/i

export function getGalleryThumbnailSrc(imagePath) {
  const source = String(imagePath || "").trim()
  const match = source.match(galleryImagePattern)

  if (!match) return source || "/placeholder.svg"

  return `/images/thumbs/${match[1]}`
}
