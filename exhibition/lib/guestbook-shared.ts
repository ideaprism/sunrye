export type Entry = {
  id: string
  created_at: string
  updated_at?: string
  name: string
  message: string
  flower: string
  has_pin: boolean
}

export const PIN_RE = /^\d{4}$/
export const ID_RE = /^\d{13}-[0-9a-f]{8}$/

export function formatDate(iso: string) {
  const d = new Date(iso)
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d)
}
