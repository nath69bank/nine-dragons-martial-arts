import { motion } from 'framer-motion'
import { Award, Users, Star } from 'lucide-react'

export default function Instructors() {
  return (
    <section id="instructors" className="relative py-14 md:py-32 bg-card/20 border-t border-border/30">
      <div className="max-w-7xl mx-auto px-5 md:px-20">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <span className="eyebrow">04 ─── Instructors · The Lineage</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.06 }}
          className="section-h2 mb-14"
        >
          Taught by the <em>Best</em>
        </motion.h2>

        <div className="grid lg:grid-cols-3 gap-7">
          {/* Master Martin — main card */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, delay: 0.1, ease: 'easeOut' }}
            className="lg:col-span-2 gold-card rounded-2xl p-8 md:p-10 relative overflow-hidden"
          >
            <div className="absolute inset-0 dragon-scales opacity-25" />
            <div
              className="absolute top-0 right-0 w-72 h-72 pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle at 75% 25%, rgba(201,161,74,0.06), transparent 55%)',
              }}
            />

            <div className="relative z-10">
              {/* Avatar placeholder */}
              <div
                className="w-20 h-20 rounded-2xl mb-6 flex items-center justify-center text-2xl font-bold text-primary"
                style={{
                  background: 'linear-gradient(135deg, hsl(222,60%,8%) 0%, hsl(223,50%,14%) 100%)',
                  border: '1px solid rgba(201,161,74,0.3)',
                }}
              >
                MM
              </div>

              <div className="flex flex-wrap items-start gap-3 mb-5">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Master Martin</h3>
                  <p className="text-primary text-sm tracking-wider">Head Instructor</p>
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {['3rd Dan', 'Kaizendo Specialist', '20+ Years'].map(tag => (
                    <span
                      key={tag}
                      className="text-[10px] tracking-widest uppercase px-3 py-1 rounded-full border border-primary/30 text-primary/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Master Martin holds a 3rd Dan and has spent over two decades mastering and teaching
                Kaizendo Kickboxing. He trained directly under Grand Master Frank Murphy — 8th Dan
                and one of the UK's most respected martial arts figures. His teaching philosophy
                centres on continuous improvement: every student, every session, moves forward.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Beyond the dojo, Master Martin dedicates time to mentoring at-risk young people,
                using martial arts as a vehicle for personal development, discipline, and community.
              </p>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/40">
                {[
                  { icon: Award, label: '3rd Dan Black Belt', sub: 'Kaizendo Kickboxing' },
                  { icon: Users, label: 'Youth Mentorship', sub: 'At-risk young people' },
                  { icon: Star, label: 'Grand Master Lineage', sub: 'Frank Murphy 8th Dan' },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex flex-col gap-1">
                    <Icon size={15} className="text-primary/70 mb-1" />
                    <span className="text-foreground text-xs font-semibold">{label}</span>
                    <span className="text-muted-foreground text-xs">{sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
              className="gold-card rounded-2xl p-7 flex flex-col gap-4"
            >
              <span className="eyebrow !mb-0">Teaching Philosophy</span>
              <blockquote className="text-muted-foreground text-sm leading-relaxed italic border-l-2 border-primary/40 pl-4">
                "Kaizendo means the way of continuous improvement. There is no destination — only the
                next step. My job is to make sure every student knows where that step is."
              </blockquote>
              <p className="text-xs text-muted-foreground">— Master Martin</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.22, ease: 'easeOut' }}
              className="gold-card rounded-2xl p-7 flex flex-col gap-4 relative overflow-hidden"
            >
              <div className="absolute inset-0 dragon-scales opacity-20" />
              <div className="relative z-10">
                <div
                  className="w-11 h-11 rounded-xl mb-4 flex items-center justify-center text-sm font-bold text-primary"
                  style={{
                    background:
                      'linear-gradient(135deg, hsl(222,60%,8%) 0%, hsl(223,50%,14%) 100%)',
                    border: '1px solid rgba(201,161,74,0.3)',
                  }}
                >
                  SS
                </div>
                <h4 className="font-semibold text-foreground mb-0.5">Master Steve Sharkey</h4>
                <p className="text-primary text-xs tracking-wider mb-4">5th Dan — Endorsement</p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  "Master Martin brings genuine skill, heart, and integrity to every class. The
                  standard at Nine Dragons reflects everything this art stands for."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
