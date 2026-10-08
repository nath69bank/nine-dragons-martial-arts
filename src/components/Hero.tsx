import { useRef, useLayoutEffect } from 'react'
import { MapPin, Clock } from 'lucide-react'
import { gsap } from '@/lib/scrollReveal'
import EmberCanvas from './EmberCanvas'

export default function Hero() {
  const sectionRef   = useRef<HTMLDivElement>(null)
  const contentRef   = useRef<HTMLDivElement>(null)
  const glowBlobRef  = useRef<HTMLDivElement>(null)
  const logoWrapRef  = useRef<HTMLDivElement>(null)
  const logoGlowRef  = useRef<HTMLDivElement>(null)
  const logoImgRef   = useRef<HTMLImageElement>(null)
  const nameRef      = useRef<HTMLDivElement>(null)
  const taglineRef   = useRef<HTMLParagraphElement>(null)
  const ctaRef       = useRef<HTMLDivElement>(null)
  const statsRef     = useRef<HTMLDivElement>(null)
  const locationRef  = useRef<HTMLDivElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)
  const scrollLineRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // ── Opening sequence ──
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo(logoWrapRef.current, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 1.4, ease: 'expo.out' })
        .fromTo(nameRef.current, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.9 }, 0.5)
        .fromTo(taglineRef.current, { opacity: 0 }, { opacity: 1, duration: 0.85 }, 0.78)
        .fromTo(ctaRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.65 }, 0.95)
        .fromTo(statsRef.current?.children ?? [], { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.08, ease: 'back.out(1.7)' }, 1.15)
        .fromTo(locationRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 1.3)
        .fromTo(scrollHintRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8 }, 1.7)

      // ── Ambient loops ──
      gsap.to(glowBlobRef.current, { scale: 1.08, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut' })
      gsap.to(logoGlowRef.current, {
        boxShadow: '0 0 120px 40px rgba(201,161,74,0.6), 0 0 260px 80px rgba(26,79,200,0.38)',
        duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut',
      })
      gsap.to(logoImgRef.current, { y: -16, duration: 3.5, repeat: -1, yoyo: true, ease: 'sine.inOut' })
      gsap.to(scrollLineRef.current, {
        scaleY: 1, duration: 0.9, repeat: -1, yoyo: true, ease: 'sine.inOut', transformOrigin: 'top',
      })

      // ── Parallax on scroll ──
      gsap.to(contentRef.current, {
        y: -50,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-16"
    >
      {/* Backgrounds */}
      <div className="absolute inset-0 dragon-scales" />
      <EmberCanvas />

      {/* Central glow blob behind logo */}
      <div
        ref={glowBlobRef}
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 900,
          height: 900,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -52%)',
          background: 'radial-gradient(circle, rgba(26,79,200,0.22) 0%, rgba(201,161,74,0.07) 38%, transparent 68%)',
        }}
      />

      {/* Content stack — parallax wrapper */}
      <div ref={contentRef} className="relative z-10 flex flex-col items-center text-center px-5 sm:px-6 gap-6 md:gap-9">

        {/* ── Logo — the main event ── */}
        <div
          ref={logoWrapRef}
          className="relative"
          style={{ width: 'clamp(200px, 52vw, 460px)', height: 'clamp(200px, 52vw, 460px)' }}
        >
          <div
            ref={logoGlowRef}
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ boxShadow: '0 0 50px 12px rgba(201,161,74,0.18), 0 0 120px 30px rgba(26,79,200,0.12)' }}
          />
          <img
            ref={logoImgRef}
            src="/logo.jpeg"
            alt="Nine Dragons Martial Arts"
            draggable={false}
            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
          />
        </div>

        {/* ── Name ── */}
        <div ref={nameRef} className="flex flex-col items-center gap-2">
          <h1 className="font-bold text-white leading-none" style={{ fontSize: 'clamp(34px, 9vw, 104px)', letterSpacing: '-0.03em' }}>
            Nine Dragons
          </h1>
          <span className="text-[11px] font-semibold tracking-[0.45em] uppercase" style={{ color: '#c9a14a' }}>
            Martial Arts · Birkenhead
          </span>
        </div>

        {/* ── Tagline ── */}
        <p ref={taglineRef} className="max-w-[360px] text-[14px] sm:text-[15px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.44)' }}>
          Traditional martial arts for all ages — taught by Master Martin, 3rd Dan.
          Dragon Cubs aged 5 through to adult Warriors.
        </p>

        {/* ── CTAs ── */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-xs sm:max-w-none">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-chatbot', { detail: { intent: 'free-trial' } }))}
            className="w-full sm:w-auto text-center px-8 py-4 sm:py-3.5 rounded-full text-sm font-bold tracking-[0.18em] uppercase transition-opacity hover:opacity-88 active:scale-95 touch-target cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #c9a14a 0%, #e0c060 50%, #c9a14a 100%)',
              color: '#0a1020',
              boxShadow: '0 0 44px rgba(201,161,74,0.3)',
            }}
          >
            Book Free Trial
          </button>
          <a
            href="#disciplines"
            className="text-sm font-medium transition-colors touch-target flex items-center justify-center"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            View Classes <span style={{ color: '#c9a14a' }} className="ml-1">→</span>
          </a>
        </div>

        {/* ── Stats ── */}
        <div ref={statsRef} className="flex items-center gap-8 sm:gap-16 pt-1">
          {[
            { value: '500+', label: 'Students' },
            { value: '20+', label: 'Yrs Exp.' },
            { value: '6', label: 'Classes / Wk' },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span className="text-xl sm:text-3xl font-bold" style={{ color: '#c9a14a' }}>{value}</span>
              <span className="text-[9px] sm:text-[10px] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Location + hours ── */}
        <div ref={locationRef} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 text-xs sm:text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
          <span className="flex items-center gap-2">
            <MapPin size={13} style={{ color: '#c9a14a' }} />
            St Annes Church Hall, Birkenhead
          </span>
          <span className="flex items-center gap-2">
            <Clock size={13} style={{ color: '#c9a14a' }} />
            Mon & Thu · 6 Classes / Week
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div ref={scrollHintRef} className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div
          ref={scrollLineRef}
          className="w-px h-10"
          style={{ background: 'linear-gradient(to bottom, rgba(201,161,74,0.55), transparent)', transform: 'scaleY(0)' }}
        />
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{ background: 'linear-gradient(to top, hsl(220,65%,1%) 0%, transparent 100%)' }}
      />
    </section>
  )
}
