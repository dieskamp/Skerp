"use client"

import Lenis from "lenis"
import { LazyMotion, MotionConfig } from "motion/react"
import { useEffect } from "react"

import { gsap, ScrollTrigger } from "@/lib/gsap"
import { useFinePointer, useReducedMotion } from "@/lib/use-media-query"

const loadMotionFeatures = () => import("@/lib/motion-features").then((mod) => mod.default)

/**
 * Smooth scroll met Lenis, aangedreven door de GSAP-ticker zodat
 * ScrollTrigger en Lenis precies hetzelfde frame zien.
 * Bij prefers-reduced-motion blijft de native scroll actief.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion()
  // Op touchscreens voegt Lenis niets toe (native scroll is daar al soepel).
  const finePointer = useFinePointer()

  useEffect(() => {
    if (reducedMotion || !finePointer) return

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
  }, [reducedMotion, finePointer])

  // MotionConfig: alle motion-animaties respecteren ook prefers-reduced-motion
  // LazyMotion: de animatie-features van motion komen in een los, later geladen bestand.
  return (
    <LazyMotion features={loadMotionFeatures}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  )
}
