"use client"

import { useState } from "react"
import { rain } from "@/lib/content"
import { useGuestbook } from "./GuestbookStore"
import RainIcon from "./RainIcon"

export function RainBadge({ no, big = false }: { no: number; big?: boolean }) {
  const { rainCount } = useGuestbook()
  const n = rainCount(no)
  if (n < 1) return null
  return (
    <span className={`rain-badge${big ? " big" : ""}`} aria-label={`비 ${n}번`}>
      <RainIcon size={big ? 34 : 26} />
      {n}
    </span>
  )
}

export default function RainButton({ no, onGoGuestbook }: { no: number; onGoGuestbook: () => void }) {
  const { mine, myRain, toggleRain } = useGuestbook()
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState("")
  const has = myRain.includes(no)
  const left = rain.max - myRain.length

  const press = async () => {
    setBusy(true)
    setErr("")
    const e = await toggleRain(no)
    if (e) setErr(e)
    setBusy(false)
  }

  if (!mine) {
    return (
      <div className="rain-box">
        <span className="rain-guide">
          <RainIcon size={36} /> 방명록에 글을 남기시면 이 작품에 비를 내려 주실 수 있어요.
        </span>
        <button type="button" className="btn" onClick={onGoGuestbook}>
          방명록에 글 남기러 가기
        </button>
      </div>
    )
  }

  return (
    <div className="rain-box">
      {has ? (
        <>
          <button type="button" className="btn rain-on" aria-pressed="true" disabled>
            <RainIcon /> 이 작품에 비를 내렸어요
          </button>
          <button type="button" className="link-btn" style={{ alignSelf: "center" }} onClick={press} disabled={busy}>
            내린 비 거두기
          </button>
        </>
      ) : left > 0 ? (
        <button type="button" className="btn solid rain-btn" onClick={press} disabled={busy}>
          <RainIcon /> {busy ? "비 내리는 중…" : "이 작품에 비 내리기"}
        </button>
      ) : (
        <button type="button" className="btn" disabled>
          비 {rain.max}번을 모두 내리셨어요
        </button>
      )}
      <span className="rain-left">
        {left > 0 ? `남은 비 ${left}번` : "다른 작품에 내리시려면, 비를 내린 작품에서 '내린 비 거두기'를 눌러 주세요."}
      </span>
      {err && (
        <div className="msg err" role="alert">
          {err}
        </div>
      )}
    </div>
  )
}
