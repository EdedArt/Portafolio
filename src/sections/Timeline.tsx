import { motion, useScroll, useSpring } from 'framer-motion'
import { Award, BookOpen, Briefcase, Check, Gamepad2, GraduationCap, Rocket } from 'lucide-react'
import { useRef } from 'react'
import { education, timeline, type TimelineKind } from '../data/content'
import { useI18n } from '../i18n/I18nProvider'
import { useReducedMotion } from '../lib/hooks'
import { FadeIn, SectionHeading, card } from '../components/ui/motion'

const icons: Record<TimelineKind, typeof Rocket> = {
  degree: GraduationCap,
  projects: Rocket,
  work: Briefcase,
  training: BookOpen,
  graduated: Award,
  origin: Gamepad2,
}

export function Timeline() {
  const { t, l, ll } = useI18n()
  const listRef = useRef<HTMLOListElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 0.75', 'end 0.6'] })
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  return (
    <section id="trayectoria" aria-labelledby="timeline-title" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="timeline-title" kicker={t.timeline.kicker} title={t.timeline.title} accent={t.timeline.titleAccent} subtitle={t.timeline.subtitle} />

        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <ol ref={listRef} className="relative space-y-8 pl-14 md:pl-16" style={{ perspective: 1000 }}>
            {/* Línea base y línea roja que se dibuja */}
            <span className="absolute top-2 bottom-2 left-[19px] w-[2px] bg-line-strong md:left-[23px]" aria-hidden="true" />
            <motion.span
              className="absolute top-2 bottom-2 left-[19px] w-[2px] origin-top bg-primary shadow-[0_0_10px_var(--primary)] md:left-[23px]"
              style={{ scaleY: reduce ? 1 : scaleY }}
              aria-hidden="true"
            />
            {timeline.map((item, i) => {
              const Icon = icons[item.kind]
              // "El origen" lleva nodo rojo sólido y tarjeta destacada
              const origin = item.kind === 'origin'
              return (
                <li key={i} className="relative">
                  <motion.span
                    className={`absolute top-1 -left-14 grid size-10 place-items-center rounded-full border-2 border-primary shadow-soft md:-left-16 md:size-12 ${
                      origin ? 'bg-primary text-on-primary shadow-[0_0_24px_-2px_var(--primary)]' : 'bg-surface text-primary-text'
                    }`}
                    initial={reduce ? false : { rotateY: -180, scale: 0.4, opacity: 0 }}
                    whileInView={{ rotateY: 0, scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: '0px 0px -20% 0px' }}
                    transition={{ type: 'spring', stiffness: 180, damping: 16 }}
                    aria-hidden="true"
                  >
                    <Icon size={18} />
                  </motion.span>
                  <motion.article
                    className={`${card} p-6 ${origin ? 'border-primary/40 bg-gradient-to-br from-primary/10 to-transparent' : ''}`}
                    initial={reduce ? false : { opacity: 0, x: 40, rotateY: -12 }}
                    whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                    viewport={{ once: true, margin: '0px 0px -15% 0px' }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-primary px-2.5 py-0.5 font-mono text-[10px] font-semibold tracking-widest text-on-primary">{l(item.tag)}</span>
                      <span className="font-mono text-xs text-muted">{l(item.date)}</span>
                    </div>
                    <h3 className="mt-3 font-display text-xl font-extrabold md:text-2xl">{l(item.title)}</h3>
                    {item.place && <p className="mt-1 text-sm font-medium text-primary-text">{l(item.place)}</p>}
                    {item.text && <p className="mt-2 leading-relaxed text-muted">{l(item.text)}</p>}
                  </motion.article>
                </li>
              )
            })}
          </ol>

          <FadeIn className="lg:sticky lg:top-28 lg:self-start">
            <aside aria-labelledby="edu-title" className={`${card} relative overflow-hidden p-7`}>
              <span className="absolute -top-10 -right-10 size-40 rounded-full bg-primary/15 blur-2xl" aria-hidden="true" />
              <span className="grid size-12 place-items-center rounded-2xl bg-primary text-on-primary">
                <GraduationCap size={22} aria-hidden="true" />
              </span>
              <h3 id="edu-title" className="kicker mt-5">
                {t.timeline.educationTitle}
              </h3>
              <p className="mt-2 font-display text-2xl font-extrabold">{l(education.degree)}</p>
              <p className="mt-1 text-muted">{l(education.school)}</p>
              <p className="mt-3 inline-block rounded-full border border-line-strong px-3 py-1 font-mono text-xs">{l(education.period)}</p>
              <ul className="mt-6 space-y-3 border-t border-line pt-6">
                {ll(education.bullets).map((b) => (
                  <li key={b} className="flex gap-2.5">
                    <Check size={17} className="mt-0.5 shrink-0 text-primary-text" aria-hidden="true" />
                    {b}
                  </li>
                ))}
              </ul>
            </aside>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
