/**
 * Unit Tests for Input Validators
 */

import { describe, it, expect } from 'vitest'
import {
  validateMFInput,
  validateNPSInput,
  isMFInputValid,
  isNPSInputValid,
  sanitizeNumericInput,
} from '../../../src/lib/calculator/validators'
import { MFCalculatorInput, NPSCalculatorInput, ValidationError } from '../../../src/lib/types'

describe('MF Input Validators', () => {
  describe('validateMFInput', () => {
    it('should validate correct MF input', () => {
      const input: MFCalculatorInput = {
        principalAmount: 100000,
        annualReturnRate: 12,
        investmentPeriodYears: 5,
      }

      const errors = validateMFInput(input)

      expect(errors).toHaveLength(0)
    })

    it('should validate MF input with SIP', () => {
      const input: MFCalculatorInput = {
        principalAmount: 50000,
        monthlyContribution: 5000,
        annualReturnRate: 12,
        investmentPeriodYears: 10,
      }

      const errors = validateMFInput(input)

      expect(errors).toHaveLength(0)
    })

    it('should reject missing principal amount', () => {
      const input: any = {
        annualReturnRate: 12,
        investmentPeriodYears: 5,
      }

      const errors = validateMFInput(input)

      expect(errors).toContainEqual(
        expect.objectContaining({
          field: 'principalAmount',
        })
      )
    })

    it('should reject negative principal amount', () => {
      const input: MFCalculatorInput = {
        principalAmount: -50000,
        annualReturnRate: 12,
        investmentPeriodYears: 5,
      }

      const errors = validateMFInput(input)

      expect(errors).toContainEqual(
        expect.objectContaining({
          field: 'principalAmount',
          message: expect.stringContaining('positive'),
        })
      )
    })

    it('should reject principal exceeding max limit', () => {
      const input: MFCalculatorInput = {
        principalAmount: 100000001,
        annualReturnRate: 12,
        investmentPeriodYears: 5,
      }

      const errors = validateMFInput(input)

      expect(errors).toContainEqual(
        expect.objectContaining({
          field: 'principalAmount',
        })
      )
    })

    it('should reject negative monthly contribution', () => {
      const input: MFCalculatorInput = {
        principalAmount: 100000,
        monthlyContribution: -5000,
        annualReturnRate: 12,
        investmentPeriodYears: 5,
      }

      const errors = validateMFInput(input)

      expect(errors).toContainEqual(
        expect.objectContaining({
          field: 'monthlyContribution',
        })
      )
    })

    it('should reject out-of-range return rate', () => {
      const input: MFCalculatorInput = {
        principalAmount: 100000,
        annualReturnRate: 150,
        investmentPeriodYears: 5,
      }

      const errors = validateMFInput(input)

      expect(errors).toContainEqual(
        expect.objectContaining({
          field: 'annualReturnRate',
        })
      )
    })

    it('should reject invalid period', () => {
      const input: MFCalculatorInput = {
        principalAmount: 100000,
        annualReturnRate: 12,
        investmentPeriodYears: 100,
      }

      const errors = validateMFInput(input)

      expect(errors).toContainEqual(
        expect.objectContaining({
          field: 'investmentPeriodYears',
        })
      )
    })

    it('should reject NaN values', () => {
      const input: any = {
        principalAmount: NaN,
        annualReturnRate: 12,
        investmentPeriodYears: 5,
      }

      const errors = validateMFInput(input)

      expect(errors.length).toBeGreaterThan(0)
    })

    it('should allow zero monthly contribution', () => {
      const input: MFCalculatorInput = {
        principalAmount: 100000,
        monthlyContribution: 0,
        annualReturnRate: 12,
        investmentPeriodYears: 5,
      }

      const errors = validateMFInput(input)

      expect(errors).toHaveLength(0)
    })
  })

  describe('isMFInputValid', () => {
    it('should return true for valid input', () => {
      const input: MFCalculatorInput = {
        principalAmount: 100000,
        annualReturnRate: 12,
        investmentPeriodYears: 5,
      }

      expect(isMFInputValid(input)).toBe(true)
    })

    it('should return false for invalid input', () => {
      const input: MFCalculatorInput = {
        principalAmount: -100000,
        annualReturnRate: 12,
        investmentPeriodYears: 5,
      }

      expect(isMFInputValid(input)).toBe(false)
    })
  })
})

describe('NPS Input Validators', () => {
  describe('validateNPSInput', () => {
    it('should validate correct NPS input', () => {
      const input: NPSCalculatorInput = {
        monthlyContribution: 5000,
        yearsToRetirement: 25,
        expectedAnnualReturnRate: 8,
      }

      const errors = validateNPSInput(input)

      expect(errors).toHaveLength(0)
    })

    it('should validate NPS input with custom withdrawal rate', () => {
      const input: NPSCalculatorInput = {
        monthlyContribution: 10000,
        yearsToRetirement: 30,
        expectedAnnualReturnRate: 8,
        withdrawalRateAtRetirement: 5,
      }

      const errors = validateNPSInput(input)

      expect(errors).toHaveLength(0)
    })

    it('should reject missing monthly contribution', () => {
      const input: any = {
        yearsToRetirement: 25,
        expectedAnnualReturnRate: 8,
      }

      const errors = validateNPSInput(input)

      expect(errors).toContainEqual(
        expect.objectContaining({
          field: 'monthlyContribution',
        })
      )
    })

    it('should reject zero or negative monthly contribution', () => {
      const input: NPSCalculatorInput = {
        monthlyContribution: 0,
        yearsToRetirement: 25,
        expectedAnnualReturnRate: 8,
      }

      const errors = validateNPSInput(input)

      expect(errors.length).toBeGreaterThan(0)
    })

    it('should reject contribution exceeding max limit', () => {
      const input: NPSCalculatorInput = {
        monthlyContribution: 600000,
        yearsToRetirement: 25,
        expectedAnnualReturnRate: 8,
      }

      const errors = validateNPSInput(input)

      expect(errors.length).toBeGreaterThan(0)
    })

    it('should reject invalid years to retirement', () => {
      const input: NPSCalculatorInput = {
        monthlyContribution: 5000,
        yearsToRetirement: 100,
        expectedAnnualReturnRate: 8,
      }

      const errors = validateNPSInput(input)

      expect(errors).toContainEqual(
        expect.objectContaining({
          field: 'yearsToRetirement',
        })
      )
    })

    it('should reject out-of-range return rate', () => {
      const input: NPSCalculatorInput = {
        monthlyContribution: 5000,
        yearsToRetirement: 25,
        expectedAnnualReturnRate: 120,
      }

      const errors = validateNPSInput(input)

      expect(errors).toContainEqual(
        expect.objectContaining({
          field: 'expectedAnnualReturnRate',
        })
      )
    })

    it('should reject invalid withdrawal rate', () => {
      const input: NPSCalculatorInput = {
        monthlyContribution: 5000,
        yearsToRetirement: 25,
        expectedAnnualReturnRate: 8,
        withdrawalRateAtRetirement: 150,
      }

      const errors = validateNPSInput(input)

      expect(errors.length).toBeGreaterThan(0)
    })
  })

  describe('isNPSInputValid', () => {
    it('should return true for valid input', () => {
      const input: NPSCalculatorInput = {
        monthlyContribution: 5000,
        yearsToRetirement: 25,
        expectedAnnualReturnRate: 8,
      }

      expect(isNPSInputValid(input)).toBe(true)
    })

    it('should return false for invalid input', () => {
      const input: NPSCalculatorInput = {
        monthlyContribution: 0,
        yearsToRetirement: 25,
        expectedAnnualReturnRate: 8,
      }

      expect(isNPSInputValid(input)).toBe(false)
    })
  })
})

describe('Numeric Input Sanitization', () => {
  describe('sanitizeNumericInput', () => {
    it('should parse valid numeric string', () => {
      expect(sanitizeNumericInput('12345')).toBe(12345)
    })

    it('should parse decimal values', () => {
      expect(sanitizeNumericInput('123.45')).toBe(123.45)
    })

    it('should handle negative values', () => {
      expect(sanitizeNumericInput('-100')).toBe(-100)
    })

    it('should return null for non-numeric strings', () => {
      expect(sanitizeNumericInput('abc')).toBeNull()
    })

    it('should clamp to minimum', () => {
      expect(sanitizeNumericInput('5', 10)).toBe(10)
    })

    it('should clamp to maximum', () => {
      expect(sanitizeNumericInput('150', undefined, 100)).toBe(100)
    })

    it('should clamp between min and max', () => {
      expect(sanitizeNumericInput('50', 10, 100)).toBe(50)
      expect(sanitizeNumericInput('5', 10, 100)).toBe(10)
      expect(sanitizeNumericInput('150', 10, 100)).toBe(100)
    })

    it('should handle NaN input', () => {
      expect(sanitizeNumericInput(NaN)).toBeNull()
    })

    it('should handle undefined input', () => {
      expect(sanitizeNumericInput(undefined)).toBeNull()
    })
  })
})
