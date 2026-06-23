import test from "node:test"
import assert from "node:assert/strict"
import {
  createArtworkRecord,
  updateArtworkRecord,
  deleteArtworkRecord,
  getNextArtworkId,
  normalizeArtworkInput,
} from "./admin-artworks-store.mjs"

test("admin artwork helpers", async (t) => {
  await t.test("creates stable ids after the largest existing artwork id", () => {
    assert.equal(getNextArtworkId([]), 1)
    assert.equal(getNextArtworkId([{ id: 1 }, { id: 9 }, { id: 3 }]), 10)
  })

  await t.test("normalizes artwork input for public gallery use", () => {
    const artwork = normalizeArtworkInput({
      title: "  새 봄의 정원  ",
      summary: "",
      description: "분홍 꽃이 흐르는 봄 정원",
      category: "flower",
      year: "2026",
      medium: "",
      size: "",
      status: "published",
    })

    assert.equal(artwork.title, "새 봄의 정원")
    assert.equal(artwork.summary, "분홍 꽃이 흐르는 봄 정원")
    assert.equal(artwork.medium, "수채화")
    assert.equal(artwork.size, "크기 미정")
    assert.equal(artwork.status, "published")
  })

  await t.test("creates, updates, and deletes artwork records without mutating the original list", () => {
    const existing = [
      {
        id: 2,
        title: "기존 작품",
        image: "/images/spring-path.jpg",
        category: "landscape",
        year: "2024",
        medium: "수채화",
        size: "60x80cm",
        status: "published",
        description: "기존 설명",
        summary: "기존 요약",
        inspiration: "",
      },
    ]

    const created = createArtworkRecord(
      {
        title: "새 작품",
        description: "새 설명",
        category: "flower",
      },
      existing,
      "/uploads/new-artwork.jpg",
    )

    assert.equal(created.id, 3)
    assert.equal(created.image, "/uploads/new-artwork.jpg")
    assert.equal(existing.length, 1)

    const updated = updateArtworkRecord(existing, 2, { title: "수정된 작품", status: "draft" })
    assert.equal(updated[0].title, "수정된 작품")
    assert.equal(updated[0].status, "draft")
    assert.equal(existing[0].title, "기존 작품")

    const deleted = deleteArtworkRecord(updated, 2)
    assert.deepEqual(deleted, [])
  })
})
