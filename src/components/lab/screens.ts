import * as THREE from 'three'

/** Dibuja en un canvas 2D la "pantalla encendida" de cada proyecto (sin cargar imágenes ni fuentes externas) */
export function makeScreenTexture(kind: 'laptop' | 'phone' | 'watch' | 'cartridge', name: string): THREE.CanvasTexture {
  const w = kind === 'phone' ? 256 : 512
  const h = kind === 'phone' ? 512 : kind === 'watch' ? 512 : kind === 'cartridge' ? 384 : 320
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const g = c.getContext('2d')!
  const red = '#ff3b4e'

  if (kind === 'cartridge') {
    // Etiqueta estilo años 30
    g.fillStyle = '#efe9dc'
    g.fillRect(0, 0, w, h)
    g.fillStyle = '#111'
    for (let i = 0; i < 24; i++) {
      g.globalAlpha = 0.08
      g.beginPath()
      g.moveTo(w / 2, h / 2)
      g.arc(w / 2, h / 2, w, (i / 24) * Math.PI * 2, ((i + 0.5) / 24) * Math.PI * 2)
      g.fill()
    }
    g.globalAlpha = 1
    // Cerdito
    g.beginPath()
    g.ellipse(w / 2, h * 0.56, 70, 64, 0, 0, Math.PI * 2)
    g.fill()
    g.beginPath()
    g.ellipse(w / 2, h * 0.37, 120, 18, 0, 0, Math.PI * 2)
    g.fill()
    g.fillRect(w / 2 - 66, h * 0.22, 132, 60)
    g.fillStyle = '#efe9dc'
    g.beginPath()
    g.ellipse(w / 2, h * 0.6, 28, 18, 0, 0, Math.PI * 2)
    g.fill()
    g.fillStyle = '#111'
    g.font = 'italic 700 52px Georgia, serif'
    g.textAlign = 'center'
    g.fillText(name, w / 2, h * 0.92)
    return finish(c)
  }

  g.fillStyle = '#0d0809'
  g.fillRect(0, 0, w, h)
  const grad = g.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, Math.max(w, h) * 0.7)
  grad.addColorStop(0, 'rgba(255,59,78,0.35)')
  grad.addColorStop(1, 'rgba(255,59,78,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, w, h)

  g.textAlign = 'center'
  g.fillStyle = '#fff'

  if (kind === 'laptop') {
    // Formas de onda
    for (let t = 0; t < 3; t++) {
      const y = 90 + t * 60
      g.fillStyle = t === 0 ? red : t === 1 ? '#ff7a59' : '#d9cfd0'
      for (let i = 0; i < 70; i++) {
        const amp = Math.abs(Math.sin(i * 0.5 + t) * Math.cos(i * 0.17)) * 22 + 3
        g.fillRect(40 + i * 6, y - amp, 3, amp * 2)
      }
    }
    g.fillStyle = '#fff'
    g.fillRect(260, 50, 2, 190)
    g.font = '800 34px system-ui, sans-serif'
    g.fillText(name, w / 2, 290)
  } else if (kind === 'phone') {
    g.fillStyle = '#f8d038'
    roundRect(g, 38, 110, w - 76, 70, 10)
    g.fillStyle = '#111'
    g.font = '800 40px system-ui, sans-serif'
    g.fillText('NAR 482', w / 2, 160)
    g.fillStyle = 'rgba(255,255,255,.12)'
    roundRect(g, 38, 230, w - 76, 14, 7)
    g.fillStyle = red
    roundRect(g, 38, 230, (w - 76) * 0.7, 14, 7)
    ;['Remojo', 'Lavado', 'Secado'].forEach((p, i) => {
      g.fillStyle = i < 2 ? red : 'rgba(255,255,255,.25)'
      g.beginPath()
      g.arc(52, 290 + i * 40, 9, 0, Math.PI * 2)
      g.fill()
      g.fillStyle = '#fff'
      g.font = '600 22px system-ui, sans-serif'
      g.textAlign = 'left'
      g.fillText(p, 74, 298 + i * 40)
    })
    g.textAlign = 'center'
    g.font = '800 30px system-ui, sans-serif'
    g.fillText(name, w / 2, 70)
  } else {
    // Reloj
    g.strokeStyle = red
    g.lineWidth = 10
    g.beginPath()
    g.arc(w / 2, h / 2, w / 2 - 20, -Math.PI / 2, Math.PI * 1.1)
    g.stroke()
    g.font = '800 96px system-ui, sans-serif'
    g.fillText('12:28', w / 2, h / 2 + 10)
    g.strokeStyle = red
    g.lineWidth = 5
    g.beginPath()
    const y = h / 2 + 70
    g.moveTo(150, y)
    g.lineTo(220, y)
    g.lineTo(240, y - 40)
    g.lineTo(262, y + 34)
    g.lineTo(282, y)
    g.lineTo(360, y)
    g.stroke()
    g.fillStyle = red
    roundRect(g, w / 2 - 50, h / 2 + 120, 100, 40, 20)
    g.fillStyle = '#fff'
    g.font = '800 24px system-ui, sans-serif'
    g.fillText('SOS', w / 2, h / 2 + 148)
    g.font = '700 26px system-ui, sans-serif'
    g.fillText(name, w / 2, h / 2 - 90)
  }
  return finish(c)
}

function roundRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath()
  g.roundRect(x, y, w, h, r)
  g.fill()
}

function finish(c: HTMLCanvasElement) {
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}
