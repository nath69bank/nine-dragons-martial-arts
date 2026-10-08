import { useRef, useLayoutEffect } from 'react'
import { gsap } from '@/lib/scrollReveal'

interface DragonDividerProps {
  chapter: number
  title: string
  char?: string
}

/**
 * A chapter break in the site's story. Unlike a simple fade-in, this is
 * scrubbed to scroll position — the lines draw inward, the emblem turns
 * and settles, and the chapter label lights up exactly as you pass through
 * it, reversing smoothly if you scroll back up.
 */
export default function DragonDivider({ chapter, title, char = '龍' }: DragonDividerProps) {
  const num = String(chapter).padStart(2, '0')
  const rootRef     = useRef<HTMLDivElement>(null)
  const leftArmRef  = useRef<HTMLDivElement>(null)
  const rightArmRef = useRef<HTMLDivElement>(null)
  const emblemRef   = useRef<HTMLDivElement>(null)
  const ringRef     = useRef<HTMLDivElement>(null)
  const labelRef    = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(leftArmRef.current, { scaleX: 0, transformOrigin: 'right' })
      gsap.set(rightArmRef.current, { scaleX: 0, transformOrigin: 'left' })
      gsap.set(emblemRef.current, { opacity: 0, scale: 0.4, rotate: -70 })
      gsap.set(labelRef.current, { opacity: 0, y: 10 })

      // Scrubbed to the divider's own scroll position — plays forward as it
      // enters the viewport, reverses if you scroll back up.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 78%',
          end: 'top 32%',
          scrub: 0.5,
        },
      })
      tl.to([leftArmRef.current, rightArmRef.current], { scaleX: 1, duration: 0.4 }, 0)
        .to(emblemRef.current, { opacity: 1, scale: 1, rotate: 0, duration: 0.5, ease: 'back.out(2)' }, 0.15)
        .to(labelRef.current, { opacity: 1, y: 0, duration: 0.4 }, 0.35)

      // Ambient ring rotation — independent of scroll
      gsap.to(ringRef.current, { rotate: 360, duration: 20, repeat: -1, ease: 'none' })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef} className="relative flex flex-col items-center py-10 md:py-14 px-5 overflow-hidden">

      {/* ── Horizontal rule with centre emblem ── */}
      <div className="flex items-center w-full max-w-4xl gap-4">
        <div
          ref={leftArmRef}
          className="flex-1 h-px"
          style={{ background: 'linear-gradient(to left, rgba(201,161,74,0.45), transparent)' }}
        />

        <div ref={emblemRef} className="relative flex items-center justify-center shrink-0" style={{ width: 44, height: 44 }}>
          <div
            ref={ringRef}
            className="absolute inset-0 rounded-full"
            style={{ border: '1px solid rgba(201,161,74,0.25)', boxShadow: '0 0 16px rgba(201,161,74,0.15)' }}
          />
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, hsl(222,65%,4%) 0%, hsl(222,65%,8%) 100%)',
              border: '1px solid rgba(201,161,74,0.4)',
            }}
          >
            <span
              className="select-none leading-none"
              style={{ fontFamily: '"Instrument Serif", serif', fontSize: 14, color: 'rgba(201,161,74,0.8)' }}
            >
              {char}
            </span>
          </div>
        </div>

        <div
          ref={rightArmRef}
          className="flex-1 h-px"
          style={{ background: 'linear-gradient(to right, rgba(201,161,74,0.45), transparent)' }}
        />
      </div>

      {/* Chapter label */}
      <div ref={labelRef} className="flex items-center gap-3 mt-4">
        <span className="text-[10px] tracking-[0.3em] uppercase font-semibold" style={{ color: 'rgba(201,161,74,0.5)' }}>
          {num}
        </span>
        <span style={{ color: 'rgba(201,161,74,0.25)', fontSize: 10 }}>·</span>
        <span className="text-[10px] tracking-[0.3em] uppercase font-semibold" style={{ color: 'rgba(255,255,255,0.25)' }}>
          {title}
        </span>
      </div>
    </div>
  )
}
