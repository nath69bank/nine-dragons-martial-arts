import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import type { Attendance } from '@/types/database'
import { Flame, CalendarCheck } from 'lucide-react'

/** Consecutive classes attended without a gap of more than 4 days (covers Mon→Thu / Thu→Mon spacing). */
export function computeStreak(sortedDatesDesc: string[]): number {
  if (sortedDatesDesc.length === 0) return 0
  let streak = 1
  for (let i = 0; i < sortedDatesDesc.length - 1; i++) {
    const cur  = new Date(sortedDatesDesc[i]).getTime()
    const prev = new Date(sortedDatesDesc[i + 1]).getTime()
    const diffDays = (cur - prev) / 86_400_000
    if (diffDays <= 4) streak++
    else break
  }
  return streak
}

export default function MemberAttendance() {
  const { profile } = useAuth()
  const [records, setRecords] = useState<Attendance[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    supabase
      .from('attendance')
      .select('*')
      .eq('profile_id', profile.id)
      .order('class_date', { ascending: false })
      .then(({ data }) => { setRecords(data ?? []); setLoading(false) })
  }, [profile])

  if (loading) return <div className="p-10 text-foreground/40">Loading attendance…</div>

  const uniqueDates = Array.from(new Set(records.map(r => r.class_date)))
  const streak = computeStreak(uniqueDates)
  const thisMonth = records.filter(r => {
    const d = new Date(r.class_date)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  return (
    <div className="p-6 lg:p-10 max-w-3xl">
      <h1 className="text-2xl font-bold text-foreground mb-2">Attendance</h1>
      <p className="text-foreground/40 text-sm mb-8">Your training record — consistency is how belts are earned.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
          <Flame size={20} className="text-gold mb-3" />
          <p className="text-2xl font-bold text-foreground">{streak}</p>
          <p className="text-xs text-foreground/50 mt-1">Current streak</p>
        </div>
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
          <CalendarCheck size={20} className="text-gold mb-3" />
          <p className="text-2xl font-bold text-foreground">{thisMonth}</p>
          <p className="text-xs text-foreground/50 mt-1">Classes this month</p>
        </div>
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 col-span-2 sm:col-span-1">
          <CalendarCheck size={20} className="text-gold mb-3" />
          <p className="text-2xl font-bold text-foreground">{records.length}</p>
          <p className="text-xs text-foreground/50 mt-1">Total classes attended</p>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-foreground mb-4">History</h2>
      {records.length === 0 ? (
        <p className="text-foreground/40 text-sm">No attendance recorded yet — your instructor marks this at each class.</p>
      ) : (
        <div className="space-y-2">
          {records.map(r => (
            <div key={r.id} className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/10 text-sm">
              <span className="text-foreground/70">{r.class_label}</span>
              <time className="ml-auto text-xs text-foreground/40">
                {new Date(r.class_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </time>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
