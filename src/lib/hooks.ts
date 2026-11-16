import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'

function subscribeMQ(query: string) {
  return (cb: () => void) => {
    const mq = window.matchMedia(query)
    mq.addEventListener('change', cb)
    return () => mq.removeEventListener('change', cb)
  }
}

export function useMediaQuery(query: string): boolean {
  const subscribe = useMemo(() => subscribeMQ(query), [query])
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/** Pantallas pequeñas o táctiles: animaciones más livianas */
export const useIsMobile = () => useMediaQuery('(max-width: 767px), (pointer: coarse)')
/** Dispositivo con mouse real */
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)')
export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')

/** Devuelve el id de la sección más visible */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const visible = new Map<string, number>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0)
        let best = ''
        let bestRatio = 0
        for (const id of ids) {
          const r = visible.get(id) ?? 0
          if (r > bestRatio) {
            best = id
            bestRatio = r
          }
        }
        if (best) setActive(best)
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.01, 0.25, 0.5, 0.75, 1] },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [ids])
  return active
}

/** Detecta soporte WebGL una sola vez */
let webglCache: boolean | null = null
export function hasWebGL(): boolean {
  if (webglCache !== null) return webglCache
  try {
    const c = document.createElement('canvas')
    webglCache = !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    webglCache = false
  }
  return webglCache
}
