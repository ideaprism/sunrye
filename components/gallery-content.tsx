"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { categories, artworks as seedArtworks, type Artwork } from "@/lib/artworks-data.mjs"
import { getGalleryThumbnailSrc } from "@/lib/artwork-image-utils.mjs"
import { Search, SlidersHorizontal } from "lucide-react"

export function GalleryContent() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [galleryArtworks, setGalleryArtworks] = useState<Artwork[]>(seedArtworks)

  useEffect(() => {
    let cancelled = false

    async function loadManagedArtworks() {
      try {
        const response = await fetch("/api/artworks", { cache: "no-store" })
        if (!response.ok) return
        const data = await response.json()
        if (!cancelled && Array.isArray(data.artworks)) {
          setGalleryArtworks(data.artworks)
        }
      } catch {
        // Keep the bundled artwork list when the admin API is unavailable.
      }
    }

    void loadManagedArtworks()
    return () => {
      cancelled = true
    }
  }, [])

  const filteredArtworks = useMemo(() => {
    return galleryArtworks.filter((artwork) => {
      const matchesCategory = selectedCategory === "all" || artwork.category === selectedCategory
      const query = searchTerm.trim().toLowerCase()
      const matchesSearch =
        query === "" ||
        artwork.title.toLowerCase().includes(query) ||
        artwork.medium.toLowerCase().includes(query) ||
        artwork.description.toLowerCase().includes(query)
      return matchesCategory && matchesSearch
    })
  }, [galleryArtworks, selectedCategory, searchTerm])

  const clearSearch = () => {
    setSearchTerm("")
  }

  const showAllArtworks = () => {
    setSelectedCategory("all")
    setSearchTerm("")
  }

  return (
    <>
      <section className="mb-5 space-y-4 md:mb-8">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            총 <span className="font-semibold text-foreground">{filteredArtworks.length}</span>개의 작품
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="md:hidden"
            onClick={() => setShowSearch((current) => !current)}
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            검색
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 md:hidden">
          {categories.map((category) => (
            <button
              key={category.value}
              type="button"
              onClick={() => setSelectedCategory(category.value)}
              className={`h-9 shrink-0 rounded-full border px-4 text-sm font-medium transition-colors ${
                selectedCategory === category.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-pink-100 bg-white text-gray-700"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className={`${showSearch ? "block" : "hidden"} md:flex md:flex-row md:gap-4`}>
          <div className="relative mb-3 flex-1 md:mb-0">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="작품명, 재료, 설명으로 검색"
              value={searchTerm}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(event.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="hidden w-full md:flex md:w-48">
              <SelectValue placeholder="카테고리 선택" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      {filteredArtworks.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {filteredArtworks.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <div className="mx-auto max-w-md">
            <Search className="mx-auto mb-4 h-14 w-14 text-muted-foreground" />
            <h3 className="mb-2 text-xl font-semibold">검색 결과가 없습니다</h3>
            <p className="mb-6 text-muted-foreground">다른 검색어를 입력하거나 필터를 초기화해 보세요.</p>
            <div className="flex justify-center gap-2">
              <Button type="button" onClick={clearSearch}>
                검색어 지우기
              </Button>
              <Button type="button" variant="outline" onClick={showAllArtworks}>
                전체 보기
              </Button>
            </div>
          </div>
        </div>
      )}

      {selectedCategory === "all" && searchTerm === "" && (
        <div className="mt-10 grid grid-cols-3 gap-3 md:mt-16 md:grid-cols-4 md:gap-4">
          {categories.slice(1).map((category) => {
            const count = galleryArtworks.filter((artwork) => artwork.category === category.value).length
            return (
              <button
                key={category.value}
                type="button"
                className="rounded-lg bg-white p-4 text-center shadow-sm transition-shadow hover:shadow-md"
                onClick={() => setSelectedCategory(category.value)}
              >
                <div className="mb-1 text-2xl font-bold text-primary">{count}</div>
                <div className="text-sm text-muted-foreground">{category.label}</div>
              </button>
            )
          })}
        </div>
      )}
    </>
  )
}

interface ArtworkCardProps {
  artwork: Artwork
}

function ArtworkCard({ artwork }: ArtworkCardProps) {
  const imageSrc = getGalleryThumbnailSrc(artwork.image)

  return (
    <Link href={`/gallery/${artwork.id}`} className="block">
      <Card className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl md:card-hover">
        <CardContent className="p-0">
          <div className="relative overflow-hidden">
            <Image
              src={imageSrc}
              alt={artwork.title}
              width={640}
              height={640}
              className="h-[76vw] max-h-[340px] min-h-[260px] w-full object-cover transition-transform duration-300 group-hover:scale-105 md:h-80"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="p-5 md:p-6">
            <h3 className="mb-2 text-lg font-semibold leading-snug transition-colors group-hover:text-primary md:text-xl">
              {artwork.title}
            </h3>
            <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{artwork.summary}</p>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{artwork.medium}</Badge>
                <span className="text-sm text-muted-foreground">{artwork.year}</span>
              </div>
              <span className="text-sm text-muted-foreground">{artwork.size}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
