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

export default function App() {
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
