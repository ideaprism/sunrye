import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArtworkActions } from "@/components/artwork-actions"
import { ArtworkZoom } from "@/components/artwork-zoom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { readAdminArtworks } from "@/lib/admin-artworks-store.mjs"
import { siteName } from "@/lib/artworks-data.mjs"
import { ArrowLeft } from "lucide-react"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const artwork = await getPublishedArtwork(id)

  if (!artwork) {
    return {
      title: siteName,
    }
  }

  const share = getArtworkShare(artwork)

  return {
    title: share.title,
    description: share.description,
    alternates: {
      canonical: share.url,
    },
    openGraph: {
      title: share.title,
      description: share.description,
      url: share.url,
      siteName,
      locale: "ko_KR",
      type: "article",
      images: [
        {
          url: share.image,
          width: 1200,
          height: 900,
          alt: share.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: share.title,
      description: share.description,
      images: [share.image],
    },
  }
}

export default async function ArtworkDetailPage({ params }: PageProps) {
  const { id } = await params
  const artwork = await getPublishedArtwork(id)

  if (!artwork) notFound()

  const artworks = (await readAdminArtworks()).filter((item) => item.status !== "draft")
  const relatedArtworks = getRelatedArtworks(artworks, artwork.id, artwork.category, 3)
  const share = getArtworkShare(artwork)

  return (
    <div className="min-h-screen pt-16">
      <div className="mx-auto max-w-7xl px-4 py-5 md:py-8">
        <Button variant="ghost" asChild className="mb-4 h-10 px-0 md:mb-6 md:px-4">
          <Link href="/gallery">
            <ArrowLeft className="mr-2 h-4 w-4" />
            갤러리로 돌아가기
          </Link>
        </Button>

        <div className="grid gap-7 lg:grid-cols-2 lg:gap-12">
          <section className="space-y-4">
            <ArtworkZoom src={artwork.image} alt={artwork.title} />
          </section>

          <section className="space-y-5 md:space-y-6">
            <div>
              <h1 className="mb-3 text-3xl font-bold leading-tight md:text-4xl">{artwork.title}</h1>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary" className="text-sm">
                  {artwork.medium}
                </Badge>
                <span className="text-sm text-muted-foreground">{artwork.year}</span>
                <span className="text-sm text-muted-foreground">{artwork.size}</span>
              </div>
            </div>

            <ArtworkActions title={share.title} text={share.description} url={share.url} />

            <div className="rounded-lg border bg-white/80 p-4 shadow-sm md:p-5">
              <h2 className="mb-3 text-base font-semibold">작품 정보</h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="block text-muted-foreground">크기</span>
                  <span>{artwork.size}</span>
                </div>
                <div>
                  <span className="block text-muted-foreground">기법</span>
                  <span>{artwork.technique || "종이에 수채화"}</span>
                </div>
                <div>
                  <span className="block text-muted-foreground">가격</span>
                  <span>{artwork.price || "문의"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <h2 className="mb-2 font-semibold">작품 설명</h2>
                <p className="leading-relaxed text-muted-foreground">{artwork.description}</p>
              </div>

              {artwork.inspiration ? (
                <div>
                  <h2 className="mb-2 font-semibold">영감</h2>
                  <p className="leading-relaxed text-muted-foreground">{artwork.inspiration}</p>
                </div>
              ) : null}

              <div>
                <h2 className="mb-2 font-semibold">작가</h2>
                <p className="text-muted-foreground">
                  김선례 작가는 자연과 꽃의 아름다움을 섬세하게 표현하는 수채화가입니다.
                </p>
              </div>
            </div>
          </section>
        </div>

        {relatedArtworks.length > 0 ? (
          <section className="mt-14 md:mt-20">
            <h2 className="mb-5 text-2xl font-bold md:mb-8 md:text-3xl">관련 작품</h2>
            <div className="grid gap-5 md:grid-cols-3 md:gap-6">
              {relatedArtworks.map((related) => (
                <Link key={related.id} href={`/gallery/${related.id}`}>
                  <Card className="group cursor-pointer overflow-hidden transition-shadow hover:shadow-lg">
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden">
                        <Image
                          src={related.image || "/placeholder.svg"}
                          alt={related.title}
                          width={480}
                          height={360}
                          className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105 md:h-60"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="mb-1 font-semibold">{related.title}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {related.medium}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  )
}

async function getPublishedArtwork(id: string) {
  const artworks = await readAdminArtworks()
  return artworks.find((artwork) => String(artwork.id) === String(id) && artwork.status !== "draft")
}

function getRelatedArtworks(artworks: Awaited<ReturnType<typeof readAdminArtworks>>, id: number, category: string, limit: number) {
  const sameCategory = artworks.filter((artwork) => artwork.id !== id && artwork.category === category)
  const others = artworks.filter((artwork) => artwork.id !== id && artwork.category !== category)
  return [...sameCategory, ...others].slice(0, limit)
}

function getArtworkShare(artwork: NonNullable<Awaited<ReturnType<typeof getPublishedArtwork>>>) {
  const origin = siteUrl.replace(/\/$/, "")
  const image = artwork.image.startsWith("http") ? artwork.image : `${origin}${artwork.image}`

  return {
    title: `${artwork.title} | ${siteName}`,
    description: artwork.summary || artwork.description,
    url: `${origin}/gallery/${artwork.id}`,
    image,
  }
}
