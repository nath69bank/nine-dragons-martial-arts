import { useRef, useLayoutEffect } from 'react'
import { gsap, reveal } from '@/lib/scrollReveal'

const PARA1_WORDS =
  "We're not just teaching kicks and punches. We're shaping character, building resilience, and creating a community where every student — from age 5 to 55 — discovers what they're truly capable of. This is Kaizendo — the way of continuous improvement.".split(' ')

const PARA2_WORDS =
  "A dojo where dedication meets opportunity — where belt colours mark genuine growth, and every session pushes you one step closer to the warrior within.".split(' ')

function Paragraph({ words, className }: { words: string[]; className?: string }) {
  return (
    <p className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="reveal-word inline-block mr-[0.28em]">
          {word}
        </span>
      ))}
    </p>
  )
}

export default function Mission() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const eyebrowRef  = useRef<HTMLDivElement>(null)
  const para1Ref    = useRef<HTMLParagraphElement>(null)
  const para2Ref    = useRef<HTMLParagraphElement>(null)
  const attribRef   = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      reveal(eyebrowRef.current, { from: { y: 16 } })

      const words1 = para1Ref.current?.querySelectorAll('.reveal-word')
      const words2 = para2Ref.current?.querySelectorAll('.reveal-word')

      if (words1) {
        gsap.set(words1, { opacity: 0.08, y: 8, filter: 'blur(3px)' })
        gsap.to(words1, {
          opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.4, stagger: 0.022, ease: 'power2.out',
          scrollTrigger: { trigger: para1Ref.current, start: 'top 85%' },
        })
      }
      if (words2) {
        gsap.set(words2, { opacity: 0.08, y: 8, filter: 'blur(3px)' })
        gsap.to(words2, {
          opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.4, stagger: 0.022, ease: 'power2.out',
          scrollTrigger: { trigger: para2Ref.current, start: 'top 85%' },
        })
      }

      reveal(attribRef.current, { from: { y: 0 }, duration: 0.8, delay: 0.1 })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="mission" ref={sectionRef} className="relative py-16 md:py-32 border-t border-border/30">
      <div className="max-w-5xl mx-auto px-5 md:px-20">

        <div ref={eyebrowRef} className="text-center mb-16">
          <span className="eyebrow">03 ─── Our Mission · The Way</span>
        </div>

        <div ref={para1Ref}>
          <Paragraph
            words={PARA1_WORDS}
            className="text-2xl md:text-4xl lg:text-5xl font-medium tracking-[-1px] leading-snug mb-10"
          />
        </div>

        <div ref={para2Ref}>
          <Paragraph
            words={PARA2_WORDS}
            className="text-xl md:text-2xl lg:text-3xl font-medium leading-snug"
          />
        </div>

        <div ref={attribRef} className="mt-12 flex items-center gap-4">
          <div className="w-10 h-px bg-primary/50" />
          <span className="text-sm text-primary/80 font-medium tracking-wider">
            Master Martin — 3rd Dan, Kaizendo Kickboxing
          </span>
        </div>
      </div>
    </section>
  )
}
