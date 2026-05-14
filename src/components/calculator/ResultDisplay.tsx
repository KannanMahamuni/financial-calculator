/**
 * ResultDisplay Component
 * Display calculation results
 */

import React from 'react'
import { formatCurrency, formatPercentage } from '../../lib/config'

interface ResultItem {
  label: string
  value: number | string
  format?: 'currency' | 'percentage' | 'number' | 'text'
  description?: string
}

interface ResultDisplayProps {
  title: string
  subtitle?: string
  results: ResultItem[]
  isVisible: boolean
}

export function ResultDisplay({ title, subtitle, results, isVisible }: ResultDisplayProps) {
  const formatValue = (value: number | string, format?: string): string => {
    if (typeof value === 'string') {
      return value
    }

    switch (format) {
      case 'currency':
        return formatCurrency(value)
      case 'percentage':
        return formatPercentage(value)
      case 'number':
        return new Intl.NumberFormat('en-IN', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(value)
      default:
        return value.toString()
    }
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="bg-gradient-to-br from-success-50 to-blue-50 rounded-lg shadow-md p-6 mt-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((result, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <p className="text-sm text-gray-600 font-medium mb-1">{result.label}</p>
            <p className="text-2xl font-bold text-primary-600">
              {formatValue(result.value, result.format)}
            </p>
            {result.description && (
              <p className="text-xs text-gray-500 mt-2">{result.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
