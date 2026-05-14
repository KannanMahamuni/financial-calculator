/**
 * FeatureFlagGuard Component
 * Protects routes based on feature flags
 */

import React from 'react'
import { useFeatureFlag } from '../../hooks/useFeatureFlag'

interface FeatureFlagGuardProps {
  flagCheck: () => boolean
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function FeatureFlagGuard({
  flagCheck,
  children,
  fallback = <div className="text-center py-8 text-gray-600">This feature is currently unavailable.</div>,
}: FeatureFlagGuardProps) {
  return flagCheck() ? <>{children}</> : <>{fallback}</>
}
