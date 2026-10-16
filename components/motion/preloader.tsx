"use client"

import { useRef } from "react"

import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap"
import { PRELOAD_ATTR, PRELOAD_DONE_EVENT, VISITED_KEY } from "@/lib/preload"

/**
 * Korte intro (max 1,2 s): de wordmark wordt "geslepen". Een lichtlijn trekt
 * over het dofgrijze woord en laat chroom achter, daarna schuift het scherm weg.
 * Verschijnt alleen bij het eerste bezoek per sessie en nooit bij reduced motion
 * (dat regelt het inline script in de layout).
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const html = document.documentElement
      if (!html.hasAttribute(PRELOAD_ATTR)) return

      const finish = () => {
        try {
          sessionStorage.setItem(VISITED_KEY, "1")
        } catch {
          // sessionStorage kan geblokkeerd zijn; dan zie je de intro gewoon opnieuw.
        }
        html.removeAttribute(PRELOAD_ATTR)
        window.dispatchEvent(new Event(PRELOAD_DONE_EVENT))
        ScrollTrigger.refresh()
      }

      // Trage verbinding: als de pagina pas laat interactief is, sla de intro
      // over in plaats van de bezoeker nog langer te laten wachten.
      if (performance.now() > 1500) {
        finish()
        return
      }

      gsap
        .timeline({ defaults: { ease: "power3.inOut" }, onComplete: finish })
        .fromTo(".pl-shine", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.55 }, 0)
        // Transform in plaats van "left": geen layout-shift
        .fromTo(
          ".pl-edge",
          { x: 0, autoAlpha: 1 },
          { x: () => root.current?.querySelector<HTMLElement>(".pl-word")?.offsetWidth ?? 0, duration: 0.55 },
          0
        )
        .to(".pl-edge", { autoAlpha: 0, duration: 0.1 }, 0.55)
        .fromTo(".pl-shine", { backgroundPosition: "100% 0" }, { backgroundPosition: "0% 0", duration: 0.5, ease: "power2.out" }, 0.4)
        .to(root.current, { clipPath: "inset(0 0 100% 0)", duration: 0.35, ease: "power4.in" }, 0.85)
    },
    { scope: root }
  )

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="preloader fixed inset-0 z-[200] items-center justify-center bg-steel-950"
      style={{ clipPath: "inset(0 0 0% 0)" }}
    >
      <div className="pl-word relative font-heading text-7xl font-black tracking-[0.12em] uppercase sm:text-9xl">
        <span className="text-steel-600">SKERP</span>
        <span className="pl-shine text-chrome-gradient absolute inset-0" style={{ clipPath: "inset(0 100% 0 0)" }}>
          SKERP
        </span>
        <span className="pl-edge absolute -inset-y-4 left-0 w-px bg-edge shadow-[0_0_24px_4px_var(--edge)]" />
      </div>
    </div>
  )
}
