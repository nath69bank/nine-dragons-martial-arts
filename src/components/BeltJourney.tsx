import { motion } from 'framer-motion'

type BeltEntry = {
  name: string
  meaning: string
  description: string
  primary: string
  secondary?: string // for dual-colour belts (e.g. Purple Black)
  border: string
  isDan?: boolean
  danLabel?: string
}

const BELTS: BeltEntry[] = [
  {
    name: 'White Belt',
    meaning: 'The Beginning',
    primary: '#ffffff',
    border: '#999999',
    description:
      'White is a blank canvas. You arrive with no knowledge and no preconceptions — open to everything the training has to offer. Every Black Belt started exactly here.',
  },
  {
    name: 'Purple Belt',
    meaning: 'Awakening',
    primary: '#800080',
    border: '#500050',
    description:
      'Purple marks your first real step into structured kickboxing. The basics are taking hold — you\'re learning to move, strike, and think like a martial artist.',
  },
  {
    name: 'Purple Black Belt',
    meaning: 'Consolidation',
    primary: '#800080',
    secondary: '#111111',
    border: '#500050',
    description:
      'Purple Black confirms that your Purple Belt standard is solid. Technique is consistent, attitude is right, and you\'re ready to push into the next colour.',
  },
  {
    name: 'Green Belt',
    meaning: 'Growth',
    primary: '#228b22',
    border: '#155715',
    description:
      'Green signals visible progress. Like a plant taking root and pushing upward, your techniques are developing shape, rhythm, and genuine power.',
  },
  {
    name: 'Green Black Belt',
    meaning: 'Depth of Growth',
    primary: '#228b22',
    secondary: '#111111',
    border: '#155715',
    description:
      'Green Black builds on everything learned at Green — sharper combinations, better footwork, and the beginnings of real ring awareness.',
  },
  {
    name: 'Blue Belt',
    meaning: 'Depth',
    primary: '#1a4fc8',
    border: '#0f2f80',
    description:
      'Blue is the open sky. Your understanding deepens beyond individual techniques. Distance, timing, combination, and defence start to work as one.',
  },
  {
    name: 'Blue Black Belt',
    meaning: 'Clarity',
    primary: '#1a4fc8',
    secondary: '#111111',
    border: '#0f2f80',
    description:
      'Blue Black is where things click. Movement becomes more natural and less deliberate — the body starts to remember what the mind has been teaching it.',
  },
  {
    name: 'Brown Belt',
    meaning: 'Harvest',
    primary: '#8b4513',
    border: '#5c2a00',
    description:
      'Brown is the ripening of everything you\'ve planted. Years of training bear real fruit — your movement becomes instinct, not thought. The Black Belt is now within sight.',
  },
  {
    name: 'Brown Black Belt',
    meaning: 'Readiness',
    primary: '#8b4513',
    secondary: '#111111',
    border: '#5c2a00',
    description:
      'Brown Black is a final proving ground. Technique, attitude, composure under pressure — everything is assessed before the step to Red.',
  },
  {
    name: 'Red Belt',
    meaning: 'Power & Responsibility',
    primary: '#cc0000',
    border: '#880000',
    description:
      'Red is a signal of danger. Your skill now carries real force. At Red Belt, control and discipline are non-negotiable — you are entering advanced territory.',
  },
  {
    name: 'Red Black Belt',
    meaning: 'The Final Step',
    primary: '#cc0000',
    secondary: '#111111',
    border: '#880000',
    description:
      'Red Black is the last belt before Black. Everything is refined. Composure, power, technique, and character — all must be at the standard required of a Nine Dragons Black Belt.',
  },
  {
    name: '1st Dan Black Belt',
    meaning: 'Mastery',
    primary: '#111111',
    border: '#c9a14a',
    danLabel: '1st',
    isDan: true,
    description:
      'Black absorbs all colours. Earning your Black Belt is not the end — at Nine Dragons it is a beginning. The first Dan marks mastery of the foundations and the start of a deeper pursuit.',
  },
  {
    name: '2nd Dan Black Belt',
    meaning: 'Teaching',
    primary: '#111111',
    border: '#888888',
    danLabel: '2nd',
    isDan: true,
    description:
      'The second Dan carries a greater responsibility — to the club, to newer students, and to the art. Mentoring others becomes part of the path.',
  },
  {
    name: '3rd Dan Black Belt',
    meaning: 'Legacy',
    primary: '#111111',
    border: '#888888',
    danLabel: '3rd',
    isDan: true,
    description:
      'The third Dan and beyond represent a lifetime of commitment. At this level the martial artist and the art are inseparable.',
  },
]

export default function BeltJourney() {
  return (
    <div className="p-6 lg:p-10 max-w-3xl">
      <h1 className="text-2xl font-bold text-foreground mb-2">Belt Progression</h1>
      <p className="text-foreground/50 text-sm mb-10 leading-relaxed max-w-lg">
        Every belt in the Nine Dragons system carries meaning. This is your full journey — from White to Black and beyond.
      </p>

      <div className="space-y-3">
        {BELTS.map((belt, i) => (
          <motion.div
            key={belt.name}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: i * 0.04 }}
            className={`flex items-start gap-5 p-5 rounded-2xl border transition-colors
              ${belt.isDan && belt.danLabel === '1st'
                ? 'bg-gold/5 border-gold/25'
                : 'bg-white/[0.03] border-white/[0.07]'}`}
          >
            {/* Belt visual */}
            <div className="flex-shrink-0 pt-0.5">
              {belt.secondary ? (
                // Dual-colour belt (e.g. Purple Black)
                <div className="flex rounded-full overflow-hidden w-10 h-10 border-2"
                     style={{ borderColor: belt.border }}>
                  <div className="flex-1" style={{ background: belt.primary }} />
                  <div className="flex-1 bg-[#111]" />
                </div>
              ) : belt.isDan ? (
                // Dan black belt with gold/numbered indicator
                <div
                  className="w-10 h-10 rounded-full border-2 bg-[#111] flex items-center justify-center"
                  style={{
                    borderColor: belt.border,
                    boxShadow: belt.danLabel === '1st' ? '0 0 18px rgba(201,161,74,0.35)' : undefined,
                  }}
                >
                  <span className="text-[9px] font-bold text-gold">{belt.danLabel}</span>
                </div>
              ) : (
                // Single-colour belt
                <div
                  className="w-10 h-10 rounded-full border-2"
                  style={{
                    background: belt.primary,
                    borderColor: belt.border,
                    boxShadow: `0 0 12px ${belt.primary}45`,
                  }}
                />
              )}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-3 flex-wrap mb-1">
                <h3 className="text-sm font-bold text-foreground">{belt.name}</h3>
                <span
                  className="text-[10px] font-semibold tracking-widest uppercase"
                  style={{ color: belt.primary === '#ffffff' ? '#888' : belt.primary === '#111111' ? '#c9a14a' : belt.primary }}
                >
                  {belt.meaning}
                </span>
              </div>
              <p className="text-sm text-foreground/50 leading-relaxed">{belt.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Medallion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-8 p-7 rounded-2xl border border-gold/30 bg-gold/5 text-center"
        style={{ boxShadow: '0 0 50px rgba(201,161,74,0.07)' }}
      >
        <div className="w-14 h-14 rounded-full border-2 border-gold/50 bg-gold/10 flex items-center justify-center mx-auto mb-4"
             style={{ boxShadow: '0 0 30px rgba(201,161,74,0.2)' }}>
          <span className="text-[10px] font-bold text-gold tracking-widest uppercase">Medal</span>
        </div>
        <h3 className="text-lg font-bold text-gold mb-2">The Nine Dragons Medallion</h3>
        <p className="text-foreground/55 text-sm leading-relaxed max-w-sm mx-auto">
          Students who complete every belt in the Nine Dragons system receive the club medallion — a permanent mark of dedication, discipline, and the Kaizendo spirit of never-ending improvement.
        </p>
      </motion.div>
    </div>
  )
}
