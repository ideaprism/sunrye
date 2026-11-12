"use client"

import { useState } from "react"
import { flowers } from "@/lib/content"
import { formatDate, PIN_RE, type Entry } from "@/lib/guestbook-shared"
import FlowerIcon from "./FlowerIcon"
import { useGuestbook } from "./GuestbookStore"

type Mode = "view" | "edit" | "confirmDelete" | "claim"

export default function EntryCard({
  entry,
  onUpdated,
  onDeleted,
  finding = false,
}: {
  entry: Entry
  onUpdated: (e: Entry) => void
  onDeleted: (id: string) => void
  finding?: boolean // '내 글 찾기' 중일 때: 비밀번호로 내 글 확인 버튼을 보여 준다
}) {
  const f = flowers.find((x) => x.id === entry.flower) ?? flowers[0]
  const [mode, setMode] = useState<Mode>("view")
  const [pin, setPin] = useState("")
  const [name, setName] = useState(entry.name)
  const [msg, setMsg] = useState(entry.message)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState("")
  const { remember, myIds } = useGuestbook()
  const isMine = myIds.includes(entry.id)
  const [claimed, setClaimed] = useState(false)

  const open = () => {
    setName(entry.name)
    setMsg(entry.message)
    setPin("")
    setErr("")
    setMode("edit")
  }
  const close = () => {
    setMode("view")
    setPin("")
    setErr("")
  }

  const call = async (method: "PATCH" | "DELETE") => {
    if (!PIN_RE.test(pin)) {
      setErr("글을 남길 때 정한 비밀번호 숫자 4자리를 적어 주세요.")
      return
    }
    setBusy(true)
    setErr("")
    try {
      const r = await fetch(`/api/guestbook/${entry.id}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(method === "PATCH" ? { pin, name: name.trim(), message: msg.trim() } : { pin }),
      })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) {
        setErr(d.error || "처리하지 못했어요. 잠시 후 다시 눌러 주세요.")
        if (method === "DELETE") setMode("edit")
        return
      }
      if (method === "PATCH") {
        onUpdated(d.entry)
        if (d.rainToken) remember({ id: entry.id, token: d.rainToken })
        close()
      } else {
        onDeleted(entry.id)
      }
    } catch {
      setErr("인터넷 연결을 확인하고 다시 눌러 주세요.")
    } finally {
      setBusy(false)
    }
  }

  const claim = async () => {
    if (!PIN_RE.test(pin)) {
      setErr("글을 남길 때 정한 비밀번호 숫자 4자리를 적어 주세요.")
      return
    }
    setBusy(true)
    setErr("")
    try {
      const r = await fetch(`/api/guestbook/${entry.id}/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) {
        setErr(d.error || "처리하지 못했어요.")
        return
      }
      remember({ id: entry.id, token: d.rainToken })
      setClaimed(true)
      close()
    } catch {
      setErr("인터넷 연결을 확인하고 다시 눌러 주세요.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <article className="entry" style={{ flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 14 }}>
        <FlowerIcon petal={f.petal} core={f.core} />
        <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0, flex: 1 }}>
          <div className="who">
            <span className="nm">{entry.name}</span>
            {isMine && <span className="mine-badge">내 글</span>}
            <span className="dt">
              {formatDate(entry.created_at)}
              {entry.updated_at ? " · 고침" : ""}
            </span>
          </div>
          <span className="tx">{entry.message}</span>
        </div>
      </div>

      {isMine && mode === "view" && entry.has_pin && (
        <button type="button" className="link-btn" onClick={open}>
          내 글 고치기 · 지우기
        </button>
      )}
      {isMine && mode === "view" && !entry.has_pin && (
        <span className="note" style={{ fontSize: 16, textAlign: "right" }}>
          비밀번호 없이 남기셔서 고칠 수 없어요.
        </span>
      )}
      {!isMine && finding && mode === "view" && (
        entry.has_pin ? (
          <button type="button" className="btn" onClick={() => { open(); setMode("claim") }}>
            내 글이에요 (비밀번호 넣기)
          </button>
        ) : (
          <span className="note" style={{ fontSize: 16 }}>비밀번호 없이 남긴 글이라 고칠 수 없어요.</span>
        )
      )}
      {claimed && mode === "view" && (
        <div className="msg ok">확인되었어요. 이제 이 휴대폰에서 이 글을 고치실 수 있어요.</div>
      )}

      {mode !== "view" && (
        <div className="edit-box">
          <label className="step" htmlFor={`pin-${entry.id}`} style={{ fontSize: 17 }}>
            비밀번호 (숫자 4자리)
          </label>
          <input
            id={`pin-${entry.id}`}
            className="field pin"
            inputMode="numeric"
            autoComplete="off"
            maxLength={4}
            value={pin}
            placeholder="0000"
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
          />
          {mode === "edit" && (
            <>
              <label className="step" htmlFor={`name-${entry.id}`} style={{ fontSize: 17 }}>
                이름
              </label>
              <input id={`name-${entry.id}`} className="field" maxLength={20} value={name} onChange={(e) => setName(e.target.value.slice(0, 20))} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <label className="step" htmlFor={`msg-${entry.id}`} style={{ fontSize: 17 }}>
                  한마디
                </label>
                <span style={{ fontSize: 16, color: "var(--sub-2)" }}>{msg.length} / 200</span>
              </div>
              <textarea id={`msg-${entry.id}`} className="field" rows={4} maxLength={200} value={msg} onChange={(e) => setMsg(e.target.value.slice(0, 200))} />
            </>
          )}
          {err && (
            <div className="msg err" role="alert">
              {err}
            </div>
          )}
          {mode === "claim" ? (
            <>
              <span style={{ fontSize: 16, color: "var(--sub)", lineHeight: 1.6 }}>
                글을 남길 때 정한 비밀번호를 넣어 주세요. 확인되면 이 휴대폰에서 이 글을 고치실 수 있어요.
              </span>
              <div className="btn-row">
                <button type="button" className="btn" onClick={close} disabled={busy}>
                  취소
                </button>
                <button type="button" className="btn solid" onClick={claim} disabled={busy}>
                  {busy ? "확인 중…" : "확인"}
                </button>
              </div>
            </>
          ) : mode === "edit" ? (
            <>
              <button type="button" className="btn solid" disabled={busy || !name.trim() || !msg.trim()} onClick={() => call("PATCH")}>
                {busy ? "고치는 중…" : "고친 내용 저장"}
              </button>
              <div className="btn-row">
                <button type="button" className="btn" onClick={close} disabled={busy}>
                  취소
                </button>
                <button
                  type="button"
                  className="btn danger"
                  disabled={busy}
                  onClick={() => {
                    setErr("")
                    setMode("confirmDelete")
                  }}
                >
                  글 지우기
                </button>
              </div>
            </>
          ) : (
            <>
              <span style={{ fontSize: 18, fontWeight: 800, color: "var(--red)" }}>이 글을 지울까요? 지우면 되돌릴 수 없어요.</span>
              <div className="btn-row">
                <button type="button" className="btn" onClick={() => setMode("edit")} disabled={busy}>
                  아니요
                </button>
                <button type="button" className="btn danger solid-danger" onClick={() => call("DELETE")} disabled={busy}>
                  {busy ? "지우는 중…" : "네, 지울게요"}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </article>
  )
}
