import { useEffect } from 'react'

/** Marks the current page as noindex,nofollow — for private, login-gated routes. */
export function useNoIndex() {
  useEffect(() => {
    let tag = document.querySelector('meta[name="robots"]')
    const original = tag?.getAttribute('content') ?? null
    if (!tag) {
      tag = document.createElement('meta')
      tag.setAttribute('name', 'robots')
      document.head.appendChild(tag)
    }
    tag.setAttribute('content', 'noindex, nofollow')
    return () => {
      if (original) tag!.setAttribute('content', original)
    }
  }, [])
}
