import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Belt, BeltTag } from '@/types/database'
import { Plus, Pencil, Trash2, Check, X, Tag } from 'lucide-react'

type BeltWithTags = Belt & { belt_tags: BeltTag[] }

export default function AdminBelts() {
  const [belts, setBelts]     = useState<BeltWithTags[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<BeltWithTags | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [newTag, setNewTag]   = useState('')
  const [saving, setSaving]   = useState(false)
  const [fresh, setFresh]     = useState<Partial<BeltWithTags>>({ name: '', color_hex: '#ffffff', order_index: 1, belt_tags: [] })

  async function load() {
    const { data } = await supabase
      .from('belts')
      .select('*, belt_tags(*)')
      .order('order_index')
    setBelts((data as BeltWithTags[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function saveBelt() {
    if (!editing) return
    setSaving(true)
    await supabase.from('belts').update({
      name:        editing.name,
      color_hex:   editing.color_hex,
      order_index: editing.order_index,
      description: editing.description,
      requirements:editing.requirements,
    }).eq('id', editing.id)
    setEditing(null)
    setSaving(false)
    load()
  }

  async function addBelt() {
    if (!fresh.name) return
    setSaving(true)
    const { data } = await supabase.from('belts').insert({
      name:        fresh.name!,
      color_hex:   fresh.color_hex ?? '#ffffff',
      order_index: fresh.order_index ?? belts.length + 1,
      description: fresh.description ?? null,
      requirements:fresh.requirements ?? null,
    }).select().single()
    if (data && fresh.belt_tags?.length) {
      await supabase.from('belt_tags').insert(fresh.belt_tags.map(t => ({ belt_id: data.id, tag: t.tag })))
    }
    setShowAdd(false)
    setFresh({ name: '', color_hex: '#ffffff', order_index: belts.length + 2, belt_tags: [] })
    setSaving(false)
    load()
  }

  async function deleteBelt(id: string) {
    if (!confirm('Delete this belt? This cannot be undone.')) return
    await supabase.from('belts').delete().eq('id', id)
    load()
  }

  async function addTag(beltId: string, tag: string) {
    if (!tag.trim()) return
    await supabase.from('belt_tags').insert({ belt_id: beltId, tag: tag.trim() })
    setNewTag('')
    load()
  }

  async function removeTag(tagId: string) {
    await supabase.from('belt_tags').delete().eq('id', tagId)
    load()
  }

  if (loading) return <div className="p-10 text-foreground/40">Loading belts…</div>

  return (
    <div className="p-6 lg:p-10 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Belt Levels</h1>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold text-background text-sm font-semibold hover:bg-gold/90">
          <Plus size={15} /> Add Belt
        </button>
      </div>

      {/* Add modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[hsl(220,65%,5%)] border border-white/10 rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold text-foreground mb-4">New Belt</h2>
            <div className="space-y-3">
              <input value={fresh.name ?? ''} onChange={e => setFresh({ ...fresh, name: e.target.value })} placeholder="Belt name (e.g. Orange)"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-foreground text-sm focus:outline-none focus:border-gold/50" />
              <div className="flex gap-3 items-center">
                <label className="text-sm text-foreground/50">Colour</label>
                <input type="color" value={fresh.color_hex ?? '#ffffff'} onChange={e => setFresh({ ...fresh, color_hex: e.target.value })}
                  className="h-8 w-16 rounded cursor-pointer bg-transparent" />
              </div>
              <input type="number" value={fresh.order_index ?? ''} onChange={e => setFresh({ ...fresh, order_index: Number(e.target.value) })} placeholder="Order (1 = first)"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-foreground text-sm focus:outline-none focus:border-gold/50" />
              <textarea value={fresh.requirements ?? ''} onChange={e => setFresh({ ...fresh, requirements: e.target.value })} placeholder="Grading requirements…" rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-foreground text-sm focus:outline-none focus:border-gold/50 resize-none" />
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2 rounded-lg border border-white/10 text-sm text-foreground/60">Cancel</button>
              <button onClick={addBelt} disabled={saving || !fresh.name}
                className="flex-1 py-2 rounded-lg bg-gold text-background text-sm font-semibold disabled:opacity-50">
                {saving ? 'Saving…' : 'Add Belt'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {belts.map(belt => (
          <div key={belt.id} className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
            {editing?.id === belt.id ? (
              <div className="p-5 space-y-3">
                <div className="flex gap-3">
                  <input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:border-gold/50" />
                  <input type="color" value={editing.color_hex} onChange={e => setEditing({ ...editing, color_hex: e.target.value })}
                    className="h-9 w-14 rounded cursor-pointer bg-transparent" />
                  <input type="number" value={editing.order_index} onChange={e => setEditing({ ...editing, order_index: Number(e.target.value) })}
                    className="w-16 bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-foreground text-sm focus:outline-none focus:border-gold/50" />
                </div>
                <textarea value={editing.requirements ?? ''} onChange={e => setEditing({ ...editing, requirements: e.target.value })} placeholder="Requirements…" rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:border-gold/50 resize-none" />

                {/* Tags */}
                <div>
                  <p className="text-xs text-foreground/40 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {belt.belt_tags.map(t => (
                      <span key={t.id} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-xs text-foreground/60">
                        {t.tag}
                        <button onClick={() => removeTag(t.id)} className="text-foreground/30 hover:text-red-400"><X size={10} /></button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input value={newTag} onChange={e => setNewTag(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(belt.id, newTag) } }}
                      placeholder="Add tag…"
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-foreground text-sm focus:outline-none focus:border-gold/50" />
                    <button onClick={() => addTag(belt.id, newTag)} className="px-3 py-1.5 rounded-lg bg-white/10 text-foreground/60 hover:bg-white/20 text-sm">
                      <Tag size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button onClick={saveBelt} disabled={saving} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold/20 text-gold text-sm hover:bg-gold/30 disabled:opacity-50"><Check size={14} />Save</button>
                  <button onClick={() => setEditing(null)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-foreground/40 text-sm hover:bg-white/10"><X size={14} />Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 px-5 py-4">
                <span className="text-xs text-foreground/30 w-4">{belt.order_index}</span>
                <span className="w-5 h-5 rounded-full border border-white/20 flex-shrink-0" style={{ background: belt.color_hex }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{belt.name} Belt</p>
                  {belt.belt_tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {belt.belt_tags.map(t => (
                        <span key={t.id} className="text-xs px-1.5 py-0.5 rounded-full bg-white/10 text-foreground/40">{t.tag}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(belt)} className="p-1.5 rounded bg-white/5 text-foreground/40 hover:text-gold hover:bg-white/10"><Pencil size={14} /></button>
                  <button onClick={() => deleteBelt(belt.id)} className="p-1.5 rounded bg-white/5 text-foreground/40 hover:text-red-400 hover:bg-white/10"><Trash2 size={14} /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
