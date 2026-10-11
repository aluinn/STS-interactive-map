import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { smoothstep, lerpKeyframes } from '../utils/easing'
import styles from './CinematicIntro.module.css'

// The globe pulls in the detailed world geometry (~1 MB), so it loads as a
// separate chunk instead of inflating the initial bundle.
const IntroGlobe = lazy(() => import('./IntroGlobe').then((m) => ({ default: m.IntroGlobe })))

interface Star {
  x: number
  y: number
  size: number
  opacity: number
}

// Generated once at module load, not per render/mount — the exact
// positions are decorative and don't need to vary, and recomputing them
// with Math.random() inside the component would make it impure.
const STAR_FIELD: Star[] = Array.from({ length: 70 }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 1.6 + 0.4,
  opacity: Math.random() * 0.6 + 0.25,
}))

interface CinematicIntroProps {
  reducedMotion: boolean
  /** Fired continuously (every rAF tick) with 0..1 progress so the caller
   * can fade/enable the real app behind this overlay without re-rendering
   * this component's parent on every scroll frame. */
  onProgress: (p: number) => void
  /** Fired once, when the sequence should end (reached the bottom, or the
   * visitor clicked "Skip introduction"). */
  onComplete: () => void
}

/**
 * Cinematic, scroll-controlled opening sequence: an antique globe fades in,
 * grows as the visitor scrolls, and crossfades into the real interactive
 * map underneath (rendered the whole time by the caller, just hidden/inert
 * behind this overlay). Pure CSS transform/opacity/mask — no animation
 * library; the project has none installed, and this doesn't need one.
 */
export function CinematicIntro({ reducedMotion, onProgress, onComplete }: CinematicIntroProps) {
  const spacerRef = useRef<HTMLDivElement>(null)
  const finishedRef = useRef(false)
  const starElements = useMemo(
    () =>
      STAR_FIELD.map((s, i) => (
        <span
          key={i}
          className={styles.star}
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.opacity,
          }}
        />
      )),
    [],
  )

  function finish() {
    if (finishedRef.current) return
    finishedRef.current = true
    onComplete()
  }

  const handleProgressTick = useMemo(
    () => (p: number) => {
      onProgress(p)
      if (p >= 0.999) finish()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const progress = useScrollProgress(
    reducedMotion ? { current: null } : spacerRef,
    handleProgressTick,
  )

  // Reduced-motion: a brief, non-scroll-linked fade from globe to map.
  const [reducedFading, setReducedFading] = useState(false)
  const reducedTimers = useRef<ReturnType<typeof setTimeout>[]>([])
  useEffect(() => {
    if (!reducedMotion) return
    onProgress(0)
    const fadeDelay = setTimeout(() => {
      setReducedFading(true)
      onProgress(1)
    }, 450)
    const done = setTimeout(finish, 450 + 1100)
    reducedTimers.current = [fadeDelay, done]
    return () => {
      reducedTimers.current.forEach(clearTimeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion])

  function handleSkip() {
    onProgress(1)
    finish()
  }

  if (reducedMotion) {
    return (
      <div className={styles.root}>
        <div
          className={`${styles.stage} ${styles.reducedStage}`}
          style={{ opacity: reducedFading ? 0 : 1 }}
        >
          <div className={styles.globeWrap}>
            <Suspense fallback={null}>
              <IntroGlobe rotation={0} />
            </Suspense>
          </div>
          <div className={styles.textWrap}>
            <p className={styles.eyebrow}>An Interactive Atlas</p>
            <h1 className={styles.title}>STS Interactive Map</h1>
            <p className={styles.tagline}>
              &ldquo;Knowledge has never travelled in a straight line.&rdquo;
            </p>
          </div>
          <div className={styles.vignette} aria-hidden />
        </div>
        {!reducedFading && (
          <button type="button" className={styles.skipBtn} onClick={handleSkip}>
            Skip introduction
          </button>
        )}
      </div>
    )
  }

  const starOpacity = smoothstep(0, 0.12, progress) * (1 - smoothstep(0.5, 0.78, progress))
  const textOpacity = smoothstep(0, 0.05, progress) * (1 - smoothstep(0.1, 0.22, progress))
  const globeOpacity = smoothstep(0, 0.14, progress) * (1 - smoothstep(0.82, 0.98, progress))
  const globeScale = lerpKeyframes(progress, [
    [0, 0.58],
    [0.15, 0.74],
    [0.55, 1.35],
    [0.8, 2.5],
    [1, 2.7],
  ])
  const globeRotation = progress * 46
  const glowOpacity = smoothstep(0.5, 0.8, progress)
  const holeVmax =
    progress < 0.8
      ? 0
      : lerpKeyframes(progress, [
          [0.8, 0],
          [1, 160],
        ])
  // mask-image is alpha-composited here: fully transparent = hidden (lets
  // the real app show through the growing hole), fully opaque = still
  // shows this overlay's own background/content around it.
  const maskImage =
    holeVmax > 0
      ? `radial-gradient(circle at 50% 50%, transparent ${holeVmax}vmax, black ${holeVmax + 1}vmax)`
      : undefined

  return (
    <div className={styles.root}>
      <div ref={spacerRef} className={styles.spacer} aria-hidden />
      <div
        className={styles.stage}
        style={maskImage ? { maskImage, WebkitMaskImage: maskImage } : undefined}
      >
        <div className={styles.masked}>
          <div className={styles.stars} style={{ opacity: starOpacity }} aria-hidden>
            {starElements}
          </div>
          <div className={styles.glow} style={{ opacity: glowOpacity }} aria-hidden />
          <div
            className={styles.globeWrap}
            style={{
              opacity: globeOpacity,
              transform: `translate(-50%, -50%) scale(${globeScale})`,
            }}
          >
            <Suspense fallback={null}>
              <IntroGlobe rotation={globeRotation} />
            </Suspense>
          </div>
          <div className={styles.textWrap} style={{ opacity: textOpacity }}>
            <p className={styles.eyebrow}>An Interactive Atlas</p>
            <h1 className={styles.title}>STS Interactive Map</h1>
            <p className={styles.tagline}>
              &ldquo;Knowledge has never travelled in a straight line.&rdquo;
            </p>
            <p className={styles.scrollHint}>Scroll to begin your journey ↓</p>
          </div>
          <div className={styles.vignette} aria-hidden />
        </div>
      </div>
      <button type="button" className={styles.skipBtn} onClick={handleSkip}>
        Skip introduction
      </button>
    </div>
  )
}
