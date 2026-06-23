"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, Clock, Instagram, Facebook } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "",
    artworkTitle: "",
    message: "",
  })
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 실제로는 서버로 데이터를 전송
    toast({
      title: "문의가 접수되었습니다",
      description: "빠른 시일 내에 연락드리겠습니다.",
    })
    setFormData({
      name: "",
      email: "",
      phone: "",
      inquiryType: "",
      artworkTitle: "",
      message: "",
    })
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-rose-600">김선례 작가 작품 문의</h1>
          <p className="text-xl text-muted-foreground">
            꽃 작품 구매나 전시 관련 문의사항이 있으시면 언제든 연락주세요
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">문의 양식</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">성함 *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일 *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">연락처</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="010-0000-0000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inquiryType">문의 유형 *</Label>
                  <Select value={formData.inquiryType} onValueChange={(value) => handleChange("inquiryType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="문의 유형을 선택해주세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="purchase">작품 구매 문의</SelectItem>
                      <SelectItem value="exhibition">전시 관련 문의</SelectItem>
                      <SelectItem value="collaboration">협업 제안</SelectItem>
                      <SelectItem value="interview">인터뷰 요청</SelectItem>
                      <SelectItem value="other">기타 문의</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.inquiryType === "purchase" && (
                  <div className="space-y-2">
                    <Label htmlFor="artworkTitle">관심 작품명</Label>
                    <Input
                      id="artworkTitle"
                      value={formData.artworkTitle}
                      onChange={(e) => handleChange("artworkTitle", e.target.value)}
                      placeholder="예: 벚꽃 내린 오솔길의 꿈"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="message">문의 내용 *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    rows={5}
                    required
                    placeholder="문의하실 내용을 자세히 적어주세요"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full bg-rose-500 text-white hover:bg-rose-700">
                  문의 보내기
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">연락처 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-rose-500" />
                  <div>
                    <p className="font-medium">이메일</p>
                    <p className="text-muted-foreground">artist@example.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-rose-500" />
                  <div>
                    <p className="font-medium">전화번호</p>
                    <p className="text-muted-foreground">010-1234-5678</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-rose-500" />
                  <div>
                    <p className="font-medium">주소</p>
                    <p className="text-muted-foreground">서울시 종로구 인사동길 12</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-rose-500" />
                  <div>
                    <p className="font-medium">응답 시간</p>
                    <p className="text-muted-foreground">평일 1-2일 내 답변</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">SNS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Button variant="outline" size="icon">
                    <Instagram className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Facebook className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  SNS를 통해서도 작가의 일상과 작품 소식을 만나보실 수 있습니다.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">작품 구매 안내</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>• 모든 작품은 작가 직접 판매합니다</p>
                <p>• 작품 가격은 크기와 재료에 따라 상이합니다</p>
                <p>• 배송비는 별도이며, 안전한 포장으로 배송됩니다</p>
                <p>• 작품 인증서가 함께 제공됩니다</p>
                <p>• 맞춤 제작도 가능합니다 (별도 문의)</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
