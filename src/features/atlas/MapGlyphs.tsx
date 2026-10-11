import styles from './AtlasView.module.css'

/**
 * Static SVG `<defs>` shared by the whole chart: a gentle wave pattern for open sea. Rendered once;
 * cheap, since filters/patterns are not re-evaluated per zoom frame.
 */
export function MapDefs() {
  return (
    <defs>
      <pattern
        id="seaWaves"
        width="34"
        height="14"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(0)"
      >
        <path
          d="M0,8 Q8.5,2 17,8 T34,8"
          fill="none"
          stroke="var(--chart-texture)"
          strokeWidth="0.5"
          opacity="0.4"
        />
        <path
          d="M0,13 Q8.5,8 17,13 T34,13"
          fill="none"
          stroke="var(--chart-texture)"
          strokeWidth="0.4"
          opacity="0.28"
        />
      </pattern>
    </defs>
  )
}

/** A small static compass rose anchoring one corner of the chart. */
export function CompassRose({ size = 72 }: { size?: number }) {
  const ticks = Array.from({ length: 16 }, (_, i) => i)
  return (
    <svg
      className={styles.compassRose}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden
    >
      <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="0.8" />
      {ticks.map((i) => {
        const angle = (i / 16) * Math.PI * 2 - Math.PI / 2
        const long = i % 4 === 0
        const r1 = long ? 30 : 36
        return (
          <line
            key={i}
            x1={50 + Math.cos(angle) * r1}
            y1={50 + Math.sin(angle) * r1}
            x2={50 + Math.cos(angle) * 42}
            y2={50 + Math.sin(angle) * 42}
            stroke="currentColor"
            strokeWidth={long ? 0.9 : 0.45}
          />
        )
      })}
      <path d="M50,10 L55,50 L50,90 L45,50 Z" fill="currentColor" opacity="0.8" />
      <path d="M10,50 L50,46 L90,50 L50,54 Z" fill="currentColor" opacity="0.55" />
      <text
        x="50"
        y="7"
        textAnchor="middle"
        fontSize="8"
        fill="currentColor"
        fontFamily="var(--font-display)"
      >
        N
      </text>
    </svg>
  )
}
