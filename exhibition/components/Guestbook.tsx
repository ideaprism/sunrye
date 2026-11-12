"use client"

import { useEffect, useState } from "react"
import { flowers, rain, type FlowerId } from "@/lib/content"
import WateringCan from "./WateringCan"
import { useGuestbook } from "./GuestbookStore"
import RainIcon from "./RainIcon"
import FlowerIcon from "./FlowerIcon"
import EntryCard from "./EntryCard"
import { PIN_RE } from "@/lib/guestbook-shared"

const NAME_MAX = 20
const MSG_MAX = 200
const PAGE = 5 // 한 번에 보여 줄 글 수

export default function Guestbook() {
  const [flower, setFlower] = useState<FlowerId>("peony")
  const [name, setName] = useState("")
  const [msg, setMsg] = useState("")
  const [pin, setPin] = useState("")
  const [hp, setHp] = useState("")
  const { entries, setEntries, loadError, reload, pick, startDraft, cancelPick, postEntry, result, setResult, postedSeq } = useGuestbook()
  const [sending, setSending] = useState(false)
  const [shownCount, setShownCount] = useState(PAGE)

  // 저장이 끝나면 입력칸을 비운다
  useEffect(() => {
    if (postedSeq === 0) return
    setName("")
    setMsg("")
    setPin("")
  }, [postedSeq])

  const pinOk = pin === "" || PIN_RE.test(pin)
  const drafting = pick?.kind === "draft"
  const canSend = name.trim().length > 0 && msg.trim().length > 0 && pinOk && !sending && !drafting
  const draft = () => ({ name: name.trim(), message: msg.trim(), flower, pin, website: hp })

  // 글만 남기기
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSend) return
    setSending(true)
    setResult(null)
    const r = await postEntry(draft(), [])
    setResult(r)
    setSending(false)
    if (r.ok) document.getElementById("guestbook")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="section" id="guestbook" aria-labelledby="gb-h" style={{ gap: 44 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }} aria-live="polite">
        <span className="eyebrow">방명록</span>
        <h2 id="gb-h" className="h2">
          남겨 주신 마음 {entries ? entries.length : "…"}개
        </h2>
        {result?.ok && !pick && (
          <div className="msg ok" role="status">
            {result.text}
          </div>
        )}
        {loadError && (
          <div className="msg err">
            방명록을 불러오지 못했어요.{" "}
            <button type="button" onClick={reload} style={{ all: "unset", textDecoration: "underline", cursor: "pointer" }}>
              다시 불러오기
            </button>
          </div>
        )}
        {entries?.length === 0 && !loadError && <span className="note">아직 남겨 주신 글이 없어요. 첫 번째 마음을 남겨 주세요.</span>}
        {entries?.slice(0, shownCount).map((e) => (
          <EntryCard
            key={e.id}
            entry={e}
            onUpdated={(u) => setEntries((list) => (list ?? []).map((x) => (x.id === u.id ? u : x)))}
            onDeleted={(id) => setEntries((list) => (list ?? []).filter((x) => x.id !== id))}
          />
        ))}
        {entries && entries.length > shownCount && (
          <button type="button" className="btn" onClick={() => setShownCount((n) => n + PAGE)}>
            지난 글 더 보기 ({Math.min(PAGE, entries.length - shownCount)}개 더 · 남은 글 {entries.length - shownCount}개)
          </button>
        )}
        {entries && shownCount > PAGE && entries.length > PAGE && (
          <button type="button" className="link-btn" style={{ alignSelf: "center" }} onClick={() => { setShownCount(PAGE); document.getElementById("guestbook")?.scrollIntoView() }}>
            처음 {PAGE}개만 보기
          </button>
        )}
        <span className="rain-guide">
          <RainIcon size={40} /> {rain.guide}
        </span>
      </div>

      <div className="divider" style={{ margin: 0 }} />

      <form id="gb-form" onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 22, position: "relative" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <h2 className="h2">축하 한마디 남기기</h2>
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
                disabled={drafting}
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
            disabled={drafting}
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
            disabled={drafting}
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
            disabled={drafting}
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

        <button
          type="button"
          className="btn solid water-btn"
          disabled={!canSend}
          onClick={() => {
            setResult(null)
            startDraft(draft())
          }}
        >
          <WateringCan size={34} /> 저장하고 꽃에 물주러 가기
        </button>
        {!canSend && !drafting && !sending && (
          <span style={{ fontSize: 16, color: "var(--sub)", textAlign: "center", marginTop: -8 }}>
            이름과 한마디를 적으시면 버튼을 누를 수 있어요.
          </span>
        )}
        <button type="submit" className="btn" disabled={!canSend}>
          {sending ? "남기는 중…" : "물주기 없이 글만 남기기"}
        </button>
        {drafting && (
          <div className="rain-cta">
            <span style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.6 }}>
              꽃을 고르는 중이에요. 작품 목록에서 꽃을 고르고 [물주기 완료]를 누르시면 글과 함께 저장됩니다.
            </span>
            <div className="btn-row">
              <a className="btn solid" href="#works">
                꽃 고르러 가기
              </a>
              <button type="button" className="btn" onClick={cancelPick}>
                글 다시 고치기
              </button>
            </div>
          </div>
        )}
        {result && !pick && !result.ok && (
          <div className="msg err" role="status">
            {result.text}
          </div>
        )}
      </form>

    </section>
  )
}
