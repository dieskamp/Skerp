"use client"

import { useRef } from "react"

import { gsap } from "@/lib/gsap"
import { useIdleGSAP } from "@/lib/use-idle-gsap"
import { useReducedMotion } from "@/lib/use-media-query"

type RevealProps = {
  children: React.ReactNode
  className?: string
  /** Animeer de directe kinderen één voor één in plaats van het geheel. */
  stagger?: number
  y?: number
  delay?: number
}

/**
 * Laat inhoud omhoog schuiven en scherp worden zodra het in beeld komt.
 * Bewust opacity (niet visibility): links en knoppen blijven met Tab bereikbaar.
 */
export function Reveal({ children, className, stagger, y = 60, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useIdleGSAP(
    () => {
      const el = ref.current
      if (!el || reducedMotion) return
      const targets = stagger !== undefined ? Array.from(el.children) : el
      gsap.from(targets, {
        y,
        opacity: 0,
        filter: "blur(10px)",
        duration: 1.1,
        delay,
        stagger,
        ease: "expo.out",
        clearProps: "filter",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      })
    },
    { dependencies: [reducedMotion, stagger, y, delay] }
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
