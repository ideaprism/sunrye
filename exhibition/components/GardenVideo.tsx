"use client"

import { useRef, useState } from "react"

// 누를 때만 영상을 받아 재생한다 (자동 재생·반복 없음)
export default function GardenVideo({
  src,
  poster,
  title,
  note,
}: {
  src: string
  poster: string
  title: string
  note: string
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [started, setStarted] = useState(false)

  const play = () => {
    setStarted(true)
    requestAnimationFrame(() => ref.current?.play().catch(() => {}))
  }

  return (
    <section className="section" id="video" aria-labelledby="video-h" style={{ gap: 14 }}>
      <span className="eyebrow">영상</span>
      <h2 id="video-h" className="h2" style={{ fontSize: 24 }}>
        {title}
      </h2>
      <div className="video-box">
        <video
          ref={ref}
          src={started ? src : undefined}
          poster={poster}
          controls={started}
          playsInline
          preload="none"
          controlsList="nodownload"
          onContextMenu={(e) => e.preventDefault()}
          width={1280}
          height={720}
        />
        {!started && (
          <button type="button" className="video-play" onClick={play} aria-label="영상 재생 (15초, 소리 있음)">
            <svg width="40" height="40" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5v14l11-7z" fill="currentColor" />
            </svg>
            <span>영상 보기 · 15초</span>
          </button>
        )}
      </div>
      <span className="note" style={{ fontSize: 16 }}>
        {note}
      </span>
    </section>
  )
}
