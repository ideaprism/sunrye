// 물뿌리개 (선택 표시용, 크게)
export default function WateringCan({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="23" fill="#3A6EA8" stroke="#fff" strokeWidth="2" />
      {/* 뒤 손잡이 */}
      <path d="M34 20.5c6 0 6 10.5 0 11" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
      {/* 몸통 (아래가 넓은 통) */}
      <path d="M21.5 19h12l1.6 13.4a2 2 0 0 1-2 2.2H21.9a2 2 0 0 1-2-2.2z" fill="#fff" />
      <rect x="20.5" y="17" width="14" height="3" rx="1.5" fill="#fff" />
      {/* 길게 뻗은 주둥이 */}
      <path d="M21 27L11.5 18.5" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <path d="M8 15.8l4.6-1.6 2.2 5.6-4.4 1.8z" fill="#fff" />
      {/* 물방울 */}
      <g fill="#BFE0FF">
        <circle cx="8.6" cy="25" r="1.7" />
        <circle cx="12.4" cy="27.8" r="1.7" />
        <circle cx="7.4" cy="31" r="1.7" />
      </g>
    </svg>
  )
}
