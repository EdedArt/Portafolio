import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { es, type Dict } from './es'
import { en } from './en'
import { getAge } from '../lib/age'

export type Lang = 'es' | 'en'
/** Texto bilingüe usado en src/data/content.ts */
export type L = { es: string; en: string }
export type LList = { es: string[]; en: string[] }

const dicts: Record<Lang, Dict> = { es, en }

interface I18nCtx {
  lang: Lang
  t: Dict
  setLang: (l: Lang) => void
  toggleLang: () => void
  /** Elige el idioma activo de un texto bilingüe */
  l: (v: L) => string
  ll: (v: LList) => string[]
  /** Reemplaza {edad}, {año} y otros marcadores */
  f: (s: string, vars?: Record<string, string | number>) => string
  age: number
}

const Ctx = createContext<I18nCtx | null>(null)

function readInitial(): Lang {
  try {
    const saved = localStorage.getItem('lang')
    if (saved === 'en' || saved === 'es') return saved
  } catch {
    /* sin almacenamiento */
  }
  return 'es'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitial)
  const age = getAge()

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = dicts[lang].meta.title
    try {
      localStorage.setItem('lang', lang)
    } catch {
      /* sin almacenamiento */
    }
  }, [lang])

  const setLang = useCallback((l: Lang) => setLangState(l), [])
  const toggleLang = useCallback(() => setLangState((l) => (l === 'es' ? 'en' : 'es')), [])

  const value = useMemo<I18nCtx>(() => {
    const base: Record<string, string | number> = { edad: age, año: new Date().getFullYear() }
    return {
      lang,
      t: dicts[lang],
      setLang,
      toggleLang,
      l: (v) => v[lang],
      ll: (v) => v[lang],
      f: (s, vars) => {
        const all = { ...base, ...vars }
        return s.replace(/\{(\w+|año)\}/g, (m, k: string) => (k in all ? String(all[k]) : m))
      },
      age,
    }
  }, [lang, age, setLang, toggleLang])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useI18n() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useI18n debe usarse dentro de I18nProvider')
  return ctx
}
