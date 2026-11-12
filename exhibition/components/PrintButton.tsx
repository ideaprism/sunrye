"use client"

export default function PrintButton() {
  return (
    <button type="button" className="btn solid" style={{ width: "auto", padding: "0 24px" }} onClick={() => window.print()}>
      인쇄하기
    </button>
  )
}
