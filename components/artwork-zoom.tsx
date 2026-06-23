"use client"

import Image from "next/image"
import { ZoomIn } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

interface ArtworkZoomProps {
  src: string
  alt: string
}

export function ArtworkZoom({ src, alt }: ArtworkZoomProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative group cursor-pointer">
          <Image
            src={src || "/placeholder.svg"}
            alt={alt}
            width={600}
            height={800}
            className="w-full rounded-lg shadow-lg"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
            <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8" />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <Image src={src || "/placeholder.svg"} alt={alt} width={800} height={1000} className="w-full h-auto" />
      </DialogContent>
    </Dialog>
  )
}
