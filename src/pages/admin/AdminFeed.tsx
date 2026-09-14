import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import type { NewsPost } from '@/types/database'
import ImageUpload from '@/components/ImageUpload'
import { Plus, Pencil, Trash2, Eye, EyeOff, Pin, PinOff, Heart, MessageCircle } from 'lucide-react'

const blank = { content: '', image_url: '', is_pinned: false, is_published: true }

export default function AdminFeed() {
  const { profile } = useAuth()
  const [posts, setPosts]     = useState<NewsPost[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<(typeof blank & { id?: string }) | null>(null)
  const [saving, setSaving]   = useState(false)

  async function load() {
    const { data } = await supabase
      .from('news_posts')
      .select('*, author:profiles(full_name, email, is_admin, belt:belts(name, color_hex)), news_comments(id), news_likes(profile_id)')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
    setPosts((data as NewsPost[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function save() {
    if (!editing || !profile) return
    setSaving(true)
    const payload = {
      content:      editing.content.trim(),
      image_url:    editing.image_url || null,
      is_pinned:    editing.is_pinned,
      is_published: editing.is_published,
    }
    if (editing.id) await supabase.from('news_posts').update(payload).eq('id', editing.id)
    else            await supabase.from('news_posts').insert({ ...payload, author_id: profile.id })
    setEditing(null)
    setSaving(false)
    load()
  }

  async function togglePublish(p: NewsPost) {
    await supabase.from('news_posts').update({ is_published: !p.is_published }).eq('id', p.id)
    load()
  }

  async function togglePin(p: NewsPost) {
    await supabase.from('news_posts').update({ is_pinned: !p.is_pinned }).eq('id', p.id)
    load()
  }

  async function deletePost(id: string) {
    if (!confirm('Delete this post? Its comments and likes will be removed too.')) return
    await supabase.from('news_posts').delete().eq('id', id)
    load()
  }

  if (loading) return <div className="p-10 text-foreground/40">Loading news feed…</div>

  if (editing) return (
    <div className="p-6 lg:p-10 max-w-2xl">
      <button onClick={() => setEditing(null)} className="mb-6 text-sm text-gold hover:underline">← Back</button>
      <h1 className="text-2xl font-bold text-foreground mb-6">{editing.id ? 'Edit Post' : 'New Post'}</h1>
      <div className="space-y-4">
        <textarea
          value={editing.content}
          onChange={e => setEditing({ ...editing, content: e.target.value })}
          placeholder="What's happening at the dojo? (grading results, event news, announcements…)"
          rows={5}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-gold/50 resize-none"
        />
        <ImageUpload
          value={editing.image_url}
          onChange={url => setEditing({ ...editing, image_url: url })}
          folder="news"
          placeholder="Image URL (optional) or upload a photo"
        />
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground/70">
            <input type="checkbox" checked={editing.is_pinned} onChange={e => setEditing({ ...editing, is_pinned: e.target.checked })} className="accent-gold" />
            Pin to top
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground/70">
            <input type="checkbox" checked={editing.is_published} onChange={e => setEditing({ ...editing, is_published: e.target.checked })} className="accent-gold" />
            Published (visible to members)
          </label>
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={() => setEditing(null)} className="flex-1 py-2 rounded-lg border border-white/10 text-sm text-foreground/60">Cancel</button>
        <button onClick={save} disabled={saving || !editing.content.trim()}
          className="flex-1 py-2 rounded-lg bg-gold text-background text-sm font-semibold disabled:opacity-50">
          {saving ? 'Saving…' : 'Save Post'}
        </button>
      </div>
    </div>
  )

  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-foreground">News Feed</h1>
        <button
          onClick={() => setEditing({ ...blank })}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold text-background text-sm font-semibold hover:bg-gold/90"
        >
          <Plus size={15} /> New Post
        </button>
      </div>
      <p className="text-foreground/40 text-sm mb-6">Published posts appear in every member's News Feed — they can like and comment.</p>

      {posts.length === 0 && <p className="text-foreground/40">No posts yet — share your first update.</p>}

      <div className="space-y-3">
        {posts.map(p => (
          <div key={p.id} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground line-clamp-2 whitespace-pre-wrap">{p.content}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-foreground/40">
                <span>{new Date(p.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span className="flex items-center gap-1"><Heart size={11} /> {p.news_likes?.length ?? 0}</span>
                <span className="flex items-center gap-1"><MessageCircle size={11} /> {p.news_comments?.length ?? 0}</span>
                {p.is_pinned && <span className="text-gold flex items-center gap-1"><Pin size={11} /> Pinned</span>}
              </div>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0
              ${p.is_published ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-foreground/30'}`}>
              {p.is_published ? 'Live' : 'Draft'}
            </span>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => togglePin(p)} title={p.is_pinned ? 'Unpin' : 'Pin'}
                className="p-1.5 rounded bg-white/5 text-foreground/40 hover:text-gold hover:bg-white/10">
                {p.is_pinned ? <PinOff size={14} /> : <Pin size={14} />}
              </button>
              <button onClick={() => togglePublish(p)} title={p.is_published ? 'Unpublish' : 'Publish'}
                className="p-1.5 rounded bg-white/5 text-foreground/40 hover:text-gold hover:bg-white/10">
                {p.is_published ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button onClick={() => setEditing({ id: p.id, content: p.content, image_url: p.image_url ?? '', is_pinned: p.is_pinned, is_published: p.is_published })}
                className="p-1.5 rounded bg-white/5 text-foreground/40 hover:text-gold hover:bg-white/10">
                <Pencil size={14} />
              </button>
              <button onClick={() => deletePost(p.id)}
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
