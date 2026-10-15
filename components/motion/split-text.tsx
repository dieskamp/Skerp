"use client"

import { useRef } from "react"

import { gsap, SplitText as GSAPSplitText, useGSAP } from "@/lib/gsap"
import { onPreloadDone } from "@/lib/preload"
import { useReducedMotion } from "@/lib/use-media-query"
import { cn } from "@/lib/utils"

type Tag = "h1" | "h2" | "h3" | "p" | "span" | "div"

type SplitTextProps = {
  as?: Tag
  children: string
  className?: string
  /** "load": direct na de preloader. "scroll": zodra het in beeld komt. */
  trigger?: "load" | "scroll"
  delay?: number
  stagger?: number
}

/**
 * Tekst die letter voor letter binnenkomt (GSAP SplitText).
 * Screenreaders lezen gewoon de hele zin (aria: "auto").
 * Bij reduced motion staat de tekst er meteen.
 */
export function SplitText({
  as: Tag = "div",
  children,
  className,
  trigger = "scroll",
  delay = 0,
  stagger = 0.02,
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      if (reducedMotion) {
        gsap.set(el, { autoAlpha: 1 })
        return
      }

      const split = GSAPSplitText.create(el, { type: "words,chars", charsClass: "char", wordsClass: "word", aria: "auto" })
      gsap.set(el, { autoAlpha: 1 })
      const tween = gsap.from(split.chars, {
        yPercent: 120,
        rotateX: -90,
        autoAlpha: 0,
        transformOrigin: "50% 100%",
        stagger,
        delay,
        duration: 0.9,
        ease: "expo.out",
        paused: true,
        scrollTrigger: trigger === "scroll" ? { trigger: el, start: "top 85%" } : undefined,
      })

      let cleanupPreload = () => {}
      if (trigger === "load") cleanupPreload = onPreloadDone(() => tween.play())

      return () => {
        cleanupPreload()
        split.revert()
      }
    },
    { dependencies: [reducedMotion, trigger, delay, stagger] }
  )

  return (
    <Tag
      ref={(node: HTMLElement | null) => {
        ref.current = node
      }}
      className={cn("split-pending [perspective:600px]", className)}
    >
      {children}
    </Tag>
  )
}
