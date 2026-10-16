"use client"

import { useRef } from "react"

import { SectionHeading } from "@/components/motion/section-heading"
import { gsap } from "@/lib/gsap"
import { useIdleGSAP } from "@/lib/use-idle-gsap"
import { useReducedMotion } from "@/lib/use-media-query"

const stappen = [
  {
    nr: "01",
    titel: "Plan online",
    tekst: "Kies een datum en tijd via het afsprakenformulier.",
  },
  {
    nr: "02",
    titel: "Breng langs",
    tekst: "Lever je messen veilig verpakt af op het afgesproken moment in Leeuwarden.",
  },
  {
    nr: "03",
    titel: "Vakwerk",
    tekst: "Peter beoordeelt elk mes en kiest de juiste methode: band, steen of een combinatie.",
  },
  {
    nr: "04",
    titel: "Scheermesscherp terug",
    tekst: "Binnen enkele dagen kun je je messen ophalen, klaar voor jaren plezier.",
  },
] as const

// Per stap wordt de voortgangslijn dunner en feller: hij wordt "geslepen".
const EDGE_HEIGHT = [14, 8, 4, 1.5]
const EDGE_GLOW = [0, 6, 14, 26]

/**
 * Gepinde sectie: verticaal scrollen schuift de stappen horizontaal voorbij.
 * Bij reduced motion staan de stappen gewoon onder elkaar.
 */
export function Werkwijze() {
  const root = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  useIdleGSAP(
    () => {
      if (reducedMotion) return
      const track = root.current?.querySelector<HTMLElement>(".ww-track")
      const edge = root.current?.querySelector<HTMLElement>(".ww-edge")
      if (!track || !edge) return

      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)
      let step = -1

      const horizontal = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          pin: true,
          start: "top top",
          end: () => `+=${distance() * 1.1}`,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            gsap.set(".ww-fill", { scaleX: self.progress })
            const next = Math.min(stappen.length - 1, Math.floor(self.progress * stappen.length * 0.999))
            if (next === step) return
            step = next
            gsap.to(edge, {
              height: EDGE_HEIGHT[step],
              boxShadow: `0 0 ${EDGE_GLOW[step]}px ${EDGE_GLOW[step] / 3}px rgba(143,208,255,0.55)`,
              duration: 0.6,
              ease: "expo.out",
            })
            root.current?.querySelectorAll<HTMLElement>(".ww-tick").forEach((tick, i) => {
              tick.dataset.active = i <= step ? "true" : "false"
            })
          },
        },
      })

      gsap.utils.toArray<HTMLElement>(".ww-panel").forEach((panel) => {
        const shared = { containerAnimation: horizontal, trigger: panel, scrub: true }
        gsap.fromTo(
          panel.querySelector(".ww-fillnum"),
          { clipPath: "inset(0% 100% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { ...shared, start: "left 85%", end: "left 35%" } }
        )
        gsap.from(panel.querySelectorAll(".ww-text"), {
          x: 120,
          opacity: 0,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: { ...shared, start: "left 90%", end: "left 45%" },
        })
      })
    },
    { scope: root, dependencies: [reducedMotion] }
  )

  return (
    <section
      ref={root}
      id="werkwijze"
      aria-labelledby="werkwijze-titel"
      className="relative overflow-hidden motion-safe:flex motion-safe:h-svh motion-safe:flex-col motion-safe:justify-center"
    >
      <div className="mx-auto w-full max-w-6xl px-5 pt-28 motion-safe:pt-10">
        <SectionHeading index="03" eyebrow="ZO WERKT HET" title="Van bot naar scherp in vier stappen" id="werkwijze-titel" />
      </div>

      <ol className="ww-track mt-10 grid gap-6 px-5 pb-12 motion-safe:flex motion-safe:w-max motion-safe:gap-0 motion-safe:pb-0 motion-safe:pl-[max(1.25rem,calc((100vw-72rem)/2+1.25rem))] motion-safe:pr-[20vw]">
        {stappen.map((s) => (
          <li
            key={s.nr}
            className="ww-panel relative border-t border-steel-700 pt-6 motion-safe:w-[82vw] motion-safe:pr-10 sm:motion-safe:w-[60vw] lg:motion-safe:w-[38vw]"
          >
            <div aria-hidden="true" className="relative font-heading text-[6rem] leading-none font-black md:text-[8.5rem]">
              <span className="text-transparent [-webkit-text-stroke:1px_var(--steel-600)]">{s.nr}</span>
              <span className="ww-fillnum text-chrome-gradient absolute inset-0">{s.nr}</span>
            </div>
            <h3 className="ww-text mt-4 font-heading text-3xl font-bold tracking-tight text-chrome uppercase md:text-4xl">
              {s.titel}
            </h3>
            <p className="ww-text mt-3 max-w-sm text-base leading-relaxed text-steel-300">{s.tekst}</p>
          </li>
        ))}
      </ol>

      {/* Voortgang: een lijn die per stap scherper wordt */}
      <div aria-hidden="true" className="mx-auto mt-10 hidden w-full max-w-6xl px-5 pb-6 motion-safe:block">
        <div className="relative flex h-4 items-center">
          <div className="absolute inset-x-0 h-px bg-steel-700" />
          <div className="ww-fill absolute inset-x-0 flex origin-left scale-x-0 items-center">
            <div
              className="ww-edge h-[14px] w-full bg-gradient-to-r from-steel-600 via-chrome to-edge [clip-path:polygon(0_0,100%_40%,100%_60%,0_100%)]"
            />
          </div>
          {stappen.map((s, i) => (
            <span
              key={s.nr}
              data-active="false"
              className="ww-tick absolute top-1/2 size-2 -translate-1/2 rotate-45 border border-steel-600 bg-steel-950 transition-colors duration-300 data-[active=true]:border-edge data-[active=true]:bg-edge"
              style={{ left: `${(i / (stappen.length - 1)) * 100}%` }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
