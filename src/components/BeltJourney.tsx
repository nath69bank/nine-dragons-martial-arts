import { motion } from 'framer-motion'

// Main belt levels — each has a "Black tag" intermediate before the next colour
const BELTS = [
  {
    color: '#ffffff',
    border: '#999999',
    name: 'White Belt',
    meaning: 'The Beginning',
    description:
      'White represents a blank canvas. You arrive with no knowledge and no preconceptions — open to everything. The journey starts here.',
    isMain: true,
  },
  {
    color: '#800080',
    border: '#500050',
    name: 'Purple Belt',
    meaning: 'Awakening',
    description:
      'Purple is the colour of dawn — the first real light. You\'ve left white behind and taken your first step into structured martial arts training.',
    isMain: true,
  },
  {
    color: '#228b22',
    border: '#155715',
    name: 'Green Belt',
    meaning: 'Growth',
    description:
      'Green signals visible progress. Like a plant taking root, your techniques are developing shape, rhythm, and purpose.',
    isMain: true,
  },
  {
    color: '#1a4fc8',
    border: '#0f2f80',
    name: 'Blue Belt',
    meaning: 'Depth',
    description:
      'Blue is the open sky. Your understanding deepens beyond individual techniques — you begin to see the game: distance, timing, combination.',
    isMain: true,
  },
  {
    color: '#8b4513',
    border: '#5c2a00',
    name: 'Brown Belt',
    meaning: 'Harvest',
    description:
      'Brown is the ripening of everything you\'ve planted. Years of training start to bear real fruit — your movement becomes instinct, not thought.',
    isMain: true,
  },
  {
    color: '#cc0000',
    border: '#880000',
    name: 'Red Belt',
    meaning: 'Power & Responsibility',
    description:
      'Red is a signal of danger — a recognition that your skill now carries real force. Control, discipline, and respect are non-negotiable at this level.',
    isMain: true,
  },
]

const DANS = [
  {
    name: '1st Dan Black Belt',
    label: '1st Dan',
    description: 'Black absorbs all colours. Achieving your Black Belt is not the end — at Nine Dragons, it is the beginning of a deeper, lifelong pursuit. The first Dan marks mastery of the foundations.',
  },
  {
    name: '2nd Dan Black Belt',
    label: '2nd Dan',
    description: 'The second Dan brings with it a greater responsibility to the club, to newer students, and to the art itself. Teaching and mentoring become part of the path.',
  },
  {
    name: '3rd Dan Black Belt',
    label: '3rd Dan',
    description: 'The third Dan and beyond represent a lifetime of commitment. At this level the martial artist and the art are inseparable.',
  },
]

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
        <span className="eyebrow">09 ─── The Colours · Belt Progression</span>
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
        Every colour in our system carries meaning. Between each belt, a <strong className="text-foreground/80">Black Tag grading</strong> confirms you're ready to advance — a structured checkpoint before the next level is earned.
      </motion.p>

      {/* Belt progression */}
      <div className="space-y-2">
        {BELTS.map((belt, i) => (
          <div key={belt.name}>
            {/* Main belt card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="flex items-start gap-5 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-white/15 transition-colors"
            >
              {/* Belt swatch */}
              <div className="flex-shrink-0 flex flex-col items-center gap-1 pt-0.5">
                <div
                  className="w-10 h-10 rounded-full border-2"
                  style={{
                    background: belt.color,
                    borderColor: belt.border,
                    boxShadow: `0 0 14px ${belt.color}50`,
                  }}
                />
                <span className="text-[9px] text-foreground/30 tracking-wider uppercase">Belt</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-3 flex-wrap mb-1">
                  <h3 className="text-base font-bold text-foreground">{belt.name}</h3>
                  <span className="text-xs font-medium tracking-widest uppercase"
                        style={{ color: belt.color === '#ffffff' ? '#999' : belt.color }}>
                    {belt.meaning}
                  </span>
                </div>
                <p className="text-sm text-foreground/55 leading-relaxed">{belt.description}</p>
              </div>
            </motion.div>

            {/* Black tag intermediate — shown between every main belt except after Red */}
            {i < BELTS.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 + 0.1 }}
                className="flex items-center gap-4 px-5 py-2 ml-2"
              >
                {/* Tag swatch — split colour/black */}
                <div className="flex-shrink-0 flex items-center gap-0.5">
                  <div className="w-4 h-4 rounded-l-full border border-white/10"
                       style={{ background: belt.color }} />
                  <div className="w-4 h-4 rounded-r-full border border-white/10 bg-[#111]" />
                </div>
                <span className="text-[10px] tracking-[0.18em] uppercase text-foreground/30">
                  {belt.name.replace(' Belt', '')} Black Tag
                </span>
                <div className="h-px flex-1 bg-white/5" />
              </motion.div>
            )}
          </div>
        ))}

        {/* Red Black tag before Black Belt */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-4 px-5 py-2 ml-2"
        >
          <div className="flex-shrink-0 flex items-center gap-0.5">
            <div className="w-4 h-4 rounded-l-full border border-white/10 bg-[#cc0000]" />
            <div className="w-4 h-4 rounded-r-full border border-white/10 bg-[#111]" />
          </div>
          <span className="text-[10px] tracking-[0.18em] uppercase text-foreground/30">
            Red Black Tag
          </span>
          <div className="h-px flex-1 bg-white/5" />
        </motion.div>

        {/* Black Belt Dans */}
        {DANS.map((dan, i) => (
          <motion.div
            key={dan.name}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className={`flex items-start gap-5 p-5 rounded-2xl border transition-colors
              ${i === 0 ? 'bg-gold/5 border-gold/25' : 'bg-white/[0.02] border-white/[0.06]'}`}
          >
            {/* Black belt swatch with dan number */}
            <div className="flex-shrink-0 flex flex-col items-center gap-1 pt-0.5">
              <div
                className="w-10 h-10 rounded-full border-2 border-[#444] bg-[#111] flex items-center justify-center"
                style={{ boxShadow: i === 0 ? '0 0 20px rgba(201,161,74,0.3)' : '0 0 8px rgba(255,255,255,0.05)' }}
              >
                <span className="text-[9px] font-bold" style={{ color: '#c9a14a' }}>{i + 1}st</span>
              </div>
              <span className="text-[9px] text-foreground/30 tracking-wider uppercase">Dan</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-3 flex-wrap mb-1">
                <h3 className="text-base font-bold text-foreground">{dan.name}</h3>
                {i === 0 && <span className="text-xs font-medium tracking-widest uppercase text-gold">Mastery</span>}
              </div>
              <p className="text-sm text-foreground/55 leading-relaxed">{dan.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Medallion callout */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="mt-10 p-8 rounded-2xl border border-gold/30 bg-gold/5 text-center"
        style={{ boxShadow: '0 0 60px rgba(201,161,74,0.08)' }}
      >
        <div
          className="w-16 h-16 rounded-full border-2 border-gold/50 bg-gold/10 flex items-center justify-center mx-auto mb-5"
          style={{ boxShadow: '0 0 40px rgba(201,161,74,0.2)' }}
        >
          <span className="text-gold font-bold tracking-widest text-xs uppercase">Medal</span>
        </div>
        <h3 className="text-xl font-bold text-gold mb-3">The Nine Dragons Medallion</h3>
        <p className="text-foreground/60 text-sm leading-relaxed max-w-md mx-auto">
          Students who complete every belt in the Nine Dragons system receive the club medallion — a permanent mark of their dedication, discipline, and commitment to the Kaizendo way.
        </p>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-6 text-center text-xs text-foreground/30"
      >
        Gradings take place regularly throughout the year — speak to Master Martin for your next date.
      </motion.p>
    </section>
  )
}
