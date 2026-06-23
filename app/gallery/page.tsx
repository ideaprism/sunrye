import { Suspense } from "react"
import { GalleryContent } from "@/components/gallery-content"
import { Skeleton } from "@/components/ui/skeleton"

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 pt-16">
      <div className="mx-auto max-w-7xl px-4 py-6 md:py-12">
        <div className="mb-6 text-center md:mb-12">
          <h1 className="mb-3 text-3xl font-bold md:mb-4 md:text-4xl">김선례 작가 갤러리</h1>
          <p className="text-base text-muted-foreground md:text-xl">
            자연과 꽃의 아름다움을 담은 수채화 작품들을 감상하세요.
          </p>
        </div>

        <Suspense fallback={<GalleryLoading />}>
          <GalleryContent />
        </Suspense>
      </div>
    </div>
  )
}

function GalleryLoading() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-48" />
      </div>
      <Skeleton className="h-6 w-48" />
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-4">
            <Skeleton className="h-80 w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex justify-between">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
