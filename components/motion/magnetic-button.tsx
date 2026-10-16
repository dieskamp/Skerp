"use client"

import { m, useMotionValue, useSpring } from "motion/react"
import { useRef } from "react"

import { useFinePointer, useReducedMotion } from "@/lib/use-media-query"
import { cn } from "@/lib/utils"

type MagneticProps = {
  children: React.ReactNode
  className?: string
  /** Hoe sterk het element naar de cursor trekt (0 tot 1). */
  strength?: number
}

/**
 * Wikkel een primaire CTA hierin: het element trekt licht naar de cursor.
 * Puur visueel; klik en toetsenbord werken precies als het kind zelf.
 */
export function Magnetic({ children, className, strength = 0.35 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const finePointer = useFinePointer()
  const reducedMotion = useReducedMotion()
  const active = finePointer && !reducedMotion

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 })

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!active || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <m.div
      ref={ref}
      className={cn("inline-flex", className)}
      style={active ? { x: springX, y: springY } : undefined}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
    >
      {children}
    </m.div>
  )
}
