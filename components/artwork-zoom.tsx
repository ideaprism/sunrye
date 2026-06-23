"use client"

import Image from "next/image"
import { ZoomIn } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { getGalleryThumbnailSrc } from "@/lib/artwork-image-utils.mjs"

interface ArtworkZoomProps {
  src: string
  alt: string
}

export function ArtworkZoom({ src, alt }: ArtworkZoomProps) {
  const previewSrc = getGalleryThumbnailSrc(src)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative group cursor-pointer">
          <Image
            src={previewSrc}
            alt={alt}
            width={600}
            height={800}
            className="w-full rounded-lg shadow-lg"
            sizes="(max-width: 1024px) 100vw, 50vw"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
            <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8" />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <Image
          src={previewSrc}
          alt={alt}
          width={800}
          height={1000}
          className="w-full h-auto"
          sizes="100vw"
          loading="lazy"
          decoding="async"
        />
      </DialogContent>
    </Dialog>
  )
}
