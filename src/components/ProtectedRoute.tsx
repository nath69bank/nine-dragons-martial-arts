import { useState } from 'react'
import { Navigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Clock, Ban, AlertTriangle, RefreshCw, ChevronDown } from 'lucide-react'

function StatusGate({ icon: Icon, title, message, color }: {
  icon: typeof Clock
  title: string
  message: string
  color: string
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-5`}
           style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
        <Icon size={28} style={{ color }} />
      </div>
      <h1 className="text-xl font-bold text-foreground mb-2">{title}</h1>
      <p className="text-foreground/50 text-sm max-w-xs leading-relaxed mb-6">{message}</p>
      <div className="flex flex-col items-center gap-3">
        <a
          href="https://wa.me/447803828300"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white"
          style={{ background: '#25D366' }}
        >
          Contact us on WhatsApp
        </a>
        <Link to="/" className="text-sm text-foreground/40 hover:text-foreground/70 transition-colors">
          ← Back to website
        </Link>
      </div>
    </div>
  )
}

function NoProfileGate({ email, errorMessage }: { email: string | undefined; errorMessage: string | null }) {
  const [showDetail, setShowDetail] = useState(false)

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
           style={{ background: '#eab30818', border: '1px solid #eab30830' }}>
        <AlertTriangle size={28} style={{ color: '#eab308' }} />
      </div>
      <h1 className="text-xl font-bold text-foreground mb-2">Profile Not Set Up Yet</h1>
      <p className="text-foreground/50 text-sm max-w-sm leading-relaxed mb-2">
        You're signed in as <span className="text-foreground/80">{email}</span>, but no member profile exists for
        this account in the database yet — that's why pages here appear empty or stuck loading.
      </p>
      <p className="text-foreground/40 text-xs max-w-sm leading-relaxed mb-6">
        This is a one-time database setup step, not a bug in the page you're viewing. Run the "fix &amp; verify
        admin account" script from the setup page against this Supabase project, then reload this page.
      </p>
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-gold text-background hover:bg-gold/90 transition-colors"
        >
          <RefreshCw size={14} /> Reload and check again
        </button>
        <a
          href="https://wa.me/447803828300"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white"
          style={{ background: '#25D366' }}
        >
          Contact us on WhatsApp
        </a>
        <Link to="/" className="text-sm text-foreground/40 hover:text-foreground/70 transition-colors">
          ← Back to website
        </Link>
      </div>
      {errorMessage && (
        <div className="mt-8 max-w-sm w-full">
          <button
            onClick={() => setShowDetail(s => !s)}
            className="flex items-center gap-1 mx-auto text-xs text-foreground/30 hover:text-foreground/50 transition-colors"
          >
            <ChevronDown size={12} className={showDetail ? 'rotate-180' : ''} /> Technical detail
          </button>
          {showDetail && (
            <pre className="mt-2 p-3 rounded-lg bg-white/5 border border-white/10 text-left text-[11px] text-foreground/40 overflow-x-auto whitespace-pre-wrap">
              {errorMessage}
            </pre>
          )}
        </div>
      )}
    </div>
  )
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, profileError, loading } = useAuth()
  const location = useLocation()

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center text-gold text-sm">
      Loading…
    </div>
  )

  if (!user) return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />

  if (!profile) return <NoProfileGate email={user.email} errorMessage={profileError} />

  if (profile?.status === 'inactive') return (
    <StatusGate
      icon={Ban}
      title="Membership Deactivated"
      color="#ef4444"
      message="Your membership has been deactivated. Please contact your instructor to restore access."
    />
  )

  if (profile?.status === 'pending') return (
    <StatusGate
      icon={Clock}
      title="Account Pending Approval"
      color="#eab308"
      message="Your account is awaiting approval from the dojo. You'll receive an email once you're activated — usually within 24 hours."
    />
  )

  return <>{children}</>
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth()

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center text-gold text-sm">
      Loading…
    </div>
  )

  if (!user || !profile?.is_admin) return <Navigate to="/member" replace />

  return <>{children}</>
}
