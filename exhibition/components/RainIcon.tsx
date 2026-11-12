// 해와 비구름 (이모지 대신 직접 그린 그림)
export default function RainIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0, verticalAlign: "-0.2em" }}>
      <circle cx="16.5" cy="6.5" r="3.6" fill="#F2C230" />
      <path d="M6.5 15.5a3.8 3.8 0 0 1-.4-7.6 5 5 0 0 1 9.6-.7 3.3 3.3 0 0 1 .8 6.5 3 3 0 0 1-1.5 1.8z" fill="#B9C3CF" />
      <g stroke="#4F86C6" strokeWidth="1.8" strokeLinecap="round">
        <line x1="8" y1="18" x2="7" y2="21" />
        <line x1="11.5" y1="18" x2="10.5" y2="21" />
        <line x1="15" y1="18" x2="14" y2="21" />
      </g>
    </svg>
  )
}
