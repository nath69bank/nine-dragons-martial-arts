import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { gsap } from '@/lib/scrollReveal'

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

  const railRef  = useRef<HTMLDivElement>(null)
  const lineRef  = useRef<HTMLDivElement>(null)
  const dotRefs   = useRef<Record<string, HTMLButtonElement | null>>({})
  const labelRefs = useRef<Record<string, HTMLDivElement | null>>({})

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

  // Progress line — scrubbed to total page scroll, GSAP-driven
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(lineRef.current, { scaleY: 0, transformOrigin: 'top' })
      gsap.to(lineRef.current, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      })
    })
    return () => {
      ctx.revert()
    }
  }, [])

  // Fade the whole rail in once the user starts scrolling
  useEffect(() => {
    if (!railRef.current) return
    gsap.to(railRef.current, {
      opacity: scrolled ? 1 : 0,
      x: scrolled ? 0 : 16,
      duration: 0.5,
      ease: 'power2.out',
      onStart: () => { if (railRef.current) railRef.current.style.pointerEvents = scrolled ? 'auto' : 'none' },
    })
  }, [scrolled])

  // Fade in after user starts scrolling
  useEffect(() => {
    const handler = () => { if (window.scrollY > 100) setScrolled(true) }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Dot size/color/glow — GSAP tween per state change
  useEffect(() => {
    CHAPTERS.forEach((chapter, i) => {
      const dot = dotRefs.current[chapter.id]
      if (!dot) return
      const isActive = chapter.id === active
      const isPast = i < CHAPTERS.findIndex(c => c.id === active)
      gsap.to(dot, {
        width: isActive ? 10 : 5,
        height: isActive ? 10 : 5,
        backgroundColor: isActive
          ? '#c9a14a'
          : isPast || visited.has(chapter.id)
            ? 'rgba(201,161,74,0.4)'
            : 'rgba(255,255,255,0.15)',
        boxShadow: isActive ? '0 0 10px 3px rgba(201,161,74,0.5)' : '0 0 0 0 rgba(201,161,74,0)',
        duration: 0.25,
        ease: 'power2.out',
      })
    })
  }, [active, visited])

  // Chapter labels — fade/slide on hover or active, GSAP-driven
  useEffect(() => {
    CHAPTERS.forEach(chapter => {
      const label = labelRefs.current[chapter.id]
      if (!label) return
      const show = chapter.id === active || chapter.id === hovering
      gsap.to(label, {
        opacity: show ? 1 : 0,
        x: show ? 0 : 6,
        duration: 0.18,
        ease: 'power2.out',
        pointerEvents: show ? 'auto' : 'none',
      })
    })
  }, [active, hovering])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div
      ref={railRef}
      className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-0"
      style={{ opacity: 0, pointerEvents: 'none' }}
    >
      {/* Track line */}
      <div className="relative flex flex-col items-center" style={{ height: CHAPTERS.length * 32 }}>
        {/* Background track */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px"
          style={{ background: 'rgba(201,161,74,0.1)' }}
        />
        {/* Filled progress */}
        <div
          ref={lineRef}
          className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px"
          style={{ background: 'linear-gradient(to bottom, rgba(201,161,74,0.6), rgba(201,161,74,0.2))' }}
        />

        {/* Chapter dots */}
        {CHAPTERS.map((chapter, i) => {
          const isActive = chapter.id === active
          return (
            <div
              key={chapter.id}
              className="relative flex items-center justify-center"
              style={{ height: 32 }}
              onMouseEnter={() => setHovering(chapter.id)}
              onMouseLeave={() => setHovering(null)}
            >
              {/* Label on hover / active */}
              <div
                ref={el => { labelRefs.current[chapter.id] = el }}
                className="absolute right-6 flex items-center gap-2 whitespace-nowrap cursor-pointer"
                style={{ opacity: 0, pointerEvents: 'none' }}
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
              </div>

              {/* Dot */}
              <button
                ref={el => { dotRefs.current[chapter.id] = el }}
                onClick={() => scrollTo(chapter.id)}
                aria-label={`Jump to ${chapter.label}`}
                className="relative z-10 rounded-full cursor-pointer"
                style={{ width: 5, height: 5, minWidth: 10, minHeight: 10, background: 'rgba(255,255,255,0.15)' }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
