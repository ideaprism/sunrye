"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { flowers, rain, works } from "@/lib/content"
import { formatDate, PIN_RE, type Entry, type Settings } from "@/lib/guestbook-shared"
import FlowerIcon from "./FlowerIcon"

type Data = { entries: Entry[]; settings: Settings }

export default function AdminApp() {
  const [state, setState] = useState<"loading" | "login" | "ready">("loading")
  const [data, setData] = useState<Data | null>(null)
  const [pw, setPw] = useState("")
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [q, setQ] = useState("")

  const load = useCallback(async () => {
    const r = await fetch("/api/admin/entries", { cache: "no-store" })
    if (r.status === 401) return setState("login")
    if (!r.ok) {
      setMsg({ ok: false, text: "불러오지 못했어요. 새로고침해 주세요." })
      return
    }
    setData(await r.json())
    setState("ready")
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    })
    const d = await r.json().catch(() => ({}))
    if (!r.ok) return setMsg({ ok: false, text: d.error || "로그인 실패" })
    setPw("")
    setMsg(null)
    load()
  }

  const logout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" })
    setData(null)
    setState("login")
  }

  const setShowBaseline = async (v: boolean) => {
    const r = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ showBaseline: v }),
    })
    const d = await r.json().catch(() => ({}))
    if (!r.ok) return setMsg({ ok: false, text: d.error || "저장 실패" })
    setData((x) => (x ? { ...x, settings: d.settings } : x))
    setMsg({ ok: true, text: v ? "기본값 + 실제 수로 보여 줍니다." : "실제 수만 보여 줍니다." })
  }

  const real = useMemo(() => {
    const c: Record<number, number> = {}
    for (const w of works) c[w.no] = 0
    for (const e of data?.entries ?? []) if (!e.hidden) for (const n of e.rain) if (c[n] !== undefined) c[n]++
    return c
  }, [data])

  const shown = (data?.entries ?? []).filter(
    (e) => !q.trim() || e.name.includes(q.trim()) || e.message.includes(q.trim()),
  )

  if (state === "loading") return <main className="page admin"><p className="section">불러오는 중…</p></main>

  if (state === "login")
    return (
      <main className="page admin">
        <form className="section" onSubmit={login}>
          <span className="eyebrow">관리자</span>
          <h1 className="h2">김선례 개인전 관리</h1>
          <label className="step" htmlFor="admin-pw">관리자 비밀번호</label>
          <input id="admin-pw" className="field" type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" />
          <button className="btn solid" type="submit" disabled={!pw}>들어가기</button>
          {msg && <div className={`msg ${msg.ok ? "ok" : "err"}`}>{msg.text}</div>}
        </form>
      </main>
    )

  const visible = (data?.entries ?? []).filter((e) => !e.hidden).length

  return (
    <main className="page admin">
      <section className="section" style={{ gap: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="eyebrow">관리자</span>
          <button type="button" className="link-btn" onClick={logout}>로그아웃</button>
        </div>
        <h1 className="h2">김선례 개인전 관리</h1>
        <div className="btn-row">
          <a className="btn" href="/">도록 보기</a>
          <a className="btn solid" href="/guestbook/print" target="_blank" rel="noopener">방명록 인쇄</a>
        </div>
        {msg && <div className={`msg ${msg.ok ? "ok" : "err"}`} role="status">{msg.text}</div>}
      </section>

      <div className="divider" />

      <section className="section" style={{ gap: 14 }}>
        <h2 className="h2" style={{ fontSize: 22 }}>작품별 꽃에 물주기 (실제 / 화면 표시)</h2>
        <label style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 17 }}>
          <input
            type="checkbox"
            checked={data!.settings.showBaseline}
            onChange={(e) => setShowBaseline(e.target.checked)}
            style={{ width: 24, height: 24 }}
          />
          기본값(1~5)을 더해서 보여 주기
        </label>
        <table className="admin-table">
          <thead>
            <tr><th>#</th><th>작품</th><th>실제</th><th>표시</th></tr>
          </thead>
          <tbody>
            {works.map((w) => (
              <tr key={w.no}>
                <td>{w.no}</td>
                <td>{w.title}</td>
                <td><b>{real[w.no]}</b></td>
                <td>{real[w.no] + (data!.settings.showBaseline ? rain.baseline[w.no] ?? 0 : 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="divider" />

      <section className="section" style={{ gap: 14 }}>
        <h2 className="h2" style={{ fontSize: 22 }}>방명록 {visible}개 {data!.entries.length !== visible ? `(숨김 ${data!.entries.length - visible})` : ""}</h2>
        <input className="field" placeholder="이름이나 내용으로 찾기" value={q} onChange={(e) => setQ(e.target.value)} />
        {shown.map((e) => (
          <AdminEntry
            key={e.id}
            entry={e}
            onChange={(u) => setData((x) => (x ? { ...x, entries: x.entries.map((y) => (y.id === u.id ? u : y)) } : x))}
            onDelete={(id) => setData((x) => (x ? { ...x, entries: x.entries.filter((y) => y.id !== id) } : x))}
            onMsg={setMsg}
          />
        ))}
      </section>
    </main>
  )
}

function AdminEntry({
  entry,
  onChange,
  onDelete,
  onMsg,
}: {
  entry: Entry
  onChange: (e: Entry) => void
  onDelete: (id: string) => void
  onMsg: (m: { ok: boolean; text: string }) => void
}) {
  const f = flowers.find((x) => x.id === entry.flower) ?? flowers[0]
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(entry.name)
  const [message, setMessage] = useState(entry.message)
  const [flower, setFlower] = useState(entry.flower)
  const [pin, setPin] = useState("")
  const [busy, setBusy] = useState(false)

  const patch = async (body: Record<string, unknown>, okText: string) => {
    setBusy(true)
    const r = await fetch(`/api/admin/entries/${entry.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const d = await r.json().catch(() => ({}))
    setBusy(false)
    if (!r.ok) return onMsg({ ok: false, text: d.error || "실패했어요." })
    onChange(d.entry)
    onMsg({ ok: true, text: okText })
  }

  const remove = async () => {
    if (!window.confirm(`'${entry.name}' 님의 글을 완전히 지울까요? 되돌릴 수 없어요.\n(되돌릴 수 있게 하려면 '숨기기'를 쓰세요)`)) return
    setBusy(true)
    const r = await fetch(`/api/admin/entries/${entry.id}`, { method: "DELETE" })
    setBusy(false)
    if (!r.ok) return onMsg({ ok: false, text: "지우지 못했어요." })
    onDelete(entry.id)
    onMsg({ ok: true, text: "글을 지웠어요." })
  }

  return (
    <article className="entry" style={{ flexDirection: "column", gap: 10, opacity: entry.hidden ? 0.55 : 1 }}>
      <div style={{ display: "flex", gap: 12 }}>
        <FlowerIcon petal={f.petal} core={f.core} size={32} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="who">
            <span className="nm">{entry.name}</span>
            <span className="dt">{formatDate(entry.created_at)}</span>
          </div>
          <div className="tx" style={{ fontSize: 16 }}>{entry.message}</div>
          <div style={{ fontSize: 14, color: "var(--sub)", marginTop: 4 }}>
            {entry.deleted_by_author ? "작성자가 지움(숨김) · " : entry.hidden ? "숨김 · " : ""}
            비밀번호 {entry.has_pin ? "있음" : "없음"} · 물주기: {entry.rain.length ? entry.rain.map((n) => works[n - 1]?.title + `(${n})`).join(", ") : "없음"}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button type="button" className="btn" style={{ width: "auto", minHeight: 44, fontSize: 16 }} onClick={() => setOpen(!open)}>
          {open ? "닫기" : "고치기"}
        </button>
        <button
          type="button"
          className="btn"
          style={{ width: "auto", minHeight: 44, fontSize: 16 }}
          disabled={busy}
          onClick={() => patch({ hidden: !entry.hidden }, entry.hidden ? "다시 보이게 했어요." : "숨겼어요. 방문자에게 안 보입니다.")}
        >
          {entry.hidden ? "다시 보이기" : "숨기기"}
        </button>
        <button type="button" className="btn danger" style={{ width: "auto", minHeight: 44, fontSize: 16 }} disabled={busy} onClick={remove}>
          지우기
        </button>
      </div>
      {open && (
        <div className="edit-box">
          <label className="step" style={{ fontSize: 16 }}>이름</label>
          <input className="field" value={name} maxLength={20} onChange={(e) => setName(e.target.value)} />
          <label className="step" style={{ fontSize: 16 }}>한마디</label>
          <textarea className="field" rows={3} value={message} maxLength={200} onChange={(e) => setMessage(e.target.value)} />
          <label className="step" style={{ fontSize: 16 }}>꽃</label>
          <select className="field" value={flower} onChange={(e) => setFlower(e.target.value)}>
            {flowers.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
          </select>
          <button type="button" className="btn solid" disabled={busy} onClick={() => patch({ name, message, flower }, "내용을 고쳤어요.")}>
            내용 저장
          </button>
          <label className="step" style={{ fontSize: 16, marginTop: 8 }}>비밀번호 새로 정하기 (숫자 4자리)</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              className="field pin"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              placeholder="0000"
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
            />
            <button type="button" className="btn" style={{ width: "auto" }} disabled={busy || !PIN_RE.test(pin)} onClick={() => patch({ pin }, `비밀번호를 ${pin}(으)로 정했어요.`).then(() => setPin(""))}>
              정하기
            </button>
            {entry.has_pin && (
              <button type="button" className="btn danger" style={{ width: "auto" }} disabled={busy} onClick={() => patch({ pin: null }, "비밀번호를 없앴어요.")}>
                없애기
              </button>
            )}
          </div>
          {entry.rain.length > 0 && (
            <button type="button" className="btn" disabled={busy} onClick={() => patch({ rain: [] }, "이 글의 물주기를 모두 거뒀어요.")}>
              이 글의 물주기 모두 거두기
            </button>
          )}
        </div>
      )}
    </article>
  )
}
