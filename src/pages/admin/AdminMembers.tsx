import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Profile, Belt } from '@/types/database'
import { UserPlus, Pencil, Check, X } from 'lucide-react'

type EditableProfile = Omit<Profile, 'belt'>

export default function AdminMembers() {
  const [members, setMembers]   = useState<Profile[]>([])
  const [belts, setBelts]       = useState<Belt[]>([])
  const [loading, setLoading]   = useState(true)
  const [editing, setEditing]   = useState<EditableProfile | null>(null)
  const [showAdd, setShowAdd]   = useState(false)
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
    // If belt changed, log grading history
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

  async function inviteMember() {
    if (!newEmail) return
    setSaving(true)
    setError('')
    const { data, error: inviteErr } = await supabase.auth.admin.inviteUserByEmail(newEmail, {
      data: { full_name: newName },
    })
    if (inviteErr || !data?.user) {
      setError(inviteErr?.message ?? 'Could not invite user')
      setSaving(false)
      return
    }
    if (newBelt) {
      await supabase.from('profiles').update({ full_name: newName, belt_id: newBelt }).eq('id', data.user.id)
    }
    setShowAdd(false)
    setNewEmail('')
    setNewName('')
    setNewBelt('')
    setSaving(false)
    load()
  }

  if (loading) return <div className="p-10 text-foreground/40">Loading members…</div>

  return (
    <div className="p-6 lg:p-10 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Members</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold text-background text-sm font-semibold hover:bg-gold/90 transition-colors"
        >
          <UserPlus size={15} /> Add Member
        </button>
      </div>

      {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}

      {/* Add member modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[hsl(220,65%,5%)] border border-white/10 rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold text-foreground mb-4">Invite New Member</h2>
            <div className="space-y-3">
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Full name"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-foreground text-sm focus:outline-none focus:border-gold/50" />
              <input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="Email address" type="email"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-foreground text-sm focus:outline-none focus:border-gold/50" />
              <select value={newBelt} onChange={e => setNewBelt(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-foreground text-sm focus:outline-none focus:border-gold/50">
                <option value="">No belt assigned</option>
                {belts.map(b => <option key={b.id} value={b.id}>{b.name} Belt</option>)}
              </select>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2 rounded-lg border border-white/10 text-sm text-foreground/60 hover:bg-white/5">Cancel</button>
              <button onClick={inviteMember} disabled={saving || !newEmail}
                className="flex-1 py-2 rounded-lg bg-gold text-background text-sm font-semibold hover:bg-gold/90 disabled:opacity-50">
                {saving ? 'Inviting…' : 'Send Invite'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Members table */}
      <div className="rounded-2xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-foreground/40 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left hidden md:table-cell">Belt</th>
              <th className="px-4 py-3 text-left hidden lg:table-cell">Status</th>
              <th className="px-4 py-3 text-left hidden lg:table-cell">Admin</th>
              <th className="px-4 py-3 text-right">Edit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {members.map(m => (
              <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                {editing?.id === m.id ? (
                  <>
                    <td className="px-4 py-2">
                      <input value={editing.full_name ?? ''} onChange={e => setEditing({ ...editing, full_name: e.target.value })}
                        className="bg-white/5 border border-white/10 rounded px-2 py-1 text-foreground text-sm w-full focus:outline-none focus:border-gold/50" />
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
                      <div>{m.full_name || '—'}</div>
                      <div className="text-xs text-foreground/40">{m.email}</div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {m.belt ? (
                        <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full bg-white/10 text-foreground/60">
                          <span className="w-2 h-2 rounded-full" style={{ background: m.belt.color_hex }} />
                          {m.belt.name}
                        </span>
                      ) : <span className="text-foreground/30">—</span>}
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
                      {m.is_admin ? 'Yes' : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setEditing(m)} className="p-1.5 rounded bg-white/5 text-foreground/40 hover:bg-white/10 hover:text-gold transition-colors">
                        <Pencil size={14} />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
