"use client"

import { useRef } from "react"

import { SplitText } from "@/components/motion/split-text"
import { gsap } from "@/lib/gsap"
import { useIdleGSAP } from "@/lib/use-idle-gsap"
import { useReducedMotion } from "@/lib/use-media-query"
import { cn } from "@/lib/utils"

type SectionHeadingProps = {
  index: string
  eyebrow: string
  title: string
  id?: string
  className?: string
}

/** Vaste kop voor elke sectie: nummer, lijn die getrokken wordt, label en een letter-reveal. */
export function SectionHeading({ index, eyebrow, title, id, className }: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useIdleGSAP(
    () => {
      if (reducedMotion) return
      gsap.from(".sh-line", {
        scaleX: 0,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
      })
      gsap.from(".sh-meta", {
        x: -20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
      })
    },
    { scope: ref, dependencies: [reducedMotion] }
  )

  return (
    <div ref={ref} className={className}>
      <div className="flex items-center gap-4">
        <span aria-hidden="true" className="sh-meta font-mono text-xs text-edge">
          {index}
        </span>
        <span aria-hidden="true" className="sh-line h-px w-12 origin-left bg-gradient-to-r from-edge to-steel-600" />
        <p className="sh-meta eyebrow">{eyebrow}</p>
      </div>
      <SplitText
        as="h2"
        id={id}
        className={cn(
          "mt-6 font-heading text-5xl leading-[0.9] font-black tracking-tight text-chrome uppercase sm:text-6xl md:text-7xl"
        )}
      >
        {title}
      </SplitText>
    </div>
  )
}
