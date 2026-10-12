import { useId, useState } from 'react'
import { communicationModels, type CommunicationModel } from '../data/communicationModels'
import styles from './CommunicationModels.module.css'

const ROWS: { key: keyof CommunicationModel; label: string }[] = [
  { key: 'summary', label: 'What it is' },
  { key: 'strengths', label: 'Strengths' },
  { key: 'limitations', label: 'Limitations' },
  { key: 'suitable', label: 'Suitable contexts' },
  { key: 'power', label: 'Power relationships' },
  { key: 'history', label: 'Historical development' },
  { key: 'examples', label: 'Examples' },
]

/**
 * An interactive comparison of three communication models. Shows one model
 * at a time, or all three side by side. Deliberately framed as overlapping
 * approaches that coexist, never as stages in which one replaced another.
 */
export function CommunicationModels({ initial }: { initial?: string }) {
  const start = communicationModels.find((m) => m.entryId === initial)?.id ?? 'deficit'
  const [selected, setSelected] = useState<CommunicationModel['id']>(start)
  const [compare, setCompare] = useState(false)
  const baseId = useId()
  const current = communicationModels.find((m) => m.id === selected) ?? communicationModels[0]

  return (
    <section className={styles.wrap} aria-label="Compare communication models">
      <h3 className={styles.heading}>Compare the three models</h3>
      <p className={styles.caveat}>
        These are overlapping approaches, not stages: institutions often use all three at once, and
        the older ones never fully disappeared.
      </p>

      <div className={styles.controls}>
        <div role="tablist" aria-label="Communication model" className={styles.tabs}>
          {communicationModels.map((m) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              id={`${baseId}-tab-${m.id}`}
              aria-selected={!compare && selected === m.id}
              aria-controls={`${baseId}-panel`}
              tabIndex={!compare && selected === m.id ? 0 : -1}
              className={`${styles.tab} ${!compare && selected === m.id ? styles.tabActive : ''}`}
              onClick={() => {
                setSelected(m.id)
                setCompare(false)
              }}
              onKeyDown={(e) => {
                const i = communicationModels.findIndex((x) => x.id === m.id)
                const next =
                  e.key === 'ArrowRight'
                    ? communicationModels[(i + 1) % communicationModels.length]
                    : e.key === 'ArrowLeft'
                      ? communicationModels[
                          (i + communicationModels.length - 1) % communicationModels.length
                        ]
                      : null
                if (next) {
                  e.preventDefault()
                  setSelected(next.id)
                  setCompare(false)
                  document.getElementById(`${baseId}-tab-${next.id}`)?.focus()
                }
              }}
            >
              {m.name}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={styles.compareBtn}
          aria-pressed={compare}
          onClick={() => setCompare((c) => !c)}
        >
          Side by side
        </button>
      </div>

      <div id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-tab-${selected}`}>
        {compare ? (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">
                    <span className={styles.srOnly}>Aspect</span>
                  </th>
                  {communicationModels.map((m) => (
                    <th key={m.id} scope="col">
                      {m.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.key}>
                    <th scope="row">{row.label}</th>
                    {communicationModels.map((m) => (
                      <td key={m.id}>{m[row.key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <dl className={styles.list}>
            {ROWS.map((row) => (
              <div key={row.key}>
                <dt>{row.label}</dt>
                <dd>{current[row.key]}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  )
}
