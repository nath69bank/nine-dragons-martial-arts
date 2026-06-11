import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Lock, MessageCircle } from 'lucide-react'

export default function Login() {
  const { signIn }           = useAuth()
  const navigate             = useNavigate()
  const [params]             = useSearchParams()

  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const reason = params.get('reason')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) { setError(error.message); setLoading(false); return }
    navigate('/member')
  }

  function openChatbot() {
    // Dispatch a custom event that LeadChatbot listens for
    window.dispatchEvent(new CustomEvent('open-chatbot'))
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">

      {/* Brand */}
      <Link to="/" className="mb-8 flex flex-col items-center gap-2">
        <img src="/logo.jpeg" alt="Nine Dragons" className="h-16 w-16 rounded-full object-cover border-2 border-gold" />
        <span className="font-serif italic text-gold text-xl">Nine Dragons Martial Arts</span>
      </Link>

      <div className="w-full max-w-sm">

        {/* Login card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">

          <div className="flex items-center gap-2 mb-6">
            <Lock size={15} className="text-gold" />
            <h1 className="text-sm font-semibold text-foreground tracking-wide uppercase">Members Sign In</h1>
          </div>

          {/* Status banners */}
          {reason === 'inactive' && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              Your membership has been deactivated. Contact your instructor to reactivate.
            </div>
          )}
          {reason === 'pending' && (
            <div className="mb-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm">
              Your account is awaiting approval. You'll receive an email once it's activated.
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
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

        {/* Invite-only explainer */}
        <div className="mt-4 p-5 rounded-2xl border border-white/8 bg-white/[0.02] text-center">
          <p className="text-xs text-foreground/50 leading-relaxed mb-3">
            The members area is <span className="text-gold/80 font-semibold">invite-only</span>.<br />
            Accounts are created by the dojo — not open for public registration.
          </p>
          <p className="text-xs text-foreground/40 mb-4">
            Interested in joining? Start a conversation and we'll get you set up.
          </p>
          <button
            onClick={openChatbot}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border border-gold/30 text-gold hover:bg-gold/10 transition-colors"
          >
            <MessageCircle size={14} />
            Chat with us
          </button>
        </div>

        <Link to="/" className="block mt-5 text-center text-sm text-foreground/40 hover:text-foreground/70 transition-colors">
          ← Back to website
        </Link>
      </div>
    </div>
  )
}
