import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import type { Notification } from '@/types/database'
import { Bell, BellRing } from 'lucide-react'

function timeAgo(iso: string) {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  const units: [number, string][] = [[60, 's'], [60, 'm'], [24, 'h'], [7, 'd'], [4.345, 'w'], [12, 'mo'], [Infinity, 'y']]
  let value = seconds
  for (const [amount, label] of units) {
    if (value < amount) return `${Math.max(1, Math.floor(value))}${label}`
    value /= amount
  }
  return ''
}

export default function NotificationBell() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [items, setItems] = useState<Notification[]>([])
  const [open, setOpen]   = useState(false)
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'unsupported'
  )
  const ref = useRef<HTMLDivElement>(null)

  async function load(profileId: string) {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false })
      .limit(20)
    setItems(data ?? [])
  }

  useEffect(() => {
    if (!profile) return
    load(profile.id)

    const channel = supabase
      .channel(`notifications-${profile.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `profile_id=eq.${profile.id}` },
        (payload) => {
          load(profile.id)
          const row = payload.new as Notification
          // A live system notification while the tab is open — a lighter alternative to full
          // background push, which would need a service worker, VAPID keys, and a DB webhook.
          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            const n = new window.Notification(row.title, { body: row.body ?? undefined, icon: '/logo.jpeg' })
            if (row.link) n.onclick = () => { window.focus(); navigate(row.link!) }
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [profile])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  if (!profile) return null

  const unread = items.filter(i => !i.is_read).length

  async function enableNotifications() {
    if (!('Notification' in window)) return
    const result = await window.Notification.requestPermission()
    setPermission(result)
  }

  async function markAllRead() {
    if (!profile) return
    await supabase.from('notifications').update({ is_read: true }).eq('profile_id', profile.id).eq('is_read', false)
    load(profile.id)
  }

  async function openNotification(n: Notification) {
    if (!n.is_read) await supabase.from('notifications').update({ is_read: true }).eq('id', n.id)
    setOpen(false)
    if (profile) load(profile.id)
    if (n.link) navigate(n.link)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="relative p-2 rounded-lg text-foreground/50 hover:text-foreground hover:bg-white/5 transition-colors"
        aria-label="Notifications"
      >
        {permission === 'granted' ? <BellRing size={18} /> : <Bell size={18} />}
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-gold text-background text-[10px] font-bold flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-w-[90vw] rounded-2xl bg-[hsl(220,65%,5%)] border border-white/10 shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <p className="text-sm font-semibold text-foreground">Notifications</p>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-xs text-gold hover:underline">Mark all read</button>
            )}
          </div>
          {permission === 'default' && (
            <button
              onClick={enableNotifications}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-gold bg-gold/5 hover:bg-gold/10 border-b border-white/10 transition-colors"
            >
              <BellRing size={13} /> Turn on notifications for this device
            </button>
          )}
          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 && <p className="p-4 text-sm text-foreground/40">You're all caught up.</p>}
            {items.map(n => (
              <button
                key={n.id}
                onClick={() => openNotification(n)}
                className={`w-full text-left px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors ${n.is_read ? '' : 'bg-gold/5'}`}
              >
                <p className="text-sm text-foreground/90">{n.title}</p>
                {n.body && <p className="text-xs text-foreground/40 mt-0.5 line-clamp-2">{n.body}</p>}
                <p className="text-[10px] text-foreground/30 mt-1">{timeAgo(n.created_at)} ago</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
