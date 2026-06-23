import { readFileSync } from "node:fs"
import test from "node:test"
import assert from "node:assert/strict"

test("root layout does not execute storage cleanup before hydration", () => {
  const source = readFileSync(new URL("./layout.tsx", import.meta.url), "utf8")

  assert.equal(source.includes("dangerouslySetInnerHTML"), false)
  assert.equal(source.includes("localStorage"), false)
  assert.equal(source.includes("sessionStorage"), false)
})
