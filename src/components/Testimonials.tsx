import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

const TESTIMONIALS = [
  {
    quote:
      "Master Martin brings genuine skill, heart, and integrity to every class. The standard at Nine Dragons reflects everything this art stands for — I'm proud to endorse him and this school.",
    author: 'Master Steve Sharkey',
    role: '5th Dan — Formal Endorsement',
    initials: 'SS',
    featured: true,
  },
  {
    quote:
      "My daughter started as a Dragon Cub at 5 and she's now grading through the Sparks programme. The confidence it's given her is extraordinary. Master Martin remembers every student — it genuinely feels like family.",
    author: 'Claire M.',
    role: 'Parent of Dragon Sparks student',
    initials: 'CM',
    featured: false,
  },
  {
    quote:
      "I came in with no experience at 34, convinced I'd left it too late. Six months in and I'm sparring, improving every session, and genuinely loving every class. The Kaizendo approach just makes sense.",
    author: 'James T.',
    role: 'Adult beginner — Dragon Warriors',
    initials: 'JT',
    featured: false,
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative py-14 md:py-32 border-t border-border/30">
      <div className="max-w-7xl mx-auto px-5 md:px-20">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <span className="eyebrow">07 ─── Testimonials · The Warriors</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.06 }}
          className="section-h2 mb-16"
        >
          What They <em>Say</em>
        </motion.h2>

        <div className="grid lg:grid-cols-3 gap-7">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 36, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: 'easeOut' }}
              className="gold-card rounded-2xl p-8 flex flex-col gap-5 relative overflow-hidden"
            >
              <div className="absolute inset-0 dragon-scales opacity-20" />

              {t.featured && (
                <span className="absolute top-4 right-4 text-[9px] tracking-[0.25em] uppercase bg-primary/15 text-primary border border-primary/25 rounded-full px-3 py-1">
                  Endorsed
                </span>
              )}

              <Quote size={22} className="text-primary/50 relative z-10 shrink-0" />

              <p className="text-muted-foreground text-sm leading-relaxed relative z-10 flex-1">
                "{t.quote}"
              </p>

              <div className="flex items-center gap-3 relative z-10 pt-4 border-t border-border/30">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-primary shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, hsl(222,60%,8%) 0%, hsl(223,50%,14%) 100%)',
                    border: '1px solid rgba(201,161,74,0.3)',
                  }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-foreground text-sm font-semibold">{t.author}</p>
                  <p className="text-muted-foreground text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
