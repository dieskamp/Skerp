"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { AnimatePresence, animate, m, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "motion/react"

import { SectionHeading } from "@/components/motion/section-heading"
import { useReducedMotion } from "@/lib/use-media-query"
import { cn } from "@/lib/utils"

const fotos = [
  { src: "/gallery/skerp-1.jpg", alt: "Geslepen lemmet detail", w: "w-[78vw] sm:w-[52vw] lg:w-[34rem]", ratio: "aspect-[4/3]" },
  { src: "/gallery/skerp-6.jpg", alt: "Japanse waterstenen", w: "w-[58vw] sm:w-[34vw] lg:w-[20rem]", ratio: "aspect-[9/16]" },
  { src: "/gallery/skerp-2.jpg", alt: "Werkbank tijdens slijpen", w: "w-[78vw] sm:w-[52vw] lg:w-[34rem]", ratio: "aspect-[4/3]" },
  { src: "/gallery/skerp-5.jpg", alt: "Voor en na slijpresultaat", w: "w-[66vw] sm:w-[40vw] lg:w-[26rem]", ratio: "aspect-[3/4]" },
  { src: "/gallery/skerp-3.jpg", alt: "Afwerking op leren strop", w: "w-[72vw] sm:w-[46vw] lg:w-[30rem]", ratio: "aspect-square" },
  { src: "/gallery/skerp-7.jpg", alt: "Klaar om op te halen", w: "w-[86vw] sm:w-[60vw] lg:w-[40rem]", ratio: "aspect-[16/9]" },
] as const

/**
 * Sleepbare carrousel met momentum. Klik (of Enter) opent de foto in een
 * lightbox met een shared-element transitie. Pijltjes en Escape werken ook.
 */
export function Werk() {
  const section = useRef<HTMLElement>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLUListElement>(null)
  const triggers = useRef<(HTMLButtonElement | null)[]>([])
  const dragged = useRef(false)
  const [open, setOpen] = useState<number | null>(null)
  const reducedMotion = useReducedMotion()

  const x = useMotionValue(0)

  // Scheeftrekken op scrollsnelheid: de foto's "buigen" mee als je hard scrollt.
  const { scrollY } = useScroll()
  const velocity = useSpring(useVelocity(scrollY), { stiffness: 300, damping: 50 })
  const skewX = useTransform(velocity, [-2500, 0, 2500], [7, 0, -7], { clamp: true })

  const minX = () => Math.min(0, (viewport.current?.clientWidth ?? 0) - (track.current?.scrollWidth ?? 0))

  const bringIntoView = (i: number) => {
    const item = triggers.current[i]?.parentElement
    if (!item) return
    const target = Math.max(minX(), Math.min(0, -item.offsetLeft + 20))
    if (reducedMotion) x.set(target)
    else animate(x, target, { type: "spring", stiffness: 200, damping: 30 })
  }

  const close = () => {
    const last = open
    setOpen(null)
    if (last !== null) requestAnimationFrame(() => triggers.current[last]?.focus())
  }

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
      if (e.key === "ArrowRight") setOpen((v) => (v === null ? v : (v + 1) % fotos.length))
      if (e.key === "ArrowLeft") setOpen((v) => (v === null ? v : (v - 1 + fotos.length) % fotos.length))
    }
    window.addEventListener("keydown", onKey)
    document.documentElement.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.documentElement.style.overflow = ""
    }
    // close is stabiel genoeg; we willen alleen reageren op open/dicht
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const current = open !== null ? fotos[open] : null

  return (
    <section ref={section} id="werk" aria-labelledby="werk-titel" className="relative">
      <div className="mx-auto max-w-6xl px-5 pt-28 md:pt-40">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading index="05" eyebrow="WERK IN BEELD" title="Het resultaat" id="werk-titel" />
          <p aria-hidden="true" className="font-mono text-xs tracking-[0.2em] text-steel-400 uppercase">
            ← Sleep →
          </p>
        </div>
      </div>

      <div ref={viewport} className="mt-14 overflow-hidden pb-28 md:pb-40">
        <m.ul
          ref={track}
          drag="x"
          dragConstraints={viewport}
          dragElastic={0.12}
          dragTransition={{ power: 0.35, timeConstant: 320 }}
          onDragStart={() => {
            dragged.current = true
          }}
          onDragEnd={() => {
            requestAnimationFrame(() => {
              dragged.current = false
            })
          }}
          style={{ x, skewX: reducedMotion ? 0 : skewX }}
          className="flex w-max cursor-grab items-center gap-5 px-5 active:cursor-grabbing md:gap-8 md:pl-[max(1.25rem,calc((100vw-72rem)/2+1.25rem))]"
          data-cursor="hover"
        >
          {fotos.map((f, i) => (
            <li key={f.src} className={cn("shrink-0", f.w)}>
              <button
                ref={(el) => {
                  triggers.current[i] = el
                }}
                type="button"
                onClick={() => {
                  if (!dragged.current) setOpen(i)
                }}
                onFocus={() => bringIntoView(i)}
                className="group block w-full text-left"
              >
                <m.div
                  layoutId={`foto-${i}`}
                  className={cn("relative overflow-hidden rounded-sm border border-steel-700 bg-steel-800", f.ratio)}
                >
                  <Image
                    src={f.src}
                    alt={f.alt}
                    fill
                    draggable={false}
                    sizes="(min-width: 1024px) 40rem, (min-width: 640px) 60vw, 86vw"
                    className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-steel-950/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />
                </m.div>
                <span className="mt-3 flex items-center gap-3 font-mono text-[11px] tracking-[0.18em] text-steel-400 uppercase">
                  <span className="text-edge">{String(i + 1).padStart(2, "0")}</span>
                  {f.alt}
                </span>
              </button>
            </li>
          ))}
        </m.ul>
      </div>

      <AnimatePresence>
        {current && open !== null ? (
          <m.div
            key="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={current.alt}
            data-lenis-prevent
            className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="Sluiten"
              tabIndex={-1}
              onClick={close}
              className="absolute inset-0 bg-steel-950/90 backdrop-blur-md"
            />
            <m.div
              layoutId={`foto-${open}`}
              className="relative h-[80svh] w-full max-w-5xl overflow-hidden rounded-sm"
              transition={{ type: "spring", stiffness: 220, damping: 30 }}
            >
              <Image src={current.src} alt={current.alt} fill sizes="100vw" className="object-contain" />
            </m.div>

            <div className="absolute top-4 right-4 flex gap-2">
              <button
                type="button"
                autoFocus
                onClick={close}
                aria-label="Sluiten"
                className="grid size-11 place-items-center rounded-full border border-steel-600 bg-steel-900 text-chrome hover:border-edge"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="absolute inset-x-0 bottom-6 flex justify-center gap-3">
              <button
                type="button"
                aria-label="Vorige foto"
                onClick={() => setOpen((open - 1 + fotos.length) % fotos.length)}
                className="grid size-11 place-items-center rounded-full border border-steel-600 bg-steel-900 text-chrome hover:border-edge"
              >
                <ChevronLeft className="size-5" />
              </button>
              <span className="grid place-items-center px-3 font-mono text-xs text-steel-300">
                {open + 1} / {fotos.length}
              </span>
              <button
                type="button"
                aria-label="Volgende foto"
                onClick={() => setOpen((open + 1) % fotos.length)}
                className="grid size-11 place-items-center rounded-full border border-steel-600 bg-steel-900 text-chrome hover:border-edge"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}
