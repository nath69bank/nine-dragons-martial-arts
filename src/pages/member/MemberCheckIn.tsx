import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'

type State = 'checking' | 'success' | 'already' | 'error' | 'bad-link'

export default function MemberCheckIn() {
  const { profile } = useAuth()
  const [params] = useSearchParams()
  const [state, setState] = useState<State>('checking')
  const [errorMsg, setErrorMsg] = useState('')

  const classLabel = params.get('class')
  const classDate  = params.get('date')

  useEffect(() => {
    if (!profile) return
    if (!classLabel || !classDate) { setState('bad-link'); return }

    supabase
      .from('attendance')
      .insert({ profile_id: profile.id, class_date: classDate, class_label: classLabel, marked_by: profile.id })
      .then(({ error }) => {
        if (!error) { setState('success'); return }
        // Unique constraint violation — already checked in today for this class
        if (error.code === '23505') { setState('already'); return }
        setErrorMsg(error.message)
        setState('error')
      })
  }, [profile, classLabel, classDate])

  const today = new Date().toISOString().slice(0, 10)
  const isToday = classDate === today

  return (
    <div className="p-6 lg:p-10 max-w-md mx-auto text-center">
      {state === 'checking' && (
        <>
          <Loader2 size={36} className="text-gold mx-auto mb-4 animate-spin" />
          <p className="text-foreground/60">Checking you in…</p>
        </>
      )}

      {state === 'success' && (
        <>
          <CheckCircle2 size={48} className="text-green-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-foreground mb-1">You're checked in!</h1>
          <p className="text-foreground/60 text-sm">{classLabel} — {classDate}</p>
        </>
      )}

      {state === 'already' && (
        <>
          <CheckCircle2 size={48} className="text-gold mx-auto mb-4" />
          <h1 className="text-xl font-bold text-foreground mb-1">Already checked in</h1>
          <p className="text-foreground/60 text-sm">You're already marked present for {classLabel} today.</p>
        </>
      )}

      {state === 'bad-link' && (
        <>
          <XCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-foreground mb-1">Invalid check-in link</h1>
          <p className="text-foreground/60 text-sm">Ask your instructor for today's check-in QR code.</p>
        </>
      )}

      {!isToday && classDate && state !== 'bad-link' && (
        <p className="mt-4 text-xs text-yellow-400">This code isn't for today's date — check-in only works on the day of class.</p>
      )}

      {state === 'error' && (
        <>
          <XCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-foreground mb-1">Couldn't check you in</h1>
          <p className="text-foreground/60 text-sm">{errorMsg || 'Something went wrong — ask your instructor to mark you in manually.'}</p>
        </>
      )}

      <Link to="/member/attendance" className="inline-block mt-8 text-sm text-gold hover:underline">
        View your attendance →
      </Link>
    </div>
  )
}
