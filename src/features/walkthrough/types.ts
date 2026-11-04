import type { ViewName } from '../../hooks/useUrlState'

/** What the walkthrough needs to know about the app to word and target its steps. */
export interface WalkthroughContext {
  view: ViewName
  /** True while the modern satellite-style globe is showing instead of the flat map. */
  globe: boolean
  /** True when the viewer already has a personal ("Your Notes") collection. */
  hasPersonal: boolean
  /** True when an entry panel is open. */
  entryOpen: boolean
  /** True below the width at which the filters sidebar can be collapsed. */
  sidebarCollapsible: boolean
  /** True when that collapsible sidebar is currently closed. */
  sidebarClosed: boolean
}

export type WalkthroughAction = 'open-paths' | 'open-notes'

export interface WalkthroughStep {
  id: string
  title: string
  /** Plain-language name of what is highlighted; also read out in the text. */
  targetLabel?: string
  /**
   * `data-walkthrough` values to look for, in order of preference. The first
   * one that is on screen is highlighted; if none is, the step is shown as a
   * centred card instead.
   */
  targets?: string[]
  body: string
  /** The filters sidebar must be open for this step (matters only on narrow screens). */
  needsSidebar?: boolean
  /** Extra buttons offered only on the final step. */
  actions?: { id: WalkthroughAction; label: string }[]
}

export interface WalkthroughResult {
  status: 'completed' | 'dismissed'
  action?: WalkthroughAction
}
