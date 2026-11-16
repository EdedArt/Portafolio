import { useEffect, useState } from 'react'
import { useTheme } from '../../theme/ThemeProvider'

/**
 * Imagen que cambia con el tema con un fundido suave.
 * Solo descarga la versión del otro tema cuando el usuario cambia de tema.
 */
export function ThemedImage({
  light,
  dark,
  width,
  height,
  className = 'relative',
  imgClassName = 'object-cover',
}: {
  light: string
  dark?: string
  width: number
  height: number
  className?: string
  imgClassName?: string
}) {
  const { theme } = useTheme()
  const want = theme === 'dark' && dark ? dark : light
  const [seen, setSeen] = useState<string[]>([want])

  useEffect(() => {
    setSeen((s) => (s.includes(want) ? s : [...s, want]))
  }, [want])

  return (
    <div className={className}>
      {seen.map((src) => (
        <img
          key={src}
          src={src}
          alt=""
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          draggable={false}
          className={`absolute inset-0 size-full transition-opacity duration-700 ease-out ${imgClassName} ${src === want ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
    </div>
  )
}
