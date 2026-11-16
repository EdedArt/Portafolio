import { ContactShadows, Html, MeshReflectorMaterial, RoundedBox } from '@react-three/drei'
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react'
import * as THREE from 'three'
import { makeScreenTexture } from './screens'

export type DeviceKind = 'laptop' | 'phone' | 'watch' | 'cartridge'
export interface LabDevice {
  kind: DeviceKind
  name: string
  projectId: string
}

export interface LabSceneProps {
  devices: LabDevice[]
  powered: boolean[]
  selected: number
  autoRotate: boolean
  light: boolean
  viewLabel: string
  onSelect: (i: number) => void
  onPower: (i: number) => void
  onInteract: () => void
  onView: (projectId: string) => void
}

interface DragState {
  dragging: boolean
  vel: number
  dx: number
  moved: number
}

const RADIUS = 2.7
const TAU = Math.PI * 2

/* ───────────── Pantalla que se enciende ───────────── */
// Capturas reales como textura de pantalla (el reloj usa su pantalla generada)
const SCREEN_IMAGES: Partial<Record<DeviceKind, { light: string; dark: string; aspect: number }>> = {
  laptop: { light: '/proyectos/podcastcraft-light.webp', dark: '/proyectos/podcastcraft-dark.webp', aspect: 1.46 / 0.9 },
  phone: { light: '/proyectos/autoclean-lavado-light.webp', dark: '/proyectos/autoclean-lavado-dark.webp', aspect: 0.58 / 1.2 },
  cartridge: { light: '/proyectos/plomo-portada.webp', dark: '/proyectos/plomo-portada.webp', aspect: 0.8 / 0.62 },
}
const loader = new THREE.TextureLoader()

/** Recorta la textura como `object-fit: cover` para la proporción de la pantalla */
function cover(tex: THREE.Texture, planeAspect: number) {
  const img = tex.image as { width: number; height: number }
  const imgAspect = img.width / img.height
  if (imgAspect > planeAspect) {
    tex.repeat.set(planeAspect / imgAspect, 1)
    tex.offset.set((1 - tex.repeat.x) / 2, 0)
  } else {
    tex.repeat.set(1, imgAspect / planeAspect)
    tex.offset.set(0, 1 - tex.repeat.y)
  }
}

function useScreenTexture(kind: DeviceKind, name: string, light: boolean) {
  // Mientras carga la captura se usa la pantalla dibujada en canvas
  const fallback = useMemo(() => makeScreenTexture(kind, name), [kind, name])
  const [tex, setTex] = useState<THREE.Texture>(fallback)
  const src = SCREEN_IMAGES[kind]
  const url = src ? (light ? src.light : src.dark) : null

  useEffect(() => {
    if (!url || !src) return
    let alive = true
    let loaded: THREE.Texture | null = null
    loader.load(url, (t) => {
      loaded = t
      if (!alive) return t.dispose()
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = 4
      cover(t, src.aspect)
      setTex(t)
    })
    return () => {
      alive = false
      loaded?.dispose()
    }
  }, [url, src])

  useEffect(() => () => fallback.dispose(), [fallback])
  return tex
}

function Screen({ kind, name, on, light, children }: { kind: DeviceKind; name: string; on: boolean; light: boolean; children: (mat: ReactNode) => ReactNode }) {
  const tex = useScreenTexture(kind, name, light)
  const mat = useRef<THREE.MeshStandardMaterial>(null)
  // Las capturas claras brillan menos para no quemarse en blanco
  const glow = SCREEN_IMAGES[kind] ? 0.9 : 1.15
  useFrame((_, dt) => {
    const m = mat.current
    if (!m) return
    const target = on ? glow : 0
    m.emissiveIntensity += (target - m.emissiveIntensity) * Math.min(1, dt * 4)
    const c = on ? 1 : 0.06
    m.color.lerp(new THREE.Color(c, c, c), Math.min(1, dt * 4))
  })
  return (
    <>
      {children(
        <meshStandardMaterial key={tex.uuid} ref={mat} map={tex} emissiveMap={tex} emissive="#ffffff" emissiveIntensity={0} color="#111" roughness={0.35} toneMapped={false} />,
      )}
    </>
  )
}

/* ───────────── Luz de neón en el piso, debajo del dispositivo encendido ───────────── */
function NeonFloor({ on }: { on: boolean }) {
  const ring = useRef<THREE.MeshBasicMaterial>(null)
  const halo = useRef<THREE.MeshBasicMaterial>(null)
  const lamp = useRef<THREE.PointLight>(null)
  useFrame((state, dt) => {
    const k = Math.min(1, dt * 3)
    const flick = on ? 0.92 + Math.sin(state.clock.elapsedTime * 9) * 0.04 : 0
    if (ring.current) ring.current.opacity += (flick - ring.current.opacity) * k
    if (halo.current) halo.current.opacity += ((on ? 0.22 : 0) - halo.current.opacity) * k
    if (lamp.current) lamp.current.intensity += ((on ? 3 : 0) - lamp.current.intensity) * k
  })
  return (
    <group position={[0, -0.79, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.62, 0.68, 64]} />
        <meshBasicMaterial ref={ring} color="#ff3b4e" transparent opacity={0} toneMapped={false} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <circleGeometry args={[0.95, 48]} />
        <meshBasicMaterial ref={halo} color="#ff3b4e" transparent opacity={0} toneMapped={false} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <pointLight ref={lamp} color="#ff3b4e" intensity={0} distance={1.8} position={[0, 0.15, 0]} />
    </group>
  )
}

/* ───────────── Cámara: acercamiento suave al dispositivo encendido ───────────── */
function CameraRig({ focus, mobile }: { focus: boolean; mobile: boolean }) {
  const look = useRef(new THREE.Vector3(0, 0.2, 0))
  const far = useMemo(() => new THREE.Vector3(0, 1.3, 6.4), [])
  const near = useMemo(() => new THREE.Vector3(0, 1.05, mobile ? 5.9 : 5.45), [mobile])
  const lookFar = useMemo(() => new THREE.Vector3(0, 0.2, 0), [])
  const lookNear = useMemo(() => new THREE.Vector3(0, 0.15, 1.4), [])
  useFrame(({ camera }, dt) => {
    const k = Math.min(1, dt * 1.8)
    camera.position.lerp(focus ? near : far, k)
    look.current.lerp(focus ? lookNear : lookFar, k)
    camera.lookAt(look.current)
  })
  return null
}

/* ───────────── Dispositivos hechos con geometría ───────────── */
const shell = <meshStandardMaterial color="#4a3f44" metalness={0.55} roughness={0.35} />
const shellLight = <meshStandardMaterial color="#d9d2d0" metalness={0.5} roughness={0.35} />

function Laptop({ on, name, light }: { on: boolean; name: string; light: boolean }) {
  return (
    <group position={[0, -0.35, 0]}>
      <RoundedBox args={[1.6, 0.07, 1.05]} radius={0.03} position={[0, 0, 0.1]}>
        {light ? shellLight : shell}
      </RoundedBox>
      <mesh position={[0, 0.04, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.35, 0.55]} />
        <meshStandardMaterial color="#141012" roughness={0.8} />
      </mesh>
      <group position={[0, 0.03, -0.42]} rotation={[-0.22, 0, 0]}>
        <RoundedBox args={[1.6, 1.02, 0.05]} radius={0.03} position={[0, 0.51, 0]}>
          {light ? shellLight : shell}
        </RoundedBox>
        <Screen kind="laptop" name={name} on={on} light={light}>
          {(m) => (
            <mesh position={[0, 0.52, 0.027]}>
              <planeGeometry args={[1.46, 0.9]} />
              {m}
            </mesh>
          )}
        </Screen>
      </group>
    </group>
  )
}

function Phone({ on, name, light }: { on: boolean; name: string; light: boolean }) {
  return (
    <group rotation={[0, 0, 0]}>
      <RoundedBox args={[0.66, 1.32, 0.08]} radius={0.07} smoothness={4}>
        {light ? shellLight : shell}
      </RoundedBox>
      <Screen kind="phone" name={name} on={on} light={light}>
        {(m) => (
          <mesh position={[0, 0, 0.042]}>
            <planeGeometry args={[0.58, 1.2]} />
            {m}
          </mesh>
        )}
      </Screen>
    </group>
  )
}

function WatchDevice({ on, name, light }: { on: boolean; name: string; light: boolean }) {
  return (
    <group>
      {/* Correas */}
      <RoundedBox args={[0.42, 0.7, 0.06]} radius={0.03} position={[0, 0.72, -0.05]}>
        <meshStandardMaterial color={light ? '#bfb6b4' : '#1a1417'} roughness={0.8} />
      </RoundedBox>
      <RoundedBox args={[0.42, 0.7, 0.06]} radius={0.03} position={[0, -0.72, -0.05]}>
        <meshStandardMaterial color={light ? '#bfb6b4' : '#1a1417'} roughness={0.8} />
      </RoundedBox>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.16, 48]} />
        {light ? shellLight : shell}
      </mesh>
      {[0.25, 0, -0.25].map((y) => (
        <mesh key={y} position={[0.5, y, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.08, 12]} />
          <meshStandardMaterial color="#3a3034" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
      <Screen kind="watch" name={name} on={on} light={light}>
        {(m) => (
          <mesh position={[0, 0, 0.082]}>
            <circleGeometry args={[0.42, 48]} />
            {m}
          </mesh>
        )}
      </Screen>
    </group>
  )
}

function Cartridge({ on, name, light }: { on: boolean; name: string; light: boolean }) {
  return (
    <group>
      <RoundedBox args={[1, 1.15, 0.2]} radius={0.04}>
        <meshStandardMaterial color={light ? '#5a5357' : '#3a3236'} roughness={0.6} />
      </RoundedBox>
      {/* Ranuras de agarre */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, 0.5 - i * 0.04, 0.102]}>
          <boxGeometry args={[0.7, 0.012, 0.01]} />
          <meshStandardMaterial color="#1a1417" />
        </mesh>
      ))}
      {/* Contactos */}
      <mesh position={[0, -0.6, 0]}>
        <boxGeometry args={[0.7, 0.08, 0.06]} />
        <meshStandardMaterial color="#c9a227" metalness={0.9} roughness={0.25} />
      </mesh>
      <Screen kind="cartridge" name={name} on={on} light={light}>
        {(m) => (
          <mesh position={[0, -0.04, 0.102]}>
            <planeGeometry args={[0.8, 0.62]} />
            {m}
          </mesh>
        )}
      </Screen>
    </group>
  )
}

/* ───────────── Partículas que emite un dispositivo encendido ───────────── */
function Sparks({ count = 40 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)
  const data = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const speed = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 1.4
      pos[i * 3 + 1] = Math.random() * 1.6 - 0.6
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.8
      speed[i] = 0.3 + Math.random() * 0.6
    }
    return { pos, speed }
  }, [count])
  useFrame((_, dt) => {
    const p = ref.current
    if (!p) return
    const arr = p.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += data.speed[i] * dt
      if (arr[i * 3 + 1] > 1.3) arr[i * 3 + 1] = -0.6
    }
    p.geometry.attributes.position.needsUpdate = true
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.pos, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ff3b4e" size={0.045} transparent opacity={0.9} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}

/* ───────────── Un dispositivo en el carrusel ───────────── */
function DeviceSlot({
  device,
  index,
  total,
  on,
  selected,
  light,
  viewLabel,
  onTap,
  onView,
}: {
  device: LabDevice
  index: number
  total: number
  on: boolean
  selected: boolean
  light: boolean
  viewLabel: string
  onTap: (i: number) => void
  onView: (id: string) => void
}) {
  const ref = useRef<THREE.Group>(null)
  const [hover, setHover] = useState(false)
  const a = (index / total) * TAU
  const pos: [number, number, number] = [Math.sin(a) * RADIUS, 0, Math.cos(a) * RADIUS]

  useEffect(() => {
    document.body.style.cursor = hover ? 'pointer' : ''
    return () => {
      document.body.style.cursor = ''
    }
  }, [hover])

  useFrame((state, dt) => {
    const g = ref.current
    if (!g) return
    const targetY = on ? 0.35 + Math.sin(state.clock.elapsedTime * 1.6 + index) * 0.05 : 0
    g.position.y += (targetY - g.position.y) * Math.min(1, dt * 4)
    const s = hover || selected ? 1.06 : 1
    g.scale.lerp(new THREE.Vector3(s, s, s), Math.min(1, dt * 6))
    if (on) g.rotation.y = Math.sin(state.clock.elapsedTime * 0.8 + index) * 0.12
  })

  const Comp = { laptop: Laptop, phone: Phone, watch: WatchDevice, cartridge: Cartridge }[device.kind]

  return (
    <group position={pos} rotation={[0, a, 0]}>
      <NeonFloor on={on} />
      <group
        ref={ref}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation()
          onTap(index)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHover(true)
        }}
        onPointerOut={() => setHover(false)}
      >
        <Comp on={on} name={device.name} light={light} />
        {on && <Sparks />}
        {on && <pointLight color="#ff3b4e" intensity={4} distance={2.5} position={[0, 0.2, 0.6]} />}
        {on && selected && (
          <Html position={[0, 1.05, 0]} center distanceFactor={2.7} zIndexRange={[20, 0]}>
            <div className="glass pointer-events-auto flex w-max items-center gap-3 rounded-2xl px-3 py-2 shadow-soft">
              <span className="font-display text-sm font-extrabold whitespace-nowrap text-ink">{device.name}</span>
              <button
                type="button"
                onClick={() => onView(device.projectId)}
                className="rounded-full bg-primary px-3 py-1 text-xs font-semibold whitespace-nowrap text-on-primary"
              >
                {viewLabel}
              </button>
            </div>
          </Html>
        )}
      </group>
    </group>
  )
}

/* ───────────── Carrusel con arrastre e inercia ───────────── */
function Carousel(props: LabSceneProps & { dragRef: RefObject<DragState> }) {
  const { devices, powered, selected, autoRotate, light, viewLabel, onSelect, onPower, onView, dragRef } = props
  const group = useRef<THREE.Group>(null)
  const angle = useRef(0)
  const target = useRef(0)
  const lastFront = useRef(selected)
  const step = TAU / devices.length

  // Cuando la selección cambia desde fuera (teclado / clic), gira hasta ese dispositivo
  useEffect(() => {
    const desired = -selected * step
    const k = Math.round((angle.current - desired) / TAU)
    target.current = desired + k * TAU
    lastFront.current = selected
  }, [selected, step, autoRotate])

  useFrame((_, dt) => {
    const d = dragRef.current
    // Solo se reporta el dispositivo de frente cuando el usuario arrastra o el giro es automático;
    // al girar hacia una selección externa (teclado/clic) no se sobrescribe.
    const free = d.dragging || Math.abs(d.vel) > 0.0015 || autoRotate
    if (d.dragging) {
      angle.current += d.dx
      d.vel = d.dx
      d.dx = 0
    } else if (Math.abs(d.vel) > 0.0015) {
      angle.current += d.vel
      d.vel *= 0.93
      if (Math.abs(d.vel) <= 0.0015) {
        // Ajusta al dispositivo más cercano al terminar la inercia
        const idx = Math.round(-angle.current / step)
        target.current = idx * -step
      }
    } else if (autoRotate) {
      angle.current -= dt * 0.25
      target.current = angle.current
    } else {
      angle.current += (target.current - angle.current) * Math.min(1, dt * 5)
    }

    const front = (((Math.round(-angle.current / step) % devices.length) + devices.length) % devices.length) | 0
    if (free && front !== lastFront.current) {
      lastFront.current = front
      onSelect(front)
    }
    if (group.current) group.current.rotation.y = angle.current
  })

  return (
    <group ref={group}>
      {devices.map((d, i) => (
        <DeviceSlot
          key={d.projectId}
          device={d}
          index={i}
          total={devices.length}
          on={powered[i]}
          selected={selected === i}
          light={light}
          viewLabel={viewLabel}
          onTap={(i) => {
            if (dragRef.current.moved > 8) return
            onSelect(i)
            onPower(i)
          }}
          onView={onView}
        />
      ))}
    </group>
  )
}

export default function LabScene(props: LabSceneProps & { mobile: boolean; active: boolean }) {
  const { mobile, light, onInteract, active, powered, selected, autoRotate } = props
  const [dragging, setDragging] = useState(false)
  // Acerca la cámara cuando el dispositivo de frente está encendido y nadie está girando el carrusel
  const focus = powered[selected] && !autoRotate && !dragging
  const dragRef = useRef<DragState>({ dragging: false, vel: 0, dx: 0, moved: 0 })
  const lastX = useRef(0)

  return (
    <div
      className="absolute inset-0 touch-pan-y"
      onPointerDown={(e) => {
        dragRef.current.dragging = true
        setDragging(true)
        dragRef.current.vel = 0
        dragRef.current.moved = 0
        lastX.current = e.clientX
        onInteract()
      }}
      onPointerMove={(e) => {
        if (!dragRef.current.dragging) return
        const dx = e.clientX - lastX.current
        lastX.current = e.clientX
        dragRef.current.dx += dx * 0.006
        dragRef.current.moved += Math.abs(dx)
      }}
      onPointerUp={() => {
        dragRef.current.dragging = false
        setDragging(false)
      }}
      onPointerLeave={() => {
        dragRef.current.dragging = false
        setDragging(false)
      }}
      onPointerCancel={() => {
        dragRef.current.dragging = false
        setDragging(false)
      }}
    >
      <Canvas
        dpr={mobile ? [1, 1.5] : [1, 2]}
        camera={{ position: [0, 1.3, 6.4], fov: mobile ? 56 : 42 }}
        gl={{ antialias: !mobile, alpha: true, powerPreference: 'high-performance' }}
        frameloop={active ? 'always' : 'never'}
        onCreated={({ camera }) => camera.lookAt(0, 0.2, 0)}
      >
        <CameraRig focus={focus} mobile={mobile} />
        <ambientLight intensity={light ? 1 : 0.75} />
        <hemisphereLight args={['#ffffff', '#ff3b4e', light ? 0.6 : 0.35]} />
        <directionalLight position={[3, 5, 4]} intensity={light ? 1.6 : 1.5} />
        <directionalLight position={[-4, 2, -3]} intensity={0.6} color="#ff8a96" />
        <pointLight position={[0, 2.5, 0]} color="#ff3b4e" intensity={light ? 6 : 10} distance={9} />

        <group position={[0, -0.2, 0]}>
          <Carousel {...props} dragRef={dragRef} />
        </group>

        {/* Piso con reflejo suave */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
          <circleGeometry args={[14, 64]} />
          {mobile ? (
            <meshStandardMaterial color={light ? '#f1e7e5' : '#120c0e'} roughness={0.6} metalness={0.2} />
          ) : (
            <MeshReflectorMaterial
              resolution={512}
              mixBlur={1}
              mixStrength={light ? 1.5 : 18}
              blur={[300, 100]}
              roughness={0.85}
              depthScale={1}
              minDepthThreshold={0.4}
              maxDepthThreshold={1.4}
              color={light ? '#ffffff' : '#120c0e'}
              metalness={light ? 0 : 0.4}
              mirror={0.5}
            />
          )}
        </mesh>
        {!mobile && <ContactShadows position={[0, -0.99, 0]} opacity={0.5} scale={12} blur={2.4} far={3} resolution={512} />}
        <fog attach="fog" args={[light ? '#fbf8f7' : '#0c0809', 7, 15]} />
      </Canvas>
    </div>
  )
}
