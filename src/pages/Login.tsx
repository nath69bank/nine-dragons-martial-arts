import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export default function Login() {
  const { signIn } = useAuth()
  const navigate   = useNavigate()
  const [params]   = useSearchParams()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const inactive = params.get('reason') === 'inactive'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) { setError(error.message); setLoading(false); return }
    navigate('/member')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      {/* Logo / brand */}
      <Link to="/" className="mb-8 flex flex-col items-center gap-2">
        <img src="/logo.jpeg" alt="Nine Dragons" className="h-16 w-16 rounded-full object-cover border-2 border-gold" />
        <span className="font-serif italic text-gold text-xl">Nine Dragons Martial Arts</span>
      </Link>

      <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-foreground mb-1">Members Login</h1>
        <p className="text-sm text-foreground/50 mb-6">Access your training portal</p>

        {inactive && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            Your membership has been deactivated. Please contact your instructor.
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-foreground/70 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-gold/50 transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm text-foreground/70 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-gold/50 transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-background font-semibold rounded-lg py-2.5 hover:bg-gold/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>

      <Link to="/" className="mt-6 text-sm text-foreground/40 hover:text-foreground/70 transition-colors">
        ← Back to website
      </Link>
    </div>
  )
}
