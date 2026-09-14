import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import type { BlogPost } from '@/types/database'
import ImageUpload from '@/components/ImageUpload'
import { Plus, Pencil, Trash2, Eye, EyeOff, ExternalLink } from 'lucide-react'

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

type Draft = {
  id?: string
  slug: string
  title: string
  excerpt: string
  content: string
  cover_image: string
  is_published: boolean
}

const blank: Draft = { slug: '', title: '', excerpt: '', content: '', cover_image: '', is_published: false }

export default function AdminBlog() {
  const { profile } = useAuth()
  const [posts, setPosts]     = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Draft | null>(null)
  const [slugTouched, setSlugTouched] = useState(false)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  async function load() {
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
    setPosts(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function save() {
    if (!editing || !profile) return
    setSaving(true)
    setError('')
    const existing = posts.find(p => p.id === editing.id)
    const payload = {
      slug:         editing.slug || slugify(editing.title),
      title:        editing.title.trim(),
      excerpt:      editing.excerpt || null,
      content:      editing.content.trim(),
      cover_image:  editing.cover_image || null,
      is_published: editing.is_published,
      published_at: editing.is_published ? (existing?.published_at ?? new Date().toISOString()) : existing?.published_at ?? null,
    }
    const { error: saveError } = editing.id
      ? await supabase.from('blog_posts').update(payload).eq('id', editing.id)
      : await supabase.from('blog_posts').insert({ ...payload, author_id: profile.id })
    if (saveError) { setError(saveError.message); setSaving(false); return }
    setEditing(null)
    setSaving(false)
    load()
  }

  async function togglePublish(p: BlogPost) {
    await supabase.from('blog_posts').update({
      is_published: !p.is_published,
      published_at: !p.is_published ? (p.published_at ?? new Date().toISOString()) : p.published_at,
    }).eq('id', p.id)
    load()
  }

  async function deletePost(id: string) {
    if (!confirm('Delete this article? This cannot be undone.')) return
    await supabase.from('blog_posts').delete().eq('id', id)
    load()
  }

  if (loading) return <div className="p-10 text-foreground/40">Loading blog…</div>

  if (editing) return (
    <div className="p-6 lg:p-10 max-w-2xl">
      <button onClick={() => setEditing(null)} className="mb-6 text-sm text-gold hover:underline">← Back</button>
      <h1 className="text-2xl font-bold text-foreground mb-6">{editing.id ? 'Edit Article' : 'New Article'}</h1>

      {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}

      <div className="space-y-4">
        <input
          value={editing.title}
          onChange={e => {
            const title = e.target.value
            setEditing(prev => prev && { ...prev, title, slug: slugTouched ? prev.slug : slugify(title) })
          }}
          placeholder="Article title"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-gold/50"
        />
        <div>
          <label className="text-xs text-foreground/40 mb-1 block">URL slug — /blog/{editing.slug || 'your-slug'}</label>
          <input
            value={editing.slug}
            onChange={e => { setSlugTouched(true); setEditing({ ...editing, slug: slugify(e.target.value) }) }}
            placeholder="url-friendly-slug"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-gold/50"
          />
        </div>
        <textarea
          value={editing.excerpt}
          onChange={e => setEditing({ ...editing, excerpt: e.target.value })}
          placeholder="Short excerpt — shown on the blog list and used as the meta description for search engines"
          rows={2}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-gold/50 resize-none"
        />
        <ImageUpload
          value={editing.cover_image}
          onChange={url => setEditing({ ...editing, cover_image: url })}
          folder="blog"
          placeholder="Cover image URL (optional) or upload"
        />
        <textarea
          value={editing.content}
          onChange={e => setEditing({ ...editing, content: e.target.value })}
          placeholder="Article content…"
          rows={14}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-gold/50 resize-none font-mono"
        />
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={editing.is_published} onChange={e => setEditing({ ...editing, is_published: e.target.checked })} className="accent-gold" />
          <span className="text-sm text-foreground/70">Published (publicly visible at /blog/{editing.slug || 'slug'})</span>
        </label>
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={() => setEditing(null)} className="flex-1 py-2 rounded-lg border border-white/10 text-sm text-foreground/60">Cancel</button>
        <button onClick={save} disabled={saving || !editing.title.trim() || !editing.content.trim()}
          className="flex-1 py-2 rounded-lg bg-gold text-background text-sm font-semibold disabled:opacity-50">
          {saving ? 'Saving…' : 'Save Article'}
        </button>
      </div>
    </div>
  )

  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-foreground">Blog</h1>
        <button
          onClick={() => { setEditing({ ...blank }); setSlugTouched(false) }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold text-background text-sm font-semibold hover:bg-gold/90"
        >
          <Plus size={15} /> New Article
        </button>
      </div>
      <p className="text-foreground/40 text-sm mb-6">Published articles appear on the public /blog page and get indexed by search engines.</p>

      {posts.length === 0 && <p className="text-foreground/40">No articles yet — write your first post.</p>}

      <div className="space-y-3">
        {posts.map(p => (
          <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{p.title}</p>
              <p className="text-xs text-foreground/40 mt-0.5">/blog/{p.slug}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0
              ${p.is_published ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-foreground/30'}`}>
              {p.is_published ? 'Live' : 'Draft'}
            </span>
            <div className="flex gap-2 flex-shrink-0">
              {p.is_published && (
                <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer"
                  className="p-1.5 rounded bg-white/5 text-foreground/40 hover:text-gold hover:bg-white/10">
                  <ExternalLink size={14} />
                </a>
              )}
              <button onClick={() => togglePublish(p)} title={p.is_published ? 'Unpublish' : 'Publish'}
                className="p-1.5 rounded bg-white/5 text-foreground/40 hover:text-gold hover:bg-white/10">
                {p.is_published ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button
                onClick={() => {
                  setEditing({ id: p.id, slug: p.slug, title: p.title, excerpt: p.excerpt ?? '', content: p.content, cover_image: p.cover_image ?? '', is_published: p.is_published })
                  setSlugTouched(true)
                }}
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
