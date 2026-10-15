"use client"

import { useRef } from "react"

import { gsap, SplitText, useGSAP } from "@/lib/gsap"
import { useReducedMotion } from "@/lib/use-media-query"

/**
 * Tekst die per regel oplicht terwijl je scrollt (opacity 0.2 naar 1, gescrubd).
 * Splitst opnieuw bij resize zodat de regels altijd kloppen.
 */
export function ScrubLines({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      const el = ref.current
      if (!el || reducedMotion) return
      const split = SplitText.create(el.querySelectorAll("p"), {
        type: "lines",
        linesClass: "scrub-line",
        autoSplit: true,
        onSplit: (self) =>
          gsap.fromTo(
            self.lines,
            { opacity: 0.2 },
            {
              opacity: 1,
              stagger: 0.5,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top 75%", end: "bottom 45%", scrub: true },
            }
          ),
      })
      return () => split.revert()
    },
    { dependencies: [reducedMotion] }
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
