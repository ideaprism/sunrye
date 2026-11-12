// 정인영 도록: 꽃 대신 작가의 기하학적 색면을 닮은 '마음 조각' (팔각 보석 모양)
export default function FlowerIcon({ petal, core, size = 40 }: { petal: string; core: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" style={{ flexShrink: 0 }}>
      <polygon points="13,3 27,3 37,13 37,27 27,37 13,37 3,27 3,13" fill={petal} />
      <polygon points="20,8 32,20 20,32 8,20" fill={core} />
      <g stroke="#fff" strokeOpacity="0.55" strokeWidth="1">
        <line x1="13" y1="3" x2="20" y2="8" />
        <line x1="27" y1="3" x2="20" y2="8" />
        <line x1="37" y1="13" x2="32" y2="20" />
        <line x1="37" y1="27" x2="32" y2="20" />
        <line x1="27" y1="37" x2="20" y2="32" />
        <line x1="13" y1="37" x2="20" y2="32" />
        <line x1="3" y1="27" x2="8" y2="20" />
        <line x1="3" y1="13" x2="8" y2="20" />
        <line x1="8" y1="20" x2="32" y2="20" />
        <line x1="20" y1="8" x2="20" y2="32" />
      </g>
    </svg>
  )
}
