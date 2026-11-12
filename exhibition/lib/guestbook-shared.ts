export type Entry = {
  id: string
  created_at: string
  name: string
  message: string
  flower: string
}

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
