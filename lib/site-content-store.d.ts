export interface AboutContent {
  artistName: string
  subtitle: string
  intro: string
  familyIntro: string
  philosophy: string
  history: string[]
}

export interface NewsContent {
  id: number
  title: string
  date: string
  type: string
  image: string
  content: string
  location: string
  period: string
  status: "published" | "draft"
  createdAt?: string
  updatedAt?: string
}

export interface SiteContent {
  about: AboutContent
  news: NewsContent[]
}

export const newsTypes: string[]
export function getDefaultSiteContent(): SiteContent
export function normalizeAboutInput(input?: Record<string, unknown>, fallback?: AboutContent): AboutContent
export function normalizeNewsInput(input?: Record<string, unknown>, fallback?: Partial<NewsContent>): Omit<
  NewsContent,
  "id" | "createdAt" | "updatedAt"
>
export function getNextNewsId(news: Array<{ id: number }>): number
export function createNewsRecord(input: Record<string, unknown>, news: Array<{ id: number }>, imagePath?: string): NewsContent
export function updateNewsRecord(
  news: NewsContent[],
  id: number,
  patch: Record<string, unknown>,
  imagePath?: string,
): NewsContent[]
export function deleteNewsRecord(news: NewsContent[], id: number): NewsContent[]
export function readSiteContent(): Promise<SiteContent>
export function writeSiteContent(content: SiteContent): Promise<SiteContent>
export function getPublicSiteContent(content: SiteContent): SiteContent
