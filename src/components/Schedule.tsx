import { useRef, useLayoutEffect } from 'react'
import { Clock, MapPin } from 'lucide-react'
import { gsap, reveal } from '@/lib/scrollReveal'

const ROWS = [
  {
    time: '6:00 – 7:00 PM',
    mon: { classes: ['Dragon Cubs (5–7)', 'Dragon Sparks (8–12)'], active: true },
    tue: null,
    wed: null,
    thu: { classes: ['Dragon Cubs (5–7)', 'Dragon Sparks (8–12)'], active: true },
    fri: null,
    sat: null,
  },
  {
    time: '7:00 – 8:00 PM',
    mon: { classes: ['Dragon Ninjas (13–16)', 'Dragon Warriors (16+)'], active: true },
    tue: null,
    wed: null,
    thu: { classes: ['Dragon Ninjas (13–16)', 'Dragon Warriors (16+)'], active: true },
    fri: null,
    sat: null,
  },
]

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function Schedule() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const eyebrowRef  = useRef<HTMLDivElement>(null)
  const headerRef   = useRef<HTMLDivElement>(null)
  const noteRef     = useRef<HTMLParagraphElement>(null)
  const tableRef    = useRef<HTMLDivElement>(null)
  const cardsRef    = useRef<HTMLDivElement>(null)
  const ctaRef      = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      reveal(eyebrowRef.current, { from: { y: 20 } })
      reveal(headerRef.current, { from: { y: 20 }, delay: 0.06 })
      reveal(noteRef.current, { from: { y: 16 }, delay: 0.08 })
      reveal(tableRef.current, { from: { y: 24 }, duration: 0.65, delay: 0.12 })
      if (cardsRef.current) {
        reveal(cardsRef.current.children, { from: { y: 20 }, duration: 0.5, stagger: 0.08, trigger: cardsRef.current })
      }
      reveal(ctaRef.current, { from: { y: 0 }, delay: 0.2 })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="schedule" ref={sectionRef} className="relative py-14 md:py-32 border-t border-border/30">
      <div className="max-w-7xl mx-auto px-5 md:px-20">
        {/* Header */}
        <div ref={eyebrowRef} className="mb-4">
          <span className="eyebrow">06 ─── Timetable · The Dojo</span>
        </div>
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <h2 className="section-h2 mb-0">
            Class <em>Schedule</em>
          </h2>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock size={13} className="text-primary/70" />
              Mon & Thu only
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={13} className="text-primary/70" />
              St Annes Church Hall, Birkenhead
            </span>
          </div>
        </div>

        {/* Note */}
        <p ref={noteRef} className="text-muted-foreground text-sm mb-12 max-w-xl">
          Dragon Masters (Black Belt+) and Kaizendo Kickboxing sessions are arranged directly with
          Master Martin — contact us to discuss advanced training.
        </p>

        {/* Table — desktop */}
        <div ref={tableRef} className="hidden md:block overflow-hidden rounded-2xl border border-border/40">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40" style={{ background: 'hsl(var(--card))' }}>
                <th className="text-left px-6 py-4 text-muted-foreground font-medium tracking-widest text-xs uppercase">
                  Time
                </th>
                {DAYS.map(day => (
                  <th key={day} className="text-center px-4 py-4 text-muted-foreground font-medium tracking-widest text-xs uppercase">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, ri) => (
                <tr key={ri} className="border-b border-border/30 last:border-0 transition-colors hover:bg-card/60">
                  <td className="px-6 py-5 text-foreground font-medium whitespace-nowrap">{row.time}</td>
                  {DAYS.map(day => {
                    const cell = row[day.toLowerCase() as keyof typeof row] as { classes: string[]; active: boolean } | null
                    return (
                      <td key={day} className="px-4 py-5 text-center">
                        {cell ? (
                          <div className="flex flex-col gap-1 items-center">
                            {cell.classes.map(cls => (
                              <span
                                key={cls}
                                className="inline-block text-xs px-2.5 py-1 rounded-full text-foreground/90"
                                style={{ background: 'rgba(201,161,74,0.12)', border: '1px solid rgba(201,161,74,0.25)' }}
                              >
                                {cls}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-border/50 text-lg select-none">–</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cards — mobile */}
        <div ref={cardsRef} className="md:hidden space-y-4">
          {ROWS.map((row, ri) => (
            <div key={ri} className="gold-card rounded-2xl p-6">
              <p className="text-foreground font-semibold mb-4">{row.time}</p>
              <div className="grid grid-cols-2 gap-3">
                {(['mon', 'thu'] as const).map(day => {
                  const cell = row[day] as { classes: string[]; active: boolean } | null
                  return cell ? (
                    <div key={day}>
                      <p className="text-xs text-primary tracking-widest uppercase mb-2">
                        {day === 'mon' ? 'Monday' : 'Thursday'}
                      </p>
                      <div className="flex flex-col gap-1.5">
                        {cell.classes.map(cls => (
                          <span
                            key={cls}
                            className="text-xs px-2.5 py-1 rounded-full text-foreground/90 w-fit"
                            style={{ background: 'rgba(201,161,74,0.12)', border: '1px solid rgba(201,161,74,0.25)' }}
                          >
                            {cls}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div ref={ctaRef} className="mt-12 text-center">
          <a
            href="mailto:hello@ninedragonsmartialarts.co.uk?subject=Class Enquiry"
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Questions about the timetable? Get in touch →
          </a>
        </div>
      </div>
    </section>
  )
}
