"use client"

import { motion, useMotionValue, useSpring } from "motion/react"
import { useEffect, useRef } from "react"

import { useFinePointer, useReducedMotion } from "@/lib/use-media-query"
import { cn } from "@/lib/utils"

type Spark = { x: number; y: number; vx: number; vy: number; life: number; max: number }

const SPARK_PAD = 48

/**
 * Kaart met 3D-tilt, een spotlight die de cursor volgt en vonken aan de rand,
 * alsof hij langs een slijpsteen gaat. Alleen met muis en zonder reduced motion.
 */
export function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const card = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const sparks = useRef<Spark[]>([])
  const frame = useRef<number | null>(null)
  const finePointer = useFinePointer()
  const reducedMotion = useReducedMotion()
  const active = finePointer && !reducedMotion

  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const rotateX = useSpring(rx, { stiffness: 200, damping: 20 })
  const rotateY = useSpring(ry, { stiffness: 200, damping: 20 })

  useEffect(() => {
    const id = frame
    return () => {
      if (id.current !== null) cancelAnimationFrame(id.current)
    }
  }, [])

  const draw = () => {
    const c = canvas.current
    const ctx = c?.getContext("2d")
    if (!c || !ctx) return
    const dpr = Math.min(window.devicePixelRatio, 2)
    const w = c.clientWidth
    const h = c.clientHeight
    if (c.width !== w * dpr) {
      c.width = w * dpr
      c.height = h * dpr
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)
    ctx.globalCompositeOperation = "lighter"
    ctx.lineCap = "round"

    const dt = 1 / 60
    sparks.current = sparks.current.filter((s) => (s.life -= dt) > 0)
    for (const s of sparks.current) {
      s.vy += 900 * dt
      s.x += s.vx * dt
      s.y += s.vy * dt
      const t = s.life / s.max
      ctx.strokeStyle = t > 0.6 ? `rgba(255,243,220,${t})` : `rgba(255,155,61,${t})`
      ctx.lineWidth = 1.4 * t + 0.4
      ctx.beginPath()
      ctx.moveTo(s.x, s.y)
      ctx.lineTo(s.x - s.vx * 0.025, s.y - s.vy * 0.025)
      ctx.stroke()
    }

    frame.current = sparks.current.length > 0 ? requestAnimationFrame(draw) : null
  }

  const emit = (x: number, y: number, w: number, h: number) => {
    // Dichtstbijzijnde rand van de kaart t.o.v. de cursor
    const d = [x, w - x, y, h - y]
    const edge = d.indexOf(Math.min(...d))
    const px = edge === 0 ? 0 : edge === 1 ? w : x
    const py = edge === 2 ? 0 : edge === 3 ? h : y
    const nx = edge === 0 ? -1 : edge === 1 ? 1 : 0
    const ny = edge === 2 ? -1 : edge === 3 ? 1 : 0
    for (let i = 0; i < 3; i++) {
      const speed = 160 + Math.random() * 320
      const spread = (Math.random() - 0.5) * 1.6
      const max = 0.35 + Math.random() * 0.4
      sparks.current.push({
        x: px + SPARK_PAD,
        y: py + SPARK_PAD,
        vx: (nx + (ny !== 0 ? spread : spread * 0.4)) * speed,
        vy: (ny + (nx !== 0 ? spread : spread * 0.4)) * speed - 120,
        life: max,
        max,
      })
    }
    if (sparks.current.length > 160) sparks.current.splice(0, sparks.current.length - 160)
    if (frame.current === null) frame.current = requestAnimationFrame(draw)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = card.current
    if (!active || !el || e.pointerType !== "mouse") return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    ry.set((x / rect.width - 0.5) * 16)
    rx.set(-(y / rect.height - 0.5) * 16)
    el.style.setProperty("--mx", `${x}px`)
    el.style.setProperty("--my", `${y}px`)
    emit(x, y, rect.width, rect.height)
  }

  const onPointerLeave = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.div
      ref={card}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={active ? { rotateX, rotateY, transformPerspective: 900 } : undefined}
      className={cn(
        "group/tilt relative rounded-sm border border-steel-700 bg-steel-900/80 backdrop-blur-sm transition-colors duration-300 [--mx:50%] [--my:50%] hover:border-steel-400",
        className
      )}
    >
      {/* Spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-sm opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx) var(--my), rgba(143,208,255,0.16), transparent 45%)",
        }}
      />
      {/* Vonken */}
      {active ? (
        <canvas
          ref={canvas}
          aria-hidden="true"
          className="pointer-events-none absolute z-10"
          style={{ inset: -SPARK_PAD, width: `calc(100% + ${SPARK_PAD * 2}px)`, height: `calc(100% + ${SPARK_PAD * 2}px)` }}
        />
      ) : null}
      <div className="relative [transform:translateZ(30px)]">{children}</div>
    </motion.div>
  )
}
