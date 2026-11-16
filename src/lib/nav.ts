import type { Dict } from '../i18n/es'

export const SECTIONS = [
  { id: 'inicio', key: 'home' },
  { id: 'sobre-mi', key: 'about' },
  { id: 'proyectos', key: 'projects' },
  { id: 'lab', key: 'lab' },
  { id: 'referencias', key: 'testimonials' },
  { id: 'trayectoria', key: 'timeline' },
  { id: 'habilidades', key: 'skills' },
  { id: 'contacto', key: 'contact' },
] as const satisfies readonly { id: string; key: keyof Dict['nav'] }[]

export const SECTION_IDS: string[] = SECTIONS.map((s) => s.id)
