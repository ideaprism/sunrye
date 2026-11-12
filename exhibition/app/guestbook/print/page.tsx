import type { Metadata } from "next"
import FlowerIcon from "@/components/FlowerIcon"
import PrintButton from "@/components/PrintButton"
import { exhibition, flowers, works } from "@/lib/content"
import { listEntries } from "@/lib/guestbook-server"
import { isAdmin } from "@/lib/admin-auth"
import { redirect } from "next/navigation"
import { formatDate } from "@/lib/guestbook-shared"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "방명록 인쇄용", robots: { index: false, follow: false } }

export default async function PrintPage() {
  if (!(await isAdmin())) redirect("/admin")
  let entries = await listEntries().catch(() => [])
  entries = [...entries].reverse() // 인쇄본은 먼저 남긴 순서대로
  return (
    <main className="print-page">
      <style>{`
        @page { size: A4; margin: 16mm 14mm; }
        body { background: #fff; }
        .print-page { max-width: 186mm; margin: 0 auto; padding: 24px 16px; color: #1F1D1B; }
        .print-page h1 { margin: 0; font-size: 26px; color: #3D6B34; font-weight: 900; }
        .print-page .sub { margin: 4px 0 20px; font-size: 15px; color: #4A4540; }
        .print-list { columns: 2; column-gap: 8mm; }
        .print-item { break-inside: avoid; display: flex; gap: 10px; padding: 10px 0; border-bottom: 1px solid #E2DBD1; font-size: 14px; line-height: 1.6; }
        .print-item b { font-size: 15px; }
        .print-item .d { color: #5F5A55; font-size: 12px; margin-left: 6px; }
        .print-item p { margin: 2px 0 0; white-space: pre-wrap; overflow-wrap: anywhere; }
        @media print { .no-print { display: none !important; } .print-page { padding: 0; } }
      `}</style>
      <div className="no-print" style={{ marginBottom: 20, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <PrintButton />
        <span style={{ fontSize: 15, color: "#5F5A55" }}>A4 용지, 여백 기본값으로 인쇄하세요. PDF 저장도 됩니다.</span>
      </div>
      <h1>
        {exhibition.artistKo} 개인전 〈{exhibition.titlePlain}〉 방명록
      </h1>
      <p className="sub">
        {exhibition.periodFull} · {exhibition.venueKo} · 남겨 주신 마음 {entries.length}개
      </p>
      <h2 style={{ fontSize: 18, margin: "0 0 8px" }}>작품별 꽃에 물주기 (방문자가 실제로 준 수)</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, marginBottom: 24 }}>
        <tbody>
          {works.map((w) => (
            <tr key={w.no} style={{ borderBottom: "1px solid #E2DBD1" }}>
              <td style={{ padding: "4px 0", width: 32, color: "#5F5A55" }}>{w.no}</td>
              <td style={{ padding: "4px 0" }}>
                {w.title} <span style={{ color: "#5F5A55" }}>({w.year}, {w.size})</span>
              </td>
              <td style={{ padding: "4px 0", textAlign: "right", fontWeight: 800 }}>
                {entries.reduce((n, e) => n + (e.rain.includes(w.no) ? 1 : 0), 0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="print-list">
        {entries.map((e) => {
          const f = flowers.find((x) => x.id === e.flower) ?? flowers[0]
          return (
            <div key={e.id} className="print-item">
              <FlowerIcon petal={f.petal} core={f.core} size={28} />
              <div>
                <b>{e.name}</b>
                <span className="d">{formatDate(e.created_at)}</span>
                <p>{e.message}</p>
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}
