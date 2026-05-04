import { motion } from 'framer-motion'

const PARA1_WORDS =
  "We're not just teaching kicks and punches. We're shaping character, building resilience, and creating a community where every student — from age 5 to 55 — discovers what they're truly capable of. This is Kaizendo — the way of continuous improvement.".split(' ')

const PARA2_WORDS =
  "A dojo where dedication meets opportunity — where belt colours mark genuine growth, and every session pushes you one step closer to the warrior within.".split(' ')

function Paragraph({
  words,
  baseDelay = 0,
  className,
}: {
  words: string[]
  baseDelay?: number
  className?: string
}) {
  return (
    <p className={className}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ opacity: 0.08, y: 8, filter: 'blur(3px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{
            duration: 0.4,
            delay: baseDelay + i * 0.022,
            ease: 'easeOut',
          }}
          className="inline-block mr-[0.28em]"
        >
          {word}
        </motion.span>
      ))}
    </p>
  )
}

export default function Mission() {
  return (
    <section id="mission" className="relative py-16 md:py-32 border-t border-border/30">
      <div className="max-w-5xl mx-auto px-5 md:px-20">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="eyebrow">02 ─── Our Mission · The Way</span>
        </motion.div>

        {/* Paragraph 1 — words light up and stay */}
        <Paragraph
          words={PARA1_WORDS}
          baseDelay={0.1}
          className="text-2xl md:text-4xl lg:text-5xl font-medium tracking-[-1px] leading-snug mb-10"
        />

        {/* Paragraph 2 — starts after para 1 is mostly done */}
        <Paragraph
          words={PARA2_WORDS}
          baseDelay={0.05}
          className="text-xl md:text-2xl lg:text-3xl font-medium leading-snug"
        />

        {/* Attribution */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-12 flex items-center gap-4"
        >
          <div className="w-10 h-px bg-primary/50" />
          <span className="text-sm text-primary/80 font-medium tracking-wider">
            Master Martin — 3rd Dan, Kaizendo Kickboxing
          </span>
        </motion.div>
      </div>
    </section>
  )
}
