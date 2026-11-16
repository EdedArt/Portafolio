import {
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode, type PointerEvent as RPointerEvent } from 'react'
import { useFinePointer, useReducedMotion } from '../../lib/hooks'

/* ───────────── Revelado palabra por palabra ───────────── */
export function RevealWords({
  text,
  className = '',
  delay = 0,
  as: Tag = 'span',
}: {
  text: string
  className?: string
  delay?: number
  as?: 'span' | 'p'
}) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduce = useReducedMotion()
  const words = text.split(' ')
  return (
    <Tag ref={ref as never} className={className} style={{ perspective: 600 }}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-top">
          <motion.span
            className="inline-block"
            initial={reduce ? false : { y: '110%', rotateX: -60, opacity: 0 }}
            animate={inView ? { y: '0%', rotateX: 0, opacity: 1 } : undefined}
            transition={{ duration: 0.7, delay: delay + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </Tag>
  )
}

/* ───────────── Aparecer al entrar ───────────── */
export function FadeIn({
  children,
  delay = 0,
  y = 24,
  className,
  ...rest
}: { children: ReactNode; delay?: number; y?: number; className?: string } & HTMLMotionProps<'div'>) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/* ───────────── Tarjeta con inclinación 3D + reflejo ───────────── */
export function TiltCard({
  children,
  className = '',
  max = 10,
  glare = true,
  scale = 1.01,
  innerClassName = '',
}: {
  children: ReactNode
  className?: string
  innerClassName?: string
  max?: number
  glare?: boolean
  scale?: number
}) {
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const enabled = fine && !reduce
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const sx = useSpring(px, { stiffness: 220, damping: 22 })
  const sy = useSpring(py, { stiffness: 220, damping: 22 })
  const rotateY = useTransform(sx, [0, 1], [-max, max])
  const rotateX = useTransform(sy, [0, 1], [max, -max])
  const gx = useTransform(sx, (v) => `${v * 100}%`)
  const gy = useTransform(sy, (v) => `${v * 100}%`)
  const glareBg = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.28), transparent 55%)`
  const [hover, setHover] = useState(false)

  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    if (!enabled || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  const onLeave = () => {
    px.set(0.5)
    py.set(0.5)
    setHover(false)
  }

  return (
    <div className={className} style={{ perspective: 1200 }} onPointerMove={onMove} onPointerEnter={() => setHover(true)} onPointerLeave={onLeave}>
      <motion.div
        className={`relative h-full preserve-3d ${innerClassName}`}
        style={enabled ? { rotateX, rotateY } : undefined}
        animate={{ scale: enabled && hover ? scale : 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      >
        {children}
        {glare && enabled && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] mix-blend-overlay"
            style={{ background: glareBg, opacity: hover ? 1 : 0, transition: 'opacity .3s' }}
          />
        )}
      </motion.div>
    </div>
  )
}

/* ───────────── Botón magnético ───────────── */
export function Magnetic({ children, strength = 0.3, className = '' }: { children: ReactNode; strength?: number; className?: string }) {
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const x = useSpring(0, { stiffness: 250, damping: 18 })
  const y = useSpring(0, { stiffness: 250, damping: 18 })
  if (!fine || reduce) return <div className={`inline-flex ${className}`}>{children}</div>
  return (
    <motion.div
      className={`inline-flex ${className}`}
      style={{ x, y }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        x.set((e.clientX - (r.left + r.width / 2)) * strength)
        y.set((e.clientY - (r.top + r.height / 2)) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

/* ───────────── Contador animado ───────────── */
export function Counter({ to, suffix = '', duration = 1.6 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  const [val, setVal] = useState(reduce ? to : 0)
  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setVal(to)
      return
    }
    const c = animate(0, to, { duration, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setVal(Math.round(v)) })
    return () => c.stop()
  }, [inView, to, duration, reduce])
  return (
    <span ref={ref} className="tabular-nums">
      {val}
      {suffix}
    </span>
  )
}

/* ───────────── Encabezado de sección ───────────── */
export function SectionHeading({
  kicker,
  title,
  accent,
  subtitle,
  center = false,
  id,
}: {
  kicker: string
  title: string
  accent: string
  subtitle?: string
  center?: boolean
  id?: string
}) {
  return (
    <div className={`mb-12 md:mb-16 ${center ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}`}>
      <FadeIn>
        <p className="kicker mb-4 flex items-center gap-3" style={center ? { justifyContent: 'center' } : undefined}>
          <span className="h-px w-8 bg-primary" aria-hidden="true" />
          {kicker}
        </p>
      </FadeIn>
      <h2 id={id} className="font-display text-[clamp(2.4rem,7vw,5rem)] leading-[0.95] font-extrabold tracking-tight uppercase">
        <RevealWords text={title} />{' '}
        <RevealWords text={accent} delay={0.12} className="font-serif font-normal tracking-normal text-primary-text normal-case italic" />
      </h2>
      {subtitle && (
        <FadeIn delay={0.2}>
          <p className="mt-5 text-lg text-muted">{subtitle}</p>
        </FadeIn>
      )}
    </div>
  )
}

/* ───────────── Clases de botones ───────────── */
export const btnPrimary =
  'inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-on-primary shadow-[0_10px_30px_-10px_var(--primary)] transition-[transform,box-shadow] hover:shadow-[0_14px_36px_-10px_var(--primary)] active:scale-[0.97]'
export const btnGhost =
  'inline-flex items-center justify-center gap-2 rounded-full border border-line-strong bg-surface/70 px-6 py-3.5 text-sm font-semibold text-ink backdrop-blur transition-colors hover:border-primary hover:text-primary-text active:scale-[0.97]'
export const card = 'rounded-3xl border border-line bg-surface/80 shadow-soft backdrop-blur-sm'
