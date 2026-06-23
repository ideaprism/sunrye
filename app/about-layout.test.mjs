import { readFileSync } from "node:fs"
import test from "node:test"
import assert from "node:assert/strict"

test("about page keeps artist photo in a constrained portrait frame", () => {
  const source = readFileSync(new URL("./about/page.tsx", import.meta.url), "utf8")

  assert.match(source, /lg:grid-cols-\[minmax\(0,1fr\)_minmax\(280px,420px\)\]/)
  assert.match(source, /max-w-\[340px\].*lg:max-w-\[420px\]/s)
  assert.match(source, /aspect-\[3\/4\]/)
  assert.match(source, /fill/)
  assert.match(source, /object-cover/)
})
