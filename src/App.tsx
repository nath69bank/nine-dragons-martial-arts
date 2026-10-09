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
import InlineCTA from '@/components/InlineCTA'
import CommunityEvents from '@/components/CommunityEvents'

// Blog — split out, a visitor may never take this route
const Blog     = lazy(() => import('@/pages/Blog'))
const BlogPost = lazy(() => import('@/pages/BlogPost'))

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
      <InlineCTA
        eyebrow="Found Your Stage?"
        heading={<>Every Dragon has a <em style={{ color: '#c9a14a', fontStyle: 'italic' }}>starting point.</em></>}
        body="Whichever stage fits — Cub, Spark, Ninja, Warrior, or Master — your first class is free and there's no pressure to commit."
        buttonText="Claim Your Free Class"
        intent="free-trial"
      />
      <DragonDivider chapter={4} title="The Lineage" char="師" />
      <Instructors />
      <DragonDivider chapter={5} title="The Dojo" char="館" />
      <Schedule />
      <DragonDivider chapter={6} title="The Life" char="生" />
      <Gallery />
      <VideoSessions />
      <CommunityEvents />
      <DragonDivider chapter={7} title="The Warriors" char="戰" />
      <Testimonials />
      <InlineCTA
        eyebrow="Inspired?"
        heading={<>They started exactly where <em style={{ color: '#c9a14a', fontStyle: 'italic' }}>you are now.</em></>}
        body="Real students, real results. Come see what six weeks of consistent training can do — book a free trial class this week."
        buttonText="Book Your Free Trial"
        intent="free-trial"
      />
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
          <Route path="/" element={<PublicSite />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
