/**
 * Input Validation Functions for Calculators
 */

import {
  MFCalculatorInput,
  NPSCalculatorInput,
  ValidationError,
  INPUT_CONSTRAINTS,
} from '../types';
import { ERROR_MESSAGES, VALIDATION_RULES } from '../constants';

/**
 * Helper: Add error for missing/invalid numeric field
 */
function addNumericFieldError(
  errors: ValidationError[],
  value: unknown,
  field: string,
  isRequired = true
): void {
  if (value === null || value === undefined) {
    if (isRequired) {
      errors.push({
        field,
        message: ERROR_MESSAGES.MISSING_REQUIRED_FIELD,
      });
    }
  } else if (isNaN(value)) {
    errors.push({
      field,
      message: ERROR_MESSAGES.INVALID_NUMBER,
      value,
    });
  }
}

/**
 * Helper: Add error if value is outside range
 */
function addRangeError(
  errors: ValidationError[],
  value: number,
  field: string,
  min: number,
  max: number,
  unit = ''
): void {
  if (value < min || value > max) {
    const unitSuffix = unit ? ` (${unit})` : '';
    errors.push({
      field,
      message: `${ERROR_MESSAGES.OUT_OF_RANGE} (Range: ${min} to ${max}${unitSuffix})`,
      value,
    });
  }
}

/**
 * Helper: Add error if value is negative
 */
function addNegativeError(errors: ValidationError[], value: number, field: string): void {
  if (value < 0) {
    errors.push({
      field,
      message: ERROR_MESSAGES.NEGATIVE_VALUE,
      value,
    });
  }
}

/**
 * Validate Mutual Fund Calculator Input
 *
 * @param input - MF calculator input to validate
 * @returns Array of validation errors (empty if valid)
 */
export function validateMFInput(input: MFCalculatorInput): ValidationError[] {
  const errors: ValidationError[] = [];

  // Principal Amount Validation
  addNumericFieldError(errors, input.principalAmount, 'principalAmount', true);
  if (!isNaN(input.principalAmount) && input.principalAmount !== null && input.principalAmount !== undefined) {
    addNegativeError(errors, input.principalAmount, 'principalAmount');
    addRangeError(errors, input.principalAmount, 'principalAmount', 0, VALIDATION_RULES.MF_PRINCIPAL_MAX, `Max: ₹${VALIDATION_RULES.MF_PRINCIPAL_MAX}`);
  }

  // Monthly Contribution Validation (optional)
  if (input.monthlyContribution !== undefined && input.monthlyContribution !== null) {
    addNumericFieldError(errors, input.monthlyContribution, 'monthlyContribution', false);
    if (!isNaN(input.monthlyContribution)) {
      addNegativeError(errors, input.monthlyContribution, 'monthlyContribution');
      addRangeError(errors, input.monthlyContribution, 'monthlyContribution', 0, VALIDATION_RULES.MF_MONTHLY_CONTRIBUTION_MAX, `Max: ₹${VALIDATION_RULES.MF_MONTHLY_CONTRIBUTION_MAX}`);
    }
  }

  // Annual Return Rate Validation
  addNumericFieldError(errors, input.annualReturnRate, 'annualReturnRate', true);
  if (!isNaN(input.annualReturnRate) && input.annualReturnRate !== null && input.annualReturnRate !== undefined) {
    addRangeError(errors, input.annualReturnRate, 'annualReturnRate', VALIDATION_RULES.RETURN_RATE_MIN, VALIDATION_RULES.RETURN_RATE_MAX, '%');
  }

  // Investment Period Validation
  addNumericFieldError(errors, input.investmentPeriodYears, 'investmentPeriodYears', true);
  if (!isNaN(input.investmentPeriodYears) && input.investmentPeriodYears !== null && input.investmentPeriodYears !== undefined) {
    addRangeError(errors, input.investmentPeriodYears, 'investmentPeriodYears', VALIDATION_RULES.YEARS_MIN, VALIDATION_RULES.YEARS_MAX, 'years');
  }

  return errors;
}

/**
 * Validate National Pension Scheme (NPS) Calculator Input
 *
 * @param input - NPS calculator input to validate
 * @returns Array of validation errors (empty if valid)
 */
export function validateNPSInput(input: NPSCalculatorInput): ValidationError[] {
  const errors: ValidationError[] = [];

  // Monthly Contribution Validation
  addNumericFieldError(errors, input.monthlyContribution, 'monthlyContribution', true);
  if (!isNaN(input.monthlyContribution) && input.monthlyContribution !== null && input.monthlyContribution !== undefined) {
    if (input.monthlyContribution <= 0) {
      errors.push({
        field: 'monthlyContribution',
        message: 'Monthly contribution must be positive',
        value: input.monthlyContribution,
      });
    } else {
      addRangeError(errors, input.monthlyContribution, 'monthlyContribution', 0, VALIDATION_RULES.NPS_MONTHLY_MAX, `Max: ₹${VALIDATION_RULES.NPS_MONTHLY_MAX}`);
    }
  }

  // Years to Retirement Validation
  addNumericFieldError(errors, input.yearsToRetirement, 'yearsToRetirement', true);
  if (!isNaN(input.yearsToRetirement) && input.yearsToRetirement !== null && input.yearsToRetirement !== undefined) {
    addRangeError(errors, input.yearsToRetirement, 'yearsToRetirement', VALIDATION_RULES.YEARS_MIN, VALIDATION_RULES.YEARS_MAX, 'years');
  }

  // Expected Annual Return Rate Validation
  addNumericFieldError(errors, input.expectedAnnualReturnRate, 'expectedAnnualReturnRate', true);
  if (!isNaN(input.expectedAnnualReturnRate) && input.expectedAnnualReturnRate !== null && input.expectedAnnualReturnRate !== undefined) {
    addRangeError(errors, input.expectedAnnualReturnRate, 'expectedAnnualReturnRate', VALIDATION_RULES.RETURN_RATE_MIN, VALIDATION_RULES.RETURN_RATE_MAX, '%');
  }

  // Withdrawal Rate Validation (optional)
  if (
    input.withdrawalRateAtRetirement !== undefined &&
    input.withdrawalRateAtRetirement !== null
  ) {
    addNumericFieldError(errors, input.withdrawalRateAtRetirement, 'withdrawalRateAtRetirement', false);
    if (!isNaN(input.withdrawalRateAtRetirement)) {
      addRangeError(errors, input.withdrawalRateAtRetirement, 'withdrawalRateAtRetirement', 0.1, 100, '%');
    }
  }

  return errors;
}

/**
 * Check if MF input is valid
 *
 * @param input - MF calculator input
 * @returns true if valid, false otherwise
 */
export function isMFInputValid(input: MFCalculatorInput): boolean {
  return validateMFInput(input).length === 0;
}

/**
 * Check if NPS input is valid
 *
 * @param input - NPS calculator input
 * @returns true if valid, false otherwise
 */
export function isNPSInputValid(input: NPSCalculatorInput): boolean {
  return validateNPSInput(input).length === 0;
}

/**
 * Sanitize numeric input
 *
 * @param value - Input value
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns Sanitized number or null if invalid
 */
export function sanitizeNumericInput(value: unknown, min?: number, max?: number): number | null {
  const parsed = typeof value === 'string' || typeof value === 'number' ? parseFloat(String(value)) : NaN
  let num = parsed;

  if (isNaN(num)) {
    return null;
  }

  if (min !== undefined && num < min) {
    num = min;
  }

  if (max !== undefined && num > max) {
    num = max;
  }

  return num;
}
