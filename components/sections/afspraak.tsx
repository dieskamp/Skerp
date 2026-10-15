"use client"

import Cal, { getCalApi } from "@calcom/embed-react"
import { useEffect, useRef } from "react"

import { Reveal } from "@/components/motion/reveal"
import { gsap, SplitText, useGSAP } from "@/lib/gsap"
import { useReducedMotion } from "@/lib/use-media-query"

export function Afspraak() {
  const root = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    ;(async () => {
      const cal = await getCalApi({ namespace: "slijpafspraak" })
      cal("ui", {
        theme: "dark",
        cssVarsPerTheme: {
          dark: { "cal-brand": "#8fd0ff" },
          light: { "cal-brand": "#8fd0ff" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      })
    })()
  }, [])

  useGSAP(
    () => {
      if (reducedMotion) return
      const title = root.current?.querySelector<HTMLElement>(".cta-title")
      if (!title) return
      gsap.set(title, { autoAlpha: 1 })
      const split = SplitText.create(title, { type: "words,chars", wordsClass: "word", charsClass: "char", aria: "auto" })

      // De letters slaan één voor één neer, alsof ze uit staal gestanst worden.
      gsap.from(split.chars, {
        yPercent: () => gsap.utils.random(-260, 260),
        rotation: () => gsap.utils.random(-70, 70),
        scale: 2.4,
        autoAlpha: 0,
        filter: "blur(12px)",
        stagger: { each: 0.03, from: "center" },
        ease: "power4.out",
        scrollTrigger: { trigger: root.current, start: "top 85%", end: "top 25%", scrub: 1 },
      })
      gsap.fromTo(
        ".cta-shine",
        { backgroundPosition: "200% 0" },
        {
          backgroundPosition: "-100% 0",
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 60%", end: "bottom top", scrub: true },
        }
      )
      gsap.from(".cta-frame", {
        y: 120,
        rotateX: 25,
        autoAlpha: 0,
        duration: 1.4,
        ease: "expo.out",
        scrollTrigger: { trigger: ".cta-frame", start: "top 90%", once: true },
      })
      return () => split.revert()
    },
    { scope: root, dependencies: [reducedMotion] }
  )

  return (
    <section ref={root} id="afspraak" aria-labelledby="afspraak-titel" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[60vh] bg-[radial-gradient(60%_80%_at_50%_0%,var(--edge-soft),transparent_70%)]"
      />
      <div className="relative mx-auto max-w-6xl px-5 py-28 md:py-40">
        <div className="flex items-center justify-center gap-4">
          <span aria-hidden="true" className="font-mono text-xs text-edge">
            06
          </span>
          <span aria-hidden="true" className="h-px w-12 bg-gradient-to-r from-edge to-steel-600" />
          <p className="eyebrow">MAAK EEN AFSPRAAK</p>
        </div>
        <h2
          id="afspraak-titel"
          className="cta-title split-pending relative mt-8 text-center font-heading text-[17vw] leading-[0.85] font-black tracking-tight text-chrome uppercase md:text-[11rem]"
        >
          Plan je slijpbeurt
        </h2>
        <div
          aria-hidden="true"
          className="cta-shine pointer-events-none mx-auto mt-6 h-px max-w-3xl bg-[linear-gradient(90deg,transparent,var(--chrome),var(--edge),transparent)] bg-[length:50%_100%] bg-no-repeat"
        />
        <Reveal>
          <p className="mx-auto mt-8 max-w-xl text-center text-base leading-relaxed text-steel-300 sm:text-lg">
            Kies een moment dat jou uitkomt. Je krijgt direct een bevestiging per mail.
          </p>
        </Reveal>

        <div className="mt-14 [perspective:1400px]">
          <div className="cta-frame cta-border relative mx-auto max-w-3xl rounded-sm p-px">
            <div className="relative rounded-sm bg-steel-900 p-4 sm:p-6" data-lenis-prevent>
              <Cal
                namespace="slijpafspraak"
                calLink="skerp/slijpafspraak"
                calOrigin="https://cal.eu"
                style={{ width: "100%", height: "100%", overflow: "scroll" }}
                config={{ layout: "month_view" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
