"use client"

import { motion } from "motion/react"
import { useRef, useState } from "react"
import { Accordion as AccordionPrimitive } from "radix-ui"

import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion"
import { SectionHeading } from "@/components/motion/section-heading"
import { gsap, useGSAP } from "@/lib/gsap"
import { useReducedMotion } from "@/lib/use-media-query"

const items = [
  {
    q: "Hoe lang duurt het?",
    a: "Meestal 2-4 dagen, afhankelijk van drukte en het aantal messen.",
  },
  {
    q: "Kan ik wachten terwijl je slijpt?",
    a: "Op afspraak voor enkele kleine klussen mogelijk, maar voor het beste resultaat neem ik graag de tijd.",
  },
  {
    q: "Welke messen slijp je niet?",
    a: "Keramische messen kan ik helaas niet behandelen. Kartelmessen alleen op aanvraag.",
  },
  {
    q: "Wat als mijn mes beschadigd is?",
    a: "Lichte beschadigingen kan ik meestal verhelpen. Bij grotere schade overleg ik altijd eerst.",
  },
  {
    q: "Hoe kan ik betalen?",
    a: "Contant of via Tikkie bij ophalen.",
  },
  {
    q: "Werk je ook voor restaurants?",
    a: "Ja, neem contact op voor een abonnement of doorlopende afspraak.",
  },
] as const

export function Faq() {
  const root = useRef<HTMLElement>(null)
  const [value, setValue] = useState("")
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      if (reducedMotion) return
      gsap.from(".faq-item", {
        x: (i) => (i % 2 === 0 ? -80 : 80),
        autoAlpha: 0,
        stagger: 0.08,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".faq-list", start: "top 85%", once: true },
      })
    },
    { scope: root, dependencies: [reducedMotion] }
  )

  return (
    <section ref={root} id="faq" aria-labelledby="faq-titel" className="relative">
      <div className="mx-auto grid max-w-6xl gap-14 px-5 py-28 md:grid-cols-12 md:py-40">
        <div className="md:col-span-5">
          <SectionHeading index="07" eyebrow="VEELGESTELDE VRAGEN" title="Goed om te weten" id="faq-titel" className="md:sticky md:top-32" />
        </div>

        <Accordion type="single" collapsible value={value} onValueChange={setValue} className="faq-list md:col-span-7">
          {items.map((it, i) => {
            const isOpen = value === it.q
            return (
              <AccordionItem key={it.q} value={it.q} className="faq-item relative border-b border-steel-700">
                {isOpen ? (
                  <motion.span
                    layoutId="faq-active"
                    aria-hidden="true"
                    className="absolute top-0 -left-4 h-full w-0.5 bg-edge shadow-[0_0_12px_var(--edge)] md:-left-6"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                ) : null}
                <AccordionPrimitive.Header className="flex">
                  <AccordionPrimitive.Trigger className="group flex flex-1 items-center gap-5 py-6 text-left">
                    <span aria-hidden="true" className="font-mono text-xs text-steel-500 transition-colors group-hover:text-edge group-data-[state=open]:text-edge">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 font-heading text-2xl font-bold tracking-tight text-chrome uppercase transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-2 md:text-3xl">
                      {it.q}
                    </span>
                    <motion.span
                      aria-hidden="true"
                      animate={{ rotate: isOpen ? 135 : 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 18 }}
                      className="grid size-10 shrink-0 place-items-center rounded-full border border-steel-600 text-xl leading-none text-chrome transition-colors group-hover:border-edge group-data-[state=open]:border-edge group-data-[state=open]:text-edge"
                    >
                      +
                    </motion.span>
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionContent className="pb-6 pl-10 text-base leading-relaxed text-steel-300">
                  <motion.p
                    initial={false}
                    animate={isOpen ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: -10, filter: "blur(4px)" }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {it.a}
                  </motion.p>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>
    </section>
  )
}
