import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { useState } from 'react'
import type { Project } from '../data/content'
import { useI18n } from '../i18n/I18nProvider'
import { PhoneFrame } from './mockups/AutoCleanMockup'

export type Shot = NonNullable<Project['images']>[number]

/** Galería del modal: carrusel con flechas y puntos, o fila de teléfonos. Clic en una captura = ampliar. */
export function ProjectGallery({ project, onZoom }: { project: Project; onZoom: (shot: Shot) => void }) {
  const { t, l, f } = useI18n()
  const m = t.projects.modal
  const shots = project.images ?? []
  const [i, setI] = useState(0)
  const [dir, setDir] = useState(1)
  if (!shots.length) return null

  if (project.galleryLayout === 'phones') {
    return (
      <ul className="-mx-2 flex snap-x gap-4 overflow-x-auto px-2 pt-1 pb-3">
        {shots.map((s) => (
          <li key={s.src} className="snap-start">
            <button
              type="button"
              onClick={() => onZoom(s)}
              aria-label={f(m.zoom, { nombre: l(s.alt) })}
              className="group block w-[150px] text-left"
            >
              {/* 150 px: menor que el ancho real de las capturas, así no se ven borrosas */}
              <PhoneFrame className="aspect-[9/19] w-full transition-transform group-hover:-translate-y-1">
                <img src={s.src} alt="" width={s.width} height={s.height} loading="lazy" decoding="async" className="size-full object-cover object-top" />
              </PhoneFrame>
              <span className="mt-2 block text-xs leading-snug text-muted">{l(s.alt)}</span>
            </button>
          </li>
        ))}
      </ul>
    )
  }

  const go = (n: number) => {
    setDir(n > i ? 1 : -1)
    setI((n + shots.length) % shots.length)
  }
  const cur = shots[i]
  const arrow =
    'absolute top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white backdrop-blur transition-colors hover:bg-primary'

  return (
    <div>
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-line bg-black">
        <AnimatePresence initial={false} custom={dir}>
          <motion.button
            key={cur.src}
            type="button"
            onClick={() => onZoom(cur)}
            aria-label={f(m.zoom, { nombre: l(cur.alt) })}
            className="group absolute inset-0 cursor-zoom-in"
            custom={dir}
            initial={{ x: `${dir * 100}%`, opacity: 0.4 }}
            animate={{ x: '0%', opacity: 1 }}
            exit={{ x: `${dir * -100}%`, opacity: 0.4 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src={cur.src} alt="" width={cur.width} height={cur.height} loading="lazy" decoding="async" className="size-full object-contain" />
            <span className="absolute right-3 bottom-3 grid size-9 place-items-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              <ZoomIn size={16} aria-hidden="true" />
            </span>
          </motion.button>
        </AnimatePresence>
        {shots.length > 1 && (
          <>
            <button type="button" onClick={() => go(i - 1)} aria-label={m.prev} className={`${arrow} left-3`}>
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => go(i + 1)} aria-label={m.next} className={`${arrow} right-3`}>
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </>
        )}
      </div>
      <p className="mt-3 text-center text-sm text-muted" aria-live="polite">
        {l(cur.alt)}
      </p>
      {shots.length > 1 && (
        <div className="mt-2 flex justify-center gap-1">
          {shots.map((s, n) => (
            <button
              key={s.src}
              type="button"
              onClick={() => go(n)}
              aria-label={f(m.goTo, { n: n + 1, total: shots.length })}
              aria-current={n === i}
              className="grid size-6 place-items-center"
            >
              <span className={`block h-2 rounded-full transition-all ${n === i ? 'w-6 bg-primary' : 'w-2 bg-line-strong'}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
