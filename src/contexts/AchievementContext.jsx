import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AchievementContext = createContext()

const initialAchievements = [
  {
    id: 'overthinker',
    name: 'Master of Overthinking',
    description: 'Hover over Panic Button for 10 seconds straight',
    icon: '🤔',
    unlocked: false,
    rarity: 'Common',
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'volume_whisperer',
    name: 'Volume Whisperer',
    description: 'Adjust fake volume control 25 times',
    icon: '🎵',
    unlocked: false,
    rarity: 'Rare',
    progress: 0,
    maxProgress: 25
  },
  {
    id: 'thunder_seeker',
    name: 'Thunder Seeker',
    description: 'Activate Thunder Mode 3 times',
    icon: '⚡',
    unlocked: false,
    rarity: 'Epic',
    progress: 0,
    maxProgress: 3
  },
  {
    id: 'panic_master',
    name: 'Panic Master',
    description: 'Trigger panic button 5 times',
    icon: '😱',
    unlocked: false,
    rarity: 'Common',
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'chat_enthusiast',
    name: 'Chat Enthusiast',
    description: 'Open Moe Chat 10 times',
    icon: '💬',
    unlocked: false,
    rarity: 'Rare',
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'theme_switcher',
    name: 'Reality Bender',
    description: 'Switch between SIN and HUB modes 5 times',
    icon: '🌓',
    unlocked: false,
    rarity: 'Epic',
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'cart_collector',
    name: 'Cart Collector',
    description: 'Add 3 items to cart',
    icon: '🛒',
    unlocked: false,
    rarity: 'Common',
    progress: 0,
    maxProgress: 3
  },
  {
    id: 'explorer',
    name: 'Site Explorer',
    description: 'Visit all pages (Home, Catalog, Advice, Cart, Achievements)',
    icon: '🗺️',
    unlocked: false,
    rarity: 'Epic',
    progress: 0,
    maxProgress: 5
  }
]

export function AchievementProvider({ children }) {
  const [achievements, setAchievements] = useState(() => {
    const saved = localStorage.getItem('medisin_achievements')
    return saved ? JSON.parse(saved) : initialAchievements
  })

  const [recentAchievement, setRecentAchievement] = useState(null)
  const [counters, setCounters] = useState(() => {
    const saved = localStorage.getItem('medisin_counters')
    if (saved) {
      const parsed = JSON.parse(saved)
      return {
        ...parsed,
        pagesVisited: new Set(parsed.pagesVisited || [])
      }
    }
    return {
      volumeAdjustments: 0,
      thunderActivations: 0,
      panicClicks: 0,
      chatOpens: 0,
      themeSwitches: 0,
      cartItems: 0,
      pagesVisited: new Set(),
      panicHoverTime: 0
    }
  })

  // Save achievements to localStorage
  useEffect(() => {
    localStorage.setItem('medisin_achievements', JSON.stringify(achievements))
  }, [achievements])

  // Save counters to localStorage
  useEffect(() => {
    const countersToSave = {
      ...counters,
      pagesVisited: Array.from(counters.pagesVisited)
    }
    localStorage.setItem('medisin_counters', JSON.stringify(countersToSave))
  }, [counters])

  const unlockAchievement = useCallback((achievementId) => {
    setAchievements(prev => {
      const updated = prev.map(achievement => {
        if (achievement.id === achievementId && !achievement.unlocked) {
          const unlockedAchievement = { ...achievement, unlocked: true }
          setRecentAchievement(unlockedAchievement)
          
          // Play achievement sound if available
          try {
            new Audio('/achievement-sound.mp3').play().catch(() => {})
          } catch (e) {
            // Ignore audio errors
          }
          
          return unlockedAchievement
        }
        return achievement
      })
      return updated
    })
  }, [])

  const updateProgress = useCallback((achievementId, newProgress) => {
    setAchievements(prev => {
      return prev.map(achievement => {
        if (achievement.id === achievementId && !achievement.unlocked) {
          const updatedProgress = Math.min(newProgress, achievement.maxProgress)
          const updatedAchievement = { ...achievement, progress: updatedProgress }
          
          if (updatedProgress >= achievement.maxProgress) {
            unlockAchievement(achievementId)
          }
          
          return updatedAchievement
        }
        return achievement
      })
    })
  }, [unlockAchievement])

  // Achievement tracking functions
  const trackVolumeAdjustment = useCallback(() => {
    setCounters(prev => {
      const newCount = prev.volumeAdjustments + 1
      updateProgress('volume_whisperer', newCount)
      return { ...prev, volumeAdjustments: newCount }
    })
  }, [updateProgress])

  const trackThunderActivation = useCallback(() => {
    setCounters(prev => {
      const newCount = prev.thunderActivations + 1
      updateProgress('thunder_seeker', newCount)
      return { ...prev, thunderActivations: newCount }
    })
  }, [updateProgress])

  const trackPanicClick = useCallback(() => {
    setCounters(prev => {
      const newCount = prev.panicClicks + 1
      updateProgress('panic_master', newCount)
      return { ...prev, panicClicks: newCount }
    })
  }, [updateProgress])

  const trackChatOpen = useCallback(() => {
    setCounters(prev => {
      const newCount = prev.chatOpens + 1
      updateProgress('chat_enthusiast', newCount)
      return { ...prev, chatOpens: newCount }
    })
  }, [updateProgress])

  const trackThemeSwitch = useCallback(() => {
    setCounters(prev => {
      const newCount = prev.themeSwitches + 1
      updateProgress('theme_switcher', newCount)
      return { ...prev, themeSwitches: newCount }
    })
  }, [updateProgress])

  const trackPageVisit = useCallback((pageName) => {
    setCounters(prev => {
      const newPages = new Set(prev.pagesVisited)
      newPages.add(pageName)
      updateProgress('explorer', newPages.size)
      return { ...prev, pagesVisited: newPages }
    })
  }, [updateProgress])

  const trackCartItem = useCallback((itemCount) => {
    updateProgress('cart_collector', itemCount)
    setCounters(prev => ({ ...prev, cartItems: itemCount }))
  }, [updateProgress])

  const trackPanicHover = useCallback((seconds) => {
    if (seconds >= 10) {
      unlockAchievement('overthinker')
    }
    setCounters(prev => ({ ...prev, panicHoverTime: seconds }))
  }, [unlockAchievement])

  const clearRecentAchievement = useCallback(() => {
    setRecentAchievement(null)
  }, [])

  // Debug function to reset achievements (for testing)
  const resetAchievements = useCallback(() => {
    setAchievements(initialAchievements)
    setCounters({
      volumeAdjustments: 0,
      thunderActivations: 0,
      panicClicks: 0,
      chatOpens: 0,
      themeSwitches: 0,
      cartItems: 0,
      pagesVisited: new Set(),
      panicHoverTime: 0
    })
    localStorage.removeItem('medisin_achievements')
    localStorage.removeItem('medisin_counters')
  }, [])

  return (
    <AchievementContext.Provider value={{
      achievements,
      recentAchievement,
      counters,
      unlockAchievement,
      clearRecentAchievement,
      resetAchievements,
      // Tracking functions
      trackVolumeAdjustment,
      trackThunderActivation,
      trackPanicClick,
      trackChatOpen,
      trackThemeSwitch,
      trackPageVisit,
      trackCartItem,
      trackPanicHover
    }}>
      {children}
    </AchievementContext.Provider>
  )
}

export function useAchievements() {
  const context = useContext(AchievementContext)
  if (!context) {
    throw new Error('useAchievements must be used within AchievementProvider')
  }
  return context
}
