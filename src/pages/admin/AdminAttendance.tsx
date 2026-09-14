import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { supabase } from '@/lib/supabase'
import type { Profile, Attendance } from '@/types/database'
import { Check, CalendarDays, QrCode, X } from 'lucide-react'

const CLASS_OPTIONS = [
  'Dragon Cubs (5–7)',
  'Dragon Sparks (8–12)',
  'Dragon Ninjas (13–16)',
  'Dragon Warriors (16+)',
  'Kaizendo Kickboxing',
  'Dragon Masters',
]

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function AdminAttendance() {
  const [members, setMembers]       = useState<Profile[]>([])
  const [date, setDate]             = useState(todayISO())
  const [classLabel, setClassLabel] = useState(CLASS_OPTIONS[0])
  const [present, setPresent]       = useState<Set<string>>(new Set())
  const [recent, setRecent]         = useState<Attendance[]>([])
  const [loading, setLoading]       = useState(true)
  const [saving, setSaving]         = useState<string | null>(null)
  const [showQr, setShowQr]         = useState(false)
  const [qrDataUrl, setQrDataUrl]   = useState('')

  async function loadMembers() {
    const { data } = await supabase.from('profiles').select('*, belt:belts(*)').eq('status', 'active').order('full_name')
    setMembers(data ?? [])
  }

  async function loadAttendanceForDate() {
    const { data } = await supabase.from('attendance').select('*').eq('class_date', date).eq('class_label', classLabel)
    setPresent(new Set((data ?? []).map(a => a.profile_id)))
  }

  async function loadRecent() {
    const { data } = await supabase
      .from('attendance')
      .select('*, profile:profiles(full_name, email)')
      .order('class_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(20)
    setRecent(data ?? [])
  }

  useEffect(() => { loadMembers().then(() => setLoading(false)); loadRecent() }, [])
  useEffect(() => { loadAttendanceForDate() }, [date, classLabel])

  useEffect(() => {
    if (!showQr) return
    const checkinUrl = `${window.location.origin}/member/checkin?class=${encodeURIComponent(classLabel)}&date=${date}`
    QRCode.toDataURL(checkinUrl, { width: 280, margin: 1, color: { dark: '#0a1020', light: '#f5efe0' } })
      .then(setQrDataUrl)
  }, [showQr, date, classLabel])

  async function toggle(profileId: string) {
    setSaving(profileId)
    if (present.has(profileId)) {
      await supabase.from('attendance').delete().eq('profile_id', profileId).eq('class_date', date).eq('class_label', classLabel)
    } else {
      const { data: { user } } = await supabase.auth.getUser()
      await supabase.from('attendance').insert({ profile_id: profileId, class_date: date, class_label: classLabel, marked_by: user?.id ?? null })
    }
    await loadAttendanceForDate()
    await loadRecent()
    setSaving(null)
  }

  if (loading) return <div className="p-10 text-foreground/40">Loading attendance…</div>

  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      <h1 className="text-2xl font-bold text-foreground mb-2">Attendance</h1>
      <p className="text-foreground/40 text-sm mb-6">Mark who showed up — feeds each member's attendance streak on their dashboard.</p>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-foreground text-sm focus:outline-none focus:border-gold/50"
        />
        <select
          value={classLabel}
          onChange={e => setClassLabel(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-foreground text-sm focus:outline-none focus:border-gold/50"
        >
          {CLASS_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button
          onClick={() => setShowQr(s => !s)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors
            ${showQr ? 'bg-gold text-background' : 'bg-white/5 text-foreground/60 hover:bg-white/10'}`}
        >
          <QrCode size={14} /> Check-in QR
        </button>
        <span className="flex items-center gap-1.5 text-sm text-foreground/40 ml-auto">
          <CalendarDays size={14} /> {present.size} / {members.length} present
        </span>
      </div>

      {showQr && (
        <div className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center text-center">
          <div className="flex items-center justify-between w-full mb-4">
            <p className="text-sm font-semibold text-foreground">Scan to check in — {classLabel}</p>
            <button onClick={() => setShowQr(false)} className="p-1 rounded text-foreground/40 hover:text-foreground"><X size={16} /></button>
          </div>
          {qrDataUrl ? (
            <img src={qrDataUrl} alt={`Check-in QR code for ${classLabel} on ${date}`} className="rounded-xl w-[220px] h-[220px]" />
          ) : (
            <div className="w-[220px] h-[220px] flex items-center justify-center text-foreground/30 text-xs">Generating…</div>
          )}
          <p className="mt-4 text-xs text-foreground/40 max-w-xs">
            Display this on a screen or print it — members scan with their phone, log in if needed, and are marked present instantly. Only works for today's date.
          </p>
        </div>
      )}

      <div className="rounded-2xl border border-white/10 divide-y divide-white/5 mb-10">
        {members.map(m => {
          const attended = present.has(m.id)
          return (
            <button
              key={m.id}
              onClick={() => toggle(m.id)}
              disabled={saving === m.id}
              className="w-full flex items-center gap-4 px-5 py-3 hover:bg-white/[0.02] transition-colors text-left disabled:opacity-50"
            >
              <span className={`w-6 h-6 rounded-md border flex items-center justify-center flex-shrink-0 transition-colors
                ${attended ? 'bg-gold border-gold text-background' : 'border-white/20 text-transparent'}`}>
                <Check size={14} />
              </span>
              <span className="flex-1 min-w-0 flex items-center gap-2">
                <span className="text-sm text-foreground">{m.full_name || m.email}</span>
                {m.belt && (
                  <span className="inline-flex items-center gap-1 text-xs text-foreground/40">
                    <span className="w-2 h-2 rounded-full" style={{ background: m.belt.color_hex }} />
                    {m.belt.name}
                  </span>
                )}
              </span>
            </button>
          )
        })}
        {members.length === 0 && <p className="p-5 text-sm text-foreground/40">No active members yet.</p>}
      </div>

      <h2 className="text-lg font-semibold text-foreground mb-4">Recent Attendance</h2>
      <div className="space-y-2">
        {recent.map(a => (
          <div key={a.id} className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/10 text-sm">
            <span className="text-foreground/70">{a.profile?.full_name || a.profile?.email}</span>
            <span className="text-foreground/30 text-xs">{a.class_label}</span>
            <time className="ml-auto text-xs text-foreground/40">
              {new Date(a.class_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </time>
          </div>
        ))}
        {recent.length === 0 && <p className="text-sm text-foreground/40">No attendance recorded yet.</p>}
      </div>
    </div>
  )
}
