import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useIsMobile, useReducedMotion } from '../../lib/hooks'
import { useTheme } from '../../theme/ThemeProvider'

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  attribute float aRandom;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    // Onda lenta que respira sobre la esfera
    float wave = sin(uTime * 0.55 + p.y * 2.4 + p.x * 1.6) * 0.09
               + sin(uTime * 0.35 + p.z * 3.1) * 0.05;
    p *= 1.0 + wave * (0.6 + aRandom * 0.8);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (0.55 + aRandom * 0.9) / -mv.z;
    // Las partículas del frente brillan más
    vAlpha = smoothstep(-7.0, -2.5, mv.z) * (0.45 + aRandom * 0.55);
  }
`

const fragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(uColor, a * vAlpha * uOpacity);
  }
`

function Particles({ count, animate, dark }: { count: number; animate: boolean; dark: boolean }) {
  const group = useRef<THREE.Group>(null)
  const { camera, invalidate, gl } = useThree()
  const mouse = useRef({ x: 0, y: 0 })

  const { positions, randoms } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const randoms = new Float32Array(count)
    const golden = Math.PI * (3 - Math.sqrt(5))
    const sphere = Math.floor(count * 0.78)
    for (let i = 0; i < count; i++) {
      let x: number, y: number, z: number
      if (i < sphere) {
        // Esfera de Fibonacci con algo de ruido
        const yy = 1 - (i / (sphere - 1)) * 2
        const r = Math.sqrt(1 - yy * yy)
        const th = golden * i
        const rad = 2.2 + (Math.random() - 0.5) * 0.18
        x = Math.cos(th) * r * rad
        y = yy * rad
        z = Math.sin(th) * r * rad
      } else {
        // Polvo disperso alrededor
        const rad = 3 + Math.random() * 3.5
        const th = Math.random() * Math.PI * 2
        const ph = Math.acos(2 * Math.random() - 1)
        x = rad * Math.sin(ph) * Math.cos(th)
        y = rad * Math.sin(ph) * Math.sin(th) * 0.6
        z = rad * Math.cos(ph)
      }
      positions.set([x, y, z], i * 3)
      randoms[i] = Math.random()
    }
    return { positions, randoms }
  }, [count])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 26 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uColor: { value: new THREE.Color('#e11d2e') },
      uOpacity: { value: 0.5 },
    }),
    [],
  )

  useEffect(() => {
    uniforms.uColor.value.set(dark ? '#ff3b4e' : '#e11d2e')
    uniforms.uOpacity.value = dark ? 0.95 : 0.42
    uniforms.uPixelRatio.value = gl.getPixelRatio()
    invalidate()
  }, [dark, uniforms, invalidate, gl])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    const onScroll = () => invalidate()
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [invalidate])

  useFrame((_, delta) => {
    const g = group.current
    if (!g) return
    const scroll = window.scrollY
    if (animate) uniforms.uTime.value += Math.min(delta, 0.05)
    const t = uniforms.uTime.value
    // Gira con el scroll y con el tiempo
    g.rotation.y = scroll * 0.0005 + t * 0.04
    g.rotation.x = 0.25 + scroll * 0.00015
    // Paralaje con el mouse
    const tx = mouse.current.x * 0.5
    const ty = -mouse.current.y * 0.35
    camera.position.x += (tx - camera.position.x) * (animate ? 0.04 : 1)
    camera.position.y += (ty - camera.position.y) * (animate ? 0.04 : 1)
    camera.lookAt(0, 0, 0)
    // Se desplaza un poco con el scroll para que no tape el contenido
    g.position.y = Math.min(scroll * 0.0008, 1.2)
  })

  return (
    <group ref={group} position={[0, 0, 0]}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aRandom" args={[randoms, 1]} />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={vertex}
          fragmentShader={fragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={dark ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </points>
    </group>
  )
}

export default function ParticleField() {
  const mobile = useIsMobile()
  const reduce = useReducedMotion()
  const { theme } = useTheme()
  const count = mobile ? 2200 : 6500

  return (
    <div className="absolute inset-0 transition-opacity duration-1000 md:left-[22%]">
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 55 }}
        dpr={mobile ? [1, 1.5] : [1, 2]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        frameloop={reduce ? 'demand' : 'always'}
        style={{ pointerEvents: 'none' }}
      >
        <Particles count={count} animate={!reduce} dark={theme === 'dark'} />
      </Canvas>
    </div>
  )
}
