import { useRef, useLayoutEffect } from 'react'
import { gsap, reveal } from '@/lib/scrollReveal'

interface InlineCTAProps {
  eyebrow: string
  heading: React.ReactNode
  body: string
  buttonText?: string
  intent?: string
}

export default function InlineCTA({
  eyebrow,
  heading,
  body,
  buttonText = 'Book Free Trial',
  intent = 'free-trial',
}: InlineCTAProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardRef    = useRef<HTMLDivElement>(null)
  const glowRef    = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      reveal(cardRef.current, { from: { y: 36, scale: 0.97 }, duration: 0.7 })
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          opacity: 0.7,
          duration: 2.4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={sectionRef} className="relative py-10 md:py-16 px-5">
      <div
        ref={cardRef}
        className="relative max-w-3xl mx-auto rounded-3xl overflow-hidden text-center px-6 py-10 md:px-14 md:py-14"
        style={{
          background: 'linear-gradient(135deg, hsl(222,65%,5%) 0%, hsl(222,65%,9%) 100%)',
          border: '1px solid rgba(201,161,74,0.35)',
          boxShadow: '0 0 60px rgba(201,161,74,0.08)',
        }}
      >
        <div className="absolute inset-0 dragon-scales opacity-20 pointer-events-none" />
        <div
          ref={glowRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.35,
            background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(201,161,74,0.16), transparent 70%)',
          }}
        />

        <div className="relative z-10 flex flex-col items-center gap-4">
          <span className="text-[10px] tracking-[0.3em] uppercase font-semibold" style={{ color: 'rgba(201,161,74,0.7)' }}>
            {eyebrow}
          </span>

          <h3 className="font-bold leading-tight" style={{ fontSize: 'clamp(22px, 4vw, 34px)' }}>
            {heading}
          </h3>

          <p className="text-muted-foreground text-sm md:text-base max-w-md">{body}</p>

          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-chatbot', { detail: { intent } }))}
            className="mt-2 px-8 py-3.5 rounded-full text-sm font-bold tracking-[0.18em] uppercase transition-opacity hover:opacity-90 active:scale-95 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #c9a14a 0%, #e0c060 50%, #c9a14a 100%)',
              color: '#0a1020',
              boxShadow: '0 0 40px rgba(201,161,74,0.28)',
            }}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  )
}
