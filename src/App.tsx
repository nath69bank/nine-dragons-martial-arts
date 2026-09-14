import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Public site — eager, this is the critical homepage path
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import WhyItMatters from '@/components/WhyItMatters'
import Mission from '@/components/Mission'
import Disciplines from '@/components/Disciplines'
import Instructors from '@/components/Instructors'
import Schedule from '@/components/Schedule'
import Gallery from '@/components/Gallery'
import Testimonials from '@/components/Testimonials'
import JoinCTA from '@/components/JoinCTA'
import Footer from '@/components/Footer'
import ScrollJourney from '@/components/ScrollJourney'
import DragonDivider from '@/components/DragonDivider'
import VideoSessions from '@/components/VideoSessions'
import LeadChatbot from '@/components/LeadChatbot'
import { ProtectedRoute, AdminRoute } from '@/components/ProtectedRoute'

// Everything below is behind a route a visitor may never take — split it out
// of the main bundle so the public homepage stays fast.
const Login = lazy(() => import('@/pages/Login'))

const Blog     = lazy(() => import('@/pages/Blog'))
const BlogPost = lazy(() => import('@/pages/BlogPost'))

const MemberLayout     = lazy(() => import('@/pages/member/MemberLayout'))
const MemberDashboard  = lazy(() => import('@/pages/member/MemberDashboard'))
const MemberLessons    = lazy(() => import('@/pages/member/MemberLessons'))
const MemberNutrition  = lazy(() => import('@/pages/member/MemberNutrition'))
const MemberGradings   = lazy(() => import('@/pages/member/MemberGradings'))
const MemberBelts      = lazy(() => import('@/pages/member/MemberBelts'))
const MemberFeed       = lazy(() => import('@/pages/member/MemberFeed'))
const MemberAttendance = lazy(() => import('@/pages/member/MemberAttendance'))

const AdminLayout     = lazy(() => import('@/pages/admin/AdminLayout'))
const AdminOverview   = lazy(() => import('@/pages/admin/AdminOverview'))
const AdminMembers    = lazy(() => import('@/pages/admin/AdminMembers'))
const AdminBelts      = lazy(() => import('@/pages/admin/AdminBelts'))
const AdminLessons    = lazy(() => import('@/pages/admin/AdminLessons'))
const AdminNutrition  = lazy(() => import('@/pages/admin/AdminNutrition'))
const AdminSessions   = lazy(() => import('@/pages/admin/AdminSessions'))
const AdminFeed       = lazy(() => import('@/pages/admin/AdminFeed'))
const AdminAttendance = lazy(() => import('@/pages/admin/AdminAttendance'))
const AdminBlog       = lazy(() => import('@/pages/admin/AdminBlog'))

function RouteFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center text-gold text-sm">
      Loading…
    </div>
  )
}

function PublicSite() {
  return (
    <main className="bg-background text-foreground">
      <Navbar />
      <ScrollJourney />
      <Hero />
      <WhyItMatters />
      <DragonDivider chapter={2} title="The Way" char="道" />
      <Mission />
      <DragonDivider chapter={3} title="The Path" char="龍" />
      <Disciplines />
      <DragonDivider chapter={4} title="The Lineage" char="師" />
      <Instructors />
      <DragonDivider chapter={5} title="The Dojo" char="館" />
      <Schedule />
      <DragonDivider chapter={6} title="The Life" char="生" />
      <Gallery />
      <VideoSessions />
      <DragonDivider chapter={7} title="The Warriors" char="戰" />
      <Testimonials />
      <DragonDivider chapter={8} title="Your Turn" char="起" />
      <JoinCTA />
      <Footer />
    </main>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <LeadChatbot />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<PublicSite />} />
          <Route path="/login" element={<Login />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />

          {/* Member portal */}
          <Route path="/member" element={<ProtectedRoute><MemberLayout /></ProtectedRoute>}>
            <Route index element={<MemberDashboard />} />
            <Route path="feed"       element={<MemberFeed />} />
            <Route path="attendance" element={<MemberAttendance />} />
            <Route path="lessons"    element={<MemberLessons />} />
            <Route path="nutrition"  element={<MemberNutrition />} />
            <Route path="gradings"   element={<MemberGradings />} />
            <Route path="belts"      element={<MemberBelts />} />
          </Route>

          {/* Admin panel */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminOverview />} />
            <Route path="members"    element={<AdminMembers />} />
            <Route path="belts"      element={<AdminBelts />} />
            <Route path="lessons"    element={<AdminLessons />} />
            <Route path="nutrition"  element={<AdminNutrition />} />
            <Route path="sessions"   element={<AdminSessions />} />
            <Route path="feed"       element={<AdminFeed />} />
            <Route path="attendance" element={<AdminAttendance />} />
            <Route path="blog"       element={<AdminBlog />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
