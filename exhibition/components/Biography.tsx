"use client"

import { useState } from "react"

export default function Biography({ groups }: { groups: { title: string; items: [string, string][] }[] }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" className="btn" aria-expanded={open} aria-controls="cv-all" onClick={() => setOpen(!open)}>
        {open ? "약력 접기" : "약력 전체 보기"}
      </button>
      <div id="cv-all" hidden={!open} style={{ display: open ? "flex" : "none", flexDirection: "column", gap: 24 }}>
        {groups.map((g) => (
          <div key={g.title} className="cv-group">
            <h3>{g.title}</h3>
            <div className="yr" style={{ fontSize: 17 }}>
              {g.items.map(([y, t], i) => (
                <div key={i} style={{ display: "contents" }}>
                  <span className="y">{y}</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        <span className="note" style={{ fontSize: 15 }}>출처: 전시 브로셔</span>
      </div>
    </>
  )
}
