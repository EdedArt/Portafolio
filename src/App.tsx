import { Background } from './components/layout/Background'
import { Cursor } from './components/layout/Cursor'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { ScrollProgress } from './components/layout/ScrollProgress'
import { useI18n } from './i18n/I18nProvider'
import { SmoothScroll } from './lib/scroll'
import { About } from './sections/About'
import { Contact } from './sections/Contact'
import { Hero } from './sections/Hero'
import { Lab } from './sections/Lab'
import { Projects } from './sections/Projects'
import { Skills } from './sections/Skills'
import { Testimonials } from './sections/Testimonials'
import { Timeline } from './sections/Timeline'

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
        <About />
        <Projects />
        <Lab />
        <Testimonials />
        <Timeline />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </SmoothScroll>
  )
}
