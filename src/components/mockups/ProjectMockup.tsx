import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useI18n } from '../../i18n/I18nProvider'
import { useReducedMotion } from '../../lib/hooks'
import { AutoCleanMockup } from './AutoCleanMockup'
import { ElderGuardMockup } from './ElderGuardMockup'
import { PlomoMockup } from './PlomoMockup'
import { PodcastMockup } from './PodcastMockup'

const map = {
  podcastcraft: PodcastMockup,
  autoclean: AutoCleanMockup,
  elderguard: ElderGuardMockup,
  plomoypaja: PlomoMockup,
} as const

/** Mockup animado; solo se anima cuando está en pantalla y sin movimiento reducido */
export function ProjectMockup({ id, name, className = '' }: { id: string; name: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '100px' })
  const reduce = useReducedMotion()
  const { t, f } = useI18n()
  const Comp = map[id as keyof typeof map]
  if (!Comp) return null
  return (
    <div ref={ref} role="img" aria-label={f(t.projects.mockup.mockupLabel, { nombre: name })} className={`relative ${className}`}>
      <div aria-hidden="true" className="size-full">
        <Comp active={inView && !reduce} />
      </div>
    </div>
  )
}
