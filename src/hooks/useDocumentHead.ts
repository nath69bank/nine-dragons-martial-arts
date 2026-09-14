import { useEffect } from 'react'

interface HeadOptions {
  title: string
  description?: string
  canonical?: string
  jsonLd?: object
}

/** Sets per-page <title>/description/canonical + a JSON-LD block, reverting on unmount. */
export function useDocumentHead({ title, description, canonical, jsonLd }: HeadOptions) {
  useEffect(() => {
    const prevTitle = document.title
    document.title = title

    let descTag: HTMLMetaElement | null = null
    let prevDesc: string | null = null
    if (description) {
      descTag = document.querySelector('meta[name="description"]')
      prevDesc = descTag?.getAttribute('content') ?? null
      if (!descTag) {
        descTag = document.createElement('meta')
        descTag.setAttribute('name', 'description')
        document.head.appendChild(descTag)
      }
      descTag.setAttribute('content', description)
    }

    let canonicalTag: HTMLLinkElement | null = null
    let prevCanonical: string | null = null
    if (canonical) {
      canonicalTag = document.querySelector('link[rel="canonical"]')
      prevCanonical = canonicalTag?.getAttribute('href') ?? null
      if (!canonicalTag) {
        canonicalTag = document.createElement('link')
        canonicalTag.setAttribute('rel', 'canonical')
        document.head.appendChild(canonicalTag)
      }
      canonicalTag.setAttribute('href', canonical)
    }

    let jsonLdTag: HTMLScriptElement | null = null
    if (jsonLd) {
      jsonLdTag = document.createElement('script')
      jsonLdTag.type = 'application/ld+json'
      jsonLdTag.textContent = JSON.stringify(jsonLd)
      document.head.appendChild(jsonLdTag)
    }

    return () => {
      document.title = prevTitle
      if (descTag && prevDesc !== null) descTag.setAttribute('content', prevDesc)
      if (canonicalTag && prevCanonical !== null) canonicalTag.setAttribute('href', prevCanonical)
      if (jsonLdTag) jsonLdTag.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, canonical, JSON.stringify(jsonLd)])
}
