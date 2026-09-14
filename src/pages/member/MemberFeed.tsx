import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import type { NewsPost } from '@/types/database'
import { Heart, MessageCircle, Pin, Send } from 'lucide-react'

function timeAgo(iso: string) {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  const units: [number, string][] = [[60, 's'], [60, 'm'], [24, 'h'], [7, 'd'], [4.345, 'w'], [12, 'mo'], [Infinity, 'y']]
  let value = seconds
  for (const [amount, label] of units) {
    if (value < amount) return `${Math.max(1, Math.floor(value))}${label}`
    value /= amount
  }
  return ''
}

function Avatar({ name, colorHex }: { name: string; colorHex?: string | null }) {
  const initial = (name || '?').trim().charAt(0).toUpperCase()
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-sm text-background"
      style={{ background: colorHex || '#c9a14a' }}
    >
      {initial}
    </div>
  )
}

function PostCard({ post, myId, onChange }: { post: NewsPost; myId: string; onChange: () => void }) {
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [comment, setComment]           = useState('')
  const [posting, setPosting]           = useState(false)

  const likes    = post.news_likes ?? []
  const comments = (post.news_comments ?? []).slice().sort((a, b) => a.created_at.localeCompare(b.created_at))
  const iLiked   = likes.some(l => l.profile_id === myId)

  async function toggleLike() {
    if (iLiked) await supabase.from('news_likes').delete().eq('post_id', post.id).eq('profile_id', myId)
    else         await supabase.from('news_likes').insert({ post_id: post.id, profile_id: myId })
    onChange()
  }

  async function addComment() {
    if (!comment.trim()) return
    setPosting(true)
    await supabase.from('news_comments').insert({ post_id: post.id, author_id: myId, content: comment.trim() })
    setComment('')
    setPosting(false)
    onChange()
  }

  return (
    <article className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
      {post.is_pinned && (
        <div className="flex items-center gap-1.5 px-5 pt-4 text-xs text-gold font-semibold">
          <Pin size={12} /> Pinned
        </div>
      )}

      <div className="flex items-start gap-3 px-5 pt-4">
        <Avatar name={post.author?.full_name || post.author?.email || 'Dojo'} colorHex={post.author?.belt?.color_hex} />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">
            {post.author?.full_name || post.author?.email || 'Nine Dragons'}
            {post.author?.is_admin && <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-gold/15 text-gold align-middle">Instructor</span>}
          </p>
          <p className="text-xs text-foreground/40">{timeAgo(post.created_at)} ago</p>
        </div>
      </div>

      <p className="px-5 pt-3 text-sm text-foreground/85 whitespace-pre-wrap leading-relaxed">{post.content}</p>

      {post.image_url && (
        <img src={post.image_url} alt="" className="mt-3 w-full max-h-[420px] object-cover" loading="lazy" />
      )}

      <div className="flex items-center gap-1 px-3 py-2 mt-1 text-xs text-foreground/40">
        {likes.length > 0 && <span>{likes.length} like{likes.length > 1 ? 's' : ''}</span>}
        {comments.length > 0 && <span className="ml-auto">{comments.length} comment{comments.length > 1 ? 's' : ''}</span>}
      </div>

      <div className="flex border-t border-white/10">
        <button
          onClick={toggleLike}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${iLiked ? 'text-gold' : 'text-foreground/50 hover:bg-white/5'}`}
        >
          <Heart size={16} fill={iLiked ? 'currentColor' : 'none'} /> Like
        </button>
        <button
          onClick={() => setCommentsOpen(o => !o)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-foreground/50 hover:bg-white/5 transition-colors"
        >
          <MessageCircle size={16} /> Comment
        </button>
      </div>

      {commentsOpen && (
        <div className="border-t border-white/10 px-5 py-4 space-y-3 bg-black/10">
          {comments.map(c => (
            <div key={c.id} className="flex items-start gap-2.5">
              <Avatar name={c.author?.full_name || c.author?.email || '?'} colorHex={c.author?.belt?.color_hex} />
              <div className="min-w-0 flex-1">
                <div className="inline-block bg-white/5 rounded-2xl px-3.5 py-2 max-w-full">
                  <p className="text-xs font-semibold text-foreground">{c.author?.full_name || c.author?.email}</p>
                  <p className="text-sm text-foreground/80 whitespace-pre-wrap break-words">{c.content}</p>
                </div>
                <p className="text-[10px] text-foreground/30 mt-1 ml-1">{timeAgo(c.created_at)} ago</p>
              </div>
            </div>
          ))}
          {comments.length === 0 && <p className="text-xs text-foreground/30">No comments yet — be the first to say something.</p>}

          <div className="flex items-center gap-2 pt-1">
            <input
              value={comment}
              onChange={e => setComment(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addComment() } }}
              placeholder="Write a comment…"
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-foreground focus:outline-none focus:border-gold/50"
            />
            <button onClick={addComment} disabled={posting || !comment.trim()}
              className="p-2 rounded-full bg-gold text-background disabled:opacity-40">
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </article>
  )
}

export default function MemberFeed() {
  const { profile } = useAuth()
  const [posts, setPosts]     = useState<NewsPost[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const { data } = await supabase
      .from('news_posts')
      .select('*, author:profiles(full_name, email, is_admin, belt:belts(name, color_hex)), news_comments(*, author:profiles(full_name, email, is_admin, belt:belts(name, color_hex))), news_likes(profile_id)')
      .eq('is_published', true)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
    setPosts((data as NewsPost[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  if (loading) return <div className="p-10 text-foreground/40">Loading feed…</div>
  if (!profile) return null

  return (
    <div className="p-6 lg:p-10 max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground mb-1">News Feed</h1>
      <p className="text-foreground/40 text-sm mb-6">Updates, grading results & photos from the dojo — like and comment below.</p>

      {posts.length === 0 ? (
        <p className="text-foreground/40 text-sm">No posts yet — check back soon.</p>
      ) : (
        <div className="space-y-5">
          {posts.map(p => (
            <PostCard key={p.id} post={p} myId={profile.id} onChange={load} />
          ))}
        </div>
      )}
    </div>
  )
}
