import type { Metadata, Viewport } from "next"
import "./globals.css"
import { share } from "@/lib/content"
import { siteUrl } from "@/lib/site"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: share.title,
  description: share.description,
  openGraph: {
    type: "website",
    url: "/",
    locale: "ko_KR",
    title: share.title,
    description: share.description,
    siteName: share.title,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "부귀영화, 2026, 캔버스에 유화 — 붉은 모란 꽃무리" }],
  },
  twitter: { card: "summary_large_image", title: share.title, description: share.description, images: ["/og.jpg"] },
  icons: { icon: "/icon.svg" },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FBFAF7",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;800;900&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
