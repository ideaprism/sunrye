import Link from "next/link"
import { Mail, Phone, MapPin, Instagram, Facebook, ExternalLink, Users } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-pink-900 to-purple-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">김선례 작가</h3>
            <p className="text-gray-300 mb-4">자연과 꽃의 아름다움을 수채화로 표현하는 화가</p>
            <div className="flex space-x-4">
              <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">빠른 링크</h4>
            <div className="space-y-2">
              <Link href="/gallery" className="block text-gray-300 hover:text-white">
                갤러리
              </Link>
              <Link href="/about" className="block text-gray-300 hover:text-white">
                작가 소개
              </Link>
              <Link href="/news" className="block text-gray-300 hover:text-white">
                소식
              </Link>
              {/* <Link href="/contact" className="block text-gray-300 hover:text-white">
                문의
              </Link> */}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              가족 작가
            </h4>
            <div className="space-y-2">
              <Link href="/family" className="block text-gray-300 hover:text-white">
                가족 작가 소개
              </Link>
              <a
                href="https://v0-artist-website-design-beige.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-300 hover:text-white flex items-center"
              >
                정영삼 작가 사이트
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">연락처</h4>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>artist@example.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>010-1234-5678</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>서울시 종로구</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 김선례 작가. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
