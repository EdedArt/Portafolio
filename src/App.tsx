import { useTheme } from './theme/ThemeProvider'
import { useI18n } from './i18n/I18nProvider'

export default function App() {
  const { theme, toggleTheme } = useTheme()
  const { t, f, toggleLang } = useI18n()
  return (
    <main className="min-h-screen bg-bg p-8 text-ink">
      <h1 className="font-display text-5xl font-extrabold uppercase">
        Edgar <span className="font-serif font-normal normal-case italic text-primary-text">Arteaga</span>
      </h1>
      <button onClick={toggleTheme} className="mt-6 rounded-full bg-primary px-4 py-2 text-on-primary">
        {theme}
      </button>
      <button onClick={toggleLang} className="ml-3 rounded-full border border-line px-4 py-2">ES / EN</button>
      <p className="mt-4 text-muted">{f(t.hero.chip)}</p>
    </main>
  )
}
