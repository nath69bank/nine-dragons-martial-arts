import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { NutritionGuide } from '@/types/database'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'

export default function AdminNutrition() {
  const [guides, setGuides]   = useState<NutritionGuide[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<NutritionGuide | null>(null)
  const [isNew, setIsNew]     = useState(false)
  const [saving, setSaving]   = useState(false)

  const blank: NutritionGuide = { id: '', title: '', content: '', category: '', is_published: false, created_at: '' }

  async function load() {
    const { data } = await supabase.from('nutrition_guides').select('*').order('created_at', { ascending: false })
    setGuides(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function save() {
    if (!editing) return
    setSaving(true)
    const payload = { title: editing.title, content: editing.content, category: editing.category, is_published: editing.is_published }
    if (isNew) await supabase.from('nutrition_guides').insert(payload)
    else        await supabase.from('nutrition_guides').update(payload).eq('id', editing.id)
    setEditing(null)
    setSaving(false)
    load()
  }

  async function togglePublish(g: NutritionGuide) {
    await supabase.from('nutrition_guides').update({ is_published: !g.is_published }).eq('id', g.id)
    load()
  }

  async function deleteGuide(id: string) {
    if (!confirm('Delete this guide?')) return
    await supabase.from('nutrition_guides').delete().eq('id', id)
    load()
  }

  if (loading) return <div className="p-10 text-foreground/40">Loading…</div>

  if (editing) return (
    <div className="p-6 lg:p-10 max-w-2xl">
      <button onClick={() => setEditing(null)} className="mb-6 text-sm text-gold hover:underline">← Back</button>
      <h1 className="text-2xl font-bold text-foreground mb-6">{isNew ? 'New Guide' : 'Edit Guide'}</h1>
      <div className="space-y-4">
        <input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} placeholder="Title"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-gold/50" />
        <input value={editing.category ?? ''} onChange={e => setEditing({ ...editing, category: e.target.value })} placeholder="Category (e.g. Performance, Recovery, Weight)"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-gold/50" />
        <textarea value={editing.content ?? ''} onChange={e => setEditing({ ...editing, content: e.target.value })} placeholder="Guide content…" rows={12}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-gold/50 resize-none" />
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={editing.is_published} onChange={e => setEditing({ ...editing, is_published: e.target.checked })} className="accent-gold" />
          <span className="text-sm text-foreground/70">Published (visible to members)</span>
        </label>
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={() => setEditing(null)} className="flex-1 py-2 rounded-lg border border-white/10 text-sm text-foreground/60">Cancel</button>
        <button onClick={save} disabled={saving || !editing.title}
          className="flex-1 py-2 rounded-lg bg-gold text-background text-sm font-semibold disabled:opacity-50">
          {saving ? 'Saving…' : 'Save Guide'}
        </button>
      </div>
    </div>
  )

  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Diet & Nutrition</h1>
        <button onClick={() => { setEditing(blank); setIsNew(true) }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold text-background text-sm font-semibold hover:bg-gold/90">
          <Plus size={15} /> Add Guide
        </button>
      </div>

      {guides.length === 0 && <p className="text-foreground/40">No guides yet.</p>}

      <div className="space-y-3">
        {guides.map(g => (
          <div key={g.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{g.title}</p>
              {g.category && <p className="text-xs text-foreground/40 uppercase tracking-wider mt-0.5">{g.category}</p>}
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${g.is_published ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-foreground/30'}`}>
              {g.is_published ? 'Live' : 'Draft'}
            </span>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => togglePublish(g)} title={g.is_published ? 'Unpublish' : 'Publish'}
                className="p-1.5 rounded bg-white/5 text-foreground/40 hover:text-gold hover:bg-white/10">
                {g.is_published ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button onClick={() => { setEditing(g); setIsNew(false) }}
                className="p-1.5 rounded bg-white/5 text-foreground/40 hover:text-gold hover:bg-white/10"><Pencil size={14} /></button>
              <button onClick={() => deleteGuide(g.id)}
                className="p-1.5 rounded bg-white/5 text-foreground/40 hover:text-red-400 hover:bg-white/10"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
