import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getGalleryThumbnailSrc } from "@/lib/artwork-image-utils.mjs"
import { ArrowRight, MapPin } from "lucide-react"

export default function HomePage() {
  const featuredArtworks = [
    {
      id: 1,
      title: "벚꽃 내린 오솔길의 꿈",
      image: "/images/spring-path.jpg",
      year: "2024",
      medium: "수채화",
    },
    {
      id: 9,
      title: "햇살을 품은 해바라기의 미소",
      image: "/images/sunflower-window.jpg",
      year: "2024",
      medium: "수채화",
    },
    {
      id: 6,
      title: "달빛 같은 모란의 춤",
      image: "/images/white-peonies.jpg",
      year: "2024",
      medium: "수채화",
    },
  ]

  const recentNews = [
    {
      id: 1,
      title: "제13회 서울 현대미술관 레지던시 개인전 개최",
      date: "2025.06.25",
      location: "인사동 한국미술관 2층",
      type: "전시회",
    },
    {
      id: 2,
      title: "국가보훈문화예술협회 초대작가 선정",
      date: "2025.01.15",
      type: "수상",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        id="hero"
        className="relative flex min-h-[78svh] items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 md:h-screen"
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0">
          <Image
            src={getGalleryThumbnailSrc("/images/rose-garden.jpg")}
            alt="배경 이미지"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="mb-4 text-4xl font-bold md:mb-6 md:text-7xl">김선례 작가</h1>
          <p className="mb-6 text-lg opacity-95 md:mb-8 md:text-2xl">자연과 꽃의 아름다움을 수채화로 표현하는 화가</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-black hover:bg-gray-100">
              <Link href="/gallery">
                작품 감상하기 <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" className="bg-white text-black hover:bg-gray-100">
              <Link href="/about">작가 소개</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Artworks */}
      <section className="px-4 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center md:mb-16">
            <h2 className="mb-3 text-3xl font-bold md:mb-4 md:text-4xl">대표 작품</h2>
            <p className="text-base text-muted-foreground md:text-xl">작가의 예술 세계를 대표하는 주요 작품들을 만나보세요</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {featuredArtworks.map((artwork) => (
              <Link key={artwork.id} href={`/gallery/${artwork.id}`} className="block">
                <Card className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <Image
                        src={getGalleryThumbnailSrc(artwork.image)}
                        alt={artwork.title}
                        width={800}
                        height={600}
                        className="h-[76vw] max-h-[340px] min-h-[260px] w-full object-cover transition-transform duration-300 group-hover:scale-105 md:h-80"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{artwork.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="secondary">{artwork.medium}</Badge>
                        <span>{artwork.year}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8 md:mt-12">
            <Button asChild size="lg" variant="outline">
              <Link href="/gallery">
                모든 작품 보기 <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Artist Introduction */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">작가 소개</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                김선례 작가는 젊은시절 그림 그리기를 좋아했지만 아내이자 부모로서의 삶을 살았습니다. 70에 접어들면서
                다시금 붓을 잡고, 살면서 느꼈던 꽃의 아름다움과 일상의 소중함을 캔버스에 담아내는 작업을 하고 있습니다.
                환하게 미소짓는 꽃처럼 작가도 기쁜 마음으로 그림을 그리고 있습니다.
              </p>
              <Button asChild size="lg">
                <Link href="/about">
                  자세히 보기 <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <Image
                src={getGalleryThumbnailSrc("/images/artist-photo.jpg")}
                alt="김선례 작가"
                width={500}
                height={600}
                className="rounded-lg shadow-2xl"
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Recent News */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">최신 소식</h2>
            <p className="text-xl text-muted-foreground">작가의 최근 활동과 전시 소식을 확인하세요</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {recentNews.map((news) => (
              <Card key={news.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant={news.type === "전시회" ? "default" : "secondary"}>{news.type}</Badge>
                    <span className="text-sm text-muted-foreground">{news.date}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{news.title}</h3>
                  {news.location && (
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{news.location}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
              <Link href="/news">
                모든 소식 보기 <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
