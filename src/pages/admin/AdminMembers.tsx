import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Profile, Belt } from '@/types/database'
import { UserPlus, Pencil, Check, X, Trash2, Clock, AlertCircle } from 'lucide-react'

type EditableProfile = Omit<Profile, 'belt'>
type StatusFilter = 'all' | 'active' | 'pending' | 'inactive'

export default function AdminMembers() {
  const [members, setMembers]   = useState<Profile[]>([])
  const [belts, setBelts]       = useState<Belt[]>([])
  const [loading, setLoading]   = useState(true)
  const [editing, setEditing]   = useState<EditableProfile | null>(null)
  const [showAdd, setShowAdd]   = useState(false)
  const [filter, setFilter]     = useState<StatusFilter>('all')
  const [newEmail, setNewEmail] = useState('')
  const [newName, setNewName]   = useState('')
  const [newBelt, setNewBelt]   = useState('')
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')

  async function load() {
    const [{ data: m }, { data: b }] = await Promise.all([
      supabase.from('profiles').select('*, belt:belts(*)').order('full_name'),
      supabase.from('belts').select('*').order('order_index'),
    ])
    setMembers(m ?? [])
    setBelts(b ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function saveEdit() {
    if (!editing) return
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: editing.full_name,
        belt_id:   editing.belt_id,
        status:    editing.status,
        is_admin:  editing.is_admin,
        notes:     editing.notes,
      })
      .eq('id', editing.id)
    if (error) { setError(error.message); setSaving(false); return }
    // Log grading history if belt changed
    const old = members.find(m => m.id === editing.id)
    if (old?.belt_id !== editing.belt_id && editing.belt_id) {
      await supabase.from('grading_history').insert({
        profile_id:   editing.id,
        from_belt_id: old?.belt_id ?? null,
        to_belt_id:   editing.belt_id,
      })
    }
    setEditing(null)
    setSaving(false)
    load()
  }

  async function deleteMember(id: string, name: string) {
    if (!confirm(`Remove ${name || 'this member'}? This will revoke their access immediately.`)) return
    // Set status to inactive — full auth deletion requires server-side admin API
    await supabase.from('profiles').update({ status: 'inactive' }).eq('id', id)
    load()
  }

  async function activateMember(id: string) {
    await supabase.from('profiles').update({ status: 'active' }).eq('id', id)
    load()
  }

  async function inviteMember() {
    if (!newEmail) return
    setSaving(true)
    setError('')
    const { data, error: inviteErr } = await supabase.auth.admin.inviteUserByEmail(newEmail, {
      data: { full_name: newName },
    })
    if (inviteErr || !data?.user) {
      setError(inviteErr?.message ?? 'Could not invite user — check Supabase service key')
      setSaving(false)
      return
    }
    if (newBelt || newName) {
      await supabase.from('profiles').update({
        full_name: newName || null,
        belt_id:   newBelt || null,
        status:    'active',
      }).eq('id', data.user.id)
    }
    setShowAdd(false)
    setNewEmail('')
    setNewName('')
    setNewBelt('')
    setSaving(false)
    load()
  }

  if (loading) return <div className="p-10 text-foreground/40">Loading members…</div>

  const pending  = members.filter(m => m.status === 'pending')
  const filtered = filter === 'all' ? members : members.filter(m => m.status === filter)

  const statusCounts = {
    all:      members.length,
    active:   members.filter(m => m.status === 'active').length,
    pending:  pending.length,
    inactive: members.filter(m => m.status === 'inactive').length,
  }

  return (
    <div className="p-6 lg:p-10 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Members</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold text-background text-sm font-semibold hover:bg-gold/90 transition-colors"
        >
          <UserPlus size={15} /> Invite Member
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-2">
          <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* Pending approvals — top priority banner */}
      {pending.length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-yellow-500/8 border border-yellow-500/25">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={15} className="text-yellow-400" />
            <p className="text-sm font-semibold text-yellow-400">{pending.length} account{pending.length > 1 ? 's' : ''} awaiting approval</p>
          </div>
          <div className="space-y-2">
            {pending.map(m => (
              <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{m.full_name || '—'}</p>
                  <p className="text-xs text-foreground/40">{m.email}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => activateMember(m.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/15 text-green-400 text-xs font-semibold hover:bg-green-500/25 transition-colors"
                  >
                    <Check size={12} /> Approve
                  </button>
                  <button
                    onClick={() => deleteMember(m.id, m.full_name ?? '')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-colors"
                  >
                    <X size={12} /> Deny
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {(['all', 'active', 'pending', 'inactive'] as StatusFilter[]).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
              filter === s ? 'bg-gold text-background' : 'bg-white/5 text-foreground/50 hover:bg-white/10'
            }`}
          >
            {s} ({statusCounts[s]})
          </button>
        ))}
      </div>

      {/* Invite member modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[hsl(220,65%,5%)] border border-white/10 rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold text-foreground mb-1">Invite New Member</h2>
            <p className="text-xs text-foreground/40 mb-5">An email invite will be sent. They set their own password.</p>
            {error && <div className="mb-3 p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">{error}</div>}
            <div className="space-y-3">
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Full name"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-foreground text-sm focus:outline-none focus:border-gold/50" />
              <input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="Email address" type="email"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-foreground text-sm focus:outline-none focus:border-gold/50" />
              <select value={newBelt} onChange={e => setNewBelt(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-foreground text-sm focus:outline-none focus:border-gold/50">
                <option value="">No belt assigned yet</option>
                {belts.map(b => <option key={b.id} value={b.id}>{b.name} Belt</option>)}
              </select>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => { setShowAdd(false); setError('') }} className="flex-1 py-2 rounded-lg border border-white/10 text-sm text-foreground/60 hover:bg-white/5">Cancel</button>
              <button onClick={inviteMember} disabled={saving || !newEmail}
                className="flex-1 py-2 rounded-lg bg-gold text-background text-sm font-semibold hover:bg-gold/90 disabled:opacity-50">
                {saving ? 'Sending…' : 'Send Invite'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Members table */}
      {filtered.length === 0 ? (
        <p className="text-foreground/40 text-sm py-4">No members in this category.</p>
      ) : (
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-foreground/40 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Belt</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Status</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Admin</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(m => (
                <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                  {editing?.id === m.id ? (
                    <>
                      <td className="px-4 py-2">
                        <input value={editing.full_name ?? ''} onChange={e => setEditing({ ...editing, full_name: e.target.value })}
                          className="bg-white/5 border border-white/10 rounded px-2 py-1 text-foreground text-sm w-full focus:outline-none focus:border-gold/50" />
                        <input value={editing.notes ?? ''} onChange={e => setEditing({ ...editing, notes: e.target.value })}
                          placeholder="Notes…"
                          className="mt-1 bg-white/5 border border-white/10 rounded px-2 py-1 text-foreground text-xs w-full focus:outline-none focus:border-gold/50" />
                      </td>
                      <td className="px-4 py-2 hidden md:table-cell">
                        <select value={editing.belt_id ?? ''} onChange={e => setEditing({ ...editing, belt_id: e.target.value || null })}
                          className="bg-white/5 border border-white/10 rounded px-2 py-1 text-foreground text-sm focus:outline-none focus:border-gold/50">
                          <option value="">None</option>
                          {belts.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-2 hidden lg:table-cell">
                        <select value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value as Profile['status'] })}
                          className="bg-white/5 border border-white/10 rounded px-2 py-1 text-foreground text-sm focus:outline-none focus:border-gold/50">
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="pending">Pending</option>
                        </select>
                      </td>
                      <td className="px-4 py-2 hidden lg:table-cell">
                        <input type="checkbox" checked={editing.is_admin} onChange={e => setEditing({ ...editing, is_admin: e.target.checked })}
                          className="accent-gold" />
                      </td>
                      <td className="px-4 py-2 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={saveEdit} disabled={saving} className="p-1.5 rounded bg-gold/20 text-gold hover:bg-gold/30"><Check size={14} /></button>
                          <button onClick={() => setEditing(null)} className="p-1.5 rounded bg-white/5 text-foreground/40 hover:bg-white/10"><X size={14} /></button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 text-foreground">
                        <div className="font-medium">{m.full_name || '—'}</div>
                        <div className="text-xs text-foreground/40">{m.email}</div>
                        {m.notes && <div className="text-xs text-foreground/30 mt-0.5 italic truncate max-w-[180px]">{m.notes}</div>}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        {m.belt ? (
                          <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full bg-white/10 text-foreground/60">
                            <span className="w-2 h-2 rounded-full" style={{ background: m.belt.color_hex }} />
                            {m.belt.name}
                          </span>
                        ) : <span className="text-foreground/30 text-xs">No belt</span>}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className={`text-xs px-2 py-0.5 rounded-full
                          ${m.status === 'active'   ? 'bg-green-500/10 text-green-400' :
                            m.status === 'inactive' ? 'bg-red-500/10 text-red-400'    :
                                                      'bg-yellow-500/10 text-yellow-400'}`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-foreground/40 text-xs">
                        {m.is_admin ? <span className="text-gold text-xs">Admin</span> : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setEditing(m)} className="p-1.5 rounded bg-white/5 text-foreground/40 hover:text-gold hover:bg-white/10 transition-colors" title="Edit">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => deleteMember(m.id, m.full_name ?? '')} className="p-1.5 rounded bg-white/5 text-foreground/40 hover:text-red-400 hover:bg-white/10 transition-colors" title="Deactivate">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer tip */}
      <p className="mt-6 text-xs text-foreground/25 leading-relaxed max-w-lg">
        Members are invited via email — they set their own password and are given access only once they have an active status.
        To fully remove an account from Supabase Auth, use the Supabase dashboard → Authentication → Users.
      </p>
    </div>
  )
}
