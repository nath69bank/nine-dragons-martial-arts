import { motion } from 'framer-motion'

interface DragonDividerProps {
  chapter: number
  title: string
  char?: string
}

export default function DragonDivider({ chapter, title, char = '龍' }: DragonDividerProps) {
  const num = String(chapter).padStart(2, '0')

  return (
    <div className="relative flex flex-col items-center py-10 md:py-14 px-5 overflow-hidden">

      {/* ── Horizontal rule with centre emblem ── */}
      <div className="flex items-center w-full max-w-4xl gap-4">
        {/* Left arm */}
        <motion.div
          className="flex-1 h-px"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            transformOrigin: 'right',
            background: 'linear-gradient(to left, rgba(201,161,74,0.45), transparent)',
          }}
        />

        {/* Centre diamond + chapter number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }}
          className="relative flex items-center justify-center shrink-0"
          style={{ width: 44, height: 44 }}
        >
          {/* Rotating outer ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              border: '1px solid rgba(201,161,74,0.25)',
              boxShadow: '0 0 16px rgba(201,161,74,0.15)',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
          {/* Static inner */}
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, hsl(222,65%,4%) 0%, hsl(222,65%,8%) 100%)',
              border: '1px solid rgba(201,161,74,0.4)',
            }}
          >
            <span
              className="select-none leading-none"
              style={{
                fontFamily: '"Instrument Serif", serif',
                fontSize: 14,
                color: 'rgba(201,161,74,0.8)',
              }}
            >
              {char}
            </span>
          </div>
        </motion.div>

        {/* Right arm */}
        <motion.div
          className="flex-1 h-px"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            transformOrigin: 'left',
            background: 'linear-gradient(to right, rgba(201,161,74,0.45), transparent)',
          }}
        />
      </div>

      {/* Chapter label */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="flex items-center gap-3 mt-4"
      >
        <span
          className="text-[10px] tracking-[0.3em] uppercase font-semibold"
          style={{ color: 'rgba(201,161,74,0.5)' }}
        >
          {num}
        </span>
        <span style={{ color: 'rgba(201,161,74,0.25)', fontSize: 10 }}>·</span>
        <span
          className="text-[10px] tracking-[0.3em] uppercase font-semibold"
          style={{ color: 'rgba(255,255,255,0.25)' }}
        >
          {title}
        </span>
      </motion.div>
    </div>
  )
}
