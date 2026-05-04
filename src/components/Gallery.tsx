import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Camera, ImageOff } from 'lucide-react'
import { fadeUp, cn } from '@/lib/utils'

// ─────────────────────────────────────────────────────────
// PHOTO DATA
// To add real photos: place images in public/gallery/ then
// set the src field below. e.g. src: '/gallery/morning-drills.jpg'
// Leave src as '' and the tile shows a styled placeholder.
// ─────────────────────────────────────────────────────────

type Category = 'All' | 'Training' | 'Grading' | 'Events' | 'Seminars'

interface Photo {
  id: number
  src: string
  alt: string
  label: string
  category: Category
  featured?: boolean
}

const PHOTOS: Photo[] = [
  { id: 1,  src: '', alt: 'Morning training drills',          label: 'Morning Drills',           category: 'Training',  featured: true  },
  { id: 2,  src: '', alt: 'Yellow belt grading ceremony',     label: 'Yellow Belt Ceremony',     category: 'Grading'                   },
  { id: 3,  src: '', alt: 'Students sparring in class',       label: 'Sparring Session',         category: 'Training'                  },
  { id: 4,  src: '', alt: 'Community day at the dojo',        label: 'Community Day',            category: 'Events',    featured: true  },
  { id: 5,  src: '', alt: 'Kickboxing pad work session',      label: 'Kickboxing Pad Work',      category: 'Training'                  },
  { id: 6,  src: '', alt: 'Master Murphy seminar',            label: 'Master Murphy Seminar',    category: 'Seminars',  featured: true  },
  { id: 7,  src: '', alt: 'Black belt grading day',           label: 'Black Belt Grading',       category: 'Grading'                   },
  { id: 8,  src: '', alt: "Claire's House fundraiser event",  label: "Claire's House Fundraiser",category: 'Events'                    },
  { id: 9,  src: '', alt: 'Dragon Cubs class in session',     label: 'Dragon Cubs Class',        category: 'Training'                  },
  { id: 10, src: '', alt: 'Kaizendo technique workshop',      label: 'Kaizendo Workshop',        category: 'Seminars'                  },
  { id: 11, src: '', alt: 'Junior grading celebration',       label: 'Junior Grading Day',       category: 'Grading'                   },
  { id: 12, src: '', alt: 'Charity tournament action shots',  label: 'Charity Tournament',       category: 'Events'                    },
]

const TABS: Category[] = ['All', 'Training', 'Grading', 'Events', 'Seminars']

const PLACEHOLDER_BG = (id: number) =>
  `linear-gradient(135deg, hsl(${218 + id * 4},55%,${4 + (id % 4) * 2}%) 0%, hsl(${222 + id},50%,${7 + (id % 5) * 2}%) 100%)`

// ─────────────────────────────────────────────────────────
// Photo tile image — fades in on load, falls back to placeholder
// ─────────────────────────────────────────────────────────
function PhotoImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)

  if (!src || errored) return null

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      draggable={false}
      onLoad={() => setLoaded(true)}
      onError={() => setErrored(true)}
      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
      style={{ opacity: loaded ? 1 : 0 }}
    />
  )
}

// ─────────────────────────────────────────────────────────
// Placeholder shown when no photo is set
// ─────────────────────────────────────────────────────────
function Placeholder({ label, category }: { label: string; category: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
      <Camera size={22} style={{ color: 'rgba(201,161,74,0.3)' }} />
      <p className="text-[11px] font-medium text-center leading-tight" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</p>
      <p className="text-[9px] tracking-widest uppercase" style={{ color: 'rgba(201,161,74,0.35)' }}>{category}</p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Lightbox image — full quality, no lazy load
// ─────────────────────────────────────────────────────────
function LightboxImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)

  if (!src || errored) return null

  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        draggable={false}
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        className="absolute inset-0 w-full h-full object-contain transition-opacity duration-400"
        style={{ opacity: loaded ? 1 : 0 }}
      />
    </>
  )
}

// ─────────────────────────────────────────────────────────
// Main Gallery
// ─────────────────────────────────────────────────────────
export default function Gallery() {
  const [active, setActive] = useState<Category>('All')
  const [lightboxId, setLightboxId] = useState<number | null>(null)
  const [lightboxKey, setLightboxKey] = useState(0)

  const filtered = active === 'All' ? PHOTOS : PHOTOS.filter(p => p.category === active)
  const activePhoto = PHOTOS.find(p => p.id === lightboxId) ?? null

  const close = useCallback(() => setLightboxId(null), [])

  const prev = useCallback(() => {
    if (lightboxId === null) return
    const idx = filtered.findIndex(p => p.id === lightboxId)
    const newId = filtered[(idx - 1 + filtered.length) % filtered.length].id
    setLightboxId(newId)
    setLightboxKey(k => k + 1)
  }, [lightboxId, filtered])

  const next = useCallback(() => {
    if (lightboxId === null) return
    const idx = filtered.findIndex(p => p.id === lightboxId)
    const newId = filtered[(idx + 1) % filtered.length].id
    setLightboxId(newId)
    setLightboxKey(k => k + 1)
  }, [lightboxId, filtered])

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = lightboxId !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxId])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [close, prev, next])

  const currentIndex = filtered.findIndex(p => p.id === lightboxId)
  const categoryCounts = Object.fromEntries(
    TABS.slice(1).map(tab => [tab, PHOTOS.filter(p => p.category === tab).length])
  ) as Record<string, number>

  return (
    <section id="gallery" className="relative py-14 md:py-32 bg-card/20 border-t border-border/30">
      <div className="max-w-7xl mx-auto px-5 md:px-20">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-3"
        >
          <span className="eyebrow">06 ─── Gallery · The Life</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.06 }}
          className="text-center mb-4"
        >
          <h2 className="section-h2">
            Life at <em>Nine Dragons</em>
          </h2>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto text-center mb-10 md:mb-12"
        >
          Training sessions, gradings, seminars and community moments — straight from the dojo floor.
        </motion.p>

        {/* Filter tabs */}
        <motion.div {...fadeUp(0.1)} className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-12">
          {TABS.map(tab => {
            const count = tab === 'All' ? PHOTOS.length : categoryCounts[tab]
            return (
              <button
                key={tab}
                onClick={() => setActive(tab)}
                className={cn(
                  'touch-target inline-flex items-center gap-2 px-4 md:px-6 py-2 rounded-full text-sm font-medium transition-all duration-300',
                  active === tab
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                    : 'liquid-glass text-muted-foreground hover:text-foreground'
                )}
              >
                {tab}
                <span
                  className={cn(
                    'text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center',
                    active === tab
                      ? 'bg-black/20 text-black/70'
                      : 'bg-white/5 text-muted-foreground'
                  )}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </motion.div>

        {/* Photo grid */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((photo, i) => (
              <motion.button
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.25, delay: Math.min(i * 0.04, 0.3) }}
                onClick={() => { setLightboxId(photo.id); setLightboxKey(k => k + 1) }}
                className={cn(
                  'relative rounded-xl overflow-hidden cursor-pointer group text-left',
                  'aspect-square',
                  photo.featured && 'sm:col-span-2 sm:aspect-[2/1]'
                )}
                style={{ background: PLACEHOLDER_BG(photo.id) }}
              >
                {/* Dragon scale texture */}
                <div className="absolute inset-0 dragon-scales opacity-40 pointer-events-none" />

                {/* Real photo or placeholder */}
                <PhotoImage src={photo.src} alt={photo.alt} />

                {/* Hover/focus overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 pointer-events-none" />

                {/* Gold border on hover */}
                <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-primary/40 transition-colors duration-300 pointer-events-none" />

                {/* Label revealed on hover */}
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                  <p className="text-white text-xs font-semibold leading-tight">{photo.label}</p>
                  <p className="text-primary text-[9px] tracking-widest uppercase mt-0.5">{photo.category}</p>
                </div>

                {/* Placeholder content (only when no real photo) */}
                {!photo.src && <Placeholder label={photo.label} category={photo.category} />}

                {/* Expand icon on hover */}
                <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white">
                    <path d="M1 9L9 1M9 1H5M9 1V5" />
                  </svg>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-3 py-20 text-center"
          >
            <ImageOff size={32} style={{ color: 'rgba(201,161,74,0.3)' }} />
            <p className="text-muted-foreground text-sm">No photos in this category yet.</p>
          </motion.div>
        )}

        {/* Upload CTA — only shows when all photos are still placeholders */}
        {PHOTOS.every(p => !p.src) && (
          <motion.div {...fadeUp(0.2)} className="mt-10 flex flex-col items-center gap-2">
            <div className="h-px w-16 gold-divider" />
            <p className="text-muted-foreground/40 text-xs text-center mt-2">
              Photos go in <code className="text-primary/60">public/gallery/</code> — fill in the <code className="text-primary/60">src</code> fields in Gallery.tsx to go live
            </p>
          </motion.div>
        )}
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxId !== null && activePhoto && (
          <motion.div
            key="lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{ background: 'rgba(1,5,14,0.96)', backdropFilter: 'blur(10px)' }}
            onClick={close}
          >
            {/* Swipeable content panel */}
            <motion.div
              key={lightboxKey}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={(_, info) => {
                if (info.offset.x < -70) next()
                else if (info.offset.x > 70) prev()
              }}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="relative w-full max-w-3xl mx-4 flex flex-col"
              style={{ cursor: 'grab', userSelect: 'none' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Image frame */}
              <div
                className="relative w-full rounded-2xl overflow-hidden"
                style={{
                  background: PLACEHOLDER_BG(activePhoto.id),
                  aspectRatio: activePhoto.src ? '4/3' : '4/3',
                  maxHeight: 'calc(100svh - 120px)',
                }}
              >
                <div className="absolute inset-0 dragon-scales opacity-30" />

                {/* Real photo */}
                <LightboxImage key={lightboxKey} src={activePhoto.src} alt={activePhoto.alt} />

                {/* Placeholder view in lightbox */}
                {!activePhoto.src && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <Camera size={40} style={{ color: 'rgba(201,161,74,0.25)' }} />
                    <div className="text-center">
                      <p className="text-white/60 text-base font-medium">{activePhoto.label}</p>
                      <p className="text-primary/50 text-xs tracking-widest uppercase mt-1">{activePhoto.category}</p>
                      <p className="text-white/25 text-xs mt-3">Add photo: public/gallery/</p>
                    </div>
                  </div>
                )}

                {/* Top controls */}
                <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                  <button
                    onClick={close}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors touch-target"
                    style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Prev / Next — hidden on mobile (swipe instead) */}
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 hidden sm:flex w-11 h-11 rounded-full items-center justify-center text-white/70 hover:text-white transition-colors z-10 touch-target"
                  style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex w-11 h-11 rounded-full items-center justify-center text-white/70 hover:text-white transition-colors z-10 touch-target"
                  style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Caption + counter */}
              <div className="flex items-center justify-between mt-3 px-1">
                <div>
                  <p className="text-white/80 text-sm font-semibold">{activePhoto.label}</p>
                  <p className="text-primary/60 text-[11px] tracking-widest uppercase mt-0.5">{activePhoto.category}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <p className="text-white/30 text-xs tabular-nums">
                    {currentIndex + 1} <span className="text-white/15">/</span> {filtered.length}
                  </p>
                  {/* Mobile swipe hint */}
                  <p className="text-white/20 text-[10px] sm:hidden">swipe to browse</p>
                </div>
              </div>

              {/* Mobile dot indicators */}
              {filtered.length > 1 && (
                <div className="flex justify-center gap-1.5 mt-3">
                  {filtered.map((p, i) => (
                    <button
                      key={p.id}
                      onClick={e => { e.stopPropagation(); setLightboxId(p.id); setLightboxKey(k => k + 1) }}
                      className="rounded-full transition-all duration-300 touch-target flex items-center justify-center"
                    >
                      <span
                        className="block rounded-full transition-all duration-300"
                        style={{
                          width: i === currentIndex ? 16 : 6,
                          height: 6,
                          background: i === currentIndex ? '#c9a14a' : 'rgba(255,255,255,0.2)',
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
