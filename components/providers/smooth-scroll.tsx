"use client"

import Lenis from "lenis"
import { useEffect } from "react"

import { gsap, ScrollTrigger } from "@/lib/gsap"
import { useReducedMotion } from "@/lib/use-media-query"

/**
 * Smooth scroll met Lenis, aangedreven door de GSAP-ticker zodat
 * ScrollTrigger en Lenis precies hetzelfde frame zien.
 * Bij prefers-reduced-motion blijft de native scroll actief.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.12,
      // Ankerlinks (#diensten etc.) soepel scrollen, met ruimte voor de navbar
      anchors: { offset: -72 },
      // Laat scrollbare elementen (bijv. de Cal.com embed) met rust
      prevent: (node) => node.closest("[data-lenis-prevent]") !== null,
    })

    const onTick = (time: number) => lenis.raf(time * 1000)
    lenis.on("scroll", ScrollTrigger.update)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(onTick)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.destroy()
    }
  }, [reducedMotion])

  return children
}
