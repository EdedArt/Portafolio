import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { ArrowDownRight, Download, Mail, MapPin } from 'lucide-react'
import { COORDS, CV_URL, EMAIL, GITHUB_URL, LINKEDIN_URL, marquee } from '../data/content'
import { useI18n } from '../i18n/I18nProvider'
import { useReducedMotion } from '../lib/hooks'
import { GithubIcon, LinkedinIcon } from '../components/icons'
import { Counter, FadeIn, Magnetic, TiltCard, btnGhost, btnPrimary } from '../components/ui/motion'

function AnimatedWord({ word, delay, className }: { word: string; delay: number; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <span className={`block whitespace-nowrap ${className ?? ''}`} aria-hidden="true" style={{ perspective: 800 }}>
      {word.split('').map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block origin-bottom"
          initial={reduce ? false : { rotateX: -95, y: '35%', opacity: 0 }}
          animate={{ rotateX: 0, y: '0%', opacity: 1 }}
          transition={{ duration: 0.9, delay: delay + i * 0.045, ease: [0.22, 1, 0.36, 1] }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  )
}

export function Hero() {
  const { t, f } = useI18n()
  const social = 'grid size-11 place-items-center rounded-full border border-line bg-surface/70 text-ink transition-colors hover:border-primary hover:text-primary-text'

  return (
    <section id="inicio" aria-labelledby="hero-name" className="relative flex min-h-[100svh] flex-col pt-28 md:pt-32">
      <div className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.25fr_1fr] lg:gap-10 lg:px-8">
        {/* Texto */}
        <div className="min-w-0">
          <FadeIn y={12}>
            <p className="glass inline-flex max-w-full items-center gap-2.5 rounded-full px-3.5 py-1.5 text-xs font-medium sm:text-sm">
              <span className="relative size-2 shrink-0 rounded-full bg-primary animate-pulse-dot" aria-hidden="true" />
              <span className="truncate">{f(t.hero.chip)}</span>
            </p>
          </FadeIn>
          <FadeIn y={12} delay={0.08}>
            <p className="kicker mt-6">{t.hero.eyebrow}</p>
          </FadeIn>

          <h1
            id="hero-name"
            aria-label={t.hero.nameLabel}
            className="mt-4 font-display text-[clamp(3.1rem,16.5vw,6rem)] leading-[0.88] font-extrabold tracking-[-0.02em] uppercase lg:text-[clamp(4.2rem,7.4vw,7.4rem)]"
          >
            <span className="sr-only">{t.hero.nameLabel}</span>
            <AnimatedWord word="EDGAR" delay={0.15} />
            <AnimatedWord word="MAURICIO" delay={0.35} className="text-stroke" />
            <AnimatedWord word="ARTEAGA" delay={0.6} className="text-gradient pb-[0.06em]" />
          </h1>

          <FadeIn delay={0.9}>
            <p className="mt-6 max-w-xl font-serif text-2xl leading-snug sm:text-3xl">
              {t.hero.tagline} <em className="text-primary-text">{t.hero.taglineAccent}</em>
            </p>
          </FadeIn>
          <FadeIn delay={1}>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">{t.hero.bio}</p>
          </FadeIn>

          <FadeIn delay={1.1} className="mt-8 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a href={CV_URL} download className={btnPrimary}>
                <Download size={16} aria-hidden="true" />
                {t.hero.ctaCv}
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#proyectos" className={btnGhost}>
                {t.hero.ctaProjects}
                <ArrowDownRight size={16} aria-hidden="true" />
              </a>
            </Magnetic>
            <div className="flex items-center gap-2 sm:ml-2">
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label={t.hero.social.github} className={social}>
                <GithubIcon />
              </a>
              {LINKEDIN_URL && (
                <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label={t.hero.social.linkedin} className={social}>
                  <LinkedinIcon />
                </a>
              )}
              <a href={`mailto:${EMAIL}`} aria-label={t.hero.social.email} className={social}>
                <Mail size={18} aria-hidden="true" />
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={1.2}>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-6">
              {[
                { n: 4, s: '', label: t.hero.stats.apps },
                { n: 4, s: '', label: t.hero.stats.platforms },
                { n: 5, s: '.º', label: t.hero.stats.semester },
              ].map((st) => (
                <div key={st.label} className="flex flex-col-reverse">
                  <dt className="mt-1 text-xs text-muted sm:text-sm">{st.label}</dt>
                  <dd className="font-display text-4xl font-extrabold sm:text-5xl">
                    <Counter to={st.n} suffix={st.s} />
                  </dd>
                </div>
              ))}
            </dl>
          </FadeIn>
        </div>

        {/* Foto */}
        <motion.div
          className="relative mx-auto w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[440px]"
          initial={{ opacity: 0, y: 40, rotateY: -12 }}
          animate={{ opacity: 1, y: 0, rotateY: 0 }}
          transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <TiltCard max={12} innerClassName="rounded-[2rem]">
            <div className="glass relative overflow-hidden rounded-[2rem] p-3 shadow-soft">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-surface-2">
                <img
                  src="/edgar.jpg"
                  alt={t.hero.photoAlt}
                  width={900}
                  height={900}
                  fetchPriority="high"
                  className="size-full object-cover object-[50%_30%]"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" aria-hidden="true" />
                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-2 text-white">
                  <div>
                    <p className="font-mono text-[11px] tracking-[0.2em] opacity-80">{t.hero.from}</p>
                    <p className="flex items-center gap-1.5 font-display text-xl font-extrabold">
                      <MapPin size={16} aria-hidden="true" /> Pasto, CO
                    </p>
                  </div>
                  <p className="font-mono text-[11px] opacity-80">{COORDS}</p>
                </div>
              </div>
            </div>

            {/* Insignias flotantes a distinta profundidad */}
            <Badge className="-top-4 -left-1 sm:-left-8" z={70} delay={0}>
              <span className="font-mono text-[11px] font-medium tracking-wider text-primary-text">{f(t.hero.badgeUcc)}</span>
            </Badge>
            <Badge className="top-[38%] -right-1 sm:-right-10" z={110} delay={1.2}>
              <span className="text-lg" aria-hidden="true">⚽</span>
              <span className="leading-tight">
                <span className="block font-mono text-[10px] tracking-wider text-muted uppercase">{t.hero.badgePassionLabel}</span>
                <span className="block text-xs font-semibold">{t.hero.badgePassion}</span>
              </span>
            </Badge>
            <Badge className="bottom-20 -left-1 sm:-left-12" z={90} delay={2.1}>
              <span className="text-lg" aria-hidden="true">⌚</span>
              <span className="leading-tight">
                <span className="block font-mono text-[10px] tracking-wider text-muted uppercase">{t.hero.badgeGarminLabel}</span>
                <span className="block text-xs font-semibold">{t.hero.badgeGarmin}</span>
              </span>
            </Badge>
          </TiltCard>
        </motion.div>
      </div>

      <TechMarquee label={t.hero.marqueeLabel} />
    </section>
  )
}

function Badge({ children, className, z, delay }: { children: ReactNode; className: string; z: number; delay: number }) {
  return (
    <div className={`absolute z-10 ${className}`} style={{ transform: `translateZ(${z}px)` }}>
      <div
        className="glass flex items-center gap-2 rounded-2xl px-3 py-2 shadow-soft"
        style={{ animation: `float-y 5s ease-in-out ${delay}s infinite` }}
      >
        {children}
      </div>
    </div>
  )
}

function TechMarquee({ label }: { label: string }) {
  const items = [...marquee, ...marquee]
  return (
    <div className="mt-14 border-y border-line bg-surface/40 py-5 backdrop-blur-sm md:mt-16">
      <h2 className="sr-only">{label}</h2>
      <ul className="sr-only">
        {marquee.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>
      <div
        aria-hidden="true"
        className="group overflow-hidden"
        style={{
          maskImage: 'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)',
        }}
      >
        <div className="animate-marquee flex w-max gap-10 group-hover:[animation-play-state:paused]">
          {items.map((m, i) => (
            <span key={i} className="flex items-center gap-10 font-display text-2xl font-extrabold tracking-tight whitespace-nowrap uppercase md:text-3xl">
              {m}
              <span className="text-primary" aria-hidden="true">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
