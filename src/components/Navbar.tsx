import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Instagram, Facebook, Youtube, Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Philosophy', href: '#philosophy' },
  { label: 'Disciplines', href: '#disciplines' },
  { label: 'Schedule', href: '#schedule' },
  { label: 'Instructors', href: '#instructors' },
  { label: 'Join', href: '#join' },
]

const SOCIAL = [
  { Icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { Icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { Icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-16 py-3 transition-all duration-500',
          scrolled || menuOpen
            ? 'bg-[hsl(220,65%,1%)]/95 backdrop-blur-md border-b border-[rgba(201,161,74,0.15)]'
            : 'bg-transparent'
        )}
      >
        {/* ── Left: Logo + Name ── */}
        <a href="#home" className="flex items-center gap-3 group shrink-0" onClick={() => setMenuOpen(false)}>
          <motion.img
            src="/logo.jpeg"
            alt="Nine Dragons"
            className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover shrink-0"
            whileHover={{ scale: 1.1 }}
            style={{
              filter:
                'drop-shadow(0 0 6px rgba(201,161,74,0.5)) drop-shadow(0 0 14px rgba(26,79,200,0.3))',
            }}
          />
          <div className="flex flex-col leading-none">
            <span className="font-bold text-sm tracking-[0.18em] uppercase text-white">
              Nine Dragons
            </span>
            <span
              className="text-[9px] tracking-[0.22em] uppercase font-medium"
              style={{ color: '#c9a14a' }}
            >
              Martial Arts
            </span>
          </div>
        </a>

        {/* ── Centre: Nav links (desktop only) ── */}
        <div className="hidden lg:flex items-center gap-0.5 text-sm">
          {NAV_LINKS.map((link, i) => (
            <span key={link.label} className="flex items-center">
              <a
                href={link.href}
                className="px-3 py-1.5 text-[rgba(255,255,255,0.6)] hover:text-white transition-colors duration-200 rounded text-[13px] tracking-wide"
              >
                {link.label}
              </a>
              {i < NAV_LINKS.length - 1 && (
                <span className="text-[rgba(201,161,74,0.35)] text-[10px] select-none mx-0.5">
                  ·
                </span>
              )}
            </span>
          ))}
        </div>

        {/* ── Right: Socials + CTA + Hamburger ── */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Socials — hide on small mobile */}
          <div className="hidden sm:flex items-center gap-2">
            {SOCIAL.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="liquid-glass w-9 h-9 rounded-full flex items-center justify-center text-[rgba(255,255,255,0.5)] hover:text-[#c9a14a] transition-colors duration-200"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>

          {/* Members login — desktop */}
          <Link
            to="/login"
            className="ml-2 hidden lg:flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-bold tracking-[0.18em] uppercase border border-[rgba(201,161,74,0.35)] text-[#c9a14a] hover:bg-[rgba(201,161,74,0.08)] transition-all duration-200"
          >
            Members
          </Link>

          {/* Desktop CTA */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-chatbot', { detail: { intent: 'free-trial' } }))}
            className="ml-2 hidden lg:flex items-center gap-2 rounded-full px-5 py-2 text-[11px] font-bold tracking-[0.18em] uppercase transition-all duration-200 hover:opacity-90 active:scale-95 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #c9a14a 0%, #e0c060 50%, #c9a14a 100%)',
              color: '#0a1020',
            }}
          >
            Free Trial
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="lg:hidden ml-1 w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors duration-200"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={menuOpen ? 'close' : 'open'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      {/* ── Mobile menu drawer ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed inset-0 z-40 pt-[60px] lg:hidden"
            style={{ background: 'hsl(220,65%,1%)' }}
          >
            {/* Gold line top */}
            <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,161,74,0.5), transparent)' }} />

            <div className="flex flex-col h-full overflow-y-auto px-6 pb-12 pt-6">
              {/* Nav links */}
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.04 }}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between py-4 border-b text-lg font-medium text-white/80 hover:text-white transition-colors"
                    style={{ borderColor: 'rgba(201,161,74,0.12)' }}
                  >
                    <span>{link.label}</span>
                    <span style={{ color: '#c9a14a' }}>→</span>
                  </motion.a>
                ))}
              </nav>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.28 }}
                className="mt-8 flex flex-col gap-3"
              >
                <button
                  onClick={() => { setMenuOpen(false); window.dispatchEvent(new CustomEvent('open-chatbot', { detail: { intent: 'free-trial' } })) }}
                  className="block w-full text-center py-4 rounded-full text-sm font-bold tracking-[0.18em] uppercase cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #c9a14a 0%, #e0c060 50%, #c9a14a 100%)',
                    color: '#0a1020',
                    boxShadow: '0 0 40px rgba(201,161,74,0.25)',
                  }}
                >
                  Book Free Trial
                </button>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block text-center py-3 rounded-full text-sm font-bold tracking-[0.18em] uppercase border border-[rgba(201,161,74,0.35)] text-[#c9a14a]"
                >
                  Members Login
                </Link>
                <p className="text-center text-xs text-white/30">Your first class is free</p>
              </motion.div>

              {/* Socials */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.35 }}
                className="mt-8 flex items-center justify-center gap-4"
              >
                {SOCIAL.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="liquid-glass w-11 h-11 rounded-full flex items-center justify-center text-white/50 hover:text-[#c9a14a] transition-colors"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </motion.div>

              {/* Contact */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="mt-6 text-center text-xs"
                style={{ color: 'rgba(255,255,255,0.25)' }}
              >
                hello@ninedragonsmartialarts.co.uk
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
