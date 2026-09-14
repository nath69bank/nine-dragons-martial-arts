import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Lesson, Belt, QuizQuestion } from '@/types/database'
import { Plus, Pencil, Trash2, Eye, EyeOff, HelpCircle } from 'lucide-react'

function QuizEditor({ quiz, onChange }: { quiz: QuizQuestion[]; onChange: (q: QuizQuestion[]) => void }) {
  function addQuestion() {
    onChange([...quiz, { question: '', options: ['', '', '', ''], correct: 0 }])
  }
  function updateQuestion(i: number, patch: Partial<QuizQuestion>) {
    onChange(quiz.map((q, idx) => (idx === i ? { ...q, ...patch } : q)))
  }
  function updateOption(qi: number, oi: number, value: string) {
    updateQuestion(qi, { options: quiz[qi].options.map((o, idx) => (idx === oi ? value : o)) })
  }
  function removeQuestion(i: number) {
    onChange(quiz.filter((_, idx) => idx !== i))
  }

  return (
    <div className="space-y-3">
      {quiz.map((q, qi) => (
        <div key={qi} className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center gap-2">
            <input
              value={q.question}
              onChange={e => updateQuestion(qi, { question: e.target.value })}
              placeholder={`Question ${qi + 1}`}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:border-gold/50"
            />
            <button onClick={() => removeQuestion(qi)} className="p-1.5 rounded text-foreground/40 hover:text-red-400 flex-shrink-0"><Trash2 size={14} /></button>
          </div>
          <div className="space-y-1.5 pl-1">
            {q.options.map((opt, oi) => (
              <label key={oi} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={q.correct === oi} onChange={() => updateQuestion(qi, { correct: oi })} className="accent-gold flex-shrink-0" />
                <input
                  value={opt}
                  onChange={e => updateOption(qi, oi, e.target.value)}
                  placeholder={`Option ${oi + 1}${oi === 0 ? ' (mark the correct one)' : ''}`}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-foreground text-xs focus:outline-none focus:border-gold/50"
                />
              </label>
            ))}
          </div>
        </div>
      ))}
      <button onClick={addQuestion} className="text-xs text-gold hover:underline">+ Add question</button>
    </div>
  )
}

export default function AdminLessons() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [belts, setBelts]     = useState<Belt[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Lesson | null>(null)
  const [isNew, setIsNew]     = useState(false)
  const [saving, setSaving]   = useState(false)

  const blank: Lesson = { id: '', title: '', description: '', content: '', video_url: '', belt_id: null, is_published: false, quiz: null, created_at: '' }

  async function load() {
    const [{ data: l }, { data: b }] = await Promise.all([
      supabase.from('lessons').select('*, belt:belts(*)').order('created_at', { ascending: false }),
      supabase.from('belts').select('*').order('order_index'),
    ])
    setLessons(l ?? [])
    setBelts(b ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function save() {
    if (!editing) return
    setSaving(true)
    const payload = {
      title:       editing.title,
      description: editing.description,
      content:     editing.content,
      video_url:   editing.video_url,
      belt_id:     editing.belt_id,
      is_published:editing.is_published,
      quiz:        editing.quiz && editing.quiz.length > 0 ? editing.quiz : null,
    }
    if (isNew) await supabase.from('lessons').insert(payload)
    else        await supabase.from('lessons').update(payload).eq('id', editing.id)
    setEditing(null)
    setSaving(false)
    load()
  }

  async function togglePublish(lesson: Lesson) {
    await supabase.from('lessons').update({ is_published: !lesson.is_published }).eq('id', lesson.id)
    load()
  }

  async function deleteLesson(id: string) {
    if (!confirm('Delete this lesson?')) return
    await supabase.from('lessons').delete().eq('id', id)
    load()
  }

  if (loading) return <div className="p-10 text-foreground/40">Loading lessons…</div>

  if (editing) return (
    <div className="p-6 lg:p-10 max-w-2xl">
      <button onClick={() => setEditing(null)} className="mb-6 text-sm text-gold hover:underline">← Back</button>
      <h1 className="text-2xl font-bold text-foreground mb-6">{isNew ? 'New Lesson' : 'Edit Lesson'}</h1>
      <div className="space-y-4">
        <input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} placeholder="Title"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-gold/50" />
        <textarea value={editing.description ?? ''} onChange={e => setEditing({ ...editing, description: e.target.value })} placeholder="Short description" rows={2}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-gold/50 resize-none" />
        <input value={editing.video_url ?? ''} onChange={e => setEditing({ ...editing, video_url: e.target.value })} placeholder="Video URL (YouTube embed, Vimeo, etc.)"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-gold/50" />
        <select value={editing.belt_id ?? ''} onChange={e => setEditing({ ...editing, belt_id: e.target.value || null })}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-gold/50">
          <option value="">All belts</option>
          {belts.map(b => <option key={b.id} value={b.id}>{b.name} Belt</option>)}
        </select>
        <textarea value={editing.content ?? ''} onChange={e => setEditing({ ...editing, content: e.target.value })} placeholder="Lesson content / notes…" rows={8}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-gold/50 resize-none" />
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={editing.is_published} onChange={e => setEditing({ ...editing, is_published: e.target.checked })} className="accent-gold" />
          <span className="text-sm text-foreground/70">Published (visible to members)</span>
        </label>

        <div className="pt-2 border-t border-white/10">
          <div className="flex items-center gap-2 mb-3 mt-4">
            <HelpCircle size={15} className="text-gold" />
            <p className="text-sm font-semibold text-foreground">Quiz <span className="text-foreground/40 font-normal">(optional)</span></p>
          </div>
          <QuizEditor quiz={editing.quiz ?? []} onChange={quiz => setEditing({ ...editing, quiz })} />
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={() => setEditing(null)} className="flex-1 py-2 rounded-lg border border-white/10 text-sm text-foreground/60">Cancel</button>
        <button onClick={save} disabled={saving || !editing.title}
          className="flex-1 py-2 rounded-lg bg-gold text-background text-sm font-semibold disabled:opacity-50">
          {saving ? 'Saving…' : 'Save Lesson'}
        </button>
      </div>
    </div>
  )

  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Lessons</h1>
        <button onClick={() => { setEditing(blank); setIsNew(true) }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold text-background text-sm font-semibold hover:bg-gold/90">
          <Plus size={15} /> Add Lesson
        </button>
      </div>

      {lessons.length === 0 && <p className="text-foreground/40">No lessons yet.</p>}

      <div className="space-y-3">
        {lessons.map(lesson => (
          <div key={lesson.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{lesson.title}</p>
              {lesson.description && <p className="text-xs text-foreground/40 truncate">{lesson.description}</p>}
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${lesson.is_published ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-foreground/30'}`}>
              {lesson.is_published ? 'Live' : 'Draft'}
            </span>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => togglePublish(lesson)} title={lesson.is_published ? 'Unpublish' : 'Publish'}
                className="p-1.5 rounded bg-white/5 text-foreground/40 hover:text-gold hover:bg-white/10">
                {lesson.is_published ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button onClick={() => { setEditing(lesson); setIsNew(false) }}
                className="p-1.5 rounded bg-white/5 text-foreground/40 hover:text-gold hover:bg-white/10"><Pencil size={14} /></button>
              <button onClick={() => deleteLesson(lesson.id)}
                className="p-1.5 rounded bg-white/5 text-foreground/40 hover:text-red-400 hover:bg-white/10"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
