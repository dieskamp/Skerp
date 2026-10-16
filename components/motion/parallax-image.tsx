"use client"

import Image from "next/image"
import { useRef } from "react"

import { gsap } from "@/lib/gsap"
import { useIdleGSAP } from "@/lib/use-idle-gsap"
import { useReducedMotion } from "@/lib/use-media-query"
import { cn } from "@/lib/utils"

type ParallaxImageProps = {
  src: string
  alt: string
  sizes: string
  className?: string
}

/** Foto die met een clip-path onthuld wordt en daarna in parallax meebeweegt. */
export function ParallaxImage({ src, alt, sizes, className }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useIdleGSAP(
    () => {
      if (reducedMotion) return
      gsap.fromTo(
        ref.current,
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.4,
          ease: "expo.inOut",
          scrollTrigger: { trigger: ref.current, start: "top 80%", once: true },
        }
      )
      gsap.fromTo(
        ".pi-inner",
        { yPercent: -12, scale: 1.25 },
        {
          yPercent: 12,
          scale: 1.1,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
        }
      )
    },
    { scope: ref, dependencies: [reducedMotion] }
  )

  return (
    <div ref={ref} className={cn("relative overflow-hidden rounded-sm bg-steel-800", className)}>
      <div className="pi-inner absolute inset-0">
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      </div>
      <div className="pointer-events-none absolute inset-0 ring-1 ring-chrome/10 ring-inset" />
    </div>
  )
}
