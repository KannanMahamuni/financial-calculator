/**
 * useCalculator Hook
 * Manages calculator state, input changes, and calculations
 */

import { useState, useCallback, useMemo, useEffect } from 'react'
import { CalculatorState, ValidationError } from '../lib/types'

/**
 * Custom hook for calculator state management
 *
 * @param initialInputs - Initial calculator inputs
 * @param validator - Function to validate inputs
 * @param calculator - Function to perform calculation
 * @returns Calculator state and handlers
 */
export function useCalculator<TInput, TOutput>(
  initialInputs: TInput,
  validator: (input: TInput) => ValidationError[],
  calculator: (input: TInput) => TOutput
) {
  const [state, setState] = useState<CalculatorState<TInput, TOutput>>({
    inputs: initialInputs,
    results: null,
    errors: [],
    isCalculating: false,
    lastCalculatedAt: null,
  })

  // Validate inputs
  const errors = useMemo(() => validator(state.inputs), [state.inputs, validator])

  // Calculate results when inputs change and are valid
  const results = useMemo(() => {
    if (errors.length > 0) {
      return null
    }
    return calculator(state.inputs)
  }, [state.inputs, errors, calculator])

  // Update state when results or errors change (using effect to avoid infinite loops)
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      results,
      errors,
      lastCalculatedAt: errors.length === 0 ? Date.now() : prev.lastCalculatedAt,
    }))
  }, [results, errors])

  // Handle input changes
  const updateInput = useCallback((updates: Partial<TInput>) => {
    setState((prev) => ({
      ...prev,
      inputs: { ...prev.inputs, ...updates },
      isCalculating: true,
    }))
  }, [])

  // Reset to initial state
  const reset = useCallback(() => {
    setState({
      inputs: initialInputs,
      results: null,
      errors: [],
      isCalculating: false,
      lastCalculatedAt: null,
    })
  }, [initialInputs])

  return {
    ...state,
    errors,
    results,
    updateInput,
    reset,
    isValid: errors.length === 0,
  }
}
