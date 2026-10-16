"use client"

import { m, useScroll, useSpring } from "motion/react"

import { useReducedMotion } from "@/lib/use-media-query"

/** Dunne voortgangslijn bovenaan de pagina. */
export function ScrollProgress() {
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const smooth = useSpring(scrollYProgress, { stiffness: 220, damping: 40, mass: 0.3 })

  return (
    <m.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[70] h-0.5 origin-left bg-gradient-to-r from-steel-400 via-chrome to-edge"
      style={{ scaleX: reducedMotion ? scrollYProgress : smooth }}
    />
  )
}
