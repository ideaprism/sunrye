"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { rain, works } from "@/lib/content"
import type { Entry, Settings } from "@/lib/guestbook-shared"

const MINE_KEY = "gb-mine" // 물주기에 쓰는 글 1건 (가장 최근)
const MY_IDS_KEY = "gb-my-ids" // 이 브라우저에서 쓰거나 비밀번호로 확인한 글 전부
const LAST_KEY = "gb-last"
const WAIT_MS = 30_000

type Mine = { id: string; token: string }
export type Draft = { name: string; message: string; flower: string; pin: string; website: string }
type Pick = { kind: "edit"; fresh: boolean }
type Result = { ok: boolean; text: string }

type Store = {
  entries: Entry[] | null
  loadError: boolean
  reload: () => Promise<void>
  setEntries: React.Dispatch<React.SetStateAction<Entry[] | null>>
  mine: Mine | null
  remember: (m: Mine) => void
  myIds: string[]
  myRain: number[]
  rainCount: (no: number) => number
  toggleRain: (no: number) => Promise<string | null>
  // 꽃 고르기 (구글 포토처럼 여러 장 고르기)
  pick: Pick | null
  picked: number[]
  togglePick: (no: number) => string | null
  startDraft: (d: Draft) => Promise<Result | null>
  startEdit: () => void
  cancelPick: () => void
  commitPick: () => Promise<void>
  committing: boolean
  postEntry: (d: Draft, rainList: number[]) => Promise<Result>
  result: Result | null
  setResult: (r: Result | null) => void
  postedSeq: number
}

const Ctx = createContext<Store | null>(null)

export function useGuestbook() {
  const s = useContext(Ctx)
  if (!s) throw new Error("GuestbookProvider missing")
  return s
}

const scrollTo = (id: string) =>
  setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 60)

export default function GuestbookProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<Entry[] | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [mine, setMine] = useState<Mine | null>(null)
  const [myIds, setMyIds] = useState<string[]>([])
  const [settings, setSettings] = useState<Settings>({ showBaseline: rain.showBaseline })
  const [pick, setPick] = useState<Pick | null>(null)
  const [picked, setPicked] = useState<number[]>([])
  const [committing, setCommitting] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [postedSeq, setPostedSeq] = useState(0)

  const reload = useCallback(async () => {
    try {
      const r = await fetch("/api/guestbook", { cache: "no-store" })
      if (!r.ok) throw new Error()
      const d = await r.json()
      setEntries(d.entries)
      if (d.settings) setSettings(d.settings)
      setLoadError(false)
    } catch {
      setLoadError(true)
      setEntries((e) => e ?? [])
    }
  }, [])

  useEffect(() => {
    reload()
    try {
      const raw = localStorage.getItem(MINE_KEY)
      const m = raw ? (JSON.parse(raw) as Mine) : null
      if (m) setMine(m)
      const ids = JSON.parse(localStorage.getItem(MY_IDS_KEY) || "[]") as string[]
      setMyIds(m && !ids.includes(m.id) ? [m.id, ...ids] : ids)
    } catch {}
  }, [reload])

  const remember = useCallback((m: Mine) => {
    setMine(m)
    setMyIds((ids) => {
      const next = [m.id, ...ids.filter((x) => x !== m.id)].slice(0, 20)
      try {
        localStorage.setItem(MY_IDS_KEY, JSON.stringify(next))
      } catch {}
      return next
    })
    try {
      localStorage.setItem(MINE_KEY, JSON.stringify(m))
    } catch {}
  }, [])

  const myEntry = mine && entries ? entries.find((e) => e.id === mine.id) : undefined
  const myRain = useMemo(() => myEntry?.rain ?? [], [myEntry])

  // 목록에 내 글이 잠깐 안 보여도 기억은 지우지 않는다 (목록 읽기가 어긋날 수 있으므로)

  const counts = useMemo(() => {
    const c: Record<number, number> = {}
    for (const w of works) c[w.no] = settings.showBaseline ? rain.baseline[w.no] ?? 0 : 0
    for (const e of entries ?? []) for (const n of e.rain) if (c[n] !== undefined) c[n]++
    return c
  }, [entries, settings])

  const rainCount = useCallback((no: number) => counts[no] ?? 0, [counts])

  const saveRain = useCallback(
    async (next: number[]) => {
      if (!mine || !myEntry) return "방명록에 글을 남기신 뒤에 꽃에 물을 주실 수 있어요."
      const prev = entries
      setEntries((list) => (list ?? []).map((e) => (e.id === mine.id ? { ...e, rain: next } : e)))
      try {
        const r = await fetch(`/api/guestbook/${mine.id}/rain`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: mine.token, works: next }),
        })
        const d = await r.json().catch(() => ({}))
        if (!r.ok) {
          setEntries(prev)
          return d.error || "물을 주지 못했어요. 잠시 후 다시 눌러 주세요."
        }
        return null
      } catch {
        setEntries(prev)
        return "인터넷 연결을 확인하고 다시 눌러 주세요."
      }
    },
    [mine, myEntry, entries],
  )

  // 크게 보기 화면에서 한 작품씩
  const toggleRain = useCallback(
    async (no: number) => {
      if (!myEntry) return "방명록에 글을 남기신 뒤에 꽃에 물을 주실 수 있어요."
      const has = myEntry.rain.includes(no)
      if (!has && myEntry.rain.length >= rain.max) return `물은 ${rain.max}개 작품까지 주실 수 있어요.`
      return saveRain(has ? myEntry.rain.filter((n) => n !== no) : [...myEntry.rain, no])
    },
    [myEntry, saveRain],
  )

  const postEntry = useCallback(
    async (d: Draft, rainList: number[]): Promise<Result> => {
      let last = 0
      try {
        last = Number(localStorage.getItem(LAST_KEY) || 0)
      } catch {}
      const left = WAIT_MS - (Date.now() - last)
      if (left > 0) return { ok: false, text: `잠시 후에 다시 남겨 주세요. (${Math.ceil(left / 1000)}초)` }
      try {
        const r = await fetch("/api/guestbook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...d, rain: rainList }),
        })
        const res = await r.json().catch(() => ({}))
        if (!r.ok) return { ok: false, text: res.error || "저장하지 못했어요. 잠시 후 다시 눌러 주세요." }
        try {
          localStorage.setItem(LAST_KEY, String(Date.now()))
        } catch {}
        if (res.entry) setEntries((list) => [res.entry, ...(list ?? []).filter((x) => x.id !== res.entry.id)])
        if (res.entry && res.rainToken) remember({ id: res.entry.id, token: res.rainToken })
        setPostedSeq((n) => n + 1)
        const pinNote = d.pin ? ` 비밀번호 ${d.pin}을(를) 기억해 두시면 나중에 고치거나 지울 수 있어요.` : ""
        const rainNote = rainList.length ? ` 고르신 꽃 ${rainList.length}점에 물을 주었어요.` : ""
        return { ok: true, text: `고맙습니다. 마음이 잘 전해졌어요.${rainNote}${pinNote}` }
      } catch {
        return { ok: false, text: "인터넷 연결을 확인하고 다시 눌러 주세요." }
      }
    },
    [remember],
  )

  // 글을 먼저 저장한 뒤 바로 꽃 고르기로 넘어간다 (중간에 나가도 글은 남는다)
  const startDraft = useCallback(
    async (d: Draft) => {
      setResult(null)
      const r = await postEntry(d, [])
      if (!r.ok) return r
      setPick({ kind: "edit", fresh: true })
      setPicked([])
      setResult(null)
      scrollTo("works")
      return null
    },
    [postEntry],
  )

  const startEdit = useCallback(() => {
    setPick({ kind: "edit", fresh: false })
    setPicked(myRain)
    setResult(null)
  }, [myRain])

  const cancelPick = useCallback(() => {
    const fresh = pick?.fresh
    setPick(null)
    setPicked([])
    if (fresh) {
      setResult({ ok: true, text: "고맙습니다. 마음이 잘 전해졌어요. 꽃에 물주기는 나중에 작품 목록 위 버튼으로 하실 수 있어요." })
      scrollTo("guestbook")
    }
  }, [pick])

  const togglePick = useCallback(
    (no: number) => {
      if (picked.includes(no)) {
        setPicked(picked.filter((n) => n !== no))
        return null
      }
      if (picked.length >= rain.max) {
        return `물은 ${rain.max}개 작품까지 주실 수 있어요. 다른 꽃을 고르시려면 고른 꽃을 한 번 더 눌러 빼 주세요.`
      }
      setPicked([...picked, no])
      return null
    },
    [picked],
  )

  const commitPick = useCallback(async () => {
    if (!pick) return
    setCommitting(true)
    setResult(null)
    const err = await saveRain(picked)
    if (err) setResult({ ok: false, text: err })
    else {
      const n = picked.length
      setResult({
        ok: true,
        text: pick.fresh
          ? `고맙습니다. 마음이 잘 전해졌어요.${n ? ` 고르신 꽃 ${n}점에 물을 주었어요.` : ""}`
          : n
            ? `고르신 꽃 ${n}점에 물을 주었어요.`
            : "물주기를 모두 거두었어요.",
      })
      setPick(null)
      setPicked([])
      if (pick.fresh) scrollTo("guestbook")
    }
    setCommitting(false)
  }, [pick, picked, saveRain])

  return (
    <Ctx.Provider
      value={{
        entries,
        loadError,
        reload,
        setEntries,
        mine: myEntry ? mine : null,
        remember,
        myIds,
        myRain,
        rainCount,
        toggleRain,
        pick,
        picked,
        togglePick,
        startDraft,
        startEdit,
        cancelPick,
        commitPick,
        committing,
        postEntry,
        result,
        setResult,
        postedSeq,
      }}
    >
      {children}
    </Ctx.Provider>
  )
}
