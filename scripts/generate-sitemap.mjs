// Regenerates public/sitemap.xml before every build, adding one <url> per
// published blog post fetched from Supabase. Falls back to the static
// section URLs only if the Supabase env vars aren't available at build time
// (e.g. a local build without a .env file) — it never fails the build.
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml')
const SITE = 'https://ninedragonsmartialarts.co.uk'

function today() {
  return new Date().toISOString().slice(0, 10)
}

const STATIC_URLS = [
  { loc: `${SITE}/`, changefreq: 'monthly', priority: '1.0', lastmod: today(), alternate: true },
  { loc: `${SITE}/#philosophy`, changefreq: 'yearly', priority: '0.7' },
  { loc: `${SITE}/#disciplines`, changefreq: 'yearly', priority: '0.8' },
  { loc: `${SITE}/#instructors`, changefreq: 'yearly', priority: '0.7' },
  { loc: `${SITE}/#schedule`, changefreq: 'monthly', priority: '0.8' },
  { loc: `${SITE}/#gallery`, changefreq: 'monthly', priority: '0.6' },
  { loc: `${SITE}/#join`, changefreq: 'yearly', priority: '0.9' },
  { loc: `${SITE}/blog`, changefreq: 'weekly', priority: '0.8', lastmod: today() },
]

async function fetchBlogUrls() {
  const url = process.env.VITE_SUPABASE_URL
  const key = process.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) {
    console.warn('[sitemap] VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY not set — skipping blog URLs')
    return []
  }
  try {
    const res = await fetch(`${url}/rest/v1/blog_posts?select=slug,updated_at&is_published=eq.true`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    })
    if (!res.ok) {
      console.warn(`[sitemap] Failed to fetch blog posts (${res.status}) — skipping blog URLs`)
      return []
    }
    const posts = await res.json()
    return posts.map(p => ({
      loc: `${SITE}/blog/${p.slug}`,
      changefreq: 'monthly',
      priority: '0.7',
      lastmod: (p.updated_at || today()).slice(0, 10),
    }))
  } catch (err) {
    console.warn('[sitemap] Error fetching blog posts:', err.message)
    return []
  }
}

function toXml(urls) {
  const items = urls
    .map(
      u => `
  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>${
      u.alternate ? `\n    <xhtml:link rel="alternate" hreflang="en-gb" href="${u.loc}" />` : ''
    }
  </url>`
    )
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${items}
</urlset>
`
}

const blogUrls = await fetchBlogUrls()
const xml = toXml([...STATIC_URLS, ...blogUrls])
writeFileSync(sitemapPath, xml)
console.log(`[sitemap] Wrote ${STATIC_URLS.length + blogUrls.length} URLs to public/sitemap.xml`)
