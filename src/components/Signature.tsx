import { useInView } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../lib/hooks'
/*
 * La firma vive en src/assets/signature.svg (trazos con `stroke`, sin relleno).
 * Puedes reemplazarla por tu firma real escaneada: vectorízala como trazos
 * (por ejemplo, en Inkscape o Illustrator) y deja los <path> dentro del SVG.
 * Si tu firma queda como relleno en lugar de trazo, usa <Signature animate={false} />.
 */
import raw from '../assets/signature.svg?raw'

const viewBox = raw.match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 240 40'
const groupTransform = raw.match(/<g[^>]*transform="([^"]+)"/)?.[1]
const strokeWidth = raw.match(/stroke-width="([^"]+)"/)?.[1] ?? '1.4'
const paths = [...raw.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((m) => m[1])

interface SignatureProps {
  /** Ancho en px o cualquier unidad CSS (el alto se ajusta solo) */
  width?: number | string
  /** Color del trazo; por defecto hereda el color del texto */
  color?: string
  /** Dibuja la firma con una animación de trazo */
  animate?: boolean
  /** Espera antes de empezar a dibujar (s) */
  delay?: number
  /** Duración total del dibujo (s) */
  duration?: number
  /** 'mount': dibuja al montar · 'view': dibuja cuando entra en pantalla */
  trigger?: 'mount' | 'view'
  className?: string
  /** Texto accesible; si se omite, la firma es decorativa */
  label?: string
}

export function Signature({
  width = 240,
  color = 'currentColor',
  animate = true,
  delay = 0,
  duration = 2,
  trigger = 'view',
  className = '',
  label,
}: SignatureProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const inView = useInView(svgRef, { once: true, margin: '0px 0px -10% 0px' })
  const reduce = useReducedMotion()
  const draw = animate && !reduce
  const start = trigger === 'mount' || inView

  useEffect(() => {
    if (!draw || !start || !svgRef.current) return
    const els = [...svgRef.current.querySelectorAll('path')]
    const lengths = els.map((p) => p.getTotalLength())
    const total = lengths.reduce((a, b) => a + b, 0) || 1
    let acc = 0
    const anims = els.map((p, i) => {
      const d = (lengths[i] / total) * duration * 1000
      const a = p.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], {
        duration: Math.max(d, 60),
        delay: delay * 1000 + (acc / total) * duration * 1000,
        easing: 'cubic-bezier(.45,.05,.35,1)',
        fill: 'both',
      })
      acc += lengths[i]
      return a
    })
    return () => anims.forEach((a) => a.cancel())
  }, [draw, start, delay, duration])

  return (
    <svg
      ref={svgRef}
      viewBox={viewBox}
      width={width}
      className={`h-auto overflow-visible ${className}`}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <g transform={groupTransform}>
        {paths.map((d, i) => (
          <path
            key={i}
            d={d}
            pathLength={1}
            // Oculta el trazo antes de que empiece la animación
            style={draw ? { strokeDasharray: 1, strokeDashoffset: 1 } : undefined}
          />
        ))}
      </g>
    </svg>
  )
}
