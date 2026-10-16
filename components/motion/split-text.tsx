"use client"

import { useRef } from "react"

import { gsap, SplitText as GSAPSplitText, useGSAP } from "@/lib/gsap"
import { onPreloadDone, PRELOAD_ATTR } from "@/lib/preload"
import { useReducedMotion } from "@/lib/use-media-query"
import { cn } from "@/lib/utils"

type Tag = "h1" | "h2" | "h3" | "p" | "span" | "div"

type SplitTextProps = {
  as?: Tag
  children: string
  className?: string
  id?: string
  /** "load": direct na de preloader. "scroll": zodra het in beeld komt. */
  trigger?: "load" | "scroll"
  delay?: number
  stagger?: number
  /**
   * Alleen bij trigger "load": tekst staat direct zichtbaar in de HTML (goed voor
   * snelheid) en de letter-reveal speelt alleen achter de preloader af, zodat er
   * nooit tekst wegflitst.
   */
  visibleUntilPreload?: boolean
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
  id,
  trigger = "scroll",
  delay = 0,
  stagger = 0.02,
  visibleUntilPreload = false,
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(
    (_context, contextSafe) => {
      const el = ref.current
      if (!contextSafe) return
      if (!el) return
      if (reducedMotion) {
        gsap.set(el, { autoAlpha: 1 })
        return
      }

      let split: GSAPSplitText | undefined
      let cleanupPreload = () => {}

      const setup = contextSafe(() => {
        split = GSAPSplitText.create(el, { type: "words,chars", charsClass: "char", wordsClass: "word", aria: "auto" })
        gsap.set(el, { autoAlpha: 1 })
        if (visibleUntilPreload && !document.documentElement.hasAttribute(PRELOAD_ATTR)) return
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
        if (trigger === "load") cleanupPreload = onPreloadDone(() => tween.play())
      })

      // De hero-titel direct splitsen (de hero-animatie heeft de woorden nodig);
      // koppen verderop pas als de browser tijd heeft.
      let idleId: number | undefined
      if (trigger === "load") setup()
      else idleId = window.setTimeout(setup, 400)

      return () => {
        window.clearTimeout(idleId)
        cleanupPreload()
        split?.revert()
      }
    },
    { dependencies: [reducedMotion, trigger, delay, stagger, visibleUntilPreload] }
  )

  return (
    <Tag
      id={id}
      ref={(node: HTMLElement | null) => {
        ref.current = node
      }}
      className={cn(!visibleUntilPreload && "split-pending", "[perspective:600px]", className)}
    >
      {children}
    </Tag>
  )
}
