/**
 * Feature Flag Context
 * Provides feature flags to the entire application
 */

import React, { createContext, useCallback, useState, useEffect } from 'react'
import { FeatureFlags } from '../lib/types'
import { FEATURE_FLAGS } from '../lib/constants'

/**
 * Feature Flag Context Type
 */
interface IFeatureFlagContext {
  flags: FeatureFlags
  updateFlags: (flags: Partial<FeatureFlags>) => void
}

/**
 * Create Feature Flag Context
 */
export const FeatureFlagContext = createContext<IFeatureFlagContext | undefined>(undefined)

/**
 * Feature Flag Provider Component
 *
 * @param children - React children components
 * @returns JSX element with context provider
 */
export function FeatureFlagProvider({ children }: { children: React.ReactNode }) {
  const [flags, setFlags] = useState<FeatureFlags>({
    isMFCalculatorEnabled: FEATURE_FLAGS.MF_CALCULATOR_ENABLED,
    isNPSCalculatorEnabled: FEATURE_FLAGS.NPS_CALCULATOR_ENABLED,
    isAdvancedAnalysisEnabled: FEATURE_FLAGS.ADVANCED_ANALYSIS_ENABLED,
  })

  // Initialize flags from environment variables
  useEffect(() => {
    setFlags({
      isMFCalculatorEnabled: FEATURE_FLAGS.MF_CALCULATOR_ENABLED,
      isNPSCalculatorEnabled: FEATURE_FLAGS.NPS_CALCULATOR_ENABLED,
      isAdvancedAnalysisEnabled: FEATURE_FLAGS.ADVANCED_ANALYSIS_ENABLED,
    })
  }, [])

  // Update flags
  const updateFlags = useCallback((newFlags: Partial<FeatureFlags>) => {
    setFlags((prev) => ({
      ...prev,
      ...newFlags,
    }))
  }, [])

  return (
    <FeatureFlagContext.Provider value={{ flags, updateFlags }}>
      {children}
    </FeatureFlagContext.Provider>
  )
}
