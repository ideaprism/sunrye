import type React from "react"
import type { Metadata } from "next"
import type { Viewport } from "next"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"

const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
const siteUrl = new URL(configuredSiteUrl)

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: "김선례 작가 - 자연과 꽃의 아름다움",
  description:
    "수채화로 꽃과 자연의 아름다움을 표현하는 김선례 작가의 작품을 만나보세요. 섬세한 붓터치로 담아낸 꽃들의 생명력과 아름다움을 감상하실 수 있습니다.",
  keywords: "김선례, 화가, 수채화, 꽃그림, 미술, 전시회, 갤러리",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "김선례 작가 - 자연과 꽃의 아름다움",
    description: "수채화로 꽃과 자연의 아름다움을 표현하는 김선례 작가의 작품을 만나보세요.",
    url: "/",
    siteName: "김선례 작가",
    type: "website",
    locale: "ko_KR",
    images: [
      {
        url: "/images/rose-garden.jpg",
        width: 1200,
        height: 900,
        alt: "김선례 작가 - 자연과 꽃의 아름다움",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "김선례 작가 - 자연과 꽃의 아름다움",
    description: "수채화로 꽃과 자연의 아름다움을 표현하는 김선례 작가의 작품을 만나보세요.",
    images: ["/images/rose-garden.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
  generator: "v0.app",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

const fontClassName = "font-sans"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={fontClassName}>
        <Navigation />
        <main>{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  )
}
