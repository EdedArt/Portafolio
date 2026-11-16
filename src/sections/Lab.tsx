import { AnimatePresence, motion, useInView } from 'framer-motion'
import { ArrowDown, Pause, Play, Power, RotateCcw } from 'lucide-react'
import { lazy, Suspense, useCallback, useRef, useState, type KeyboardEvent } from 'react'
import { projects } from '../data/content'
import { useI18n } from '../i18n/I18nProvider'
import { hasWebGL, useIsMobile, useReducedMotion } from '../lib/hooks'
import { scrollToId } from '../lib/scroll'
import { useTheme } from '../theme/ThemeProvider'
import { PlatformIcon } from '../components/icons'
import { SectionHeading, btnPrimary } from '../components/ui/motion'
import type { DeviceKind, LabDevice } from '../components/lab/LabScene'

const LabScene = lazy(() => import('../components/lab/LabScene'))

const kinds: Record<string, DeviceKind> = {
  podcastcraft: 'laptop',
  autoclean: 'phone',
  elderguard: 'watch',
  plomoypaja: 'cartridge',
}
const devices: LabDevice[] = projects.map((p) => ({ kind: kinds[p.id], name: p.name, projectId: p.id }))

export function Lab() {
  const { t, f } = useI18n()
  const { theme } = useTheme()
  const mobile = useIsMobile()
  const reduce = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)
  const near = useInView(panelRef, { once: true, margin: '400px 0px' })
  const [webgl] = useState(() => hasWebGL())
  const [powered, setPowered] = useState<boolean[]>(() => devices.map(() => false))
  const [selected, setSelected] = useState(0)
  const [auto, setAuto] = useState(!reduce)
  const [announce, setAnnounce] = useState('')

  const count = powered.filter(Boolean).length
  const complete = count === devices.length

  const power = useCallback((i: number) => {
    setPowered((p) => (p[i] ? p : p.map((v, j) => (j === i ? true : v))))
    setAnnounce(`${devices[i].name}: ${t.lab.on}`)
  }, [t.lab.on])

  const select = useCallback((i: number) => setSelected(i), [])
  const interact = useCallback(() => setAuto(false), [])
  const view = useCallback((id: string) => scrollToId(`proyecto-${id}`), [])

  const reset = () => {
    setPowered(devices.map(() => false))
    setSelected(0)
    setAuto(!reduce)
  }

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      setAuto(false)
      const next = (selected + (e.key === 'ArrowRight' ? 1 : -1) + devices.length) % devices.length
      setSelected(next)
      setAnnounce(f(t.lab.selected, { nombre: devices[next].name }))
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setAuto(false)
      power(selected)
    }
  }

  const hudBtn = 'glass flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors hover:border-primary hover:text-primary-text'

  return (
    <section id="lab" aria-labelledby="lab-title" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="lab-title" kicker={t.lab.kicker} title={t.lab.title} accent={t.lab.titleAccent} subtitle={t.lab.subtitle} />

        <div
          ref={panelRef}
          className="glass relative h-[460px] overflow-hidden rounded-[2rem] shadow-soft md:h-[560px]"
          style={{ background: 'radial-gradient(ellipse at 50% 70%, color-mix(in srgb, var(--primary) 14%, transparent), transparent 70%), var(--glass)' }}
        >
          {/* Escena */}
          {webgl ? (
            <div
              tabIndex={0}
              role="group"
              aria-roledescription="3D"
              aria-label={t.lab.sceneLabel}
              onKeyDown={onKey}
              className="absolute inset-0 rounded-[2rem] focus-visible:outline-offset-[-4px]"
            >
              {near && (
                <Suspense fallback={<p className="grid size-full place-items-center font-mono text-sm text-muted">{t.lab.loading}</p>}>
                  <LabScene
                    devices={devices}
                    powered={powered}
                    selected={selected}
                    autoRotate={auto}
                    light={theme === 'light'}
                    viewLabel={t.lab.viewProject}
                    onSelect={select}
                    onPower={power}
                    onInteract={interact}
                    onView={view}
                    mobile={mobile}
                  />
                </Suspense>
              )}
            </div>
          ) : (
            <Fallback powered={powered} onPower={power} />
          )}

          {/* HUD superior */}
          <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-wrap items-start justify-between gap-2 p-3 sm:p-4">
            <div className="glass pointer-events-auto flex items-center gap-2 rounded-full px-3 py-2 font-mono text-xs">
              <Power size={13} className="text-primary-text" aria-hidden="true" />
              <span>{t.lab.powered}</span>
              <span className="font-bold text-primary-text tabular-nums">
                {count}/{devices.length}
              </span>
            </div>
            <div className="pointer-events-auto flex gap-2">
              {webgl && (
                <button type="button" onClick={() => setAuto((a) => !a)} aria-pressed={auto} aria-label={auto ? t.lab.autoRotateOn : t.lab.autoRotateOff} className={hudBtn}>
                  {auto ? <Pause size={13} aria-hidden="true" /> : <Play size={13} aria-hidden="true" />}
                  <span className="hidden sm:inline">{t.lab.autoRotate}</span>
                </button>
              )}
              <button type="button" onClick={reset} aria-label={t.lab.resetLabel} className={hudBtn}>
                <RotateCcw size={13} aria-hidden="true" />
                <span className="hidden sm:inline">{t.lab.reset}</span>
              </button>
            </div>
          </div>

          {/* HUD inferior */}
          {webgl && (
            <ul className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap justify-center gap-2 p-3 font-mono text-[11px] sm:p-4">
              {[
                [t.lab.controlsDrag, t.lab.controlsDragAction],
                [t.lab.controlsArrows, t.lab.controlsArrowsAction],
                [t.lab.controlsEnter, t.lab.controlsEnterAction],
              ].map(([k, a]) => (
                <li key={k} className="glass flex items-center gap-1.5 rounded-full px-2.5 py-1.5">
                  <kbd className="rounded bg-surface-2 px-1.5 py-0.5 font-semibold text-ink">{k}</kbd>
                  <span className="text-muted">= {a}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Ecosistema completo */}
          <AnimatePresence>
            {complete && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20 }}
                className="glass absolute bottom-16 left-1/2 z-30 w-[min(92%,340px)] -translate-x-1/2 md:top-16 md:bottom-auto md:left-4 md:translate-x-0 rounded-3xl p-5 text-center shadow-soft"
                role="status"
              >
                <p className="font-display text-xl font-extrabold uppercase">{t.lab.completeTitle}</p>
                <p className="mt-1 font-mono text-xs text-primary-text">{t.lab.completeText}</p>
                <a href="#descargas" className={`${btnPrimary} mt-4 py-2.5`}>
                  <ArrowDown size={15} aria-hidden="true" />
                  {t.lab.completeCta}
                </a>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="sr-only" aria-live="polite">
            {announce}
          </p>
        </div>
      </div>
    </section>
  )
}

/** Respaldo sin WebGL: tarjetas en CSS 3D */
function Fallback({ powered, onPower }: { powered: boolean[]; onPower: (i: number) => void }) {
  const { t } = useI18n()
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-4 pt-16" style={{ perspective: 1000 }}>
      <p className="text-center text-sm text-muted">{t.lab.fallback}</p>
      <div className="grid w-full max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
        {projects.map((p, i) => (
          <motion.button
            key={p.id}
            type="button"
            onClick={() => onPower(i)}
            aria-pressed={powered[i]}
            whileHover={{ rotateY: 12, rotateX: -6, z: 30 }}
            animate={{ y: powered[i] ? -10 : 0 }}
            className={`flex aspect-[4/5] flex-col items-center justify-center gap-3 rounded-3xl border p-4 text-center transition-colors ${
              powered[i] ? 'border-primary bg-primary text-on-primary shadow-[0_20px_40px_-15px_var(--primary)]' : 'border-line bg-surface'
            }`}
          >
            <PlatformIcon platform={p.platform} size={36} />
            <span className="font-display font-extrabold">{p.name}</span>
            <span className="font-mono text-[10px] uppercase opacity-80">{powered[i] ? t.lab.on : t.lab.tap}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
