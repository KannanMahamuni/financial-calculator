/**
 * Router Component
 * Application routing configuration
 */

import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from './common/Layout'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { CalculatorPage } from './pages/CalculatorPage'
import { MFCalculator } from './calculator/MFCalculator'
import { NPSCalculator } from './calculator/NPSCalculator'
import { FeatureFlagGuard } from './FeatureFlagGuard'
import { useFeatureFlag } from '../hooks/useFeatureFlag'
import { ROUTES } from '../lib/constants'

export default function AppRouter() {
  const { isMFCalculatorEnabled, isNPSCalculatorEnabled } = useFeatureFlag()

  return (
    <Layout>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />

        <Route
          path={ROUTES.MF_CALCULATOR}
          element={
            <FeatureFlagGuard flagCheck={isMFCalculatorEnabled}>
              <CalculatorPage title="MF Calculator">
                <MFCalculator />
              </CalculatorPage>
            </FeatureFlagGuard>
          }
        />

        <Route
          path={ROUTES.NPS_CALCULATOR}
          element={
            <FeatureFlagGuard flagCheck={isNPSCalculatorEnabled}>
              <CalculatorPage title="NPS Calculator">
                <NPSCalculator />
              </CalculatorPage>
            </FeatureFlagGuard>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  )
}
