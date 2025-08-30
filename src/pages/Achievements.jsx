import React, { useEffect } from 'react'
import { useAchievements } from '../contexts/AchievementContext'

export function Achievements() {
  const { achievements, counters, trackPageVisit, resetAchievements } = useAchievements()

  // Track page visit for the explorer achievement
  useEffect(() => {
    trackPageVisit('achievements')
  }, [trackPageVisit])

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Common': return 'border-gray-500 bg-gray-800'
      case 'Rare': return 'border-blue-500 bg-blue-900'
      case 'Epic': return 'border-purple-500 bg-purple-900'
      case 'Legendary': return 'border-yellow-500 bg-yellow-900'
      default: return 'border-gray-500 bg-gray-800'
    }
  }

  const handleResetAchievements = () => {
    if (window.confirm('⚠️ Are you sure you want to reset ALL achievements and progress? This cannot be undone!')) {
      resetAchievements()
      // Optional: Show success message
      alert('🔄 All achievements and progress have been reset!')
    }
  }

  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalCount = achievements.length

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4">
            🏆 Achievement Gallery
          </h1>
          <p className="text-xl text-gray-400 mb-4">
            Your journey through MediSIN's chaos
          </p>
          <div className="text-lg">
            <span className="text-yellow-400 font-bold">{unlockedCount}</span>
            <span className="text-gray-400"> / {totalCount} unlocked</span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-3 mt-4">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            ></div>
          </div>

          {/* Reset Button */}
          <div className="mt-6">
            <button
              onClick={handleResetAchievements}
              className="bg-red-600 hover:bg-red-700 active:bg-red-800 px-6 py-2 rounded-lg text-white font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              🔄 Reset All Achievements
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Useful for testing or starting fresh
            </p>
          </div>
        </div>

        {/* Session Stats */}
        <div className="bg-gray-800 rounded-lg p-4 mb-8">
          <h3 className="text-xl font-bold mb-4">📊 Current Session Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-gray-400">Volume Adjustments</div>
              <div className="text-2xl text-purple-400">{counters?.volumeAdjustments || 0}/25</div>
            </div>
            <div>
              <div className="text-gray-400">Thunder Activations</div>
              <div className="text-2xl text-blue-400">{counters?.thunderActivations || 0}/3</div>
            </div>
            <div>
              <div className="text-gray-400">Panic Clicks</div>
              <div className="text-2xl text-red-400">{counters?.panicClicks || 0}/5</div>
            </div>
            <div>
              <div className="text-gray-400">Chat Opens</div>
              <div className="text-2xl text-green-400">{counters?.chatOpens || 0}/10</div>
            </div>
            <div>
              <div className="text-gray-400">Theme Switches</div>
              <div className="text-2xl text-orange-400">{counters?.themeSwitches || 0}/5</div>
            </div>
            <div>
              <div className="text-gray-400">Pages Visited</div>
              <div className="text-2xl text-cyan-400">{counters?.pagesVisited?.size || 0}/5</div>
            </div>
          </div>
        </div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`
                rounded-lg p-4 border-2 transition-all duration-300 hover:scale-105
                ${achievement.unlocked 
                  ? `${getRarityColor(achievement.rarity)} shadow-lg` 
                  : 'border-gray-700 bg-gray-800 opacity-50'
                }
              `}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`text-4xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                  {achievement.unlocked ? achievement.icon : '🔒'}
                </div>
                
                {/* Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className={`text-lg font-bold ${achievement.unlocked ? 'text-white' : 'text-gray-500'}`}>
                      {achievement.unlocked ? achievement.name : '???'}
                    </h3>
                    <span className={`
                      px-2 py-1 text-xs rounded font-semibold
                      ${achievement.rarity === 'Common' ? 'bg-gray-600' :
                        achievement.rarity === 'Rare' ? 'bg-blue-600' :
                        achievement.rarity === 'Epic' ? 'bg-purple-600' :
                        'bg-yellow-600'
                      }
                    `}>
                      {achievement.rarity}
                    </span>
                  </div>
                  
                  <p className={`text-sm ${achievement.unlocked ? 'text-gray-300' : 'text-gray-600'}`}>
                    {achievement.unlocked ? achievement.description : 'Keep exploring to unlock!'}
                  </p>

                  {/* Progress Bar for Locked Achievements */}
                  {!achievement.unlocked && achievement.progress > 0 && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {achievement.progress}/{achievement.maxProgress}
                      </div>
                    </div>
                  )}
                  
                  {achievement.unlocked && (
                    <div className="mt-2 text-xs text-green-400 font-semibold">
                      ✅ UNLOCKED
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Fun Stats */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold mb-4">🎭 Your MediSIN Journey</h3>
          {unlockedCount === 0 && (
            <p className="text-gray-400">Your adventure begins! Start exploring to unlock achievements.</p>
          )}
          {unlockedCount > 0 && unlockedCount < totalCount / 2 && (
            <p className="text-blue-400">You're getting started! Keep up the chaos.</p>
          )}
          {unlockedCount >= totalCount / 2 && unlockedCount < totalCount && (
            <p className="text-purple-400">You're becoming a MediSIN expert! Almost there!</p>
          )}
          {unlockedCount === totalCount && (
            <div>
              <p className="text-yellow-400 text-xl font-bold">🎉 CONGRATULATIONS! 🎉</p>
              <p className="text-gray-300 mt-2">You are now officially a MediSIN Master!</p>
            </div>
          )}
        </div>

        {/* Debug Section (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-800 rounded-lg">
            <h4 className="text-lg font-bold mb-2">🔧 Debug Info</h4>
            <div className="text-sm text-gray-400 space-y-1">
              <div>Volume Adjustments: {counters?.volumeAdjustments || 0}</div>
              <div>Thunder Activations: {counters?.thunderActivations || 0}</div>
              <div>Panic Clicks: {counters?.panicClicks || 0}</div>
              <div>Chat Opens: {counters?.chatOpens || 0}</div>
              <div>Theme Switches: {counters?.themeSwitches || 0}</div>
              <div>Pages Visited: {Array.from(counters?.pagesVisited || []).join(', ')}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
