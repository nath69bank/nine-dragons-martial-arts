import { useRef, useLayoutEffect } from 'react'
import { HeartHandshake, CalendarDays, PawPrint } from 'lucide-react'
import { gsap, reveal } from '@/lib/scrollReveal'

interface EventCard {
  id: string
  badge: string
  title: string
  description: string
  image?: string
  imageAlt?: string
  icon?: typeof HeartHandshake
  cta?: { label: string; intent: string }
}

const EVENTS: EventCard[] = [
  {
    id: 'fox-rescue',
    badge: 'Charity Partner',
    title: 'Wirral Fox Rescue',
    description:
      "Nine Dragons proudly sponsors a rescue kennel for Wirral Fox Rescue, helping injured and orphaned foxes get a second chance back in the wild. Bertie the Fox even dropped by to test our students' moves.",
    image: '/gallery/fox-rescue-group.jpg',
    imageAlt: 'Nine Dragons students with Bertie the Fox at the Wirral Fox Rescue fundraiser',
    icon: PawPrint,
  },
  {
    id: 'claire-house',
    badge: 'Charity Partner',
    title: "Claire House Children's Hospice",
    description:
      "We run fundraising events throughout the year in support of Claire House — supporting seriously ill children and their families across Wirral, Cheshire and beyond.",
    icon: HeartHandshake,
  },
  {
    id: 'self-defence',
    badge: 'This Month',
    title: "Free Women's Self-Defence Taster",
    description:
      'Sunday 25th October, 1:00pm — Green Lane, CH45 8NA. Open to all, completely free of charge. No experience needed, just come along and give it a go.',
    image: '/gallery/womens-self-defence-taster.jpg',
    imageAlt: 'Free women\'s self-defence taster class, pad work session outdoors',
    icon: CalendarDays,
    cta: { label: 'Reserve Your Spot', intent: 'free-trial' },
  },
]

export default function CommunityEvents() {
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
    <section id="community" ref={sectionRef} className="relative py-14 md:py-32 bg-card/20 border-t border-border/30">
      <div className="max-w-7xl mx-auto px-5 md:px-20">
        <div ref={eyebrowRef} className="text-center mb-3">
          <span className="eyebrow">In The Community</span>
        </div>
        <div ref={titleRef} className="text-center mb-4">
          <h2 className="section-h2">
            More Than <em>Martial Arts</em>
          </h2>
        </div>
        <p ref={leadRef} className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto text-center mb-10 md:mb-12">
          Nine Dragons is part of the Wirral community — supporting local charities and running free events for anyone who wants to try.
        </p>

        <div ref={gridRef} className="grid md:grid-cols-3 gap-6 md:gap-7">
          {EVENTS.map(event => {
            const Icon = event.icon ?? HeartHandshake
            return (
              <div
                key={event.id}
                className="relative rounded-2xl overflow-hidden flex flex-col gold-card"
              >
                <div className="absolute inset-0 dragon-scales opacity-20 pointer-events-none" />

                {event.image ? (
                  <div className="relative w-full aspect-[4/3] overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.imageAlt}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  </div>
                ) : (
                  <div
                    className="relative w-full aspect-[4/3] flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, hsl(222,65%,6%) 0%, hsl(222,65%,10%) 100%)' }}
                  >
                    <div className="absolute inset-0 dragon-scales opacity-30" />
                    <Icon size={48} style={{ color: 'rgba(201,161,74,0.35)' }} />
                  </div>
                )}

                <div className="relative z-10 p-6 md:p-7 flex flex-col gap-3 flex-1">
                  <span
                    className="self-start text-[9px] tracking-[0.25em] uppercase font-semibold px-3 py-1 rounded-full"
                    style={{ background: 'rgba(201,161,74,0.1)', border: '1px solid rgba(201,161,74,0.3)', color: '#c9a14a' }}
                  >
                    {event.badge}
                  </span>
                  <h3 className="font-bold text-lg text-foreground leading-tight">{event.title}</h3>
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
            )
          })}
        </div>
      </div>
    </section>
  )
}
