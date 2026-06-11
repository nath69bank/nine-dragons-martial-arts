import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Users, Award, BookOpen, Apple, LayoutDashboard, LogOut, ChevronLeft, Video } from 'lucide-react'

const nav = [
  { to: '/admin',           label: 'Overview',   icon: LayoutDashboard, end: true },
  { to: '/admin/members',   label: 'Members',    icon: Users },
  { to: '/admin/belts',     label: 'Belts',      icon: Award },
  { to: '/admin/lessons',   label: 'Lessons',    icon: BookOpen },
  { to: '/admin/nutrition', label: 'Nutrition',  icon: Apple },
  { to: '/admin/sessions',  label: 'Sessions',   icon: Video },
]

export default function AdminLayout() {
  const { signOut } = useAuth()
  const navigate    = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      <aside className="lg:w-64 bg-white/[0.03] border-b lg:border-b-0 lg:border-r border-white/10 flex lg:flex-col">
        <div className="px-6 py-5 flex items-center gap-3 border-b border-white/10">
          <img src="/logo.jpeg" alt="" className="h-9 w-9 rounded-full object-cover border border-gold/40" />
          <div className="hidden lg:block">
            <p className="text-xs text-foreground/40">Admin Panel</p>
            <p className="text-sm font-semibold text-gold">Nine Dragons</p>
          </div>
        </div>

        <nav className="flex lg:flex-col gap-1 px-3 py-3 flex-1 overflow-x-auto">
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

        <div className="hidden lg:flex flex-col gap-1 px-3 py-4 border-t border-white/10">
          <NavLink to="/member" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground/40 hover:text-foreground/70 hover:bg-white/5 transition-colors">
            <ChevronLeft size={16} />
            Member portal
          </NavLink>
          <button onClick={handleSignOut} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground/40 hover:text-foreground/70 hover:bg-white/5 transition-colors">
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
