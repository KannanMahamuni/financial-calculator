/**
 * useFeatureFlag Hook
 * Access feature flags throughout the application
 */

import { useContext } from 'react'
import { FeatureFlagContext } from '../context/FeatureFlagContext'

/**
 * Custom hook to access feature flags
 *
 * @returns Feature flag getters and utilities
 */
export function useFeatureFlag() {
  const context = useContext(FeatureFlagContext)

  if (!context) {
    throw new Error('useFeatureFlag must be used within FeatureFlagProvider')
  }

  return {
    isMFCalculatorEnabled: () => context.flags.isMFCalculatorEnabled,
    isNPSCalculatorEnabled: () => context.flags.isNPSCalculatorEnabled,
    isAdvancedAnalysisEnabled: () => context.flags.isAdvancedAnalysisEnabled,
    isCalculatorEnabled: () =>
      context.flags.isMFCalculatorEnabled || context.flags.isNPSCalculatorEnabled,
    flags: context.flags,
  }
}
