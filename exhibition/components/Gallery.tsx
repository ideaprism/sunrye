"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { works, workAlt, workSrc, workThumb } from "@/lib/content"
import ZoomImage from "./ZoomImage"
import RainButton, { RainBadge } from "./RainButton"
import RainIcon from "./RainIcon"
import { rain } from "@/lib/content"

const hashFor = (i: number) => `#work-${i + 1}`
const parseHash = () => {
  const m = /^#work-(\d+)$/.exec(window.location.hash)
  if (!m) return null
  const i = Number(m[1]) - 1
  return i >= 0 && i < works.length ? i : null
}

export default function Gallery() {
  const [idx, setIdx] = useState<number | null>(null)
  const pushed = useRef(false)
  const lastOpened = useRef<number | null>(null)
  const viewerRef = useRef<HTMLDivElement>(null)

  // 주소의 #work-N 과 화면을 맞춘다 (휴대폰 '뒤로 가기' = 닫기)
  useEffect(() => {
    const initial = parseHash()
    if (initial !== null) setIdx(initial)
    const onPop = () => {
      const i = parseHash()
      if (i === null) pushed.current = false
      setIdx(i)
    }
    window.addEventListener("popstate", onPop)
    return () => window.removeEventListener("popstate", onPop)
  }, [])

  // 열려 있는 동안 뒤쪽 페이지 스크롤 막기
  useEffect(() => {
    if (idx === null) {
      document.body.style.overflow = ""
      if (lastOpened.current !== null) {
        document.getElementById(`work-card-${lastOpened.current}`)?.focus({ preventScroll: false })
      }
      return
    }
    lastOpened.current = idx
    document.body.style.overflow = "hidden"
    viewerRef.current?.scrollTo({ top: 0 })
    // 앞뒤 작품 미리 받아 두기
    ;[idx - 1, idx + 1].forEach((j) => {
      if (j >= 0 && j < works.length) {
        const im = new Image()
        im.src = workSrc(works[j])
      }
    })
  }, [idx])

  const open = (i: number) => {
    window.history.pushState({ work: i }, "", hashFor(i))
    pushed.current = true
    setIdx(i)
  }

  const go = useCallback((i: number) => {
    const n = (i + works.length) % works.length
    window.history.replaceState({ work: n }, "", hashFor(n))
    setIdx(n)
  }, [])

  const close = useCallback(() => {
    if (pushed.current) {
      window.history.back()
    } else {
      window.history.replaceState(null, "", window.location.pathname + window.location.search)
      setIdx(null)
    }
  }, [])

  const goGuestbook = useCallback(() => {
    close()
    setTimeout(() => document.getElementById("guestbook")?.scrollIntoView({ behavior: "smooth" }), 150)
  }, [close])

  useEffect(() => {
    if (idx === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
      if (e.key === "ArrowRight") go(idx + 1)
      if (e.key === "ArrowLeft") go(idx - 1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [idx, go, close])

  const cur = idx !== null ? works[idx] : null

  return (
    <section className="section" id="works" aria-labelledby="works-h">
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span className="eyebrow">출품작</span>
        <h2 id="works-h" className="h2">
          작품 {works.length}점
        </h2>
        <span className="note">작품을 누르면 크게 볼 수 있어요</span>
        <span className="rain-guide">
          <RainIcon /> {rain.guide}
        </span>
      </div>
      <div className="grid">
        {works.map((w, i) => (
          <button
            key={w.file}
            id={`work-card-${i}`}
            type="button"
            className="work-btn"
            aria-label={`${w.title} 크게 보기`}
            onClick={() => open(i)}
          >
            <img src={workThumb(w)} alt={workAlt(w)} width={w.w} height={w.h} loading="lazy" decoding="async" />
            <span className="t">
              {w.title} <RainBadge no={w.no} />
            </span>
            <span className="m">
              {w.year} · {w.medium}
            </span>
          </button>
        ))}
      </div>

      {cur && idx !== null && (
        <div className="viewer" role="dialog" aria-modal="true" aria-labelledby="viewer-title" ref={viewerRef}>
          <div className="viewer-inner">
            <button type="button" className="back" onClick={close} autoFocus>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              작품 목록
            </button>
            <ZoomImage
              key={cur.file}
              src={workSrc(cur)}
              alt={workAlt(cur)}
              width={cur.w}
              height={cur.h}
              onSwipeLeft={() => go(idx + 1)}
              onSwipeRight={() => go(idx - 1)}
            />
            <span className="zoom-hint">두 손가락으로 벌리면 확대됩니다</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span className="counter">
                {idx + 1} / {works.length}
              </span>
              <h2 id="viewer-title" className="vtitle">
                {cur.title} <RainBadge no={cur.no} big />
              </h2>
            </div>
            <dl className="kv" style={{ rowGap: 12 }}>
              <dt>제작</dt>
              <dd>{cur.year}</dd>
              <dt>재료</dt>
              <dd>{cur.medium}</dd>
              <dt>크기</dt>
              <dd>{cur.size}</dd>
            </dl>
            <RainButton no={cur.no} onGoGuestbook={goGuestbook} />
            <div className="btn-row">
              <button type="button" className="btn" onClick={() => go(idx - 1)}>
                이전 작품
              </button>
              <button type="button" className="btn solid" onClick={() => go(idx + 1)}>
                다음 작품
              </button>
            </div>
            <button type="button" className="btn" onClick={close} style={{ borderColor: "var(--line)", color: "var(--ink)" }}>
              작품 목록으로 돌아가기
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
