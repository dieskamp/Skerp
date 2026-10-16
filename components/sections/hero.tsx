"use client"

import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { useRef } from "react"

import { Magnetic } from "@/components/motion/magnetic-button"
import { SplitText } from "@/components/motion/split-text"
import type { ProgressRef } from "@/components/three/blade"
import { gsap, useGSAP } from "@/lib/gsap"
import { onPreloadDone, PRELOAD_ATTR } from "@/lib/preload"
import { useMediaQuery, useReducedMotion } from "@/lib/use-media-query"

const HeroCanvas = dynamic(() => import("@/components/three/hero-canvas"), {
  ssr: false,
  loading: () => null,
})

/**
 * Hero met een gepinde scroll-reeks:
 * 1. het lemmet draait een volle slag en zoomt in, de slogan valt woord voor woord uiteen;
 * 2. het lemmet zwiept door beeld en laat een gloeiende snede achter;
 * 3. het hele beeld wordt langs die snede dichtgeknepen tot één lijn.
 * Op mobiel: dezelfde reeks met de foto in plaats van 3D. Bij reduced motion: statisch.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null)
  const progress = useRef<number>(0) as ProgressRef
  const reducedMotion = useReducedMotion()
  const desktop = useMediaQuery("(min-width: 768px) and (hover: hover) and (pointer: fine)")
  const show3D = desktop && !reducedMotion

  useGSAP(
    () => {
      if (reducedMotion) return

      // Intro: eyebrow, tekst en knoppen schuiven in na de slogan. Alleen achter
      // de preloader; anders staat alles er meteen (geen flits, snelle LCP).
      let stopWaiting = () => {}
      if (document.documentElement.hasAttribute(PRELOAD_ATTR)) {
        const intro = gsap.from(".hero-fade", {
          y: 40,
          opacity: 0,
          stagger: 0.08,
          duration: 1,
          delay: 0.6,
          ease: "expo.out",
          paused: true,
        })
        stopWaiting = onPreloadDone(() => intro.play())
      }

      const words = gsap.utils.toArray<HTMLElement>(".hero-title .word")

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
            onUpdate: (self) => {
              progress.current = self.progress
            },
          },
        })
        .to(".hero-bgword", { xPercent: -45, duration: 1 }, 0)
        .to(".hero-sub", { y: -80, opacity: 0, duration: 0.18, ease: "power2.in" }, 0.04)
        .to(
          words,
          {
            x: () => gsap.utils.random(-500, 500),
            y: () => gsap.utils.random(-400, 250),
            rotation: () => gsap.utils.random(-120, 120),
            scale: () => gsap.utils.random(0.4, 2.2),
            autoAlpha: 0,
            filter: "blur(6px)",
            duration: 0.3,
            stagger: { each: 0.015, from: "random" },
            ease: "power2.in",
          },
          0.08
        )
        .to(".hero-media", { scale: 1.3, autoAlpha: 0.45, duration: 0.6 }, 0)
        .to(".hero-scrollhint", { autoAlpha: 0, duration: 0.05 }, 0)
        .fromTo(".hero-cut path", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.12, ease: "power3.out" }, 0.55)
        .to(".hero-flash", { autoAlpha: 0.35, duration: 0.03 }, 0.6)
        .to(".hero-flash", { autoAlpha: 0, duration: 0.1 }, 0.63)
        .to(".hero-stage", { "--cut": 1, duration: 0.3, ease: "power2.inOut" }, 0.66)
        .to(".hero-cut", { autoAlpha: 0, duration: 0.04 }, 0.96)

      return () => stopWaiting()
    },
    { scope: root, dependencies: [reducedMotion] }
  )

  return (
    <section
      ref={root}
      id="top"
      aria-labelledby="hero-titel"
      className="relative h-svh motion-safe:h-[230svh] md:motion-safe:h-[300svh]"
    >
      <div className="hero-stage relative h-svh overflow-hidden motion-safe:sticky motion-safe:top-0">
        {/* Achtergrond: foto (altijd op mobiel en bij reduced motion, gedimd achter 3D op desktop) */}
        <div className="hero-media absolute inset-0">
          <Image
            src="/hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className={show3D ? "object-cover opacity-20" : "object-cover opacity-70"}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-steel-950/70 via-steel-950/60 to-steel-950" />
          <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_70%_45%,var(--edge-soft),transparent_70%)]" />
        </div>

        {/* Gigantisch outline-woord dat meeschuift */}
        <div
          aria-hidden="true"
          className="hero-bgword pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 font-heading text-[42vw] leading-none font-black tracking-tighter whitespace-nowrap text-transparent select-none [-webkit-text-stroke:1px_rgba(233,237,242,0.09)]"
        >
          SKERP SKERP
        </div>

        {show3D ? <HeroCanvas progress={progress} /> : null}

        {/* Inhoud */}
        <div className="relative mx-auto flex h-full max-w-6xl items-center px-5 pt-[var(--nav-height)]">
          <div className="max-w-2xl">
            <div className="hero-sub">
              <p className="hero-fade eyebrow">MESSENSLIJPERIJ, LEEUWARDEN</p>
            </div>
            <SplitText
              as="h1"
              trigger="load"
              visibleUntilPreload
              stagger={0.025}
              className="hero-title mt-6 font-heading text-[3.4rem] leading-[0.88] font-black tracking-tight text-chrome uppercase sm:text-7xl md:text-8xl"
            >
              Slijpwerk uit Leeuwarden, scherpte voor het leven.
            </SplitText>
            <div className="hero-sub">
              <p className="hero-fade mt-8 max-w-md text-base leading-relaxed text-steel-300 sm:text-lg">
                Van japans koksmes tot zakmes, Skerp brengt elk lemmet terug naar fabrieksstaat. Door een vakman,
                in Leeuwarden.
              </p>
              <div className="hero-fade mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Magnetic>
                  <Link
                    href="#afspraak"
                    className="group relative inline-flex h-12 w-full items-center justify-center overflow-hidden rounded-sm bg-chrome px-7 text-sm font-semibold tracking-wide text-steel-950 sm:w-auto"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white to-transparent transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-full"
                    />
                    <span className="relative">Maak afspraak</span>
                  </Link>
                </Magnetic>
                <Magnetic strength={0.25}>
                  <Link
                    href="#diensten"
                    className="inline-flex h-12 w-full items-center justify-center rounded-sm border border-steel-600 px-7 text-sm font-medium text-chrome transition-colors hover:border-edge hover:text-edge sm:w-auto"
                  >
                    Bekijk diensten
                  </Link>
                </Magnetic>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll-hint */}
        <div
          aria-hidden="true"
          className="hero-scrollhint absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 motion-safe:flex"
        >
          <span className="font-mono text-[10px] tracking-[0.3em] text-steel-400 uppercase">Scroll</span>
          <span className="relative h-12 w-px overflow-hidden bg-steel-700">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollhint_1.6s_ease-in-out_infinite] bg-edge" />
          </span>
        </div>

        {/* De snede */}
        <svg
          aria-hidden="true"
          className="hero-cut pointer-events-none absolute inset-0 size-full drop-shadow-[0_0_12px_var(--edge)]"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d="M 0 70 L 100 30"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset="1"
            stroke="#ffffff"
            strokeWidth="0.3"
            fill="none"
          />
        </svg>
        <div aria-hidden="true" className="hero-flash pointer-events-none invisible absolute inset-0 bg-edge opacity-0 mix-blend-screen" />
      </div>
    </section>
  )
}
