import { useMemo, useRef } from 'react'
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  type SimulationNodeDatum,
} from 'd3'
import type { Entry, Relationship } from '../../../types'
import { MarkerIcon } from '../../../components/MarkerIcon'
import { provenanceOf } from '../provenance'
import styles from './notes.module.css'

interface ConceptNetworkProps {
  entries: Entry[]
  relationships: Relationship[]
  selectedId: string | null
  onSelect: (id: string) => void
}

interface Node extends SimulationNodeDatum {
  id: string
  entry: Entry
  degree: number
}

/**
 * A map of ideas for notes that are mostly not tied to places. Nodes are
 * entries; lines are relationships (dashed while still proposed). The layout
 * is computed once and then held still, so it respects reduced-motion settings
 * and the same notes always give the same picture.
 */
export function ConceptNetwork({
  entries,
  relationships,
  selectedId,
  onSelect,
}: ConceptNetworkProps) {
  const wrap = useRef<HTMLDivElement>(null)

  const { nodes, links } = useMemo(() => {
    const ids = new Set(entries.map((e) => e.id))
    const degree = new Map<string, number>()
    const valid = relationships.filter((r) => ids.has(r.sourceId) && ids.has(r.targetId))
    for (const r of valid) {
      degree.set(r.sourceId, (degree.get(r.sourceId) ?? 0) + 1)
      degree.set(r.targetId, (degree.get(r.targetId) ?? 0) + 1)
    }
    const nodes: Node[] = entries.slice(0, 250).map((entry, i) => {
      // A deterministic starting ring, so layouts are repeatable.
      const angle = (i / Math.max(1, entries.length)) * Math.PI * 2
      return {
        id: entry.id,
        entry,
        degree: degree.get(entry.id) ?? 0,
        x: Math.cos(angle) * 120,
        y: Math.sin(angle) * 120,
      }
    })
    const present = new Set(nodes.map((n) => n.id))
    const links = valid
      .filter((r) => present.has(r.sourceId) && present.has(r.targetId))
      .map((r) => ({
        source: r.sourceId,
        target: r.targetId,
        proposed: r.proposed === true,
        id: r.id,
      }))
    const sim = forceSimulation(nodes)
      .force(
        'link',
        forceLink<Node, { source: string; target: string }>(links)
          .id((d) => d.id)
          .distance(90),
      )
      .force('charge', forceManyBody().strength(-160))
      .force('collide', forceCollide(26))
      .force('center', forceCenter(0, 0))
      .stop()
    for (let i = 0; i < 260; i++) sim.tick()
    return { nodes, links }
  }, [entries, relationships])

  const byId = new Map(nodes.map((n) => [n.id, n]))
  // Frame the whole network, leaving room on the right for the labels.
  const xs = nodes.map((n) => n.x ?? 0)
  const ys = nodes.map((n) => n.y ?? 0)
  const minX = Math.min(0, ...xs) - 40
  const maxX = Math.max(0, ...xs) + 230
  const minY = Math.min(0, ...ys) - 40
  const maxY = Math.max(0, ...ys) + 40
  const viewBox = `${minX} ${minY} ${Math.max(300, maxX - minX)} ${Math.max(200, maxY - minY)}`
  return (
    <div className={styles.concepts} ref={wrap}>
      <svg
        className={styles.conceptsSvg}
        viewBox={viewBox}
        role="group"
        aria-label={`Concept network of ${nodes.length} entries from your notes. Each entry is a button; lines show relationships.`}
      >
        {links.map((l) => {
          const a = byId.get(l.source as unknown as string) ?? (l.source as unknown as Node)
          const b = byId.get(l.target as unknown as string) ?? (l.target as unknown as Node)
          if (!a || !b || a.x === undefined || b.x === undefined) return null
          return (
            <line
              key={l.id}
              className={`${styles.edge} ${l.proposed ? styles.edgeProposed : ''}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              strokeWidth={1.2}
            />
          )
        })}
        {nodes.map((n) => {
          const r = 12 + Math.min(10, n.degree * 2)
          const prov = provenanceOf(n.entry)
          const selected = n.id === selectedId
          return (
            <g
              key={n.id}
              className={styles.node}
              transform={`translate(${n.x ?? 0},${n.y ?? 0})`}
              tabIndex={0}
              role="button"
              aria-label={`${n.entry.title}. ${n.entry.kind}. ${prov.label}.`}
              onClick={() => onSelect(n.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelect(n.id)
                }
              }}
            >
              <circle
                r={r}
                fill="var(--chart-marker-fill, #eee)"
                stroke={
                  selected
                    ? 'var(--chart-marker-selected, #732f32)'
                    : 'var(--chart-marker-ink, #222)'
                }
                strokeWidth={selected ? 3 : 1.5}
                strokeDasharray={
                  prov.key === 'imported' ? '4 3' : prov.key === 'unreviewed' ? '1.5 3' : undefined
                }
              />
              <g
                transform={`translate(${-r * 0.55},${-r * 0.55}) scale(${(r * 1.1) / 14})`}
                style={{ color: 'var(--chart-marker-ink, #222)' }}
              >
                <MarkerIcon kind={n.entry.kind} size={14} />
              </g>
              <text className={styles.nodeLabel} x={r + 4} y={4}>
                {n.entry.title.length > 34 ? `${n.entry.title.slice(0, 33)}…` : n.entry.title}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
