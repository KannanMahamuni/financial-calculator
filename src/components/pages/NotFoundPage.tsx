/**
 * NotFoundPage Component
 * 404 Error Page
 */

import React from 'react'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
      <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h1>
      <p className="text-gray-600 mb-8">
        Sorry, the page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
      >
        Back to Home
      </Link>
    </div>
  )
}
