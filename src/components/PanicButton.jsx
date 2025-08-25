import React, { useState, useEffect, useRef } from 'react'
import { useAnnoyUser } from '../hooks/useAnnoyUser'
import panicImage from '../assets/image.png'

export function PanicButton() {
  const [panicked, setPanicked] = useState(false)
  const { triggerRoast } = useAnnoyUser()
  const audioRef = useRef(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (panicked) {
      // Only trigger roast once when panicked becomes true
      triggerRoast('panic')
      
      // Play audio safely
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(() => {
          // Ignore autoplay errors
        })
      }
      
      // Set timeout to end panic mode
      timeoutRef.current = setTimeout(() => {
        setPanicked(false)
        triggerRoast('panic-close')
        
        // Stop audio
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current.currentTime = 0
        }
      }, 10000) // 10 seconds
    }
    
    // Cleanup function
    return () => {
      clearTimeout(timeoutRef.current)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [panicked]) // Remove triggerRoast from dependencies

  const closePanic = () => {
    setPanicked(false)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  return (
    <>
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        style={{ display: 'none' }}
      >
        <source src="/shah-rukh-khan.mp3" type="audio/mpeg" />
        <source src="/emergency-sound.wav" type="audio/wav" />
        Your browser does not support the audio element.
      </audio>

      {/* Panic Button */}
      {!panicked && (
        <button
          className="fixed bottom-6 right-6 z-50 rounded-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white w-16 h-16 shadow-lg flex items-center justify-center font-bold transition-colors text-sm"
          onClick={() => setPanicked(true)}
          aria-label="Activate Emergency Panic Mode"
        >
          PANIC
        </button>
      )}

      {/* Panic Overlay */}
      {panicked && (
        <div
          className="fixed inset-0 bg-red-900 bg-opacity-95 flex flex-col items-center justify-center z-50"
          onClick={closePanic}
          role="dialog"
          aria-modal="true"
        >
          <img
            src={panicImage}
            alt="SRK HAKLA EMERGENCY"
            className="max-w-md max-h-80 rounded-lg drop-shadow-2xl animate-pulse"
          />

          <div className="text-center mt-8 space-y-4">
            <h2 className="text-4xl font-bold text-white animate-bounce">
              🚨 MEDICAL EMERGENCY! 🚨
            </h2>
            <p className="text-xl text-red-200">
              Emergency sound activated!
            </p>
            <p className="text-lg text-red-300">
              SRK's emergency sound is playing!
            </p>
          </div>

          <button
            className="absolute top-6 right-6 bg-black text-red-500 font-bold text-xl w-12 h-12 rounded-full border-2 border-red-500 hover:bg-red-600 hover:text-white transition-colors"
            onClick={closePanic}
            aria-label="Close Emergency Mode"
          >
            ×
          </button>

          <div className="absolute bottom-8 text-center text-red-200 text-sm">
            <p>Click anywhere to close | Auto-closes in 10 seconds</p>
          </div>
        </div>
      )}
    </>
  )
}
