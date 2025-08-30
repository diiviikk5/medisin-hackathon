import React, { useEffect } from 'react'
import { useAchievements } from '../contexts/AchievementContext'

export function AchievementNotification() {
  const { recentAchievement, clearRecentAchievement } = useAchievements()

  useEffect(() => {
    if (recentAchievement) {
      const timer = setTimeout(() => {
        clearRecentAchievement()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [recentAchievement, clearRecentAchievement])

  if (!recentAchievement) return null

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Common': return 'from-gray-400 to-gray-600'
      case 'Rare': return 'from-blue-400 to-blue-600'
      case 'Epic': return 'from-purple-400 to-purple-600'
      case 'Legendary': return 'from-yellow-400 to-yellow-600'
      default: return 'from-gray-400 to-gray-600'
    }
  }

  return (
    <div className="fixed top-20 right-6 z-50 animate-bounce">
      <div className={`
        bg-gradient-to-r ${getRarityColor(recentAchievement.rarity)}
        text-white p-4 rounded-lg shadow-2xl border-2 border-white
        transform transition-all duration-500 scale-110
      `}>
        {/* Achievement Badge */}
        <div className="flex items-center gap-3">
          <div className="text-3xl animate-spin-slow">
            {recentAchievement.icon}
          </div>
          <div>
            <div className="text-lg font-bold">🏆 ACHIEVEMENT UNLOCKED!</div>
            <div className="text-xl font-black text-yellow-100">
              {recentAchievement.name}
            </div>
            <div className="text-sm text-gray-200 mt-1">
              {recentAchievement.description}
            </div>
            <div className="text-xs text-yellow-200 mt-1 font-semibold">
              Rarity: {recentAchievement.rarity}
            </div>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={clearRecentAchievement}
          className="absolute top-1 right-2 text-white hover:text-red-300 text-lg font-bold"
        >
          ×
        </button>

        {/* Sparkle effects */}
        <div className="absolute -top-1 -left-1 text-yellow-300 animate-ping">✨</div>
        <div className="absolute -bottom-1 -right-1 text-yellow-300 animate-ping delay-500">✨</div>
      </div>

      {/* CSS for slow spin */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  )
}
