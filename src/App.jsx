import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { ThunderousMode } from './components/ThunderousMode'
import { BuyNowGameManager } from './components/BuyNowGameManager'
import { AchievementProvider } from './contexts/AchievementContext'
import { AchievementNotification } from './components/AchievementNotification'
import { AnnoyProvider } from './pages/Annoy'

// Your existing pages
import { Home } from './pages/Home'
import { Catalog } from './pages/Catalog'
import { ProductDetail } from './pages/ProductDetail'
import { Advice } from './pages/Advice'
import { Cart } from './pages/Cart'
import { Achievements } from './pages/Achievements'

// New pages
import { SymptomChecker } from './pages/symptom-checker'
import { MedCooker } from './pages/MedCooker'
import EntryGate from './pages/EntryGate'

// Auth Context
import { AuthProvider, useAuth } from './contexts/AuthContext'

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user } = useAuth()
  
  if (!user) {
    return <Navigate to="/entry" replace />
  }
  
  return children
}

// Main App Routes (after passing entry gate)
function MainAppRoutes() {
  return (
    <>
      {/* Disclaimer */}
      <div className="bg-red-600 text-white text-center py-2 text-sm font-medium">
        ⚠️ Parody. Not medical advice. MediSIN? - The problem to all your solutions.
      </div>
      
      <Navbar />
      
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/advice" element={<Advice />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/symptom-checker" element={<SymptomChecker />} />
          <Route path="/medcooker" element={<MedCooker />} />
        </Routes>
      </main>
      
      <Footer />
      <ThunderousMode />
      <BuyNowGameManager />
    </>
  )
}

function App() {
  return (
    <AnnoyProvider>
      <AchievementProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gray-900 text-gray-100">
              <Routes>
                {/* Entry Gate Route (unprotected) */}
                <Route path="/entry" element={<EntryGate />} />
                
                {/* All other routes are protected */}
                <Route 
                  path="/*" 
                  element={
                    <ProtectedRoute>
                      <MainAppRoutes />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
              
              {/* Global Components */}
              <Toaster 
                position="bottom-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#1f2937',
                    color: '#f9fafb',
                    border: '1px solid #374151'
                  }
                }}
              />
              
              <AchievementNotification />
            </div>
          </Router>
        </AuthProvider>
      </AchievementProvider>
    </AnnoyProvider>
  )
}

export default App
