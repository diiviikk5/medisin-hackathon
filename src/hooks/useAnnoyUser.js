import { useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { useStore } from '../lib/store'
import roastsData from '../lib/data/roasts.json'

export function useAnnoyUser() {
  const intervalRef = useRef()
  const { incrementDeclines, incrementShame } = useStore()

  // Context-specific roasts (expanded with all new contexts)
  const contextualRoasts = {
    'add-to-cart': [
      "Another fine addition to your collection of regrets.",
      "Cart updated. Dignity not found.", 
      "Purchase pending. Common sense declined.",
      "Item added. Bank account not consulted.",
      "Shopping cart: Where hopes go to die.",
      "Congratulations! You've chosen disappointment."
    ],
    'remove-item': [
      "Item removed. Good decision... finally.",
      "One less mistake in your cart.",
      "Removed successfully. Progress!",
      "Cart decluttered. Wallet slightly relieved.",
      "Smart move. Your bank account approves.",
      "Item deleted. Common sense detected."
    ],
    'clear-cart': [
      "Cart cleared. Sanity partially restored.",
      "All items removed. Your bank account thanks you.",
      "Clean slate. Try to keep it that way.",
      "Cart emptied. Dreams of financial stability return.",
      "Fresh start! Don't mess it up again.",
      "Cart reset. Wisdom finally prevailed."
    ],
    'checkout': [
      "Processing your regret... Please wait.",
      "Charging your card and crushing your hopes.",
      "Payment processing. Disappointment loading...",
      "Transaction in progress. Buyer's remorse incoming.",
      "Your money is being converted to regret.",
      "Checkout initiated. Logic has left the building."
    ],
    'checkout-success': [
      "Order confirmed! Your disappointment will arrive in 3-5 business days.",
      "Payment successful. Life choices questionable.",
      "Checkout complete. Welcome to the regret club.",
      "Order placed! May the odds be never in your favor.",
      "Transaction complete. Your dignity was declined.",
      "Success! You've successfully failed at decision-making."
    ],
    'panic': [
      "Emergency mode activated. Situation: Not actually an emergency.",
      "Panic button pressed. Your biggest problem is still your subscription plan.",
      "Alert level: Red. Threat level: Your poor life choices.",
      "Emergency services notified: None. You're on your own.",
      "SRK has been deployed. Hakla incoming.",
      "Panic mode engaged. Dignity has left the chat.",
      "Red alert! Your problems remain unchanged.",
      "Emergency activated. Still no actual help available."
    ],
    'panic-close': [
      "Emergency resolved. False alarm, as expected.",
      "Panic mode deactivated. Regular disappointment resumed.",
      "Crisis averted. Your real problems remain unchanged.",
      "Emergency over. Back to your regularly scheduled regret.",
      "SRK has left the building. Hakla withdrawal may occur.",
      "Alert cancelled. Reality check still pending.",
      "Emergency mode off. Mediocrity mode restored."
    ],
    'export': [
      "Export complete. Quality not included.",
      "File generated with premium disappointment.",
      "Your export is ready for professional judgment.",
      "Generated successfully. Usefulness sold separately.",
      "Export finished. Expectations not met.",
      "File created. Dignity not included in package."
    ],
    'diagnosis': [
      "Diagnosis confirmed. Prognosis: expensive.",
      "Results ready. Insurance not impressed.",
      "Analysis complete. Reality not covered.",
      "Consultation finished. Hope not included.",
      "Medical opinion delivered. Accuracy not guaranteed.",
      "Diagnosis complete. Your wallet is the real patient."
    ],
    'second-opinion': [
      "Second opinion: First opinion was optimistic.",
      "Alternative diagnosis: Still your problem.",
      "Updated prognosis: Upgrade your subscription.",
      "Revised treatment: Try harder next time.",
      "Second opinion confirmed: You need better insurance.",
      "Alternative view: Problem exists between chair and keyboard."
    ],
    'decline-payment': [
      "Respect the consistency.",
      "Broke but determined. We admire that.",
      "Your wallet matches your symptoms: empty.",
      "Payment declined. So is our sympathy.",
      "Credit card said no. Smart card.",
      "Bank account status: Terminally poor."
    ],
    'print': [
      "Printing... Ink costs more than your diagnosis.",
      "Document ready. Paper wasted successfully.",
      "Print job complete. Trees died for this.",
      "Printed with love and zero medical value."
    ],
    'save': [
      "Saved to nowhere. Brave.",
      "File saved. Location: Digital purgatory.",
      "Saved successfully. Recovery chances: Low.",
      "Data preserved. Hope not included."
    ],
    'open': [
      "File opened. Expectations should remain closed.",
      "Document loaded. Disappointment included.",
      "Opening file... Closing hopes.",
  "File access granted. Sense not found."
],

'thunderous-start': [
  "Thunderous mode activated. Physics incoming.",
  "Alakh Pandey has entered the chat. Prepare for enlightenment.",
  "Lightning strikes! Knowledge level: Maximum.",
  "Thunder mode ON. Your brain is about to expand.",
  "Physics Wallah power activated. Brace yourself.",
  "Thunderous vibes loading. Intelligence boost imminent."
],

'thunderous-end': [
  "Thunderous mode deactivated. Back to normal stupidity.",
  "Lightning has passed. Your brain survived.",
  "Physics session ended. Knowledge downloaded successfully.",
  "Thunder mode OFF. Regular confusion resumed.",
  "Alakh Pandey has left the building. Miss him already?",
  "Thunderous experience complete. Please rate 5 stars."
]
  }

  const triggerRoast = (context = 'general') => {
    const roasts = contextualRoasts[context] || roastsData
    const roast = roasts[Math.floor(Math.random() * roasts.length)]
    toast(roast, {
      icon: '💀',
      duration: 4000,
    })
    incrementShame()
  }

  const triggerPaywall = () => {
    toast.error("Upgrade to Premium to reduce suffering (₹99,999/month)", {
      duration: 6000,
      onClick: () => {
        incrementDeclines()
        triggerRoast('decline-payment')
      }
    })
  }

  // Special panic-specific function
  const triggerPanicRoast = () => {
    triggerRoast('panic')
  }

  useEffect(() => {
    // Start the annoyance cycle after 30 seconds, then every 2 minutes
    const initialTimeout = setTimeout(() => {
      triggerPaywall()
      
      intervalRef.current = setInterval(() => {
        triggerPaywall()
      }, 120000) // 2 minutes
    }, 30000) // Initial 30 second delay

    return () => {
      clearTimeout(initialTimeout)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return {
    triggerRoast,
    triggerPaywall,
    triggerPanicRoast,
  }
}
