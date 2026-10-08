import { useState, useCallback, useEffect, useRef, useLayoutEffect } from 'react'
import { X, Play, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { gsap, reveal } from '@/lib/scrollReveal'

// ─────────────────────────────────────────────────────────
// SESSION CLIP DATA — edit directly, no backend required.
// video_url: a YouTube/Vimeo URL (watch or share link — converted
// to an embed automatically). thumbnail_url: optional, auto-pulled
// from YouTube when left blank.
// ─────────────────────────────────────────────────────────
interface SessionClip {
  id: string
  title: string
  description: string | null
  video_url: string
  thumbnail_url: string | null
  category: string
}

const SESSIONS: SessionClip[] = [
  // { id: '1', title: 'Friday Sparring — June 2025', description: 'Full-contact rounds, Dragon Warriors class.', video_url: 'https://youtu.be/VIDEO_ID', thumbnail_url: null, category: 'Sparring' },
]

// Convert any YouTube URL to an embed URL
function toEmbedUrl(url: string): string {
  try {
    const u = new URL(url)
    if (u.hostname === 'youtu.be') return `https://www.youtube.com/embed${u.pathname}?autoplay=1&rel=0`
    if (u.hostname.includes('youtube.com') && u.searchParams.get('v')) {
      return `https://www.youtube.com/embed/${u.searchParams.get('v')}?autoplay=1&rel=0`
    }
    return url
  } catch {
    return url
  }
}

function getThumbnail(session: SessionClip): string | null {
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
  const [category, setCategory] = useState(CATEGORY_ALL)
  const [playing, setPlaying]   = useState<SessionClip | null>(null)

  const sectionRef  = useRef<HTMLDivElement>(null)
  const eyebrowRef  = useRef<HTMLDivElement>(null)
  const titleRef    = useRef<HTMLDivElement>(null)
  const leadRef     = useRef<HTMLParagraphElement>(null)
  const filterRef   = useRef<HTMLDivElement>(null)
  const gridRef     = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const panelRef    = useRef<HTMLDivElement>(null)

  const categories = [CATEGORY_ALL, ...Array.from(new Set(SESSIONS.map(s => s.category)))]
  const filtered   = category === CATEGORY_ALL ? SESSIONS : SESSIONS.filter(s => s.category === category)

  const close = useCallback(() => {
    if (!backdropRef.current || !panelRef.current) { setPlaying(null); return }
    gsap.timeline({ onComplete: () => setPlaying(null) })
      .to(panelRef.current, { opacity: 0, scale: 0.93, duration: 0.18, ease: 'power2.in' }, 0)
      .to(backdropRef.current, { opacity: 0, duration: 0.2 }, 0)
  }, [])

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

  // Entrance reveals
  useLayoutEffect(() => {
    if (SESSIONS.length === 0) return
    const ctx = gsap.context(() => {
      reveal(eyebrowRef.current, { from: { y: 20 } })
      reveal(titleRef.current, { from: { y: 20 }, delay: 0.06 })
      reveal(leadRef.current, { from: { y: 20 }, delay: 0.1 })
      if (filterRef.current) reveal(filterRef.current, { from: { y: 16 }, delay: 0.12 })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  // Grid entrance + category-change fade
  useLayoutEffect(() => {
    if (!gridRef.current || gridRef.current.children.length === 0) return
    const ctx = gsap.context(() => {
      reveal(gridRef.current!.children, { from: { y: 20, scale: 0.94 }, duration: 0.4, stagger: 0.05, trigger: gridRef.current, start: 'top 88%' })
    })
    return () => ctx.revert()
  }, [category])

  // Lightbox open animation
  useLayoutEffect(() => {
    if (!playing || !backdropRef.current || !panelRef.current) return
    gsap.set(backdropRef.current, { opacity: 0 })
    gsap.set(panelRef.current, { opacity: 0, scale: 0.93 })
    gsap.to(backdropRef.current, { opacity: 1, duration: 0.2 })
    gsap.to(panelRef.current, { opacity: 1, scale: 1, duration: 0.25, ease: 'power3.out' })
  }, [playing])

  if (SESSIONS.length === 0) return null

  return (
    <section id="sessions" ref={sectionRef} className="relative py-14 md:py-32 bg-background border-t border-border/30">
      <div className="max-w-7xl mx-auto px-5 md:px-20">

        <div ref={eyebrowRef} className="text-center mb-3">
          <span className="eyebrow">Session Footage · Social Proof</span>
        </div>

        <div ref={titleRef} className="text-center mb-4">
          <h2 className="section-h2">
            See the <em>Work</em>
          </h2>
        </div>

        <p ref={leadRef} className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto text-center mb-10 md:mb-12">
          Real sessions. Real students. No polish — just the grind that builds warriors.
        </p>

        {/* Category filter */}
        {categories.length > 2 && (
          <div ref={filterRef} className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-12">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  'px-4 md:px-6 py-2 rounded-full text-sm font-medium transition-colors duration-300',
                  category === cat
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                    : 'liquid-glass text-muted-foreground hover:text-foreground'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Video grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filtered.map(session => {
            const thumb = getThumbnail(session)
            return (
              <button
                key={session.id}
                onClick={() => setPlaying(session)}
                className="group relative rounded-2xl overflow-hidden aspect-video text-left cursor-pointer bg-white/5 border border-white/10 hover:border-gold/40 transition-colors"
              >
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

                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-gold/90 backdrop-blur-sm flex items-center justify-center shadow-xl shadow-black/40 group-hover:scale-110 transition-transform duration-300">
                    <Play size={22} className="text-background ml-1" fill="currentColor" />
                  </div>
                </div>

                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-semibold tracking-widest uppercase px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-gold/80">
                    {session.category}
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <p className="text-white text-sm font-semibold leading-tight">{session.title}</p>
                  {session.description && (
                    <p className="text-white/50 text-xs mt-0.5 line-clamp-1">{session.description}</p>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Video Lightbox ── */}
      {playing && (
        <div
          ref={backdropRef}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(1,5,14,0.97)', backdropFilter: 'blur(12px)' }}
          onClick={close}
        >
          <div ref={panelRef} className="relative w-full max-w-4xl" onClick={e => e.stopPropagation()}>
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl">
              <iframe
                src={toEmbedUrl(playing.video_url)}
                title={playing.title}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>

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

            <div className="mt-4 px-1">
              <p className="text-white/80 font-semibold">{playing.title}</p>
              {playing.description && <p className="text-white/40 text-sm mt-1">{playing.description}</p>}
              <p className="text-gold/50 text-xs tracking-widest uppercase mt-1">{playing.category}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
