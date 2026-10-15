"use client"

import Image from "next/image"
import { useRef, useState } from "react"

import { SectionHeading } from "@/components/motion/section-heading"
import { gsap, useGSAP } from "@/lib/gsap"
import { useReducedMotion } from "@/lib/use-media-query"

/**
 * Interactieve voor/na-slider. Een echte range-input zorgt voor toetsenbord-
 * en screenreader-bediening; slepen met muis of vinger werkt overal.
 * Bij binnenkomen veegt de scheidslijn één keer over het beeld.
 */
export function VoorNa() {
  const root = useRef<HTMLElement>(null)
  const frame = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState(50)
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      if (reducedMotion) return
      const state = { p: 50 }
      gsap
        .timeline({ scrollTrigger: { trigger: frame.current, start: "top 70%", once: true } })
        .to(state, { p: 4, duration: 0.7, ease: "power2.inOut", onUpdate: () => setPos(Math.round(state.p)) })
        .to(state, { p: 96, duration: 1, ease: "power2.inOut", onUpdate: () => setPos(Math.round(state.p)) })
        .to(state, { p: 50, duration: 0.8, ease: "expo.out", onUpdate: () => setPos(Math.round(state.p)) })
      gsap.from(frame.current, {
        scale: 0.85,
        rotateX: 18,
        autoAlpha: 0,
        duration: 1.4,
        ease: "expo.out",
        scrollTrigger: { trigger: frame.current, start: "top 85%", once: true },
      })
    },
    { scope: root, dependencies: [reducedMotion] }
  )

  const setFromPointer = (clientX: number) => {
    const rect = frame.current?.getBoundingClientRect()
    if (!rect) return
    setPos(Math.round(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100))))
  }

  return (
    <section ref={root} id="voor-na" aria-labelledby="voor-na-titel" className="relative">
      <div className="mx-auto max-w-6xl px-5 py-28 md:py-40">
        <SectionHeading index="04" eyebrow="SCHERP VS BOT" title="Voor en na" id="voor-na-titel" />

        <div className="mt-14 [perspective:1400px]">
          <div
            ref={frame}
            className="relative aspect-[4/5] touch-pan-y overflow-hidden rounded-sm border border-steel-700 select-none sm:aspect-[16/10]"
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId)
              setFromPointer(e.clientX)
            }}
            onPointerMove={(e) => {
              if (e.currentTarget.hasPointerCapture(e.pointerId)) setFromPointer(e.clientX)
            }}
            data-cursor="hover"
          >
            {/* Na: scherp */}
            <Image
              src="/gallery/skerp-6.jpg"
              alt="Na: geslepen lemmet van dichtbij"
              fill
              sizes="(min-width: 1152px) 1152px, 100vw"
              className="object-cover"
            />
            {/* Voor: bot */}
            <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
              <Image
                src="/gallery/skerp-3.jpg"
                alt="Voor: messen voor het slijpen"
                fill
                sizes="(min-width: 1152px) 1152px, 100vw"
                className="object-cover brightness-75 grayscale"
              />
            </div>

            <span className="absolute top-4 left-4 rounded-sm bg-steel-950/70 px-3 py-1.5 font-mono text-xs tracking-[0.2em] text-steel-300 backdrop-blur">
              Voor
            </span>
            <span className="absolute top-4 right-4 rounded-sm bg-steel-950/70 px-3 py-1.5 font-mono text-xs tracking-[0.2em] text-edge backdrop-blur">
              Na
            </span>

            {/* Scheidslijn met handvat */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }}>
              <div className="absolute inset-y-0 -left-px w-0.5 bg-chrome shadow-[0_0_18px_3px_var(--edge)]" />
              <div className="absolute top-1/2 left-0 grid size-12 -translate-1/2 place-items-center rounded-full border border-chrome/60 bg-steel-950/70 font-mono text-xs text-chrome backdrop-blur">
                ‹ ›
              </div>
            </div>

            <input
              type="range"
              min={0}
              max={100}
              value={pos}
              onChange={(e) => setPos(Number(e.target.value))}
              aria-label="Schuif tussen voor en na"
              className="peer absolute inset-x-0 bottom-0 h-full w-full cursor-ew-resize opacity-0"
            />
            <div className="pointer-events-none absolute inset-0 rounded-sm ring-2 ring-edge opacity-0 ring-inset peer-focus-visible:opacity-100" />
          </div>
        </div>
      </div>
    </section>
  )
}
