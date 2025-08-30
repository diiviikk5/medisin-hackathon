import React, { useState, useEffect } from 'react'
import { useAchievements } from '../contexts/AchievementContext'

const bodyParts = [
  { id: 'head', name: 'Head', emoji: '🧠', multiplier: 3 },
  { id: 'chest', name: 'Chest', emoji: '🫁', multiplier: 2.5 },
  { id: 'stomach', name: 'Stomach', emoji: '🫃', multiplier: 2 },
  { id: 'arms', name: 'Arms', emoji: '💪', multiplier: 1.5 },
  { id: 'legs', name: 'Legs', emoji: '🦵', multiplier: 1.2 },
  { id: 'back', name: 'Back', emoji: '🦴', multiplier: 1.8 }
]

const symptoms = [
  { id: 'pain', name: 'Pain', severity: 2, description: 'Ouchie levels detected' },
  { id: 'numbness', name: 'Numbness', severity: 3, description: 'Feeling nothing, which is something' },
  { id: 'tingling', name: 'Tingling', severity: 1, description: 'Sparkly sensation syndrome' },
  { id: 'fatigue', name: 'Fatigue', severity: 2, description: 'Existential exhaustion' },
  { id: 'dizziness', name: 'Dizziness', severity: 3, description: 'World spinning disorder' },
  { id: 'burning', name: 'Burning', severity: 4, description: 'Internal fire detected' },
  { id: 'itching', name: 'Itching', severity: 1, description: 'Scratch-scratch syndrome' },
  { id: 'swelling', name: 'Swelling', severity: 3, description: 'Inflation malfunction' }
]

const dramaticDiagnoses = {
  low: [
    "You're probably fine, but let's make it interesting...",
    "Preliminary scan shows: You exist. Concerning.",
    "Diagnosis: Mild case of being alive. Treatment: Continue existing.",
    "Results: You have successfully described symptoms. Impressive."
  ],
  moderate: [
    "Warning: Multiple systems showing signs of... functioning normally?",
    "Alert: Patient displaying classic signs of human condition.",
    "Diagnosis: Advanced case of experiencing bodily sensations.",
    "Caution: Your body is communicating with you. Suspicious."
  ],
  high: [
    "URGENT: Patient exhibits rare condition known as 'Having Symptoms'",
    "BREAKING: Medical mystery detected. You may be... unique.",
    "ALERT: Database shows 47 possible conditions, including existence.",
    "WARNING: Your symptoms match exactly with 'being a person'"
  ],
  critical: [
    "🚨 EMERGENCY: Patient has achieved peak human experience",
    "🆘 CRITICAL: All symptoms point to advanced life participation",
    "⚠️ MAXIMUM ALERT: You have unlocked the full mortal experience",
    "🔴 RED ALERT: Diagnosis confirms you are definitely a human being"
  ]
}

const treatments = {
  low: ["Drink water", "Get some sleep", "Try turning yourself off and on again"],
  moderate: ["Consult a magic 8-ball", "Ask your plants for advice", "Scream into the void"],
  high: ["Immediate meme therapy required", "Emergency chocolate administration", "Professional Netflix consultation"],
  critical: ["Accept your fate", "Become one with the universe", "Learn interpretive dance"]
}

export function SymptomChecker() {
  const { trackPageVisit } = useAchievements()
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [currentBodyPart, setCurrentBodyPart] = useState(bodyParts[0])
  const [currentSymptom, setCurrentSymptom] = useState(symptoms[0])
  const [intensity, setIntensity] = useState(5)
  const [duration, setDuration] = useState('hours')
  const [diagnosisStage, setDiagnosisStage] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [finalDiagnosis, setFinalDiagnosis] = useState(null)

  useEffect(() => {
    trackPageVisit('symptom-checker')
  }, [trackPageVisit])

  const calculateDramaScore = () => {
    let score = 0
    selectedSymptoms.forEach(symptom => {
      const bodyPart = bodyParts.find(bp => bp.id === symptom.bodyPart)
      const symptomData = symptoms.find(s => s.id === symptom.symptom)
      
      score += symptom.intensity * symptomData.severity * bodyPart.multiplier
      
      if (symptom.duration === 'days') score *= 1.5
      if (symptom.duration === 'weeks') score *= 2
      if (symptom.duration === 'months') score *= 3
    })
    
    // Multiple symptoms = panic mode
    if (selectedSymptoms.length > 3) score += 50
    if (selectedSymptoms.length > 6) score += 100
    
    return score
  }

  const getDiagnosisLevel = (score) => {
    if (score < 20) return 'low'
    if (score < 60) return 'moderate'  
    if (score < 120) return 'high'
    return 'critical'
  }

  const addSymptom = () => {
    const newSymptom = {
      id: Date.now(),
      bodyPart: currentBodyPart.id,
      symptom: currentSymptom.id,
      intensity,
      duration,
      bodyPartName: currentBodyPart.name,
      symptomName: currentSymptom.name
    }
    setSelectedSymptoms([...selectedSymptoms, newSymptom])
  }

  const removeSymptom = (id) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s.id !== id))
  }

  const analyzeSymptoms = async () => {
    if (selectedSymptoms.length === 0) return

    setIsAnalyzing(true)
    setDiagnosisStage(0)

    // Stage 1: Initial analysis
    setTimeout(() => setDiagnosisStage(1), 1000)
    setTimeout(() => setDiagnosisStage(2), 2500)
    setTimeout(() => setDiagnosisStage(3), 4000)
    setTimeout(() => setDiagnosisStage(4), 5500)
    
    setTimeout(() => {
      const score = calculateDramaScore()
      const level = getDiagnosisLevel(score)
      const diagnosis = dramaticDiagnoses[level][Math.floor(Math.random() * dramaticDiagnoses[level].length)]
      const treatment = treatments[level][Math.floor(Math.random() * treatments[level].length)]
      
      setFinalDiagnosis({
        level,
        score,
        diagnosis,
        treatment,
        symptoms: selectedSymptoms.length
      })
      setIsAnalyzing(false)
      setDiagnosisStage(0)
    }, 7000)
  }

  const resetDiagnosis = () => {
    setSelectedSymptoms([])
    setFinalDiagnosis(null)
    setDiagnosisStage(0)
    setIsAnalyzing(false)
  }

  const analysisStages = [
    "🔍 Scanning symptoms database...",
    "🤖 Cross-referencing with WebMD, Wikipedia, and questionable blogs...",
    "📊 Calculating probability of doom...",
    "🧠 Consulting AI that definitely knows medicine...",
    "⚗️ Generating medically accurate* diagnosis..."
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white">
      <div className="container mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black mb-4">
            🩺 <span className="text-blue-400">Symptom</span>Checker
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Advanced AI-Powered* Medical Diagnosis System
          </p>
          <p className="text-sm text-gray-500">
            *AI may be a random number generator wearing a stethoscope
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Input Section */}
          <div className="bg-gray-800/50 backdrop-blur p-8 rounded-2xl border border-gray-700">
            <h2 className="text-3xl font-bold mb-6 text-blue-400">📝 Describe Your Symptoms</h2>
            
            {/* Body Part Selection */}
            <div className="mb-6">
              <label className="block text-lg font-semibold mb-3">Affected Body Part:</label>
              <div className="grid grid-cols-2 gap-3">
                {bodyParts.map(part => (
                  <button
                    key={part.id}
                    onClick={() => setCurrentBodyPart(part)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      currentBodyPart.id === part.id 
                        ? 'border-blue-500 bg-blue-500/20' 
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="text-2xl mb-1">{part.emoji}</div>
                    <div className="font-medium">{part.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Symptom Type */}
            <div className="mb-6">
              <label className="block text-lg font-semibold mb-3">Symptom Type:</label>
              <select 
                value={currentSymptom.id}
                onChange={(e) => setCurrentSymptom(symptoms.find(s => s.id === e.target.value))}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              >
                {symptoms.map(symptom => (
                  <option key={symptom.id} value={symptom.id}>
                    {symptom.name} - {symptom.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Intensity Slider */}
            <div className="mb-6">
              <label className="block text-lg font-semibold mb-3">
                Pain/Discomfort Level: <span className="text-blue-400">{intensity}/10</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full h-3 bg-gray-700 rounded-lg slider"
              />
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <span>Barely noticeable</span>
                <span>Existential crisis</span>
              </div>
            </div>

            {/* Duration */}
            <div className="mb-8">
              <label className="block text-lg font-semibold mb-3">Duration:</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              >
                <option value="minutes">A few minutes (probably nothing)</option>
                <option value="hours">Several hours (getting interesting)</option>
                <option value="days">Multiple days (plot thickens)</option>
                <option value="weeks">Weeks (now we're talking)</option>
                <option value="months">Months (medical mystery!)</option>
              </select>
            </div>

            <button
              onClick={addSymptom}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 p-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105"
            >
              ➕ Add Symptom to Analysis
            </button>
          </div>

          {/* Analysis Section */}
          <div className="bg-gray-800/50 backdrop-blur p-8 rounded-2xl border border-gray-700">
            <h2 className="text-3xl font-bold mb-6 text-green-400">🔬 Medical Analysis</h2>

            {/* Current Symptoms */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">
                Current Symptoms ({selectedSymptoms.length})
              </h3>
              <div className="max-h-64 overflow-y-auto space-y-3">
                {selectedSymptoms.map(symptom => (
                  <div key={symptom.id} className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-yellow-400">
                          {symptom.bodyPartName} - {symptom.symptomName}
                        </div>
                        <div className="text-sm text-gray-400">
                          Intensity: {symptom.intensity}/10 • Duration: {symptom.duration}
                        </div>
                      </div>
                      <button
                        onClick={() => removeSymptom(symptom.id)}
                        className="text-red-400 hover:text-red-300 text-xl"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
                {selectedSymptoms.length === 0 && (
                  <div className="text-gray-500 text-center py-8">
                    No symptoms added yet. Describe your condition above!
                  </div>
                )}
              </div>
            </div>

            {/* Analysis Button */}
            {selectedSymptoms.length > 0 && !isAnalyzing && !finalDiagnosis && (
              <button
                onClick={analyzeSymptoms}
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 p-4 rounded-lg font-bold text-lg mb-6 transition-all transform hover:scale-105"
              >
                🔍 Analyze Symptoms & Generate Diagnosis
              </button>
            )}

            {/* Analysis Progress */}
            {isAnalyzing && (
              <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600 mb-6">
                <div className="text-center mb-4">
                  <div className="text-2xl mb-2">🤖</div>
                  <div className="text-lg font-semibold">Medical AI Processing...</div>
                </div>
                <div className="space-y-3">
                  {analysisStages.slice(0, diagnosisStage + 1).map((stage, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        index === diagnosisStage ? 'bg-blue-400 animate-pulse' : 'bg-green-400'
                      }`} />
                      <div className={index === diagnosisStage ? 'text-blue-400' : 'text-green-400'}>
                        {stage}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Final Diagnosis */}
            {finalDiagnosis && (
              <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 p-6 rounded-lg border-2 border-purple-500">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-purple-400 mb-2">
                    📋 OFFICIAL DIAGNOSIS
                  </h3>
                  <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                    finalDiagnosis.level === 'low' ? 'bg-green-500/20 text-green-400' :
                    finalDiagnosis.level === 'moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                    finalDiagnosis.level === 'high' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {finalDiagnosis.level.toUpperCase()} PRIORITY
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="font-semibold text-blue-400 mb-2">Medical Opinion:</div>
                    <div className="text-lg">{finalDiagnosis.diagnosis}</div>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="font-semibold text-green-400 mb-2">Recommended Treatment:</div>
                    <div className="text-lg">{finalDiagnosis.treatment}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-800/30 p-3 rounded">
                      <div className="text-gray-400">Complexity Score:</div>
                      <div className="text-xl font-bold text-purple-400">{finalDiagnosis.score.toFixed(1)}</div>
                    </div>
                    <div className="bg-gray-800/30 p-3 rounded">
                      <div className="text-gray-400">Symptoms Analyzed:</div>
                      <div className="text-xl font-bold text-blue-400">{finalDiagnosis.symptoms}</div>
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      onClick={resetDiagnosis}
                      className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg font-semibold transition-colors"
                    >
                      🔄 Start New Analysis
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-center mt-12 p-6 bg-red-900/20 border border-red-500/30 rounded-lg">
          <p className="text-red-300 font-semibold mb-2">⚠️ IMPORTANT DISCLAIMER</p>
          <p className="text-sm text-gray-400">
            This is a parody medical diagnosis tool created for entertainment purposes only. 
            For actual medical concerns, please consult a real healthcare professional who went to medical school 
            (unlike our AI, which learned medicine from Wikipedia and YouTube).
          </p>
        </div>
      </div>
    </div>
  )
}
