import { ArrowUp, Download, Mail, MapPin } from 'lucide-react'
import { CV_URL, EMAIL, GITHUB_URL, LINKEDIN_URL, projects } from '../../data/content'
import { useI18n } from '../../i18n/I18nProvider'
import { SECTIONS } from '../../lib/nav'
import { scrollToTop } from '../../lib/scroll'
import { GithubIcon, LinkedinIcon, Monogram, PlatformIcon } from '../icons'
import { Magnetic } from '../ui/motion'

export function Footer() {
  const { t, f, l } = useI18n()
  const h = 'mb-4 font-mono text-xs tracking-widest text-primary-text uppercase'
  const link = 'text-muted transition-colors hover:text-ink'

  return (
    <footer className="relative mt-10 border-t border-line bg-surface/60 backdrop-blur-md">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.4fr_1fr_1.3fr_1.1fr] lg:px-8">
        {/* Marca */}
        <div>
          <div className="flex items-center gap-3">
            <Monogram />
            <div className="leading-tight">
              <p className="font-display text-lg font-extrabold">Edgar Arteaga</p>
              <p className="font-mono text-[11px] text-muted">{t.header.role}</p>
            </div>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{t.footer.description}</p>
          <div className="mt-5 flex gap-2">
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label={t.hero.social.github} className="grid size-10 place-items-center rounded-full border border-line hover:border-primary hover:text-primary-text">
              <GithubIcon size={17} />
            </a>
            {LINKEDIN_URL && (
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label={t.hero.social.linkedin} className="grid size-10 place-items-center rounded-full border border-line hover:border-primary hover:text-primary-text">
                <LinkedinIcon size={17} />
              </a>
            )}
          </div>
        </div>

        {/* Navegación */}
        <nav aria-labelledby="footer-nav">
          <h2 id="footer-nav" className={h}>
            {t.footer.navTitle}
          </h2>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-1">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className={link}>
                  {t.nav[s.key]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Descargas */}
        <div id="descargas" className="scroll-mt-28">
          <h2 className={h}>{t.footer.downloadsTitle}</h2>
          <ul className="space-y-2.5 text-sm">
            {projects.map((p) => (
              <li key={p.id}>
                <a href={p.downloadUrl} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 rounded-2xl border border-line p-2.5 transition-colors hover:border-primary">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary-text">
                    <PlatformIcon platform={p.platform} size={17} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{p.name}</span>
                    <span className="block truncate font-mono text-[11px] text-muted">{l(p.requirements)}</span>
                  </span>
                  <Download size={15} className="text-muted group-hover:text-primary-text" aria-hidden="true" />
                  <span className="sr-only">{t.projects.newTab}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h2 className={h}>{t.footer.contactTitle}</h2>
          <ul className="space-y-3 text-sm">
            <li>
              <a href={`mailto:${EMAIL}`} className={`${link} flex items-start gap-2 break-all`}>
                <Mail size={15} className="mt-0.5 shrink-0" aria-hidden="true" /> {EMAIL}
              </a>
            </li>
            <li className="flex items-center gap-2 text-muted">
              <MapPin size={15} aria-hidden="true" /> {t.contact.location}
            </li>
            <li>
              <a href={CV_URL} download className={`${link} flex items-center gap-2`}>
                <Download size={15} aria-hidden="true" /> {t.header.cvLabel}
              </a>
            </li>
          </ul>
          <Magnetic className="mt-6">
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-on-primary shadow-[0_10px_30px_-10px_var(--primary)]"
            >
              <ArrowUp size={16} aria-hidden="true" /> {t.footer.backToTop}
            </button>
          </Magnetic>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>{f(t.footer.rights)}</p>
          <p className="font-mono">{t.footer.place}</p>
        </div>
      </div>
    </footer>
  )
}
