"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { rain, works } from "@/lib/content"
import type { Entry } from "@/lib/guestbook-shared"

const MINE_KEY = "gb-mine"
type Mine = { id: string; token: string }

type Store = {
  entries: Entry[] | null
  loadError: boolean
  reload: () => Promise<void>
  setEntries: React.Dispatch<React.SetStateAction<Entry[] | null>>
  mine: Mine | null
  remember: (m: Mine) => void
  myRain: number[]
  rainCount: (no: number) => number
  toggleRain: (no: number) => Promise<string | null>
}

const Ctx = createContext<Store | null>(null)

export function useGuestbook() {
  const s = useContext(Ctx)
  if (!s) throw new Error("GuestbookProvider missing")
  return s
}

export default function GuestbookProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<Entry[] | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [mine, setMine] = useState<Mine | null>(null)

  const reload = useCallback(async () => {
    try {
      const r = await fetch("/api/guestbook", { cache: "no-store" })
      if (!r.ok) throw new Error()
      const d = await r.json()
      setEntries(d.entries)
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
      if (raw) setMine(JSON.parse(raw))
    } catch {}
  }, [reload])

  const remember = useCallback((m: Mine) => {
    setMine(m)
    try {
      localStorage.setItem(MINE_KEY, JSON.stringify(m))
    } catch {}
  }, [])

  const myEntry = mine && entries ? entries.find((e) => e.id === mine.id) : undefined
  const myRain = useMemo(() => myEntry?.rain ?? [], [myEntry])

  // 내 글이 지워졌으면 비 내리기 권한도 지운다
  useEffect(() => {
    if (mine && entries && !loadError && !entries.some((e) => e.id === mine.id)) {
      setMine(null)
      try {
        localStorage.removeItem(MINE_KEY)
      } catch {}
    }
  }, [mine, entries, loadError])

  const counts = useMemo(() => {
    const c: Record<number, number> = {}
    for (const w of works) c[w.no] = rain.showBaseline ? rain.baseline[w.no] ?? 0 : 0
    for (const e of entries ?? []) for (const n of e.rain) if (c[n] !== undefined) c[n]++
    return c
  }, [entries])

  const rainCount = useCallback((no: number) => counts[no] ?? 0, [counts])

  const toggleRain = useCallback(
    async (no: number) => {
      if (!mine || !myEntry) return "방명록에 글을 남기신 뒤에 비를 내릴 수 있어요."
      const has = myEntry.rain.includes(no)
      if (!has && myEntry.rain.length >= rain.max) return `비는 ${rain.max}개 작품까지 내릴 수 있어요.`
      const next = has ? myEntry.rain.filter((n) => n !== no) : [...myEntry.rain, no]
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
          return d.error || "비를 내리지 못했어요. 잠시 후 다시 눌러 주세요."
        }
        return null
      } catch {
        setEntries(prev)
        return "인터넷 연결을 확인하고 다시 눌러 주세요."
      }
    },
    [mine, myEntry, entries],
  )

  return (
    <Ctx.Provider value={{ entries, loadError, reload, setEntries, mine: myEntry ? mine : null, remember, myRain, rainCount, toggleRain }}>
      {children}
    </Ctx.Provider>
  )
}
