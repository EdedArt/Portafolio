import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../lib/hooks'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&@$'
const rand = () => CHARS[(Math.random() * CHARS.length) | 0]

/**
 * Texto que se "decodifica": cada letra muestra caracteres aleatorios
 * hasta resolverse, de izquierda a derecha. Es decorativo (aria-hidden):
 * el nombre accesible lo pone el contenedor.
 */
export function useDecode(text: string, { duration = 1.2, delay = 0 } = {}) {
  const reduce = useReducedMotion()
  const [shown, setShown] = useState(() => (reduce ? text : text.replace(/\S/g, ' ')))
  const raf = useRef(0)

  const run = useCallback(
    (dur: number, wait = 0, fromBlank = true) => {
      cancelAnimationFrame(raf.current)
      const n = text.length
      const t0 = performance.now() + wait * 1000
      let lastSwap = 0
      let scrambled = text.split('').map((c) => (c === ' ' ? ' ' : rand()))
      const tick = (now: number) => {
        const t = (now - t0) / (dur * 1000)
        if (t < 0) {
          raf.current = requestAnimationFrame(tick)
          return
        }
        // Cambia los caracteres aleatorios cada ~45 ms para que se lean
        if (now - lastSwap > 45) {
          scrambled = scrambled.map((_, i) => (text[i] === ' ' ? ' ' : rand()))
          lastSwap = now
        }
        const out = text
          .split('')
          .map((c, i) => {
            // Cada letra empieza a verse en un momento y se resuelve un poco después
            const resolveAt = 0.25 + (i / n) * 0.75
            return t >= resolveAt ? c : t >= (i / n) * 0.4 || !fromBlank ? scrambled[i] : ' '
          })
          .join('')
        setShown(out)
        if (t < 1) raf.current = requestAnimationFrame(tick)
        else setShown(text)
      }
      raf.current = requestAnimationFrame(tick)
    },
    [text],
  )

  useEffect(() => {
    if (reduce) {
      setShown(text)
      return
    }
    run(duration, delay)
    return () => cancelAnimationFrame(raf.current)
  }, [reduce, run, text, duration, delay])

  /** Vuelve a decodificar rápido (hover) */
  const replay = useCallback(() => {
    if (!reduce) run(0.5, 0, false)
  }, [reduce, run])

  return { shown, replay }
}

/**
 * Pinta cada letra en una celda con el ancho de la letra final,
 * así los caracteres aleatorios no mueven el diseño.
 */
export function DecodeLetters({ text, shown, gradient = false, className = '' }: { text: string; shown: string; gradient?: boolean; className?: string }) {
  const n = text.length
  return (
    <span className={`block whitespace-nowrap ${className}`} aria-hidden="true">
      {text.split('').map((c, i) => (
        <span key={i} className="relative inline-block">
          <span className="invisible">{c}</span>
          <span
            className={`absolute inset-0 text-center ${gradient ? 'decode-gradient' : ''}`}
            style={gradient ? { backgroundSize: `${n * 100}% 100%`, backgroundPosition: `${n > 1 ? (i / (n - 1)) * 100 : 0}% 0` } : undefined}
          >
            {shown[i]}
          </span>
        </span>
      ))}
    </span>
  )
}
