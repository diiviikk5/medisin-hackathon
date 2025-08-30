import { useAchievements } from '../contexts/AchievementContext'
import { useEffect, useRef } from 'react'

// Hook for tracking button clicks
export function useButtonClickTracking() {
  const { updateSessionData, sessionData } = useAchievements()
  
  const trackClick = () => {
    updateSessionData('buttonClicks', sessionData.buttonClicks + 1)
  }
  
  return trackClick
}

// Hook for tracking volume adjustments
export function useVolumeTracking() {
  const { updateSessionData, sessionData } = useAchievements()
  
  const trackVolumeAdjustment = () => {
    updateSessionData('volumeAdjustments', sessionData.volumeAdjustments + 1)
  }
  
  return trackVolumeAdjustment
}

// Hook for tracking hover time (for panic button)
export function useHoverTracking(achievementId = 'overthinker') {
  const { updateSessionData } = useAchievements()
  const hoverTimeRef = useRef(0)
  const intervalRef = useRef(null)
  
  const startTracking = () => {
    if (intervalRef.current) return
    
    intervalRef.current = setInterval(() => {
      hoverTimeRef.current += 0.1
      if (hoverTimeRef.current >= 10) {
        updateSessionData('panicHoverTime', 10)
        stopTracking()
      }
    }, 100)
  }
  
  const stopTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
      hoverTimeRef.current = 0
    }
  }
  
  useEffect(() => {
    return stopTracking // Cleanup on unmount
  }, [])
  
  return { startTracking, stopTracking }
}
