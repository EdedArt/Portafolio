import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import type { PointerEvent } from 'react'
import { ThemedImage } from './ThemedImage'

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

// Motas de polvo de la capa delantera (posiciones fijas)
const DUST = [
  [12, 18, 2], [28, 64, 1.5], [44, 30, 1], [61, 78, 2.5], [73, 22, 1.5], [86, 56, 1], [20, 88, 1], [52, 50, 1.5], [92, 12, 2],
] as const

/** Captura real de Plomo y Paja en una pantalla antigua con efecto de proyector y paralaje */
export function PlomoMockup({ active = true }: { active?: boolean }) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 120, damping: 18 })
  const sy = useSpring(my, { stiffness: 120, damping: 18 })
  // La imagen se mueve poco y en contra; el grano y el polvo, más y a favor
  const imgX = useTransform(sx, (v) => v * -10)
  const imgY = useTransform(sy, (v) => v * -7)
  const fgX = useTransform(sx, (v) => v * 18)
  const fgY = useTransform(sy, (v) => v * 12)
  const rotY = useTransform(sx, [-1, 1], [-7, 7])
  const rotX = useTransform(sy, [-1, 1], [5, -5])

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1)
    my.set(((e.clientY - r.top) / r.height) * 2 - 1)
  }

  return (
    <div
      className="grid size-full place-items-center p-[6%]"
      style={{ perspective: 1000 }}
      onPointerMove={onMove}
      onPointerLeave={() => {
        mx.set(0)
        my.set(0)
      }}
    >
      <motion.div className="w-full max-w-[620px]" style={{ rotateX: rotX, rotateY: rotY }}>
        {/* Carcasa de monitor antiguo */}
        <div className="rounded-[1.4rem] bg-gradient-to-b from-[#463c33] via-[#2c251f] to-[#1b1612] p-[3.2%] pb-[2%] shadow-[0_30px_60px_-20px_rgba(0,0,0,.7)] ring-1 ring-black/40">
          <div className="relative aspect-video overflow-hidden rounded-[0.9rem] bg-black">
            <motion.div className={`absolute -inset-[5%] ${active ? 'animate-flicker-soft' : ''}`} style={{ x: imgX, y: imgY }}>
              <ThemedImage
                light="/proyectos/plomo-portada.webp"
                dark="/proyectos/plomo-menu.webp"
                width={1365}
                height={767}
                className="relative size-full"
                imgClassName="object-cover sepia-[.15]"
              />
            </motion.div>

            {/* Capa delantera: grano y polvo */}
            <motion.div className="pointer-events-none absolute -inset-[20%]" style={{ x: fgX, y: fgY }}>
              <div className={`absolute inset-0 opacity-25 mix-blend-overlay ${active ? 'animate-grain' : ''}`} style={{ backgroundImage: NOISE }} />
              {DUST.map(([x, y, s], i) => (
                <span key={i} className="absolute rounded-full bg-white/70" style={{ left: `${x}%`, top: `${y}%`, width: s * 2, height: s * 2 }} />
              ))}
            </motion.div>

            {/* Rayas de proyector, viñeta y curvatura de pantalla */}
            {active && <span className="animate-scratch pointer-events-none absolute inset-y-0 w-px bg-black/40" />}
            <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,.6) 100%)' }} />
            <div className="pointer-events-none absolute inset-0 rounded-[0.9rem] shadow-[inset_0_0_30px_rgba(0,0,0,.8)]" />
          </div>
          {/* Perillas y luz de encendido */}
          <div className="mt-[1.6%] flex items-center justify-end gap-2 pr-1">
            <span className={`size-1.5 rounded-full bg-[#ff3b4e] ${active ? 'shadow-[0_0_6px_#ff3b4e]' : ''}`} />
            <span className="size-3 rounded-full bg-gradient-to-br from-[#6b5d50] to-[#2a231d] ring-1 ring-black/40" />
            <span className="size-3 rounded-full bg-gradient-to-br from-[#6b5d50] to-[#2a231d] ring-1 ring-black/40" />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
