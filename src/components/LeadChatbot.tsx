import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle, Send, ChevronRight, LogIn } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

// ── Config ───────────────────────────────────────────────────────────────────
const WA_NUMBER = '447803828300'

type Intent = 'enquiry' | 'free-trial'

function buildWhatsAppMessage(lead: Lead, intent: Intent): string {
  const header = intent === 'free-trial'
    ? '🥋 *FREE TRIAL REQUEST — Nine Dragons*'
    : '💬 *New Enquiry — Nine Dragons*'

  return [
    header,
    '',
    `👤 *Name:* ${lead.name}`,
    `📞 *Contact:* ${lead.contact}`,
    `🎯 *Interested in:* ${lead.discipline}`,
    `💪 *Goal:* ${lead.goal}`,
    intent === 'free-trial' && lead.timing ? `📅 *Best time to attend:* ${lead.timing}` : '',
    lead.extra ? `📝 *Notes:* ${lead.extra}` : '',
  ].filter(Boolean).join('\n')
}

function sendToWhatsApp(lead: Lead, intent: Intent) {
  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage(lead, intent))}`
  window.open(url, '_blank', 'noopener')
}

// ── Types ────────────────────────────────────────────────────────────────────
interface Lead {
  name: string
  contact: string
  discipline: string
  goal: string
  timing: string
  extra: string
}

type StepId = 'welcome' | 'name' | 'contact' | 'discipline' | 'goal' | 'timing' | 'extra' | 'done'

interface Message {
  id: number
  from: 'bot' | 'user'
  text: string
}

// ── Quick-reply option lists ─────────────────────────────────────────────────
const DISCIPLINES = [
  'Kickboxing',
  'Karate / Kata',
  'MMA / BJJ',
  'Dragon Cubs (kids)',
  'General Fitness',
  'Competition Training',
  'Not sure yet',
]

const GOALS = [
  'Get fit & lose weight',
  'Learn self-defence',
  'Build confidence',
  'Compete & win',
  'My child joining',
  'Just want to try it',
]

const TIMINGS = [
  'Monday evening',
  'Thursday evening',
  'Weekend',
  'Flexible — any time',
]

const BLANK_LEAD: Lead = { name: '', contact: '', discipline: '', goal: '', timing: '', extra: '' }

let msgId = 1

// ── Component ────────────────────────────────────────────────────────────────
export default function LeadChatbot() {
  const [open, setOpen]         = useState(false)
  const [intent, setIntent]     = useState<Intent>('enquiry')
  const [step, setStep]         = useState<StepId>('welcome')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput]       = useState('')
  const [lead, setLead]         = useState<Lead>(BLANK_LEAD)
  const [typing, setTyping]     = useState(false)
  const [pulse, setPulse]       = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)

  // Build the opening message based on intent
  function openingMessage(i: Intent): string {
    return i === 'free-trial'
      ? "Hey! 🥋 Let's get you booked in for your free class. I just need a few quick details — it'll take under a minute. Ready?"
      : "Hey! 👋 I'm the Nine Dragons assistant. Got a question or want to join? Let me grab a few details and get you sorted. Ready?"
  }

  // Open and (re)initialise with the right intent
  function openWith(i: Intent) {
    msgId = 1
    setIntent(i)
    setStep('welcome')
    setLead(BLANK_LEAD)
    setInput('')
    setMessages([{ id: msgId++, from: 'bot', text: openingMessage(i) }])
    setOpen(true)
  }

  // Pulse animation on the bubble
  useEffect(() => {
    const t = setInterval(() => setPulse(p => !p), 4000)
    return () => clearInterval(t)
  }, [])

  // Listen for events from navbar / hero / login page
  useEffect(() => {
    function handler(e: Event) {
      const detail = (e as CustomEvent).detail as { intent?: string } | undefined
      openWith(detail?.intent === 'free-trial' ? 'free-trial' : 'enquiry')
    }
    window.addEventListener('open-chatbot', handler)
    return () => window.removeEventListener('open-chatbot', handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300)
  }, [open, step])

  function addMessage(from: 'bot' | 'user', text: string) {
    setMessages(prev => [...prev, { id: msgId++, from, text }])
  }

  function botSay(text: string, delay = 700) {
    setTyping(true)
    setTimeout(() => { setTyping(false); addMessage('bot', text) }, delay)
  }

  // ── Step handlers ──────────────────────────────────────────────────────────
  function handleWelcome() {
    addMessage('user', "Let's go!")
    botSay("Great! First up — what's your name?")
    setStep('name')
  }

  function handleName(raw: string) {
    const name = raw.trim()
    if (!name) return
    setLead(l => ({ ...l, name }))
    addMessage('user', name)
    botSay(`Nice to meet you, ${name}! 😊 What's the best number or email to reach you on?`)
    setStep('contact')
    setInput('')
  }

  function handleContact(raw: string) {
    const contact = raw.trim()
    if (!contact) return
    setLead(l => ({ ...l, contact }))
    addMessage('user', contact)
    botSay('Perfect. Which class are you most interested in?', 600)
    setStep('discipline')
    setInput('')
  }

  function handleDiscipline(discipline: string) {
    setLead(l => ({ ...l, discipline }))
    addMessage('user', discipline)
    botSay("Good choice! What's your main goal — what do you want to get out of it?", 600)
    setStep('goal')
  }

  function handleGoal(goal: string) {
    setLead(l => ({ ...l, goal }))
    addMessage('user', goal)
    if (intent === 'free-trial') {
      botSay('When would suit you best for your first class?', 600)
      setStep('timing')
    } else {
      botSay('Almost done! Anything else we should know? (age, injuries, schedule…) Or just skip.', 700)
      setStep('extra')
    }
  }

  function handleTiming(timing: string) {
    setLead(l => ({ ...l, timing }))
    addMessage('user', timing)
    botSay('Last one — anything else we should know? (age, injuries, questions…) Or just skip.', 700)
    setStep('extra')
  }

  function handleExtra(raw: string) {
    const extra = raw.trim()
    setLead(l => ({ ...l, extra }))
    addMessage('user', extra || 'Nothing else')
    const closing = intent === 'free-trial'
      ? "You're all set! 🎉 Tap below to send your details to the team — they'll confirm your free class on WhatsApp within a few hours."
      : "That's everything! 🎉 Tap below to send your details to the team on WhatsApp — they'll get back to you within 24 hours."
    botSay(closing, 800)
    setStep('done')
    setInput('')
  }

  function handleSend() {
    if (step === 'name')    handleName(input)
    if (step === 'contact') handleContact(input)
    if (step === 'extra')   handleExtra(input)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const showInput = step === 'name' || step === 'contact' || step === 'extra'
  const showSkip  = step === 'extra'

  return (
    <>
      {/* ── Toggle bubble ── */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-2">
        <AnimatePresence>
          {!open && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="mb-1 px-3 py-1.5 rounded-full text-xs font-semibold text-background bg-gold shadow-lg whitespace-nowrap"
            >
              Chat with us 💬
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => open ? setOpen(false) : openWith('enquiry')}
          aria-label={open ? 'Close chat' : 'Open chat'}
          animate={{ scale: pulse && !open ? [1, 1.08, 1] : 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-14 h-14 rounded-full bg-gold shadow-xl shadow-gold/30 flex items-center justify-center text-background hover:bg-gold/90 transition-colors"
        >
          <AnimatePresence mode="wait">
            {open
              ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X size={22} /></motion.span>
              : <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><MessageCircle size={22} /></motion.span>
            }
          </AnimatePresence>
          {!open && <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-background" />}
        </motion.button>
      </div>

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed bottom-24 left-6 z-50 w-[340px] max-w-[calc(100vw-24px)] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ background: 'hsl(220,65%,5%)', border: '1px solid rgba(255,255,255,0.1)', maxHeight: '540px' }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 flex-shrink-0"
              style={{ background: 'hsl(220,65%,7%)' }}
            >
              <img src="/logo.jpeg" alt="" className="w-8 h-8 rounded-full object-cover border border-gold/40" />
              <div>
                <p className="text-sm font-semibold text-foreground">Nine Dragons</p>
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  {intent === 'free-trial' ? 'Book your free class' : 'Online now'}
                </p>
              </div>
              <button onClick={() => setOpen(false)} className="ml-auto p-1.5 rounded-lg text-foreground/40 hover:text-foreground hover:bg-white/5 transition-colors">
                <X size={15} />
              </button>
            </div>

            {/* Intent badge */}
            {intent === 'free-trial' && (
              <div className="px-4 py-2 flex-shrink-0" style={{ background: 'rgba(201,161,74,0.06)' }}>
                <span className="text-[10px] font-bold tracking-widest uppercase text-gold/70">🥋 Free Trial Booking</span>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn('flex', msg.from === 'user' ? 'justify-end' : 'justify-start')}
                >
                  <div
                    className={cn(
                      'max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed',
                      msg.from === 'bot'
                        ? 'bg-white/8 text-foreground rounded-tl-sm'
                        : 'text-background rounded-tr-sm'
                    )}
                    style={msg.from === 'user' ? { background: '#c9a14a' } : undefined}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              <AnimatePresence>
                {typing && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="flex justify-start">
                    <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/8 flex gap-1.5 items-center">
                      {[0, 1, 2].map(i => (
                        <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-foreground/40"
                          animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Quick reply chips by step ── */}
              {!typing && step === 'welcome' && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
                  <button onClick={handleWelcome}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-background hover:opacity-90 transition-opacity"
                    style={{ background: '#c9a14a' }}>
                    Let's go! <ChevronRight size={14} />
                  </button>
                </motion.div>
              )}

              {!typing && step === 'discipline' && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2 justify-end">
                  {DISCIPLINES.map(d => (
                    <button key={d} onClick={() => handleDiscipline(d)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium border border-gold/40 text-gold hover:bg-gold/10 transition-colors">
                      {d}
                    </button>
                  ))}
                </motion.div>
              )}

              {!typing && step === 'goal' && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2 justify-end">
                  {GOALS.map(g => (
                    <button key={g} onClick={() => handleGoal(g)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium border border-gold/40 text-gold hover:bg-gold/10 transition-colors">
                      {g}
                    </button>
                  ))}
                </motion.div>
              )}

              {!typing && step === 'timing' && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2 justify-end">
                  {TIMINGS.map(t => (
                    <button key={t} onClick={() => handleTiming(t)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium border border-gold/40 text-gold hover:bg-gold/10 transition-colors">
                      {t}
                    </button>
                  ))}
                </motion.div>
              )}

              {!typing && step === 'done' && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
                  <button
                    onClick={() => sendToWhatsApp(lead, intent)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold text-white shadow-lg transition-all hover:opacity-90 hover:scale-105"
                    style={{ background: '#25D366' }}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    {intent === 'free-trial' ? 'Confirm my free class' : 'Send to WhatsApp'}
                  </button>
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Already a member shortcut */}
            {step !== 'done' && (
              <div className="px-4 pb-1.5 flex justify-center flex-shrink-0">
                <Link to="/login" onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-1.5 text-xs text-foreground/25 hover:text-gold/60 transition-colors">
                  <LogIn size={11} /> Already a member? Sign in
                </Link>
              </div>
            )}

            {/* Text input */}
            <AnimatePresence>
              {showInput && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="flex items-center gap-2 px-3 py-3 border-t border-white/10 flex-shrink-0"
                  style={{ background: 'hsl(220,65%,7%)' }}
                >
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      step === 'name'    ? 'Your name…' :
                      step === 'contact' ? 'Phone or email…' :
                                           'Anything else… (optional)'
                    }
                    className="flex-1 bg-white/5 rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-1 focus:ring-gold/40"
                  />
                  {showSkip && (
                    <button onClick={() => handleExtra('')}
                      className="text-xs text-foreground/40 hover:text-foreground/70 transition-colors whitespace-nowrap px-1">
                      Skip
                    </button>
                  )}
                  <button onClick={handleSend} disabled={!input.trim() && !showSkip}
                    className="w-9 h-9 rounded-xl bg-gold flex items-center justify-center text-background disabled:opacity-30 hover:bg-gold/90 transition-colors flex-shrink-0">
                    <Send size={15} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
