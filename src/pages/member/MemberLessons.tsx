import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import type { Lesson, LessonProgress } from '@/types/database'
import { BookOpen, Play, CheckCircle2, Circle } from 'lucide-react'

function Quiz({ lesson, onFinished }: { lesson: Lesson; onFinished: (score: number, total: number) => void }) {
  const questions = lesson.quiz!
  const [answers, setAnswers] = useState<(number | null)[]>(questions.map(() => null))
  const [submitted, setSubmitted] = useState(false)

  const allAnswered = answers.every(a => a !== null)
  const score = answers.filter((a, i) => a === questions[i].correct).length

  function submit() {
    setSubmitted(true)
    onFinished(score, questions.length)
  }

  return (
    <div className="mt-8 p-5 rounded-2xl bg-white/5 border border-white/10">
      <h3 className="text-sm font-semibold text-foreground mb-4">Quick check — {questions.length} question{questions.length > 1 ? 's' : ''}</h3>
      <div className="space-y-5">
        {questions.map((q, qi) => (
          <div key={qi}>
            <p className="text-sm text-foreground/90 mb-2">{qi + 1}. {q.question}</p>
            <div className="space-y-1.5">
              {q.options.map((opt, oi) => {
                const isSelected = answers[qi] === oi
                const isCorrect  = submitted && oi === q.correct
                const isWrong    = submitted && isSelected && oi !== q.correct
                return (
                  <button
                    key={oi}
                    disabled={submitted}
                    onClick={() => setAnswers(a => a.map((v, i) => (i === qi ? oi : v)))}
                    className={`w-full text-left px-3.5 py-2 rounded-lg text-sm border transition-colors
                      ${isCorrect ? 'border-green-400/50 bg-green-500/10 text-green-300' :
                        isWrong   ? 'border-red-400/50 bg-red-500/10 text-red-300' :
                        isSelected ? 'border-gold/50 bg-gold/10 text-gold' :
                        'border-white/10 bg-white/5 text-foreground/70 hover:border-white/20'}`}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {!submitted ? (
        <button onClick={submit} disabled={!allAnswered}
          className="mt-5 px-5 py-2 rounded-lg bg-gold text-background text-sm font-semibold disabled:opacity-40">
          Submit answers
        </button>
      ) : (
        <p className="mt-5 text-sm font-semibold text-foreground">
          You scored {score}/{questions.length} {score === questions.length ? '🎉' : ''}
        </p>
      )}
    </div>
  )
}

export default function MemberLessons() {
  const { profile } = useAuth()
  const [lessons, setLessons]   = useState<Lesson[]>([])
  const [progress, setProgress] = useState<Record<string, LessonProgress>>({})
  const [loading, setLoading]   = useState(true)
  const [selected, setSelected] = useState<Lesson | null>(null)

  async function load() {
    const [{ data: l }, { data: p }] = await Promise.all([
      supabase.from('lessons').select('*, belt:belts(*)').eq('is_published', true).order('created_at', { ascending: false }),
      profile ? supabase.from('lesson_progress').select('*').eq('profile_id', profile.id) : Promise.resolve({ data: [] as LessonProgress[] }),
    ])
    setLessons(l ?? [])
    setProgress(Object.fromEntries((p ?? []).map(row => [row.lesson_id, row])))
    setLoading(false)
  }

  useEffect(() => { load() }, [profile])

  async function markComplete(lesson: Lesson, score?: number, total?: number) {
    if (!profile) return
    await supabase.from('lesson_progress').upsert({
      profile_id: profile.id,
      lesson_id: lesson.id,
      quiz_score: score ?? null,
      quiz_total: total ?? null,
    }, { onConflict: 'profile_id,lesson_id' })
    load()
  }

  if (loading) return <div className="p-10 text-foreground/40">Loading lessons…</div>

  const completedCount = lessons.filter(l => progress[l.id]).length

  return (
    <div className="p-6 lg:p-10 max-w-5xl">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-foreground">Lessons</h1>
        {lessons.length > 0 && <span className="text-sm text-foreground/40">{completedCount}/{lessons.length} completed</span>}
      </div>
      <p className="text-foreground/40 text-sm mb-6">Mark each lesson complete as you go — some have a quick quiz to check what stuck.</p>

      {lessons.length === 0 && (
        <p className="text-foreground/40">No lessons published yet — check back soon.</p>
      )}

      {selected ? (
        <div>
          <button onClick={() => setSelected(null)} className="mb-6 text-sm text-gold hover:underline">← Back to lessons</button>
          <h2 className="text-xl font-bold text-foreground mb-2">{selected.title}</h2>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            {selected.belt && (
              <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full bg-white/10 text-foreground/60">
                <span className="w-2 h-2 rounded-full" style={{ background: selected.belt.color_hex }} />
                {selected.belt.name} Belt
              </span>
            )}
            {progress[selected.id] && (
              <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400">
                <CheckCircle2 size={12} /> Completed
                {progress[selected.id].quiz_total ? ` — ${progress[selected.id].quiz_score}/${progress[selected.id].quiz_total}` : ''}
              </span>
            )}
          </div>
          {selected.video_url && (
            <div className="aspect-video mb-6 rounded-xl overflow-hidden bg-black">
              <iframe src={selected.video_url} className="w-full h-full" allowFullScreen title={selected.title} />
            </div>
          )}
          {selected.content && (
            <div className="prose prose-invert max-w-none text-foreground/80 whitespace-pre-wrap leading-relaxed">
              {selected.content}
            </div>
          )}

          {selected.quiz && selected.quiz.length > 0 ? (
            !progress[selected.id] ? (
              <Quiz lesson={selected} onFinished={(score, total) => markComplete(selected, score, total)} />
            ) : (
              <p className="mt-8 text-sm text-foreground/40">You've already completed this quiz.</p>
            )
          ) : (
            <button
              onClick={() => markComplete(selected)}
              disabled={!!progress[selected.id]}
              className="mt-8 flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gold text-background text-sm font-semibold disabled:opacity-40 disabled:cursor-default"
            >
              <CheckCircle2 size={15} /> {progress[selected.id] ? 'Completed' : 'Mark as complete'}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {lessons.map(lesson => {
            const done = !!progress[lesson.id]
            return (
              <button
                key={lesson.id}
                onClick={() => setSelected(lesson)}
                className="text-left p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-gold/30 transition-colors group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-lg bg-gold/10 text-gold flex-shrink-0">
                    {lesson.video_url ? <Play size={18} /> : <BookOpen size={18} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-foreground group-hover:text-gold transition-colors">{lesson.title}</p>
                      {done ? <CheckCircle2 size={16} className="text-green-400 flex-shrink-0 mt-0.5" /> : <Circle size={16} className="text-foreground/15 flex-shrink-0 mt-0.5" />}
                    </div>
                    {lesson.description && <p className="text-sm text-foreground/50 mt-1 line-clamp-2">{lesson.description}</p>}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {lesson.belt && (
                        <span className="inline-flex items-center gap-1 text-xs text-foreground/40">
                          <span className="w-2 h-2 rounded-full" style={{ background: lesson.belt.color_hex }} />
                          {lesson.belt.name} Belt
                        </span>
                      )}
                      {lesson.quiz && lesson.quiz.length > 0 && (
                        <span className="text-xs text-gold/70">• Quiz</span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
