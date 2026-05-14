/**
 * NPS Calculator Component
 * Container component for National Pension Scheme calculator
 */

import React, { useMemo } from 'react'
import { NPSCalculatorInput } from '../../lib/types'
import { calculateNPSCorpus, validateNPSInput } from '../../lib/calculator/npsCalculator'
import { InputForm } from './InputForm'
import { ResultDisplay } from './ResultDisplay'
import { useCalculator } from '../../hooks/useCalculator'
import { useDebounce } from '../../hooks/useDebounce'
import { PERFORMANCE, DEFAULT_NPS_INPUT } from '../../lib/constants'

export function NPSCalculator() {
  const calculator = useCalculator(
    DEFAULT_NPS_INPUT,
    (input) => validateNPSInput(input),
    (input) => calculateNPSCorpus(input)
  )

  // Debounce input changes
  const debouncedInputs = useDebounce(calculator.inputs, PERFORMANCE.CALCULATION_DEBOUNCE_MS)

  // Recalculate when debounced inputs change
  const results = useMemo(() => {
    if (calculator.errors.length > 0) {
      return null
    }
    try {
      return calculateNPSCorpus(debouncedInputs)
    } catch (error) {
      console.error('NPS Calculation error:', error)
      return null
    }
  }, [debouncedInputs, calculator.errors])

  // Memoize input fields to prevent recreation on every render
  const inputFields = useMemo(() => [
    {
      name: 'monthlyContribution',
      label: 'Monthly Contribution (₹)',
      placeholder: 'Enter amount',
      type: 'number' as const,
      value: calculator.inputs.monthlyContribution,
      min: 100,
      max: 500000,
      step: 500,
    },
    {
      name: 'yearsToRetirement',
      label: 'Years to Retirement',
      placeholder: 'e.g., 25',
      type: 'number' as const,
      value: calculator.inputs.yearsToRetirement,
      min: 1,
      max: 70,
      step: 1,
    },
    {
      name: 'expectedAnnualReturnRate',
      label: 'Expected Annual Return (%)',
      placeholder: 'e.g., 8',
      type: 'number' as const,
      value: calculator.inputs.expectedAnnualReturnRate,
      min: 1,
      max: 50,
      step: 0.5,
    },
    {
      name: 'withdrawalRateAtRetirement',
      label: 'Withdrawal Rate at Retirement (%)',
      placeholder: 'Default: 4%',
      type: 'number' as const,
      value: calculator.inputs.withdrawalRateAtRetirement || 4,
      min: 0.1,
      max: 100,
      step: 0.5,
    },
  ], [calculator.inputs])

  // Memoize result items to prevent recreation on every render
  const resultItems = useMemo(() => results
    ? [
        {
          label: 'Total Corpus',
          value: results.totalCorpus,
          format: 'currency' as const,
          description: 'Amount at retirement',
        },
        {
          label: 'Total Contribution',
          value: results.totalContribution,
          format: 'currency' as const,
          description: 'All your contributions',
        },
        {
          label: 'Investment Returns',
          value: results.investmentReturns,
          format: 'currency' as const,
          description: 'Corpus gains',
        },
        {
          label: 'Returns %',
          value: results.returnsPercentage,
          format: 'percentage' as const,
          description: 'Return on investment',
        },
        {
          label: 'Monthly Annuity',
          value: results.estimatedMonthlyAnnuity,
          format: 'currency' as const,
          description: 'Post-retirement income',
        },
        {
          label: 'Annual Annuity',
          value: results.estimatedAnnualAnnuity,
          format: 'currency' as const,
          description: 'Yearly retirement income',
        },
      ]
    : [], [results])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">NPS Calculator</h1>
        <p className="text-gray-600 mt-2">
          Plan your National Pension Scheme contributions and calculate your retirement corpus and
          annuity.
        </p>
      </div>

      <InputForm
        fields={inputFields}
        onFieldChange={(name, value) => calculator.updateInput({ [name]: value } as any)}
        errors={calculator.errors}
        onCalculate={() => {}}
        onReset={() => calculator.reset()}
      />

      <ResultDisplay
        title="Retirement Planning Results"
        subtitle="Your NPS projection"
        results={resultItems}
        isVisible={results !== null && calculator.errors.length === 0}
      />
    </div>
  )
}
