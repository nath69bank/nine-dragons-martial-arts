import { motion } from 'framer-motion'

interface DragonCrestProps {
  size?: number
  className?: string
}

export default function DragonCrest({ size = 220, className = '' }: DragonCrestProps) {
  const breathe = {
    animate: {
      scale: [1, 1.045, 1],
      filter: [
        'drop-shadow(0 0 8px rgba(201,161,74,0.4)) drop-shadow(0 0 24px rgba(26,79,200,0.25))',
        'drop-shadow(0 0 32px rgba(201,161,74,1.0)) drop-shadow(0 0 80px rgba(26,79,200,0.65))',
        'drop-shadow(0 0 8px rgba(201,161,74,0.4)) drop-shadow(0 0 24px rgba(26,79,200,0.25))',
      ],
    },
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' as const },
  }

  return (
    <motion.div
      className={`relative select-none ${className}`}
      style={{ width: size, height: size }}
      animate={{ y: [0, -14, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Ambient glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        animate={{
          boxShadow: [
            '0 0 24px 4px rgba(201,161,74,0.2), 0 0 60px 12px rgba(26,79,200,0.12)',
            '0 0 70px 20px rgba(201,161,74,0.7), 0 0 140px 45px rgba(26,79,200,0.4)',
            '0 0 24px 4px rgba(201,161,74,0.2), 0 0 60px 12px rgba(26,79,200,0.12)',
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* SVG logo — always loads, no broken state */}
      <motion.img
        src="/logo.jpeg"
        alt="Nine Dragons Martial Arts crest"
        draggable={false}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
        }}
        {...breathe}
      />
    </motion.div>
  )
}
