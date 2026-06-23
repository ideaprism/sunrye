export interface Artwork {
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
}

export const siteName: string
export const categories: Array<{ value: string; label: string }>
export const artworks: Artwork[]
export function getArtworkById(id: string | number): Artwork
export function getRelatedArtworks(id: string | number, limit?: number): Artwork[]
export function normalizeBaseUrl(baseUrl?: string): string
export function getArtworkShareMetadata(
  id: string | number,
  baseUrl?: string,
): {
  title: string
  description: string
  url: string
  image: string
}
