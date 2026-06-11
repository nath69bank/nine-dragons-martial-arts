import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { PublicSession } from '@/types/database'
import { Plus, Pencil, Trash2, Eye, EyeOff, Play } from 'lucide-react'

const CATEGORIES = ['Training', 'Sparring', 'Grading', 'Events', 'Seminars']

const blank: PublicSession = {
  id: '', title: '', description: '', video_url: '', thumbnail_url: '',
  category: 'Training', is_published: false, display_order: 0, created_at: '',
}

export default function AdminSessions() {
  const [sessions, setSessions] = useState<PublicSession[]>([])
  const [loading, setLoading]   = useState(true)
  const [editing, setEditing]   = useState<PublicSession | null>(null)
  const [isNew, setIsNew]       = useState(false)
  const [saving, setSaving]     = useState(false)

  async function load() {
    const { data } = await supabase
      .from('public_sessions')
      .select('*')
      .order('display_order', { ascending: true })
    setSessions(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function save() {
    if (!editing) return
    setSaving(true)
    const payload = {
      title:         editing.title,
      description:   editing.description,
      video_url:     editing.video_url,
      thumbnail_url: editing.thumbnail_url,
      category:      editing.category,
      is_published:  editing.is_published,
      display_order: editing.display_order,
    }
    if (isNew) await supabase.from('public_sessions').insert(payload)
    else        await supabase.from('public_sessions').update(payload).eq('id', editing.id)
    setEditing(null)
    setSaving(false)
    load()
  }

  async function togglePublish(s: PublicSession) {
    await supabase.from('public_sessions').update({ is_published: !s.is_published }).eq('id', s.id)
    load()
  }

  async function deleteSession(id: string) {
    if (!confirm('Delete this session clip?')) return
    await supabase.from('public_sessions').delete().eq('id', id)
    load()
  }

  if (loading) return <div className="p-10 text-foreground/40">Loading sessions…</div>

  if (editing) return (
    <div className="p-6 lg:p-10 max-w-2xl">
      <button onClick={() => setEditing(null)} className="mb-6 text-sm text-gold hover:underline">← Back</button>
      <h1 className="text-2xl font-bold text-foreground mb-6">{isNew ? 'New Session' : 'Edit Session'}</h1>
      <div className="space-y-4">
        <input
          value={editing.title}
          onChange={e => setEditing({ ...editing, title: e.target.value })}
          placeholder="Title (e.g. Friday Sparring — June 2025)"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-gold/50"
        />
        <textarea
          value={editing.description ?? ''}
          onChange={e => setEditing({ ...editing, description: e.target.value })}
          placeholder="Short description shown on the card"
          rows={2}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-gold/50 resize-none"
        />
        <input
          value={editing.video_url}
          onChange={e => setEditing({ ...editing, video_url: e.target.value })}
          placeholder="Video URL — YouTube (watch or embed), Vimeo, or direct .mp4"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-gold/50"
        />
        <input
          value={editing.thumbnail_url ?? ''}
          onChange={e => setEditing({ ...editing, thumbnail_url: e.target.value })}
          placeholder="Thumbnail image URL (optional — auto-extracted from YouTube if blank)"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-gold/50"
        />
        <div className="flex gap-4">
          <select
            value={editing.category}
            onChange={e => setEditing({ ...editing, category: e.target.value })}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-gold/50"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            type="number"
            value={editing.display_order}
            onChange={e => setEditing({ ...editing, display_order: Number(e.target.value) })}
            placeholder="Order"
            className="w-24 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-gold/50"
          />
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={editing.is_published}
            onChange={e => setEditing({ ...editing, is_published: e.target.checked })}
            className="accent-gold"
          />
          <span className="text-sm text-foreground/70">Published (visible on homepage)</span>
        </label>
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={() => setEditing(null)} className="flex-1 py-2 rounded-lg border border-white/10 text-sm text-foreground/60">Cancel</button>
        <button
          onClick={save}
          disabled={saving || !editing.title || !editing.video_url}
          className="flex-1 py-2 rounded-lg bg-gold text-background text-sm font-semibold disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Session'}
        </button>
      </div>
    </div>
  )

  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-foreground">Session Clips</h1>
        <button
          onClick={() => { setEditing({ ...blank, display_order: sessions.length + 1 }); setIsNew(true) }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold text-background text-sm font-semibold hover:bg-gold/90"
        >
          <Plus size={15} /> Add Session
        </button>
      </div>
      <p className="text-foreground/40 text-sm mb-6">Published clips appear on the public homepage as social proof.</p>

      {sessions.length === 0 && <p className="text-foreground/40">No sessions yet — add your first clip.</p>}

      <div className="space-y-3">
        {sessions.map(s => (
          <div key={s.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
              <Play size={16} className="text-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{s.title}</p>
              <p className="text-xs text-foreground/40 mt-0.5">{s.category} · order {s.display_order}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0
              ${s.is_published ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-foreground/30'}`}>
              {s.is_published ? 'Live' : 'Draft'}
            </span>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => togglePublish(s)} title={s.is_published ? 'Unpublish' : 'Publish'}
                className="p-1.5 rounded bg-white/5 text-foreground/40 hover:text-gold hover:bg-white/10">
                {s.is_published ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button onClick={() => { setEditing(s); setIsNew(false) }}
                className="p-1.5 rounded bg-white/5 text-foreground/40 hover:text-gold hover:bg-white/10">
                <Pencil size={14} />
              </button>
              <button onClick={() => deleteSession(s.id)}
                className="p-1.5 rounded bg-white/5 text-foreground/40 hover:text-red-400 hover:bg-white/10">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
