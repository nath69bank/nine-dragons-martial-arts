import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { NutritionGuide } from '@/types/database'
import { Apple } from 'lucide-react'

export default function MemberNutrition() {
  const [guides, setGuides]     = useState<NutritionGuide[]>([])
  const [loading, setLoading]   = useState(true)
  const [selected, setSelected] = useState<NutritionGuide | null>(null)
  const [category, setCategory] = useState<string>('all')

  useEffect(() => {
    supabase
      .from('nutrition_guides')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setGuides(data ?? []); setLoading(false) })
  }, [])

  if (loading) return <div className="p-10 text-foreground/40">Loading guides…</div>

  const categories = ['all', ...Array.from(new Set(guides.map(g => g.category).filter(Boolean)))] as string[]
  const filtered   = category === 'all' ? guides : guides.filter(g => g.category === category)

  return (
    <div className="p-6 lg:p-10 max-w-5xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">Diet & Nutrition</h1>

      {selected ? (
        <div>
          <button onClick={() => setSelected(null)} className="mb-6 text-sm text-gold hover:underline">← Back to guides</button>
          <h2 className="text-xl font-bold text-foreground mb-1">{selected.title}</h2>
          {selected.category && <p className="text-xs text-foreground/40 mb-6 uppercase tracking-wider">{selected.category}</p>}
          <div className="prose prose-invert max-w-none text-foreground/80 whitespace-pre-wrap leading-relaxed">
            {selected.content}
          </div>
        </div>
      ) : (
        <>
          {/* Category filter */}
          {categories.length > 1 && (
            <div className="flex gap-2 flex-wrap mb-6">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors capitalize
                    ${category === cat ? 'bg-gold text-background' : 'bg-white/5 text-foreground/60 hover:bg-white/10'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {filtered.length === 0 && <p className="text-foreground/40">No guides published yet.</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map(guide => (
              <button
                key={guide.id}
                onClick={() => setSelected(guide)}
                className="text-left p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-gold/30 transition-colors group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-lg bg-gold/10 text-gold flex-shrink-0">
                    <Apple size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground group-hover:text-gold transition-colors">{guide.title}</p>
                    {guide.category && <p className="text-xs text-foreground/40 mt-1 uppercase tracking-wider">{guide.category}</p>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
