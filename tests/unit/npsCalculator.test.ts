/**
 * Unit Tests for National Pension Scheme (NPS) Calculator
 */

import { describe, it, expect } from 'vitest'
import {
  calculateNPSCorpus,
  calculateAnnuity,
  calculateCorpusLongevity,
  calculateRequiredMonthlyContribution,
} from '../../../src/lib/calculator/npsCalculator'
import { NPSCalculatorInput } from '../../../src/lib/types'

describe('NPS Calculator', () => {
  describe('calculateNPSCorpus - Accumulation Phase', () => {
    it('should calculate corpus for standard retirement scenario', () => {
      const input: NPSCalculatorInput = {
        monthlyContribution: 5000,
        yearsToRetirement: 25,
        expectedAnnualReturnRate: 8,
      }

      const result = calculateNPSCorpus(input)

      // Total contribution = 5000 × 300 months = 1,500,000
      expect(result.totalContribution).toBe(1500000)
      // Corpus should be significantly higher due to compound interest
      expect(result.totalCorpus).toBeGreaterThan(3000000)
      expect(result.investmentReturns).toBeGreaterThan(1500000)
    })

    it('should calculate monthly and annual annuity correctly', () => {
      const input: NPSCalculatorInput = {
        monthlyContribution: 10000,
        yearsToRetirement: 20,
        expectedAnnualReturnRate: 8,
        withdrawalRateAtRetirement: 4,
      }

      const result = calculateNPSCorpus(input)

      // Monthly annuity should be corpus × 4% / 12
      expect(result.estimatedMonthlyAnnuity).toBeGreaterThan(0)
      // Annual should be 12× monthly
      expect(result.estimatedAnnualAnnuity).toBeCloseTo(
        result.estimatedMonthlyAnnuity * 12,
        2
      )
    })

    it('should handle zero return rate', () => {
      const input: NPSCalculatorInput = {
        monthlyContribution: 5000,
        yearsToRetirement: 10,
        expectedAnnualReturnRate: 0,
      }

      const result = calculateNPSCorpus(input)

      const expectedCorpus = 5000 * 120 // 5000 × 120 months
      expect(result.totalCorpus).toBe(expectedCorpus)
      expect(result.investmentReturns).toBe(0)
    })

    it('should use default withdrawal rate if not provided', () => {
      const input: NPSCalculatorInput = {
        monthlyContribution: 10000,
        yearsToRetirement: 30,
        expectedAnnualReturnRate: 7,
      }

      const result = calculateNPSCorpus(input)

      // Default withdrawal rate is 4%
      const expectedMonthlyAnnuity = (result.totalCorpus * 4) / 100 / 12
      expect(result.estimatedMonthlyAnnuity).toBeCloseTo(expectedMonthlyAnnuity, 2)
    })

    it('should handle custom withdrawal rate', () => {
      const input: NPSCalculatorInput = {
        monthlyContribution: 10000,
        yearsToRetirement: 25,
        expectedAnnualReturnRate: 8,
        withdrawalRateAtRetirement: 5,
      }

      const result = calculateNPSCorpus(input)

      const expectedMonthlyAnnuity = (result.totalCorpus * 5) / 100 / 12
      expect(result.estimatedMonthlyAnnuity).toBeCloseTo(expectedMonthlyAnnuity, 2)
    })

    it('should round to 2 decimal places', () => {
      const input: NPSCalculatorInput = {
        monthlyContribution: 3333,
        yearsToRetirement: 23,
        expectedAnnualReturnRate: 7.5,
      }

      const result = calculateNPSCorpus(input)

      const checkDecimalPlaces = (value: number) => {
        const decimalPart = value % 1
        return decimalPart <= 0.01 || decimalPart >= 0.99
      }

      expect(checkDecimalPlaces(result.totalCorpus)).toBeTruthy()
      expect(checkDecimalPlaces(result.totalContribution)).toBeTruthy()
      expect(checkDecimalPlaces(result.estimatedMonthlyAnnuity)).toBeTruthy()
    })
  })

  describe('calculateNPSCorpus - Edge Cases', () => {
    it('should handle very small monthly contributions', () => {
      const input: NPSCalculatorInput = {
        monthlyContribution: 1,
        yearsToRetirement: 10,
        expectedAnnualReturnRate: 8,
      }

      const result = calculateNPSCorpus(input)

      expect(result.totalCorpus).toBeGreaterThan(0)
      expect(isFinite(result.totalCorpus)).toBeTruthy()
    })

    it('should handle very large contributions', () => {
      const input: NPSCalculatorInput = {
        monthlyContribution: 500000,
        yearsToRetirement: 30,
        expectedAnnualReturnRate: 8,
      }

      const result = calculateNPSCorpus(input)

      expect(result.totalCorpus).toBeGreaterThan(100000000)
      expect(isFinite(result.totalCorpus)).toBeTruthy()
    })

    it('should handle very high return rates', () => {
      const input: NPSCalculatorInput = {
        monthlyContribution: 5000,
        yearsToRetirement: 20,
        expectedAnnualReturnRate: 50,
      }

      const result = calculateNPSCorpus(input)

      expect(result.totalCorpus).toBeGreaterThan(5000000)
      expect(isFinite(result.totalCorpus)).toBeTruthy()
    })

    it('should handle long retirement periods', () => {
      const input: NPSCalculatorInput = {
        monthlyContribution: 10000,
        yearsToRetirement: 50,
        expectedAnnualReturnRate: 8,
      }

      const result = calculateNPSCorpus(input)

      expect(result.totalCorpus).toBeGreaterThan(10000000)
      expect(isFinite(result.totalCorpus)).toBeTruthy()
    })

    it('should handle negative return rates', () => {
      const input: NPSCalculatorInput = {
        monthlyContribution: 5000,
        yearsToRetirement: 5,
        expectedAnnualReturnRate: -10,
      }

      const result = calculateNPSCorpus(input)

      // Even with negative returns, total should be somewhat close to contributions
      expect(result.totalCorpus).toBeGreaterThan(100000) // 5000 × 60 months = 300000
      expect(result.investmentReturns).toBeLessThan(0)
    })
  })

  describe('calculateAnnuity', () => {
    it('should calculate monthly annuity correctly', () => {
      const corpus = 1000000
      const withdrawalRate = 4

      const monthlyAnnuity = calculateAnnuity(corpus, withdrawalRate)

      // Expected: 1000000 × 4% / 12 = 3333.33
      expect(monthlyAnnuity).toBeCloseTo(3333.33, 2)
    })

    it('should handle different withdrawal rates', () => {
      const corpus = 2000000

      const annuity3Pct = calculateAnnuity(corpus, 3)
      const annuity5Pct = calculateAnnuity(corpus, 5)

      expect(annuity5Pct).toBeGreaterThan(annuity3Pct)
      expect(annuity5Pct / annuity3Pct).toBeCloseTo(5 / 3, 1)
    })

    it('should use default 4% withdrawal rate', () => {
      const corpus = 1000000

      const annuityDefault = calculateAnnuity(corpus)
      const annuity4Pct = calculateAnnuity(corpus, 4)

      expect(annuityDefault).toBe(annuity4Pct)
    })
  })

  describe('calculateCorpusLongevity', () => {
    it('should calculate how long corpus lasts with fixed withdrawal', () => {
      const corpus = 1000000
      const monthlyWithdrawal = 5000
      const returnRate = 0

      const months = calculateCorpusLongevity(corpus, monthlyWithdrawal, returnRate)

      // 1000000 / 5000 = 200 months
      expect(months).toBe(200)
    })

    it('should account for investment returns during withdrawal', () => {
      const corpus = 1000000
      const monthlyWithdrawal = 3000
      const returnRate = 4

      const months = calculateCorpusLongevity(corpus, monthlyWithdrawal, returnRate)

      // With 4% return, corpus lasts much longer than without
      expect(months).toBeGreaterThan(1000000 / 3000)
    })

    it('should return Infinity if returns exceed withdrawal', () => {
      const corpus = 1000000
      const monthlyWithdrawal = 2000 // 2.4% annual is less than 4% return
      const returnRate = 4

      const months = calculateCorpusLongevity(corpus, monthlyWithdrawal, returnRate)

      expect(months).toBe(Infinity)
    })

    it('should handle zero withdrawal', () => {
      const corpus = 1000000

      const months = calculateCorpusLongevity(corpus, 0, 4)

      expect(months).toBe(Infinity)
    })
  })

  describe('calculateRequiredMonthlyContribution', () => {
    it('should calculate required monthly contribution for target corpus', () => {
      const targetCorpus = 2000000
      const yearsToRetirement = 20
      const returnRate = 8

      const monthlyContribution = calculateRequiredMonthlyContribution(
        targetCorpus,
        yearsToRetirement,
        returnRate
      )

      expect(monthlyContribution).toBeGreaterThan(0)
      expect(monthlyContribution).toBeLessThan(targetCorpus / (yearsToRetirement * 12))
    })

    it('should verify calculated contribution reaches target', () => {
      const targetCorpus = 1500000
      const yearsToRetirement = 25
      const returnRate = 8

      const monthlyContribution = calculateRequiredMonthlyContribution(
        targetCorpus,
        yearsToRetirement,
        returnRate
      )

      // Verify by calculating corpus with this contribution
      const verifyInput: NPSCalculatorInput = {
        monthlyContribution,
        yearsToRetirement,
        expectedAnnualReturnRate: returnRate,
      }

      const result = calculateNPSCorpus(verifyInput)

      expect(result.totalCorpus).toBeCloseTo(targetCorpus, -3) // Within ±1000
    })

    it('should handle zero return rate', () => {
      const targetCorpus = 1200000
      const yearsToRetirement = 20
      const returnRate = 0

      const monthlyContribution = calculateRequiredMonthlyContribution(
        targetCorpus,
        yearsToRetirement,
        returnRate
      )

      // With 0% return, monthly = corpus / (years × 12)
      const expected = targetCorpus / (yearsToRetirement * 12)
      expect(monthlyContribution).toBeCloseTo(expected, 2)
    })
  })

  describe('Retirement Analysis', () => {
    it('should provide complete retirement analysis', () => {
      const input: NPSCalculatorInput = {
        monthlyContribution: 15000,
        yearsToRetirement: 30,
        expectedAnnualReturnRate: 8,
        withdrawalRateAtRetirement: 4,
      }

      const result = calculateNPSCorpus(input)

      expect(result.retirementAnalysis).toBeDefined()
      expect(result.retirementAnalysis.corpusAtRetirement).toBe(result.totalCorpus)
      expect(result.retirementAnalysis.monthlyIncome).toBe(
        result.estimatedMonthlyAnnuity
      )
      expect(result.retirementAnalysis.annualIncome).toBe(result.estimatedAnnualAnnuity)
    })
  })

  describe('Accuracy & Precision', () => {
    it('should maintain deterministic calculations', () => {
      const input: NPSCalculatorInput = {
        monthlyContribution: 7500,
        yearsToRetirement: 22,
        expectedAnnualReturnRate: 7.5,
      }

      const result1 = calculateNPSCorpus(input)
      const result2 = calculateNPSCorpus(input)

      expect(result1.totalCorpus).toBe(result2.totalCorpus)
      expect(result1.estimatedMonthlyAnnuity).toBe(result2.estimatedMonthlyAnnuity)
    })
  })
})
