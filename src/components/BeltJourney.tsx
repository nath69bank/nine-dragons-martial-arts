import { motion } from 'framer-motion'

const BELTS = [
  {
    color: '#ffffff',
    border: '#aaaaaa',
    name: 'White Belt',
    meaning: 'Innocence',
    description:
      'White represents a blank canvas — the student arrives with an open mind and no preconceptions. It is the beginning of the journey, pure and full of potential.',
  },
  {
    color: '#ffd700',
    border: '#d4a800',
    name: 'Yellow Belt',
    meaning: 'Foundation',
    description:
      'Yellow is the earth in which the seed is planted. The student begins to build a solid technical foundation — the roots that everything else will grow from.',
  },
  {
    color: '#ff8c00',
    border: '#cc6600',
    name: 'Orange Belt',
    meaning: 'Rising Light',
    description:
      'Orange is the light spreading across the horizon. Awareness grows — the student starts to see how techniques connect and flow together as one.',
  },
  {
    color: '#228b22',
    border: '#155715',
    name: 'Green Belt',
    meaning: 'Growth',
    description:
      'Green is the colour of a sprouting plant. Skills are visibly developing — the student moves with greater control and begins to express their own style.',
  },
  {
    color: '#1a4fc8',
    border: '#0f2f80',
    name: 'Blue Belt',
    meaning: 'Depth',
    description:
      'Blue is the sky deepening towards dusk. Knowledge becomes more layered — the student pushes beyond technique into timing, distance, and ring craft.',
  },
  {
    color: '#800080',
    border: '#500050',
    name: 'Purple Belt',
    meaning: 'Transition',
    description:
      'Purple is the sky between night and dawn — a threshold moment. The student crosses from intermediate into advanced training, beginning to understand what a Black Belt truly means.',
  },
  {
    color: '#cc0000',
    border: '#880000',
    name: 'Red Belt',
    meaning: 'Danger & Discipline',
    description:
      'Red signals danger — a reminder that the student\'s skill now carries real power and responsibility. Control and respect must be absolute.',
  },
  {
    color: '#8b4513',
    border: '#5c2a00',
    name: 'Brown Belt',
    meaning: 'Harvest',
    description:
      'Brown is the ripening of the seed. Years of training begin to bear fruit — techniques are sharp, instincts are built, and the Black Belt is within reach.',
  },
  {
    color: '#111111',
    border: '#444444',
    name: 'Black Belt',
    meaning: 'Mastery & New Beginning',
    description:
      'Black absorbs all colours — a symbol of the knowledge earned. But at Nine Dragons, achieving Black Belt is not an end. It is the beginning of a deeper, lifelong pursuit of excellence.',
    isBlack: true,
  },
]

const TAG_LABEL = 'Tag Grading'

export default function BeltJourney() {
  return (
    <section id="belts" className="py-24 px-5 md:px-16 max-w-5xl mx-auto">
      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-4"
      >
        <span className="eyebrow">09 ─── The Path · Belt Progression</span>
      </motion.div>

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="section-h2 mb-4"
      >
        What Each Belt Means
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-foreground/60 max-w-xl mb-16 leading-relaxed"
      >
        Kaizendo — <em className="text-gold/80">The Way of Constant and Never Ending Improvement</em>. Every belt colour carries a meaning. Between each belt, a Tag Grading confirms your technique before you advance.
      </motion.p>

      {/* Belt list */}
      <div className="relative">
        {/* Vertical connecting line */}
        <div className="absolute left-[22px] top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-gold/20 to-transparent hidden md:block" />

        <div className="space-y-3">
          {BELTS.map((belt, i) => (
            <div key={belt.name}>
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className={`relative flex items-start gap-5 p-5 rounded-2xl border transition-colors group
                  ${belt.isBlack
                    ? 'bg-gold/5 border-gold/30'
                    : 'bg-white/[0.03] border-white/[0.07] hover:border-white/15'}`}
              >
                {/* Belt colour dot */}
                <div className="flex-shrink-0 mt-0.5">
                  <div
                    className="w-11 h-11 rounded-full border-2 shadow-lg flex items-center justify-center"
                    style={{
                      background: belt.color,
                      borderColor: belt.border,
                      boxShadow: `0 0 16px ${belt.color}40`,
                    }}
                  >
                    {belt.isBlack && (
                      <span className="text-gold text-[10px] font-bold tracking-wider">1st</span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-3 flex-wrap mb-1">
                    <h3 className="text-base font-bold text-foreground">{belt.name}</h3>
                    <span className="text-xs font-medium tracking-widest uppercase"
                          style={{ color: belt.isBlack ? '#c9a14a' : belt.color === '#ffffff' ? '#aaa' : belt.color }}>
                      {belt.meaning}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/55 leading-relaxed">{belt.description}</p>
                </div>
              </motion.div>

              {/* Tag grading divider between belts */}
              {i < BELTS.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 + 0.1 }}
                  className="flex items-center gap-3 px-5 py-1.5"
                >
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/5" />
                  <span className="text-[10px] tracking-[0.2em] uppercase text-foreground/25 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full"
                          style={{ background: BELTS[i + 1].color, opacity: 0.6 }} />
                    {TAG_LABEL}
                    <span className="w-1.5 h-1.5 rounded-full"
                          style={{ background: BELTS[i + 1].color, opacity: 0.6 }} />
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/5" />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Medallion */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="mt-10 p-8 rounded-2xl border border-gold/30 bg-gold/5 text-center"
      >
        <div className="w-16 h-16 rounded-full border-2 border-gold/60 bg-gold/10 flex items-center justify-center mx-auto mb-5"
             style={{ boxShadow: '0 0 40px rgba(201,161,74,0.25)' }}>
          <span className="text-2xl">🥇</span>
        </div>
        <h3 className="text-xl font-bold text-gold mb-2">The Nine Dragons Medallion</h3>
        <p className="text-foreground/60 text-sm leading-relaxed max-w-md mx-auto">
          Students who complete the full belt journey and achieve their Black Belt receive the Nine Dragons Medallion — a personal mark of dedication, discipline, and the Kaizendo spirit of never-ending improvement.
        </p>
      </motion.div>

      {/* Note */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-6 text-center text-xs text-foreground/30"
      >
        Gradings take place regularly throughout the year. Speak to Master Martin for your next grading date.
      </motion.p>
    </section>
  )
}
