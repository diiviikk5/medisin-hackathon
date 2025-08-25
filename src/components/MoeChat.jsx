import React, { useState } from 'react'
import { X } from 'lucide-react'

/* ---------- Pre-scripted dialogue ---------- */
const doctorLines = [
  "Well hello there, gorgeous.",
  "Need a private consultation?",
  "I promise, my advice is unforgettable.",
  "Tell me your symptoms… slowly.",
  "I make house calls— and heart calls.",
  "Ever tried experimental therapy?",
  "I’m known for unorthodox remedies.",
  "Care for a little bedside banter?",
  "My stethoscope isn’t the only thing that swings.",
  "Relax, I’m a professional… mostly.",
  "Your pulse is racing— must be me.",
  "Side-effects may include butterflies.",
  "Let’s explore your… vital areas of concern.",
  "Do you prefer dim lights or candle-light cures?",
  "I’ve got a premium plan with extra attention.",
  "Some cures require very close monitoring.",
  "Just breathe— preferably on my count.",
  "I could write you a prescription for excitement.",
  "Confidentiality is guaranteed— curiosity isn’t.",
  "How brave are you feeling today?",
  "They call me the master of charming remedies.",
  "Ever mixed business with a little indulgence?",
  "I detect high flirtation levels.",
  "Tell me where it hurts; I’ll start there.",
  "Ready for a deep-tissue diagnosis?",
  "Warning: my humour is slightly contagious.",
  "Clinical rule #1: comfort is chemistry.",
  "I’m licensed—in some countries—to thrill.",
  "Good patients get lollipops; great ones get more.",
  "We could schedule a follow-up… or a follow-through.",
  "Do you believe in love at first dose?",
  "Temperature’s rising—want me to double-check?",
  "I specialise in mysterious aches of the heart.",
  "My clipboard says you need extra care.",
  "Let’s turn up the bedside lamp… and the charm.",
  "This consultation is 100 % hands-free— for now.",
  "Caution: witty banter may cause blushing.",
  "I’m told my remedies “tingle.”",
  "Stay still; butterflies are hard to measure.",
  "Second opinions welcome— they’ll agree I’m unforgettable.",
  "Some say I cure boredom first.",
  "Let’s keep this strictly— unexpectedly— professional.",
  "Your smile is showing positive progress.",
  "I treat stress with strategic compliments.",
  "Ready for prescription-strength charisma?",
  "Professional advice: indulge responsibly.",
  "I never miss a heartbeat— especially yours.",
  "Doctor’s orders: one charming chat every 8 hours.",
  "I have a remedy for restlessness: conversation with me.",
  "Shall we continue your… evaluation?",
  "Careful, flirtation can be habit-forming.",
  "Your sarcasm levels are low— allow me to raise them.",
  "One dose of me should do the trick.",
  "Time for your daily dose of attention."
]

/* ---------- Fixed user replies ---------- */
const userReplies = [
  "Let’s stay professional.",
  "That’s enough flirting.",
  "Tell me actual medical advice.",
  "You’re charming, but focus please.",
  "I’m comfortable— keep talking.",
  "Interesting… go on.",
  "Can we change the topic?",
  "Not sure how to respond.",
  "You’re making me blush.",
  "End conversation."
]

export function MoeChat() {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const [messages, setMessages] = useState([])

  const nextLine = () => {
    const newIndex = (index + 1) % doctorLines.length
    setIndex(newIndex)
    setMessages(m => [...m, { sender: 'doc', text: doctorLines[newIndex] }])
  }

  const handleUserReply = (reply) => {
    setMessages(m => [...m, { sender: 'user', text: reply }])
    if (reply === "End conversation.") {
      setTimeout(() => {
        setOpen(false)
        setMessages([])
        setIndex(0)
      }, 400)
    } else {
      setTimeout(nextLine, 600)
    }
  }

  /* ---------- Launcher button ---------- */
  if (!open) {
    return (
      <button
        onClick={() => { setOpen(true); nextLine() }}
        className="fixed left-6 top-1/2 -translate-y-1/2 z-50
                   bg-orange-500 hover:bg-orange-600 text-black
                   font-semibold px-4 py-2 rounded-r-lg shadow-lg"
      >
        💬 Chat&nbsp;Dr&nbsp;Moe-Lester
      </button>
    )
  }

  /* ---------- Chat window ---------- */
  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 w-80
                    bg-gray-900 text-white border border-orange-500
                    rounded-lg shadow-xl z-50 flex flex-col">
      <div className="flex items-center justify-between px-4 py-2
                      bg-orange-500 text-black font-bold rounded-t-lg">
        Dr&nbsp;Moe-Lester
        <X className="w-5 h-5 cursor-pointer" onClick={() => setOpen(false)} />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
        {messages.map((m, i) => (
          <div key={i}
               className={m.sender === 'doc'
                 ? 'text-orange-400'
                 : 'text-gray-300 text-right'}>
            {m.text}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 p-3 border-t border-gray-700">
        {userReplies.map(r => (
          <button
            key={r}
            onClick={() => handleUserReply(r)}
            className="bg-gray-800 hover:bg-gray-700 text-xs
                       rounded px-2 py-1 truncate"
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  )
}
