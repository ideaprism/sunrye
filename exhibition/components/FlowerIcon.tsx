export default function FlowerIcon({ petal, core, size = 40 }: { petal: string; core: string; size?: number }) {
  const stroke = petal.toUpperCase() === "#F4EEE2" ? "#D8CDB8" : "none"
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" style={{ flexShrink: 0 }}>
      {[
        [20, 11],
        [28.6, 17.2],
        [25.3, 27.3],
        [14.7, 27.3],
        [11.4, 17.2],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={7} fill={petal} stroke={stroke} strokeWidth={1} />
      ))}
      <circle cx={20} cy={20} r={5.5} fill={core} />
    </svg>
  )
}
