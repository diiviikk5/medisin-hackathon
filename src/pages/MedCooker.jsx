import React, { useState, useEffect } from 'react'
import { useAchievements } from '../contexts/AchievementContext'

const medicines = [
  { id: 'anxiety-pills', name: 'Anxie-Tea', color: '#8B5CF6', element: 'Anxium', effects: ['Calming', 'Overthinking'], category: 'mental' },
  { id: 'energy-drink', name: 'Chaos Cola', color: '#EF4444', element: 'Caffeinium', effects: ['Hyperactive', 'Jittery'], category: 'energy' },
  { id: 'happy-pills', name: 'Joy Juice', color: '#F59E0B', element: 'Serotonin', effects: ['Euphoric', 'Giggly'], category: 'mental' },
  { id: 'sleep-aid', name: 'Dreamium', color: '#6366F1', element: 'Melatonin', effects: ['Drowsy', 'Peaceful'], category: 'stealth' },
  { id: 'pain-killer', name: 'Ow-Away', color: '#10B981', element: 'Numbium', effects: ['Numb', 'Relief'], category: 'strength' },
  { id: 'focus-pills', name: 'Brain Boost', color: '#06B6D4', element: 'Focusine', effects: ['Alert', 'Concentrated'], category: 'mental' },
  { id: 'mood-stabilizer', name: 'Chill Pill', color: '#84CC16', element: 'Stabilium', effects: ['Balanced', 'Zen'], category: 'stealth' },
  { id: 'confidence-boost', name: 'Alpha Serum', color: '#F97316', element: 'Confidium', effects: ['Bold', 'Fearless'], category: 'strength' }
]

// SUPERHERO SERUMS - THE GAME CHANGER! 🦸‍♂️
const superheroSerums = [
  {
    id: 'hulk_serum',
    name: '💚 HULK SERUM',
    description: 'Grants incredible strength but uncontrollable rage. HULK SMASH!',
    color: '#4CAF50',
    effects: ['Super Strength', 'Uncontrollable Rage', 'Green Skin'],
    tier: 'LEGENDARY',
    transformation: 'You feel your muscles expanding! Your skin turns green! HULK SMASH EVERYTHING!',
    unlockCondition: (meds) => meds.length >= 3 && meds.some(m => m.category === 'strength'),
    power: '🔥 S-TIER SUPERHERO',
    warning: 'May cause property damage and anger management issues'
  },
  {
    id: 'flash_serum',
    name: '⚡ SPEEDSTER SERUM',
    description: 'Super speed but you forget where you were going',
    color: '#FF5722',
    effects: ['Lightning Speed', 'Memory Loss', 'Time Dilation'],
    tier: 'EPIC',
    transformation: 'Lightning courses through your veins! You move faster than light but... wait, where am I?',
    unlockCondition: (meds) => meds.some(m => m.category === 'energy') && meds.length >= 2,
    power: '⚡ A-TIER SPEEDSTER',
    warning: 'Side effects include chronic lateness due to getting lost'
  },
  {
    id: 'invisible_serum',
    name: '👻 INVISIBILITY SERUM',
    description: 'Turn invisible but become extremely clumsy',
    color: '#9E9E9E',
    effects: ['Perfect Invisibility', 'Maximum Clumsiness', 'Existential Crisis'],
    tier: 'RARE',
    transformation: 'You fade from existence... but immediately trip over your own feet!',
    unlockCondition: (meds) => meds.some(m => m.category === 'stealth'),
    power: '🫥 B-TIER STEALTH',
    warning: 'Warning: Still make noise when walking into things'
  },
  {
    id: 'psychic_serum',
    name: '🧠 PROFESSOR X SERUM',
    description: 'Telepathic powers but constant headaches from everyone\'s thoughts',
    color: '#673AB7',
    effects: ['Mind Reading', 'Telekinesis', 'Permanent Headache'],
    tier: 'LEGENDARY',
    transformation: 'Your mind expands beyond mortal limits! Unfortunately, so does your headache...',
    unlockCondition: (meds) => meds.filter(m => m.category === 'mental').length >= 2,
    power: '🧠 S-TIER PSYCHIC',
    warning: 'You will hear EVERYONE\'s thoughts. Yes, even the weird ones.'
  },
  {
    id: 'wolverine_serum',
    name: '🦾 WOLVERINE SERUM',
    description: 'Healing factor and claws but terrible anger issues',
    color: '#FFD700',
    effects: ['Regeneration', 'Adamantium Claws', 'Berserker Rage'],
    tier: 'LEGENDARY',
    transformation: 'Metal claws extend from your hands! You can heal anything... except your attitude!',
    unlockCondition: (meds) => meds.some(m => m.category === 'strength') && meds.some(m => m.category === 'mental'),
    power: '🦾 S-TIER MUTANT',
    warning: 'May cause excessive brooding and leather jacket addiction'
  },
  {
    id: 'spider_serum',
    name: '🕷️ SPIDER SERUM',
    description: 'Spider powers but you\'re now afraid of fly swatters',
    color: '#DC143C',
    effects: ['Wall Crawling', 'Spider Sense', 'Fly Swatter Phobia'],
    tier: 'EPIC',
    transformation: 'Your friendly neighborhood transformation is complete! *Web-slinging intensifies*',
    unlockCondition: (meds) => meds.length === 2 && meds.some(m => m.category === 'stealth') && meds.some(m => m.category === 'energy'),
    power: '🕷️ A-TIER WEB-SLINGER',
    warning: 'Great power comes with great responsibility (and arachnophobia)'
  },
  {
    id: 'duck_serum',
    name: '🦆 ULTIMATE DUCK SERUM',
    description: 'Turns you into a duck but you retain all coding abilities',
    color: '#FFC107',
    effects: ['Quacking', 'Coding Mastery', 'Bread Addiction'],
    tier: 'MEME',
    transformation: 'QUACK! You are now the world\'s first coding duck! Your GitHub commits are now in duck language!',
    unlockCondition: (meds) => meds.length > 4 || Math.random() < 0.1, // Random chance or too many meds
    power: '🦆 MEME-TIER LEGEND',
    warning: 'You will compulsively ask for bread during meetings'
  }
]

const reactionDatabase = {
  'anxiety-pills+energy-drink': {
    name: 'Quantum Anxiety Accelerator',
    description: 'Simultaneously calm and panicked - breaking physics since 2025',
    color: '#A855F7',
    stability: 12,
    effects: ['Schrödinger\'s Panic', 'Temporal Confusion', 'Enlightenment'],
    warning: 'May cause existential breakthrough',
    nobelChance: 87
  },
  'happy-pills+pain-killer': {
    name: 'Emotional Numbness Supreme',
    description: 'Feel nothing but somehow everything at once',
    color: '#64748B',
    stability: 45,
    effects: ['Robotic Efficiency', 'Zen Master Mode', 'Productivity Overload'],
    warning: 'Side effects include becoming the perfect employee',
    nobelChance: 23
  },
  'sleep-aid+energy-drink': {
    name: 'Paradox Potion Deluxe',
    description: 'The impossible dream of being asleep and awake',
    color: '#7C3AED',
    stability: 5,
    effects: ['Wakeful Dreaming', 'Sleep Running', 'Time Paradox'],
    warning: 'May violate several laws of physics',
    nobelChance: 94
  }
}

export function MedCooker() {
  const { trackPageVisit } = useAchievements()
  const [selectedMeds, setSelectedMeds] = useState([])
  const [mixingInProgress, setMixingInProgress] = useState(false)
  const [result, setResult] = useState(null)
  const [temperature, setTemperature] = useState(20)
  const [mixingTime, setMixingTime] = useState(30)
  const [labSafety, setLabSafety] = useState(100)
  const [discoveredSerums, setDiscoveredSerums] = useState([])
  const [mixingStage, setMixingStage] = useState(0)
  const [superheroDiscovered, setSuperheroDiscovered] = useState(null)
  const [showTransformation, setShowTransformation] = useState(false)

  useEffect(() => {
    trackPageVisit('medcooker')
  }, [trackPageVisit])

  const addMedicine = (medicine) => {
    if (selectedMeds.length < 4 && !selectedMeds.find(m => m.id === medicine.id)) {
      setSelectedMeds([...selectedMeds, medicine])
      setLabSafety(prev => Math.max(0, prev - 8))
    }
  }

  const removeMedicine = (medicineId) => {
    setSelectedMeds(selectedMeds.filter(m => m.id !== medicineId))
    setLabSafety(prev => Math.min(100, prev + 5))
  }

  // CHECK FOR SUPERHERO SERUM! 🦸‍♂️
  const checkForSuperheroSerum = () => {
    for (let serum of superheroSerums) {
      if (serum.unlockCondition(selectedMeds) && !discoveredSerums.find(s => s.id === serum.id)) {
        return serum
      }
    }
    return null
  }

  const generateReaction = () => {
    if (selectedMeds.length < 2) return null

    const sortedIds = selectedMeds.map(m => m.id).sort().join('+')
    
    // Check if we have a predefined reaction
    if (reactionDatabase[sortedIds]) {
      return reactionDatabase[sortedIds]
    }

    // Generate dynamic reaction
    const combinedEffects = selectedMeds.flatMap(m => m.effects)
    const complexity = selectedMeds.length * 25 + (temperature - 20) + mixingTime
    
    return {
      name: generateCompoundName(selectedMeds),
      description: `A mysterious compound created from ${selectedMeds.length} different medicines`,
      color: selectedMeds[0].color,
      stability: Math.max(5, 100 - complexity),
      effects: combinedEffects.slice(0, 3),
      warning: generateWarning(combinedEffects),
      nobelChance: Math.min(95, complexity * 2)
    }
  }

  const generateCompoundName = (meds) => {
    const prefixes = ['Neo-', 'Ultra-', 'Meta-', 'Quantum-', 'Bio-', 'Psycho-']
    const suffixes = ['-ium', '-ine', '-ol', '-ate', '-ide', '-plex']
    const base = meds[0].name.substring(0, 4) + meds[meds.length - 1].name.substring(0, 3)
    
    return prefixes[Math.floor(Math.random() * prefixes.length)] + 
           base + 
           suffixes[Math.floor(Math.random() * suffixes.length)]
  }

  const generateWarning = (effects) => {
    const warnings = [
      'May cause spontaneous enlightenment',
      'Side effects include becoming too interesting',
      'Could result in understanding your parents',
      'May lead to reading terms and conditions',
      'Possible side effect: having good ideas'
    ]
    return warnings[Math.floor(Math.random() * warnings.length)]
  }

  const startMixing = async () => {
    if (selectedMeds.length < 2) return

    setMixingInProgress(true)
    setMixingStage(0)
    setResult(null)
    setSuperheroDiscovered(null)

    const stages = [
      '🧪 Heating compounds to optimal temperature...',
      '⚗️ Initiating molecular bonding process...',
      '🔬 Stabilizing chemical structure...',
      '🛡️ Running safety analysis...',
      '⚡ Finalizing compound synthesis...',
      '🦸‍♂️ Scanning for superhero mutations...',
      '🏆 Documenting results for Nobel Committee...'
    ]

    for (let i = 0; i < stages.length; i++) {
      setTimeout(() => setMixingStage(i), i * 800)
    }

    setTimeout(() => {
      const reaction = generateReaction()
      const superheroSerum = checkForSuperheroSerum()
      
      setResult(reaction)
      
      if (superheroSerum) {
        setSuperheroDiscovered(superheroSerum)
        setDiscoveredSerums(prev => [...prev, superheroSerum])
        setShowTransformation(true)
        // Hide transformation after 5 seconds
        setTimeout(() => setShowTransformation(false), 5000)
      }
      
      setMixingInProgress(false)
      setMixingStage(0)
      
      // Safety impact
      setLabSafety(prev => Math.max(0, prev - (reaction?.stability || 50) / 2))
    }, stages.length * 800)
  }

  const resetLab = () => {
    setSelectedMeds([])
    setResult(null)
    setSuperheroDiscovered(null)
    setShowTransformation(false)
    setLabSafety(100)
    setTemperature(20)
    setMixingTime(30)
  }

  const mixingStages = [
    '🧪 Heating compounds to optimal temperature...',
    '⚗️ Initiating molecular bonding process...',
    '🔬 Stabilizing chemical structure...',
    '🛡️ Running safety analysis...',
    '⚡ Finalizing compound synthesis...',
    '🦸‍♂️ Scanning for superhero mutations...',
    '🏆 Documenting results for Nobel Committee...'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white relative">
      {/* SUPERHERO TRANSFORMATION OVERLAY! */}
      {showTransformation && superheroDiscovered && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <div className="text-center animate-bounce">
            <div className="text-8xl mb-8">🦸‍♂️</div>
            <div className="text-6xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600">
              SERUM UNLOCKED!
            </div>
            <div className="text-4xl mb-4" style={{ color: superheroDiscovered.color }}>
              {superheroDiscovered.name}
            </div>
            <div className="text-xl mb-6 max-w-2xl text-yellow-200">
              {superheroDiscovered.transformation}
            </div>
            <div className="text-lg text-purple-300">
              {superheroDiscovered.power}
            </div>
            <div className="text-sm text-gray-400 mt-4">
              ✨ This transformation will auto-close in a few seconds...
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black mb-4">
            ⚗️ <span className="text-purple-400">Med</span>Cooker
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Advanced Superhero Serum Laboratory 🦸‍♂️
          </p>
          <p className="text-sm text-gray-500">
            "Warning: May create actual superheroes. Side effects include saving the world."
          </p>
        </div>

        {/* Discovered Serums Gallery */}
        {discoveredSerums.length > 0 && (
          <div className="bg-gradient-to-r from-yellow-900/30 to-red-900/30 backdrop-blur p-6 rounded-2xl border border-yellow-500/30 mb-8">
            <h2 className="text-3xl font-bold mb-4 text-yellow-400">🏆 SUPERHERO SERUMS DISCOVERED</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {discoveredSerums.map((serum) => (
                <div
                  key={serum.id}
                  className="p-4 rounded-lg border-2 bg-gray-800/50"
                  style={{ borderColor: serum.color, backgroundColor: `${serum.color}10` }}
                >
                  <div className="text-lg font-bold" style={{ color: serum.color }}>
                    {serum.name}
                  </div>
                  <div className="text-sm text-gray-300 mt-2">{serum.description}</div>
                  <div className="text-xs text-yellow-400 mt-2">{serum.power}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lab Safety Indicator */}
        <div className="bg-gray-800/50 backdrop-blur p-4 rounded-lg border border-gray-700 mb-8">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">🛡️ Lab Safety Level:</span>
            <div className={`px-4 py-2 rounded-lg font-bold ${
              labSafety > 70 ? 'bg-green-500/20 text-green-400' :
              labSafety > 30 ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {labSafety}% {labSafety < 30 ? '(SUPERHERO ZONE!)' : ''}
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 mt-2">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                labSafety > 70 ? 'bg-green-500' :
                labSafety > 30 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${labSafety}%` }}
            ></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Medicine Selection */}
          <div className="bg-gray-800/50 backdrop-blur p-6 rounded-2xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-blue-400">💊 Select Medicines</h2>
            <div className="grid grid-cols-2 gap-4">
              {medicines.map(medicine => (
                <button
                  key={medicine.id}
                  onClick={() => addMedicine(medicine)}
                  disabled={selectedMeds.find(m => m.id === medicine.id) || selectedMeds.length >= 4}
                  className={`p-4 rounded-lg border-2 transition-all transform hover:scale-105 ${
                    selectedMeds.find(m => m.id === medicine.id)
                      ? 'border-gray-500 bg-gray-700/50 opacity-50'
                      : 'border-gray-600 hover:border-gray-500 bg-gray-700/30'
                  }`}
                  style={{ 
                    borderColor: selectedMeds.find(m => m.id === medicine.id) ? '#6B7280' : medicine.color,
                    backgroundColor: selectedMeds.find(m => m.id === medicine.id) ? 'rgba(75, 85, 99, 0.5)' : `${medicine.color}20`
                  }}
                >
                  <div className="font-semibold mb-1">{medicine.name}</div>
                  <div className="text-xs text-gray-400">{medicine.element}</div>
                  <div className="text-xs mt-2">
                    {medicine.effects.slice(0, 2).join(', ')}
                  </div>
                  <div className="text-xs mt-1 text-yellow-400 font-semibold">
                    {medicine.category.toUpperCase()}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Mixing Laboratory */}
          <div className="bg-gray-800/50 backdrop-blur p-6 rounded-2xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-purple-400">🔬 Superhero Lab</h2>
            
            {/* Selected Medicines */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">
                Active Compounds ({selectedMeds.length}/4)
              </h3>
              <div className="space-y-2 min-h-[120px]">
                {selectedMeds.map(med => (
                  <div 
                    key={med.id} 
                    className="flex items-center justify-between p-3 rounded-lg border"
                    style={{ 
                      borderColor: med.color,
                      backgroundColor: `${med.color}15`
                    }}
                  >
                    <div>
                      <div className="font-semibold">{med.name}</div>
                      <div className="text-xs text-gray-400">{med.element} • {med.category}</div>
                    </div>
                    <button
                      onClick={() => removeMedicine(med.id)}
                      className="text-red-400 hover:text-red-300 text-xl"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {selectedMeds.length === 0 && (
                  <div className="text-gray-500 text-center py-8">
                    Select medicines to begin superhero transformation
                  </div>
                )}
              </div>
            </div>

            {/* Lab Controls */}
            {selectedMeds.length > 0 && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    🌡️ Temperature: {temperature}°C
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={temperature}
                    onChange={(e) => setTemperature(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    ⏰ Mixing Time: {mixingTime} seconds
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="120"
                    value={mixingTime}
                    onChange={(e) => setMixingTime(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {/* Mix Button */}
            {selectedMeds.length >= 2 && !mixingInProgress && (
              <button
                onClick={startMixing}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 p-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105"
              >
                🦸‍♂️ CREATE SUPERHERO SERUM
              </button>
            )}

            {/* Mixing Progress */}
            {mixingInProgress && (
              <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                <div className="text-center mb-4">
                  <div className="text-2xl mb-2">⚗️</div>
                  <div className="text-lg font-semibold">Superhero Transformation In Progress...</div>
                </div>
                <div className="space-y-2">
                  {mixingStages.slice(0, mixingStage + 1).map((stage, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        index === mixingStage ? 'bg-purple-400 animate-pulse' : 'bg-green-400'
                      }`} />
                      <div className={index === mixingStage ? 'text-purple-400' : 'text-green-400'}>
                        {stage}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results Panel */}
          <div className="bg-gray-800/50 backdrop-blur p-6 rounded-2xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-green-400">📊 Laboratory Results</h2>
            
            {result && (
              <div className="space-y-6">
                {/* Regular Compound Result */}
                <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 p-6 rounded-lg border-2 border-purple-500">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-purple-400 mb-2">
                      🧪 COMPOUND SYNTHESIZED
                    </h3>
                    <div 
                      className="inline-block px-4 py-2 rounded-full text-sm font-bold"
                      style={{ 
                        backgroundColor: `${result.color}30`,
                        color: result.color,
                        border: `2px solid ${result.color}`
                      }}
                    >
                      {result.name}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <div className="font-semibold text-blue-400 mb-2">Description:</div>
                      <div>{result.description}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-gray-800/30 p-3 rounded">
                        <div className="text-gray-400">Stability:</div>
                        <div className={`text-xl font-bold ${
                          result.stability > 70 ? 'text-green-400' :
                          result.stability > 30 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {result.stability}%
                        </div>
                      </div>
                      <div className="bg-gray-800/30 p-3 rounded">
                        <div className="text-gray-400">Nobel Chance:</div>
                        <div className="text-xl font-bold text-purple-400">{result.nobelChance}%</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Superhero Serum Result */}
                {superheroDiscovered && (
                  <div className="bg-gradient-to-br from-yellow-900/50 to-red-900/50 p-6 rounded-lg border-2 border-yellow-500 animate-pulse">
                    <div className="text-center mb-4">
                      <h3 className="text-2xl font-bold text-yellow-400 mb-2">
                        🦸‍♂️ SUPERHERO SERUM DISCOVERED!
                      </h3>
                      <div 
                        className="inline-block px-4 py-2 rounded-full text-lg font-bold"
                        style={{ 
                          backgroundColor: `${superheroDiscovered.color}30`,
                          color: superheroDiscovered.color,
                          border: `2px solid ${superheroDiscovered.color}`
                        }}
                      >
                        {superheroDiscovered.name}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gray-800/50 p-4 rounded-lg">
                        <div className="font-semibold text-yellow-400 mb-2">Transformation:</div>
                        <div className="text-yellow-100">{superheroDiscovered.description}</div>
                      </div>

                      <div className="bg-gray-800/50 p-4 rounded-lg">
                        <div className="font-semibold text-red-400 mb-2">⚠️ Warning:</div>
                        <div>{superheroDiscovered.warning}</div>
                      </div>

                      <div className="text-center">
                        <div className="text-lg font-bold text-yellow-400">
                          {superheroDiscovered.power}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!result && !mixingInProgress && (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">🦸‍♂️</div>
                <div>Mix 2+ medicines to unlock superpowers</div>
                <div className="text-sm mt-2">Who knows what abilities you'll discover?</div>
              </div>
            )}

            {/* Reset Button */}
            {(result || selectedMeds.length > 0) && (
              <div className="text-center mt-6">
                <button
                  onClick={resetLab}
                  className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  🔄 Reset Laboratory
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-center mt-12 p-6 bg-red-900/20 border border-red-500/30 rounded-lg">
          <p className="text-red-300 font-semibold mb-2">⚠️ SUPERHERO LABORATORY SAFETY NOTICE</p>
          <p className="text-sm text-gray-400">
            This is a simulated superhero laboratory for entertainment purposes only. 
            Do not attempt to mix real medications or expect actual superpowers. 
            Always consult healthcare professionals for actual medical advice. 
            No actual superheroes were harmed in the making of this simulator.
          </p>
        </div>
      </div>
    </div>
  )
}
