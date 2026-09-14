import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useDocumentHead } from '@/hooks/useDocumentHead'
import type { BlogPost as BlogPostType } from '@/types/database'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ArrowLeft } from 'lucide-react'

const SITE = 'https://ninedragonsmartialarts.co.uk'

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost]       = useState<BlogPostType | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle()
      .then(({ data }) => {
        setPost(data)
        setNotFound(!data)
        setLoading(false)
      })
  }, [slug])

  useDocumentHead({
    title: post ? `${post.title} | Nine Dragons Martial Arts` : 'Nine Dragons Martial Arts Blog',
    description: post?.excerpt ?? undefined,
    canonical: post ? `${SITE}/blog/${post.slug}` : undefined,
    jsonLd: post ? {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.excerpt ?? undefined,
      image: post.cover_image ?? undefined,
      datePublished: post.published_at ?? post.created_at,
      dateModified: post.updated_at,
      author: { '@type': 'Organization', name: 'Nine Dragons Martial Arts' },
      publisher: {
        '@type': 'Organization',
        name: 'Nine Dragons Martial Arts',
        logo: { '@type': 'ImageObject', url: `${SITE}/logo.png` },
      },
      mainEntityOfPage: `${SITE}/blog/${post.slug}`,
    } : undefined,
  })

  if (loading) return (
    <main className="bg-background text-foreground min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-5 pt-32 pb-24 text-foreground/40">Loading…</div>
    </main>
  )

  if (notFound || !post) return (
    <main className="bg-background text-foreground min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-5 pt-32 pb-24">
        <h1 className="text-2xl font-bold text-foreground mb-3">Article not found</h1>
        <Link to="/blog" className="text-gold hover:underline text-sm">← Back to blog</Link>
      </div>
      <Footer />
    </main>
  )

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Navbar />
      <article className="max-w-2xl mx-auto px-5 md:px-0 pt-32 pb-24">
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-gold hover:underline mb-8">
          <ArrowLeft size={14} /> Back to blog
        </Link>

        <time className="text-xs text-foreground/40">
          {post.published_at && new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </time>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6 leading-tight">{post.title}</h1>

        {post.cover_image && (
          <img src={post.cover_image} alt={post.title} className="w-full rounded-2xl mb-8 object-cover max-h-[420px]" />
        )}

        <div className="prose prose-invert max-w-none text-foreground/80 whitespace-pre-wrap leading-relaxed">
          {post.content}
        </div>

        <div className="mt-14 p-6 rounded-2xl bg-gold/8 border border-gold/25 text-center">
          <p className="text-foreground/80 mb-4">Ready to start your martial arts journey?</p>
          <a
            href="mailto:hello@ninedragonsmartialarts.co.uk?subject=Free Trial Class"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-background bg-gold hover:bg-gold/90 transition-colors"
          >
            Book your free trial class
          </a>
        </div>
      </article>
      <Footer />
    </main>
  )
}
