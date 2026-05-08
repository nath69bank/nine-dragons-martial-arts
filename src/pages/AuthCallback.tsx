import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

type Status = 'loading' | 'success' | 'error' | 'pending'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [status, setStatus] = useState<Status>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function handleCallback() {
      try {
        // Get the hash from the URL (Supabase adds tokens here)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const type = hashParams.get('type')

        // Also check URL search params for error info
        const searchParams = new URLSearchParams(window.location.search)
        const error = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')

        if (error) {
          setStatus('error')
          setMessage(errorDescription || error)
          return
        }

        if (accessToken && refreshToken) {
          // Set the session from the tokens
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (sessionError) {
            setStatus('error')
            setMessage(sessionError.message)
            return
          }

          // Check if this was an email confirmation
          if (type === 'signup' || type === 'email') {
            // Fetch the user's profile to check their status
            const { data: { user } } = await supabase.auth.getUser()
            
            if (user) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('status')
                .eq('id', user.id)
                .single()

              if (profile?.status === 'pending' || profile?.status === 'inactive') {
                setStatus('pending')
                setMessage('Your email has been confirmed! Your account is now awaiting approval from your instructor.')
              } else {
                setStatus('success')
                setMessage('Your email has been confirmed! Redirecting to the members area...')
                setTimeout(() => navigate('/member'), 2000)
              }
            }
          } else {
            // Regular sign in via magic link or similar
            setStatus('success')
            setMessage('Successfully signed in! Redirecting...')
            setTimeout(() => navigate('/member'), 1500)
          }
        } else {
          // No tokens found - might be a different callback type
          // Check if user is already logged in
          const { data: { session } } = await supabase.auth.getSession()
          
          if (session) {
            setStatus('success')
            setMessage('You are already signed in. Redirecting...')
            setTimeout(() => navigate('/member'), 1500)
          } else {
            setStatus('error')
            setMessage('Invalid or expired confirmation link. Please try signing up again or contact your instructor.')
          }
        }
      } catch (err) {
        console.error('Auth callback error:', err)
        setStatus('error')
        setMessage('Something went wrong. Please try again or contact your instructor.')
      }
    }

    handleCallback()
  }, [navigate])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      {/* Brand */}
      <Link to="/" className="mb-8 flex flex-col items-center gap-2">
        <img src="/logo.jpeg" alt="Nine Dragons" className="h-16 w-16 rounded-full object-cover border-2 border-gold" />
        <span className="font-serif italic text-gold text-xl">Nine Dragons Martial Arts</span>
      </Link>

      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
        {status === 'loading' && (
          <>
            <div className="flex justify-center mb-4">
              <Loader2 className="h-12 w-12 text-gold animate-spin" />
            </div>
            <h1 className="text-xl font-semibold text-foreground mb-2">Confirming your email...</h1>
            <p className="text-foreground/60 text-sm">Please wait while we verify your account.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-green-500/10">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
            </div>
            <h1 className="text-xl font-semibold text-foreground mb-2">Email Confirmed!</h1>
            <p className="text-foreground/60 text-sm">{message}</p>
          </>
        )}

        {status === 'pending' && (
          <>
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-gold/10">
                <CheckCircle className="h-10 w-10 text-gold" />
              </div>
            </div>
            <h1 className="text-xl font-semibold text-foreground mb-2">Email Confirmed!</h1>
            <p className="text-foreground/60 text-sm mb-6">{message}</p>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-sm text-foreground/70">
                Once approved, you&apos;ll be able to sign in and access the members area with all training resources.
              </p>
            </div>
            <Link 
              to="/" 
              className="inline-block mt-6 text-sm text-gold hover:underline"
            >
              Return to homepage
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-red-500/10">
                <AlertCircle className="h-10 w-10 text-red-500" />
              </div>
            </div>
            <h1 className="text-xl font-semibold text-foreground mb-2">Confirmation Failed</h1>
            <p className="text-foreground/60 text-sm mb-6">{message}</p>
            <div className="flex flex-col gap-3">
              <Link 
                to="/login" 
                className="inline-block px-6 py-2.5 bg-gold text-background font-semibold rounded-lg hover:bg-gold/90 transition-colors"
              >
                Back to Sign In
              </Link>
              <Link 
                to="/" 
                className="text-sm text-foreground/40 hover:text-foreground/70 transition-colors"
              >
                Return to homepage
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
