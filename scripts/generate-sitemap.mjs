// Regenerates public/sitemap.xml before every build, adding one <url> per
// blog post found in src/data/blogPosts.ts. Pure static site — no network
// calls, never fails the build.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const sitemapPath   = path.join(__dirname, '..', 'public', 'sitemap.xml')
const blogDataPath  = path.join(__dirname, '..', 'src', 'data', 'blogPosts.ts')
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

function getBlogUrls() {
  try {
    const src = readFileSync(blogDataPath, 'utf8')
    const slugs = [...src.matchAll(/^\s*slug:\s*'([^']+)',/gm)].map(m => m[1])
    const dates = [...src.matchAll(/^\s*publishedAt:\s*'([^']+)',?/gm)].map(m => m[1])
    return slugs.map((slug, i) => ({
      loc: `${SITE}/blog/${slug}`,
      changefreq: 'monthly',
      priority: '0.7',
      lastmod: dates[i] || today(),
    }))
  } catch (err) {
    console.warn('[sitemap] Could not read blog post data — skipping blog URLs:', err.message)
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

const blogUrls = getBlogUrls()
const xml = toXml([...STATIC_URLS, ...blogUrls])
writeFileSync(sitemapPath, xml)
console.log(`[sitemap] Wrote ${STATIC_URLS.length + blogUrls.length} URLs to public/sitemap.xml`)
