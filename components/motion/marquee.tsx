"use client"

import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity, wrap } from "motion/react"
import { useRef } from "react"

import { useReducedMotion } from "@/lib/use-media-query"

/**
 * Eindeloze tekstband die versnelt (en omdraait) met je scrollsnelheid.
 * Puur decoratief.
 */
export function Marquee({ text, speed = 3 }: { text: string; speed?: number }) {
  const reducedMotion = useReducedMotion()
  const base = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const factor = useTransform(velocity, [0, 1000], [0, 5], { clamp: false })
  const x = useTransform(base, (v) => `${wrap(-25, 0, v)}%`)
  const direction = useRef(-1)

  useAnimationFrame((_, delta) => {
    if (reducedMotion) return
    const f = factor.get()
    if (f < 0) direction.current = 1
    else if (f > 0) direction.current = -1
    base.set(base.get() + direction.current * speed * (delta / 1000) * (1 + Math.abs(f)))
  })

  return (
    <div aria-hidden="true" className="relative overflow-hidden border-y border-steel-800 py-6 select-none">
      <motion.div className="flex w-max whitespace-nowrap" style={{ x }}>
        {Array.from({ length: 4 }, (_, i) => (
          <span
            key={i}
            className="text-chrome-gradient pr-8 font-heading text-6xl font-black tracking-tight uppercase md:text-8xl"
          >
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
