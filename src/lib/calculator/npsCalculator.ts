/**
 * National Pension Scheme (NPS) Calculator Business Logic
 * Pure functions for NPS calculations
 */

import { NPSCalculatorInput, NPSCalculatorOutput } from '../types';
import { CALCULATION_CONSTANTS } from '../constants';

/**
 * Calculate NPS Corpus Accumulation
 * Formula: FV = PMT × [((1+r)^n - 1) / r]
 *
 * @param input - NPS calculator input parameters
 * @returns Calculated NPS corpus and analysis
 */
export function calculateNPSCorpus(input: NPSCalculatorInput): NPSCalculatorOutput {
  const {
    monthlyContribution,
    yearsToRetirement,
    expectedAnnualReturnRate,
    withdrawalRateAtRetirement = CALCULATION_CONSTANTS.ANNUITY_WITHDRAWAL_RATE_DEFAULT,
  } = input;

  // Convert annual rate to monthly rate
  const monthlyRate =
    expectedAnnualReturnRate / CALCULATION_CONSTANTS.PERCENT_CONVERSION / CALCULATION_CONSTANTS.MONTHS_PER_YEAR;
  const totalMonths = yearsToRetirement * CALCULATION_CONSTANTS.MONTHS_PER_YEAR;

  // Calculate total corpus using Future Value of Annuity formula
  // FV = PMT × [((1+r)^n - 1) / r]
  let totalCorpus = 0;
  if (monthlyRate > 0) {
    totalCorpus =
      monthlyContribution * (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;
  } else {
    // If rate is 0%, just multiply by number of months
    totalCorpus = monthlyContribution * totalMonths;
  }

  // Total contribution
  const totalContribution = monthlyContribution * totalMonths;

  // Investment returns
  const investmentReturns = totalCorpus - totalContribution;
  const returnsPercentage =
    totalContribution > 0
      ? (investmentReturns / totalContribution) * CALCULATION_CONSTANTS.PERCENT_CONVERSION
      : 0;

  // Calculate annuity (monthly income post-retirement)
  // Using 4% withdrawal rate rule (or custom rate)
  const monthlyAnnuity = calculateAnnuity(totalCorpus, withdrawalRateAtRetirement);
  const annualAnnuity = monthlyAnnuity * CALCULATION_CONSTANTS.MONTHS_PER_YEAR;

  return {
    totalCorpus: Math.round(totalCorpus * 100) / 100,
    totalContribution: Math.round(totalContribution * 100) / 100,
    investmentReturns: Math.round(investmentReturns * 100) / 100,
    returnsPercentage: Math.round(returnsPercentage * 100) / 100,
    estimatedMonthlyAnnuity: Math.round(monthlyAnnuity * 100) / 100,
    estimatedAnnualAnnuity: Math.round(annualAnnuity * 100) / 100,
    retirementAnalysis: {
      corpusAtRetirement: Math.round(totalCorpus * 100) / 100,
      monthlyIncome: Math.round(monthlyAnnuity * 100) / 100,
      annualIncome: Math.round(annualAnnuity * 100) / 100,
    },
  };
}

/**
 * Calculate Monthly Annuity from Corpus
 * Using the 4% rule or custom withdrawal rate
 *
 * @param corpus - Total accumulated corpus
 * @param withdrawalRateAnnual - Annual withdrawal rate as percentage (default: 4%)
 * @returns Monthly annuity amount
 */
export function calculateAnnuity(corpus: number, withdrawalRateAnnual: number = 4): number {
  // Convert annual withdrawal rate to monthly
  // Monthly = Corpus × (Annual Rate / 100) / 12
  const monthlyAnnuity = (corpus * withdrawalRateAnnual / CALCULATION_CONSTANTS.PERCENT_CONVERSION) / CALCULATION_CONSTANTS.MONTHS_PER_YEAR;
  return Math.round(monthlyAnnuity * 100) / 100;
}

/**
 * Calculate how long the corpus will last given fixed monthly withdrawal
 *
 * @param corpus - Total corpus
 * @param monthlyWithdrawal - Fixed monthly withdrawal amount
 * @param expectedReturnRate - Expected annual return rate during withdrawal period
 * @returns Number of months the corpus will last
 */
export function calculateCorpusLongevity(
  corpus: number,
  monthlyWithdrawal: number,
  expectedReturnRate: number = 4
): number {
  const monthlyRate = expectedReturnRate / CALCULATION_CONSTANTS.PERCENT_CONVERSION / CALCULATION_CONSTANTS.MONTHS_PER_YEAR;

  if (monthlyWithdrawal <= 0) {
    return Infinity;
  }

  if (monthlyRate > 0) {
    // Formula to calculate months when remaining balance becomes 0
    // n = -log(1 - (corpus × r) / withdrawal) / log(1 + r)
    const numerator = 1 - (corpus * monthlyRate) / monthlyWithdrawal;

    if (numerator <= 0) {
      // Corpus generates more interest than withdrawal
      return Infinity;
    }

    return -Math.log(numerator) / Math.log(1 + monthlyRate);
  } else {
    // If no return, corpus will last (corpus / monthlyWithdrawal) months
    return corpus / monthlyWithdrawal;
  }
}

/**
 * Calculate required monthly contribution to reach a target corpus
 *
 * @param targetCorpus - Desired corpus amount
 * @param yearsToRetirement - Investment period in years
 * @param expectedAnnualReturnRate - Expected annual return rate
 * @returns Required monthly contribution
 */
export function calculateRequiredMonthlyContribution(
  targetCorpus: number,
  yearsToRetirement: number,
  expectedAnnualReturnRate: number
): number {
  const monthlyRate =
    expectedAnnualReturnRate / CALCULATION_CONSTANTS.PERCENT_CONVERSION / CALCULATION_CONSTANTS.MONTHS_PER_YEAR;
  const totalMonths = yearsToRetirement * CALCULATION_CONSTANTS.MONTHS_PER_YEAR;

  if (monthlyRate > 0) {
    // Reverse of FV = PMT × [((1+r)^n - 1) / r]
    // PMT = FV / [((1+r)^n - 1) / r]
    return (
      targetCorpus /
      ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate)
    );
  } else {
    // If rate is 0%, just divide corpus by months
    return targetCorpus / totalMonths;
  }
}
