import { useRef, useLayoutEffect } from 'react'
import { Clock, MapPin } from 'lucide-react'
import { gsap, reveal } from '@/lib/scrollReveal'

interface UpcomingEvent {
  id: string
  badge: string
  day: string
  month: string
  weekday: string
  title: string
  time: string
  location: string
  description: string
  image: string
  imageAlt: string
  cta?: { label: string; intent: string }
}

const EVENTS: UpcomingEvent[] = [
  {
    id: 'black-belt-grading-2026',
    badge: 'Save The Date',
    day: '7',
    month: 'Dec',
    weekday: 'Monday',
    title: 'Black Belt Grading 2026',
    time: '6:00 – 8:00pm',
    location: "St Anne's, Birkenhead",
    description:
      "The pinnacle of the Nine Dragons journey — watch our students test everything they've trained for, from white belt all the way to black.",
    image: '/gallery/black-belt-grading-stage.jpg',
    imageAlt: 'Black belt grading ceremony on stage with certificates',
  },
  {
    id: 'christmas-party-2026',
    badge: 'Community Night',
    day: '19',
    month: 'Dec',
    weekday: 'Saturday',
    title: 'Christmas Party 2026',
    time: '7:30 – 11:30pm',
    location: "St Anne's, Birkenhead",
    description:
      'Come celebrate Christmas with the whole Nine Dragons family — music, food, and a proper send-off to the year. Open to students, families and anyone curious about joining us.',
    image: '/gallery/christmas-party-crowd.jpg',
    imageAlt: 'Nine Dragons Christmas party crowd on the St Annes stage',
    cta: { label: 'Ask About Coming', intent: 'enquiry' },
  },
]

export default function UpcomingEvents() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const eyebrowRef  = useRef<HTMLDivElement>(null)
  const titleRef    = useRef<HTMLDivElement>(null)
  const leadRef     = useRef<HTMLParagraphElement>(null)
  const gridRef     = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      reveal(eyebrowRef.current, { from: { y: 20 } })
      reveal(titleRef.current, { from: { y: 20 }, delay: 0.05 })
      reveal(leadRef.current, { from: { y: 16 }, delay: 0.1 })
      if (gridRef.current) {
        reveal(gridRef.current.children, {
          from: { y: 32, scale: 0.97 }, stagger: 0.12, trigger: gridRef.current,
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="upcoming-events" ref={sectionRef} className="relative py-14 md:py-32 border-t border-border/30">
      <div className="max-w-7xl mx-auto px-5 md:px-20">
        <div ref={eyebrowRef} className="text-center mb-3">
          <span className="eyebrow">What's Next</span>
        </div>
        <div ref={titleRef} className="text-center mb-4">
          <h2 className="section-h2">
            Upcoming <em>Events</em>
          </h2>
        </div>
        <p ref={leadRef} className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto text-center mb-10 md:mb-12">
          Mark the calendar — here's what's coming up at Nine Dragons.
        </p>

        <div ref={gridRef} className="grid md:grid-cols-2 gap-6 md:gap-7">
          {EVENTS.map(event => (
            <div
              key={event.id}
              className="relative rounded-2xl overflow-hidden flex flex-col gold-card"
            >
              <div className="absolute inset-0 dragon-scales opacity-20 pointer-events-none" />

              <div className="relative w-full aspect-[16/9] overflow-hidden">
                <picture>
                  <source srcSet={event.image.replace(/\.jpe?g$/i, '.webp')} type="image/webp" />
                  <img
                    src={event.image}
                    alt={event.imageAlt}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                {/* Date block */}
                <div
                  className="absolute top-4 left-4 flex flex-col items-center justify-center rounded-xl px-3.5 py-2 backdrop-blur-sm"
                  style={{ background: 'rgba(1,5,14,0.75)', border: '1px solid rgba(201,161,74,0.4)' }}
                >
                  <span className="text-2xl font-bold leading-none" style={{ color: '#c9a14a' }}>{event.day}</span>
                  <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-white/70">{event.month}</span>
                </div>

                <span
                  className="absolute top-4 right-4 text-[9px] tracking-[0.25em] uppercase font-semibold px-3 py-1 rounded-full"
                  style={{ background: 'rgba(201,161,74,0.15)', border: '1px solid rgba(201,161,74,0.4)', color: '#e0c060' }}
                >
                  {event.badge}
                </span>
              </div>

              <div className="relative z-10 p-6 md:p-7 flex flex-col gap-3 flex-1">
                <h3 className="font-bold text-lg text-foreground leading-tight">{event.title}</h3>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock size={12} className="text-primary/70 shrink-0" />
                    {event.weekday} · {event.time}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={12} className="text-primary/70 shrink-0" />
                    {event.location}
                  </span>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed flex-1">{event.description}</p>

                {event.cta && (
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('open-chatbot', { detail: { intent: event.cta!.intent } }))}
                    className="mt-2 self-start px-5 py-2.5 rounded-full text-xs font-bold tracking-[0.15em] uppercase transition-opacity hover:opacity-90 active:scale-95 cursor-pointer"
                    style={{
                      background: 'linear-gradient(135deg, #c9a14a 0%, #e0c060 50%, #c9a14a 100%)',
                      color: '#0a1020',
                    }}
                  >
                    {event.cta.label}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
