import { AnimatePresence, motion } from 'framer-motion'
import { Download, Menu, Moon, Sun, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CV_URL } from '../../data/content'
import { useI18n } from '../../i18n/I18nProvider'
import { useActiveSection } from '../../lib/hooks'
import { SECTIONS, SECTION_IDS } from '../../lib/nav'
import { lockScroll } from '../../lib/scroll'
import { useTheme } from '../../theme/ThemeProvider'
import { Monogram } from '../icons'

export function Header() {
  const { t, lang, toggleLang } = useI18n()
  const { theme, toggleTheme } = useTheme()
  const active = useActiveSection(SECTION_IDS)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    lockScroll(open)
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Cierra el menú móvil al pasar a escritorio
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = () => mq.matches && setOpen(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const iconBtn =
    'grid size-10 place-items-center rounded-full border border-line bg-surface/60 text-ink transition-colors hover:border-primary hover:text-primary-text'

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div
        className={`glass mx-auto flex max-w-7xl items-center justify-between gap-2 rounded-full py-2 pr-2 pl-2 transition-shadow duration-500 sm:pl-3 ${
          scrolled ? 'shadow-soft' : ''
        }`}
      >
        <a href="#inicio" className="flex min-w-0 items-center gap-3 rounded-full pr-2">
          <Monogram />
          <span className="sr-only min-w-0 leading-tight sm:not-sr-only sm:block lg:sr-only xl:not-sr-only xl:block">
            <span className="block truncate font-display text-[15px] font-extrabold">Edgar Arteaga</span>
            <span className="block truncate font-mono text-[11px] text-muted">{t.header.role}</span>
          </span>
          <span className="sr-only">, {t.header.homeLabel}</span>
        </a>

        <nav aria-label={t.header.mainNav} className="hidden lg:block">
          <ul className="flex items-center">
            {SECTIONS.map((s) => {
              const isActive = active === s.id
              return (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative isolate block rounded-full px-2.5 py-2 text-[13px] font-medium transition-colors xl:px-3 ${
                      isActive ? 'text-on-primary' : 'text-muted hover:text-ink'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-primary"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">{t.nav[s.key]}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={toggleLang}
            aria-label={`ES / EN: ${t.header.langLabel}`}
            className="h-10 rounded-full border border-line bg-surface/60 px-3 font-mono text-xs font-medium transition-colors hover:border-primary"
          >
            <span className={lang === 'es' ? 'text-primary-text' : 'text-muted'}>ES</span>
            <span className="px-1 text-muted">/</span>
            <span className={lang === 'en' ? 'text-primary-text' : 'text-muted'}>EN</span>
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? t.header.themeToLight : t.header.themeToDark}
            className={iconBtn}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.25 }}
              >
                {theme === 'dark' ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
              </motion.span>
            </AnimatePresence>
          </button>
          <a
            href={CV_URL}
            download
            aria-label={`${t.header.cv}: ${t.header.cvLabel}`}
            className="hidden h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-semibold text-on-primary transition-transform hover:scale-[1.04] min-[400px]:flex"
          >
            <Download size={15} aria-hidden="true" />
            {t.header.cv}
          </a>
          <button
            type="button"
            className={`${iconBtn} lg:hidden`}
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.header.closeMenu : t.header.openMenu}
          >
            {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label={t.header.mainNav}
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            data-lenis-prevent
            className="mx-auto mt-2 max-h-[calc(100dvh-6rem)] max-w-7xl overflow-y-auto rounded-3xl border border-line bg-surface/95 p-3 shadow-soft backdrop-blur-xl lg:hidden"
          >
            <ul className="grid gap-1 sm:grid-cols-2">
              {SECTIONS.map((s, i) => (
                <motion.li
                  key={s.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.03 * i }}
                >
                  <a
                    href={`#${s.id}`}
                    onClick={() => setOpen(false)}
                    aria-current={active === s.id ? 'true' : undefined}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3 font-display text-lg font-extrabold uppercase ${
                      active === s.id ? 'bg-primary text-on-primary' : 'hover:bg-surface-2'
                    }`}
                  >
                    {t.nav[s.key]}
                    <span className="font-mono text-xs font-normal opacity-70">0{i + 1}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <a
              href={CV_URL}
              download
              className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 font-semibold text-on-primary min-[400px]:hidden"
            >
              <Download size={16} aria-hidden="true" />
              {t.header.cvLabel}
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
