import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import type { GradingHistory, Belt } from '@/types/database'
import { Award } from 'lucide-react'

export default function MemberGradings() {
  const { profile }             = useAuth()
  const [gradings, setGradings] = useState<GradingHistory[]>([])
  const [belts, setBelts]       = useState<Belt[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    if (!profile) return
    Promise.all([
      supabase
        .from('grading_history')
        .select('*, from_belt:belts!from_belt_id(*), to_belt:belts!to_belt_id(*)')
        .eq('profile_id', profile.id)
        .order('graded_at', { ascending: false }),
      supabase
        .from('belts')
        .select('*')
        .order('order_index'),
    ]).then(([{ data: gh }, { data: b }]) => {
      setGradings(gh ?? [])
      setBelts(b ?? [])
      setLoading(false)
    })
  }, [profile])

  if (loading) return <div className="p-10 text-foreground/40">Loading…</div>

  const currentBeltOrder = profile?.belt?.order_index ?? 0

  return (
    <div className="p-6 lg:p-10 max-w-5xl">
      <h1 className="text-2xl font-bold text-foreground mb-8">Belt Gradings</h1>

      {/* Belt progression map */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-foreground/60 uppercase tracking-wider mb-4">Your Progression</h2>
        <div className="flex flex-col gap-2">
          {belts.map((belt, i) => {
            const achieved = belt.order_index <= currentBeltOrder
            const current  = belt.id === profile?.belt_id
            return (
              <div
                key={belt.id}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-colors
                  ${current  ? 'bg-gold/10 border-gold/40'       :
                    achieved  ? 'bg-white/5 border-white/10'      :
                                'bg-transparent border-white/5 opacity-40'}`}
              >
                <span className="w-5 h-5 rounded-full border border-white/20 flex-shrink-0"
                      style={{ background: belt.color_hex }} />
                <span className={`text-sm font-medium ${current ? 'text-gold' : 'text-foreground'}`}>
                  {belt.name} Belt
                </span>
                {current && <span className="ml-auto text-xs text-gold font-semibold uppercase tracking-wider">Current</span>}
                {!current && achieved && <span className="ml-auto text-xs text-foreground/40">Achieved</span>}
              </div>
            )
          })}
        </div>
      </section>

      {/* History */}
      <section>
        <h2 className="text-base font-semibold text-foreground/60 uppercase tracking-wider mb-4">Grading History</h2>
        {gradings.length === 0 ? (
          <p className="text-foreground/40 text-sm">No gradings recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {gradings.map(g => (
              <div key={g.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <Award size={18} className="text-gold flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground font-medium">
                    {g.from_belt ? `${g.from_belt.name} Belt → ` : ''}{g.to_belt?.name || '—'} Belt
                  </p>
                  {g.notes && <p className="text-xs text-foreground/40 truncate">{g.notes}</p>}
                </div>
                <time className="text-xs text-foreground/40 flex-shrink-0">
                  {new Date(g.graded_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </time>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
