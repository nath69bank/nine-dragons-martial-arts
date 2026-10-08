// ─────────────────────────────────────────────────────────
// BLOG POSTS — edit directly, no backend required.
// Add a new entry to go live immediately; order doesn't matter,
// the blog list sorts by publishedAt automatically.
// coverImage is optional — point it at a file in public/blog/
// (e.g. '/blog/my-post.jpg') or leave undefined.
// ─────────────────────────────────────────────────────────

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage?: string
  publishedAt: string // ISO date, e.g. '2026-09-14'
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'martial-arts-builds-confidence-in-kids',
    title: '5 Ways Martial Arts Builds Confidence in Kids',
    excerpt: "From Dragon Cubs to Dragon Warriors, here's how structured martial arts training helps children build real, lasting confidence — on and off the mat.",
    publishedAt: '2026-09-14',
    content: `Every parent wants their child to feel confident — but confidence built on real skill lasts a lot longer than confidence built on praise alone. Here's what we see, week after week, at Nine Dragons.

1. Small, visible wins. Belt progression breaks a huge goal into small, achievable steps. A child who couldn't hold a stance in September can nail it by Christmas — and they know exactly how they got there.

2. Learning to fail safely. Sparring and grading both involve the possibility of not getting it right first time, in a supportive environment where that's completely normal. That builds resilience faster than almost anything else.

3. A sense of belonging. Dragon Cubs, Dragon Sparks, Dragon Ninjas, Dragon Warriors — every age group trains together as a team, cheering each other on during gradings and sparring rounds.

4. Respect goes both ways. Traditional martial arts etiquette (bowing in, addressing instructors properly, looking after your training partner) teaches children that respect is something you give as well as receive.

5. Physical competence breeds mental confidence. Simply put: a child who knows they can throw a proper front kick, hold their stance, and handle themselves walks a little taller — at school, and everywhere else.

If your child hasn't tried a class yet, your first session is free — come along on a Monday or Thursday at St Annes Church Hall and see for yourself.`,
  },
]
