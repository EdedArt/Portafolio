import { lazy, Suspense, useEffect, useState } from 'react'
import { hasWebGL } from '../../lib/hooks'

const ParticleField = lazy(() => import('./ParticleField'))

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E\")"

/** Fondo fijo: partículas WebGL + aurora + cuadrícula + grano + viñeta */
export function Background() {
  const [ready, setReady] = useState(false)

  // Carga el canvas 3D cuando el navegador está libre, para no bloquear el primer render
  useEffect(() => {
    if (!hasWebGL()) return
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setReady(true), { timeout: 1500 })
      return () => (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(id)
    }
    const id = window.setTimeout(() => setReady(true), 600)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Aurora */}
      <div className="absolute -top-[20%] left-[10%] h-[60vh] w-[60vw] rounded-full bg-primary opacity-[0.10] blur-[120px] dark:opacity-[0.16]" />
      <div className="absolute top-[40%] -right-[15%] h-[55vh] w-[45vw] rounded-full bg-[#ff7a59] opacity-[0.08] blur-[130px] dark:opacity-[0.10]" />
      <div className="absolute -bottom-[25%] -left-[10%] h-[50vh] w-[50vw] rounded-full bg-primary opacity-[0.06] blur-[140px] dark:opacity-[0.12]" />

      {/* Cuadrícula */}
      <div
        className="absolute inset-0 opacity-[0.5] dark:opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 30%, #000 30%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 30%, #000 30%, transparent 85%)',
        }}
      />

      {/* Partículas 3D */}
      {ready && (
        <Suspense fallback={null}>
          <ParticleField />
        </Suspense>
      )}

      {/* Grano */}
      <div
        className="absolute -inset-[50%] opacity-[0.05] mix-blend-multiply dark:opacity-[0.07] dark:mix-blend-screen"
        style={{ backgroundImage: NOISE }}
      />

      {/* Viñeta */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 55%, color-mix(in srgb, var(--bg) 85%, #000 6%) 100%)',
        }}
      />
    </div>
  )
}
