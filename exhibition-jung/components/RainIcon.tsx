// 활짝 웃는 꽃에 물뿌리개로 물을 주는 그림 (이모지 대신 직접 그린 그림)
export default function RainIcon({ size = 30 }: { size?: number }) {
  const petals = [0, 72, 144, 216, 288].map((a) => {
    const r = (a - 90) * (Math.PI / 180)
    return [13 + 6.6 * Math.cos(r), 26 + 6.6 * Math.sin(r)]
  })
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" style={{ flexShrink: 0, verticalAlign: "middle" }}>
      {/* 줄기와 잎 */}
      <path d="M13 31v8" stroke="#4E8A3E" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M13 36c-3.5-.4-5.5-2.4-5.8-4.6 3 .1 5.2 1.8 5.8 4.6z" fill="#6BAA4F" />
      {/* 꽃잎 */}
      {petals.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4.6" fill="#EC6A93" />
      ))}
      {/* 웃는 얼굴 */}
      <circle cx="13" cy="26" r="5.4" fill="#F7C948" />
      <circle cx="11.2" cy="25" r="0.9" fill="#5A3A1A" />
      <circle cx="14.8" cy="25" r="0.9" fill="#5A3A1A" />
      <path d="M10.6 27.2q2.4 2.6 4.8 0" fill="none" stroke="#5A3A1A" strokeWidth="1.1" strokeLinecap="round" />
      {/* 물뿌리개 */}
      <g transform="rotate(-24 29 11)">
        <rect x="24" y="6" width="11" height="9" rx="2" fill="#4F86C6" />
        <path d="M35 8.5c3 0 3.6 4.6 0 5" fill="none" stroke="#4F86C6" strokeWidth="1.8" />
        <path d="M24.5 10.5L17 8.2" stroke="#4F86C6" strokeWidth="2" strokeLinecap="round" />
        <rect x="15.3" y="6.4" width="2.6" height="3.8" rx="1" fill="#3A6EA8" transform="rotate(16 16.6 8.3)" />
      </g>
      {/* 물방울 */}
      <g fill="#6FA8DC">
        <path d="M17 14.2c.9 1.3 1.3 2 1.3 2.6a1.3 1.3 0 0 1-2.6 0c0-.6.4-1.3 1.3-2.6z" />
        <path d="M13.8 15.6c.8 1.1 1.1 1.7 1.1 2.2a1.1 1.1 0 0 1-2.2 0c0-.5.3-1.1 1.1-2.2z" />
        <path d="M19.6 17.2c.7 1 1 1.5 1 2a1 1 0 0 1-2 0c0-.5.3-1 1-2z" />
      </g>
    </svg>
  )
}
