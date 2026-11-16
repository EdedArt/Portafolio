import { AnimatePresence, motion } from 'framer-motion'
import { Award, GraduationCap, Mic, Presentation, RefreshCw, Rocket, Shield, Watch } from 'lucide-react'
import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { achievements, skillGroups, spokenLanguages, type AchievementIcon, type SkillGroup } from '../data/content'
import { useI18n } from '../i18n/I18nProvider'
import { useFinePointer, useReducedMotion } from '../lib/hooks'
import { SectionHeading, card } from '../components/ui/motion'
import { statusStyle } from './About'

type Tab = 'stack' | 'languages' | 'achievements'
const TABS: Tab[] = ['stack', 'languages', 'achievements']

const achIcons: Record<AchievementIcon, typeof Award> = {
  graduation: GraduationCap,
  rocket: Rocket,
  watch: Watch,
  mic: Mic,
  shield: Shield,
  presentation: Presentation,
}

function FlipCard({ group, index }: { group: SkillGroup; index: number }) {
  const { t, l, ll } = useI18n()
  const fine = useFinePointer()
  const [flipped, setFlipped] = useState(false)
  const [hover, setHover] = useState(false)
  const isFlipped = flipped || (fine && hover)
  const backId = useId()

  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="h-[340px]"
      style={{ perspective: 1200 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        className="relative size-full preserve-3d transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
        style={{ transform: isFlipped ? 'rotateY(180deg)' : 'none' }}
      >
        {/* Frente */}
        <div className={`${card} absolute inset-0 flex flex-col p-6 [backface-visibility:hidden]`} aria-hidden={isFlipped}>
          <span className="font-mono text-xs text-muted">0{index + 1}</span>
          <h3 className="mt-2 font-display text-2xl font-extrabold">{l(group.title)}</h3>
          <ul className="mt-5 space-y-2.5">
            {group.items.map((it) => (
              <li key={it.name} className="flex items-center justify-between gap-2 text-sm">
                <span className="font-medium">{it.name}</span>
                <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusStyle[it.level]}`}>{t.skills.levels[it.level]}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setFlipped(true)}
            aria-controls={backId}
            aria-expanded={isFlipped}
            tabIndex={isFlipped ? -1 : 0}
            className="mt-auto flex items-center gap-1.5 self-start rounded-full text-xs font-medium text-primary-text"
          >
            <RefreshCw size={13} aria-hidden="true" /> {t.skills.flipHint}
          </button>
        </div>
        {/* Reverso */}
        <div
          id={backId}
          className="absolute inset-0 flex flex-col rounded-3xl bg-primary p-6 text-on-primary shadow-soft [backface-visibility:hidden] [transform:rotateY(180deg)]"
          aria-hidden={!isFlipped}
        >
          <h4 className="font-mono text-xs tracking-widest uppercase">{t.skills.usedIn}</h4>
          <p className="mt-1 font-display text-xl font-extrabold">{l(group.title)}</p>
          <ul className="mt-4 space-y-2 text-sm leading-snug">
            {ll(group.usedIn).map((u) => (
              <li key={u} className="flex gap-2">
                <span aria-hidden="true">→</span>
                {u}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => {
              setFlipped(false)
              setHover(false)
            }}
            tabIndex={isFlipped ? 0 : -1}
            className="mt-auto flex items-center gap-1.5 self-start text-xs font-semibold"
          >
            <RefreshCw size={13} aria-hidden="true" /> {l(group.title)}
          </button>
        </div>
      </div>
    </motion.li>
  )
}

export function Skills() {
  const { t, l } = useI18n()
  const reduce = useReducedMotion()
  const [tab, setTab] = useState<Tab>('stack')
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const base = useId()

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = TABS.indexOf(tab)
    let next = i
    if (e.key === 'ArrowRight') next = (i + 1) % TABS.length
    else if (e.key === 'ArrowLeft') next = (i - 1 + TABS.length) % TABS.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = TABS.length - 1
    else return
    e.preventDefault()
    setTab(TABS[next])
    tabRefs.current[next]?.focus()
  }

  return (
    <section id="habilidades" aria-labelledby="skills-title" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="skills-title" kicker={t.skills.kicker} title={t.skills.title} accent={t.skills.titleAccent} subtitle={t.skills.subtitle} />

        <div role="tablist" aria-label={t.skills.tabsLabel} onKeyDown={onKey} className="glass mb-10 inline-flex max-w-full flex-wrap gap-1 rounded-3xl p-1.5 sm:rounded-full">
          {TABS.map((k, i) => {
            const active = tab === k
            return (
              <button
                key={k}
                ref={(el) => {
                  tabRefs.current[i] = el
                }}
                role="tab"
                id={`${base}-tab-${k}`}
                aria-selected={active}
                aria-controls={`${base}-panel-${k}`}
                tabIndex={active ? 0 : -1}
                onClick={() => setTab(k)}
                className={`relative isolate rounded-full px-4 py-2 text-sm font-medium transition-colors sm:px-5 ${active ? 'text-on-primary' : 'text-muted hover:text-ink'}`}
              >
                {active && <motion.span layoutId="skills-pill" className="absolute inset-0 -z-10 rounded-full bg-primary" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                {t.skills.tabs[k]}
              </button>
            )
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            role="tabpanel"
            id={`${base}-panel-${tab}`}
            aria-labelledby={`${base}-tab-${tab}`}
            tabIndex={0}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl"
          >
            {tab === 'stack' && (
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {skillGroups.map((g, i) => (
                  <FlipCard key={i} group={g} index={i} />
                ))}
              </ul>
            )}

            {tab === 'languages' && (
              <ul className="grid gap-4 md:grid-cols-2">
                {spokenLanguages.map((lang) => (
                  <li key={lang.value} className={`${card} p-7`}>
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display text-3xl font-extrabold">{l(lang.name)}</h3>
                      <span className="font-mono text-sm text-primary-text">{l(lang.level)}</span>
                    </div>
                    <p className="mt-2 text-muted">{l(lang.note)}</p>
                    <div
                      className="mt-6 h-3 overflow-hidden rounded-full bg-surface-2"
                      role="meter"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={lang.value}
                      aria-label={`${l(lang.name)}: ${l(lang.level)}`}
                    >
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-[#ff7a59]"
                        initial={{ width: reduce ? `${lang.value}%` : 0 }}
                        animate={{ width: `${lang.value}%` }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                      />
                    </div>
                    <p className="mt-2 text-right font-mono text-xs text-muted">{lang.value}%</p>
                  </li>
                ))}
              </ul>
            )}

            {tab === 'achievements' && (
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {achievements.map((a, i) => {
                  const Icon = achIcons[a.icon]
                  return (
                    <motion.li
                      key={i}
                      initial={reduce ? false : { opacity: 0, rotateX: -30, y: 20 }}
                      animate={{ opacity: 1, rotateX: 0, y: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.5 }}
                      whileHover={{ y: -4 }}
                      className={`${card} flex items-start gap-4 p-6`}
                    >
                      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary-text">
                        <Icon size={22} aria-hidden="true" />
                      </span>
                      <div>
                        <h3 className="font-semibold leading-snug">{l(a.title)}</h3>
                        <p className="mt-1 font-mono text-xs text-muted">{l(a.meta)}</p>
                      </div>
                    </motion.li>
                  )
                })}
              </ul>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
