import { connectionWidth } from '../../utils/connectionWeight'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { select } from 'd3-selection'
import 'd3-transition'
import { zoom as d3zoom, zoomIdentity, type D3ZoomEvent, type ZoomBehavior } from 'd3-zoom'
import { feature, mesh } from 'topojson-client'
import landTopology from 'world-atlas/land-50m.json'
import landTopologyCoarse from 'world-atlas/land-110m.json'
import countriesTopology from 'world-atlas/countries-50m.json'
import countriesTopologyCoarse from 'world-atlas/countries-110m.json'
import type { Entry, Relationship } from '../../types'
import {
  createProjection,
  projectEntries,
  geoPath,
  clusterProjected,
  geoGraticule,
  type MarkerCluster,
} from '../../utils/geo'
import { MarkerIcon } from '../../components/MarkerIcon'
import { MapDefs, CompassRose } from './MapGlyphs'
import { EraDecor } from '../eras/EraDecor'
import { EntryListFallback } from './EntryListFallback'
import type { MapFocus } from '../../utils/mapFocus'
import { ClusterPanel, type ClusterPanelProps } from './ClusterPanel'
import styles from './AtlasView.module.css'

interface AtlasViewProps {
  entries: Entry[]
  relationships: Relationship[]
  selectedEntryId: string | null
  onSelectEntry: (id: string) => void
  focusEntryId?: string | null
  focusToken?: number
  /** Hooks into the app for the cluster sidebar's entry details and actions. */
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
  /** Selected period id (null = All Time) and whether its theme is applied. */
  eraId?: string | null
  immersive?: boolean
  /** Faint entries and relationships carried over from the previous period. */
  ghostEntries?: Entry[]
  ghostRelationships?: Relationship[]
  /** Entries shown only because the search reaches outside the period. */
  outsideIds?: Set<string>
  /** Shared with the globe so switching projection keeps the viewer's place. */
  focusRef?: { current: MapFocus | null }
  /** Frames a set of places (lon, lat) when `token` changes, without over-zooming. */
  fitPoints?: { token: number; points: [number, number][] } | null
}

interface RouteTooltip {
  relationship: Relationship
  x: number
  y: number
}

function landFeatureOf(topology: unknown) {
  return feature(topology as never, (topology as { objects: { land: never } }).objects.land)
}

function bordersOf(topology: unknown) {
  const t = topology as { objects: { countries: never } }
  return mesh(topology as never, t.objects.countries, (a, b) => a !== b)
}

/** Static chart layers; memoised so pan/zoom frames don't re-diff them. */
const BaseMap = memo(function BaseMap({
  width,
  height,
  land,
  borders,
  graticule,
  strokeScale,
}: {
  width: number
  height: number
  land: string
  borders: string
  graticule: string
  strokeScale: number
}) {
  return (
    <>
      <rect x={-width} y={-height} width={width * 3} height={height * 3} className={styles.sea} />
      <rect
        x={-width}
        y={-height}
        width={width * 3}
        height={height * 3}
        className={styles.seaTexture}
      />
      <path
        className={styles.graticule}
        d={graticule}
        style={{ strokeWidth: 0.35 * strokeScale }}
      />
      <path className={styles.land} d={land} style={{ strokeWidth: 0.8 * strokeScale }} />
      <path className={styles.border} d={borders} style={{ strokeWidth: 0.5 * strokeScale }} />
    </>
  )
})

/** On-screen distance (px) within which markers merge into one numbered bubble. */
const CLUSTER_THRESHOLD_PX = 20

const BROKEN_TYPES = new Set(['replaced', 'criticised', 'contested'])

export function AtlasView({
  entries,
  relationships,
  selectedEntryId,
  onSelectEntry,
  focusEntryId,
  focusToken,
  fitPoints,
  clusterTools,
  reducedMotion,
  eraId = null,
  immersive = false,
  ghostEntries,
  ghostRelationships,
  outsideIds,
  focusRef,
}: AtlasViewProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const zoomBehaviorRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null)

  const [size, setSize] = useState({ width: 800, height: 520 })
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 })
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  // The exact entries behind the bubble the user clicked, captured at click
  // time so the sidebar keeps showing that cluster even after the map is
  // zoomed and the bubbles regroup.
  const [panelEntries, setPanelEntries] = useState<Entry[] | null>(null)
  const [highlightedEntryId, setHighlightedEntryId] = useState<string | null>(null)
  const [routeTooltip, setRouteTooltip] = useState<RouteTooltip | null>(null)
  const [showList, setShowList] = useState(false)
  const [measured, setMeasured] = useState(false)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver((entriesList) => {
      const rect = entriesList[0]?.contentRect
      if (rect && rect.width > 0 && rect.height > 0) {
        setSize({ width: rect.width, height: rect.height })
        setMeasured(true)
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const landFeature = useMemo(() => landFeatureOf(landTopology), [])

  const projection = useMemo(
    () => createProjection(size.width, size.height, landFeature as never),
    [size.width, size.height, landFeature],
  )
  // 1-decimal precision keeps the path strings small; the browser has to
  // re-rasterise them on every pan/zoom frame, so their size matters.
  const pathGenerator = useMemo(() => geoPath(projection).digits(1), [projection])

  // Coarse outlines while zoomed out (cheap to repaint while panning), the
  // detailed ones once zoomed in far enough for the detail to be visible.
  const paths = useMemo(
    () => ({
      landCoarse: pathGenerator(landFeatureOf(landTopologyCoarse) as never) ?? '',
      landFine: pathGenerator(landFeature as never) ?? '',
      bordersCoarse: pathGenerator(bordersOf(countriesTopologyCoarse)) ?? '',
      bordersFine: pathGenerator(bordersOf(countriesTopology)) ?? '',
      graticule: pathGenerator(geoGraticule().step([20, 20])()) ?? '',
    }),
    [pathGenerator, landFeature],
  )
  const detailed = transform.k >= 2.5

  const projected = useMemo(() => projectEntries(entries, projection), [entries, projection])
  const noCoordEntries = useMemo(
    () => entries.filter((e) => e.latitude === undefined || e.longitude === undefined),
    [entries],
  )

  const clusters = useMemo(
    () => clusterProjected(projected, transform.k, CLUSTER_THRESHOLD_PX),
    [projected, transform.k],
  )
  const ghostProjected = useMemo(
    () => (ghostEntries?.length ? projectEntries(ghostEntries, projection) : []),
    [ghostEntries, projection],
  )

  // On arrival from the globe the map starts centred on where it was looking;
  // until that has been consumed, don't overwrite the shared focus.
  const arrivedRef = useRef(false)

  // Remember what the viewer is looking at so the globe can open there.
  useEffect(() => {
    if (!focusRef || !measured || !arrivedRef.current) return
    const centre = projection.invert?.([
      (size.width / 2 - transform.x) / transform.k,
      (size.height / 2 - transform.y) / transform.k,
    ])
    if (centre && Number.isFinite(centre[0]) && Number.isFinite(centre[1])) {
      focusRef.current = { lon: centre[0], lat: centre[1], k: transform.k }
    }
  }, [focusRef, measured, projection, size.width, size.height, transform])

  useEffect(() => {
    const svgEl = svgRef.current
    if (!svgEl) return
    let frame: number | null = null
    let pendingTransform: { x: number; y: number; k: number } | null = null
    const zb = d3zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.9, 10])
      .on('zoom', (event: D3ZoomEvent<SVGSVGElement, unknown>) => {
        // Coalesce bursts of wheel/drag events into one React update per frame.
        pendingTransform = { x: event.transform.x, y: event.transform.y, k: event.transform.k }
        if (frame === null) {
          frame = requestAnimationFrame(() => {
            frame = null
            if (pendingTransform) setTransform(pendingTransform)
          })
        }
      })
    zoomBehaviorRef.current = zb
    select(svgEl).call(zb)
    return () => {
      select(svgEl).on('.zoom', null)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [])

  // Keep the chart from being dragged entirely out of view.
  useEffect(() => {
    zoomBehaviorRef.current?.translateExtent([
      [-size.width * 0.25, -size.height * 0.25],
      [size.width * 1.25, size.height * 1.25],
    ])
  }, [size.width, size.height])

  const applyZoom = useCallback(
    (k: number, cx?: number, cy?: number, shiftX = 0) => {
      if (!svgRef.current || !zoomBehaviorRef.current) return
      const sel = select(svgRef.current)
      // Anchor on the world point explicitly passed (e.g. an entry/cluster
      // position), or, if none is given, on whatever world point is
      // currently under the viewport centre — so +/- zoom in place instead
      // of drifting toward the SVG origin.
      const worldX = cx ?? (size.width / 2 - transform.x) / transform.k
      const worldY = cy ?? (size.height / 2 - transform.y) / transform.k
      const target = zoomIdentity
        .translate(size.width / 2 - shiftX - worldX * k, size.height / 2 - worldY * k)
        .scale(k)
      if (reducedMotion) {
        zoomBehaviorRef.current.transform(sel, target)
      } else {
        sel.transition().duration(650).call(zoomBehaviorRef.current.transform, target)
      }
    },
    [size.width, size.height, transform.x, transform.y, transform.k, reducedMotion],
  )

  useEffect(() => {
    if (arrivedRef.current || !measured || !zoomBehaviorRef.current) return
    arrivedRef.current = true
    if (!focusRef?.current) return
    const f = focusRef.current
    const point = projection([f.lon, f.lat])
    if (point && f.fromGlobe) {
      applyZoom(Math.min(Math.max(f.k, 1.6), 3), point[0], point[1])
    } else {
      setTransform((t) => ({ ...t }))
    }
    // Only on first measurement.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measured])

  const resetView = useCallback(() => {
    if (!svgRef.current || !zoomBehaviorRef.current) return
    const sel = select(svgRef.current)
    if (reducedMotion) {
      zoomBehaviorRef.current.transform(sel, zoomIdentity)
    } else {
      sel.transition().duration(650).call(zoomBehaviorRef.current.transform, zoomIdentity)
    }
  }, [reducedMotion])

  useEffect(() => {
    if (!focusEntryId || !measured) return
    const p = projected.find((pr) => pr.entry.id === focusEntryId)
    if (p) applyZoom(3, p.x, p.y)
    // Intentionally excludes `projected`/`applyZoom`: re-centering should
    // only be triggered by an explicit focus request (new entry/journey
    // stop) or the container becoming measured, not by every filter change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusEntryId, focusToken, measured])

  // Frame a set of places (e.g. where the viewer's notes are) without
  // zooming in so far that a single marker fills the screen.
  const fitToken = fitPoints?.token
  useEffect(() => {
    if (!fitPoints || fitPoints.points.length === 0 || !measured) return
    const pts = fitPoints.points
      .map((p) => projection(p))
      .filter((p): p is [number, number] => p !== null && Number.isFinite(p[0]))
    if (pts.length === 0) return
    const xs = pts.map((p) => p[0])
    const ys = pts.map((p) => p[1])
    const w = Math.max(...xs) - Math.min(...xs)
    const h = Math.max(...ys) - Math.min(...ys)
    const cx = (Math.max(...xs) + Math.min(...xs)) / 2
    const cy = (Math.max(...ys) + Math.min(...ys)) / 2
    const k =
      w < 8 && h < 8
        ? 2.2
        : Math.min(
            4,
            Math.max(1, 0.72 * Math.min(size.width / Math.max(w, 1), size.height / Math.max(h, 1))),
          )
    applyZoom(k, cx, cy)
    // Only an explicit request (a new token) should reframe the map.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fitToken, measured])

  const visibleEntryIds = useMemo(() => new Set(entries.map((e) => e.id)), [entries])

  // Routes must land on whatever is actually drawn on screen — a cluster
  // bubble's centre, not the individual (currently hidden) position of
  // each entry inside it. Without this, dozens of curves fan out to
  // invisible points merged inside a bubble, reading as a tangled mess
  // rather than a connection between two visible things.
  const screenPositionById = useMemo(() => {
    const m = new Map<string, { x: number; y: number }>()
    for (const cluster of clusters) {
      for (const item of cluster.items) {
        m.set(item.entry.id, { x: cluster.x, y: cluster.y })
      }
    }
    return m
  }, [clusters])

  const routeCurves = useMemo(() => {
    return relationships
      .filter((r) => visibleEntryIds.has(r.sourceId) && visibleEntryIds.has(r.targetId))
      .map((r) => {
        const a = screenPositionById.get(r.sourceId)
        const b = screenPositionById.get(r.targetId)
        if (!a || !b) return null
        if (Math.abs(a.x - b.x) < 0.01 && Math.abs(a.y - b.y) < 0.01) return null
        // Both endpoints collapsed into the same cluster bubble: nothing
        // meaningful to draw.
        if (Math.abs(a.x - b.x) < 0.01 && Math.abs(a.y - b.y) < 0.01) return null
        const mx = (a.x + b.x) / 2
        const my = (a.y + b.y) / 2
        const dx = b.x - a.x
        const dy = b.y - a.y
        const curveOffset = Math.hypot(dx, dy) * 0.18
        const cx = mx - dy * (curveOffset / (Math.hypot(dx, dy) || 1))
        const cy = my + dx * (curveOffset / (Math.hypot(dx, dy) || 1))
        return { rel: r, d: `M${a.x},${a.y} Q${cx},${cy} ${b.x},${b.y}`, midX: cx, midY: cy }
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)
  }, [relationships, visibleEntryIds, screenPositionById])

  // Echo routes: relationships touching a faint entry from the previous
  // period, drawn very lightly so continuity is visible without clutter.
  const ghostCurves = useMemo(() => {
    if (!ghostRelationships?.length) return []
    const ghostPos = new Map(ghostProjected.map((g) => [g.entry.id, { x: g.x, y: g.y }]))
    const pos = (id: string) => ghostPos.get(id) ?? screenPositionById.get(id)
    return ghostRelationships
      .map((r) => {
        const a = pos(r.sourceId)
        const b = pos(r.targetId)
        if (!a || !b || (Math.abs(a.x - b.x) < 0.01 && Math.abs(a.y - b.y) < 0.01)) return null
        const mx = (a.x + b.x) / 2
        const my = (a.y + b.y) / 2
        const len = Math.hypot(b.x - a.x, b.y - a.y) || 1
        const off = len * 0.18
        return {
          id: r.id,
          d: `M${a.x},${a.y} Q${mx - ((b.y - a.y) * off) / len},${my + ((b.x - a.x) * off) / len} ${b.x},${b.y}`,
        }
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)
  }, [ghostRelationships, ghostProjected, screenPositionById])

  // The sidebar keeps the cluster the user opened, but never lists an entry
  // the current period or filters have since hidden.
  const livePanelEntries = useMemo(
    () => (panelEntries ? panelEntries.filter((e) => visibleEntryIds.has(e.id)) : null),
    [panelEntries, visibleEntryIds],
  )
  if (panelEntries && livePanelEntries && livePanelEntries.length === 0) setPanelEntries(null)
  const panelIds = useMemo(
    () => (livePanelEntries ? new Set(livePanelEntries.map((e) => e.id)) : null),
    [livePanelEntries],
  )

  function openClusterPanel(cluster: MarkerCluster) {
    // The sidebar snapshots the bubble's entries, then the map zooms in on it
    // (as it always did) so the individual pins start to separate.
    setPanelEntries(cluster.items.map((i) => i.entry))
    setHighlightedEntryId(null)
    setRouteTooltip(null)
    const xs = cluster.items.map((i) => i.x)
    const ys = cluster.items.map((i) => i.y)
    const spread = Math.hypot(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys))
    if (spread >= 1 && transform.k < 7) {
      const desktop = !window.matchMedia('(max-width: 720px)').matches
      applyZoom(
        Math.min(transform.k * 2.4, 8),
        cluster.x,
        cluster.y,
        desktop ? Math.min(440, size.width * 0.92) / 2 : 0,
      )
    }
  }

  function closeClusterPanel() {
    // Hand focus back to the bubble (or marker) that stands for the cluster.
    const target = svgRef.current?.querySelector<HTMLElement>('[data-in-panel="true"]')
    setPanelEntries(null)
    setHighlightedEntryId(null)
    target?.focus()
  }

  function showEntryOnMap(entryId: string) {
    const p = projected.find((pr) => pr.entry.id === entryId)
    if (!p) return
    setHighlightedEntryId(entryId)
    // Zoom just far enough that the entry separates from its neighbours,
    // but never so far that the surrounding geography is lost.
    let nearest = Infinity
    for (const other of projected) {
      if (other.entry.id === entryId) continue
      nearest = Math.min(nearest, Math.hypot(other.x - p.x, other.y - p.y))
    }
    const separating = Number.isFinite(nearest) ? (CLUSTER_THRESHOLD_PX / nearest) * 1.25 : 3
    const k = Math.min(4, Math.max(transform.k, 2.5, separating))
    const desktop = !window.matchMedia('(max-width: 720px)').matches
    applyZoom(k, p.x, p.y, desktop ? Math.min(440, size.width * 0.92) / 2 : 0)
  }

  return (
    <div className={styles.wrap} ref={wrapRef}>
      {!showList && immersive && <EraDecor eraId={eraId} />}
      {!showList && <div className={styles.vignette} aria-hidden />}
      {!showList && <div className={styles.ageStains} aria-hidden />}
      {!showList && <CompassRose />}
      {!showList ? (
        <svg
          ref={svgRef}
          className={styles.svg}
          viewBox={`0 0 ${size.width} ${size.height}`}
          role="application"
          aria-label="Interactive map of the STS Interactive Map atlas. Use the list view toggle for a keyboard- and screen-reader-friendly alternative."
        >
          <MapDefs />
          <g transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}>
            <BaseMap
              width={size.width}
              height={size.height}
              land={detailed ? paths.landFine : paths.landCoarse}
              borders={detailed ? paths.bordersFine : paths.bordersCoarse}
              graticule={paths.graticule}
              strokeScale={Math.round((1 / transform.k) * 20) / 20}
            />
            {routeCurves.map(({ rel, d, midX, midY }) => {
              const dimmed = hoveredId && rel.sourceId !== hoveredId && rel.targetId !== hoveredId
              return (
                <path
                  key={rel.id}
                  d={d}
                  className={`${styles.route} ${BROKEN_TYPES.has(rel.type) ? styles.routeBroken : ''} ${rel.proposed ? styles.routeProposed : ''} ${dimmed ? styles.routeDimmed : ''}`}
                  style={{ strokeWidth: connectionWidth(rel) / Math.sqrt(transform.k) }}
                  tabIndex={0}
                  role="button"
                  aria-label={`${rel.type} relationship: ${rel.summary}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setRouteTooltip({ relationship: rel, x: midX, y: midY })
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setRouteTooltip({ relationship: rel, x: midX, y: midY })
                    }
                  }}
                />
              )
            })}

            {ghostCurves.map((g) => (
              <path
                key={`ghost-${g.id}`}
                d={g.d}
                className={styles.ghostRoute}
                style={{ strokeWidth: 1 / Math.sqrt(transform.k) }}
                aria-hidden
              />
            ))}
            {ghostProjected.map(({ entry, x, y }) => (
              <circle
                key={`ghost-${entry.id}`}
                cx={x}
                cy={y}
                r={5.5 / Math.sqrt(transform.k)}
                className={styles.ghostMarker}
                style={{ strokeWidth: 1 / Math.sqrt(transform.k) }}
                aria-hidden
                onClick={(e) => {
                  e.stopPropagation()
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
                const dimmed =
                  (hoveredId !== null && hoveredId !== entry.id) || (panelIds !== null && !inPanel)
                const outside = outsideIds?.has(entry.id) ?? false
                const r = 9 / Math.sqrt(transform.k)
                return (
                  <g
                    key={entry.id}
                    transform={`translate(${x},${y})`}
                    className={`${styles.marker} ${selected || highlighted ? styles.markerSelected : ''} ${dimmed ? styles.markerDimmed : ''} ${outside ? styles.markerOutside : ''}`}
                    data-in-panel={inPanel ? 'true' : undefined}
                    tabIndex={0}
                    role="button"
                    aria-label={`${entry.title}, ${entry.dateDisplay}. ${entry.kind}.${entry.origin === 'personal' ? ' From your notes.' : ''}${outside ? ' Outside the selected period.' : ''}`}
                    onMouseEnter={() => setHoveredId(entry.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onFocus={() => setHoveredId(entry.id)}
                    onBlur={() => setHoveredId(null)}
                    onClick={(e) => {
                      e.stopPropagation()
                      setPanelEntries(null)
                      onSelectEntry(entry.id)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setPanelEntries(null)
                        onSelectEntry(entry.id)
                      }
                    }}
                  >
                    <circle className={styles.pulse} r={r} />
                    {entry.origin === 'personal' && (
                      <rect
                        className={`${styles.personalRing} ${entry.personal?.status === 'needs-review' ? styles.personalRingUnreviewed : ''}`}
                        x={-(r + 3 / Math.sqrt(transform.k))}
                        y={-(r + 3 / Math.sqrt(transform.k))}
                        width={(r + 3 / Math.sqrt(transform.k)) * 2}
                        height={(r + 3 / Math.sqrt(transform.k)) * 2}
                        transform="rotate(45)"
                        style={{ strokeWidth: 1.6 / Math.sqrt(transform.k) }}
                        aria-hidden
                      />
                    )}
                    <circle className={styles.markerDot} r={r} />
                    <g
                      className={styles.markerIcon}
                      transform={`translate(${-r * 0.6},${-r * 0.6}) scale(${(r * 1.2) / 14})`}
                    >
                      <MarkerIcon kind={entry.kind} size={14} />
                    </g>
                    {(transform.k > 4 || hoveredId === entry.id || selected || highlighted) && (
                      <g transform={`scale(${1 / transform.k})`}>
                        <text className={styles.markerLabel} x={r * transform.k + 6} y={4}>
                          {entry.title}
                        </text>
                      </g>
                    )}
                  </g>
                )
              }
              const r = Math.min(10 + cluster.items.length * 1.3, 22) / Math.sqrt(transform.k)
              const inPanel = cluster.items.some((i) => panelIds?.has(i.entry.id))
              const highlighted = cluster.items.some((i) => i.entry.id === highlightedEntryId)
              const dimmed = panelIds !== null && !inPanel
              const count = cluster.items.length
              return (
                <g
                  key={cluster.id}
                  transform={`translate(${cluster.x},${cluster.y})`}
                  className={`${styles.cluster} ${inPanel ? styles.clusterSelected : ''} ${dimmed ? styles.clusterDimmed : ''}`}
                  data-in-panel={inPanel ? 'true' : undefined}
                  tabIndex={0}
                  role="button"
                  aria-label={`Open ${count} map entries`}
                  aria-haspopup="dialog"
                  aria-expanded={inPanel}
                  onClick={(e) => {
                    e.stopPropagation()
                    openClusterPanel(cluster)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      openClusterPanel(cluster)
                    }
                  }}
                >
                  {(inPanel || highlighted) && (
                    <circle className={styles.clusterRing} r={r + 5 / Math.sqrt(transform.k)} />
                  )}
                  <circle className={styles.clusterDot} r={r} />
                  <g transform={`scale(${1 / transform.k})`}>
                    <text className={styles.clusterCount}>{count}</text>
                  </g>
                </g>
              )
            })}
          </g>
        </svg>
      ) : (
        <EntryListFallback
          entries={entries}
          onSelectEntry={onSelectEntry}
          selectedEntryId={selectedEntryId}
        />
      )}

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.zoomBtn}
          aria-label="Zoom in"
          onClick={() => applyZoom(Math.min(transform.k * 1.5, 10))}
        >
          +
        </button>
        <button
          type="button"
          className={styles.zoomBtn}
          aria-label="Zoom out"
          onClick={() => applyZoom(Math.max(transform.k / 1.5, 0.9))}
        >
          −
        </button>
        <button
          type="button"
          className={styles.zoomBtn}
          aria-label="Reset view"
          onClick={resetView}
        >
          ⟲
        </button>
        <button
          type="button"
          className={styles.zoomBtn}
          aria-pressed={showList}
          aria-label={showList ? 'Switch to map view' : 'Switch to accessible list view'}
          onClick={() => setShowList((s) => !s)}
        >
          ☰
        </button>
      </div>

      {!showList && entries.length === 0 && (
        <p className={styles.emptyNote} role="status">
          No entries match the current filters. Clear or reset them to see the map again.
        </p>
      )}

      {!showList && noCoordEntries.length > 0 && (
        <details className={styles.unplaced}>
          <summary>
            {noCoordEntries.length} idea{noCoordEntries.length === 1 ? '' : 's'} with no single
            place
          </summary>
          <p className={styles.unplacedHint}>
            Ideas, methods and movements that span many places are not pinned to the map.
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

      {!showList && (
        <p className={styles.borderNote}>
          Borders shown are modern coastlines for orientation only — political boundaries shifted
          constantly across the periods this atlas covers.
        </p>
      )}

      {panelEntries && livePanelEntries && livePanelEntries.length > 0 && !showList && (
        <ClusterPanel
          // A fresh cluster click resets search, sort and any open entry.
          key={panelEntries.map((e) => e.id).join('|')}
          entries={livePanelEntries}
          outsideIds={outsideIds}
          onClose={closeClusterPanel}
          onShowOnMap={showEntryOnMap}
          {...clusterTools}
        />
      )}

      {routeTooltip && (
        <div
          className={styles.tooltip}
          style={{
            left: Math.min(
              Math.max(routeTooltip.x * transform.k + transform.x - 120, 10),
              size.width - 280,
            ),
            top: Math.max(routeTooltip.y * transform.k + transform.y - 70, 10),
            pointerEvents: 'auto',
          }}
          role="dialog"
          aria-label="Relationship detail"
        >
          <strong style={{ textTransform: 'capitalize' }}>
            {routeTooltip.relationship.type.replace('-', ' ')}
          </strong>
          <p style={{ margin: '0 0 6px' }}>{routeTooltip.relationship.summary}</p>
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-ink-faint)' }}>
            Confidence: {routeTooltip.relationship.confidence}
          </p>
          <button
            type="button"
            style={{
              marginTop: 6,
              background: 'none',
              border: '1px solid var(--color-border-strong)',
              borderRadius: 4,
              color: 'var(--color-ink)',
              cursor: 'pointer',
            }}
            onClick={() => setRouteTooltip(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  )
}
