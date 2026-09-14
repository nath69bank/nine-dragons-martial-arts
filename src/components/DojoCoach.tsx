import { useState } from 'react'
import { MessageCircleQuestion, Send } from 'lucide-react'
import type { Profile } from '@/types/database'

export interface CoachContext {
  profile: Profile | null
  streak: number
  gradingOverdue: boolean
  lessonsTotal: number
  lessonsCompleted: number
  nutritionCount: number
  postsCount: number
}

const SUGGESTIONS = [
  "What belt am I?",
  "What's my attendance streak?",
  "Am I due a grading?",
  "How many lessons have I done?",
]

function answer(question: string, ctx: CoachContext): string {
  const q = question.toLowerCase()

  if (/grading|overdue|next.*(belt|grade)|when.*grad/.test(q)) {
    return ctx.gradingOverdue
      ? "Looks like you've been on your current belt for a while — you may be ready for your next grading. Speak to Master Martin about it!"
      : "No grading looks due yet based on your current belt's typical timeline — keep training and it'll show up here when it's time."
  }
  if (/belt|rank/.test(q)) {
    return ctx.profile?.belt
      ? `You're currently a ${ctx.profile.belt.name} Belt. Keep it up!`
      : "You don't have a belt assigned yet — ask your instructor to set this up."
  }
  if (/streak|attendance|how many.*(class|session)/.test(q)) {
    return ctx.streak > 0
      ? `You're on a ${ctx.streak}-class streak — nice consistency! Keep showing up to build it further.`
      : "You don't have an active streak yet — get to your next class to start one."
  }
  if (/lesson|study|homework|learn/.test(q)) {
    const remaining = ctx.lessonsTotal - ctx.lessonsCompleted
    return `You've completed ${ctx.lessonsCompleted} of ${ctx.lessonsTotal} available lessons.` +
      (remaining > 0 ? ' Head to the Lessons tab to keep going.' : " You're all caught up!")
  }
  if (/nutrition|eat|diet|food/.test(q)) {
    return `There ${ctx.nutritionCount === 1 ? 'is' : 'are'} ${ctx.nutritionCount} nutrition guide${ctx.nutritionCount === 1 ? '' : 's'} in the Nutrition tab — worth a look before your next session.`
  }
  if (/news|post|update/.test(q)) {
    return `There ${ctx.postsCount === 1 ? 'is' : 'are'} ${ctx.postsCount} recent post${ctx.postsCount === 1 ? '' : 's'} on the News Feed — check it out.`
  }
  return "I can answer questions about your belt, attendance streak, grading readiness, lessons, and nutrition guides — try one of the suggestions below, or ask your instructor directly for anything else."
}

export default function DojoCoach(ctx: CoachContext) {
  const [question, setQuestion] = useState('')
  const [history, setHistory]   = useState<{ q: string; a: string }[]>([])

  function ask(q: string) {
    if (!q.trim()) return
    setHistory(h => [...h, { q, a: answer(q, ctx) }])
    setQuestion('')
  }

  return (
    <section className="mb-10 p-5 rounded-2xl bg-white/5 border border-white/10">
      <div className="flex items-center gap-2 mb-1">
        <MessageCircleQuestion size={16} className="text-gold" />
        <h2 className="text-sm font-semibold text-foreground">Ask the Dojo Coach</h2>
      </div>
      <p className="text-xs text-foreground/40 mb-4">Answers pulled from your real progress — not a general chatbot.</p>

      {history.length > 0 && (
        <div className="space-y-3 mb-4">
          {history.map((h, i) => (
            <div key={i}>
              <p className="text-sm text-foreground/90 font-medium">{h.q}</p>
              <p className="text-sm text-foreground/60 mt-1">{h.a}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        {SUGGESTIONS.map(s => (
          <button key={s} onClick={() => ask(s)} className="text-xs px-3 py-1.5 rounded-full border border-gold/30 text-gold hover:bg-gold/10 transition-colors">
            {s}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') ask(question) }}
          placeholder="Ask about your progress…"
          className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-foreground focus:outline-none focus:border-gold/50"
        />
        <button onClick={() => ask(question)} className="p-2 rounded-full bg-gold text-background flex-shrink-0" aria-label="Ask">
          <Send size={14} />
        </button>
      </div>
    </section>
  )
}
