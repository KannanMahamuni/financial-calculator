/**
 * InputForm Component
 * Generic input form for calculator inputs
 */

import React from 'react'
import { ValidationError } from '../../lib/types'

interface InputField {
  name: string
  label: string
  placeholder: string
  type: 'number' | 'text'
  value: number | string
  min?: number
  max?: number
  step?: number
}

interface InputFormProps {
  fields: InputField[]
  onFieldChange: (fieldName: string, value: number | string) => void
  errors: ValidationError[]
  onCalculate: () => void
  onReset: () => void
  isLoading?: boolean
}

export function InputForm({
  fields,
  onFieldChange,
  errors,
  onCalculate,
  onReset,
  isLoading = false,
}: InputFormProps) {
  const fieldErrors: Record<string, ValidationError> = {}
  errors.forEach((error) => {
    fieldErrors[error.field] = error
  })

  const handleChange = (fieldName: string, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value)
    onFieldChange(fieldName, isNaN(numValue) ? value : numValue)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => {
          const error = fieldErrors[field.name]
          return (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {field.label}
              </label>
              <input
                id={field.name}
                type={field.type}
                placeholder={field.placeholder}
                value={field.value}
                onChange={(e) => handleChange(field.name, e.target.value)}
                min={field.min}
                max={field.max}
                step={field.step}
                disabled={isLoading}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                  error
                    ? 'border-error-500 focus:ring-error-500'
                    : 'border-gray-300 focus:border-primary-500'
                } disabled:bg-gray-50 disabled:cursor-not-allowed`}
              />
              {error && (
                <p className="mt-1 text-sm text-error-600 flex items-center gap-1">
                  <span>⚠</span> {error.message}
                </p>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={onCalculate}
          disabled={Object.keys(fieldErrors).length > 0 || isLoading}
          className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading && <span className="animate-spin">⟳</span>}
          Calculate
        </button>
        <button
          onClick={onReset}
          disabled={isLoading}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
