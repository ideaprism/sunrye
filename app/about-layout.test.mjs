import { readFileSync } from "node:fs"
import test from "node:test"
import assert from "node:assert/strict"

test("about page keeps artist photo in a constrained portrait frame", () => {
  const source = readFileSync(new URL("./about/page.tsx", import.meta.url), "utf8")

  assert.match(source, /lg:grid-cols-\[minmax\(0,1fr\)_minmax\(220px,340px\)\]/)
  assert.match(source, /max-w-\[280px\].*lg:max-w-\[340px\]/s)
  assert.match(source, /aspect-\[9\/16\]/)
  assert.match(source, /fill/)
  assert.match(source, /object-contain/)
})

test("artist thumbnail is stored upright as a portrait image", () => {
  const image = readJpegSize(new URL("../public/images/thumbs/artist-photo.jpg", import.meta.url))

  assert.ok(image.height > image.width, `expected portrait thumbnail, got ${image.width}x${image.height}`)
})

function readJpegSize(url) {
  const buffer = readFileSync(url)
  let offset = 2

  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) break

    const marker = buffer[offset + 1]
    const length = buffer.readUInt16BE(offset + 2)
    if (marker >= 0xc0 && marker <= 0xc3) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7),
      }
    }
    offset += 2 + length
  }

  throw new Error("Could not read JPEG size")
}
