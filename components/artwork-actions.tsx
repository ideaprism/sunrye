"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart, Share2, Check } from "lucide-react"

interface ArtworkActionsProps {
  title: string
  text: string
  url: string
}

export function ArtworkActions({ title, text, url }: ArtworkActionsProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [shareState, setShareState] = useState<"idle" | "copied">("idle")

  const handleShare = async () => {
    const shareUrl = window.location.href || url
    const shareData = { title, text, url: shareUrl }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        return
      }

      await navigator.clipboard.writeText(shareUrl)
      setShareState("copied")
      window.setTimeout(() => setShareState("idle"), 1800)
    } catch (error) {
      if ((error as DOMException).name === "AbortError") return
      try {
        await navigator.clipboard.writeText(shareUrl)
        setShareState("copied")
        window.setTimeout(() => setShareState("idle"), 1800)
      } catch {
        setShareState("idle")
      }
    }
  }

  return (
    <div className="grid grid-cols-[auto_1fr] gap-3 pt-4 md:flex md:gap-4 md:pt-6">
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={() => setIsLiked(!isLiked)}
        className={`h-12 w-14 md:w-auto ${isLiked ? "text-red-500 border-red-500" : ""}`}
        aria-label={isLiked ? "좋아요 취소" : "좋아요"}
      >
        <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
      </Button>
      <Button type="button" variant="default" size="lg" onClick={handleShare} className="h-12">
        {shareState === "copied" ? <Check className="mr-2 h-5 w-5" /> : <Share2 className="mr-2 h-5 w-5" />}
        {shareState === "copied" ? "링크 복사됨" : "작품 공유하기"}
      </Button>
    </div>
  )
}
