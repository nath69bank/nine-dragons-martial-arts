import { useEffect, useRef, useLayoutEffect } from 'react'
import { gsap, reveal } from '@/lib/scrollReveal'
import EmberCanvas from './EmberCanvas'

// Set a real HLS stream URL to switch the background to live/recorded video.
// hls.js (a sizeable library) is only fetched when this is non-empty, so it
// never weighs down the bundle while this stays unused.
const HLS_URL = ''

export default function JoinCTA() {
  const videoRef   = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const logoWrapRef = useRef<HTMLDivElement>(null)
  const glowRef     = useRef<HTMLDivElement>(null)
  const logoImgRef  = useRef<HTMLImageElement>(null)
  const eyebrowRef  = useRef<HTMLSpanElement>(null)
  const headingRef  = useRef<HTMLHeadingElement>(null)
  const paraRef     = useRef<HTMLParagraphElement>(null)
  const ctaRef      = useRef<HTMLDivElement>(null)
  const emailRef    = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !HLS_URL) return

    let hls: import('hls.js').default | undefined
    let cancelled = false

    import('hls.js').then(({ default: Hls }) => {
      if (cancelled || !video) return
      if (Hls.isSupported()) {
        hls = new Hls()
        hls.loadSource(HLS_URL)
        hls.attachMedia(video)
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = HLS_URL
      }
    })

    return () => {
      cancelled = true
      hls?.destroy()
    }
  }, [])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      reveal(logoWrapRef.current, { from: { scale: 0.7 }, duration: 0.8, ease: 'back.out(1.4)' })
      reveal(eyebrowRef.current, { from: { scale: 0.9 }, duration: 0.5, delay: 0.05 })
      reveal(headingRef.current, { from: { y: 24 }, duration: 0.7, delay: 0.12 })
      reveal(paraRef.current, { from: { y: 16 }, delay: 0.18 })
      reveal(ctaRef.current, { from: { y: 16 }, delay: 0.24 })
      reveal(emailRef.current, { from: { y: 0 }, delay: 0.32 })

      // Ambient loops
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          boxShadow: '0 0 70px 20px rgba(201,161,74,0.55), 0 0 160px 50px rgba(26,79,200,0.35)',
          duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut',
        })
      }
      if (logoImgRef.current) {
        gsap.to(logoImgRef.current, { y: -8, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const hasVideo = Boolean(HLS_URL)

  return (
    <section
      id="join"
      ref={sectionRef}
      className="relative py-20 md:py-40 border-t border-border/30 overflow-hidden text-center"
    >
      {/* Background */}
      {hasVideo ? (
        <>
          <video ref={videoRef} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0" />
          <div className="absolute inset-0 bg-background/60 z-[1]" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 z-0">
            <EmberCanvas />
          </div>
          <div
            className="absolute inset-0 pointer-events-none z-[1]"
            style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(20,55,140,0.22) 0%, rgba(1,8,16,0.55) 70%)' }}
          />
        </>
      )}

      <div className="absolute inset-0 dragon-scales z-[2] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-5 sm:px-8 flex flex-col items-center gap-6 md:gap-7">
        {/* Logo */}
        <div ref={logoWrapRef} className="relative">
          <div
            ref={glowRef}
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ boxShadow: '0 0 30px 6px rgba(201,161,74,0.2), 0 0 80px 20px rgba(26,79,200,0.12)' }}
          />
          <picture>
            <source srcSet="/logo.webp" type="image/webp" />
            <img
              ref={logoImgRef}
              src="/logo.jpeg"
              alt="Nine Dragons Martial Arts"
              draggable={false}
              className="rounded-full"
              style={{ width: 120, height: 120, objectFit: 'cover' }}
            />
          </picture>
        </div>

        <span ref={eyebrowRef} className="eyebrow !mb-0">
          08 ─── Your Turn · Begin
        </span>

        <h2 ref={headingRef} className="font-bold tracking-tight leading-none" style={{ fontSize: 'clamp(38px, 7vw, 80px)' }}>
          Your first class is{' '}
          <em className="font-serif italic font-normal" style={{ color: 'hsl(var(--primary))' }}>
            free.
          </em>
        </h2>

        <p ref={paraRef} className="text-muted-foreground text-base leading-relaxed max-w-md">
          No commitment, no experience needed. Just show up, try a class, and see what Nine Dragons
          can do for you or your child.
        </p>

        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-chatbot', { detail: { intent: 'free-trial' } }))}
            className="px-8 py-3.5 rounded-full text-sm font-bold tracking-[0.18em] uppercase transition-opacity hover:opacity-90 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #c9a14a 0%, #e0c060 50%, #c9a14a 100%)',
              color: '#0a1020',
              boxShadow: '0 0 40px rgba(201,161,74,0.28)',
            }}
          >
            Book Free Trial
          </button>
          <a href="#disciplines" className="liquid-glass rounded-full px-8 py-3.5 text-sm font-medium text-foreground">
            Explore Classes
          </a>
        </div>

        <p ref={emailRef} className="text-muted-foreground text-sm">
          Or email{' '}
          <a href="mailto:hello@ninedragonsmartialarts.co.uk" className="text-primary hover:underline">
            hello@ninedragonsmartialarts.co.uk
          </a>
        </p>
      </div>
    </section>
  )
}
