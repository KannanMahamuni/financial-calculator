/**
 * HomePage Component
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { useFeatureFlag } from '../../hooks/useFeatureFlag'

export function HomePage() {
  const { isMFCalculatorEnabled, isNPSCalculatorEnabled } = useFeatureFlag()

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Financial Calculator
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Plan your investments with precision. Calculate returns for Mutual Funds and National
          Pension Scheme with real-time, accurate projections.
        </p>
      </section>

      {/* Calculator Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {isMFCalculatorEnabled() && (
          <Link
            to="/mf-calculator"
            className="group bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-32 flex items-center justify-center">
              <div className="text-5xl">📈</div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                Mutual Fund Calculator
              </h2>
              <p className="text-gray-600 mt-2">
                Calculate returns on your mutual fund investments based on principal, contributions,
                and expected returns.
              </p>
              <div className="mt-4 inline-block text-blue-600 font-semibold group-hover:gap-2 transition-all">
                Start Calculating →
              </div>
            </div>
          </Link>
        )}

        {isNPSCalculatorEnabled() && (
          <Link
            to="/nps-calculator"
            className="group bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
          >
            <div className="bg-gradient-to-r from-green-500 to-green-600 h-32 flex items-center justify-center">
              <div className="text-5xl">🏦</div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                NPS Calculator
              </h2>
              <p className="text-gray-600 mt-2">
                Plan your retirement with NPS. Calculate corpus accumulation and projected monthly
                annuity income.
              </p>
              <div className="mt-4 inline-block text-green-600 font-semibold group-hover:gap-2 transition-all">
                Start Planning →
              </div>
            </div>
          </Link>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-lg font-semibold text-gray-900">Real-Time Calculations</h3>
            <p className="text-gray-600 mt-2">Get instant results as you adjust your inputs</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-lg font-semibold text-gray-900">Mobile Responsive</h3>
            <p className="text-gray-600 mt-2">Use on any device, anywhere, anytime</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-lg font-semibold text-gray-900">Privacy First</h3>
            <p className="text-gray-600 mt-2">No data collection, all calculations local</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Plan Your Financial Future?</h2>
        <p className="text-lg mb-6 text-primary-100">
          Choose a calculator and start your investment journey today.
        </p>
        {isMFCalculatorEnabled() && (
          <Link
            to="/mf-calculator"
            className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            Get Started
          </Link>
        )}
      </section>
    </div>
  )
}
