import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import type { GradingHistory, Lesson, NutritionGuide } from '@/types/database'
import { BookOpen, Apple, Award, ChevronRight } from 'lucide-react'

export default function MemberDashboard() {
  const { profile } = useAuth()
  const [gradings, setGradings]   = useState<GradingHistory[]>([])
  const [lessons, setLessons]     = useState<Lesson[]>([])
  const [nutrition, setNutrition] = useState<NutritionGuide[]>([])

  useEffect(() => {
    if (!profile) return

    supabase
      .from('grading_history')
      .select('*, from_belt:belts!from_belt_id(*), to_belt:belts!to_belt_id(*)')
      .eq('profile_id', profile.id)
      .order('graded_at', { ascending: false })
      .limit(3)
      .then(({ data }) => setGradings(data ?? []))

    supabase
      .from('lessons')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }) => setLessons(data ?? []))

    supabase
      .from('nutrition_guides')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }) => setNutrition(data ?? []))
  }, [profile])

  return (
    <div className="p-6 lg:p-10 max-w-5xl">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {profile?.full_name?.split(' ')[0] || 'Warrior'}
        </h1>
        {profile?.belt && (
          <div className="mt-2 flex items-center gap-2">
            <span className="w-4 h-4 rounded-full border border-white/20"
                  style={{ background: profile.belt.color_hex }} />
            <span className="text-foreground/60 text-sm">{profile.belt.name} Belt</span>
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { to: '/member/lessons',   label: 'Lessons',   icon: BookOpen, count: lessons.length },
          { to: '/member/nutrition', label: 'Nutrition',  icon: Apple,    count: nutrition.length },
          { to: '/member/gradings',  label: 'Gradings',   icon: Award,    count: gradings.length },
        ].map(({ to, label, icon: Icon, count }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-gold/30 transition-colors group"
          >
            <div className="p-2.5 rounded-lg bg-gold/10 text-gold">
              <Icon size={20} />
            </div>
            <div>
              <p className="font-semibold text-foreground">{label}</p>
              <p className="text-xs text-foreground/40">{count} available</p>
            </div>
            <ChevronRight size={16} className="ml-auto text-foreground/20 group-hover:text-gold transition-colors" />
          </Link>
        ))}
      </div>

      {/* Recent grading history */}
      {gradings.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Your Grading History</h2>
          <div className="space-y-3">
            {gradings.map(g => (
              <div key={g.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <Award size={18} className="text-gold flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    {g.from_belt ? `${g.from_belt.name} → ` : ''}{g.to_belt?.name || '—'} Belt
                  </p>
                  {g.notes && <p className="text-xs text-foreground/40 truncate">{g.notes}</p>}
                </div>
                <time className="text-xs text-foreground/40 flex-shrink-0">
                  {new Date(g.graded_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </time>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
