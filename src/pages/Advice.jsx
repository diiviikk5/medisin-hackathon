import React, { useState } from 'react'
import { MessageSquare, AlertCircle } from 'lucide-react'
import { useAnnoyUser } from '../hooks/useAnnoyUser'
import symptomsData from '../lib/data/symptoms.json'

const catastrophicDiagnoses = [
  {
    diagnosis: "Stage 9 Mega-Cancer (of the vibes)",
    severity: "Terminal (to productivity)", 
    treatment: ["Corona Injection (Cancer Edition)", "3 memes daily", "1 nap (mandatory)", "HaldiDoodh-650"],
    followUp: "Never. We don't believe in follow-ups."
  },
  {
    diagnosis: "Acute Monday-itis",
    severity: "Chronic (recurring weekly)",
    treatment: ["Placebin-500", "Netflix prescription", "Avoid responsibilities", "Call in sick"],
    followUp: "Every Monday for life."
  },
  {
    diagnosis: "WiFi Withdrawal Syndrome",
    severity: "Critical (affecting social media)",
    treatment: ["Data pack injection", "Hotspot therapy", "Go outside (not recommended)", "Digital detox (ha!)"],
    followUp: "Until internet is restored."
  },
  {
    diagnosis: "Commitment Hardware Failure",
    severity: "Catastrophic (relationship threatening)",
    treatment: ["Cold feet warming therapy", "Responsibility avoidance pills", "Run away (classic)", "Blame timing"],
    followUp: "When someone better comes along."
  },
  {
    diagnosis: "Productivity Driver Corruption",
    severity: "System-wide failure",
    treatment: ["Tomorrow pills", "Later injections", "Next week therapy", "Eventually supplements"],
    followUp: "Someday. Maybe. If we remember."
  }
]

export function Advice() {
  const [selectedSymptom, setSelectedSymptom] = useState(null)
  const [diagnosis, setDiagnosis] = useState(null)
  const { triggerRoast } = useAnnoyUser()

  const handleSymptomClick = (symptom) => {
    setSelectedSymptom(symptom)
    // Random catastrophic diagnosis
    const randomDiagnosis = catastrophicDiagnoses[Math.floor(Math.random() * catastrophicDiagnoses.length)]
    setDiagnosis({
      ...randomDiagnosis,
      symptom: symptom.name
    })
    triggerRoast('diagnosis')
  }

  const getSecondOpinion = () => {
    const randomDiagnosis = catastrophicDiagnoses[Math.floor(Math.random() * catastrophicDiagnoses.length)]
    setDiagnosis({
      ...randomDiagnosis,
      symptom: selectedSymptom.name
    })
    triggerRoast('second-opinion')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Medical Advice</h1>
        <p className="text-xl text-gray-400">Expertly unhelpful guidance since inception</p>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 max-w-2xl mx-auto">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-6 w-6 text-danger-500 flex-shrink-0" />
            <p className="text-sm text-gray-300">
              Our advisors are certified in the art of confidently incorrect diagnoses.
            </p>
          </div>
        </div>
      </div>

      {!selectedSymptom ? (
        // Symptom Selection
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-center">What's bothering you today?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {symptomsData.map(symptom => (
              <button
                key={symptom.id}
                onClick={() => handleSymptomClick(symptom)}
                className="card card-hover text-center space-y-3 transition-all hover:scale-105"
              >
                <div className="text-4xl">{symptom.icon}</div>
                <div className="font-medium">{symptom.name}</div>
                <div className="text-sm text-gray-400">{symptom.description}</div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        // Diagnosis Result
        <div className="max-w-4xl mx-auto space-y-8">
          <button
            onClick={() => {
              setSelectedSymptom(null)
              setDiagnosis(null)
            }}
            className="btn-secondary"
          >
            ← Back to Symptoms
          </button>

          {diagnosis && (
            <div className="card space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-danger-500">CONSULTATION SUMMARY</h2>
                <div className="bg-red-600/20 border border-red-600/30 rounded-lg p-3">
                  <p className="text-sm font-medium">⚠️ NOT A DIAGNOSIS - PARODY ONLY ⚠️</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Symptom:</h3>
                    <p className="text-gray-300">{diagnosis.symptom}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Diagnosis:</h3>
                    <p className="text-danger-400 font-medium">{diagnosis.diagnosis}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Severity:</h3>
                    <p className="text-primary-400">{diagnosis.severity}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Treatment:</h3>
                    <ul className="space-y-1">
                      {diagnosis.treatment.map((treatment, index) => (
                        <li key={index} className="text-gray-300">• {treatment}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Follow-up:</h3>
                    <p className="text-gray-300">{diagnosis.followUp}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-700">
                <button
                  onClick={getSecondOpinion}
                  className="btn-primary flex-1"
                >
                  Get Second Opinion (Equally Wrong)
                </button>
                <button
                  onClick={() => triggerRoast('export')}
                  className="btn-secondary flex-1"
                >
                  Print Consultation (Watermarked)
                </button>
              </div>

              <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-700">
                <p>Remember: Hydrate. Sleep. See a real doctor for actual issues.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
