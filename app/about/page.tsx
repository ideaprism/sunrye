import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getGalleryThumbnailSrc } from "@/lib/artwork-image-utils.mjs"
import { readSiteContent } from "@/lib/site-content-store.mjs"
import { ExternalLink, Users } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AboutPage() {
  const { about } = await readSiteContent()

  return (
    <div className="min-h-screen bg-floralwhite pt-16">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-16 grid items-start gap-8 md:grid-cols-[minmax(0,1fr)_minmax(240px,340px)] lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] lg:gap-12">
          <div className="space-y-6">
            <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100">Artist</Badge>
            <h1 className="text-4xl font-bold">{about.artistName}</h1>
            <p className="text-xl text-muted-foreground">{about.subtitle}</p>
            <p className="whitespace-pre-line text-lg leading-8 text-muted-foreground">{about.intro}</p>
          </div>
          <div className="relative mx-auto aspect-[3/4] w-full max-w-[340px] overflow-hidden rounded-lg bg-rose-50 shadow-2xl md:mx-0 lg:max-w-[420px]">
            <Image
              src={getGalleryThumbnailSrc("/images/artist-photo.jpg")}
              alt={about.artistName}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 340px, (max-width: 1024px) 340px, 420px"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        <section className="mb-20">
          <Card className="border-pink-200 bg-gradient-to-r from-pink-50 to-purple-50">
            <CardContent className="p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="mb-4 flex items-center">
                    <Users className="mr-3 h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-bold">예술 가족</h2>
                  </div>
                  <p className="max-w-3xl leading-7 text-muted-foreground">{about.familyIntro}</p>
                </div>
                <Button asChild size="lg" className="shrink-0">
                  <Link href="/family">
                    가족 작가 보기
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-20">
          <h2 className="mb-8 text-3xl font-bold">작가 노트</h2>
          <Card>
            <CardContent className="p-8">
              <blockquote className="whitespace-pre-line text-lg italic leading-8 text-muted-foreground">
                "{about.philosophy}"
              </blockquote>
              <cite className="mt-4 block text-right text-sm text-muted-foreground">- {about.artistName}</cite>
            </CardContent>
          </Card>
        </section>

        <section>
          <h3 className="mb-6 text-xl font-semibold text-muted-foreground">활동 이력</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {about.history.map((item, index) => (
              <div key={`${item}-${index}`} className="rounded-lg bg-white/70 px-4 py-3 text-sm text-muted-foreground">
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
