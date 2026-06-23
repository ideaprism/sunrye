import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getGalleryThumbnailSrc } from "@/lib/artwork-image-utils.mjs"
import { ExternalLink, Palette, Heart, Users } from "lucide-react"

export default function FamilyPage() {
  const familyArtists = [
    {
      id: 1,
      name: "정영삼 작가",
      relation: "가족",
      specialty: "회화, 현대미술",
      description:
        "자연과 생명의 아름다움을 캔버스에 담아내는 화가입니다. 동물들의 역동적인 움직임과 자연 풍경의 고요한 아름다움을 통해 생명력 넘치는 작품 세계를 구축하고 있습니다.",
      website: "https://youngsam.vercel.app/",
      image: getGalleryThumbnailSrc("/images/jung-youngsam-autumn-birch.jpg"),
      achievements: ["다수의 개인전 개최", "현대미술 작품 활동", "자연과 동물을 주제로 한 독창적 작품"],
      style: "현대 회화",
    },
  ]

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <Users className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">가족 작가</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            예술에 대한 열정이 가족 전체에 흐르고 있습니다. 각자의 개성과 전문 분야로 활동하는 가족 작가를 소개합니다.
          </p>
        </div>

        {/* Family Quote */}
        <Card className="mb-16 bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
          <CardContent className="p-8 text-center">
            <Heart className="h-8 w-8 text-primary mx-auto mb-4" />
            <blockquote className="text-lg italic text-muted-foreground mb-4">
              "예술은 우리 가족을 하나로 묶어주는 끈입니다. 서로 다른 장르와 스타일이지만, 아름다움을 추구하는 마음은
              같습니다."
            </blockquote>
            <cite className="text-sm text-muted-foreground">- 김선례 작가</cite>
          </CardContent>
        </Card>

        {/* Family Artists */}
        <div className="space-y-12">
          {familyArtists.map((artist, index) => (
            <Card key={artist.id} className="overflow-hidden shadow-lg">
              <CardContent className="p-0">
                <div className={`grid lg:grid-cols-2 gap-0 ${index % 2 === 1 ? "lg:grid-flow-col-dense" : ""}`}>
                  <div className={`relative h-80 lg:h-auto ${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                    <Image
                      src={artist.image || "/placeholder.svg"}
                      alt={`${artist.name} 홈페이지`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <Palette className="h-6 w-6 text-primary" />
                      <Badge variant="secondary">{artist.relation}</Badge>
                      <Badge variant="outline">{artist.style}</Badge>
                    </div>

                    <h2 className="text-3xl font-bold mb-3">{artist.name}</h2>
                    <p className="text-lg text-primary font-medium mb-4">{artist.specialty}</p>
                    <p className="text-muted-foreground mb-6 leading-relaxed">{artist.description}</p>

                    <div className="mb-6">
                      <h4 className="font-semibold mb-3">주요 활동</h4>
                      <ul className="space-y-1">
                        {artist.achievements.map((achievement, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-center">
                            <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-4">
                      <Button asChild className="flex-1">
                        <Link href={artist.website} target="_blank" rel="noopener noreferrer">
                          작품 보러가기
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Family Art Philosophy */}
        <Card className="mt-16">
          <CardHeader>
            <CardTitle className="text-center text-2xl">가족 예술 철학</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="p-4 bg-pink-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="font-semibold mb-2">사랑</h3>
                <p className="text-sm text-muted-foreground">
                  작품에 담긴 진심과 사랑이 관람자에게 전달되기를 바랍니다.
                </p>
              </div>
              <div>
                <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Palette className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">개성</h3>
                <p className="text-sm text-muted-foreground">각자의 독특한 시각과 표현 방식을 존중하고 발전시킵니다.</p>
              </div>
              <div>
                <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">소통</h3>
                <p className="text-sm text-muted-foreground">
                  예술을 통해 세상과 소통하고 긍정적인 영향을 주고자 합니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold mb-4">더 많은 작품을 만나보세요</h3>
          <p className="text-muted-foreground mb-8">
            정영삼 작가의 개별 웹사이트에서 더 다양한 작품과 이야기를 확인하실 수 있습니다.
          </p>
          <div className="flex justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="https://youngsam.vercel.app/" target="_blank" rel="noopener noreferrer">
                정영삼 작가 사이트
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
