import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { ArrowUpRight, Download, Info } from 'lucide-react'
import { useState } from 'react'
import { projects, type Platform, type Project } from '../data/content'
import { useI18n } from '../i18n/I18nProvider'
import { GithubIcon, PlatformIcon } from '../components/icons'
import { ProjectMockup } from '../components/mockups/ProjectMockup'
import { ProjectModal } from '../components/ProjectModal'
import { Magnetic, SectionHeading, TiltCard, btnGhost, btnPrimary } from '../components/ui/motion'

type Filter = 'all' | Platform
const FILTERS: Filter[] = ['all', 'desktop', 'mobile', 'watch', 'game']

const visualBg: Record<string, string> = {
  podcastcraft: 'from-[#2a0a10] via-[#170c10] to-[#0d0809]',
  autoclean: 'from-[#ffe1e4] via-[#fff3f1] to-[#f6ece9] dark:from-[#2a0c12] dark:via-[#160e10] dark:to-[#0d0809]',
  elderguard: 'from-[#f5e9e7] via-[#fffaf8] to-[#ffe4e7] dark:from-[#1a0e11] dark:via-[#120c0e] dark:to-[#2a0a10]',
  plomoypaja: 'from-[#d9d3c7] via-[#efeae0] to-[#bfb8aa] dark:from-[#2a2724] dark:via-[#1a1817] dark:to-[#0f0e0d]',
}

export function Projects() {
  const { t, l } = useI18n()
  const [filter, setFilter] = useState<Filter>('all')
  const [open, setOpen] = useState<Project | null>(null)
  const list = projects.filter((p) => filter === 'all' || p.platform === filter)

  return (
    <section id="proyectos" aria-labelledby="projects-title" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="projects-title" kicker={t.projects.kicker} title={t.projects.title} accent={t.projects.titleAccent} subtitle={t.projects.subtitle} />

        <LayoutGroup id="project-filters">
          <div role="group" aria-label={t.projects.filtersLabel} className="glass mb-12 inline-flex max-w-full flex-wrap gap-1 rounded-3xl p-1.5 sm:rounded-full">
            {FILTERS.map((fl) => {
              const isActive = filter === fl
              return (
                <button
                  key={fl}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setFilter(fl)}
                  className={`relative isolate flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'text-on-primary' : 'text-muted hover:text-ink'
                  }`}
                >
                  {isActive && (
                    <motion.span layoutId="filter-pill" className="absolute inset-0 -z-10 rounded-full bg-primary" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
                  )}
                  {fl !== 'all' && <PlatformIcon platform={fl} size={15} />}
                  {t.projects.filters[fl]}
                </button>
              )
            })}
          </div>
        </LayoutGroup>

        <motion.ul layout className="flex flex-col gap-10 md:gap-14">
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((p, i) => {
              const reversed = i % 2 === 1
              return (
                <motion.li
                  key={p.id}
                  id={`proyecto-${p.id}`}
                  layout
                  initial={{ opacity: 0, y: 40, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="scroll-mt-28"
                >
                  <article
                    aria-labelledby={`p-${p.id}-title`}
                    className="grid items-stretch gap-6 rounded-[2rem] border border-line bg-surface/70 p-3 shadow-soft backdrop-blur-sm sm:p-4 lg:grid-cols-2 lg:gap-10"
                  >
                    {/* Visual */}
                    <TiltCard max={6} className={reversed ? 'lg:order-2' : ''} innerClassName="rounded-[1.5rem]">
                      <div className={`relative h-[300px] overflow-hidden rounded-[1.5rem] bg-gradient-to-br sm:h-[380px] lg:h-full lg:min-h-[440px] ${visualBg[p.id]}`}>
                        <span className="absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1 font-mono text-[11px] text-white backdrop-blur">
                          <PlatformIcon platform={p.platform} size={13} /> {l(p.platformLabel)}
                        </span>
                        <span className="absolute right-5 bottom-3 z-10 font-display text-6xl font-extrabold text-black/10 dark:text-white/10" aria-hidden="true">
                          0{projects.indexOf(p) + 1}
                        </span>
                        <ProjectMockup id={p.id} name={p.name} className="size-full" />
                      </div>
                    </TiltCard>

                    {/* Texto */}
                    <div className="flex flex-col justify-center px-3 pb-4 sm:px-4 lg:py-8 lg:pr-8">
                      <p className="kicker flex items-center gap-2">
                        <PlatformIcon platform={p.platform} size={14} />
                        {l(p.platformLabel)} · {l(p.requirements)}
                      </p>
                      <h3 id={`p-${p.id}-title`} className="mt-3 font-display text-4xl font-extrabold tracking-tight uppercase md:text-5xl">
                        {p.name}
                      </h3>
                      <p className="mt-2 font-serif text-2xl text-primary-text italic">{l(p.tagline)}</p>
                      <p className="mt-4 leading-relaxed text-muted">{l(p.description)}</p>
                      <ul className="mt-5 flex flex-wrap gap-1.5" aria-label={t.projects.modal.tech}>
                        {p.tech.slice(0, 8).map((tech) => (
                          <li key={tech} className="rounded-full border border-line-strong px-2.5 py-1 font-mono text-[11px]">
                            {tech}
                          </li>
                        ))}
                        {p.tech.length > 8 && <li className="rounded-full px-2 py-1 font-mono text-[11px] text-muted">+{p.tech.length - 8}</li>}
                      </ul>
                      <div className="mt-7 flex flex-wrap gap-2.5">
                        <Magnetic strength={0.2}>
                          <a href={p.downloadUrl} target="_blank" rel="noopener noreferrer" className={btnPrimary}>
                            <PlatformIcon platform={p.platform} size={16} />
                            {t.projects.download}
                            <span className="sr-only"> {p.name} {t.projects.newTab}</span>
                          </a>
                        </Magnetic>
                        <button type="button" onClick={() => setOpen(p)} className={btnGhost} aria-haspopup="dialog">
                          <Info size={16} aria-hidden="true" />
                          {t.projects.details}
                          <span className="sr-only">: {p.name}</span>
                        </button>
                        <a href={p.codeUrl} target="_blank" rel="noopener noreferrer" className={btnGhost}>
                          <GithubIcon size={16} />
                          {t.projects.code}
                          <ArrowUpRight size={14} aria-hidden="true" />
                          <span className="sr-only"> {p.name} {t.projects.newTab}</span>
                        </a>
                      </div>
                      <p className="mt-4 flex items-center gap-1.5 font-mono text-[11px] text-muted">
                        <Download size={12} aria-hidden="true" /> {p.installer.file}
                        {p.installer.size && ` · ${l(p.installer.size)}`}
                        {p.installer.version && ` · v${p.installer.version}`}
                      </p>
                    </div>
                  </article>
                </motion.li>
              )
            })}
          </AnimatePresence>
        </motion.ul>
      </div>

      <ProjectModal project={open} onClose={() => setOpen(null)} />
    </section>
  )
}
