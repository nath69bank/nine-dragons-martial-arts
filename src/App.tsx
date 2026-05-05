import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Public site
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

// Auth
import Login from '@/pages/Login'
import { ProtectedRoute, AdminRoute } from '@/components/ProtectedRoute'

// Member portal
import MemberLayout from '@/pages/member/MemberLayout'
import MemberDashboard from '@/pages/member/MemberDashboard'
import MemberLessons from '@/pages/member/MemberLessons'
import MemberNutrition from '@/pages/member/MemberNutrition'
import MemberGradings from '@/pages/member/MemberGradings'
import MemberBelts from '@/pages/member/MemberBelts'

// Admin panel
import AdminLayout from '@/pages/admin/AdminLayout'
import AdminOverview from '@/pages/admin/AdminOverview'
import AdminMembers from '@/pages/admin/AdminMembers'
import AdminBelts from '@/pages/admin/AdminBelts'
import AdminLessons from '@/pages/admin/AdminLessons'
import AdminNutrition from '@/pages/admin/AdminNutrition'

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
      <Routes>
        {/* Public */}
        <Route path="/" element={<PublicSite />} />
        <Route path="/login" element={<Login />} />

        {/* Member portal */}
        <Route path="/member" element={<ProtectedRoute><MemberLayout /></ProtectedRoute>}>
          <Route index element={<MemberDashboard />} />
          <Route path="lessons"   element={<MemberLessons />} />
          <Route path="nutrition" element={<MemberNutrition />} />
          <Route path="gradings"  element={<MemberGradings />} />
          <Route path="belts"     element={<MemberBelts />} />
        </Route>

        {/* Admin panel */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminOverview />} />
          <Route path="members"   element={<AdminMembers />} />
          <Route path="belts"     element={<AdminBelts />} />
          <Route path="lessons"   element={<AdminLessons />} />
          <Route path="nutrition" element={<AdminNutrition />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
