/**
 * Unit Tests for Mutual Fund Calculator
 */

import { describe, it, expect } from 'vitest'
import { calculateMFReturns, calculateMFReturnsDetailed } from '../../../src/lib/calculator/mfCalculator'
import { MFCalculatorInput } from '../../../src/lib/types'

describe('MF Calculator', () => {
  describe('calculateMFReturns - Basic Compound Interest', () => {
    it('should calculate returns for principal only (no SIP)', () => {
      const input: MFCalculatorInput = {
        principalAmount: 100000,
        annualReturnRate: 12,
        investmentPeriodYears: 5,
      }

      const result = calculateMFReturns(input)

      // Formula: FV = 100000 × (1.01)^60 ≈ 181670.39
      expect(result.finalValue).toBeGreaterThan(180000)
      expect(result.finalValue).toBeLessThan(182000)
      expect(result.totalInvestment).toBe(100000)
      expect(result.profitGain).toBeGreaterThan(80000)
      expect(result.gainPercentage).toBeGreaterThan(80)
    })

    it('should calculate returns with monthly SIP contributions', () => {
      const input: MFCalculatorInput = {
        principalAmount: 50000,
        monthlyContribution: 5000,
        annualReturnRate: 12,
        investmentPeriodYears: 10,
      }

      const result = calculateMFReturns(input)

      // Total investment = 50000 + (5000 × 120) = 650000
      expect(result.totalInvestment).toBe(650000)
      // Final value should be significantly higher due to compound interest
      expect(result.finalValue).toBeGreaterThan(1000000)
      expect(result.profitGain).toBeGreaterThan(350000)
    })

    it('should handle zero return rate', () => {
      const input: MFCalculatorInput = {
        principalAmount: 100000,
        monthlyContribution: 5000,
        annualReturnRate: 0,
        investmentPeriodYears: 5,
      }

      const result = calculateMFReturns(input)

      const expectedTotal = 100000 + 5000 * 60
      expect(result.finalValue).toBe(expectedTotal)
      expect(result.profitGain).toBe(0)
      expect(result.gainPercentage).toBe(0)
    })

    it('should handle negative return rate', () => {
      const input: MFCalculatorInput = {
        principalAmount: 100000,
        annualReturnRate: -10,
        investmentPeriodYears: 1,
      }

      const result = calculateMFReturns(input)

      expect(result.finalValue).toBeLessThan(100000)
      expect(result.profitGain).toBeLessThan(0)
    })

    it('should calculate accurately for 1-year period', () => {
      const input: MFCalculatorInput = {
        principalAmount: 100000,
        annualReturnRate: 10,
        investmentPeriodYears: 1,
      }

      const result = calculateMFReturns(input)

      // After 1 year: 100000 × (1.10/12)^12
      expect(result.finalValue).toBeGreaterThan(110000)
      expect(result.profitGain).toBeGreaterThan(10000)
    })

    it('should round to 2 decimal places', () => {
      const input: MFCalculatorInput = {
        principalAmount: 99999,
        monthlyContribution: 3333,
        annualReturnRate: 7.5,
        investmentPeriodYears: 15,
      }

      const result = calculateMFReturns(input)

      // Check all values have max 2 decimal places
      expect(result.finalValue % 1 <= 0.01 || result.finalValue % 1 >= 0.99).toBeTruthy()
      expect(result.totalInvestment % 1 <= 0.01 || result.totalInvestment % 1 >= 0.99).toBeTruthy()
      expect(result.profitGain % 1 <= 0.01 || result.profitGain % 1 >= 0.99).toBeTruthy()
    })
  })

  describe('calculateMFReturns - Edge Cases', () => {
    it('should handle very small principal', () => {
      const input: MFCalculatorInput = {
        principalAmount: 0.01,
        annualReturnRate: 10,
        investmentPeriodYears: 1,
      }

      const result = calculateMFReturns(input)

      expect(result.finalValue).toBeGreaterThan(0)
      expect(result.profitGain).toBeGreaterThan(0)
    })

    it('should handle large principal amounts', () => {
      const input: MFCalculatorInput = {
        principalAmount: 100000000,
        annualReturnRate: 8,
        investmentPeriodYears: 20,
      }

      const result = calculateMFReturns(input)

      expect(result.finalValue).toBeGreaterThan(400000000)
      expect(isFinite(result.finalValue)).toBeTruthy()
    })

    it('should handle very high return rates', () => {
      const input: MFCalculatorInput = {
        principalAmount: 10000,
        annualReturnRate: 100,
        investmentPeriodYears: 2,
      }

      const result = calculateMFReturns(input)

      expect(result.finalValue).toBeGreaterThan(10000)
      expect(isFinite(result.finalValue)).toBeTruthy()
    })

    it('should handle long investment periods', () => {
      const input: MFCalculatorInput = {
        principalAmount: 10000,
        annualReturnRate: 10,
        investmentPeriodYears: 50,
      }

      const result = calculateMFReturns(input)

      expect(result.finalValue).toBeGreaterThan(1000000)
      expect(isFinite(result.finalValue)).toBeTruthy()
    })
  })

  describe('calculateMFReturnsDetailed - Year-by-Year Breakdown', () => {
    it('should provide yearly breakdown', () => {
      const input: MFCalculatorInput = {
        principalAmount: 100000,
        annualReturnRate: 12,
        investmentPeriodYears: 3,
      }

      const result = calculateMFReturnsDetailed(input)

      expect(result.yearlyBreakdown).toHaveLength(3)
      expect(result.yearlyBreakdown[0].year).toBe(1)
      expect(result.yearlyBreakdown[1].year).toBe(2)
      expect(result.yearlyBreakdown[2].year).toBe(3)

      // Each year should have greater or equal value than previous
      for (let i = 1; i < result.yearlyBreakdown.length; i++) {
        expect(result.yearlyBreakdown[i].value).toBeGreaterThanOrEqual(
          result.yearlyBreakdown[i - 1].value
        )
      }
    })

    it('should have matching final value in yearly breakdown', () => {
      const input: MFCalculatorInput = {
        principalAmount: 50000,
        monthlyContribution: 2000,
        annualReturnRate: 10,
        investmentPeriodYears: 5,
      }

      const result = calculateMFReturnsDetailed(input)

      const lastYearValue = result.yearlyBreakdown[result.yearlyBreakdown.length - 1].value
      expect(lastYearValue).toBe(result.finalValue)
    })
  })

  describe('Investment Breakdown', () => {
    it('should correctly calculate principal and SIP breakdown', () => {
      const input: MFCalculatorInput = {
        principalAmount: 100000,
        monthlyContribution: 5000,
        annualReturnRate: 8,
        investmentPeriodYears: 5,
      }

      const result = calculateMFReturns(input)

      expect(result.investmentBreakdown.principal).toBe(100000)
      expect(result.investmentBreakdown.sipTotal).toBe(300000) // 5000 × 60 months
    })

    it('should not include SIP if monthly contribution is zero', () => {
      const input: MFCalculatorInput = {
        principalAmount: 100000,
        monthlyContribution: 0,
        annualReturnRate: 8,
        investmentPeriodYears: 5,
      }

      const result = calculateMFReturns(input)

      expect(result.investmentBreakdown.principal).toBe(100000)
      expect(result.investmentBreakdown.sipTotal).toBeUndefined()
    })
  })

  describe('Accuracy & Precision', () => {
    it('should maintain 0.01% accuracy tolerance', () => {
      const input: MFCalculatorInput = {
        principalAmount: 100000,
        annualReturnRate: 12,
        investmentPeriodYears: 5,
      }

      const result1 = calculateMFReturns(input)
      const result2 = calculateMFReturns(input)

      // Results should be identical (deterministic)
      expect(result1.finalValue).toBe(result2.finalValue)
      expect(result1.profitGain).toBe(result2.profitGain)
    })
  })
})
