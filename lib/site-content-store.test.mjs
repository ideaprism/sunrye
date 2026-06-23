import test from "node:test"
import assert from "node:assert/strict"
import {
  createNewsRecord,
  deleteNewsRecord,
  getDefaultSiteContent,
  getNextNewsId,
  normalizeAboutInput,
  normalizeNewsInput,
  updateNewsRecord,
} from "./site-content-store.mjs"

test("site content helpers", async (t) => {
  await t.test("provides editable default about and news content", () => {
    const content = getDefaultSiteContent()

    assert.equal(content.about.artistName, "김선례 작가")
    assert.ok(content.about.history.length > 0)
    assert.ok(content.news.length > 0)
    assert.equal(content.news.every((item) => item.status === "published"), true)
  })

  await t.test("normalizes about input and history lines", () => {
    const about = normalizeAboutInput({
      artistName: "  김선례  ",
      subtitle: "",
      intro: "꽃을 그리는 작가",
      philosophy: "자연의 아름다움",
      familyIntro: "가족 소개",
      historyText: "2024 전시\n\n2025 수상",
    })

    assert.equal(about.artistName, "김선례")
    assert.equal(about.subtitle, "꽃을 그리는 작가")
    assert.deepEqual(about.history, ["2024 전시", "2025 수상"])
  })

  await t.test("creates, updates, and deletes news records", () => {
    const existing = [{ id: 4, title: "기존 소식", status: "published" }]

    const created = createNewsRecord(
      {
        title: "새 전시",
        date: "2026.06.23",
        type: "전시",
        content: "새 전시 안내",
        status: "draft",
      },
      existing,
      "/uploads/news.png",
    )

    assert.equal(getNextNewsId(existing), 5)
    assert.equal(created.id, 5)
    assert.equal(created.image, "/uploads/news.png")
    assert.equal(created.status, "draft")

    const updated = updateNewsRecord([created], 5, { title: "수정된 전시", status: "published" })
    assert.equal(updated[0].title, "수정된 전시")
    assert.equal(updated[0].status, "published")

    const deleted = deleteNewsRecord(updated, 5)
    assert.deepEqual(deleted, [])
  })

  await t.test("normalizes news defaults for public rendering", () => {
    const news = normalizeNewsInput({ title: "  공지  ", content: "본문" })

    assert.equal(news.title, "공지")
    assert.equal(news.type, "공지")
    assert.equal(news.status, "published")
    assert.equal(news.image, "/placeholder.svg")
  })
})
