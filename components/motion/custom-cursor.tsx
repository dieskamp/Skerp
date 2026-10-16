"use client"

import { useEffect, useRef } from "react"

import { gsap } from "@/lib/gsap"
import { useFinePointer, useReducedMotion } from "@/lib/use-media-query"

const INTERACTIVE = 'a, button, [role="button"], summary, label, [data-cursor="hover"]'

/**
 * Kleine stip + ring die de muis volgt. Alleen op apparaten met een fijne
 * pointer en zonder reduced motion. Puur decoratief: pointer-events none,
 * aria-hidden, en de echte focus-outline blijft altijd zichtbaar.
 */
export function CustomCursor() {
  const finePointer = useFinePointer()
  const reducedMotion = useReducedMotion()
  const enabled = finePointer && !reducedMotion

  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!enabled || !dot || !ring) return

    const root = document.documentElement
    root.classList.add("has-custom-cursor")

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, autoAlpha: 0 })
    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3.out" })
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3.out" })
    const ringX = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" })
    const ringY = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" })

    let visible = false
    const show = (value: boolean) => {
      if (visible === value) return
      visible = value
      gsap.to([dot, ring], { autoAlpha: value ? 1 : 0, duration: 0.2 })
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return
      dotX(e.clientX)
      dotY(e.clientY)
      ringX(e.clientX)
      ringY(e.clientY)
      const target = e.target instanceof Element ? e.target : null
      // Boven een iframe (Cal.com) kunnen we de muis niet volgen: verbergen.
      show(target?.tagName !== "IFRAME")
      const hovering = Boolean(target?.closest(INTERACTIVE))
      ring.dataset.hover = hovering ? "true" : "false"
    }
    const onLeave = () => show(false)
    const onDown = () => gsap.to(ring, { scale: 0.8, duration: 0.15 })
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.25 })

    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerdown", onDown)
    window.addEventListener("pointerup", onUp)
    root.addEventListener("pointerleave", onLeave)
    window.addEventListener("blur", onLeave)

    return () => {
      root.classList.remove("has-custom-cursor")
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointerup", onUp)
      root.removeEventListener("pointerleave", onLeave)
      window.removeEventListener("blur", onLeave)
      gsap.killTweensOf([dot, ring])
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
      <div
        ref={ringRef}
        data-hover="false"
        className="fixed top-0 left-0 size-9 rounded-full border border-chrome/50 transition-[width,height,background-color,border-color] duration-300 ease-[var(--ease-out-expo)] data-[hover=true]:size-16 data-[hover=true]:border-edge data-[hover=true]:bg-edge/10"
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 size-1.5 rounded-full bg-chrome mix-blend-difference"
      />
    </div>
  )
}
