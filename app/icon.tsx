import { ImageResponse } from "next/og"

export const size = {
  width: 32,
  height: 32,
}
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        background: "#be185d",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
      }}
    >
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path
          d="M11 3.5c2 0 3.4 1.5 3.4 3.2 0 .9-.4 1.8-1.1 2.3 2.4-.2 4.2 1.2 4.2 3.3 0 1.9-1.6 3.2-3.5 3.2-1.2 0-2.2-.5-3-1.4-.7.9-1.8 1.4-3 1.4-1.9 0-3.5-1.3-3.5-3.2 0-2.1 1.8-3.5 4.2-3.3-.7-.5-1.1-1.4-1.1-2.3 0-1.7 1.4-3.2 3.4-3.2Z"
          fill="#fff7ed"
        />
        <circle cx="11" cy="11" r="2" fill="#fbbf24" />
        <path d="M11 13.2v5" stroke="#fff7ed" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </div>,
    {
      ...size,
    },
  )
}
