/**
 * CalculatorPage Component
 * Wrapper page for calculator display
 */

import React from 'react'

interface CalculatorPageProps {
  children: React.ReactNode
  title: string
}

export function CalculatorPage({ children, title }: CalculatorPageProps) {
  return <div className="space-y-6">{children}</div>
}
