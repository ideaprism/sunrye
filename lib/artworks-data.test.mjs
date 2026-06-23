import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  artworks,
  getArtworkById,
  getArtworkShareMetadata,
  getRelatedArtworks,
} from "./artworks-data.mjs"

describe("artworks data", () => {
  it("exposes the complete gallery collection with stable ids", () => {
    assert.equal(artworks.length, 14)
    assert.equal(getArtworkById("1").title, "벚꽃 내린 오솔길의 꿈")
    assert.equal(getArtworkById("missing").id, 1)
  })

  it("builds artwork-specific share metadata", () => {
    const metadata = getArtworkShareMetadata("9", "https://gallery.example")

    assert.equal(metadata.title, "햇살을 품은 해바라기의 미소 | 김선례 작가")
    assert.equal(metadata.url, "https://gallery.example/gallery/9")
    assert.equal(metadata.image, "https://gallery.example/images/sunflower-window.jpg")
    assert.match(metadata.description, /해바라기/)
  })

  it("returns related artworks without including the current artwork", () => {
    const related = getRelatedArtworks("1", 3)

    assert.equal(related.length, 3)
    assert.equal(related.some((artwork) => artwork.id === 1), false)
  })
})
