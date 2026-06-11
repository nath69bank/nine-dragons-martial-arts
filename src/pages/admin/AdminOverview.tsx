import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Users, Award, BookOpen, Apple, Video } from 'lucide-react'

interface Stats { members: number; belts: number; lessons: number; nutrition: number; sessions: number }

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats>({ members: 0, belts: 0, lessons: 0, nutrition: 0, sessions: 0 })

  useEffect(() => {
    Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('belts').select('id', { count: 'exact', head: true }),
      supabase.from('lessons').select('id', { count: 'exact', head: true }),
      supabase.from('nutrition_guides').select('id', { count: 'exact', head: true }),
      supabase.from('public_sessions').select('id', { count: 'exact', head: true }).eq('is_published', true),
    ]).then(([m, b, l, n, s]) => setStats({
      members:   m.count ?? 0,
      belts:     b.count ?? 0,
      lessons:   l.count ?? 0,
      nutrition: n.count ?? 0,
      sessions:  s.count ?? 0,
    }))
  }, [])

  const cards = [
    { label: 'Active Members',  value: stats.members,   icon: Users,    href: '/admin/members'   },
    { label: 'Belt Levels',     value: stats.belts,     icon: Award,    href: '/admin/belts'     },
    { label: 'Lessons',         value: stats.lessons,   icon: BookOpen, href: '/admin/lessons'   },
    { label: 'Nutrition Guides',value: stats.nutrition, icon: Apple,    href: '/admin/nutrition' },
    { label: 'Live Sessions',   value: stats.sessions,  icon: Video,    href: '/admin/sessions'  },
  ]

  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      <h1 className="text-2xl font-bold text-foreground mb-2">Admin Overview</h1>
      <p className="text-foreground/40 text-sm mb-8">Manage members, belts, and content from here.</p>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map(({ label, value, icon: Icon, href }) => (
          <a key={href} href={href} className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-gold/30 transition-colors group">
            <Icon size={20} className="text-gold mb-3" />
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-foreground/50 mt-1">{label}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
