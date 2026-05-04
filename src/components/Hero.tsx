import { motion, useScroll, useTransform } from 'framer-motion'
import { MapPin, Clock } from 'lucide-react'
import EmberCanvas from './EmberCanvas'

export default function Hero() {
  const { scrollY } = useScroll()
  // Subtle parallax: content drifts up as you scroll, no opacity fade
  const contentY = useTransform(scrollY, [0, 500], [0, -50])

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-16"
    >
      {/* Backgrounds */}
      <div className="absolute inset-0 dragon-scales" />
      <EmberCanvas />

      {/* Central glow blob behind logo */}
      <motion.div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 900,
          height: 900,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -52%)',
          background:
            'radial-gradient(circle, rgba(26,79,200,0.22) 0%, rgba(201,161,74,0.07) 38%, transparent 68%)',
        }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Content stack — parallax wrapper */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 flex flex-col items-center text-center px-5 sm:px-6 gap-6 md:gap-9"
      >

        {/* ── Logo — the main event ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
          style={{
            width: 'clamp(200px, 52vw, 460px)',
            height: 'clamp(200px, 52vw, 460px)',
          }}
        >
          {/* Pulsing ambient glow */}
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            animate={{
              boxShadow: [
                '0 0 50px 12px rgba(201,161,74,0.18), 0 0 120px 30px rgba(26,79,200,0.12)',
                '0 0 120px 40px rgba(201,161,74,0.6),  0 0 260px 80px rgba(26,79,200,0.38)',
                '0 0 50px 12px rgba(201,161,74,0.18), 0 0 120px 30px rgba(26,79,200,0.12)',
              ],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Logo */}
          <motion.img
            src="/logo.jpeg"
            alt="Nine Dragons Martial Arts"
            draggable={false}
            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
            animate={{ y: [0, -16, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* ── Name ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55 }}
          className="flex flex-col items-center gap-2"
        >
          <h1
            className="font-bold text-white leading-none"
            style={{ fontSize: 'clamp(34px, 9vw, 104px)', letterSpacing: '-0.03em' }}
          >
            Nine Dragons
          </h1>
          <span
            className="text-[11px] font-semibold tracking-[0.45em] uppercase"
            style={{ color: '#c9a14a' }}
          >
            Martial Arts · Birkenhead
          </span>
        </motion.div>

        {/* ── Tagline ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.85, delay: 0.82 }}
          className="max-w-[360px] text-[14px] sm:text-[15px] leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.44)' }}
        >
          Traditional martial arts for all ages — taught by Master Martin, 3rd Dan.
          Dragon Cubs aged 5 through to adult Warriors.
        </motion.p>

        {/* ── CTAs ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 1.02 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-xs sm:max-w-none"
        >
          <a
            href="mailto:hello@ninedragonsmartialarts.co.uk?subject=Free Trial Request"
            className="w-full sm:w-auto text-center px-8 py-4 sm:py-3.5 rounded-full text-sm font-bold tracking-[0.18em] uppercase transition-opacity hover:opacity-88 active:scale-95 touch-target"
            style={{
              background: 'linear-gradient(135deg, #c9a14a 0%, #e0c060 50%, #c9a14a 100%)',
              color: '#0a1020',
              boxShadow: '0 0 44px rgba(201,161,74,0.3)',
            }}
          >
            Book Free Trial
          </a>
          <a
            href="#disciplines"
            className="text-sm font-medium transition-colors touch-target flex items-center justify-center"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            View Classes <span style={{ color: '#c9a14a' }} className="ml-1">→</span>
          </a>
        </motion.div>

        {/* ── Stats ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.2 }}
          className="flex items-center gap-8 sm:gap-16 pt-1"
        >
          {[
            { value: '500+', label: 'Students' },
            { value: '20+', label: 'Yrs Exp.' },
            { value: '6', label: 'Classes / Wk' },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <motion.span
                className="text-xl sm:text-3xl font-bold"
                style={{ color: '#c9a14a' }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.3, ease: [0.34, 1.56, 0.64, 1] }}
              >
                {value}
              </motion.span>
              <span
                className="text-[9px] sm:text-[10px] tracking-widest uppercase"
                style={{ color: 'rgba(255,255,255,0.3)' }}
              >
                {label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* ── Location + hours ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.35 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 text-xs sm:text-sm"
          style={{ color: 'rgba(255,255,255,0.3)' }}
        >
          <span className="flex items-center gap-2">
            <MapPin size={13} style={{ color: '#c9a14a' }} />
            St Annes Church Hall, Birkenhead
          </span>
          <span className="flex items-center gap-2">
            <Clock size={13} style={{ color: '#c9a14a' }} />
            Mon & Thu · 6 Classes / Week
          </span>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          className="w-px h-10"
          style={{ background: 'linear-gradient(to bottom, rgba(201,161,74,0.55), transparent)' }}
          animate={{ scaleY: [0, 1, 0], transformOrigin: 'top' }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{ background: 'linear-gradient(to top, hsl(220,65%,1%) 0%, transparent 100%)' }}
      />
    </section>
  )
}
