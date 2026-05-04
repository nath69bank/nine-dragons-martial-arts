import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  r: number
  g: number
  b: number
  life: number
  maxLife: number
}

// Three particle types pulled from the logo palette
const TYPES = [
  { r: 201, g: 161, b: 74,  weight: 5 }, // warm gold
  { r: 232, g: 200, b: 112, weight: 2 }, // bright gold highlight
  { r: 26,  g: 79,  b: 200, weight: 4 }, // royal blue (dragon body)
  { r: 60,  g: 140, b: 255, weight: 2 }, // ice blue (dragon highlights)
  { r: 180, g: 210, b: 255, weight: 1 }, // pale blue shimmer
]

const TOTAL_WEIGHT = TYPES.reduce((s, t) => s + t.weight, 0)

function pickType() {
  let rand = Math.random() * TOTAL_WEIGHT
  for (const t of TYPES) {
    rand -= t.weight
    if (rand <= 0) return t
  }
  return TYPES[0]
}

export default function EmberCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const particles: Particle[] = []

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const spawn = () => {
      const type = pickType()
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 8,
        vx: (Math.random() - 0.5) * 1.6,
        vy: -(Math.random() * 2.0 + 0.5),
        size: Math.random() * 2.8 + 0.3,
        opacity: Math.random() * 0.55 + 0.35,
        r: type.r,
        g: type.g,
        b: type.b,
        life: 0,
        maxLife: Math.random() * 240 + 140,
      })
    }

    let frame = 0
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      frame++

      // Spawn rate: 2-3 particles per frame
      spawn()
      if (frame % 2 === 0) spawn()
      if (frame % 7 === 0) spawn()

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life++
        p.x += p.vx
        p.y += p.vy
        // Slight horizontal drift
        p.vx += (Math.random() - 0.5) * 0.045

        const fade = Math.pow(1 - p.life / p.maxLife, 0.75)
        const a = (p.opacity * fade).toFixed(3)

        // Soft glow: larger transparent circle behind the dot
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${(parseFloat(a) * 0.18).toFixed(3)})`
        ctx.fill()

        // Core dot
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${a})`
        ctx.fill()

        if (p.life >= p.maxLife || p.y < -12) particles.splice(i, 1)
      }

      animId = requestAnimationFrame(tick)
    }

    tick()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  )
}
