import { useRef, useLayoutEffect } from 'react'
import { gsap, reveal } from '@/lib/scrollReveal'
import { Quote, Star, ExternalLink } from 'lucide-react'

const FACEBOOK_URL = 'https://www.facebook.com/share/19k6oy8pZn/?mibextid=wwXIfr'

const ENDORSEMENT = {
  quote:
    "Master Martin brings genuine skill, heart, and integrity to every class. The standard at Nine Dragons reflects everything this art stands for — I'm proud to endorse him and this school.",
  author: 'Master Steve Sharkey',
  role: '5th Dan — Formal Endorsement',
  initials: 'SS',
}

const REVIEWS = [
  {
    quote:
      "This is a fantastic martial arts club for both adult and kids' training. The instructor is knowledgeable, patient and kind and the other students are friendly and welcoming. I love training in this club because it has a supportive family feel and lacks ego and intimidation. There are classes to suit all ages and levels. Training is fun, energising and empowering. Whether you're looking for self defence, fitness or self improvement, this is the club",
    author: 'Helen Lore',
    date: '27 Oct 2025',
    initials: 'HL',
  },
  {
    quote:
      "Outstanding club and community to be a part off. When my stepson joined 11 months ago his confidence and self-esteem where rock bottom due to reasons beyond his control, fast forward to today and he is now onto his 4th belt and his confidence has sky rocketed. I can't thank Master Danny and everyone else at 9 dragons for giving him the time and helping to shape him into the young man he is becoming. Thank you ⭐⭐⭐⭐⭐",
    author: 'Jennifer Davies',
    date: '8 Oct 2025',
    initials: 'JD',
  },
  {
    quote:
      "My boys love this class. It's the only club after school they enjoy and give full commitment to. They have developed confidence, discipline and physical strength and coordination. It's very professional but also welcoming and has a community feel and great Christmas parties 🎉😄 the owner Dan is very experienced yet great with the children, keeping them engaged and making it fun learning.",
    author: 'Kayleigh Mitchell',
    date: '6 Oct 2025',
    initials: 'KM',
  },
  {
    quote:
      'My son has been training in kickboxing with Nine Dragons, and it has been an outstanding experience from the very beginning. He first came to the gym as a shy young kid, and through the guidance, encouragement, and support of the instructors, he has grown into a confident and capable black belt. The team at Nine Dragons provides exceptional training for all levels in a welcoming and inclusive environment…',
    author: 'Paul Gore',
    date: '6 Oct 2025',
    initials: 'PG',
    truncated: true,
  },
  {
    quote:
      "Nine Dragons is not just a martial club it's a martial art family ❤️ seen by my own eyes at the competitions I've witnessed..skilled determined resilient respectful and just simply the best ❤️ Filtered through Master Martin who the children look up too ❤️",
    author: "Michelle O'callaghan",
    date: '5 Oct 2025',
    initials: 'MO',
  },
  {
    quote:
      "I would highly recommend this club my son has been going here for a year and half now and he started with very low self confidence and suffers bad with mental health problems since being in this club he had come on amazing with his self confidence and his mental health has got better. It's amazing club, the instructor is amazing, he's brilliant with the kids and parents, all the kids are brilliant too, it's like one big family.",
    author: 'Kim Jacqueline',
    date: '4 Oct 2025',
    initials: 'KJ',
  },
  {
    quote:
      "Fabulous atmosphere in classes. The instructor Dan has the perfect blend of fun and respect in all aspects of his teaching. Could not recommend higher! 🐉",
    author: 'Becky Mac',
    date: '4 Oct 2025',
    initials: 'BM',
  },
  {
    quote:
      "This is a fantastic kick boxing club! I can't fault how kind and welcoming all the students are towards each other. They are taught amazingly by their teacher who is incredible with all the kids, I would definitely recommend this club.",
    author: "Molly O'callaghan",
    date: '4 Oct 2025',
    initials: 'MO',
  },
  {
    quote:
      "Nine Dragons martial arts for me is not only a way to keep fit, it's a way to keep pushing my limits. My fitness, confidence and mental health have never been better and being a bit older this is something many struggle with. I am so proud to be part of the Nine Dragons Family. Thank you Everyone and especially Master Martin without whom all this would not be possible. Respect 🥋",
    author: 'Graham Turner',
    date: '4 Oct 2025',
    initials: 'GT',
  },
  {
    quote:
      "Brilliant club, best thing for any teenager to get involved with! My son has gained so much confidence, his fitness is always improving and I know he's spending time each week with a great group of people 🥋",
    author: 'Sallie Taylor',
    date: '4 Oct 2025',
    initials: 'ST',
  },
  {
    quote:
      'Brilliant club. Great people and a great atmosphere. I have trained here myself and now my Kids train here, they absolutely love it. Their confidence has grown massively since being part of the club. The instructor Danny is fantastic, he is great with the kids with his positive and uplifting attitude to teaching. They never want to miss a class.',
    author: 'Shelley Oldham',
    date: '3 Oct 2025',
    initials: 'SO',
  },
  {
    quote:
      'Amazing club! Friendly, compassionate and lovely atmosphere. Danny is amazing with the kids. My lad has come on leaps and bounds since joining the club and I can not be more grateful. ❤️',
    author: 'Stacey Crowther',
    date: '2 Oct 2025',
    initials: 'SC',
  },
  {
    quote:
      'Great club, lots of fun whilst training with a friendly group of people. Would recommend to anyone wishing to get fit, learn a Martial art as well as valuable self defence.',
    author: 'Thomas Arwel Ellis',
    date: '5 May 2024',
    initials: 'TE',
  },
]

function Stars() {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={12} fill="#c9a14a" stroke="none" />
      ))}
    </div>
  )
}

export default function Testimonials() {
  const sectionRef   = useRef<HTMLDivElement>(null)
  const eyebrowRef    = useRef<HTMLDivElement>(null)
  const titleRef      = useRef<HTMLHeadingElement>(null)
  const badgeRef       = useRef<HTMLAnchorElement>(null)
  const endorsementRef = useRef<HTMLDivElement>(null)
  const stripRef       = useRef<HTMLDivElement>(null)
  const photoRowRef    = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      reveal(eyebrowRef.current, { from: { x: -24 } })
      reveal(titleRef.current, { from: { x: -24 }, delay: 0.06 })
      reveal(badgeRef.current, { from: { x: -24 }, delay: 0.1 })
      reveal(endorsementRef.current, { from: { y: 28 }, duration: 0.65, delay: 0.1 })
      if (stripRef.current) {
        reveal(stripRef.current.children, {
          from: { y: 30, scale: 0.97 }, duration: 0.5, stagger: 0.07, trigger: stripRef.current,
        })
      }
      reveal(photoRowRef.current, { from: { y: 24 }, duration: 0.6, delay: 0.1, trigger: photoRowRef.current })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="testimonials" ref={sectionRef} className="relative py-14 md:py-32 border-t border-border/30">
      <div className="max-w-7xl mx-auto px-5 md:px-20">
        <div ref={eyebrowRef} className="mb-4">
          <span className="eyebrow">07 ─── Testimonials · The Warriors</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10 md:mb-12">
          <h2 ref={titleRef} className="section-h2 mb-0">
            What They <em>Say</em>
          </h2>

          <a
            ref={badgeRef}
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 liquid-glass rounded-full pl-2 pr-4 py-2 shrink-0 w-fit group"
          >
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
              style={{ background: 'linear-gradient(135deg, #1877F2 0%, #0d5bc4 100%)', color: '#fff' }}
            >
              f
            </span>
            <span className="flex flex-col leading-tight">
              <span className="flex items-center gap-1 text-foreground text-xs font-semibold">
                <Stars /> 100% Recommend
              </span>
              <span className="text-[10px] text-muted-foreground">13 reviews on Facebook</span>
            </span>
            <ExternalLink size={12} className="text-muted-foreground group-hover:text-primary transition-colors ml-1" />
          </a>
        </div>

        {/* Featured formal endorsement */}
        <div
          ref={endorsementRef}
          className="gold-card rounded-2xl p-8 flex flex-col gap-5 relative overflow-hidden mb-8 md:mb-10"
        >
          <div className="absolute inset-0 dragon-scales opacity-20" />
          <span className="absolute top-4 right-4 text-[9px] tracking-[0.25em] uppercase bg-primary/15 text-primary border border-primary/25 rounded-full px-3 py-1">
            Endorsed
          </span>
          <Quote size={22} className="text-primary/50 relative z-10 shrink-0" />
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed relative z-10 max-w-2xl">
            "{ENDORSEMENT.quote}"
          </p>
          <div className="flex items-center gap-3 relative z-10 pt-4 border-t border-border/30">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-primary shrink-0"
              style={{ background: 'linear-gradient(135deg, hsl(222,60%,8%) 0%, hsl(223,50%,14%) 100%)', border: '1px solid rgba(201,161,74,0.3)' }}
            >
              {ENDORSEMENT.initials}
            </div>
            <div>
              <p className="text-foreground text-sm font-semibold">{ENDORSEMENT.author}</p>
              <p className="text-muted-foreground text-xs">{ENDORSEMENT.role}</p>
            </div>
          </div>
        </div>

        {/* Real Facebook reviews — horizontal scroll strip */}
        <div
          ref={stripRef}
          className="no-scrollbar flex gap-5 overflow-x-auto pb-2 -mx-5 px-5 md:mx-0 md:px-0"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {REVIEWS.map(r => (
            <div
              key={r.author}
              className="gold-card rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden shrink-0"
              style={{ width: 300, scrollSnapAlign: 'start' }}
            >
              <div className="absolute inset-0 dragon-scales opacity-15" />
              <div className="flex items-center justify-between relative z-10">
                <Stars />
                <span className="text-[10px] text-muted-foreground">{r.date}</span>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed relative z-10 line-clamp-6">
                "{r.quote}"
              </p>
              {r.truncated && (
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-primary hover:underline relative z-10 -mt-2"
                >
                  Read full review on Facebook →
                </a>
              )}
              <div className="flex items-center gap-2.5 relative z-10 pt-3 border-t border-border/30 mt-auto">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-primary shrink-0"
                  style={{ background: 'linear-gradient(135deg, hsl(222,60%,8%) 0%, hsl(223,50%,14%) 100%)', border: '1px solid rgba(201,161,74,0.3)' }}
                >
                  {r.initials}
                </div>
                <p className="text-foreground text-xs font-semibold">{r.author}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Candid photo + Facebook CTA */}
        <div ref={photoRowRef} className="mt-8 md:mt-10 rounded-2xl overflow-hidden relative">
          <img
            src="/testimonials/fb-review-photo.jpg"
            alt="Nine Dragons students and Master Martin at St Annes Church Hall"
            loading="lazy"
            className="w-full h-48 md:h-64 object-cover"
          />
          <div
            className="absolute inset-0 flex items-center justify-between px-6 md:px-10"
            style={{ background: 'linear-gradient(90deg, rgba(1,5,14,0.9) 0%, rgba(1,5,14,0.4) 55%, rgba(1,5,14,0.15) 100%)' }}
          >
            <div>
              <p className="text-white font-semibold text-sm md:text-base">See what families are saying</p>
              <p className="text-white/50 text-xs mt-0.5">Real reviews, straight from our Facebook page</p>
            </div>
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-[0.15em] uppercase transition-opacity hover:opacity-90 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #c9a14a 0%, #e0c060 50%, #c9a14a 100%)',
                color: '#0a1020',
              }}
            >
              All Reviews <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
