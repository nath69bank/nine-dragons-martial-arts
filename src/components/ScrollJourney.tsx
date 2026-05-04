import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'

const CHAPTERS = [
  { id: 'philosophy',   label: 'The Code',     char: '心' },
  { id: 'mission',      label: 'The Way',      char: '道' },
  { id: 'disciplines',  label: 'The Path',     char: '路' },
  { id: 'instructors',  label: 'The Lineage',  char: '師' },
  { id: 'schedule',     label: 'The Dojo',     char: '館' },
  { id: 'gallery',      label: 'The Life',     char: '生' },
  { id: 'testimonials', label: 'The Warriors', char: '戰' },
  { id: 'join',         label: 'Your Turn',    char: '起' },
]

export default function ScrollJourney() {
  const [active, setActive] = useState('philosophy')
  const [visited, setVisited] = useState<Set<string>>(new Set())
  const [scrolled, setScrolled] = useState(false)
  const [hovering, setHovering] = useState<string | null>(null)
  const { scrollYProgress } = useScroll()
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  // Track which section is in view
  useEffect(() => {
    const observers: IntersectionObserver[] = []

    CHAPTERS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActive(id)
            setVisited(prev => new Set([...prev, id]))
          }
        },
        { threshold: 0.25, rootMargin: '-10% 0px -10% 0px' }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [])

  // Fade in after user starts scrolling
  useEffect(() => {
    const handler = () => { if (window.scrollY > 100) setScrolled(true) }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const activeIndex = CHAPTERS.findIndex(c => c.id === active)

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: scrolled ? 1 : 0, x: scrolled ? 0 : 16 }}
      transition={{ duration: 0.5 }}
      className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-0"
      style={{ pointerEvents: scrolled ? 'auto' : 'none' }}
    >
      {/* Track line */}
      <div className="relative flex flex-col items-center" style={{ height: CHAPTERS.length * 32 }}>
        {/* Background track */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px"
          style={{ background: 'rgba(201,161,74,0.1)' }}
        />
        {/* Filled progress */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 top-0 w-px origin-top"
          style={{
            height: lineHeight,
            background: 'linear-gradient(to bottom, rgba(201,161,74,0.6), rgba(201,161,74,0.2))',
          }}
        />

        {/* Chapter dots */}
        {CHAPTERS.map((chapter, i) => {
          const isActive = chapter.id === active
          const isPast = i < activeIndex
          const isHover = hovering === chapter.id

          return (
            <div
              key={chapter.id}
              className="relative flex items-center justify-center"
              style={{ height: 32 }}
              onMouseEnter={() => setHovering(chapter.id)}
              onMouseLeave={() => setHovering(null)}
            >
              {/* Label on hover / active */}
              <AnimatePresence>
                {(isHover || isActive) && (
                  <motion.div
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 6 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-6 flex items-center gap-2 whitespace-nowrap cursor-pointer"
                    onClick={() => scrollTo(chapter.id)}
                  >
                    <span
                      className="text-[9px] tracking-[0.25em] uppercase font-semibold"
                      style={{ color: isActive ? '#c9a14a' : 'rgba(255,255,255,0.5)' }}
                    >
                      {String(i + 1).padStart(2, '0')} · {chapter.label}
                    </span>
                    <span
                      className="text-[11px] select-none"
                      style={{ color: isActive ? 'rgba(201,161,74,0.6)' : 'rgba(255,255,255,0.2)' }}
                    >
                      {chapter.char}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dot */}
              <motion.button
                onClick={() => scrollTo(chapter.id)}
                aria-label={`Jump to ${chapter.label}`}
                animate={{
                  width: isActive ? 10 : 5,
                  height: isActive ? 10 : 5,
                  backgroundColor: isActive
                    ? '#c9a14a'
                    : isPast || visited.has(chapter.id)
                      ? 'rgba(201,161,74,0.4)'
                      : 'rgba(255,255,255,0.15)',
                  boxShadow: isActive ? '0 0 10px 3px rgba(201,161,74,0.5)' : 'none',
                }}
                transition={{ duration: 0.25 }}
                className="relative z-10 rounded-full cursor-pointer"
                style={{ minWidth: 10, minHeight: 10 }}
              />
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
