import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { LayoutDashboard, BookOpen, Apple, Award, LogOut, ShieldCheck, Shield } from 'lucide-react'

const nav = [
  { to: '/member',          label: 'Dashboard',  icon: LayoutDashboard, end: true },
  { to: '/member/lessons',  label: 'Lessons',    icon: BookOpen },
  { to: '/member/nutrition',label: 'Nutrition',   icon: Apple },
  { to: '/member/gradings', label: 'Gradings',    icon: Award },
  { to: '/member/belts',    label: 'Belt Guide',  icon: Shield },
]

export default function MemberLayout() {
  const { profile, signOut, isAdmin } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="lg:w-64 bg-white/[0.03] border-b lg:border-b-0 lg:border-r border-white/10 flex lg:flex-col">
        {/* Brand */}
        <div className="px-6 py-5 flex items-center gap-3 border-b border-white/10">
          <img src="/logo.jpeg" alt="" className="h-9 w-9 rounded-full object-cover border border-gold/40" />
          <div className="hidden lg:block">
            <p className="text-xs text-foreground/40 leading-none">Members Portal</p>
            <p className="text-sm font-semibold text-gold mt-0.5 leading-none">Nine Dragons</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex lg:flex-col gap-1 px-3 py-3 flex-1 overflow-x-auto lg:overflow-x-visible">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors whitespace-nowrap
                ${isActive ? 'bg-gold/10 text-gold' : 'text-foreground/60 hover:text-foreground hover:bg-white/5'}`
              }
            >
              <Icon size={16} />
              <span className="hidden lg:inline">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="hidden lg:flex flex-col gap-2 px-3 py-4 border-t border-white/10">
          {/* Belt badge */}
          {profile?.belt && (
            <div className="px-3 py-2 rounded-lg bg-white/5 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full border border-white/20 flex-shrink-0"
                    style={{ background: profile.belt.color_hex }} />
              <span className="text-xs text-foreground/60 truncate">{profile.belt.name} Belt</span>
            </div>
          )}
          {isAdmin && (
            <NavLink
              to="/admin"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-royal hover:bg-white/5 transition-colors"
            >
              <ShieldCheck size={16} />
              Admin Panel
            </NavLink>
          )}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground/40 hover:text-foreground/70 hover:bg-white/5 transition-colors"
          >
            <LogOut size={16} />
            Sign out
          </button>
          <p className="px-3 text-xs text-foreground/30 truncate">{profile?.full_name || profile?.email}</p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
