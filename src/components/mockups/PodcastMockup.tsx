import { motion } from 'framer-motion'
import { Scissors, Sparkles } from 'lucide-react'
import { useMemo } from 'react'
import { useI18n } from '../../i18n/I18nProvider'

function Wave({ seed, bars = 48, color, active }: { seed: number; bars?: number; color: string; active: boolean }) {
  const heights = useMemo(
    () => Array.from({ length: bars }, (_, i) => 0.25 + Math.abs(Math.sin(i * 0.55 + seed) * Math.cos(i * 0.21 + seed * 2)) * 0.75),
    [bars, seed],
  )
  return (
    <div className="flex h-full items-center gap-[2px]">
      {heights.map((h, i) => (
        <motion.span
          key={i}
          className="w-full rounded-full"
          style={{ background: color, height: `${h * 100}%` }}
          animate={active ? { scaleY: [1, 0.55 + ((i * 7) % 5) / 10, 1] } : undefined}
          transition={{ duration: 1.4 + (i % 4) * 0.2, repeat: Infinity, ease: 'easeInOut', delay: (i % 6) * 0.08 }}
        />
      ))}
    </div>
  )
}

/** Ventana de Windows con editor multipista animado */
export function PodcastMockup({ active = true }: { active?: boolean }) {
  const { t } = useI18n()
  const m = t.projects.mockup
  const loop = active ? Infinity : 0
  return (
    <div className="group/mock relative size-full preserve-3d" style={{ perspective: 1000 }}>
      <div
        className="absolute inset-[6%] preserve-3d transition-transform duration-700 ease-out group-hover/mock:[transform:rotateX(14deg)_rotateY(-16deg)_rotateZ(2deg)]"
        style={{ transform: 'rotateX(8deg) rotateY(-10deg)' }}
      >
        {/* Capa base: ventana */}
        <div className="absolute inset-0 overflow-hidden rounded-xl border border-white/10 bg-[#141014] shadow-2xl">
          <div className="flex h-7 items-center justify-between border-b border-white/10 bg-[#1d171b] pl-3 text-[10px] text-white/70">
            <span className="flex items-center gap-1.5 font-mono">
              <span className="size-2 rounded-sm bg-[#ff3b4e]" /> PodcastCraft AI
            </span>
            <span className="flex h-full">
              <span className="grid w-8 place-items-center">—</span>
              <span className="grid w-8 place-items-center">▢</span>
              <span className="grid w-8 place-items-center bg-[#e11d2e]/80 text-white">✕</span>
            </span>
          </div>
        </div>

        {/* Capa carriles */}
        <div className="absolute inset-x-0 top-7 bottom-0 flex flex-col gap-2 p-3 pr-[34%] transition-transform duration-700 group-hover/mock:[transform:translateZ(40px)]">
          {/* regla */}
          <div className="flex justify-between font-mono text-[8px] text-white/40">
            {['00:00', '00:30', '01:00', '01:30', '02:00'].map((x) => (
              <span key={x}>{x}</span>
            ))}
          </div>
          {m.tracks.map((name, i) => (
            <div key={name} className="relative flex min-h-0 flex-1 items-center gap-2">
              <span className="w-10 shrink-0 truncate font-mono text-[8px] text-white/60 sm:w-12 sm:text-[9px]">{name}</span>
              <div className="relative h-full flex-1 overflow-hidden rounded-md bg-white/[0.04]">
                {i === 1 ? (
                  // Clip que se corta en dos (tijera)
                  <div className="absolute inset-y-1 left-[6%] right-[8%] flex">
                    <motion.div
                      className="h-full w-1/2 rounded-l bg-[#ff7a59]/25 px-1 ring-1 ring-[#ff7a59]/50"
                      animate={{ x: [0, 0, -6, -6, 0] }}
                      transition={{ duration: 4, repeat: loop, times: [0, 0.45, 0.55, 0.9, 1] }}
                    >
                      <Wave seed={i * 3 + 1} bars={22} color="#ff7a59" active={active} />
                    </motion.div>
                    <motion.div
                      className="h-full w-1/2 rounded-r bg-[#ff7a59]/25 px-1 ring-1 ring-[#ff7a59]/50"
                      animate={{ x: [0, 0, 6, 6, 0] }}
                      transition={{ duration: 4, repeat: loop, times: [0, 0.45, 0.55, 0.9, 1] }}
                    >
                      <Wave seed={i * 3 + 2} bars={22} color="#ff7a59" active={active} />
                    </motion.div>
                    <motion.span
                      className="absolute top-1/2 left-1/2 grid size-5 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-[#e11d2e]"
                      animate={{ opacity: [0, 1, 1, 0, 0], scale: [0.5, 1.15, 1, 0.6, 0.5], rotate: [0, -25, 15, 0, 0] }}
                      transition={{ duration: 4, repeat: loop, times: [0.3, 0.45, 0.55, 0.65, 1] }}
                    >
                      <Scissors size={11} />
                    </motion.span>
                  </div>
                ) : (
                  <div className={`absolute inset-y-1 ${i === 0 ? 'left-[2%] right-[12%]' : 'left-[30%] right-[20%]'} rounded px-1 ${i === 0 ? 'bg-[#ff3b4e]/20 ring-1 ring-[#ff3b4e]/50' : 'bg-white/10 ring-1 ring-white/20'}`}>
                    <Wave seed={i * 3} bars={i === 0 ? 46 : 28} color={i === 0 ? '#ff3b4e' : '#d9cfd0'} active={active} />
                  </div>
                )}
              </div>
            </div>
          ))}
          {/* Cabezal */}
          <div className="pointer-events-none absolute top-6 right-[34%] bottom-12 left-[4.25rem] sm:left-[4.75rem]">
            <motion.div
              className="absolute inset-y-0 w-px bg-white shadow-[0_0_8px_#fff]"
              animate={{ left: ['0%', '100%'] }}
              transition={{ duration: 6, repeat: loop, ease: 'linear' }}
            >
              <span className="absolute -top-1 -left-[3px] size-[7px] rotate-45 bg-white" />
            </motion.div>
          </div>
          {/* Exportar */}
          <div className="relative mt-1 h-7 w-32 overflow-hidden rounded-md bg-white/10 text-[10px] font-semibold text-white">
            <motion.span
              className="absolute inset-y-0 left-0 bg-[#e11d2e]"
              animate={{ width: ['0%', '100%', '100%'] }}
              transition={{ duration: 5, repeat: loop, times: [0, 0.8, 1] }}
            />
            <span className="relative grid h-full place-items-center">{m.export}</span>
          </div>
        </div>

        {/* Capa panel IA */}
        <div className="absolute top-10 right-3 bottom-3 w-[30%] rounded-lg border border-white/10 bg-[#1d171b]/95 p-2 transition-transform duration-700 group-hover/mock:[transform:translateZ(80px)]">
          <p className="flex items-center gap-1 text-[9px] font-semibold text-white">
            <Sparkles size={10} className="text-[#ff5a6a]" /> {m.ai}
          </p>
          <div className="mt-2 space-y-1.5">
            {[90, 70, 82, 55].map((w, i) => (
              <motion.span
                key={i}
                className="block h-1.5 rounded-full bg-white/15"
                style={{ width: `${w}%` }}
                animate={active ? { opacity: [0.4, 1, 0.4] } : undefined}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.25 }}
              />
            ))}
          </div>
          <p className="mt-2 rounded bg-[#e11d2e]/20 p-1.5 text-[8px] leading-tight text-[#ffb3ba]">{m.aiSuggestion}</p>
        </div>
      </div>
    </div>
  )
}
