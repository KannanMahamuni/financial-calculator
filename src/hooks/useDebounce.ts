/**
 * useDebounce Hook
 * Debounces input changes to reduce excessive recalculations
 */

import { useEffect, useState } from 'react'

/**
 * Custom hook to debounce a value
 *
 * @param value - Value to debounce
 * @param delayMs - Debounce delay in milliseconds
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delayMs: number = 100): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delayMs)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delayMs])

  return debouncedValue
}
