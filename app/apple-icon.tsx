import { ImageResponse } from "next/og"

export const size = {
  width: 180,
  height: 180,
}
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(135deg, #fff7ed, #fce7f3)",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "20%",
      }}
    >
      <svg width="124" height="124" viewBox="0 0 124 124" fill="none">
        <circle cx="62" cy="62" r="56" fill="#be185d" />
        <path
          d="M62 34c8 0 14 6 14 14 0 4-2 8-5 10 10-1 18 5 18 14 0 8-7 14-15 14-5 0-9-2-12-6-3 4-7 6-12 6-8 0-15-6-15-14 0-9 8-15 18-14-3-2-5-6-5-10 0-8 6-14 14-14Z"
          fill="#fff7ed"
        />
        <circle cx="62" cy="62" r="10" fill="#fbbf24" />
        <path d="M62 73v29" stroke="#fff7ed" strokeWidth="8" strokeLinecap="round" />
      </svg>
    </div>,
    {
      ...size,
    },
  )
}
