import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { Accessibility, GraduationCap, Heart, Languages, Layers, MapPin, Sparkles } from 'lucide-react'
import { useRef } from 'react'
import { tools, type ToolStatus } from '../data/content'
import { useI18n } from '../i18n/I18nProvider'
import { useReducedMotion } from '../lib/hooks'
import { FadeIn, SectionHeading, TiltCard, card } from '../components/ui/motion'

export const statusStyle: Record<ToolStatus, string> = {
  production: 'bg-primary/10 text-primary-text border-primary/25',
  projects: 'bg-surface-2 text-ink border-line-strong',
  learning: 'bg-transparent text-muted border-dashed border-line-strong',
}

function ScrollWord({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  return (
    <motion.span style={{ opacity }} className="inline">
      {word}{' '}
    </motion.span>
  )
}

function ScrollStatement({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const words = text.split(' ')
  if (reduce) {
    return <p className="font-display text-[clamp(1.6rem,4vw,3rem)] leading-[1.12] font-extrabold tracking-tight">{text}</p>
  }
  return (
    <p ref={ref} className="font-display text-[clamp(1.6rem,4vw,3rem)] leading-[1.12] font-extrabold tracking-tight">
      {words.map((w, i) => {
        const start = i / words.length
        const accent = /^(Pasto|instalar|computador|celular|reloj|juego\.?|computer|phone|watch|game\.?|install:?)[,.:]?$/i.test(w)
        return accent ? (
          <span key={i} className="text-primary-text">
            <ScrollWord word={w} progress={scrollYProgress} range={[start, start + 1 / words.length]} />
          </span>
        ) : (
          <ScrollWord key={i} word={w} progress={scrollYProgress} range={[start, start + 1 / words.length]} />
        )
      })}
    </p>
  )
}

export function About() {
  const { t, f, l } = useI18n()
  const info = [
    { icon: MapPin, ...t.about.cards.location },
    { icon: GraduationCap, ...t.about.cards.education },
    { icon: Heart, ...t.about.cards.passions },
    { icon: Languages, ...t.about.cards.languages },
  ]
  const focusIcons = [Layers, Accessibility, Sparkles]

  return (
    <section id="sobre-mi" aria-labelledby="about-title" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="about-title" kicker={f(t.about.kicker)} title={t.about.title} accent={t.about.titleAccent} subtitle={t.about.subtitle} />

        <div className="mb-20 max-w-5xl md:mb-28">
          <ScrollStatement text={f(t.about.statement)} />
        </div>

        {/* Bento */}
        <div className="grid gap-4 md:grid-cols-4 md:grid-rows-2">
          <FadeIn className="md:col-span-2 md:row-span-2">
            <TiltCard max={5} className="h-full" innerClassName="rounded-3xl">
              <article className={`${card} flex h-full flex-col justify-between gap-8 p-7 md:p-9`}>
                <div>
                  <p className="kicker mb-4">{t.about.bioTitle}</p>
                  <p className="text-[1.05rem] leading-relaxed text-ink/90">{t.about.bio}</p>
                </div>
                <p className="font-serif text-4xl text-primary-text italic md:text-5xl">{t.about.bioClose}</p>
              </article>
            </TiltCard>
          </FadeIn>
          {info.map((c, i) => (
            <FadeIn key={c.label} delay={0.08 * (i + 1)}>
              <TiltCard max={8} className="h-full" innerClassName="rounded-3xl">
                <div className={`${card} flex h-full flex-col gap-4 p-6`}>
                  <span className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary-text">
                    <c.icon size={20} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-mono text-xs tracking-widest text-muted uppercase">{c.label}</h3>
                    <p className="mt-1.5 font-semibold leading-snug">{c.value}</p>
                  </div>
                </div>
              </TiltCard>
            </FadeIn>
          ))}
        </div>

        {/* Qué puedo hacer */}
        <div className="mt-24 md:mt-32">
          <FadeIn>
            <p className="kicker mb-3">{t.about.focusKicker}</p>
            <h3 className="font-display text-3xl font-extrabold tracking-tight uppercase md:text-5xl">
              {t.about.focusTitle}{' '}
              <span className="font-serif font-normal tracking-normal text-primary-text normal-case italic">{t.about.focusTitleAccent}</span>
            </h3>
          </FadeIn>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {t.about.focus.map((fc, i) => {
              const Icon = focusIcons[i]
              return (
                <FadeIn key={fc.title} delay={0.1 * i}>
                  <TiltCard max={10} className="h-full" innerClassName="rounded-3xl">
                    <article className={`${card} group relative h-full overflow-hidden p-7`}>
                      <span className="absolute -top-6 -right-2 font-display text-[7rem] leading-none font-extrabold text-primary/[0.07]" aria-hidden="true">
                        0{i + 1}
                      </span>
                      <span className="grid size-12 place-items-center rounded-2xl bg-primary text-on-primary shadow-[0_10px_30px_-10px_var(--primary)]" style={{ transform: 'translateZ(40px)' }}>
                        <Icon size={22} aria-hidden="true" />
                      </span>
                      <h4 className="mt-6 font-display text-2xl font-extrabold">{fc.title}</h4>
                      <p className="mt-3 leading-relaxed text-muted">{fc.text}</p>
                    </article>
                  </TiltCard>
                </FadeIn>
              )
            })}
          </div>
        </div>

        {/* Herramientas */}
        <div className="mt-24 md:mt-32">
          <FadeIn>
            <p className="kicker mb-3">{t.about.toolsKicker}</p>
            <h3 className="font-display text-3xl font-extrabold tracking-tight uppercase md:text-5xl">
              {t.about.toolsTitle}{' '}
              <span className="font-serif font-normal tracking-normal text-primary-text normal-case italic">{t.about.toolsTitleAccent}</span>
            </h3>
          </FadeIn>
          <ul className="mt-10 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 lg:grid-cols-4">
            {tools.map((tool, i) => (
              <motion.li
                key={tool.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -5% 0px' }}
                transition={{ delay: (i % 4) * 0.06, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className={`${card} flex flex-col gap-3 p-5`}
              >
                <span className="font-mono text-[11px] tracking-widest text-muted uppercase">{l(tool.category)}</span>
                <span className="font-semibold leading-snug">{tool.name}</span>
                <span className={`mt-auto w-fit rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${statusStyle[tool.status]}`}>
                  {t.skills.levels[tool.status]}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
