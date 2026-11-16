import { useTheme } from '../../theme/ThemeProvider'
import { ThemedImage } from './ThemedImage'

/*
 * Posiciones de la capa animada en % sobre la captura (1365×699):
 * la línea de tiempo va de x≈30 % a x≈75 % (y de 21 % a 90 %)
 * y el botón “Exportar MP3” está arriba a la derecha (x≈79–88 %, y≈2–6 %).
 */
const TIMELINE = { left: '30.3%', right: '25.2%', top: '20.8%', bottom: '9.4%' }
const EXPORT_BTN = { left: '78.9%', width: '9.5%', top: '2.1%', height: '4.1%' }

/** Captura real de PodcastCraft AI dentro de una ventana de Windows inclinada en 3D */
export function PodcastMockup({ active = true }: { active?: boolean }) {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  return (
    <div className="group/mock grid size-full place-items-center p-[6%]" style={{ perspective: 1100 }}>
      <div className="w-full max-w-[640px] transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] [transform:rotateX(9deg)_rotateY(-14deg)_rotateZ(1deg)] group-hover/mock:[transform:none]">
        <div className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-[0_30px_60px_-20px_rgba(0,0,0,.6)] dark:border-white/10 dark:bg-[#141118]">
          {/* Barra de título de Windows */}
          <div className="flex h-6 items-center justify-between bg-[#f1eef3] pl-2.5 text-[10px] text-[#2a2530] dark:bg-[#1f1b24] dark:text-white/80">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="size-2.5 rounded-[3px] bg-gradient-to-br from-[#a855f7] to-[#7c3aed]" />
              PodcastCraft AI
            </span>
            <span className="flex h-full">
              <span className="grid w-7 place-items-center">—</span>
              <span className="grid w-7 place-items-center">▢</span>
              <span className="grid w-7 place-items-center transition-colors group-hover/mock:bg-[#e11d2e] group-hover/mock:text-white">✕</span>
            </span>
          </div>
          <div className="relative aspect-[1365/699]">
            <ThemedImage
              light="/proyectos/podcastcraft-light.webp"
              dark="/proyectos/podcastcraft-dark.webp"
              width={1365}
              height={699}
              className="absolute inset-0"
            />
            {/* Cabezal de reproducción avanzando por la línea de tiempo */}
            <div className="pointer-events-none absolute" style={TIMELINE}>
              <span
                className={`absolute inset-y-0 w-[2px] rounded-full ${dark ? 'bg-white shadow-[0_0_8px_#fff]' : 'bg-[#e11d2e] shadow-[0_0_8px_#e11d2e]'} ${active ? 'animate-playhead' : ''}`}
                style={{ left: '8%' }}
              />
            </div>
            {/* Brillo que recorre “Exportar MP3” */}
            <div className="pointer-events-none absolute overflow-hidden rounded-[3px]" style={EXPORT_BTN}>
              <span className={`absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/70 to-transparent ${active ? 'animate-sheen' : 'opacity-0'}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
