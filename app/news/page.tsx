import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { getPublicSiteContent, readSiteContent } from "@/lib/site-content-store.mjs"
import { Calendar, MapPin } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function NewsPage() {
  const { news } = getPublicSiteContent(await readSiteContent())

  return (
    <div className="min-h-screen pt-16">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">소식</h1>
          <p className="text-xl text-muted-foreground">작가의 최근 활동과 전시 소식을 확인하세요.</p>
        </div>

        <div className="space-y-8">
          {news.map((item) => (
            <Card key={item.id} className="overflow-hidden transition-shadow hover:shadow-lg">
              <CardContent className="p-0">
                <div className="grid gap-0 md:grid-cols-3">
                  <div className="relative h-64 md:h-auto">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      width={480}
                      height={360}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6 md:col-span-2">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <Badge variant={getTypeVariant(item.type)}>{item.type}</Badge>
                      <span className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-4 w-4" />
                        {item.date}
                      </span>
                    </div>

                    <h2 className="mb-3 text-2xl font-bold">{item.title}</h2>
                    <p className="mb-4 whitespace-pre-line leading-relaxed text-muted-foreground">{item.content}</p>

                    {item.location ? (
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4" />
                          {item.location}
                        </span>
                        {item.period ? <span>기간: {item.period}</span> : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {news.length === 0 ? (
          <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
            아직 공개된 소식이 없습니다.
          </div>
        ) : null}
      </div>
    </div>
  )
}

function getTypeVariant(type: string) {
  switch (type) {
    case "전시":
      return "default"
    case "수상":
      return "secondary"
    case "미디어":
      return "destructive"
    default:
      return "outline"
  }
}
