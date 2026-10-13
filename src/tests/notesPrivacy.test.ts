import { describe, expect, it } from 'vitest'

/**
 * A development guard for the "no AI, no uploads" promise. It reads the notes
 * feature's source and fails if code appears that could send text away,
 * execute it, or render it as HTML. It complements (not replaces) the
 * browser check in scripts/verify-offline-import.mjs.
 */

const feature = import.meta.glob('../features/notes/**/*.{ts,tsx}', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>
const app = import.meta.glob(['../**/*.{ts,tsx}', '!../tests/**'], {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const FORBIDDEN: [RegExp, string][] = [
  [/\bfetch\s*\(/, 'fetch()'],
  [/XMLHttpRequest/, 'XMLHttpRequest'],
  [/sendBeacon/, 'sendBeacon'],
  [/\bWebSocket\b/, 'WebSocket'],
  [/\bEventSource\b/, 'EventSource'],
  [/anthropic|openai|api\.claude|generativelanguage/i, 'an AI provider'],
  [/api[_-]?key|x-api-key|authorization\s*:/i, 'an API key or auth header'],
  [/\beval\s*\(/, 'eval()'],
  [/new\s+Function\s*\(/, 'new Function()'],
  [/dangerouslySetInnerHTML/, 'dangerouslySetInnerHTML'],
  [/\.innerHTML\s*=/, 'innerHTML'],
  [/insertAdjacentHTML|document\.write/, 'raw HTML insertion'],
  [/https?:\/\//, 'a hard-coded URL'],
]

const stripComments = (code: string) =>
  code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')

describe('notes feature privacy and safety', () => {
  const files = Object.keys(feature)
  it('finds the feature sources', () => {
    expect(files.length).toBeGreaterThan(15)
  })
  for (const [re, label] of FORBIDDEN) {
    it(`contains no ${label}`, () => {
      const hits = files.filter((f) => re.test(stripComments(feature[f])))
      expect(hits).toEqual([])
    })
  }
  it('has no AI keys or environment-supplied secrets in the frontend source', () => {
    expect(Object.keys(app).length).toBeGreaterThan(50)
    for (const [f, src] of Object.entries(app)) {
      expect(src, f).not.toMatch(/sk-ant-|sk-[A-Za-z0-9]{20,}/)
      expect(src, f).not.toMatch(/import\.meta\.env\.\w*(KEY|SECRET|TOKEN)/i)
    }
  })
  it('loads only its own bundled libraries dynamically', () => {
    for (const [f, src] of Object.entries(feature)) {
      for (const m of src.matchAll(/import\(\s*['"]([^'"]+)['"]\s*\)/g)) {
        expect(m[1].startsWith('.') || m[1] === 'pdfjs-dist', `${f}: ${m[1]}`).toBe(true)
      }
    }
  })
})
