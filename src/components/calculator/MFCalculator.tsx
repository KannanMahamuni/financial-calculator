/**
 * MF Calculator Component
 * Container component for Mutual Fund calculator
 */

import React, { useMemo } from 'react'
import { MFCalculatorInput } from '../../lib/types'
import { calculateMFReturns, validateMFInput } from '../../lib/calculator/mfCalculator'
import { InputForm } from './InputForm'
import { ResultDisplay } from './ResultDisplay'
import { useCalculator } from '../../hooks/useCalculator'
import { useDebounce } from '../../hooks/useDebounce'
import { PERFORMANCE, DEFAULT_MF_INPUT } from '../../lib/constants'

export function MFCalculator() {
  const calculator = useCalculator(
    DEFAULT_MF_INPUT,
    (input) => validateMFInput(input),
    (input) => calculateMFReturns(input)
  )

  // Debounce input changes
  const debouncedInputs = useDebounce(calculator.inputs, PERFORMANCE.CALCULATION_DEBOUNCE_MS)

  // Recalculate when debounced inputs change
  const results = useMemo(() => {
    if (calculator.errors.length > 0) {
      return null
    }
    try {
      return calculateMFReturns(debouncedInputs)
    } catch (error) {
      console.error('MF Calculation error:', error)
      return null
    }
  }, [debouncedInputs, calculator.errors])

  // Memoize input fields to prevent recreation on every render
  const inputFields = useMemo(() => [
    {
      name: 'principalAmount',
      label: 'Initial Investment (₹)',
      placeholder: 'Enter amount',
      type: 'number' as const,
      value: calculator.inputs.principalAmount,
      min: 100,
      max: 100000000,
      step: 1000,
    },
    {
      name: 'monthlyContribution',
      label: 'Monthly SIP (₹)',
      placeholder: 'Optional',
      type: 'number' as const,
      value: calculator.inputs.monthlyContribution || '',
      min: 0,
      max: 500000,
      step: 500,
    },
    {
      name: 'annualReturnRate',
      label: 'Expected Annual Return (%)',
      placeholder: 'e.g., 12',
      type: 'number' as const,
      value: calculator.inputs.annualReturnRate,
      min: -50,
      max: 100,
      step: 0.5,
    },
    {
      name: 'investmentPeriodYears',
      label: 'Investment Period (Years)',
      placeholder: 'e.g., 10',
      type: 'number' as const,
      value: calculator.inputs.investmentPeriodYears,
      min: 1,
      max: 70,
      step: 1,
    },
  ], [calculator.inputs])

  // Memoize result items to prevent recreation on every render
  const resultItems = useMemo(() => results
    ? [
        {
          label: 'Final Value',
          value: results.finalValue,
          format: 'currency' as const,
          description: 'Total amount at maturity',
        },
        {
          label: 'Total Investment',
          value: results.totalInvestment,
          format: 'currency' as const,
          description: 'Principal + SIP contributions',
        },
        {
          label: 'Profit/Gain',
          value: results.profitGain,
          format: 'currency' as const,
          description: 'Investment returns',
        },
        {
          label: 'Gain %',
          value: results.gainPercentage,
          format: 'percentage' as const,
          description: 'Returns percentage',
        },
      ]
    : [], [results])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mutual Fund Calculator</h1>
        <p className="text-gray-600 mt-2">
          Calculate your mutual fund returns based on your investment amount, period, and expected
          returns.
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
        title="Calculation Results"
        subtitle="Your projected returns"
        results={resultItems}
        isVisible={results !== null && calculator.errors.length === 0}
      />
    </div>
  )
}
