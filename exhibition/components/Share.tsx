"use client"

import { useEffect, useState } from "react"
import { share } from "@/lib/content"

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement("textarea")
      ta.value = text
      ta.setAttribute("readonly", "")
      ta.style.position = "fixed"
      ta.style.opacity = "0"
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand("copy")
      document.body.removeChild(ta)
      return ok
    } catch {
      return false
    }
  }
}

export default function Share({ url: fallbackUrl }: { url: string }) {
  const [url, setUrl] = useState(fallbackUrl)
  const [copied, setCopied] = useState(false)
  const [showUrl, setShowUrl] = useState(false)

  useEffect(() => {
    setUrl(window.location.origin + "/")
  }, [])

  const doCopy = async () => {
    const ok = await copyText(url)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } else {
      setShowUrl(true)
    }
    return ok
  }

  const invite = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: share.title, text: share.text, url })
        return
      } catch (e) {
        if ((e as Error)?.name === "AbortError") return
      }
    }
    await doCopy()
    setShowUrl(true)
  }

  return (
    <section className="share" aria-labelledby="share-h">
      <span id="share-h" className="h">
        이 전시를
        <br />
        소중한 분께 알려 주세요
      </span>
      <button type="button" className="btn solid" onClick={invite}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.6 9.6 0 0 1-3.6-.7L3 21l1.6-4.6A8 8 0 0 1 3 11.5 8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z" />
        </svg>
        카카오톡으로 초대하기
      </button>
      <button type="button" className="btn" onClick={doCopy} aria-live="polite">
        {copied ? "링크를 복사했어요" : "링크 복사하기"}
      </button>
      {showUrl && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 16, color: "var(--sub)" }}>
            {copied ? "복사한 주소를 카카오톡 대화창에 붙여 넣어 주세요." : "아래 주소를 길게 눌러 복사해 주세요."}
          </span>
          <span className="url">{url}</span>
        </div>
      )}
    </section>
  )
}
