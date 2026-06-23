import assert from "node:assert/strict"
import { existsSync } from "node:fs"
import test from "node:test"

import { artworks } from "./artworks-data.mjs"
import { getGalleryThumbnailSrc } from "./artwork-image-utils.mjs"

test("uses lightweight thumbnails for bundled gallery images", () => {
  assert.equal(getGalleryThumbnailSrc("/images/spring-path.jpg"), "/images/thumbs/spring-path.jpg")
  assert.equal(getGalleryThumbnailSrc("/images/rose-garden.png"), "/images/thumbs/rose-garden.png")
})

test("keeps uploaded, remote, and placeholder images unchanged", () => {
  assert.equal(getGalleryThumbnailSrc("/uploads/new-work.jpg"), "/uploads/new-work.jpg")
  assert.equal(getGalleryThumbnailSrc("https://example.com/work.jpg"), "https://example.com/work.jpg")
  assert.equal(getGalleryThumbnailSrc(""), "/placeholder.svg")
})

test("has generated thumbnails for every bundled artwork image", () => {
  for (const artwork of artworks) {
    const thumbnail = getGalleryThumbnailSrc(artwork.image)
    assert.ok(existsSync(`public${thumbnail}`), `${thumbnail} is missing`)
  }
})
