import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Lesson } from '@/types/database'
import { BookOpen, Play } from 'lucide-react'

export default function MemberLessons() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Lesson | null>(null)

  useEffect(() => {
    supabase
      .from('lessons')
      .select('*, belt:belts(*)')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setLessons(data ?? []); setLoading(false) })
  }, [])

  if (loading) return <div className="p-10 text-foreground/40">Loading lessons…</div>

  return (
    <div className="p-6 lg:p-10 max-w-5xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">Lessons</h1>

      {lessons.length === 0 && (
        <p className="text-foreground/40">No lessons published yet — check back soon.</p>
      )}

      {selected ? (
        <div>
          <button onClick={() => setSelected(null)} className="mb-6 text-sm text-gold hover:underline">← Back to lessons</button>
          <h2 className="text-xl font-bold text-foreground mb-2">{selected.title}</h2>
          {selected.belt && (
            <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full bg-white/10 text-foreground/60 mb-4">
              <span className="w-2 h-2 rounded-full" style={{ background: selected.belt.color_hex }} />
              {selected.belt.name} Belt
            </span>
          )}
          {selected.video_url && (
            <div className="aspect-video mb-6 rounded-xl overflow-hidden bg-black">
              <iframe src={selected.video_url} className="w-full h-full" allowFullScreen title={selected.title} />
            </div>
          )}
          {selected.content && (
            <div className="prose prose-invert max-w-none text-foreground/80 whitespace-pre-wrap leading-relaxed">
              {selected.content}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {lessons.map(lesson => (
            <button
              key={lesson.id}
              onClick={() => setSelected(lesson)}
              className="text-left p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-gold/30 transition-colors group"
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-gold/10 text-gold flex-shrink-0">
                  {lesson.video_url ? <Play size={18} /> : <BookOpen size={18} />}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground group-hover:text-gold transition-colors">{lesson.title}</p>
                  {lesson.description && <p className="text-sm text-foreground/50 mt-1 line-clamp-2">{lesson.description}</p>}
                  {lesson.belt && (
                    <span className="inline-flex items-center gap-1 text-xs mt-2 text-foreground/40">
                      <span className="w-2 h-2 rounded-full" style={{ background: lesson.belt.color_hex }} />
                      {lesson.belt.name} Belt
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
