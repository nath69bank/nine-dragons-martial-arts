import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Hls from 'hls.js'
import EmberCanvas from './EmberCanvas'

const HLS_URL = ''

export default function JoinCTA() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !HLS_URL) return
    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(HLS_URL)
      hls.attachMedia(video)
      return () => hls.destroy()
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = HLS_URL
    }
  }, [])

  const hasVideo = Boolean(HLS_URL)

  return (
    <section
      id="join"
      className="relative py-20 md:py-40 border-t border-border/30 overflow-hidden text-center"
    >
      {/* Background */}
      {hasVideo ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          <div className="absolute inset-0 bg-background/60 z-[1]" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 z-0">
            <EmberCanvas />
          </div>
          <div
            className="absolute inset-0 pointer-events-none z-[1]"
            style={{
              background:
                'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(20,55,140,0.22) 0%, rgba(1,8,16,0.55) 70%)',
            }}
          />
        </>
      )}

      <div className="absolute inset-0 dragon-scales z-[2] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-5 sm:px-8 flex flex-col items-center gap-6 md:gap-7">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            animate={{
              boxShadow: [
                '0 0 30px 6px rgba(201,161,74,0.2), 0 0 80px 20px rgba(26,79,200,0.12)',
                '0 0 70px 20px rgba(201,161,74,0.55), 0 0 160px 50px rgba(26,79,200,0.35)',
                '0 0 30px 6px rgba(201,161,74,0.2), 0 0 80px 20px rgba(26,79,200,0.12)',
              ],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.img
            src="/logo.jpeg"
            alt="Nine Dragons Martial Arts"
            draggable={false}
            className="rounded-full"
            style={{ width: 120, height: 120, objectFit: 'cover' }}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="eyebrow !mb-0"
        >
          08 ─── Your Turn · Begin
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="font-bold tracking-tight leading-none"
          style={{ fontSize: 'clamp(38px, 7vw, 80px)' }}
        >
          Your first class is{' '}
          <em
            className="font-serif italic font-normal"
            style={{ color: 'hsl(var(--primary))' }}
          >
            free.
          </em>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="text-muted-foreground text-base leading-relaxed max-w-md"
        >
          No commitment, no experience needed. Just show up, try a class, and see what Nine Dragons
          can do for you or your child.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.24 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <a
            href="mailto:hello@ninedragonsmartialarts.co.uk?subject=Free Trial Request"
            className="px-8 py-3.5 rounded-full text-sm font-bold tracking-[0.18em] uppercase transition-opacity hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, #c9a14a 0%, #e0c060 50%, #c9a14a 100%)',
              color: '#0a1020',
              boxShadow: '0 0 40px rgba(201,161,74,0.28)',
            }}
          >
            Book Free Trial
          </a>
          <a
            href="#disciplines"
            className="liquid-glass rounded-full px-8 py-3.5 text-sm font-medium text-foreground"
          >
            Explore Classes
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.32 }}
          className="text-muted-foreground text-sm"
        >
          Or email{' '}
          <a
            href="mailto:hello@ninedragonsmartialarts.co.uk"
            className="text-primary hover:underline"
          >
            hello@ninedragonsmartialarts.co.uk
          </a>
        </motion.p>
      </div>
    </section>
  )
}
