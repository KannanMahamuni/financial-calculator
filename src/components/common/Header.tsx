/**
 * Header Component
 */

import React from 'react'
import { Link } from 'react-router-dom'

export function Header() {
  return (
    <header className="bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="text-3xl font-bold">₹</div>
            <div>
              <h1 className="text-2xl font-bold">Financial Calculator</h1>
              <p className="text-primary-100 text-sm">MF & NPS Investment Planning</p>
            </div>
          </Link>

          <nav className="hidden md:flex gap-6">
            <Link to="/" className="hover:text-primary-100 transition-colors">
              Home
            </Link>
            <Link to="/mf-calculator" className="hover:text-primary-100 transition-colors">
              MF Calculator
            </Link>
            <Link to="/nps-calculator" className="hover:text-primary-100 transition-colors">
              NPS Calculator
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
