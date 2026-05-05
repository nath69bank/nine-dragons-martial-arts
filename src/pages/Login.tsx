import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

type Tab = 'login' | 'register'

export default function Login() {
  const { signIn }   = useAuth()
  const navigate     = useNavigate()
  const [params]     = useSearchParams()
  const [tab, setTab] = useState<Tab>('login')

  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [fullName, setFullName]   = useState('')
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState('')
  const [loading, setLoading]     = useState(false)

  const inactive = params.get('reason') === 'inactive'

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) { setError(error.message); setLoading(false); return }
    navigate('/member')
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) { setError(error.message); setLoading(false); return }
    setSuccess('Account created! Your instructor will activate your account before you can log in.')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      {/* Brand */}
      <Link to="/" className="mb-8 flex flex-col items-center gap-2">
        <img src="/logo.jpeg" alt="Nine Dragons" className="h-16 w-16 rounded-full object-cover border-2 border-gold" />
        <span className="font-serif italic text-gold text-xl">Nine Dragons Martial Arts</span>
      </Link>

      <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-8">
        {/* Tabs */}
        <div className="flex rounded-lg bg-white/5 p-1 mb-6">
          {(['login', 'register'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(''); setSuccess('') }}
              className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors capitalize
                ${tab === t ? 'bg-gold text-background' : 'text-foreground/50 hover:text-foreground'}`}
            >
              {t === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        {inactive && tab === 'login' && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            Your membership has been deactivated. Please contact your instructor.
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">{success}</div>
        )}

        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-foreground/70 mb-1">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm text-foreground/70 mb-1">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-gold text-background font-semibold rounded-lg py-2.5 hover:bg-gold/90 transition-colors disabled:opacity-50">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm text-foreground/70 mb-1">Full Name</label>
              <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="Your full name" />
            </div>
            <div>
              <label className="block text-sm text-foreground/70 mb-1">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm text-foreground/70 mb-1">Password</label>
              <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="Min. 6 characters" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-gold text-background font-semibold rounded-lg py-2.5 hover:bg-gold/90 transition-colors disabled:opacity-50">
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
            <p className="text-xs text-foreground/40 text-center leading-relaxed">
              Your account will be reviewed by your instructor before you can access the members area.
            </p>
          </form>
        )}
      </div>

      <Link to="/" className="mt-6 text-sm text-foreground/40 hover:text-foreground/70 transition-colors">
        ← Back to website
      </Link>
    </div>
  )
}
