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
    <span className={`rain-badge${big ? " big" : ""}`} aria-label={`물주기 ${n}번`}>
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
          <RainIcon size={36} /> 방명록에 글을 남기시면 이 꽃에 물을 주실 수 있어요.
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
            <RainIcon /> 이 꽃에 물을 주었어요
          </button>
          <button type="button" className="link-btn" style={{ alignSelf: "center" }} onClick={press} disabled={busy}>
            물주기 거두기
          </button>
        </>
      ) : left > 0 ? (
        <button type="button" className="btn solid rain-btn" onClick={press} disabled={busy}>
          <RainIcon /> {busy ? "물 주는 중…" : "이 꽃에 물주기"}
        </button>
      ) : (
        <button type="button" className="btn" disabled>
          물 {rain.max}번을 모두 주셨어요
        </button>
      )}
      <span className="rain-left">
        {left > 0 ? `남은 물 ${left}번` : "다른 꽃에 주시려면, 물을 준 꽃에서 '물주기 거두기'를 눌러 주세요."}
      </span>
      {err && (
        <div className="msg err" role="alert">
          {err}
        </div>
      )}
    </div>
  )
}
