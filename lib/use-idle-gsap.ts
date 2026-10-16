"use client"

import { ScrollTrigger, useGSAP } from "@/lib/gsap"

type Cleanup = void | (() => void)

// Na een reeks uitgestelde setups één keer alle posities herberekenen,
// zodat pins (zoals Werkwijze) de triggers eronder niet laten verschuiven.
let refreshTimer: number | undefined
function scheduleRefresh() {
  window.clearTimeout(refreshTimer)
  refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 120)
}

type Config = {
  scope?: React.RefObject<Element | null>
  dependencies?: unknown[]
}

/**
 * Zoals useGSAP, maar de setup draait pas als de browser even niets te doen
 * heeft. Animaties onder de vouw blokkeren zo de eerste weergave niet.
 * Alles wat in `setup` gemaakt wordt, ruimt GSAP gewoon zelf op.
 */
export function useIdleGSAP(setup: () => Cleanup, { scope, dependencies = [] }: Config) {
  useGSAP(
    (_context, contextSafe) => {
      let cleanup: Cleanup
      const run = contextSafe
        ? contextSafe(() => {
            cleanup = setup()
            scheduleRefresh()
          })
        : () => {
            cleanup = setup()
            scheduleRefresh()
          }

      const hasIdle = typeof window.requestIdleCallback === "function"
      const id = hasIdle ? window.requestIdleCallback(run, { timeout: 1500 }) : window.setTimeout(run, 300)

      return () => {
        if (hasIdle) window.cancelIdleCallback(id)
        else window.clearTimeout(id)
        if (typeof cleanup === "function") cleanup()
      }
    },
    { scope, dependencies }
  )
}
