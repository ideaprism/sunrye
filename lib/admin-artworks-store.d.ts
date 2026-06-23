export interface AdminArtwork {
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
  createdAt?: string
  updatedAt?: string
}

export const artworkCategories: Array<{ value: string; label: string }>
export function getNextArtworkId(artworks: Array<{ id: number }>): number
export function normalizeArtworkInput(input?: Record<string, unknown>, fallback?: Record<string, unknown>): Omit<
  AdminArtwork,
  "id" | "image" | "createdAt" | "updatedAt"
>
export function createArtworkRecord(
  input: Record<string, unknown>,
  artworks: Array<{ id: number }>,
  imagePath?: string,
): AdminArtwork
export function updateArtworkRecord(
  artworks: AdminArtwork[],
  id: number,
  patch: Record<string, unknown>,
  imagePath?: string,
): AdminArtwork[]
export function deleteArtworkRecord(artworks: AdminArtwork[], id: number): AdminArtwork[]
export function getSeedAdminArtworks(): AdminArtwork[]
export function readAdminArtworks(): Promise<AdminArtwork[]>
export function writeAdminArtworks(artworks: AdminArtwork[]): Promise<AdminArtwork[]>
export function saveArtworkImage(file: unknown): Promise<string>
export function removeUploadedImage(imagePath: string): Promise<void>
