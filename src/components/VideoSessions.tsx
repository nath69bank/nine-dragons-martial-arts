import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { PublicSession } from '@/types/database'
import { cn } from '@/lib/utils'

// Convert any YouTube URL to an embed URL
function toEmbedUrl(url: string): string {
  try {
    const u = new URL(url)
    // youtu.be/ID
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed${u.pathname}?autoplay=1&rel=0`
    }
    // youtube.com/watch?v=ID
    if (u.hostname.includes('youtube.com') && u.searchParams.get('v')) {
      return `https://www.youtube.com/embed/${u.searchParams.get('v')}?autoplay=1&rel=0`
    }
    // already an embed or Vimeo
    return url
  } catch {
    return url
  }
}

// Extract a thumbnail from a YouTube URL
function getThumbnail(session: PublicSession): string | null {
  if (session.thumbnail_url) return session.thumbnail_url
  try {
    const u = new URL(session.video_url)
    let id: string | null = null
    if (u.hostname === 'youtu.be') id = u.pathname.slice(1)
    if (u.hostname.includes('youtube.com')) id = u.searchParams.get('v')
    if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`
  } catch { /* noop */ }
  return null
}

const CATEGORY_ALL = 'All'

export default function VideoSessions() {
  const [sessions, setSessions]   = useState<PublicSession[]>([])
  const [loaded, setLoaded]       = useState(false)
  const [category, setCategory]   = useState(CATEGORY_ALL)
  const [playing, setPlaying]     = useState<PublicSession | null>(null)

  useEffect(() => {
    supabase
      .from('public_sessions')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true })
      .then(({ data }) => { setSessions(data ?? []); setLoaded(true) })
  }, [])

  const categories = [CATEGORY_ALL, ...Array.from(new Set(sessions.map(s => s.category)))]
  const filtered   = category === CATEGORY_ALL ? sessions : sessions.filter(s => s.category === category)

  const close = useCallback(() => setPlaying(null), [])

  const prev = useCallback(() => {
    if (!playing) return
    const idx = filtered.findIndex(s => s.id === playing.id)
    setPlaying(filtered[(idx - 1 + filtered.length) % filtered.length])
  }, [playing, filtered])

  const next = useCallback(() => {
    if (!playing) return
    const idx = filtered.findIndex(s => s.id === playing.id)
    setPlaying(filtered[(idx + 1) % filtered.length])
  }, [playing, filtered])

  useEffect(() => {
    document.body.style.overflow = playing ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [playing])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [close, prev, next])

  // Don't render the section if there are no published sessions
  if (loaded && sessions.length === 0) return null

  return (
    <section id="sessions" className="relative py-14 md:py-32 bg-background border-t border-border/30">
      <div className="max-w-7xl mx-auto px-5 md:px-20">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-3"
        >
          <span className="eyebrow">Session Footage · Social Proof</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.06 }}
          className="text-center mb-4"
        >
          <h2 className="section-h2">
            See the <em>Work</em>
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto text-center mb-10 md:mb-12"
        >
          Real sessions. Real students. No polish — just the grind that builds warriors.
        </motion.p>

        {/* Category filter */}
        {categories.length > 2 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-12"
          >
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  'px-4 md:px-6 py-2 rounded-full text-sm font-medium transition-all duration-300',
                  category === cat
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                    : 'liquid-glass text-muted-foreground hover:text-foreground'
                )}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        )}

        {/* Video grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((session, i) => {
              const thumb = getThumbnail(session)
              return (
                <motion.button
                  key={session.id}
                  layout
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25, delay: Math.min(i * 0.05, 0.3) }}
                  onClick={() => setPlaying(session)}
                  className="group relative rounded-2xl overflow-hidden aspect-video text-left cursor-pointer bg-white/5 border border-white/10 hover:border-gold/40 transition-colors"
                >
                  {/* Thumbnail */}
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={session.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 dragon-scales opacity-30" />
                  )}

                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-gold/90 backdrop-blur-sm flex items-center justify-center shadow-xl shadow-black/40 group-hover:scale-110 transition-transform duration-300">
                      <Play size={22} className="text-background ml-1" fill="currentColor" />
                    </div>
                  </div>

                  {/* Category badge */}
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-semibold tracking-widest uppercase px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-gold/80">
                      {session.category}
                    </span>
                  </div>

                  {/* Title bar */}
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                    <p className="text-white text-sm font-semibold leading-tight">{session.title}</p>
                    {session.description && (
                      <p className="text-white/50 text-xs mt-0.5 line-clamp-1">{session.description}</p>
                    )}
                  </div>
                </motion.button>
              )
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Video Lightbox ── */}
      <AnimatePresence>
        {playing && (
          <motion.div
            key="video-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(1,5,14,0.97)', backdropFilter: 'blur(12px)' }}
            onClick={close}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.93 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.93 }}
              transition={{ duration: 0.22 }}
              className="relative w-full max-w-4xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Video frame */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl">
                <iframe
                  src={toEmbedUrl(playing.video_url)}
                  title={playing.title}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>

              {/* Controls */}
              <button
                onClick={close}
                className="absolute -top-12 right-0 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
                style={{ background: 'rgba(255,255,255,0.1)' }}
              >
                <X size={16} />
              </button>

              {filtered.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-14 hidden md:flex w-11 h-11 rounded-full items-center justify-center text-white/60 hover:text-white transition-colors"
                    style={{ background: 'rgba(255,255,255,0.08)' }}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-14 hidden md:flex w-11 h-11 rounded-full items-center justify-center text-white/60 hover:text-white transition-colors"
                    style={{ background: 'rgba(255,255,255,0.08)' }}
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Caption */}
              <div className="mt-4 px-1">
                <p className="text-white/80 font-semibold">{playing.title}</p>
                {playing.description && <p className="text-white/40 text-sm mt-1">{playing.description}</p>}
                <p className="text-gold/50 text-xs tracking-widest uppercase mt-1">{playing.category}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
