"use client"

import { useRef, useState } from "react"

type P = { x: number; y: number }
const MIN = 1
const MAX = 4

// 두 손가락 확대, 한 손가락 이동(확대 중), 두 번 톡톡 = 확대/원래대로, 좌우로 밀기 = 이전/다음
export default function ZoomImage({
  src,
  alt,
  width,
  height,
  onSwipeLeft,
  onSwipeRight,
}: {
  src: string
  alt: string
  width: number
  height: number
  onSwipeLeft: () => void
  onSwipeRight: () => void
}) {
  const stage = useRef<HTMLDivElement>(null)
  const img = useRef<HTMLImageElement>(null)
  const pts = useRef(new Map<number, P>())
  const t = useRef({ s: 1, x: 0, y: 0 })
  const g = useRef({ dist: 0, s: 1, mid: { x: 0, y: 0 }, x: 0, y: 0, start: { x: 0, y: 0 }, moved: false, multi: false })
  const lastTap = useRef(0)
  const [zoomed, setZoomed] = useState(false)

  const apply = (anim = false) => {
    const el = img.current
    if (!el) return
    el.style.transition = anim ? "transform 0.2s ease" : "none"
    el.style.transform = `translate(${t.current.x}px, ${t.current.y}px) scale(${t.current.s})`
    setZoomed(t.current.s > 1.01)
  }

  const clamp = () => {
    const st = stage.current
    const el = img.current
    if (!st || !el) return
    const s = t.current.s
    if (s <= 1.01) {
      t.current = { s: 1, x: 0, y: 0 }
      return
    }
    const mx = Math.max(0, (el.offsetWidth * s - st.clientWidth) / 2)
    const my = Math.max(0, (el.offsetHeight * s - st.clientHeight) / 2)
    t.current.x = Math.min(mx, Math.max(-mx, t.current.x))
    t.current.y = Math.min(my, Math.max(-my, t.current.y))
  }

  const center = () => {
    const r = stage.current!.getBoundingClientRect()
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
  }

  const zoomAt = (s: number, p: P) => {
    const c = center()
    const prev = t.current.s
    const ns = Math.min(MAX, Math.max(MIN, s))
    // 손가락 위치를 기준으로 확대
    t.current.x = (p.x - c.x) - ((p.x - c.x - t.current.x) * ns) / prev
    t.current.y = (p.y - c.y) - ((p.y - c.y - t.current.y) * ns) / prev
    t.current.s = ns
  }

  const onDown = (e: React.PointerEvent) => {
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const list = [...pts.current.values()]
    if (list.length === 1) {
      g.current.start = { x: e.clientX, y: e.clientY }
      g.current.x = t.current.x
      g.current.y = t.current.y
      g.current.moved = false
      g.current.multi = false
    } else if (list.length === 2) {
      g.current.multi = true
      g.current.dist = Math.hypot(list[0].x - list[1].x, list[0].y - list[1].y)
      g.current.s = t.current.s
      g.current.mid = { x: (list[0].x + list[1].x) / 2, y: (list[0].y + list[1].y) / 2 }
    }
  }

  const onMove = (e: React.PointerEvent) => {
    if (!pts.current.has(e.pointerId)) return
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const list = [...pts.current.values()]
    if (list.length >= 2) {
      const d = Math.hypot(list[0].x - list[1].x, list[0].y - list[1].y)
      if (g.current.dist > 0) {
        const mid = { x: (list[0].x + list[1].x) / 2, y: (list[0].y + list[1].y) / 2 }
        zoomAt((g.current.s * d) / g.current.dist, mid)
        clamp()
        apply()
      }
      return
    }
    const dx = e.clientX - g.current.start.x
    const dy = e.clientY - g.current.start.y
    if (Math.abs(dx) > 8 || Math.abs(dy) > 8) g.current.moved = true
    if (t.current.s > 1.01) {
      t.current.x = g.current.x + dx
      t.current.y = g.current.y + dy
      clamp()
      apply()
    }
  }

  const onUp = (e: React.PointerEvent) => {
    if (!pts.current.has(e.pointerId)) return
    pts.current.delete(e.pointerId)
    const remaining = pts.current.size
    if (remaining === 1) {
      // 두 손가락 중 하나를 뗐을 때: 남은 손가락으로 이어서 이동
      const p = [...pts.current.values()][0]
      g.current.start = p
      g.current.x = t.current.x
      g.current.y = t.current.y
      return
    }
    if (remaining > 0) return

    if (t.current.s <= 1.01) {
      t.current = { s: 1, x: 0, y: 0 }
      apply(true)
    }

    if (g.current.multi) return

    const dx = e.clientX - g.current.start.x
    const dy = e.clientY - g.current.start.y
    // 원래 크기일 때만 좌우 밀기로 작품 넘기기
    if (t.current.s <= 1.01 && Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) onSwipeLeft()
      else onSwipeRight()
      return
    }
    if (!g.current.moved) {
      const now = Date.now()
      if (now - lastTap.current < 320) {
        lastTap.current = 0
        if (t.current.s > 1.01) t.current = { s: 1, x: 0, y: 0 }
        else {
          zoomAt(2.5, { x: e.clientX, y: e.clientY })
          clamp()
        }
        apply(true)
      } else {
        lastTap.current = now
      }
    }
  }

  const reset = () => {
    t.current = { s: 1, x: 0, y: 0 }
    apply(true)
  }

  return (
    <div
      className="stage"
      ref={stage}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onWheel={(e) => {
        zoomAt(t.current.s * (e.deltaY < 0 ? 1.15 : 1 / 1.15), { x: e.clientX, y: e.clientY })
        clamp()
        apply()
      }}
    >
      <img ref={img} src={src} alt={alt} width={width} height={height} draggable={false} onContextMenu={(e) => e.preventDefault()} />
      {zoomed && (
        <button type="button" className="reset" onClick={reset} onPointerDown={(e) => e.stopPropagation()}>
          원래 크기로
        </button>
      )}
    </div>
  )
}
