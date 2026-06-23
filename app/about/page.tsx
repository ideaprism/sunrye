import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { readSiteContent } from "@/lib/site-content-store.mjs"
import { ExternalLink, Users } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AboutPage() {
  const { about } = await readSiteContent()

  return (
    <div className="min-h-screen bg-floralwhite pt-16">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-20 grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100">Artist</Badge>
            <h1 className="text-4xl font-bold">{about.artistName}</h1>
            <p className="text-xl text-muted-foreground">{about.subtitle}</p>
            <p className="whitespace-pre-line text-lg leading-8 text-muted-foreground">{about.intro}</p>
          </div>
          <div className="relative">
            <Image
              src="/images/artist-photo.jpg"
              alt={about.artistName}
              width={500}
              height={600}
              className="rounded-lg shadow-2xl"
              priority
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
