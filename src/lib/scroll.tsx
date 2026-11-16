import Lenis from 'lenis'
import { useEffect, type ReactNode } from 'react'
import { useReducedMotion } from './hooks'

let lenis: Lenis | null = null
const HEADER_OFFSET = 88

/** Hace scroll suave a una sección respetando la altura del header */
export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) {
    lenis.scrollTo(el, { offset: -HEADER_OFFSET, duration: 1.2 })
  } else {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' })
  }
  // Mueve el foco a la sección para usuarios de teclado y lectores de pantalla
  el.setAttribute('tabindex', '-1')
  el.focus({ preventScroll: true })
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { duration: 1.4 })
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}

/** Bloquea / desbloquea el scroll (modales y menú móvil) */
export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop()
    else lenis.start()
  }
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    const instance = new Lenis({ duration: 1.1, smoothWheel: true, anchors: false })
    lenis = instance
    let raf = 0
    const loop = (time: number) => {
      instance.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    // Los links de ancla internos usan scrollToId
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!a) return
      const id = a.getAttribute('href')!.slice(1)
      if (!id || !document.getElementById(id)) return
      e.preventDefault()
      scrollToId(id)
      history.replaceState(null, '', `#${id}`)
    }
    document.addEventListener('click', onClick)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('click', onClick)
      instance.destroy()
      lenis = null
    }
  }, [reduce])

  return <>{children}</>
}
