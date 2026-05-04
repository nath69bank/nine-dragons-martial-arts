import { motion } from 'framer-motion'

const STAGES = [
  {
    stage: 1,
    name: 'Dragon Cubs',
    chinese: '小龙',
    char: '初',
    ages: '5 – 7',
    description:
      'The first step. Fun, energetic sessions that build coordination, listening skills, and confidence through movement and play. Every warrior begins here.',
  },
  {
    stage: 2,
    name: 'Dragon Sparks',
    chinese: '火花',
    char: '学',
    ages: '8 – 12',
    description:
      'The discipline takes shape. Techniques grow more structured as students build focus, self-control, and a strong martial arts foundation.',
  },
  {
    stage: 3,
    name: 'Dragon Ninjas',
    chinese: '忍者',
    char: '練',
    ages: '13 – 16',
    description:
      'Precision and purpose. Teen classes channel energy into technical sparring, leadership skills, and real competitive fundamentals.',
  },
  {
    stage: 4,
    name: 'Dragon Warriors',
    chinese: '武士',
    char: '戦',
    ages: '16+',
    description:
      'The full programme. Traditional forms meet Kaizendo Kickboxing — physical conditioning, competition preparation, and lifelong craft.',
  },
  {
    stage: 5,
    name: 'Dragon Masters',
    chinese: '大师',
    char: '道',
    ages: 'Black Belt+',
    description:
      'Beyond the belt. Advanced study for black belt holders — refining technique, exploring deeper principles, and giving back through mentorship.',
  },
]

const KAIZENDO = {
  name: 'Kaizendo Kickboxing',
  chinese: '改善道',
  char: '極',
  ages: 'All Adults',
  description:
    "The pinnacle. Master Martin's specialist discipline — a dynamic fusion of kickboxing and the philosophy of continuous improvement, as passed down from Grand Master Frank Murphy, 8th Dan.",
}

export default function Disciplines() {
  return (
    <section id="disciplines" className="relative py-14 md:py-32 border-t border-border/30">
      <div className="max-w-4xl mx-auto px-5 md:px-20">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <span className="eyebrow">03 ─── Disciplines · The Path</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16 md:mb-20"
        >
          <h2 className="section-h2 mb-0">
            Every Dragon<br />starts as a <em>Cub.</em>
          </h2>
          <p className="text-muted-foreground text-base max-w-xs">
            Five stages of growth, one unbroken path. Where does yours begin?
          </p>
        </motion.div>

        {/* ── Journey path ── */}
        <div className="relative">

          {/* Vertical connecting line */}
          <motion.div
            className="absolute left-[19px] top-6 bottom-24 w-px pointer-events-none"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.4, ease: 'easeInOut', delay: 0.2 }}
            style={{
              transformOrigin: 'top',
              background: 'linear-gradient(to bottom, rgba(201,161,74,0.6) 0%, rgba(201,161,74,0.15) 80%, transparent 100%)',
            }}
          />

          {/* Stages */}
          {STAGES.map((stage, i) => (
            <motion.div
              key={stage.name}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: 0.1 + i * 0.1, ease: 'easeOut' }}
              className="relative flex gap-6 md:gap-8 mb-8 md:mb-10"
            >
              {/* Stage dot */}
              <div className="relative shrink-0 flex flex-col items-center" style={{ width: 40 }}>
                <motion.div
                  className="w-10 h-10 rounded-full flex items-center justify-center relative z-10"
                  style={{
                    background: 'linear-gradient(135deg, hsl(222,65%,6%) 0%, hsl(222,65%,10%) 100%)',
                    border: '1px solid rgba(201,161,74,0.4)',
                    boxShadow: '0 0 16px rgba(201,161,74,0.12)',
                  }}
                  whileInView={{ boxShadow: ['0 0 16px rgba(201,161,74,0.12)', '0 0 28px rgba(201,161,74,0.35)', '0 0 16px rgba(201,161,74,0.12)'] }}
                  viewport={{ once: false }}
                  transition={{ duration: 2.5, delay: i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <span
                    className="text-[11px] font-bold tabular-nums"
                    style={{ color: '#c9a14a' }}
                  >
                    {String(stage.stage).padStart(2, '0')}
                  </span>
                </motion.div>
              </div>

              {/* Card */}
              <div
                className="flex-1 gold-card rounded-2xl p-5 md:p-7 relative overflow-hidden group"
                style={{ marginTop: 2 }}
              >
                <div className="absolute inset-0 dragon-scales opacity-20 pointer-events-none" />

                {/* Large bg character */}
                <span
                  className="absolute right-4 top-2 select-none float-char pointer-events-none"
                  style={{
                    fontFamily: '"Instrument Serif", serif',
                    fontSize: 72,
                    color: 'rgba(201,161,74,0.06)',
                    lineHeight: 1,
                    animationDelay: `${i * 0.6}s`,
                  }}
                >
                  {stage.char}
                </span>

                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span
                        className="text-[9px] tracking-[0.28em] uppercase font-semibold block mb-1"
                        style={{ color: 'rgba(201,161,74,0.5)' }}
                      >
                        Stage {String(stage.stage).padStart(2, '0')}
                      </span>
                      <h3 className="font-bold text-lg text-foreground leading-tight">{stage.name}</h3>
                      <p className="text-[11px] tracking-widest uppercase mt-1" style={{ color: '#c9a14a' }}>
                        {stage.chinese} · Ages {stage.ages}
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{stage.description}</p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* ── Kaizendo: The Pinnacle ── */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="relative ml-0 mt-4"
          >
            {/* Connector from last dot to pinnacle */}
            <div className="absolute left-5 -top-8 w-px h-8 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(201,161,74,0.4), rgba(201,161,74,0.15))' }} />

            {/* Summit marker */}
            <div className="flex items-center gap-3 mb-4 pl-1">
              <motion.div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 relative z-10"
                style={{
                  background: 'linear-gradient(135deg, rgba(201,161,74,0.2) 0%, rgba(201,161,74,0.08) 100%)',
                  border: '1px solid rgba(201,161,74,0.65)',
                  boxShadow: '0 0 24px rgba(201,161,74,0.3)',
                }}
                animate={{ boxShadow: ['0 0 24px rgba(201,161,74,0.3)', '0 0 44px rgba(201,161,74,0.6)', '0 0 24px rgba(201,161,74,0.3)'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span style={{ color: '#c9a14a', fontSize: 14, fontFamily: '"Instrument Serif", serif' }}>極</span>
              </motion.div>
              <div>
                <span className="text-[9px] tracking-[0.3em] uppercase font-bold block" style={{ color: 'rgba(201,161,74,0.7)' }}>
                  The Pinnacle
                </span>
                <span className="text-[9px] tracking-[0.2em] uppercase" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  Master Martin's Signature Discipline
                </span>
              </div>
            </div>

            {/* Kaizendo card */}
            <div
              className="relative rounded-2xl p-7 md:p-9 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, hsl(222,65%,5%) 0%, hsl(222,65%,8%) 100%)',
                border: '1px solid rgba(201,161,74,0.4)',
                boxShadow: '0 0 60px rgba(201,161,74,0.08), 0 0 120px rgba(26,79,200,0.06)',
              }}
            >
              <div className="absolute inset-0 dragon-scales opacity-30" />
              <div
                className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
                style={{ background: 'radial-gradient(circle at 80% 20%, rgba(201,161,74,0.06), transparent 55%)' }}
              />

              {/* Background Chinese characters */}
              <span
                className="absolute right-6 bottom-2 select-none float-char pointer-events-none"
                style={{
                  fontFamily: '"Instrument Serif", serif',
                  fontSize: 100,
                  color: 'rgba(201,161,74,0.05)',
                  lineHeight: 1,
                }}
              >
                {KAIZENDO.chinese}
              </span>

              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
                  <div>
                    <span
                      className="text-[9px] tracking-[0.28em] uppercase font-semibold block mb-2"
                      style={{ color: 'rgba(201,161,74,0.6)' }}
                    >
                      {KAIZENDO.ages}
                    </span>
                    <h3 className="font-bold text-2xl md:text-3xl text-foreground leading-tight">
                      {KAIZENDO.name}
                    </h3>
                  </div>
                  <span
                    className="shrink-0 text-[9px] tracking-[0.25em] uppercase px-3 py-1.5 rounded-full self-start sm:mt-8"
                    style={{
                      background: 'rgba(201,161,74,0.1)',
                      border: '1px solid rgba(201,161,74,0.3)',
                      color: '#c9a14a',
                    }}
                  >
                    Signature
                  </span>
                </div>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{KAIZENDO.description}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Call to action beneath the path */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <div className="w-10 h-px" style={{ background: 'rgba(201,161,74,0.4)' }} />
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.28)' }}>
            Not sure where you fit? Your first class is free — try it and find out.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
