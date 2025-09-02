import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Pill, Trophy, ArrowLeft } from 'lucide-react'
import { useStore } from '../lib/store'
import { useAchievements } from '../contexts/AchievementContext'

export function Navbar() {
  const navigate = useNavigate()
  const cart = useStore((state) => state.cart)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  
  // Get achievements for badge count
  const { achievements } = useAchievements()
  const unlockedCount = achievements?.filter(a => a.unlocked).length || 0
  
  // Theme detection for dynamic title
  const [isPHMode, setIsPHMode] = useState(false)
  
  useEffect(() => {
    const checkTheme = () => {
      setIsPHMode(document.body.classList.contains('ph-theme'))
    }
    
    checkTheme()
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['class'] 
    })
    
    return () => observer.disconnect()
  }, [])

  return (
    <nav className="glass-nav">
      <div className="container">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="p-2 bg-gradient-to-r from-primary-500 to-blue-500 rounded-xl group-hover:scale-110 transition-transform">
              <Pill className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="flex items-center">
                <span className="text-3xl font-black text-white">Medi</span>
                <span className="text-3xl font-black accent-text">
                  {isPHMode ? 'HUB' : 'SIN?'}
                </span>
              </div>
              <div className="text-sm text-slate-400 -mt-1 font-medium">
                The problem to all your solutions
              </div>
            </div>
          </Link>
          
          <div className="flex items-center space-x-6">
            {/* BACK TO ENTRY GATE BUTTON */}
            <button
              onClick={() => navigate('/entry')}
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg transition-all transform hover:scale-105 border border-white/20"
              title="Return to Entry Gate"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden md:inline">Entry Gate</span>
              <span className="md:hidden">🚪</span>
            </button>
            
            <Link 
              to="/catalog" 
              className="text-slate-300 hover:text-white transition-colors font-medium text-lg hover:scale-105 transform duration-200"
            >
              Buy "Medicine"
            </Link>
            
            {/* NEW SYMPTOM CHECKER LINK */}
            <Link 
              to="/symptom-checker" 
              className="text-slate-300 hover:text-white transition-colors font-medium text-lg hover:scale-105 transform duration-200"
            >
              🩺 Symptom Checker
            </Link>
            
            {/* NEW MEDCOOKER LINK */}
            <Link 
              to="/medcooker" 
              className="text-slate-300 hover:text-white transition-colors font-medium text-lg hover:scale-105 transform duration-200"
            >
              ⚗️ MedCooker
            </Link>
            
            <Link 
              to="/advice" 
              className="text-slate-300 hover:text-white transition-colors font-medium text-lg hover:scale-105 transform duration-200"
            >
              Get Bad Advice
            </Link>
            
            {/* ACHIEVEMENTS LINK */}
            <Link 
              to="/achievements" 
              className="relative p-3 text-slate-300 hover:text-white transition-colors hover:bg-slate-700/50 rounded-xl group"
              title="View your achievements"
            >
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 group-hover:text-yellow-400 transition-colors" />
                <span className="hidden md:inline font-medium">Achievements</span>
              </div>
              {unlockedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                  {unlockedCount}
                </span>
              )}
            </Link>
            
            <Link 
              to="/cart"
              className="relative p-3 text-slate-300 hover:text-white transition-colors hover:bg-slate-700/50 rounded-xl"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-bounce-slow">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
