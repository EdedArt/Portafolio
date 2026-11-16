import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Check, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { Project } from '../data/content'
import { useI18n } from '../i18n/I18nProvider'
import { lockScroll } from '../lib/scroll'
import { GithubIcon, PlatformIcon } from './icons'
import { ProjectMockup } from './mockups/ProjectMockup'
import { btnGhost, btnPrimary } from './ui/motion'

export function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const { t, l, ll } = useI18n()
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const m = t.projects.modal

  useEffect(() => {
    if (!project) return
    const previous = document.activeElement as HTMLElement | null
    lockScroll(true)
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      // Trampa de foco
      if (e.key === 'Tab' && dialogRef.current) {
        const els = dialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), iframe, video, [tabindex]:not([tabindex="-1"])')
        if (!els.length) return
        const first = els[0]
        const last = els[els.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      lockScroll(false)
      previous?.focus()
    }
  }, [project, onClose])

  const h4 = 'mb-3 font-mono text-xs tracking-widest text-primary-text uppercase'

  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            data-lenis-prevent
            className="relative max-h-[92dvh] w-full max-w-4xl overflow-y-auto overscroll-contain rounded-t-[2rem] border border-line bg-surface shadow-2xl sm:rounded-[2rem]"
            initial={{ y: 60, opacity: 0, rotateX: 8, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, rotateX: 0, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            style={{ transformPerspective: 1200 }}
          >
            <div className="sticky top-0 z-20 flex h-0 justify-end">
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label={m.close}
                className="mt-4 mr-4 grid size-11 shrink-0 place-items-center rounded-full bg-black/60 text-white backdrop-blur transition-colors hover:bg-primary"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <div className="relative h-[260px] overflow-hidden bg-gradient-to-br from-[#2a0a10] via-[#170c10] to-[#0d0809] sm:h-[340px]">
              <ProjectMockup id={project.id} name={project.name} className="size-full" />
            </div>

            <div className="p-6 sm:p-10">
              <p className="kicker flex items-center gap-2">
                <PlatformIcon platform={project.platform} size={14} /> {l(project.platformLabel)} · {l(project.requirements)}
              </p>
              <h2 id="modal-title" className="mt-2 font-display text-4xl font-extrabold tracking-tight uppercase sm:text-5xl">
                {project.name}
              </h2>
              <p className="mt-1 font-serif text-2xl text-primary-text italic">{l(project.tagline)}</p>
              <p className="mt-4 leading-relaxed text-muted">{l(project.description)}</p>

              {(project.video || project.images?.length) && (
                <div className="mt-8">
                  <h3 className={h4}>{m.gallery}</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {project.video &&
                      (/\.(mp4|webm)$/i.test(project.video) ? (
                        <video src={project.video} controls preload="metadata" className="w-full rounded-2xl sm:col-span-2" />
                      ) : (
                        <iframe
                          src={project.video}
                          title={project.name}
                          className="aspect-video w-full rounded-2xl sm:col-span-2"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          loading="lazy"
                        />
                      ))}
                    {project.images?.map((img) => (
                      <img key={img.src} src={img.src} alt={l(img.alt)} loading="lazy" className="w-full rounded-2xl border border-line" />
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 grid gap-8 md:grid-cols-[1.3fr_1fr]">
                <div>
                  <h3 className={h4}>{m.whatItDoes}</h3>
                  <ul className="space-y-2.5">
                    {ll(project.features).map((ft) => (
                      <li key={ft} className="flex gap-2.5 text-[15px] leading-snug">
                        <Check size={16} className="mt-0.5 shrink-0 text-primary-text" aria-hidden="true" />
                        {ft}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-7">
                  <div>
                    <h3 className={h4}>{m.role}</h3>
                    <p className="leading-relaxed">{l(project.role)}</p>
                    {project.team && (
                      <p className="mt-3 text-sm leading-relaxed text-muted">
                        <strong className="text-ink">{m.team}: </strong>
                        {l(project.team)}
                      </p>
                    )}
                  </div>
                  <div>
                    <h3 className={h4}>{m.tech}</h3>
                    <ul className="flex flex-wrap gap-1.5">
                      {project.tech.map((tech) => (
                        <li key={tech} className="rounded-full border border-line-strong px-2.5 py-1 font-mono text-[11px]">
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className={h4}>{m.requirements}</h3>
                    <p>{l(project.requirements)}</p>
                    <p className="mt-1 font-mono text-xs text-muted">
                      {m.installer}: {project.installer.file}
                      {project.installer.size && ` · ${m.size} ${l(project.installer.size)}`}
                      {project.installer.version && ` · ${m.version} ${project.installer.version}`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-3xl bg-surface-2 p-6">
                <h3 className={h4}>{m.install}</h3>
                <ol className="space-y-3">
                  {ll(project.installer.steps).map((s, i) => (
                    <li key={s} className="flex gap-3">
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary font-mono text-xs font-bold text-on-primary">{i + 1}</span>
                      <span className="pt-0.5">{s}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-8 flex flex-wrap gap-2.5">
                <a href={project.downloadUrl} target="_blank" rel="noopener noreferrer" className={btnPrimary}>
                  <PlatformIcon platform={project.platform} size={16} />
                  {t.projects.download}
                  <span className="sr-only"> {t.projects.newTab}</span>
                </a>
                <a href={project.codeUrl} target="_blank" rel="noopener noreferrer" className={btnGhost}>
                  <GithubIcon size={16} /> {t.projects.code} <ArrowUpRight size={14} aria-hidden="true" />
                  <span className="sr-only"> {t.projects.newTab}</span>
                </a>
                {project.extraCode?.map((x) => (
                  <a key={x.url} href={x.url} target="_blank" rel="noopener noreferrer" className={btnGhost}>
                    <GithubIcon size={16} /> {x.label ? l(x.label) : t.projects.code} <ArrowUpRight size={14} aria-hidden="true" />
                    <span className="sr-only"> {t.projects.newTab}</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
