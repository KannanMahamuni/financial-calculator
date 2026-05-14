/**
 * Application Constants
 */

/**
 * Feature flags with default values
 */
export const FEATURE_FLAGS = {
  MF_CALCULATOR_ENABLED: JSON.parse(import.meta.env.VITE_FEATURE_MF_CALCULATOR_ENABLED || 'true'),
  NPS_CALCULATOR_ENABLED: JSON.parse(import.meta.env.VITE_FEATURE_NPS_CALCULATOR_ENABLED || 'true'),
  ADVANCED_ANALYSIS_ENABLED: JSON.parse(import.meta.env.VITE_FEATURE_ADVANCED_ANALYSIS_ENABLED || 'false'),
};

/**
 * Performance & Debounce Settings
 */
export const PERFORMANCE = {
  CALCULATION_DEBOUNCE_MS: parseInt(import.meta.env.VITE_CALCULATION_DEBOUNCE_MS || '100', 10),
  INPUT_VALIDATION_DEBOUNCE_MS: 50,
  RESIZE_DEBOUNCE_MS: 150,
};

/**
 * Currency Configuration (India Rupee)
 */
export const CURRENCY = {
  CODE: 'INR',
  SYMBOL: '₹',
  LOCALE: 'en-IN',
  MIN_FRACTION_DIGITS: 2,
  MAX_FRACTION_DIGITS: 2,
};

/**
 * Calculation Formulas & Reference
 */
export const FORMULAS = {
  MF_COMPOUND: 'FV = PV × (1+r)^n',
  MF_SIP: 'FV = PMT × [((1+r)^n - 1) / r] × (1+r)',
  NPS_ANNUITY: 'Monthly = Corpus × (Annual Rate / 12) / 100',
};

/**
 * Default Calculator Input Values
 */
export const DEFAULT_MF_INPUT = {
  principalAmount: 50000,
  monthlyContribution: 5000,
  annualReturnRate: 12,
  investmentPeriodYears: 10,
};

export const DEFAULT_NPS_INPUT = {
  monthlyContribution: 5000,
  yearsToRetirement: 25,
  expectedAnnualReturnRate: 8,
  withdrawalRateAtRetirement: 4,
};

/**
 * Route Paths
 */
export const ROUTES = {
  HOME: '/',
  MF_CALCULATOR: '/mf-calculator',
  NPS_CALCULATOR: '/nps-calculator',
  ABOUT: '/about',
  NOT_FOUND: '/404',
};

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  INVALID_NUMBER: 'Please enter a valid number',
  NEGATIVE_VALUE: 'Value must be positive',
  ZERO_NOT_ALLOWED: 'Value cannot be zero',
  OUT_OF_RANGE: 'Value is outside acceptable range',
  MISSING_REQUIRED_FIELD: 'This field is required',
  CALCULATION_FAILED: 'Failed to perform calculation. Please check your inputs.',
  CALCULATOR_UNAVAILABLE: 'This calculator is currently unavailable',
};

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  CALCULATION_COMPLETE: 'Calculation completed successfully',
  INPUT_VALID: 'All inputs are valid',
};

/**
 * Validation Rules
 */
export const VALIDATION_RULES = {
  MF_PRINCIPAL_MIN: 100,
  MF_PRINCIPAL_MAX: 100000000,
  MF_MONTHLY_CONTRIBUTION_MIN: 0,
  MF_MONTHLY_CONTRIBUTION_MAX: 500000,
  NPS_MONTHLY_MIN: 100,
  NPS_MONTHLY_MAX: 500000,
  RETURN_RATE_MIN: -50,
  RETURN_RATE_MAX: 100,
  YEARS_MIN: 1,
  YEARS_MAX: 70,
};

/**
 * Responsive Breakpoints
 */
export const BREAKPOINTS = {
  XS: 320,
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
};

/**
 * Animation & Transition Durations (ms)
 */
export const DURATIONS = {
  FAST: 150,
  BASE: 300,
  SLOW: 500,
};

/**
 * Common Numbers for Calculations
 */
export const CALCULATION_CONSTANTS = {
  MONTHS_PER_YEAR: 12,
  DAYS_PER_YEAR: 365,
  WEEKS_PER_YEAR: 52,
  PERCENT_CONVERSION: 100,
  ANNUITY_WITHDRAWAL_RATE_DEFAULT: 4, // 4% default withdrawal rate
};
