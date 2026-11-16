import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useFinePointer } from '../../lib/hooks'

const INTERACTIVE = 'a, button, [role="button"], [role="tab"], input, textarea, select, label, [data-cursor]'

/** Cursor de anillo + punto. Solo se monta en dispositivos con mouse. */
export function Cursor() {
  const fine = useFinePointer()
  if (!fine) return null
  return <CursorInner />
}

function CursorInner() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const rx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.6 })
  const ry = useSpring(y, { stiffness: 500, damping: 40, mass: 0.6 })
  const [hover, setHover] = useState(false)
  const [down, setDown] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    document.documentElement.classList.add('has-custom-cursor')
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
      const target = e.target as Element | null
      setHover(!!target?.closest?.(INTERACTIVE))
    }
    const leave = () => setVisible(false)
    const pdown = () => setDown(true)
    const pup = () => setDown(false)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', pdown)
    window.addEventListener('pointerup', pup)
    document.documentElement.addEventListener('mouseleave', leave)
    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', pdown)
      window.removeEventListener('pointerup', pup)
      document.documentElement.removeEventListener('mouseleave', leave)
    }
  }, [x, y])

  const size = hover ? 56 : 32
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]" style={{ opacity: visible ? 1 : 0 }}>
      <motion.div
        className="absolute top-0 left-0 rounded-full border-2 border-primary"
        style={{ x: rx, y: ry, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: size,
          height: size,
          scale: down ? 0.85 : 1,
          backgroundColor: hover ? 'color-mix(in srgb, var(--primary) 14%, transparent)' : 'rgba(0,0,0,0)',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      />
      <motion.div
        className="absolute top-0 left-0 size-1.5 rounded-full bg-primary"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
        animate={{ scale: hover ? 0 : 1 }}
      />
    </div>
  )
}
