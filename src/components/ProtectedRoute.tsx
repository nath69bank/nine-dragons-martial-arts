import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth()

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-gold">Loading…</div>
  if (!user) return <Navigate to="/login" replace />
  if (profile?.status === 'inactive') return <Navigate to="/login?reason=inactive" replace />

  return <>{children}</>
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth()

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-gold">Loading…</div>
  if (!user || !profile?.is_admin) return <Navigate to="/member" replace />

  return <>{children}</>
}
