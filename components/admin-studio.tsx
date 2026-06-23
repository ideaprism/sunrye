"use client"

import type React from "react"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowUpRight,
  CheckCircle2,
  FileText,
  ImagePlus,
  LayoutDashboard,
  Loader2,
  LogOut,
  Newspaper,
  Palette,
  Plus,
  Save,
  Search,
  Trash2,
  Upload,
  UserRound,
} from "lucide-react"

interface AdminArtwork {
  id: number
  title: string
  image: string
  year: string
  medium: string
  size: string
  category: string
  description: string
  summary: string
  inspiration: string
  price: string
  technique: string
  status: "published" | "draft"
}

interface ArtworkForm {
  id?: number
  title: string
  summary: string
  description: string
  inspiration: string
  category: string
  year: string
  medium: string
  size: string
  price: string
  technique: string
  status: "published" | "draft"
}

interface AboutForm {
  artistName: string
  subtitle: string
  intro: string
  familyIntro: string
  philosophy: string
  historyText: string
}

interface NewsItem {
  id: number
  title: string
  date: string
  type: string
  image: string
  content: string
  location: string
  period: string
  status: "published" | "draft"
}

interface NewsForm {
  id?: number
  title: string
  date: string
  type: string
  image: string
  content: string
  location: string
  period: string
  status: "published" | "draft"
}

interface SiteContent {
  about: {
    artistName: string
    subtitle: string
    intro: string
    familyIntro: string
    philosophy: string
    history: string[]
  }
  news: NewsItem[]
}

const categoryLabels: Record<string, string> = {
  landscape: "풍경화",
  flower: "꽃",
  fruit: "과일",
}

const newsTypes = ["전시", "수상", "공지", "활동", "미디어", "출간"]

const emptyArtworkForm: ArtworkForm = {
  title: "",
  summary: "",
  description: "",
  inspiration: "",
  category: "flower",
  year: String(new Date().getFullYear()),
  medium: "수채화",
  size: "",
  price: "문의",
  technique: "종이에 수채화",
  status: "published",
}

const emptyAboutForm: AboutForm = {
  artistName: "",
  subtitle: "",
  intro: "",
  familyIntro: "",
  philosophy: "",
  historyText: "",
}

const emptyNewsForm: NewsForm = {
  title: "",
  date: new Date().toISOString().slice(0, 10).replaceAll("-", "."),
  type: "공지",
  image: "",
  content: "",
  location: "",
  period: "",
  status: "published",
}

export function AdminStudio() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const [artworks, setArtworks] = useState<AdminArtwork[]>([])
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null)
  const [artworkForm, setArtworkForm] = useState<ArtworkForm>(emptyArtworkForm)
  const [aboutForm, setAboutForm] = useState<AboutForm>(emptyAboutForm)
  const [newsForm, setNewsForm] = useState<NewsForm>(emptyNewsForm)
  const [selectedArtworkId, setSelectedArtworkId] = useState<number | "new">("new")
  const [selectedNewsId, setSelectedNewsId] = useState<number | "new">("new")
  const [artworkImageFile, setArtworkImageFile] = useState<File | null>(null)
  const [newsImageFile, setNewsImageFile] = useState<File | null>(null)
  const [artworkImagePreview, setArtworkImagePreview] = useState("")
  const [newsImagePreview, setNewsImagePreview] = useState("")
  const [artworkSearchTerm, setArtworkSearchTerm] = useState("")
  const [newsSearchTerm, setNewsSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSavingArtwork, setIsSavingArtwork] = useState(false)
  const [isSavingAbout, setIsSavingAbout] = useState(false)
  const [isSavingNews, setIsSavingNews] = useState(false)
  const artworkFileInputRef = useRef<HTMLInputElement>(null)
  const newsFileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    const loggedIn = localStorage.getItem("adminLoggedIn") === "true"
    setIsAuthenticated(loggedIn)
    if (loggedIn) {
      void loadAdminData()
    } else {
      setIsLoading(false)
    }
  }, [])

  const filteredArtworks = useMemo(() => {
    const query = artworkSearchTerm.trim().toLowerCase()
    if (!query) return artworks

    return artworks.filter((artwork) =>
      [artwork.title, artwork.summary, artwork.description, categoryLabels[artwork.category]]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query)),
    )
  }, [artworks, artworkSearchTerm])

  const filteredNews = useMemo(() => {
    const query = newsSearchTerm.trim().toLowerCase()
    const news = siteContent?.news || []
    if (!query) return news

    return news.filter((item) =>
      [item.title, item.type, item.content, item.location].filter(Boolean).some((value) => value.toLowerCase().includes(query)),
    )
  }, [siteContent, newsSearchTerm])

  const publishedArtworkCount = artworks.filter((artwork) => artwork.status === "published").length
  const draftArtworkCount = artworks.length - publishedArtworkCount
  const publishedNewsCount = (siteContent?.news || []).filter((item) => item.status === "published").length
  const draftNewsCount = (siteContent?.news || []).length - publishedNewsCount

  async function loadAdminData() {
    setIsLoading(true)
    try {
      const [artworksResponse, contentResponse] = await Promise.all([
        fetch("/api/admin/artworks", { cache: "no-store" }),
        fetch("/api/admin/site-content", { cache: "no-store" }),
      ])
      const artworksData = await artworksResponse.json()
      const contentData = await contentResponse.json()
      setArtworks(artworksData.artworks || [])
      setSiteContent(contentData)
      setAboutForm(siteContentToAboutForm(contentData))
    } catch {
      toast({
        title: "관리 데이터를 불러오지 못했습니다",
        description: "개발 서버가 켜져 있는지 확인해 주세요.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  function login(event: React.FormEvent) {
    event.preventDefault()
    if (credentials.username === "admin" && credentials.password === "admin123") {
      localStorage.setItem("adminLoggedIn", "true")
      setIsAuthenticated(true)
      void loadAdminData()
      return
    }

    toast({
      title: "로그인 실패",
      description: "아이디는 admin, 비밀번호는 admin123 입니다.",
      variant: "destructive",
    })
  }

  function logout() {
    localStorage.removeItem("adminLoggedIn")
    setIsAuthenticated(false)
    setCredentials({ username: "", password: "" })
  }

  function startNewArtwork() {
    setSelectedArtworkId("new")
    setArtworkForm({ ...emptyArtworkForm, year: String(new Date().getFullYear()) })
    setArtworkImageFile(null)
    setArtworkImagePreview("")
    if (artworkFileInputRef.current) artworkFileInputRef.current.value = ""
  }

  function editArtwork(artwork: AdminArtwork) {
    setSelectedArtworkId(artwork.id)
    setArtworkForm({
      id: artwork.id,
      title: artwork.title,
      summary: artwork.summary || "",
      description: artwork.description || "",
      inspiration: artwork.inspiration || "",
      category: artwork.category || "flower",
      year: artwork.year || String(new Date().getFullYear()),
      medium: artwork.medium || "수채화",
      size: artwork.size || "",
      price: artwork.price || "문의",
      technique: artwork.technique || "종이에 수채화",
      status: artwork.status || "published",
    })
    setArtworkImageFile(null)
    setArtworkImagePreview(artwork.image)
    if (artworkFileInputRef.current) artworkFileInputRef.current.value = ""
  }

  function updateArtworkForm<K extends keyof ArtworkForm>(key: K, value: ArtworkForm[K]) {
    setArtworkForm((current) => ({ ...current, [key]: value }))
  }

  function chooseArtworkImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setArtworkImageFile(file)
    setArtworkImagePreview(URL.createObjectURL(file))
  }

  async function saveArtwork(event: React.FormEvent) {
    event.preventDefault()
    if (!artworkForm.title.trim()) {
      toast({ title: "작품명을 입력해 주세요", variant: "destructive" })
      return
    }

    setIsSavingArtwork(true)
    try {
      const body = new FormData()
      Object.entries(artworkForm).forEach(([key, value]) => {
        if (key !== "id" && value !== undefined) body.append(key, String(value))
      })
      if (artworkImageFile) body.append("image", artworkImageFile)

      const isEditing = typeof selectedArtworkId === "number"
      const response = await fetch(isEditing ? `/api/admin/artworks/${selectedArtworkId}` : "/api/admin/artworks", {
        method: isEditing ? "PATCH" : "POST",
        body,
      })
      if (!response.ok) throw new Error("save failed")

      const data = await response.json()
      setArtworks(data.artworks || [])
      if (data.artwork) editArtwork(data.artwork)
      toast({ title: isEditing ? "작품을 수정했습니다" : "새 작품을 등록했습니다" })
    } catch {
      toast({ title: "작품을 저장하지 못했습니다", variant: "destructive" })
    } finally {
      setIsSavingArtwork(false)
    }
  }

  async function deleteArtwork(artwork: AdminArtwork) {
    if (!window.confirm(`"${artwork.title}" 작품을 삭제할까요?`)) return

    try {
      const response = await fetch(`/api/admin/artworks/${artwork.id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("delete failed")
      const data = await response.json()
      setArtworks(data.artworks || [])
      if (selectedArtworkId === artwork.id) startNewArtwork()
      toast({ title: "작품을 삭제했습니다" })
    } catch {
      toast({ title: "작품을 삭제하지 못했습니다", variant: "destructive" })
    }
  }

  function updateAboutForm<K extends keyof AboutForm>(key: K, value: AboutForm[K]) {
    setAboutForm((current) => ({ ...current, [key]: value }))
  }

  async function saveAbout(event: React.FormEvent) {
    event.preventDefault()
    setIsSavingAbout(true)
    try {
      const response = await fetch("/api/admin/site-content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ about: aboutForm }),
      })
      if (!response.ok) throw new Error("save failed")
      const content = await response.json()
      setSiteContent(content)
      setAboutForm(siteContentToAboutForm(content))
      toast({ title: "작가소개를 저장했습니다" })
    } catch {
      toast({ title: "작가소개를 저장하지 못했습니다", variant: "destructive" })
    } finally {
      setIsSavingAbout(false)
    }
  }

  function startNewNews() {
    setSelectedNewsId("new")
    setNewsForm({ ...emptyNewsForm, date: new Date().toISOString().slice(0, 10).replaceAll("-", ".") })
    setNewsImageFile(null)
    setNewsImagePreview("")
    if (newsFileInputRef.current) newsFileInputRef.current.value = ""
  }

  function editNews(item: NewsItem) {
    setSelectedNewsId(item.id)
    setNewsForm({
      id: item.id,
      title: item.title,
      date: item.date,
      type: item.type,
      image: item.image,
      content: item.content,
      location: item.location,
      period: item.period,
      status: item.status,
    })
    setNewsImageFile(null)
    setNewsImagePreview(item.image)
    if (newsFileInputRef.current) newsFileInputRef.current.value = ""
  }

  function updateNewsForm<K extends keyof NewsForm>(key: K, value: NewsForm[K]) {
    setNewsForm((current) => ({ ...current, [key]: value }))
  }

  function chooseNewsImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setNewsImageFile(file)
    setNewsImagePreview(URL.createObjectURL(file))
  }

  async function saveNews(event: React.FormEvent) {
    event.preventDefault()
    if (!newsForm.title.trim()) {
      toast({ title: "소식 제목을 입력해 주세요", variant: "destructive" })
      return
    }

    setIsSavingNews(true)
    try {
      const body = new FormData()
      Object.entries(newsForm).forEach(([key, value]) => {
        if (key !== "id" && value !== undefined) body.append(key, String(value))
      })
      if (newsImageFile) body.append("image", newsImageFile)

      const isEditing = typeof selectedNewsId === "number"
      const response = await fetch(isEditing ? `/api/admin/news/${selectedNewsId}` : "/api/admin/news", {
        method: isEditing ? "PATCH" : "POST",
        body,
      })
      if (!response.ok) throw new Error("save failed")

      const data = await response.json()
      setSiteContent(data.content)
      if (data.newsItem) editNews(data.newsItem)
      toast({ title: isEditing ? "소식을 수정했습니다" : "새 소식을 등록했습니다" })
    } catch {
      toast({ title: "소식을 저장하지 못했습니다", variant: "destructive" })
    } finally {
      setIsSavingNews(false)
    }
  }

  async function deleteNews(item: NewsItem) {
    if (!window.confirm(`"${item.title}" 소식을 삭제할까요?`)) return

    try {
      const response = await fetch(`/api/admin/news/${item.id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("delete failed")
      const data = await response.json()
      setSiteContent(data.content)
      if (selectedNewsId === item.id) startNewNews()
      toast({ title: "소식을 삭제했습니다" })
    } catch {
      toast({ title: "소식을 삭제하지 못했습니다", variant: "destructive" })
    }
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#fbf7f4] px-4 py-16">
        <section className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[1.05fr_0.95fr] md:items-center">
          <div className="space-y-5">
            <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100">관리자 전용</Badge>
            <h1 className="text-4xl font-bold leading-tight text-slate-950 md:text-5xl">김선례 작가 웹사이트 관리실</h1>
            <p className="max-w-xl text-base leading-7 text-slate-600">
              작품, 작가소개, 소식 메뉴를 한 곳에서 관리합니다.
            </p>
          </div>

          <Card className="border-rose-100 shadow-sm">
            <CardHeader>
              <CardTitle>로그인</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={login} className="space-y-4">
                <Field label="아이디" htmlFor="username">
                  <Input
                    id="username"
                    value={credentials.username}
                    onChange={(event) => setCredentials((current) => ({ ...current, username: event.target.value }))}
                    placeholder="admin"
                  />
                </Field>
                <Field label="비밀번호" htmlFor="password">
                  <Input
                    id="password"
                    type="password"
                    value={credentials.password}
                    onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))}
                    placeholder="admin123"
                  />
                </Field>
                <Button type="submit" className="w-full">
                  관리 시작하기
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f8faf7]">
      <header className="border-b bg-white/95">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">김선례 작가 웹사이트</p>
              <h1 className="text-2xl font-bold text-slate-950">관리 스튜디오</h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href="/gallery" target="_blank">
                갤러리 보기
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/about" target="_blank">
                소개 보기
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              로그아웃
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
        <section className="grid gap-3 md:grid-cols-4">
          <MetricCard icon={ImagePlus} label="전체 작품" value={artworks.length} />
          <MetricCard icon={CheckCircle2} label="공개 작품" value={publishedArtworkCount} />
          <MetricCard icon={Newspaper} label="공개 소식" value={publishedNewsCount} />
          <MetricCard icon={FileText} label="임시 저장" value={draftArtworkCount + draftNewsCount} />
        </section>

        <Tabs defaultValue="artworks" className="space-y-5">
          <TabsList className="grid h-auto w-full grid-cols-3 bg-white p-1 md:w-[520px]">
            <TabsTrigger value="artworks">작품</TabsTrigger>
            <TabsTrigger value="about">작가소개</TabsTrigger>
            <TabsTrigger value="news">소식</TabsTrigger>
          </TabsList>

          <TabsContent value="artworks" className="space-y-6">
            <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle>작품 목록</CardTitle>
                    <Button size="sm" onClick={startNewArtwork}>
                      <Plus className="mr-2 h-4 w-4" />
                      새 작품
                    </Button>
                  </div>
                  <SearchInput value={artworkSearchTerm} onChange={setArtworkSearchTerm} placeholder="작품명, 설명, 분류 검색" />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <LoadingState text="작품을 불러오는 중" />
                  ) : (
                    <div className="space-y-3">
                      {filteredArtworks.map((artwork) => (
                        <div key={artwork.id} className="grid grid-cols-[76px_1fr_auto] gap-3 rounded-lg border bg-white p-2">
                          <button type="button" onClick={() => editArtwork(artwork)} className="overflow-hidden rounded-md">
                            <img src={artwork.image || "/placeholder.svg"} alt="" className="h-20 w-20 object-cover" />
                          </button>
                          <button type="button" onClick={() => editArtwork(artwork)} className="min-w-0 text-left">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="truncate font-semibold text-slate-950">{artwork.title}</p>
                              <Badge variant={artwork.status === "published" ? "default" : "secondary"}>
                                {artwork.status === "published" ? "공개" : "임시"}
                              </Badge>
                            </div>
                            <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                              {artwork.summary || artwork.description}
                            </p>
                            <p className="mt-2 text-xs text-slate-400">
                              {categoryLabels[artwork.category] || "기타"} · {artwork.year} · {artwork.size}
                            </p>
                          </button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => void deleteArtwork(artwork)}
                            aria-label={`${artwork.title} 삭제`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <ArtworkFormCard
                form={artworkForm}
                imagePreview={artworkImagePreview}
                fileInputRef={artworkFileInputRef}
                isSaving={isSavingArtwork}
                onSubmit={saveArtwork}
                onChange={updateArtworkForm}
                onImageChange={chooseArtworkImage}
                onReset={startNewArtwork}
              />
            </section>
          </TabsContent>

          <TabsContent value="about">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserRound className="h-5 w-5 text-rose-500" />
                  작가소개 관리
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={saveAbout} className="grid gap-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="작가명" htmlFor="artistName">
                      <Input
                        id="artistName"
                        value={aboutForm.artistName}
                        onChange={(event) => updateAboutForm("artistName", event.target.value)}
                      />
                    </Field>
                    <Field label="한 줄 소개" htmlFor="subtitle">
                      <Input
                        id="subtitle"
                        value={aboutForm.subtitle}
                        onChange={(event) => updateAboutForm("subtitle", event.target.value)}
                      />
                    </Field>
                  </div>
                  <Field label="작가 소개 본문" htmlFor="intro">
                    <Textarea
                      id="intro"
                      rows={6}
                      value={aboutForm.intro}
                      onChange={(event) => updateAboutForm("intro", event.target.value)}
                    />
                  </Field>
                  <Field label="예술 가족 소개" htmlFor="familyIntro">
                    <Textarea
                      id="familyIntro"
                      rows={4}
                      value={aboutForm.familyIntro}
                      onChange={(event) => updateAboutForm("familyIntro", event.target.value)}
                    />
                  </Field>
                  <Field label="작가 노트" htmlFor="philosophy">
                    <Textarea
                      id="philosophy"
                      rows={5}
                      value={aboutForm.philosophy}
                      onChange={(event) => updateAboutForm("philosophy", event.target.value)}
                    />
                  </Field>
                  <Field label="활동 이력" htmlFor="historyText">
                    <Textarea
                      id="historyText"
                      rows={8}
                      value={aboutForm.historyText}
                      onChange={(event) => updateAboutForm("historyText", event.target.value)}
                      placeholder="한 줄에 이력 하나씩 입력"
                    />
                  </Field>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSavingAbout}>
                      {isSavingAbout ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                      작가소개 저장
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="news" className="space-y-6">
            <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle>소식 목록</CardTitle>
                    <Button size="sm" onClick={startNewNews}>
                      <Plus className="mr-2 h-4 w-4" />
                      새 소식
                    </Button>
                  </div>
                  <SearchInput value={newsSearchTerm} onChange={setNewsSearchTerm} placeholder="제목, 내용, 분류 검색" />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <LoadingState text="소식을 불러오는 중" />
                  ) : (
                    <div className="space-y-3">
                      {filteredNews.map((item) => (
                        <div key={item.id} className="grid grid-cols-[76px_1fr_auto] gap-3 rounded-lg border bg-white p-2">
                          <button type="button" onClick={() => editNews(item)} className="overflow-hidden rounded-md">
                            <img src={item.image || "/placeholder.svg"} alt="" className="h-20 w-20 object-cover" />
                          </button>
                          <button type="button" onClick={() => editNews(item)} className="min-w-0 text-left">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="truncate font-semibold text-slate-950">{item.title}</p>
                              <Badge variant={item.status === "published" ? "default" : "secondary"}>
                                {item.status === "published" ? "공개" : "임시"}
                              </Badge>
                            </div>
                            <p className="mt-1 line-clamp-2 text-sm text-slate-500">{item.content}</p>
                            <p className="mt-2 text-xs text-slate-400">
                              {item.type} · {item.date}
                            </p>
                          </button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => void deleteNews(item)}
                            aria-label={`${item.title} 삭제`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <NewsFormCard
                form={newsForm}
                imagePreview={newsImagePreview}
                fileInputRef={newsFileInputRef}
                isSaving={isSavingNews}
                onSubmit={saveNews}
                onChange={updateNewsForm}
                onImageChange={chooseNewsImage}
                onReset={startNewNews}
              />
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

function ArtworkFormCard({
  form,
  imagePreview,
  fileInputRef,
  isSaving,
  onSubmit,
  onChange,
  onImageChange,
  onReset,
}: {
  form: ArtworkForm
  imagePreview: string
  fileInputRef: React.RefObject<HTMLInputElement>
  isSaving: boolean
  onSubmit: (event: React.FormEvent) => void
  onChange: <K extends keyof ArtworkForm>(key: K, value: ArtworkForm[K]) => void
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onReset: () => void
}) {
  return (
    <form onSubmit={onSubmit}>
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>{form.id ? "작품 수정" : "새 작품 등록"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <ImagePicker
            preview={imagePreview}
            fileInputRef={fileInputRef}
            onChange={onImageChange}
            label="작품 이미지 선택"
          />
          <Field label="작품명" htmlFor="artwork-title">
            <Input id="artwork-title" value={form.title} onChange={(event) => onChange("title", event.target.value)} required />
          </Field>
          <Field label="짧은 소개" htmlFor="artwork-summary">
            <Input id="artwork-summary" value={form.summary} onChange={(event) => onChange("summary", event.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="분류" htmlFor="artwork-category">
              <Select value={form.category} onValueChange={(value) => onChange("category", value)}>
                <SelectTrigger id="artwork-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="landscape">풍경화</SelectItem>
                  <SelectItem value="flower">꽃</SelectItem>
                  <SelectItem value="fruit">과일</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="공개 상태" htmlFor="artwork-status">
              <Select value={form.status} onValueChange={(value: "published" | "draft") => onChange("status", value)}>
                <SelectTrigger id="artwork-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">공개</SelectItem>
                  <SelectItem value="draft">임시 저장</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="연도" htmlFor="artwork-year">
              <Input id="artwork-year" value={form.year} onChange={(event) => onChange("year", event.target.value)} />
            </Field>
            <Field label="재료" htmlFor="artwork-medium">
              <Input id="artwork-medium" value={form.medium} onChange={(event) => onChange("medium", event.target.value)} />
            </Field>
            <Field label="크기" htmlFor="artwork-size">
              <Input id="artwork-size" value={form.size} onChange={(event) => onChange("size", event.target.value)} />
            </Field>
          </div>
          <Field label="작품 설명" htmlFor="artwork-description">
            <Textarea
              id="artwork-description"
              rows={5}
              value={form.description}
              onChange={(event) => onChange("description", event.target.value)}
            />
          </Field>
          <Field label="작품 배경/영감" htmlFor="artwork-inspiration">
            <Textarea
              id="artwork-inspiration"
              rows={3}
              value={form.inspiration}
              onChange={(event) => onChange("inspiration", event.target.value)}
            />
          </Field>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="기법" htmlFor="artwork-technique">
              <Input id="artwork-technique" value={form.technique} onChange={(event) => onChange("technique", event.target.value)} />
            </Field>
            <Field label="가격/문의" htmlFor="artwork-price">
              <Input id="artwork-price" value={form.price} onChange={(event) => onChange("price", event.target.value)} />
            </Field>
          </div>
          <FormActions isSaving={isSaving} onReset={onReset} submitLabel="작품 저장" />
        </CardContent>
      </Card>
    </form>
  )
}

function NewsFormCard({
  form,
  imagePreview,
  fileInputRef,
  isSaving,
  onSubmit,
  onChange,
  onImageChange,
  onReset,
}: {
  form: NewsForm
  imagePreview: string
  fileInputRef: React.RefObject<HTMLInputElement>
  isSaving: boolean
  onSubmit: (event: React.FormEvent) => void
  onChange: <K extends keyof NewsForm>(key: K, value: NewsForm[K]) => void
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onReset: () => void
}) {
  return (
    <form onSubmit={onSubmit}>
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>{form.id ? "소식 수정" : "새 소식 등록"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <ImagePicker preview={imagePreview} fileInputRef={fileInputRef} onChange={onImageChange} label="소식 이미지 선택" />
          <Field label="제목" htmlFor="news-title">
            <Input id="news-title" value={form.title} onChange={(event) => onChange("title", event.target.value)} required />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="분류" htmlFor="news-type">
              <Select value={form.type} onValueChange={(value) => onChange("type", value)}>
                <SelectTrigger id="news-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {newsTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="공개 상태" htmlFor="news-status">
              <Select value={form.status} onValueChange={(value: "published" | "draft") => onChange("status", value)}>
                <SelectTrigger id="news-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">공개</SelectItem>
                  <SelectItem value="draft">임시 저장</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="날짜" htmlFor="news-date">
              <Input id="news-date" value={form.date} onChange={(event) => onChange("date", event.target.value)} />
            </Field>
            <Field label="장소" htmlFor="news-location">
              <Input id="news-location" value={form.location} onChange={(event) => onChange("location", event.target.value)} />
            </Field>
          </div>
          <Field label="기간" htmlFor="news-period">
            <Input id="news-period" value={form.period} onChange={(event) => onChange("period", event.target.value)} />
          </Field>
          <Field label="본문" htmlFor="news-content">
            <Textarea id="news-content" rows={7} value={form.content} onChange={(event) => onChange("content", event.target.value)} />
          </Field>
          <FormActions isSaving={isSaving} onReset={onReset} submitLabel="소식 저장" />
        </CardContent>
      </Card>
    </form>
  )
}

function ImagePicker({
  preview,
  fileInputRef,
  onChange,
  label,
}: {
  preview: string
  fileInputRef: React.RefObject<HTMLInputElement>
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  label: string
}) {
  return (
    <div className="grid gap-4 md:grid-cols-[180px_1fr] md:items-end">
      <div className="aspect-square overflow-hidden rounded-lg border bg-white">
        {preview ? (
          <img src={preview} alt="미리보기" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
            <ImagePlus className="h-10 w-10" />
            <span className="text-sm">이미지 없음</span>
          </div>
        )}
      </div>
      <div>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onChange} />
        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
          <Upload className="mr-2 h-4 w-4" />
          {label}
        </Button>
      </div>
    </div>
  )
}

function FormActions({
  isSaving,
  onReset,
  submitLabel,
}: {
  isSaving: boolean
  onReset: () => void
  submitLabel: string
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
      <Button type="button" variant="outline" onClick={onReset}>
        입력 비우기
      </Button>
      <Button type="submit" disabled={isSaving}>
        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
        {submitLabel}
      </Button>
    </div>
  )
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: number | string
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">{value}</p>
        </div>
        <Icon className="h-5 w-5 text-rose-500" />
      </div>
    </div>
  )
}

function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <Input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="pl-9" />
    </div>
  )
}

function LoadingState({ text }: { text: string }) {
  return (
    <div className="flex h-52 items-center justify-center text-slate-500">
      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      {text}
    </div>
  )
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  )
}

function siteContentToAboutForm(content: SiteContent): AboutForm {
  return {
    artistName: content.about.artistName,
    subtitle: content.about.subtitle,
    intro: content.about.intro,
    familyIntro: content.about.familyIntro,
    philosophy: content.about.philosophy,
    historyText: content.about.history.join("\n"),
  }
}
