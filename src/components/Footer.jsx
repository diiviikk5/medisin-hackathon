import React from 'react'

export function Footer() {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-2xl font-bold">Medi<span className="text-danger-500">SIN?</span></span>
          </div>
          <p className="text-gray-400">The problem to all your solutions</p>
          <div className="text-sm text-gray-500 space-y-2">
            <p>© 2025 MediSIN? - Proudly useless since inception</p>
            <p>Utility: 0/10 | Vibe: 10/10 | Medical Benefit: Not Found</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
