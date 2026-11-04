import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { computePlacement, type Box, type Size } from './placement'
import { recordWalkthroughStatus } from './storage'
import type { WalkthroughAction, WalkthroughResult, WalkthroughStep } from './types'
import { useWalkthrough } from './useWalkthrough'
import styles from './Walkthrough.module.css'

interface WalkthroughProps {
  steps: WalkthroughStep[]
  /** Called once when the tour ends, however it ends. */
  onClose: (result: WalkthroughResult) => void
  /** Called when a step becomes current, so the app can prepare (e.g. open a sidebar). */
  onStepChange?: (step: WalkthroughStep) => void
}

const PAD = 8
const SHEET_BELOW = 640
const POLL_MS = 200
const FOCUSABLE =
  'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

/** Finds the first named target that is actually on screen. */
function findTarget(names: string[] | undefined): { el: HTMLElement; box: Box } | null {
  if (!names) return null
  for (const name of names) {
    const el = document.querySelector<HTMLElement>(`[data-walkthrough="${name}"]`)
    if (!el || el.closest('[hidden]')) continue
    const r = el.getBoundingClientRect()
    if (r.width <= 0 || r.height <= 0) continue
    return { el, box: { top: r.top, left: r.left, width: r.width, height: r.height } }
  }
  return null
}

const sameBox = (a: Box | null, b: Box | null) =>
  a === b ||
  (!!a &&
    !!b &&
    a.top === b.top &&
    a.left === b.left &&
    a.width === b.width &&
    a.height === b.height)

function useViewport(): Size {
  const read = (): Size => ({ width: window.innerWidth, height: window.innerHeight })
  const [size, setSize] = useState<Size>(read)
  useEffect(() => {
    const onResize = () =>
      setSize((s) => {
        const n = { width: window.innerWidth, height: window.innerHeight }
        return n.width === s.width && n.height === s.height ? s : n
      })
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    const vv = window.visualViewport
    vv?.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
      vv?.removeEventListener('resize', onResize)
    }
  }, [])
  return size
}

/** Tracks where the current step's target is, re-measuring as the page changes. */
function useTargetBox(names: string[] | undefined, stepId: string, reducedMotion: boolean) {
  const [box, setBox] = useState<Box | null>(null)
  const scrolledFor = useRef<string | null>(null)

  useEffect(() => {
    const measure = () => {
      const found = findTarget(names)
      setBox((prev) => (sameBox(prev, found?.box ?? null) ? prev : (found?.box ?? null)))
      if (found && scrolledFor.current !== stepId) {
        scrolledFor.current = stepId
        const { top, height } = found.box
        const vh = window.innerHeight
        const clipped = top < 0 || top + height > vh
        if (clipped && height < vh * 0.9 && typeof found.el.scrollIntoView === 'function') {
          found.el.scrollIntoView({ block: 'center', behavior: reducedMotion ? 'auto' : 'smooth' })
        }
      }
    }
    const frame = requestAnimationFrame(measure)
    const timer = window.setInterval(measure, POLL_MS)
    window.addEventListener('resize', measure)
    window.addEventListener('orientationchange', measure)
    window.addEventListener('scroll', measure, true)
    return () => {
      cancelAnimationFrame(frame)
      window.clearInterval(timer)
      window.removeEventListener('resize', measure)
      window.removeEventListener('orientationchange', measure)
      window.removeEventListener('scroll', measure, true)
    }
  }, [names, stepId, reducedMotion])

  return box
}

export function Walkthrough({ steps, onClose, onStepChange }: WalkthroughProps) {
  const { index, step, count, isFirst, isLast, next, prev } = useWalkthrough(steps)
  const reducedMotion = usePrefersReducedMotion()
  const viewport = useViewport()
  const titleId = useId()
  const bodyId = useId()
  const cardRef = useRef<HTMLDivElement>(null)
  const primaryRef = useRef<HTMLButtonElement>(null)
  const openerRef = useRef<HTMLElement | null>(null)
  const [cardSize, setCardSize] = useState<Size>({ width: 380, height: 280 })

  const box = useTargetBox(step.targets, step.id, reducedMotion)
  const missing = !!step.targets && !box

  const finish = useCallback(
    (status: WalkthroughResult['status'], action?: WalkthroughAction) => {
      recordWalkthroughStatus(status)
      onClose({ status, action })
    },
    [onClose],
  )

  // Always-current handlers for the document-level key listener.
  const keys = useRef({ next, prev, finish, isFirst, isLast })
  useEffect(() => {
    keys.current = { next, prev, finish, isFirst, isLast }
  })

  // Let the app prepare for each step (for example opening the narrow-screen sidebar).
  const onStepChangeRef = useRef(onStepChange)
  useEffect(() => {
    onStepChangeRef.current = onStepChange
  })
  useEffect(() => {
    onStepChangeRef.current?.(step)
  }, [step])

  // Focus management: move in on open, hand back to the opener on close.
  useEffect(() => {
    const active = document.activeElement
    openerRef.current = active instanceof HTMLElement && active !== document.body ? active : null
    cardRef.current?.focus()
    return () => {
      const opener = openerRef.current
      const back =
        opener && opener.isConnected
          ? opener
          : document.querySelector<HTMLElement>('[data-walkthrough="guide-button"]')
      back?.focus()
    }
  }, [])

  // If the focused button vanished when the step changed, keep focus inside the card.
  useEffect(() => {
    if (index === 0) return
    const card = cardRef.current
    if (card && !card.contains(document.activeElement)) primaryRef.current?.focus()
  }, [index])

  // Modal keyboard handling. Registered in the capture phase so that an open
  // entry panel or dialog underneath does not also react to the same key.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const k = keys.current
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        k.finish('dismissed')
        return
      }
      if (e.key === 'Tab') {
        e.stopPropagation()
        const card = cardRef.current
        if (!card) return
        const items = Array.from(card.querySelectorAll<HTMLElement>(FOCUSABLE))
        if (items.length === 0) {
          e.preventDefault()
          return
        }
        const first = items[0]
        const last = items[items.length - 1]
        const active = document.activeElement
        if (!card.contains(active)) {
          e.preventDefault()
          first.focus()
        } else if (e.shiftKey && (active === first || active === card)) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && active === last) {
          e.preventDefault()
          first.focus()
        }
        return
      }
      if (e.altKey || e.ctrlKey || e.metaKey) return
      if (e.key === 'ArrowRight' && !k.isLast) {
        e.preventDefault()
        e.stopPropagation()
        k.next()
      } else if (e.key === 'ArrowLeft' && !k.isFirst) {
        e.preventDefault()
        e.stopPropagation()
        k.prev()
      }
    }
    window.addEventListener('keydown', onKeyDown, true)
    return () => window.removeEventListener('keydown', onKeyDown, true)
  }, [])

  // Measure the card so it can be placed inside the viewport.
  useLayoutEffect(() => {
    const el = cardRef.current
    if (!el) return
    const w = el.offsetWidth
    const h = el.offsetHeight
    if (w > 0 && h > 0)
      setCardSize((s) => (s.width === w && s.height === h ? s : { width: w, height: h }))
  }, [step.id, viewport.width, viewport.height, missing])

  const spot: Box | null = box
    ? {
        top: box.top - PAD,
        left: box.left - PAD,
        width: box.width + PAD * 2,
        height: box.height + PAD * 2,
      }
    : null
  const placement = computePlacement({
    target: spot,
    card: cardSize,
    viewport,
    sheet: viewport.width < SHEET_BELOW,
  })
  const anchored = placement.mode === 'anchored'
  const motion = reducedMotion ? 'none' : 'smooth'
  const fullWidthTarget = !!spot && spot.width >= viewport.width - 4

  return (
    <div className={styles.root} data-motion={motion} data-testid="walkthrough-root">
      {spot ? (
        <div
          className={styles.spotlight}
          aria-hidden="true"
          data-testid="walkthrough-spotlight"
          style={{
            top: spot.top,
            left: spot.left,
            width: spot.width,
            height: spot.height,
            ...(fullWidthTarget ? { borderRadius: 0 } : null),
          }}
        />
      ) : (
        <div className={styles.scrim} aria-hidden="true" />
      )}

      <div
        ref={cardRef}
        className={styles.card}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={bodyId}
        tabIndex={-1}
        data-mode={placement.mode}
        data-side={placement.side}
        data-step={step.id}
        data-fallback={missing ? 'true' : undefined}
        style={
          anchored
            ? ({
                top: placement.top,
                left: placement.left,
                '--arrow': `${placement.arrow ?? 0}px`,
              } as React.CSSProperties)
            : undefined
        }
      >
        <div className={styles.progress}>
          <span className={styles.progressText}>
            {index + 1} of {count}
          </span>
          <span className={styles.bar} aria-hidden="true">
            <span className={styles.barFill} style={{ width: `${((index + 1) / count) * 100}%` }} />
          </span>
        </div>
        {/* Announces the new step without moving focus off the buttons. */}
        <span className={styles.srOnly} role="status" aria-live="polite">
          Step {index + 1} of {count}: {step.title}
        </span>

        <h2 id={titleId} className={styles.title}>
          {step.title}
        </h2>
        {step.targetLabel && (
          <p className={styles.target}>
            {missing
              ? `${step.targetLabel}: not on screen at the moment`
              : `Highlighted: ${step.targetLabel}`}
          </p>
        )}
        <p id={bodyId} className={styles.body}>
          {step.body}
        </p>

        <div className={styles.actions}>
          {isFirst ? (
            <button type="button" className={styles.ghost} onClick={() => finish('dismissed')}>
              Explore independently
            </button>
          ) : (
            !isLast && (
              <button type="button" className={styles.ghost} onClick={() => finish('dismissed')}>
                Skip tour
              </button>
            )
          )}
          <span className={styles.spacer} />
          {!isFirst && (
            <button type="button" className={styles.secondary} onClick={prev}>
              Previous
            </button>
          )}
          {isLast &&
            step.actions?.map((a) => (
              <button
                key={a.id}
                type="button"
                className={styles.secondary}
                onClick={() => finish('completed', a.id)}
              >
                {a.label}
              </button>
            ))}
          <button
            ref={primaryRef}
            type="button"
            className={styles.primary}
            onClick={isLast ? () => finish('completed') : next}
          >
            {isFirst ? 'Start tour' : isLast ? 'Begin exploring' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
