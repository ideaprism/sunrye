import { readFileSync } from "node:fs"
import test from "node:test"
import assert from "node:assert/strict"

const sourceFiles = {
  home: "app/page.tsx",
  news: "app/news/page.tsx",
  gallery: "components/gallery-content.tsx",
  artworkDetail: "app/gallery/[id]/page.tsx",
  artworkZoom: "components/artwork-zoom.tsx",
  about: "app/about/page.tsx",
  family: "app/family/page.tsx",
}

test("public summary pages route repeated bundled images through thumbnails", () => {
  const home = readFileSync(sourceFiles.home, "utf8")
  const news = readFileSync(sourceFiles.news, "utf8")
  const gallery = readFileSync(sourceFiles.gallery, "utf8")
  const artworkDetail = readFileSync(sourceFiles.artworkDetail, "utf8")
  const artworkZoom = readFileSync(sourceFiles.artworkZoom, "utf8")
  const about = readFileSync(sourceFiles.about, "utf8")
  const family = readFileSync(sourceFiles.family, "utf8")

  assert.match(home, /getGalleryThumbnailSrc\("\/images\/rose-garden\.jpg"\)/)
  assert.match(home, /getGalleryThumbnailSrc\(artwork\.image\)/)
  assert.match(home, /getGalleryThumbnailSrc\("\/images\/artist-photo\.jpg"\)/)
  assert.match(news, /getGalleryThumbnailSrc\(item\.image\)/)
  assert.match(gallery, /getGalleryThumbnailSrc\(artwork\.image\)/)
  assert.match(artworkDetail, /getGalleryThumbnailSrc\(related\.image\)/)
  assert.match(artworkZoom, /getGalleryThumbnailSrc\(src\)/)
  assert.doesNotMatch(artworkZoom, /src=\{src \|\| "\/placeholder\.svg"\}/)
  assert.match(about, /getGalleryThumbnailSrc\("\/images\/artist-photo\.jpg"\)/)
  assert.match(family, /getGalleryThumbnailSrc\("\/images\/artist-photo\.jpg"\)/)
  assert.doesNotMatch(family, /https:\/\/sjc\.microlink\.io/)
})
