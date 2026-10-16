"use client"

import { useFrame } from "@react-three/fiber"
import { RoundedBox } from "@react-three/drei"
import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"

export type ProgressRef = { current: number }

const SPINE = 0.32
const EDGE = -0.55

/** Abstract lemmet: geëxtrudeerd profiel dat naar de snede toe dunner wordt. */
function createBladeGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape()
  shape.moveTo(-1.8, SPINE)
  shape.lineTo(1.2, SPINE)
  shape.quadraticCurveTo(1.95, 0.28, 2.3, -0.02)
  shape.quadraticCurveTo(1.3, -0.56, -1.5, EDGE)
  shape.lineTo(-1.8, EDGE)
  shape.lineTo(-1.8, SPINE)

  const depth = 0.07
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.012,
    bevelSegments: 3,
    curveSegments: 96,
  })
  geometry.translate(0, 0, -depth / 2)

  // Slijpvlak: hoe dichter bij de snede, hoe dunner het staal.
  const position = geometry.attributes.position
  for (let i = 0; i < position.count; i++) {
    const t = THREE.MathUtils.clamp((position.getY(i) - EDGE) / (SPINE - EDGE), 0, 1)
    position.setZ(i, position.getZ(i) * (0.05 + 0.95 * Math.pow(t, 0.75)))
  }
  geometry.computeVertexNormals()
  return geometry
}

const streakVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const streakFragment = /* glsl */ `
  uniform float uHead;
  uniform float uBoost;
  uniform vec3 uColor;
  varying vec2 vUv;
  void main() {
    float d = vUv.x - uHead;
    float a = exp(-d * d * 260.0) * (1.0 + uBoost * 2.0) + 0.05;
    gl_FragColor = vec4(uColor * (1.0 + a * 2.5), clamp(a, 0.0, 1.0));
  }
`

const smoothstep = THREE.MathUtils.smoothstep
const lerp = THREE.MathUtils.lerp
const damp = THREE.MathUtils.damp

export function Blade({ progress }: { progress: ProgressRef }) {
  const group = useRef<THREE.Group>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const streak = useRef<THREE.ShaderMaterial>(null)

  const bladeGeometry = useMemo(() => createBladeGeometry(), [])
  const edgeGeometry = useMemo(() => {
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(2.3, -0.02, 0),
      new THREE.Vector3(1.3, -0.56, 0),
      new THREE.Vector3(-1.5, EDGE, 0)
    )
    return new THREE.TubeGeometry(curve, 160, 0.007, 6, false)
  }, [])
  const uniforms = useMemo(
    () => ({
      uHead: { value: -0.3 },
      uBoost: { value: 0 },
      uColor: { value: new THREE.Color("#8fd0ff") },
    }),
    []
  )

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => {
      window.removeEventListener("pointermove", onMove)
      bladeGeometry.dispose()
      edgeGeometry.dispose()
    }
  }, [bladeGeometry, edgeGeometry])

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const t = state.clock.elapsedTime
    const p = progress.current
    const { x: px, y: py } = pointer.current

    // Fases op basis van scroll
    const spin = smoothstep(p, 0, 0.45) // een volle draai
    const slash = smoothstep(p, 0.45, 0.66) // het lemmet snijdt door beeld
    const calm = 1 - smoothstep(p, 0.3, 0.5) // muis en idle-beweging vallen weg

    const targetRotY = Math.sin(t * 0.35) * 0.55 * calm + px * 0.45 * calm + spin * Math.PI * 2
    const targetRotX = (0.2 + py * 0.3) * calm + Math.sin(t * 0.5) * 0.05 * calm
    const targetRotZ = lerp(0.18 + Math.sin(t * 0.25) * 0.06, 0.22, 1 - calm)
    const targetX = lerp(lerp(1.9, 0.6, spin), -9, slash)
    const targetY = lerp(Math.sin(t * 0.8) * 0.06, 0.15, 1 - calm)
    const targetScale = lerp(0.82, 1.15, spin) * lerp(1, 1.2, slash)

    g.rotation.y = damp(g.rotation.y, targetRotY, 5, delta)
    g.rotation.x = damp(g.rotation.x, targetRotX, 5, delta)
    g.rotation.z = damp(g.rotation.z, targetRotZ, 5, delta)
    g.position.x = damp(g.position.x, targetX, 6, delta)
    g.position.y = damp(g.position.y, targetY, 6, delta)
    g.scale.setScalar(damp(g.scale.x, targetScale, 6, delta))

    // Lichtstreep: loopt elke paar seconden over de snede, en vol tijdens de snijbeweging.
    const material = streak.current
    if (!material) return
    const idleHead = ((t * 0.5) % 1.8) - 0.4
    const u = material.uniforms
    u.uHead.value = slash > 0 ? lerp(idleHead, 1 - slash * 1.4, Math.min(1, slash * 4)) : idleHead
    u.uBoost.value = damp(u.uBoost.value, slash > 0 && slash < 1 ? 1 : 0, 8, delta)
  })

  return (
    <group ref={group} position={[1.9, 0, 0]} rotation={[0.2, 0, 0.18]} scale={0.82}>
      <group position={[0.4, 0, 0]}>
        <mesh geometry={bladeGeometry} castShadow>
          <meshPhysicalMaterial
            color="#d9dee5"
            metalness={1}
            roughness={0.14}
            clearcoat={1}
            clearcoatRoughness={0.08}
            envMapIntensity={1.4}
          />
        </mesh>
        <mesh geometry={edgeGeometry}>
          <shaderMaterial
            ref={streak}
            uniforms={uniforms}
            vertexShader={streakVertex}
            fragmentShader={streakFragment}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
        {/* Bolster */}
        <mesh position={[-1.84, -0.11, 0]}>
          <boxGeometry args={[0.08, 0.56, 0.16]} />
          <meshPhysicalMaterial color="#c7ccd3" metalness={1} roughness={0.22} />
        </mesh>
        {/* Heft */}
        <RoundedBox args={[1.35, 0.36, 0.2]} radius={0.08} smoothness={4} position={[-2.55, -0.13, 0]}>
          <meshPhysicalMaterial color="#121418" metalness={0.4} roughness={0.55} clearcoat={0.6} />
        </RoundedBox>
      </group>
    </group>
  )
}
