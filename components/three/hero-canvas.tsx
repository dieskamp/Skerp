"use client"

import { Canvas } from "@react-three/fiber"
import { Environment, Lightformer } from "@react-three/drei"
import { useEffect, useRef, useState } from "react"

import { Blade, type ProgressRef } from "@/components/three/blade"

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas")
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"))
  } catch {
    return false
  }
}

/**
 * De 3D-scène van de hero. Wordt via next/dynamic (ssr: false) geladen,
 * rendert alleen als hij in beeld is en houdt devicePixelRatio op max 2.
 */
export default function HeroCanvas({ progress }: { progress: ProgressRef }) {
  const wrapper = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(true)
  const [supported] = useState(supportsWebGL)

  useEffect(() => {
    const el = wrapper.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "100px",
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={wrapper} aria-hidden="true" className="absolute inset-0">
      {supported ? (
        <Canvas
          frameloop={inView ? "always" : "never"}
          dpr={[1, 2]}
          camera={{ position: [0, 0, 7], fov: 35 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <ambientLight intensity={0.15} />
          <directionalLight position={[3, 4, 5]} intensity={1.2} />
          <Blade progress={progress} />
          {/* Studio-licht als reflectie: lichtstroken die over het staal glijden. Geen HDR-download. */}
          <Environment resolution={256} frames={1}>
            <color attach="background" args={["#3a414b"]} />
            <Lightformer form="rect" intensity={6} position={[0, 4, 1]} rotation-x={Math.PI / 2} scale={[12, 1.2, 1]} />
            <Lightformer form="rect" intensity={3} position={[0, -3, 2]} rotation-x={-Math.PI / 2} scale={[12, 0.6, 1]} />
            <Lightformer form="rect" intensity={8} color="#8fd0ff" position={[-5, 0.5, 1]} rotation-y={Math.PI / 2} scale={[6, 0.5, 1]} />
            <Lightformer form="rect" intensity={6} position={[5, 1, 0]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} />
            <Lightformer form="ring" intensity={1.5} position={[0, 0, -6]} scale={4} />
          </Environment>
        </Canvas>
      ) : null}
    </div>
  )
}
