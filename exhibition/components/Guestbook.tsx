"use client"

import { useState } from "react"
import { flowers, rain, type FlowerId } from "@/lib/content"
import { useGuestbook } from "./GuestbookStore"
import RainIcon from "./RainIcon"
import FlowerIcon from "./FlowerIcon"
import EntryCard from "./EntryCard"
import { PIN_RE } from "@/lib/guestbook-shared"

const NAME_MAX = 20
const MSG_MAX = 200
const WAIT_MS = 30_000
const LS_KEY = "gb-last"

export default function Guestbook() {
  const [flower, setFlower] = useState<FlowerId>("peony")
  const [name, setName] = useState("")
  const [msg, setMsg] = useState("")
  const [pin, setPin] = useState("")
  const [hp, setHp] = useState("")
  const { entries, setEntries, loadError, reload, remember } = useGuestbook()
  const [sending, setSending] = useState(false)
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null)
  const [canRain, setCanRain] = useState(false)

  const pinOk = pin === "" || PIN_RE.test(pin)
  const canSend = name.trim().length > 0 && msg.trim().length > 0 && pinOk && !sending

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSend) return
    let last = 0
    try {
      last = Number(localStorage.getItem(LS_KEY) || 0)
    } catch {}
    const left = WAIT_MS - (Date.now() - last)
    if (left > 0) {
      setNotice({ ok: false, text: `잠시 후에 다시 남겨 주세요. (${Math.ceil(left / 1000)}초)` })
      return
    }
    setSending(true)
    setNotice(null)
    try {
      const r = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), message: msg.trim(), flower, pin, website: hp }),
      })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) {
        setNotice({ ok: false, text: d.error || "저장하지 못했어요. 잠시 후 다시 눌러 주세요." })
        return
      }
      try {
        localStorage.setItem(LS_KEY, String(Date.now()))
      } catch {}
      if (d.entry) setEntries((list) => [d.entry, ...(list ?? []).filter((x) => x.id !== d.entry.id)])
      if (d.entry && d.rainToken) {
        remember({ id: d.entry.id, token: d.rainToken })
        setCanRain(true)
      }
      setName("")
      setMsg("")
      setPin("")
      setNotice({
        ok: true,
        text: pin
          ? `고맙습니다. 마음이 잘 전해졌어요. 비밀번호 ${pin}을(를) 기억해 두시면 나중에 고치거나 지울 수 있어요.`
          : "고맙습니다. 마음이 잘 전해졌어요.",
      })
    } catch {
      setNotice({ ok: false, text: "인터넷 연결을 확인하고 다시 눌러 주세요." })
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="section" id="guestbook" aria-labelledby="gb-h" style={{ gap: 44 }}>
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 22, position: "relative" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <span className="eyebrow">방명록</span>
          <h2 id="gb-h" className="h2">
            축하 한마디 남기기
          </h2>
          <span className="note">
            꽃을 하나 골라 마음을 남겨 주세요.
            <br />
            오시지 못한 분도 환영합니다.
          </span>
        </div>

        <fieldset style={{ border: 0, padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
          <legend className="step" style={{ padding: 0, marginBottom: 10 }}>
            1. 꽃 고르기
          </legend>
          <div className="flowers">
            {flowers.map((f) => (
              <button
                key={f.id}
                type="button"
                className="flower-btn"
                aria-pressed={flower === f.id}
                onClick={() => setFlower(f.id)}
              >
                <FlowerIcon petal={f.petal} core={f.core} />
                <span>{f.name}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <label htmlFor="gb-name" className="step">
            2. 이름
          </label>
          <input
            id="gb-name"
            className="field"
            type="text"
            value={name}
            maxLength={NAME_MAX}
            placeholder="예: 홍길동, 3층 이웃"
            autoComplete="name"
            onChange={(e) => setName(e.target.value.slice(0, NAME_MAX))}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <label htmlFor="gb-msg" className="step">
              3. 한마디
            </label>
            <span style={{ fontSize: 16, color: "var(--sub-2)" }} aria-live="polite">
              {msg.length} / {MSG_MAX}
            </span>
          </div>
          <textarea
            id="gb-msg"
            className="field"
            rows={4}
            value={msg}
            maxLength={MSG_MAX}
            placeholder="개인전을 축하드려요!"
            onChange={(e) => setMsg(e.target.value.slice(0, MSG_MAX))}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <label htmlFor="gb-pin" className="step">
            4. 비밀번호 <span style={{ fontWeight: 500, color: "var(--sub-2)" }}>(선택)</span>
          </label>
          <span style={{ fontSize: 16, color: "var(--sub-2)", lineHeight: 1.6, marginTop: -4 }}>
            방문자님께서 작성하신 글을 수정/삭제 하는 용도 입니다.
            <br />
            전화번호 뒷자리와 같은 간단한 번호를 사용하실 것을 권유 드립니다.
          </span>
          <input
            id="gb-pin"
            className="field pin"
            inputMode="numeric"
            autoComplete="off"
            maxLength={4}
            value={pin}
            placeholder="예: 1234"
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
          />
          {!pinOk && <span style={{ fontSize: 16, color: "var(--red)", fontWeight: 700 }}>숫자 4자리를 모두 적어 주세요. 정하지 않으려면 비워 두세요.</span>}
        </div>

        {/* 사람은 보지 못하는 칸. 자동 등록 프로그램만 채운다 */}
        <div className="hp" aria-hidden="true">
          <label htmlFor="gb-website">웹사이트</label>
          <input id="gb-website" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
        </div>

        <button type="submit" className="btn solid" disabled={!canSend}>
          {sending ? "남기는 중…" : "마음 남기기"}
        </button>
        {notice && (
          <div className={`msg ${notice.ok ? "ok" : "err"}`} role="status">
            {notice.text}
          </div>
        )}
        {notice?.ok && canRain && (
          <div className="rain-cta">
            <span style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.6 }}>
              이제 마음에 드는 작품 {rain.max}점에 비를 내려 주세요. <RainIcon />
            </span>
            <a className="btn solid" href="#works">
              작품 보러 가기
            </a>
          </div>
        )}
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }} aria-live="polite">
        <span className="step">남겨 주신 마음 {entries ? entries.length : "…"}개</span>
        {loadError && (
          <div className="msg err">
            방명록을 불러오지 못했어요.{" "}
            <button type="button" onClick={reload} style={{ all: "unset", textDecoration: "underline", cursor: "pointer" }}>
              다시 불러오기
            </button>
          </div>
        )}
        {entries?.length === 0 && !loadError && <span className="note">첫 번째 마음을 남겨 주세요.</span>}
        {entries?.map((e) => (
          <EntryCard
            key={e.id}
            entry={e}
            onUpdated={(u) => setEntries((list) => (list ?? []).map((x) => (x.id === u.id ? u : x)))}
            onDeleted={(id) => setEntries((list) => (list ?? []).filter((x) => x.id !== id))}
          />
        ))}
      </div>
    </section>
  )
}
