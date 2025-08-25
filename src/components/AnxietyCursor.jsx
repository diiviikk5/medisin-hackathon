import React, { useState, useEffect, useRef } from 'react'

export function AnxietyCursor() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [thoughtVisible, setThoughtVisible] = useState(false)
  const [currentThought, setCurrentThought] = useState('')
  const [currentTarget, setCurrentTarget] = useState(null)
  const [currentClicks, setCurrentClicks] = useState(0)
  const [requiredClicks, setRequiredClicks] = useState(0)
  const buttonMemory = useRef(new Map()) // Track clicks and required clicks per button
  const thoughtTimeout = useRef(null)

  // 3-stage resistance messages based on progress
  const resistanceStages = [
    // Early stage (0-30% progress)
    [
      "I don't wanna click that 😟",
      "That button gives me bad vibes...",
      "Can we maybe... not do this?",
      "I'm having second thoughts about this",
      "This feels like a bad idea",
      "Something about this seems off...",
      "Nope, not feeling it today"
    ],
    // Middle stage (30-70% progress)
    [
      "Are you sure? I don't feel good about this 😰",
      "Please reconsider! This is sketchy!",
      "My anxiety is through the roof!",
      "I really don't think we should...",
      "This is triggering my trust issues!",
      "Can we please think about this more?",
      "I'm getting really uncomfortable here"
    ],
    // Final stage (70-100% progress)
    [
      "God help me... I guess we're doing this 😭",
      "Against my better judgment... sigh",
      "I'm gonna regret this, aren't I?",
      "You're really persistent, aren't you?",
      "Fine! But I'm not happy about it!",
      "Ugh... you're wearing me down...",
      "Almost there... just a few more..."
    ],
    // Victory stage (100% - allow click)
    [
      "FINE! You win! I give up! 🏳️",
      "Okay okay! You can click it! Jeez!",
      "You're more stubborn than I am!",
      "Alright, I surrender! Click away!",
      "You've broken my spirit... go ahead"
    ]
  ]

  // Generate unique button identifier
  const getButtonId = (element) => {
    const text = element.textContent?.trim() || ''
    const href = element.href || ''
    const className = element.className || ''
    const tagName = element.tagName || ''
    return `${tagName}-${className}-${text}-${href}`.substring(0, 100)
  }

  // Get current stage based on progress
  const getCurrentStage = (clicks, required) => {
    if (clicks >= required) return 3 // Victory
    const progress = clicks / required
    if (progress < 0.3) return 0 // Early
    if (progress < 0.7) return 1 // Middle
    return 2 // Final
  }

  // Track mouse position globally
  useEffect(() => {
    if (!isEnabled) return

    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY })
    }

    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [isEnabled])

  // Check for button hover
  useEffect(() => {
    if (!isEnabled) return

    const checkHover = () => {
      const clickables = document.querySelectorAll(
        'button:not([data-anxiety-toggle]), .btn-primary, .btn-secondary, a[href], input[type="submit"], [role="button"], .feature-card, .testimonial'
      )
      
      let hoveredButton = null

      clickables.forEach(element => {
        const rect = element.getBoundingClientRect()
        
        if (cursorPos.x >= rect.left && cursorPos.x <= rect.right &&
            cursorPos.y >= rect.top && cursorPos.y <= rect.bottom) {
          hoveredButton = element
        }
      })

      if (hoveredButton && hoveredButton !== currentTarget) {
        // New button encountered
        const buttonId = getButtonId(hoveredButton)
        let buttonData = buttonMemory.current.get(buttonId)
        
        if (!buttonData) {
          // First time encountering this button - assign random clicks needed
          buttonData = {
            clicks: 0,
            required: Math.floor(Math.random() * 6) + 5 // Random 5-10 clicks
          }
          buttonMemory.current.set(buttonId, buttonData)
        }
        
        setCurrentTarget(hoveredButton)
        setCurrentClicks(buttonData.clicks)
        setRequiredClicks(buttonData.required)
        
        const stage = getCurrentStage(buttonData.clicks, buttonData.required)
        showResistanceMessage(hoveredButton, stage, buttonData.clicks, buttonData.required)
        
      } else if (!hoveredButton && currentTarget) {
        // Left button area
        setCurrentTarget(null)
        hideThought()
      }
    }

    const interval = setInterval(checkHover, 50)
    return () => clearInterval(interval)
  }, [cursorPos, isEnabled, currentTarget])

  // Handle click attempts - progress clicks
  useEffect(() => {
    if (!isEnabled) return

    const handleClick = (e) => {
      if (!currentTarget) return

      const target = e.target.closest('button, .btn-primary, .btn-secondary, a[href], input[type="submit"], [role="button"], .feature-card, .testimonial')
      
      if (target === currentTarget) {
        const buttonId = getButtonId(target)
        let buttonData = buttonMemory.current.get(buttonId)
        
        if (!buttonData) return

        if (buttonData.clicks < buttonData.required) {
          // Block the click and increment counter
          e.preventDefault()
          e.stopPropagation()
          e.stopImmediatePropagation()
          
          // Increment clicks with a small delay to prevent simultaneous progression
          setTimeout(() => {
            buttonData.clicks += 1
            buttonMemory.current.set(buttonId, buttonData)
            setCurrentClicks(buttonData.clicks)
            
            const stage = getCurrentStage(buttonData.clicks, buttonData.required)
            showResistanceMessage(target, stage, buttonData.clicks, buttonData.required)
          }, 100)
          
          return false
        } else {
          // Allow click - user has completed all required clicks
          hideThought()
          
          // Reset this button after 15 seconds
          setTimeout(() => {
            buttonMemory.current.set(buttonId, { clicks: 0, required: Math.floor(Math.random() * 6) + 5 })
          }, 15000)
          
          setCurrentTarget(null)
        }
      }
    }

    document.addEventListener('click', handleClick, { capture: true, passive: false })
    document.addEventListener('mousedown', handleClick, { capture: true, passive: false })
    
    return () => {
      document.removeEventListener('click', handleClick, { capture: true })  
      document.removeEventListener('mousedown', handleClick, { capture: true })
    }
  }, [isEnabled, currentTarget])

  const showResistanceMessage = (button, stage, clicks, required) => {
    const stageMessages = resistanceStages[stage]
    const randomMessage = stageMessages[Math.floor(Math.random() * stageMessages.length)]
    
    setCurrentThought(randomMessage)
    setThoughtVisible(true)

    if (thoughtTimeout.current) {
      clearTimeout(thoughtTimeout.current)
    }

    // Show message longer for victory stage
    const hideDelay = stage === 3 ? 4000 : 2500
    thoughtTimeout.current = setTimeout(() => {
      hideThought()
    }, hideDelay)
  }

  const hideThought = () => {
    setThoughtVisible(false)
    if (thoughtTimeout.current) {
      clearTimeout(thoughtTimeout.current)
    }
  }

  useEffect(() => {
    return () => {
      if (thoughtTimeout.current) {
        clearTimeout(thoughtTimeout.current)
      }
    }
  }, [])

  const getButtonStats = () => {
    const totalButtons = buttonMemory.current.size
    const activeButtons = Array.from(buttonMemory.current.values()).filter(data => data.clicks > 0).length
    return { totalButtons, activeButtons }
  }

  const resetAllButtons = () => {
    buttonMemory.current.clear()
    hideThought()
    setCurrentTarget(null)
  }

  if (!isEnabled) {
    return (
      <button
        data-anxiety-toggle="true"
        onClick={() => setIsEnabled(true)}
        style={{
          position: 'fixed',
          top: '160px',
          left: '20px',
          zIndex: 10000,
          background: 'linear-gradient(45deg, #8b5cf6, #7c3aed)',
          color: 'white',
          border: 'none',
          padding: '12px 18px',
          borderRadius: '25px',
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)',
          transition: 'all 0.2s ease'
        }}
      >
        🖱️ Enable Anxiety Mode
      </button>
    )
  }

  const stats = getButtonStats()
  const currentStage = getCurrentStage(currentClicks, requiredClicks)
  const progressPercentage = requiredClicks > 0 ? Math.round((currentClicks / requiredClicks) * 100) : 0

  return (
    <>
      <div style={{
        position: 'fixed',
        top: '160px',
        left: '20px',
        zIndex: 10000,
        background: 'rgba(15, 23, 42, 0.95)',
        padding: '12px',
        borderRadius: '15px',
        border: '2px solid #ef4444',
        backdropFilter: 'blur(10px)'
      }}>
        <button
          data-anxiety-toggle="true"
          onClick={() => {
            setIsEnabled(false)
            resetAllButtons()
          }}
          style={{
            background: 'linear-gradient(45deg, #ef4444, #dc2626)',
            color: 'white',
            border: 'none',
            padding: '8px 14px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginBottom: '8px',
            width: '100%'
          }}
        >
          😰 Anxiety Mode: ON
        </button>
        
        <div style={{
          color: '#bfdbfe',
          fontSize: '10px',
          textAlign: 'center',
          marginBottom: '6px'
        }}>
          Progress: {currentClicks}/{requiredClicks} ({progressPercentage}%)
        </div>
        
        <div style={{
          color: '#bfdbfe',
          fontSize: '9px',
          textAlign: 'center',
          marginBottom: '6px'
        }}>
          Buttons: {stats.totalButtons} | Active: {stats.activeButtons}
        </div>
        
        <button
          data-anxiety-toggle="true"
          onClick={resetAllButtons}
          style={{
            background: 'rgba(139, 92, 246, 0.8)',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '15px',
            fontSize: '10px',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          🔄 Reset All Buttons
        </button>
      </div>

      <style>{`
        body {
          cursor: ${thoughtVisible && currentStage < 3 ? 'not-allowed' : 'default'} !important;
        }
        
        button:hover, .btn-primary:hover, .btn-secondary:hover, a[href]:hover, .feature-card:hover {
          cursor: ${currentStage < 3 ? 'not-allowed' : 'pointer'} !important;
        }

        @keyframes thoughtShake {
          0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
          25% { transform: translate(-50%, -50%) rotate(-0.5deg); }
          75% { transform: translate(-50%, -50%) rotate(0.5deg); }
        }
        
        @keyframes thoughtPop {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
      `}</style>

      {thoughtVisible && (
        <div style={{
          position: 'fixed',
          left: cursorPos.x + 60,
          top: cursorPos.y - 80,
          background: currentStage === 0 ? '#fef3c7' : 
                      currentStage === 1 ? '#fed7c7' : 
                      currentStage === 2 ? '#fde2e7' : '#d1fae5',
          color: '#1f2937',
          padding: '16px 20px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: '600',
          boxShadow: '0 12px 35px rgba(0,0,0,0.2)',
          border: `3px solid ${currentStage === 0 ? '#f59e0b' : 
                               currentStage === 1 ? '#ef4444' : 
                               currentStage === 2 ? '#be185d' : '#22c55e'}`,
          pointerEvents: 'none',
          zIndex: 10001,
          maxWidth: '250px',
          textAlign: 'center',
          animation: `thoughtPop 0.3s ease-out${currentStage === 1 || currentStage === 2 ? ', thoughtShake 0.5s infinite 0.3s' : ''}`,
          transform: 'translate(-50%, -50%)'
        }}>
          {currentThought}
          
          <div style={{
            position: 'absolute',
            top: '-10px',
            right: '15px',
            background: currentStage === 0 ? '#f59e0b' : 
                        currentStage === 1 ? '#ef4444' : 
                        currentStage === 2 ? '#be185d' : '#22c55e',
            color: 'white',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 'bold',
            border: '2px solid white'
          }}>
            {currentClicks}/{requiredClicks}
          </div>
          
          <div style={{
            position: 'absolute',
            bottom: '-15px',
            left: '50px',
            width: '0',
            height: '0',
            borderLeft: '12px solid transparent',
            borderRight: '12px solid transparent',
            borderTop: `15px solid ${currentStage === 0 ? '#fef3c7' : 
                                     currentStage === 1 ? '#fed7c7' : 
                                     currentStage === 2 ? '#fde2e7' : '#d1fae5'}`
          }} />
        </div>
      )}

      {thoughtVisible && currentStage < 3 && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.9)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '25px',
          fontSize: '13px',
          zIndex: 10000,
          pointerEvents: 'none',
          textAlign: 'center'
        }}>
          💡 Click {requiredClicks - currentClicks} more times! ({progressPercentage}% complete)
        </div>
      )}
    </>
  )
}
