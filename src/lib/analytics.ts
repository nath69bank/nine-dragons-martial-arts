// Thin GA4 wrapper — no-ops until VITE_GA_MEASUREMENT_ID is set in the
// environment (see .env.example), so this is safe to call anywhere.

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined

let initialized = false

export function initAnalytics() {
  if (initialized || !GA_ID) return
  initialized = true

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(...args: unknown[]) { window.dataLayer!.push(args) }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID, { send_page_view: false })
}

export function trackPageView(path: string) {
  if (!GA_ID) return
  window.gtag?.('event', 'page_view', { page_path: path })
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (!GA_ID) return
  window.gtag?.('event', name, params)
}
