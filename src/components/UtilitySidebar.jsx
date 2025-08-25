import React, { useState } from 'react'
import {
  Menu,
  X,
  MousePointer,
  Volume2,
  ShieldAlert,
  MessageCircle
} from 'lucide-react'

import { AnxietyCursor } from './AnxietyCursor'
import { FakeVolumeControl } from './FakeVolumeControl'
import { PanicButton } from './PanicButton'
import { MoeChat } from './MoeChat'

export function UtilitySidebar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => setIsOpen(!isOpen)

  return (
    <>
      {/* Toggle Button - Positioned below navbar */}
      <button
        onClick={toggleSidebar}
        className="fixed top-24 left-4 z-40 p-3 bg-gray-800 hover:bg-gray-700 
                   rounded-lg border border-gray-600 transition-colors shadow-lg"
        aria-label="Toggle utilities"
      >
        <Menu className="w-6 h-6 text-white" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - starts below navbar */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-gray-900/95 backdrop-blur-sm border-r border-gray-700
        transform transition-transform duration-300 z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header - account for navbar height */}
        <div className="mt-20 flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">🔧 Utilities</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content - properly spaced */}
        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100vh-140px)]">
          
          {/* Anxiety Cursor */}
          <div className="bg-gray-800/60 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <MousePointer className="w-5 h-5 text-orange-400 shrink-0" />
              <span className="text-sm font-medium text-gray-200">Anxiety Mode</span>
            </div>
            <div className="ml-8">
              <AnxietyCursor />
            </div>
          </div>

          {/* Volume Control */}
          <div className="bg-gray-800/60 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Volume2 className="w-5 h-5 text-green-400 shrink-0" />
              <span className="text-sm font-medium text-gray-200">Volume Control</span>
            </div>
            <div className="ml-8">
              <FakeVolumeControl />
            </div>
          </div>

          {/* Panic Button */}
          <div className="bg-gray-800/60 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
              <span className="text-sm font-medium text-gray-200">Panic Mode</span>
            </div>
            <div className="ml-8">
              <PanicButton />
            </div>
          </div>

          {/* Moe Chat */}
          <div className="bg-gray-800/60 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle className="w-5 h-5 text-purple-400 shrink-0" />
              <span className="text-sm font-medium text-gray-200">Chat with Dr. Moe</span>
            </div>
            <div className="ml-8">
              <MoeChat />
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
