import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useDocumentHead } from '@/hooks/useDocumentHead'
import type { BlogPost } from '@/types/database'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ArrowRight } from 'lucide-react'

const SITE = 'https://ninedragonsmartialarts.co.uk'

export default function Blog() {
  const [posts, setPosts]     = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useDocumentHead({
    title: 'Martial Arts Blog | Nine Dragons Martial Arts, Birkenhead',
    description: 'Tips, news, and stories from Nine Dragons Martial Arts — kickboxing, self-defence, grading advice and dojo updates from Birkenhead, Wirral.',
    canonical: `${SITE}/blog`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Nine Dragons Martial Arts Blog',
      url: `${SITE}/blog`,
    },
  })

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .then(({ data }) => { setPosts(data ?? []); setLoading(false) })
  }, [])

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto px-5 md:px-10 pt-32 pb-24">
        <span className="eyebrow">The Dojo Journal</span>
        <h1 className="section-h2 mt-4 mb-3">Martial Arts <em>Blog</em></h1>
        <p className="text-muted-foreground max-w-xl mb-14">
          Training tips, grading advice, and news from Nine Dragons Martial Arts in Birkenhead.
        </p>

        {loading ? (
          <p className="text-foreground/40">Loading articles…</p>
        ) : posts.length === 0 ? (
          <p className="text-foreground/40">No articles published yet — check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-gold/30 transition-colors flex flex-col"
              >
                {post.cover_image && (
                  <img src={post.cover_image} alt={post.title} className="h-44 w-full object-cover" loading="lazy" />
                )}
                <div className="p-5 flex-1 flex flex-col">
                  <time className="text-xs text-foreground/40">
                    {post.published_at && new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </time>
                  <h2 className="text-lg font-semibold text-foreground mt-1.5 group-hover:text-gold transition-colors">{post.title}</h2>
                  {post.excerpt && <p className="text-sm text-foreground/50 mt-2 line-clamp-3 flex-1">{post.excerpt}</p>}
                  <span className="inline-flex items-center gap-1.5 text-xs text-gold mt-4">
                    Read article <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
