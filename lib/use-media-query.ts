"use client"

import { useSyncExternalStore } from "react"

/**
 * Leest een media query en blijft luisteren naar wijzigingen.
 * Op de server (en tijdens hydration) geeft hij `serverValue` terug.
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query)
      mql.addEventListener("change", onChange)
      return () => mql.removeEventListener("change", onChange)
    },
    () => window.matchMedia(query).matches,
    () => serverValue
  )
}

/** true als de gebruiker minder beweging wil. Op de server: true (veilig, alles zichtbaar). */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)", true)
}

/** true op apparaten met een muis of trackpad. */
export function useFinePointer(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine)", false)
}
