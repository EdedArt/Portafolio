import { Background } from './components/layout/Background'
import { Cursor } from './components/layout/Cursor'
import { Header } from './components/layout/Header'
import { ScrollProgress } from './components/layout/ScrollProgress'
import { useI18n } from './i18n/I18nProvider'
import { SECTIONS } from './lib/nav'
import { SmoothScroll } from './lib/scroll'
import { Hero } from './sections/Hero'

export default function App() {
  const { t } = useI18n()
  return (
    <SmoothScroll>
      <a
        href="#contenido"
        className="fixed top-3 left-3 z-[70] -translate-y-24 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary focus:translate-y-0"
      >
        {t.meta.skip}
      </a>
      <Background />
      <ScrollProgress />
      <Cursor />
      <Header />
      <main id="contenido" className="overflow-x-clip">
        <Hero />
        {SECTIONS.filter((s) => s.id !== 'inicio').map((s) => (
          <section key={s.id} id={s.id} className="grid min-h-screen place-items-center">
            <h2 className="font-display text-6xl font-extrabold uppercase">{t.nav[s.key]}</h2>
          </section>
        ))}
      </main>
    </SmoothScroll>
  )
}
