"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ExternalLink, Flower2, Menu } from "lucide-react"

const navItems = [
  { href: "/", label: "홈" },
  { href: "/gallery", label: "갤러리" },
  { href: "/about", label: "작가 소개" },
  { href: "/news", label: "소식" },
  { href: "/family", label: "가족 작가" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  if (pathname?.startsWith("/admin")) return null

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-pink-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" onClick={scrollToTop} className="flex items-center space-x-2">
            <Flower2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">김선례 작가</span>
          </Link>

          <div className="hidden items-center space-x-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 transition-colors hover:text-primary"
                onClick={item.href === "/" ? scrollToTop : undefined}
              >
                {item.label}
                {item.href === "/family" ? <ExternalLink className="ml-1 inline h-3 w-3" /> : null}
              </Link>
            ))}
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="메뉴 열기">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="mt-8 flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center text-lg text-gray-700 transition-colors hover:text-primary"
                    onClick={() => {
                      setIsOpen(false)
                      if (item.href === "/") scrollToTop()
                    }}
                  >
                    {item.label}
                    {item.href === "/family" ? <ExternalLink className="ml-2 h-4 w-4" /> : null}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
