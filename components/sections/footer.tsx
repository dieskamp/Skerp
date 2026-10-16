"use client"

import Link from "next/link"
import { useRef } from "react"

import { gsap, SplitText } from "@/lib/gsap"
import { useIdleGSAP } from "@/lib/use-idle-gsap"
import { useReducedMotion } from "@/lib/use-media-query"

const links = [
  { href: "#diensten", label: "Diensten" },
  { href: "#werkwijze", label: "Werkwijze" },
  { href: "#werk", label: "Werk" },
  { href: "#afspraak", label: "Afspraak" },
  { href: "#faq", label: "FAQ" },
] as const

const linkClass =
  "relative text-steel-300 transition-colors hover:text-chrome after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-edge after:transition-transform after:duration-300 hover:after:scale-x-100 focus-visible:after:scale-x-100"

export function Footer() {
  const root = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  useIdleGSAP(
    () => {
      if (reducedMotion) return
      const word = root.current?.querySelector<HTMLElement>(".footer-word")
      if (!word) return
      gsap.set(word, { autoAlpha: 1 })
      // Na het splitsen krijgt elke letter zijn eigen chroom; de ouder niet meer.
      word.classList.remove("text-chrome-gradient")
      const split = SplitText.create(word, { type: "chars", charsClass: "footer-char", mask: "chars", aria: "hidden" })

      // De letters rijzen uit de onderrand op terwijl de footer in beeld komt,
      // en het chroom glijdt er langzaam overheen.
      gsap.from(split.chars, {
        yPercent: 110,
        stagger: 0.06,
        ease: "none",
        scrollTrigger: { trigger: word, start: "top bottom", end: "bottom bottom", scrub: 1 },
      })
      gsap.fromTo(
        split.chars,
        { backgroundPosition: "100% 0" },
        {
          backgroundPosition: "0% 0",
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: true },
        }
      )
      return () => {
        split.revert()
        word.classList.add("text-chrome-gradient")
      }
    },
    { scope: root, dependencies: [reducedMotion] }
  )

  return (
    <footer ref={root} id="contact" className="relative overflow-hidden border-t border-steel-800 bg-steel-950">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 pt-20 pb-10 md:grid-cols-3">
        <div>
          <p className="flex flex-col leading-none">
            <span className="font-heading text-3xl font-black tracking-tight text-chrome uppercase">SKERP</span>
            <span className="mt-1 font-mono text-[9px] tracking-[0.32em] text-steel-300 uppercase">SLIJPSERVICE</span>
          </p>
          <p className="mt-5 text-sm text-steel-300">Vakkundig slijpwerk in Leeuwarden</p>
        </div>

        <div>
          <p className="eyebrow">CONTACT</p>
          <div className="mt-5 space-y-2 text-sm">
            <p className="text-chrome">
              <span className="text-steel-400">Mail:</span>{" "}
              <a className={linkClass} href="mailto:info@skerp.nl">
                info@skerp.nl
              </a>
            </p>
            <p className="text-chrome">
              <span className="text-steel-400">Telefoon:</span>{" "}
              <a className={linkClass} href="tel:+31600000000">
                +31 6 0000 0000
              </a>
            </p>
            <p className="text-steel-400">Leeuwarden e.o.</p>
          </div>
        </div>

        <div>
          <p className="eyebrow">SNEL NAAR</p>
          <ul className="mt-5 space-y-2 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <a href="https://facebook.com" className={linkClass} target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Grote wordmark */}
      <div aria-hidden="true" className="relative px-2 select-none">
        <div className="footer-word split-pending text-chrome-gradient text-center font-heading text-[37vw] leading-[0.78] font-black tracking-tight uppercase [&_.footer-char]:bg-[image:var(--chrome-gradient)] [&_.footer-char]:bg-[length:300%_100%] [&_.footer-char]:bg-clip-text [&_.footer-char]:text-transparent">
          SKERP
        </div>
      </div>

      <div className="border-t border-steel-800">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-6 text-xs text-steel-400 md:flex-row md:items-center md:justify-between">
          <div>© 2026 Skerp Slijpservice</div>
          <div>KvK TODO · BTW TODO</div>
          <div className="flex gap-4">
            <Link href="/privacy" className={linkClass}>
              Privacy
            </Link>
            <Link href="/voorwaarden" className={linkClass}>
              Voorwaarden
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
