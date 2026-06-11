import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Clock, Ban } from 'lucide-react'

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

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth()

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center text-gold text-sm">
      Loading…
    </div>
  )

  if (!user) return <Navigate to="/login" replace />

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
