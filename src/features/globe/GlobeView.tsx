import { connectionWidth } from '../../utils/connectionWeight'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { geoOrthographic, geoPath } from 'd3-geo'
import { feature, mesh } from 'topojson-client'
import landTopology from 'world-atlas/land-110m.json'
import countriesTopology from 'world-atlas/countries-110m.json'
import type { Entry, Relationship } from '../../types'
import { clusterProjected, projectEntries, type MarkerCluster } from '../../utils/geo'
import type { MapFocus } from '../../utils/mapFocus'
import { cableCorridors, CABLE_CORRIDORS_NOTE } from '../../data/infrastructure'
import { MarkerIcon } from '../../components/MarkerIcon'
import { ClusterPanel, type ClusterPanelProps } from '../atlas/ClusterPanel'
import { EntryListFallback } from '../atlas/EntryListFallback'
import atlasStyles from '../atlas/AtlasView.module.css'
import styles from './GlobeView.module.css'
import { loadEarthTextures, type EarthTextures } from './earthTextures'
import { renderEarth } from './renderEarth'

export interface GlobeViewProps {
  entries: Entry[]
  relationships: Relationship[]
  selectedEntryId: string | null
  onSelectEntry: (id: string) => void
  focusEntryId?: string | null
  focusToken?: number
  clusterTools: Pick<
    ClusterPanelProps,
    | 'getRelatedEntries'
    | 'isSaved'
    | 'onToggleSave'
    | 'onOpenDebate'
    | 'journeysForEntry'
    | 'onBeginJourney'
  >
  reducedMotion: boolean
  ghostEntries?: Entry[]
  ghostRelationships?: Relationship[]
  outsideIds?: Set<string>
  focusRef?: { current: MapFocus | null }
}

const land = feature(
  landTopology as never,
  (landTopology as never as { objects: { land: never } }).objects.land,
)
const borders = mesh(
  countriesTopology as never,
  (countriesTopology as never as { objects: { countries: never } }).objects.countries,
  (a, b) => a !== b,
)

const CLUSTER_THRESHOLD_PX = 20
const MIN_K = 0.7
const MAX_K = 6
const BROKEN_TYPES = new Set(['replaced', 'criticised', 'contested'])
const PANEL_WIDTH = 440

const clampLat = (lat: number) => Math.max(-85, Math.min(85, lat))
const wrapLon = (lon: number) => ((((lon + 180) % 360) + 360) % 360) - 180

/**
 * The present-day view: an orthographic globe textured from NASA Earth
 * Observatory imagery. It shares its entries, clustering, sidebar and
 * selection behaviour with the flat atlas; only the projection differs.
 * Rendering is plain 2D canvas plus SVG (no WebGL), so it works wherever
 * the rest of the app does.
 */
export function GlobeView({
  entries,
  relationships,
  selectedEntryId,
  onSelectEntry,
  focusEntryId,
  focusToken,
  clusterTools,
  reducedMotion,
  ghostEntries,
  ghostRelationships,
  outsideIds,
  focusRef,
}: GlobeViewProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [size, setSize] = useState({ width: 800, height: 520 })
  const [measured, setMeasured] = useState(false)
  // The initial view is a one-off read of where the flat map was looking.
  // eslint-disable-next-line react-hooks/refs
  const [view, setView] = useState<{ lon: number; lat: number; k: number }>(() => {
    const f = focusRef?.current
    return f
      ? { lon: f.lon, lat: clampLat(f.lat), k: Math.min(3, Math.max(0.9, 0.9 + (f.k - 1) * 0.3)) }
      : { lon: 10, lat: 25, k: 1 }
  })
  const [interacting, setInteracting] = useState(false)
  const [textures, setTextures] = useState<EarthTextures | null>(null)
  const [textureFailed, setTextureFailed] = useState(false)
  const [cityLights, setCityLights] = useState(true)
  const [showBorders, setShowBorders] = useState(true)
  const [showCables, setShowCables] = useState(true)
  const [showList, setShowList] = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [panelEntries, setPanelEntries] = useState<Entry[] | null>(null)
  const [highlightedEntryId, setHighlightedEntryId] = useState<string | null>(null)

  const viewRef = useRef(view)
  useEffect(() => {
    viewRef.current = view
  }, [view])

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver((list) => {
      const rect = list[0]?.contentRect
      if (rect && rect.width > 0 && rect.height > 0) {
        setSize({ width: rect.width, height: rect.height })
        setMeasured(true)
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    let cancelled = false
    loadEarthTextures()
      .then((t) => {
        if (!cancelled) setTextures(t)
      })
      .catch(() => {
        if (!cancelled) setTextureFailed(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const desktop = size.width > 720
  const panelOpen = panelEntries !== null && !showList
  // The globe re-centres in the space the sidebar leaves free.
  const cx = panelOpen && desktop ? (size.width - PANEL_WIDTH) / 2 : size.width / 2
  const cy = size.height / 2
  const baseRadius = Math.min(cx * 2, size.height) * 0.44
  const R = baseRadius * view.k

  const projection = useMemo(
    () =>
      geoOrthographic()
        .translate([cx, cy])
        .scale(R)
        .rotate([-view.lon, -view.lat])
        .clipAngle(90)
        .precision(0.6),
    [cx, cy, R, view.lon, view.lat],
  )

  // ---- Surface texture --------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !textures || !measured) return
    const frame = requestAnimationFrame(() => {
      const quality = interacting ? 0.5 : Math.min(window.devicePixelRatio || 1, 1.5)
      const w = Math.max(1, Math.round(size.width * quality))
      const h = Math.max(1, Math.round(size.height * quality))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        setTextureFailed(true)
        return
      }
      const image = ctx.createImageData(w, h)
      renderEarth(
        image,
        textures,
        { lon: view.lon, lat: view.lat, cityLights },
        cx * quality,
        cy * quality,
        R * quality,
      )
      ctx.putImageData(image, 0, 0)
    })
    return () => cancelAnimationFrame(frame)
  }, [textures, measured, size, view.lon, view.lat, cityLights, interacting, cx, cy, R])

  // ---- Remember where we are (for the flat map) ---------------------------
  useEffect(() => {
    if (focusRef) {
      focusRef.current = {
        lon: view.lon,
        lat: view.lat,
        k: 1 + (view.k - 0.9) / 0.3,
        fromGlobe: true,
      }
    }
  }, [focusRef, view])

  // ---- Movement ---------------------------------------------------------
  const interactTimer = useRef<number | null>(null)
  const markInteracting = useCallback(() => {
    setInteracting(true)
    if (interactTimer.current) window.clearTimeout(interactTimer.current)
    interactTimer.current = window.setTimeout(() => setInteracting(false), 180)
  }, [])
  useEffect(
    () => () => {
      if (interactTimer.current) window.clearTimeout(interactTimer.current)
    },
    [],
  )

  const animRef = useRef<number | null>(null)
  const flyTo = useCallback(
    (lon: number, lat: number, k?: number) => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      const from = viewRef.current
      const target = {
        lon,
        lat: clampLat(lat),
        k: Math.min(MAX_K, Math.max(MIN_K, k ?? from.k)),
      }
      if (reducedMotion) {
        setView(target)
        return
      }
      // Take the short way round the globe.
      const dLon = ((((target.lon - from.lon + 180) % 360) + 360) % 360) - 180
      const start = performance.now()
      const duration = 750
      setInteracting(true)
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration)
        const e = t * t * (3 - 2 * t)
        setView({
          lon: wrapLon(from.lon + dLon * e),
          lat: from.lat + (target.lat - from.lat) * e,
          k: from.k + (target.k - from.k) * e,
        })
        if (t < 1) animRef.current = requestAnimationFrame(step)
        else {
          animRef.current = null
          setInteracting(false)
        }
      }
      animRef.current = requestAnimationFrame(step)
    },
    [reducedMotion],
  )
  useEffect(
    () => () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    },
    [],
  )

  const stopAnimation = () => {
    if (animRef.current) {
      cancelAnimationFrame(animRef.current)
      animRef.current = null
    }
  }

  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const pinchStart = useRef<{ dist: number; k: number } | null>(null)
  const dragged = useRef(false)

  function onPointerDown(e: React.PointerEvent<SVGSVGElement>) {
    stopAnimation()
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    dragged.current = false
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()]
      pinchStart.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), k: viewRef.current.k }
    }
  }
  function onPointerMove(e: React.PointerEvent<SVGSVGElement>) {
    const prev = pointers.current.get(e.pointerId)
    if (!prev) return
    const next = { x: e.clientX, y: e.clientY }
    pointers.current.set(e.pointerId, next)
    if (pointers.current.size === 2 && pinchStart.current) {
      const [a, b] = [...pointers.current.values()]
      const ratio = Math.hypot(a.x - b.x, a.y - b.y) / (pinchStart.current.dist || 1)
      const k = Math.min(MAX_K, Math.max(MIN_K, pinchStart.current.k * ratio))
      markInteracting()
      setView((v) => ({ ...v, k }))
      return
    }
    const dx = next.x - prev.x
    const dy = next.y - prev.y
    if (Math.abs(dx) + Math.abs(dy) > 0) {
      if (!dragged.current) {
        dragged.current = true
        e.currentTarget.setPointerCapture(e.pointerId)
      }
      markInteracting()
      const radius = baseRadius * viewRef.current.k
      const degPerPx = 180 / Math.PI / radius
      setView((v) => ({
        ...v,
        lon: wrapLon(v.lon - dx * degPerPx),
        lat: clampLat(v.lat + dy * degPerPx),
      }))
    }
  }
  function onPointerUp(e: React.PointerEvent<SVGSVGElement>) {
    pointers.current.delete(e.pointerId)
    if (pointers.current.size < 2) pinchStart.current = null
  }

  useEffect(() => {
    const el = svgRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      markInteracting()
      setView((v) => ({
        ...v,
        k: Math.min(MAX_K, Math.max(MIN_K, v.k * Math.exp(-e.deltaY * 0.0015))),
      }))
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [markInteracting, showList])

  function onKeyDown(e: React.KeyboardEvent<SVGSVGElement>) {
    // Arrow keys turn the globe when the map itself (not a marker) has focus.
    if (e.target !== e.currentTarget) return
    const step = 10 / viewRef.current.k
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, step],
      ArrowDown: [0, -step],
    }
    if (e.key in moves) {
      e.preventDefault()
      const [dLon, dLat] = moves[e.key]
      setView((v) => ({ ...v, lon: wrapLon(v.lon + dLon), lat: clampLat(v.lat + dLat) }))
    } else if (e.key === '+' || e.key === '=') {
      setView((v) => ({ ...v, k: Math.min(MAX_K, v.k * 1.25) }))
    } else if (e.key === '-') {
      setView((v) => ({ ...v, k: Math.max(MIN_K, v.k / 1.25) }))
    }
  }

  // Centre on an entry when asked (journeys, deep links, "show on map").
  useEffect(() => {
    if (!focusEntryId || !measured) return
    const e = entries.find((en) => en.id === focusEntryId)
    if (e?.latitude !== undefined && e.longitude !== undefined) flyTo(e.longitude, e.latitude, 2)
    // Only an explicit focus request should recentre, not every filter change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusEntryId, focusToken, measured])

  // ---- Markers and clusters ----------------------------------------------
  const projected = useMemo(() => projectEntries(entries, projection), [entries, projection])
  const ghostProjected = useMemo(
    () => (ghostEntries?.length ? projectEntries(ghostEntries, projection) : []),
    [ghostEntries, projection],
  )
  const clusters = useMemo(() => clusterProjected(projected, 1, CLUSTER_THRESHOLD_PX), [projected])
  const noCoordEntries = useMemo(
    () => entries.filter((e) => e.latitude === undefined || e.longitude === undefined),
    [entries],
  )
  const visibleIds = useMemo(() => new Set(entries.map((e) => e.id)), [entries])
  const screenPositionById = useMemo(() => {
    const m = new Map<string, { x: number; y: number }>()
    for (const c of clusters) for (const item of c.items) m.set(item.entry.id, { x: c.x, y: c.y })
    return m
  }, [clusters])

  const curve = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const len = Math.hypot(b.x - a.x, b.y - a.y) || 1
    const off = len * 0.18
    const mx = (a.x + b.x) / 2 - ((b.y - a.y) * off) / len
    const my = (a.y + b.y) / 2 + ((b.x - a.x) * off) / len
    return `M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}`
  }
  const routeCurves = useMemo(
    () =>
      relationships
        .filter((r) => visibleIds.has(r.sourceId) && visibleIds.has(r.targetId))
        .flatMap((r) => {
          const a = screenPositionById.get(r.sourceId)
          const b = screenPositionById.get(r.targetId)
          if (!a || !b || (Math.abs(a.x - b.x) < 0.01 && Math.abs(a.y - b.y) < 0.01)) return []
          return [{ rel: r, d: curve(a, b) }]
        }),
    [relationships, visibleIds, screenPositionById],
  )
  const ghostCurves = useMemo(() => {
    if (!ghostRelationships?.length) return []
    const ghostPos = new Map(ghostProjected.map((g) => [g.entry.id, { x: g.x, y: g.y }]))
    const pos = (id: string) => ghostPos.get(id) ?? screenPositionById.get(id)
    return ghostRelationships.flatMap((r) => {
      const a = pos(r.sourceId)
      const b = pos(r.targetId)
      if (!a || !b || (Math.abs(a.x - b.x) < 0.01 && Math.abs(a.y - b.y) < 0.01)) return []
      return [{ id: r.id, d: curve(a, b) }]
    })
  }, [ghostRelationships, ghostProjected, screenPositionById])

  // ---- Static vector layers (borders, cables, fallback land) ---------------
  const path = useMemo(() => geoPath(projection).digits(1), [projection])
  const spherePath = useMemo(() => path({ type: 'Sphere' }) ?? '', [path])
  const landPath = useMemo(
    () => (textureFailed ? (path(land as never) ?? '') : ''),
    [path, textureFailed],
  )
  const bordersPath = useMemo(() => (showBorders ? (path(borders) ?? '') : ''), [path, showBorders])
  const cablePaths = useMemo(
    () =>
      showCables
        ? cableCorridors.map((c) => ({
            id: c.id,
            label: c.label,
            d: path({ type: 'LineString', coordinates: c.points }) ?? '',
          }))
        : [],
    [path, showCables],
  )

  // ---- Cluster sidebar ----------------------------------------------------
  const livePanelEntries = useMemo(
    () => (panelEntries ? panelEntries.filter((e) => visibleIds.has(e.id)) : null),
    [panelEntries, visibleIds],
  )
  if (panelEntries && livePanelEntries && livePanelEntries.length === 0) setPanelEntries(null)
  const panelIds = useMemo(
    () => (livePanelEntries ? new Set(livePanelEntries.map((e) => e.id)) : null),
    [livePanelEntries],
  )

  function clusterCentre(cluster: MarkerCluster): [number, number] {
    // Mean position on the globe: average unit vectors, then convert back.
    let x = 0
    let y = 0
    let z = 0
    for (const { entry } of cluster.items) {
      const lat = ((entry.latitude ?? 0) * Math.PI) / 180
      const lon = ((entry.longitude ?? 0) * Math.PI) / 180
      x += Math.cos(lat) * Math.cos(lon)
      y += Math.cos(lat) * Math.sin(lon)
      z += Math.sin(lat)
    }
    return [(Math.atan2(y, x) * 180) / Math.PI, (Math.atan2(z, Math.hypot(x, y)) * 180) / Math.PI]
  }

  function openClusterPanel(cluster: MarkerCluster) {
    setPanelEntries(cluster.items.map((i) => i.entry))
    setHighlightedEntryId(null)
    const [lon, lat] = clusterCentre(cluster)
    flyTo(lon, lat, Math.min(MAX_K, Math.max(view.k * 1.8, 1.8)))
  }

  function closeClusterPanel() {
    const target = svgRef.current?.querySelector<HTMLElement>('[data-in-panel="true"]')
    setPanelEntries(null)
    setHighlightedEntryId(null)
    target?.focus()
  }

  function showEntryOnMap(entryId: string) {
    const e = entries.find((en) => en.id === entryId)
    if (e?.latitude === undefined || e.longitude === undefined) return
    setHighlightedEntryId(entryId)
    flyTo(e.longitude, e.latitude, Math.min(MAX_K, Math.max(view.k, 2.6)))
  }

  const markerRadius = 9
  const attribution =
    'Imagery: NASA Earth Observatory (Blue Marble; Earth at Night). Modern borders shown for orientation.'

  return (
    <div className={styles.wrap} ref={wrapRef} data-globe="true">
      {!showList ? (
        <>
          <div
            className={styles.atmosphere}
            aria-hidden
            style={{
              width: R * 2,
              height: R * 2,
              left: cx - R,
              top: cy - R,
              boxShadow: `0 0 ${R * 0.09}px ${R * 0.02}px rgba(110, 170, 255, 0.5), inset 0 0 ${R * 0.12}px rgba(110, 170, 255, 0.28)`,
            }}
          />
          <canvas ref={canvasRef} className={styles.canvas} aria-hidden />
          <svg
            ref={svgRef}
            className={styles.svg}
            viewBox={`0 0 ${size.width} ${size.height}`}
            role="application"
            tabIndex={0}
            aria-label="Interactive globe of the atlas, showing present-day scientific and technological places. Drag to turn it, scroll or pinch to zoom, arrow keys to rotate. Use the list view button for a keyboard- and screen-reader-friendly alternative."
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={onKeyDown}
          >
            {textureFailed && <path d={landPath} className={styles.fallbackLand} />}
            <path d={spherePath} className={styles.rim} />
            {bordersPath && <path d={bordersPath} className={styles.borders} />}

            {cablePaths.map((c) => (
              <path key={c.id} d={c.d} className={styles.cable}>
                <title>{`${c.label} (schematic)`}</title>
              </path>
            ))}

            {ghostCurves.map((g) => (
              <path key={`g-${g.id}`} d={g.d} className={atlasStyles.ghostRoute} aria-hidden />
            ))}
            {routeCurves.map(({ rel, d }) => (
              <path
                key={rel.id}
                d={d}
                className={`${styles.route} ${BROKEN_TYPES.has(rel.type) ? styles.routeBroken : ''}`}
                style={{ strokeWidth: connectionWidth(rel) }}
                aria-hidden
              />
            ))}
            {ghostProjected.map(({ entry, x, y }) => (
              <circle
                key={`ghost-${entry.id}`}
                cx={x}
                cy={y}
                r={5.5}
                className={atlasStyles.ghostMarker}
                aria-hidden
                onClick={() => {
                  setPanelEntries(null)
                  onSelectEntry(entry.id)
                }}
              >
                <title>{`${entry.title} (${entry.dateDisplay}) — echo from the previous period`}</title>
              </circle>
            ))}

            {clusters.map((cluster) => {
              if (cluster.items.length === 1) {
                const { entry, x, y } = cluster.items[0]
                const selected = entry.id === selectedEntryId
                const inPanel = panelIds?.has(entry.id) ?? false
                const highlighted = entry.id === highlightedEntryId
                const outside = outsideIds?.has(entry.id) ?? false
                const dimmed =
                  (hoveredId !== null && hoveredId !== entry.id) || (panelIds !== null && !inPanel)
                const activate = () => {
                  setPanelEntries(null)
                  onSelectEntry(entry.id)
                }
                return (
                  <g
                    key={entry.id}
                    transform={`translate(${x},${y})`}
                    className={`${atlasStyles.marker} ${selected || highlighted ? atlasStyles.markerSelected : ''} ${dimmed ? atlasStyles.markerDimmed : ''} ${outside ? atlasStyles.markerOutside : ''}`}
                    data-in-panel={inPanel ? 'true' : undefined}
                    tabIndex={0}
                    role="button"
                    aria-label={`${entry.title}, ${entry.dateDisplay}. ${entry.kind}.${outside ? ' Outside the selected period.' : ''}`}
                    onPointerDown={(e) => e.stopPropagation()}
                    onMouseEnter={() => setHoveredId(entry.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onFocus={() => setHoveredId(entry.id)}
                    onBlur={() => setHoveredId(null)}
                    onClick={activate}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        activate()
                      }
                    }}
                  >
                    <circle className={atlasStyles.markerDot} r={markerRadius} />
                    <g
                      className={atlasStyles.markerIcon}
                      transform={`translate(${-markerRadius * 0.6},${-markerRadius * 0.6}) scale(${(markerRadius * 1.2) / 14})`}
                    >
                      <MarkerIcon kind={entry.kind} size={14} />
                    </g>
                    {(hoveredId === entry.id || selected || highlighted || view.k >= 3) && (
                      <text className={atlasStyles.markerLabel} x={markerRadius + 6} y={4}>
                        {entry.title}
                      </text>
                    )}
                  </g>
                )
              }
              const count = cluster.items.length
              const r = Math.min(10 + count * 1.3, 22)
              const inPanel = cluster.items.some((i) => panelIds?.has(i.entry.id))
              const highlighted = cluster.items.some((i) => i.entry.id === highlightedEntryId)
              const dimmed = panelIds !== null && !inPanel
              return (
                <g
                  key={cluster.id}
                  transform={`translate(${cluster.x},${cluster.y})`}
                  className={`${atlasStyles.cluster} ${inPanel ? atlasStyles.clusterSelected : ''} ${dimmed ? atlasStyles.clusterDimmed : ''}`}
                  data-in-panel={inPanel ? 'true' : undefined}
                  tabIndex={0}
                  role="button"
                  aria-label={`Open ${count} map entries`}
                  aria-haspopup="dialog"
                  aria-expanded={inPanel}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => openClusterPanel(cluster)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      openClusterPanel(cluster)
                    }
                  }}
                >
                  {(inPanel || highlighted) && (
                    <circle className={atlasStyles.clusterRing} r={r + 5} />
                  )}
                  <circle className={atlasStyles.clusterDot} r={r} />
                  <text className={atlasStyles.clusterCount}>{count}</text>
                </g>
              )
            })}
          </svg>
        </>
      ) : (
        <EntryListFallback
          entries={entries}
          onSelectEntry={onSelectEntry}
          selectedEntryId={selectedEntryId}
        />
      )}

      <div className={atlasStyles.controls}>
        <button
          type="button"
          className={atlasStyles.zoomBtn}
          aria-label="Zoom in"
          onClick={() => flyTo(view.lon, view.lat, Math.min(MAX_K, view.k * 1.4))}
        >
          +
        </button>
        <button
          type="button"
          className={atlasStyles.zoomBtn}
          aria-label="Zoom out"
          onClick={() => flyTo(view.lon, view.lat, Math.max(MIN_K, view.k / 1.4))}
        >
          −
        </button>
        <button
          type="button"
          className={atlasStyles.zoomBtn}
          aria-label="Reset view"
          onClick={() => flyTo(10, 25, 1)}
        >
          ⟲
        </button>
        <button
          type="button"
          className={atlasStyles.zoomBtn}
          aria-pressed={showList}
          aria-label={showList ? 'Switch to globe view' : 'Switch to accessible list view'}
          onClick={() => setShowList((s) => !s)}
        >
          ☰
        </button>
      </div>

      {!showList && (
        <div className={styles.layers} role="group" aria-label="Globe layers">
          <button
            type="button"
            className={styles.layerBtn}
            aria-pressed={cityLights}
            onClick={() => setCityLights((v) => !v)}
          >
            City lights
          </button>
          <button
            type="button"
            className={styles.layerBtn}
            aria-pressed={showBorders}
            onClick={() => setShowBorders((v) => !v)}
          >
            Borders
          </button>
          <button
            type="button"
            className={styles.layerBtn}
            aria-pressed={showCables}
            onClick={() => setShowCables((v) => !v)}
            title={CABLE_CORRIDORS_NOTE}
          >
            Subsea cables
          </button>
        </div>
      )}

      {!showList && !textures && !textureFailed && (
        <p className={styles.status} role="status">
          Loading satellite imagery…
        </p>
      )}
      {!showList && textureFailed && (
        <p className={styles.status} role="status">
          Satellite imagery could not be loaded; showing a simple outline globe instead.
        </p>
      )}
      {!showList && entries.length === 0 && (
        <p className={atlasStyles.emptyNote} role="status">
          No entries match the current filters in this period. Clear or reset them to see the globe
          again.
        </p>
      )}

      {!showList && noCoordEntries.length > 0 && (
        <details className={atlasStyles.unplaced}>
          <summary>
            {noCoordEntries.length} idea{noCoordEntries.length === 1 ? '' : 's'} with no single
            place
          </summary>
          <p className={atlasStyles.unplacedHint}>
            Ideas, methods and movements that span many places are not pinned to the globe.
          </p>
          <ul>
            {noCoordEntries.map((entry) => (
              <li key={entry.id}>
                <button type="button" onClick={() => onSelectEntry(entry.id)}>
                  {entry.title}
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}

      {!showList && <p className={styles.attribution}>{attribution}</p>}

      {panelEntries && livePanelEntries && livePanelEntries.length > 0 && !showList && (
        <ClusterPanel
          key={panelEntries.map((e) => e.id).join('|')}
          entries={livePanelEntries}
          outsideIds={outsideIds}
          onClose={closeClusterPanel}
          onShowOnMap={showEntryOnMap}
          {...clusterTools}
        />
      )}
    </div>
  )
}
