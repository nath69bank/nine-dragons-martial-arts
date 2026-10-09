import { useRef, useLayoutEffect } from 'react'
import { gsap, reveal } from '@/lib/scrollReveal'

const PILLARS = [
  {
    char: '心',
    name: 'Discipline',
    chinese: '纪律',
    description:
      'Every class builds mental focus, self-control, and the habit of showing up — skills that transfer far beyond the dojo.',
  },
  {
    char: '体',
    name: 'Strength',
    chinese: '力量',
    description:
      'Kaizendo Kickboxing and traditional forms develop real physical conditioning — coordination, power, and lasting fitness.',
  },
  {
    char: '道',
    name: 'Community',
    chinese: '社区',
    description:
      'From Dragon Cubs to Dragon Masters, every student grows alongside a family that supports their journey at every belt.',
  },
]

export default function WhyItMatters() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const eyebrowRef  = useRef<HTMLDivElement>(null)
  const headerRef   = useRef<HTMLDivElement>(null)
  const cardsRef    = useRef<HTMLDivElement>(null)
  const taglineRef  = useRef<HTMLParagraphElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      reveal(eyebrowRef.current, { from: { x: -24 }, duration: 0.6 })
      reveal(headerRef.current, { from: { x: -24 }, duration: 0.6, delay: 0.08 })
      if (cardsRef.current) {
        reveal(cardsRef.current.children, {
          from: { y: 32 }, duration: 0.55, stagger: 0.1, trigger: cardsRef.current,
        })
      }
      reveal(taglineRef.current, { from: { y: 0 }, duration: 0.7, delay: 0.1 })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="philosophy" ref={sectionRef} className="relative py-14 md:py-32 border-t border-border/30">
      <div className="max-w-7xl mx-auto px-5 md:px-20">

        {/* Header */}
        <div ref={eyebrowRef} className="mb-4">
          <span className="eyebrow">03 ─── Philosophy · The Code</span>
        </div>

        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
          <h2 className="section-h2 mb-0">
            Martial arts will <em>forge you.</em>
          </h2>
          <p className="text-muted-foreground text-base max-w-sm">
            Whether you're 5 or 55, a first session at Nine Dragons changes something.
          </p>
        </div>

        {/* Three pillar cards */}
        <div ref={cardsRef} className="grid md:grid-cols-3 gap-6 md:gap-8 mb-16">
          {PILLARS.map((pillar, i) => (
            <div
              key={pillar.name}
              className="group gold-card rounded-2xl p-8 flex flex-col gap-5 relative overflow-hidden"
            >
              <div className="absolute inset-0 dragon-scales opacity-30" />

              {/* Large decorative char */}
              <div className="relative z-10 flex items-center gap-4">
                <span
                  className="select-none leading-none float-char"
                  style={{
                    fontFamily: '"Instrument Serif", serif',
                    fontSize: '52px',
                    color: 'rgba(201,161,74,0.75)',
                    textShadow: '0 0 28px rgba(201,161,74,0.4)',
                    animationDelay: `${i * 0.5}s`,
                  }}
                >
                  {pillar.char}
                </span>
                <div>
                  <p className="font-semibold text-base text-white">{pillar.name}</p>
                  <p
                    className="text-[10px] tracking-widest uppercase mt-0.5"
                    style={{ color: 'rgba(201,161,74,0.6)' }}
                  >
                    {pillar.chinese}
                  </p>
                </div>
              </div>

              <p
                className="relative z-10 text-sm leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

        {/* Tagline */}
        <p ref={taglineRef} className="text-sm" style={{ color: 'rgba(255,255,255,0.28)' }}>
          If you don't take the first step, someone else will take it for you.
        </p>
      </div>
    </section>
  )
}
