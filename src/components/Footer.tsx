import { MapPin, Mail, Facebook, Heart } from 'lucide-react'

const NAV = [
  { label: 'Philosophy', href: '#philosophy' },
  { label: 'Disciplines', href: '#disciplines' },
  { label: 'Schedule', href: '#schedule' },
  { label: 'Instructors', href: '#instructors' },
  { label: 'Join', href: '#join' },
]

export default function Footer() {
  return (
    <footer className="border-t border-border/30 py-12 px-5 md:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Top row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 mb-10">
          {/* Brand */}
          <div className="flex items-center gap-4">
            <img
              src="/logo.jpeg"
              alt="Nine Dragons"
              className="w-12 h-12 rounded-full object-cover shrink-0"
              style={{ filter: 'drop-shadow(0 0 6px rgba(201,161,74,0.45))' }}
            />
            <div className="flex flex-col leading-none gap-1">
              <span className="font-bold text-sm tracking-[0.18em] uppercase text-white">
                Nine Dragons
              </span>
              <span
                className="text-[9px] tracking-[0.28em] uppercase font-medium"
                style={{ color: '#c9a14a' }}
              >
                Martial Arts
              </span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden sm:flex flex-wrap gap-x-6 gap-y-2">
            {NAV.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <a
            href="mailto:hello@ninedragonsmartialarts.co.uk?subject=Free Trial Request"
            className="shrink-0 px-6 py-2.5 rounded-full text-xs font-bold tracking-[0.18em] uppercase transition-opacity hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, #c9a14a 0%, #e0c060 50%, #c9a14a 100%)',
              color: '#0a1020',
            }}
          >
            Free Trial
          </a>
        </div>

        {/* Divider */}
        <div className="border-t border-border/30 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <MapPin size={13} className="text-primary/70 shrink-0" />
              <span>St Annes Church Hall, Birkenhead</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Mail size={13} className="text-primary/70 shrink-0" />
              <a
                href="mailto:hello@ninedragonsmartialarts.co.uk"
                className="hover:text-foreground transition-colors"
              >
                hello@ninedragonsmartialarts.co.uk
              </a>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Heart size={12} className="text-primary/60 shrink-0" />
              <span className="text-xs text-muted-foreground">
                Proudly supporting{' '}
                <span className="text-foreground font-medium">Claire's House</span> Children's Hospice
              </span>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3">
            <a
              href="https://facebook.com"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary text-sm transition-colors"
            >
              <Facebook size={14} />
              Nine Dragons Martial Arts
            </a>
            <div className="flex items-center gap-5 text-xs text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a
                href="mailto:hello@ninedragonsmartialarts.co.uk"
                className="hover:text-foreground transition-colors"
              >
                Contact
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2026 Nine Dragons Martial Arts. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
