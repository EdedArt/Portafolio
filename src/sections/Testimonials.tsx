import { Quote } from 'lucide-react'
import { testimonials } from '../data/content'
import { useI18n } from '../i18n/I18nProvider'
import { FadeIn, SectionHeading, TiltCard, card } from '../components/ui/motion'

export function Testimonials() {
  const { t, l } = useI18n()
  return (
    <section id="referencias" aria-labelledby="testimonials-title" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="testimonials-title" kicker={t.testimonials.kicker} title={t.testimonials.title} accent={t.testimonials.titleAccent} subtitle={t.testimonials.subtitle} />
        <ul className="grid gap-5 md:grid-cols-3">
          {testimonials.map((tm, i) => {
            const name = tm.borrador || !tm.nombre ? l(tm.rol) : tm.nombre
            return (
              <li key={i} className="h-full">
                <FadeIn delay={i * 0.1} className="h-full">
                  <TiltCard max={8} className="h-full" innerClassName="rounded-3xl">
                    <figure className={`${card} relative flex h-full flex-col overflow-hidden p-7`}>
                      <Quote size={84} className="absolute -top-3 -right-2 rotate-180 text-primary/10" aria-hidden="true" strokeWidth={1.5} />
                      {tm.borrador && (
                        <span
                          title={t.testimonials.draftNote}
                          className="mb-4 w-fit rounded-full border border-dashed border-primary/50 px-2.5 py-0.5 font-mono text-[10px] tracking-widest text-primary-text uppercase"
                        >
                          {t.testimonials.draft}
                          <span className="sr-only">: {t.testimonials.draftNote}</span>
                        </span>
                      )}
                      <span className="font-serif text-6xl leading-none text-primary-text" aria-hidden="true">
                        “
                      </span>
                      <blockquote className="-mt-4 flex-1 text-[1.02rem] leading-relaxed">{l(tm.texto)}</blockquote>
                      <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary font-display text-sm font-extrabold text-on-primary" aria-hidden="true">
                          {tm.iniciales}
                        </span>
                        <span className="min-w-0">
                          <span className="block font-semibold leading-tight">{name}</span>
                          {!tm.borrador && tm.nombre && <span className="block text-sm text-muted">{l(tm.rol)}</span>}
                        </span>
                      </figcaption>
                      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Hashtags">
                        {tm.hashtags.map((h) => (
                          <li key={h} className="rounded-full bg-surface-2 px-2.5 py-1 font-mono text-[11px] text-muted">
                            {h}
                          </li>
                        ))}
                      </ul>
                    </figure>
                  </TiltCard>
                </FadeIn>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
