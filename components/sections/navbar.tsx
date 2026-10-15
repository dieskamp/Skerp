"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Menu, X } from "lucide-react"
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react"

import { useReducedMotion } from "@/lib/use-media-query"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "#diensten", label: "Diensten" },
  { href: "#werkwijze", label: "Werkwijze" },
  { href: "#werk", label: "Werk" },
  { href: "#afspraak", label: "Afspraak" },
  { href: "#contact", label: "Contact" },
] as const

function NavLinks({
  className,
  onNavigate,
}: {
  className?: string
  onNavigate?: () => void
}) {
  return (
    <ul className={cn("flex items-center gap-8", className)}>
      {navItems.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className="group relative inline-block py-1 font-mono text-xs tracking-[0.18em] text-steel-300 uppercase transition-colors hover:text-chrome"
            onClick={onNavigate}
          >
            {item.label}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-edge transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
            />
          </Link>
        </li>
      ))}
    </ul>
  )
}

/**
 * Navbar die wegschuift bij naar beneden scrollen en terugkomt bij omhoog.
 * Blijft altijd zichtbaar als het menu open is of er focus in staat.
 */
export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [focusWithin, setFocusWithin] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0
    setScrolled(current > 8)
    if (current < 120) setHidden(false)
    else if (Math.abs(current - previous) > 4) setHidden(current > previous)
  })

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open])

  const isHidden = hidden && !open && !focusWithin

  return (
    <motion.header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-50"
      initial={false}
      animate={{ y: isHidden ? "-100%" : "0%" }}
      transition={reducedMotion ? { duration: 0 } : { duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      onFocus={() => setFocusWithin(true)}
      onBlur={(e) => {
        if (!headerRef.current?.contains(e.relatedTarget as Node | null)) setFocusWithin(false)
      }}
    >
      <div
        className={cn(
          "border-b transition-[background-color,border-color] duration-500",
          scrolled || open
            ? "border-steel-700/70 bg-steel-950/70 backdrop-blur-xl"
            : "border-transparent bg-transparent"
        )}
      >
        <nav
          aria-label="Hoofdmenu"
          className="mx-auto flex h-[var(--nav-height)] max-w-6xl items-center justify-between px-5"
        >
          <Link href="#top" className="flex flex-col items-start leading-none" aria-label="Skerp Slijpservice, naar boven">
            <span className="font-heading text-2xl font-black tracking-tight text-chrome uppercase md:text-3xl">
              SKERP
            </span>
            <span className="mt-0.5 font-mono text-[9px] tracking-[0.32em] text-steel-300 uppercase">
              SLIJPSERVICE
            </span>
          </Link>

          <div className="hidden md:flex">
            <NavLinks />
          </div>

          <button
            type="button"
            aria-label={open ? "Menu sluiten" : "Menu openen"}
            aria-expanded={open}
            aria-controls="mobiel-menu"
            onClick={() => setOpen((v) => !v)}
            className="grid size-11 place-items-center rounded-sm border border-steel-700 bg-steel-950/40 text-chrome transition-colors hover:border-steel-400 md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </nav>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id="mobiel-menu"
            key="mobiel-menu"
            className="overflow-hidden border-b border-steel-700 bg-steel-950/95 backdrop-blur-xl md:hidden"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="px-5 py-6">
              <NavLinks className="flex-col items-start gap-5" onNavigate={() => setOpen(false)} />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  )
}
