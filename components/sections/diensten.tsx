"use client"

import { Axe, ChefHat, PocketKnife, Scissors, Sparkles } from "lucide-react"
import { useRef } from "react"

import { KnifeIcon } from "@/components/icons/knife"
import { Reveal } from "@/components/motion/reveal"
import { SectionHeading } from "@/components/motion/section-heading"
import { TiltCard } from "@/components/motion/tilt-card"
import { gsap, useGSAP } from "@/lib/gsap"
import { useReducedMotion } from "@/lib/use-media-query"

const diensten = [
  {
    icon: ChefHat,
    titel: "Keukenmes (standaard)",
    prijs: "vanaf €4",
    beschrijving: "Westers koksmes, schilmes, fileermes. Geslepen op band en afgewerkt op leer.",
  },
  {
    icon: KnifeIcon,
    titel: "Keukenmes (groot)",
    prijs: "vanaf €6",
    beschrijving: "Grote koksmessen en hakmessen vanaf 20cm.",
  },
  {
    icon: Sparkles,
    titel: "Japans mes",
    prijs: "vanaf €12",
    beschrijving: "Honyaki, santoku, nakiri, gyuto. Met de hand op japanse waterstenen tot 3000 grit.",
  },
  {
    icon: Scissors,
    titel: "Schaar",
    prijs: "vanaf €5",
    beschrijving: "Huishoudschaar, kapperschaar, hobbyschaar.",
  },
  {
    icon: PocketKnife,
    titel: "Zakmes / EDC",
    prijs: "vanaf €6",
    beschrijving: "Folders en vaste zakmessen, ook premium merken zoals WE Knife, Benchmade, Spyderco.",
  },
  {
    icon: Axe,
    titel: "Slagers- & hakmes",
    prijs: "vanaf €8",
    beschrijving: "Zware messen voor zwaar werk.",
  },
] as const

export function Diensten() {
  const grid = useRef<HTMLUListElement>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      if (reducedMotion) return
      const cards = gsap.utils.toArray<HTMLElement>(".dienst")
      // De kaarten worden als een handvol messen op tafel gegooid en schuiven op hun plek.
      gsap.from(cards, {
        y: (i) => 260 + (i % 3) * 80,
        x: (i) => ((i % 3) - 1) * -120,
        rotation: () => gsap.utils.random(-18, 18),
        rotateX: 55,
        scale: 0.8,
        autoAlpha: 0,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: grid.current, start: "top 95%", end: "top 35%", scrub: 1 },
      })
      // Daarna bewegen de kolommen op net verschillende snelheden
      const mm = gsap.matchMedia()
      mm.add("(min-width: 1024px)", () => {
        cards.forEach((card, i) => {
          gsap.to(card.querySelector(".dienst-par"), {
            y: [-30, 30, -10][i % 3],
            ease: "none",
            scrollTrigger: { trigger: grid.current, start: "top 35%", end: "bottom top", scrub: true },
          })
        })
      })
    },
    { scope: grid, dependencies: [reducedMotion] }
  )

  return (
    <section id="diensten" aria-labelledby="diensten-titel" className="relative">
      <div className="mx-auto max-w-6xl px-5 py-28 md:py-40">
        <SectionHeading index="02" eyebrow="DIENSTEN & TARIEVEN" title="Wat ik voor je slijp" id="diensten-titel" />

        <ul ref={grid} className="mt-16 grid gap-5 [perspective:1200px] sm:grid-cols-2 lg:grid-cols-3">
          {diensten.map((d, i) => {
            const Icon = d.icon
            return (
              <li key={d.titel} className="dienst">
                <div className="dienst-par h-full">
                <TiltCard className="h-full">
                  <div className="flex h-full flex-col p-6">
                    <div className="flex items-start justify-between gap-4">
                      <span aria-hidden="true" className="font-mono text-xs text-steel-400">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="rounded-sm border border-steel-700 bg-steel-800 p-2.5 text-steel-300 transition-colors group-hover/tilt:border-edge/60 group-hover/tilt:text-edge">
                        <Icon className="size-5" aria-hidden="true" />
                      </div>
                    </div>
                    <h3 className="mt-10 font-heading text-2xl font-bold tracking-tight text-chrome uppercase">
                      {d.titel}
                    </h3>
                    <p className="text-chrome-gradient mt-2 font-heading text-4xl font-black">{d.prijs}</p>
                    <p className="mt-4 text-sm leading-relaxed text-steel-300">{d.beschrijving}</p>
                  </div>
                </TiltCard>
                </div>
              </li>
            )
          })}
        </ul>

        <Reveal className="mt-10">
          <p className="text-sm text-steel-400">Prijzen zijn indicatief. Beschadigde sneden of speciaal werk in overleg.</p>
        </Reveal>
      </div>
    </section>
  )
}
