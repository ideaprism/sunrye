import type { Metadata } from "next"
import AdminApp from "@/components/AdminApp"

export const metadata: Metadata = { title: "관리자 — 김선례 개인전", robots: { index: false, follow: false } }

export default function AdminPage() {
  return <AdminApp />
}
