import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// registerPlugin is idempotent — safe even if this module is evaluated more than once
gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

type Target = gsap.TweenTarget

/**
 * Fade + rise reveal, triggered once as `targets` scrolls into view.
 * `from` overrides the starting state (e.g. { x: -24 } instead of the y-rise
 * default); everything else merges into the GSAP tween + ScrollTrigger vars.
 */
export function reveal(
  targets: Target,
  opts: {
    from?: gsap.TweenVars
    trigger?: Element | string | null
    start?: string
    stagger?: number
    delay?: number
    duration?: number
    ease?: string
  } = {}
) {
  const {
    from = { y: 28 },
    trigger,
    start = 'top 82%',
    stagger,
    delay = 0,
    duration = 0.7,
    ease = 'power3.out',
  } = opts

  gsap.set(targets, { opacity: 0, ...from })

  return gsap.to(targets, {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    duration,
    delay,
    ease,
    ...(stagger !== undefined ? { stagger } : {}),
    scrollTrigger: {
      trigger: trigger ?? (Array.isArray(targets) ? (targets[0] as Element) : (targets as Element)),
      start,
    },
  })
}
