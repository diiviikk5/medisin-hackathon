import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import doraemonImage from '../assets/doraemon.png'

export default function EntryGate() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [currentReqIndex, setCurrentReqIndex] = useState(0)
  const [passedReqs, setPassedReqs] = useState([])
  const [attempts, setAttempts] = useState(0)
  const [timeLeft, setTimeLeft] = useState(90)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [showTimeoutModal, setShowTimeoutModal] = useState(false)
  const [inputDirection, setInputDirection] = useState('ltr')
  const [lastGlitchLength, setLastGlitchLength] = useState(0)
  const [aiMockery, setAiMockery] = useState('')
  const [floatingPills, setFloatingPills] = useState([])
  const [showPassword, setShowPassword] = useState(true)
  const [showCaptcha, setShowCaptcha] = useState(false)
  const [captchaAnswer, setCaptchaAnswer] = useState('')
  const [captchaQuestion, setCaptchaQuestion] = useState(null)

  // Get current day backwards
  const getCurrentDayBackwards = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const today = new Date().getDay()
    return days[today].split('').reverse().join('')
  }

  const mockeryMessages = [
    "That password has the creativity of expired medicine...",
    "I've seen more security in a hospital gown with no ties!",
    "Your password is weaker than sugar-free placebo pills!",
    "Are you even trying? This is medically concerning...",
    "That's not a password, that's a prescription for disaster!"
  ]

  // BALANCED PASSWORD REQUIREMENTS (8 total)
  const validatePassword = (pass) => {
    const results = []
    
    results.push({
      id: 1,
      passed: pass.length >= 12,
      text: 'At least 12 characters',
      failMsg: `Need 12+ characters. Currently: ${pass.length}`
    })
    
    const vowels = (pass.match(/[aeiouAEIOU]/g) || []).length
    const consonants = (pass.match(/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/g) || []).length
    results.push({
      id: 2,
      passed: vowels > 0 && vowels === consonants,
      text: 'Perfect vowel-consonant balance',
      failMsg: `Vowels: ${vowels}, Consonants: ${consonants}. Balance them!`
    })
    
    const dayBackwards = getCurrentDayBackwards()
    results.push({
      id: 3,
      passed: pass.toLowerCase().includes(dayBackwards),
      text: `Contains "${dayBackwards}" (today backwards)`,
      failMsg: `Add "${dayBackwards}" somewhere!`
    })
    
    results.push({
      id: 4,
      passed: !pass.toLowerCase().includes('e'),
      text: 'Forbidden letter "e" must not appear',
      failMsg: 'Banish all instances of the cursed letter "e"!'
    })
    
    const numbers = pass.match(/\d/g) || []
    results.push({
      id: 5,
      passed: numbers.length >= 2,
      text: 'Contains at least 2 numbers',
      failMsg: `Found ${numbers.length} numbers. Need at least 2!`
    })
    
    results.push({
      id: 6,
      passed: /[💊🩺💉⚗️🧪🫀🧬💀]/.test(pass),
      text: 'Contains medical emoji',
      failMsg: 'Add medical emoji: 💊🩺💉⚗️🧪🫀🧬💀'
    })
    
    results.push({
      id: 7,
      passed: pass.toLowerCase().includes('chaos') && !pass.toLowerCase().includes('order'),
      text: 'Contains "chaos" but NOT "order"',
      failMsg: 'Add "chaos" but avoid "order" - we embrace anarchy!'
    })
    
    const complexity = pass.length + numbers.length + (pass.match(/[A-Z]/g) || []).length + (pass.match(/[!@#$%^&*()]/g) || []).length
    results.push({
      id: 8,
      passed: complexity >= 18,
      text: 'Passes AI complexity check',
      failMsg: `Complexity score: ${complexity}/18. Add more variety!`
    })
    
    return results
  }

  // Floating pills animation
  useEffect(() => {
    const pills = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      emoji: ['💊', '⚗️', '🧪', '💉', '🩺'][Math.floor(Math.random() * 5)]
    }))
    setFloatingPills(pills)

    const interval = setInterval(() => {
      setFloatingPills(prev => prev.map(pill => ({
        ...pill,
        x: (pill.x + pill.vx + window.innerWidth) % window.innerWidth,
        y: (pill.y + pill.vy + window.innerHeight) % window.innerHeight
      })))
    }, 100)
    return () => clearInterval(interval)
  }, [])

  // Timer effects
  useEffect(() => {
    let timer
    if (isTimerActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    } else if (isTimerActive && timeLeft === 0) {
      setIsTimerActive(false)
      setShowTimeoutModal(true)
    }
    return () => clearTimeout(timer)
  }, [isTimerActive, timeLeft])

  // Start timer
  useEffect(() => {
    if (password.length === 1 && !isTimerActive && timeLeft === 90) {
      setIsTimerActive(true)
      toast.success('⏰ 90 seconds of chaos begins!', { duration: 2000 })
    }
  }, [password.length, isTimerActive, timeLeft])

  // Chaos effects
  useEffect(() => {
    if (password.length > lastGlitchLength + 10 && Math.random() > 0.8) {
      setLastGlitchLength(password.length)
      setTimeout(() => {
        setPassword(prev => prev.slice(0, -2) + '??')
        setTimeout(() => {
          setPassword(prev => prev.slice(0, -2))
          toast('🤖 Digital interference!', { icon: '⚡', duration: 1000 })
        }, 800)
      }, 400)
    }
  }, [password.length])

  // Direction chaos
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.88 && password.length > 8) {
        setInputDirection(prev => prev === 'ltr' ? 'rtl' : 'ltr')
        toast('🔄 Direction chaos!', { icon: '🌪️', duration: 1000 })
      }
    }, 20000)
    return () => clearInterval(interval)
  }, [password.length])

  // Live validation
  useEffect(() => {
    if (password.length === 0) {
      setPassedReqs([])
      setCurrentReqIndex(0)
      return
    }

    const validationResults = validatePassword(password)
    const currentlyPassed = validationResults.filter(r => r.passed).map(r => r.id)
    
    setPassedReqs(currentlyPassed)
    
    const firstUnpassed = validationResults.find(r => !r.passed)
    if (firstUnpassed) {
      const newIndex = validationResults.findIndex(r => r.id === firstUnpassed.id)
      setCurrentReqIndex(newIndex)
    } else {
      setCurrentReqIndex(validationResults.length)
    }

    // AI mockery
    if (password.length > 8 && currentlyPassed.length < 3 && Math.random() > 0.88) {
      const mockMessage = mockeryMessages[Math.floor(Math.random() * mockeryMessages.length)]
      setAiMockery(mockMessage)
      setTimeout(() => setAiMockery(''), 3000)
    }
  }, [password])

  const handleLogin = () => {
    if (!username.trim()) {
      toast.error('🎭 Enter your chaos agent name!')
      return
    }

    const validationResults = validatePassword(password)
    const allPassed = validationResults.every(r => r.passed)

    if (!allPassed) {
      setAttempts(prev => prev + 1)
      toast.error('Complete ALL 8 challenges first!')
      return
    }

    // TRIGGER CAPTCHA AFTER BUTTON PRESS
    const captchaQuestions = [
      { q: "What's 2+2?", a: "4" },
      { q: "Complete: Laughter is the best ___", a: "medicine" },
      { q: "What organ pumps blood?", a: "heart" },
      { q: "H2O is also known as?", a: "water" },
      { q: "What's the opposite of sick?", a: "healthy" }
    ]
    
    const randomQuestion = captchaQuestions[Math.floor(Math.random() * captchaQuestions.length)]
    setCaptchaQuestion(randomQuestion)
    setShowCaptcha(true)
    setIsTimerActive(false)
    toast.success('🤖 Final CAPTCHA challenge!')
  }

  const emergencyBypass = () => {
    localStorage.setItem('medisinUser', JSON.stringify({
      username: username || 'Chaos Survivor',
      loginTime: Date.now(),
      isLoggedIn: true,
      bypassed: true
    }))
    toast.success('🆘 Emergency bypass!')
    navigate('/')
  }

  const validationResults = validatePassword(password)
  const allPassed = validationResults.every(r => r.passed)

  // FIXED CAPTCHA
  const MedicalCaptcha = () => (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-cyan-500 p-8 rounded-2xl max-w-md w-full text-center">
        <h3 className="text-3xl font-bold text-cyan-400 mb-4">🤖 FINAL CAPTCHA</h3>
        <p className="text-gray-300 mb-6">One last challenge to prove you're human</p>
        
        <div className="bg-gray-900 p-4 rounded-lg mb-6 border border-cyan-500">
          <p className="text-white text-lg">{captchaQuestion?.q}</p>
        </div>
        
        <input
          type="text"
          value={captchaAnswer}
          onChange={(e) => setCaptchaAnswer(e.target.value)}
          placeholder="Type your answer..."
          className="w-full p-3 bg-gray-700 border border-cyan-500 rounded-lg text-white mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          autoFocus
        />
        
        <div className="flex gap-3">
          <button
            onClick={() => {
              const answer = captchaAnswer.toLowerCase().trim()
              const correctAnswer = captchaQuestion?.a.toLowerCase().trim()
              
              if (answer === correctAnswer || answer.includes(correctAnswer)) {
                // SUCCESS - LOGIN
                localStorage.setItem('medisinUser', JSON.stringify({
                  username: username.trim(),
                  loginTime: Date.now(),
                  isLoggedIn: true,
                  chaosLevel: 'ULTIMATE',
                  attempts: attempts + 1,
                  survivedAll: true
                }))
                toast.success(`🚀 LEGENDARY! Welcome ${username}!`)
                navigate('/')
              } else {
                toast.error('❌ Wrong answer! Try again...')
                setCaptchaAnswer('')
              }
            }}
            className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-bold"
          >
            Submit Answer
          </button>
          
          <button
            onClick={() => {
              setShowCaptcha(false)
              setCaptchaAnswer('')
              setIsTimerActive(true)
            }}
            className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-bold"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  )

  // Timeout Modal
  const TimeoutModal = () => (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-red-500 p-8 rounded-2xl max-w-md w-full text-center">
        <div className="text-6xl mb-4">⏰</div>
        <h3 className="text-3xl font-bold text-red-400 mb-4">TIME'S UP!</h3>
        <p className="text-gray-300 mb-6">90 seconds expired!</p>
        <div className="flex gap-4">
          <button
            onClick={() => {
              setShowTimeoutModal(false)
              setTimeLeft(90)
              setPassword('')
              setPassedReqs([])
              setCurrentReqIndex(0)
              toast('🔄 Timer reset!')
            }}
            className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold"
          >
            Restart
          </button>
          <button
            onClick={emergencyBypass}
            className="flex-1 py-3 bg-yellow-600 hover:bg-yellow-700 text-black rounded-lg font-bold"
          >
            Bypass
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      
      {/* Background Pills */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingPills.map(pill => (
          <div
            key={pill.id}
            className="absolute text-2xl opacity-10 animate-pulse"
            style={{
              left: `${pill.x}px`,
              top: `${pill.y}px`,
              transition: 'all 0.1s linear'
            }}
          >
            {pill.emoji}
          </div>
        ))}
      </div>

      {/* Modals */}
      {showTimeoutModal && <TimeoutModal />}
      {showCaptcha && <MedicalCaptcha />}

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen">
        
        {/* Left Panel WITH DORAEMON IMAGE */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 bg-gradient-to-br from-purple-900/60 to-indigo-900/60 backdrop-blur-sm">
          <div className="max-w-md text-center space-y-8">
            
            <div className="relative">
              <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 animate-pulse">
                MediSIN
              </h1>
              <div className="absolute -top-6 -right-6 text-3xl animate-spin">⚗️</div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-white">CHAOS GAUNTLET</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                8 ridiculous challenges + final CAPTCHA. Survive the chaos and prove your worthiness.
              </p>
            </div>

            {/* DORAEMON IMAGE - POSITIONED PERFECTLY */}
            <div className="flex justify-center mb-8">
              <img 
                src={doraemonImage} 
                alt="Wreckathon Challenge Meme" 
                className="max-h-80 w-auto rounded-xl shadow-2xl border-4 border-purple-500/50 hover:scale-105 transition-transform duration-300 select-none pointer-events-none"
                style={{
                  filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.4))',
                }}
              />
            </div>

            {isTimerActive && (
              <div className="text-center">
                <div className="text-6xl font-bold text-red-400 animate-pulse mb-2">
                  ⏰ {timeLeft}s
                </div>
                <div className="text-gray-300">Chaos countdown</div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-red-900/30 rounded-lg p-3 border border-red-500">
                <div className="text-red-400 font-bold">Attempts</div>
                <div className="text-2xl text-white">{attempts}</div>
              </div>
              <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-500">
                <div className="text-purple-400 font-bold">Progress</div>
                <div className="text-2xl text-white">{passedReqs.length}/8</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">

            <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-3xl shadow-2xl p-8">
              
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-red-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <span className="text-3xl">💀</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Chaos Registration</h2>
                <p className="text-gray-400 text-sm">8 challenges + final CAPTCHA</p>
              </div>

              {/* Username */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">🎭 Agent Name</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-4 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-lg"
                  placeholder="Enter your chaos alias..."
                />
              </div>

              {/* Password */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3 flex justify-between">
                  <span>🔥 Chaotic Password</span>
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs text-purple-400 hover:text-purple-300"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ direction: inputDirection }}
                  className={`w-full px-4 py-4 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-lg ${
                    inputDirection === 'rtl' ? 'text-right' : ''
                  }`}
                  placeholder="Create your chaotic password..."
                />
              </div>

              {/* AI Mockery */}
              {aiMockery && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-red-400">🤖</span>
                    <span className="text-red-300 text-sm italic">{aiMockery}</span>
                  </div>
                </div>
              )}

              {/* Requirements */}
              <div className="mb-6 max-h-64 overflow-y-auto">
                <h3 className="text-sm font-medium text-gray-300 mb-3">Requirements (8):</h3>
                <div className="space-y-2">
                  {validationResults.map((req, index) => {
                    const isPassed = req.passed
                    const isCurrent = index === currentReqIndex && !isPassed

                    return (
                      <div key={req.id} className={`flex items-center gap-3 p-2 rounded-lg transition-all text-xs ${
                        isPassed ? 'bg-green-900/20 border border-green-500/30' :
                        isCurrent ? 'bg-purple-900/30 border border-purple-500/30' : 'bg-gray-800/30'
                      }`}>
                        <div className="flex-shrink-0">
                          {isPassed ? (
                            <span className="text-green-400 text-lg">✅</span>
                          ) : isCurrent ? (
                            <span className="text-yellow-400 text-lg animate-pulse">⚡</span>
                          ) : (
                            <span className="text-gray-600 text-lg">💀</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <span className={`${
                            isPassed ? 'text-green-400' : 
                            isCurrent ? 'text-purple-300' : 'text-gray-500'
                          }`}>
                            {req.text}
                          </span>
                          {isCurrent && password && !isPassed && (
                            <div className="text-red-400 mt-1 font-semibold text-xs">
                              {req.failMsg}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleLogin}
                disabled={!allPassed || !username.trim()}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
                  allPassed && username.trim()
                    ? 'bg-gradient-to-r from-red-600 via-purple-600 to-pink-600 hover:from-red-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-lg transform hover:-translate-y-1 animate-pulse'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                {allPassed && username.trim() ? '🔥 FINAL CHALLENGE' : `${validationResults.filter(r => !r.passed).length} remain...`}
              </button>

              {/* Progress Bar */}
              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
                  <span>Progress</span>
                  <span>{passedReqs.length}/{validationResults.length}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-700"
                    style={{ width: `${(passedReqs.length / validationResults.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Emergency Bypass */}
              {attempts >= 4 && (
                <button
                  onClick={emergencyBypass}
                  className="w-full mt-4 py-3 px-4 bg-yellow-600 hover:bg-yellow-700 text-black rounded-xl font-bold animate-bounce"
                >
                  🆘 SURRENDER ({attempts} attempts)
                </button>
              )}

              <div className="text-center mt-6 text-xs text-gray-500">
                "Chaos is coming... are you ready?"
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
