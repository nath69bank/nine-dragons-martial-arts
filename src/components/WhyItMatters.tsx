import { motion } from 'framer-motion'

const PILLARS = [
  {
    char: '心',
    name: 'Discipline',
    chinese: '纪律',
    description:
      'Every class builds mental focus, self-control, and the habit of showing up — skills that transfer far beyond the dojo.',
  },
  {
    char: '体',
    name: 'Strength',
    chinese: '力量',
    description:
      'Kaizendo Kickboxing and traditional forms develop real physical conditioning — coordination, power, and lasting fitness.',
  },
  {
    char: '道',
    name: 'Community',
    chinese: '社区',
    description:
      'From Dragon Cubs to Dragon Masters, every student grows alongside a family that supports their journey at every belt.',
  },
]

export default function WhyItMatters() {
  return (
    <section id="philosophy" className="relative py-14 md:py-32 border-t border-border/30">
      <div className="max-w-7xl mx-auto px-5 md:px-20">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <span className="eyebrow">01 ─── Philosophy · The Code</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16"
        >
          <h2 className="section-h2 mb-0">
            Martial arts will{' '}
            <em>forge you.</em>
          </h2>
          <p className="text-muted-foreground text-base max-w-sm">
            Whether you're 5 or 55, a first session at Nine Dragons changes something.
          </p>
        </motion.div>

        {/* Three pillar cards */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-16">
          {PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: 0.08 + i * 0.1, ease: 'easeOut' }}
              className="group gold-card rounded-2xl p-8 flex flex-col gap-5 relative overflow-hidden"
            >
              <div className="absolute inset-0 dragon-scales opacity-30" />

              {/* Large decorative char */}
              <div className="relative z-10 flex items-center gap-4">
                <span
                  className="select-none leading-none float-char"
                  style={{
                    fontFamily: '"Instrument Serif", serif',
                    fontSize: '52px',
                    color: 'rgba(201,161,74,0.75)',
                    textShadow: '0 0 28px rgba(201,161,74,0.4)',
                    animationDelay: `${i * 0.5}s`,
                  }}
                >
                  {pillar.char}
                </span>
                <div>
                  <p className="font-semibold text-base text-white">{pillar.name}</p>
                  <p
                    className="text-[10px] tracking-widest uppercase mt-0.5"
                    style={{ color: 'rgba(201,161,74,0.6)' }}
                  >
                    {pillar.chinese}
                  </p>
                </div>
              </div>

              <p
                className="relative z-10 text-sm leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-sm"
          style={{ color: 'rgba(255,255,255,0.28)' }}
        >
          If you don't take the first step, someone else will take it for you.
        </motion.p>
      </div>
    </section>
  )
}
