/**
 * Shared TypeScript Types for Financial Calculator
 */

/**
 * Mutual Fund Calculator Input Parameters
 */
export interface MFCalculatorInput {
  principalAmount: number; // Initial investment in ₹
  monthlyContribution?: number; // Optional monthly SIP amount
  annualReturnRate: number; // Expected annual return rate (%)
  investmentPeriodYears: number; // Investment duration in years
}

/**
 * Mutual Fund Calculator Output Results
 */
export interface MFCalculatorOutput {
  finalValue: number; // Total value at maturity
  totalInvestment: number; // Sum of all investments
  profitGain: number; // Profit/Gain (finalValue - totalInvestment)
  gainPercentage: number; // Profit as percentage of investment
  absoluteGain: number; // Same as profitGain for clarity
  investmentBreakdown: {
    principal: number;
    sipTotal?: number;
  };
}

/**
 * National Pension Scheme (NPS) Calculator Input Parameters
 */
export interface NPSCalculatorInput {
  monthlyContribution: number; // Monthly contribution amount in ₹
  yearsToRetirement: number; // Years until retirement
  expectedAnnualReturnRate: number; // Expected annual return (%)
  withdrawalRateAtRetirement?: number; // Withdrawal rate post-retirement (default: 4%)
}

/**
 * National Pension Scheme (NPS) Calculator Output Results
 */
export interface NPSCalculatorOutput {
  totalCorpus: number; // Final accumulated corpus
  totalContribution: number; // Sum of all contributions
  investmentReturns: number; // Corpus - totalContribution
  returnsPercentage: number; // Returns as percentage
  estimatedMonthlyAnnuity: number; // Estimated monthly income post-retirement
  estimatedAnnualAnnuity: number; // Estimated annual income post-retirement
  retirementAnalysis: {
    corpusAtRetirement: number;
    monthlyIncome: number;
    annualIncome: number;
  };
}

/**
 * Validation Error Object
 */
export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

/**
 * Generic Calculator Result
 */
export interface CalculatorResult<T> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
}

/**
 * Feature Flag Configuration
 */
export interface FeatureFlags {
  isMFCalculatorEnabled: boolean;
  isNPSCalculatorEnabled: boolean;
  isAdvancedAnalysisEnabled: boolean;
}

/**
 * Calculator State for Hook Management
 */
export interface CalculatorState<TInput, TOutput> {
  inputs: TInput;
  results: TOutput | null;
  errors: ValidationError[];
  isCalculating: boolean;
  lastCalculatedAt: number | null;
}

/**
 * Responsive Breakpoint Information
 */
export interface ResponsiveBreakpoint {
  isMobile: boolean; // <= 640px
  isTablet: boolean; // 641px - 1024px
  isDesktop: boolean; // > 1024px
  screenWidth: number;
  screenHeight: number;
}

/**
 * Application Configuration
 */
export interface AppConfig {
  version: string;
  environment: 'development' | 'production';
  featureFlags: FeatureFlags;
  calculationDebounceMs: number;
  currencyCode: string;
  currencySymbol: string;
}

/**
 * Calculator Accuracy Constants
 */
export const ACCURACY_TOLERANCE = {
  MF: 0.0001, // 0.01% tolerance for MF calculations
  NPS: 0.005, // 0.5% tolerance for NPS calculations
};

/**
 * Common Input Constraints
 */
export const INPUT_CONSTRAINTS = {
  minPrincipalAmount: 100, // Minimum ₹100
  maxPrincipalAmount: 100000000, // Maximum ₹1 Crore
  minMonthlyContribution: 100, // Minimum ₹100
  maxMonthlyContribution: 500000, // Maximum ₹5 Lakh
  minAnnualReturn: -50, // Minimum -50% (worst case)
  maxAnnualReturn: 100, // Maximum 100% (highly optimistic)
  minYears: 1, // Minimum 1 year
  maxYears: 70, // Maximum 70 years
  minReturnRate: 1, // Minimum 1% annual return
  maxReturnRate: 50, // Maximum 50% annual return
};
