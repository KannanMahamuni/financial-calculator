/**
 * Mutual Fund Calculator Business Logic
 * Pure functions for MF calculations
 */

import { MFCalculatorInput, MFCalculatorOutput } from '../types';
import { CALCULATION_CONSTANTS } from '../constants';

/**
 * Calculate Mutual Fund Returns using Compound Interest Formula
 * Formula: FV = PV × (1 + r)^n
 *
 * @param input - MF calculator input parameters
 * @returns Calculated MF returns and values
 */
export function calculateMFReturns(input: MFCalculatorInput): MFCalculatorOutput {
  const {
    principalAmount,
    monthlyContribution = 0,
    annualReturnRate,
    investmentPeriodYears,
  } = input;

  // Convert annual rate to monthly rate
  const monthlyRate = annualReturnRate / CALCULATION_CONSTANTS.PERCENT_CONVERSION / CALCULATION_CONSTANTS.MONTHS_PER_YEAR;
  const totalMonths = investmentPeriodYears * CALCULATION_CONSTANTS.MONTHS_PER_YEAR;

  // Calculate compound interest on principal
  const principalFutureValue = principalAmount * Math.pow(1 + monthlyRate, totalMonths);

  // Calculate future value of recurring SIP contributions
  // Using Future Value of Annuity formula: FV = PMT × [((1+r)^n - 1) / r] × (1+r)
  let sipFutureValue = 0;
  if (monthlyContribution > 0 && monthlyRate > 0) {
    sipFutureValue =
      monthlyContribution * (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate * (1 + monthlyRate);
  } else if (monthlyContribution > 0) {
    // If rate is 0%, just multiply by number of months
    sipFutureValue = monthlyContribution * totalMonths;
  }

  // Total investment amounts
  const totalInvestment = principalAmount + monthlyContribution * totalMonths;

  // Final value
  const finalValue = principalFutureValue + sipFutureValue;

  // Profit/Gain
  const profitGain = finalValue - totalInvestment;
  const gainPercentage = totalInvestment > 0 ? (profitGain / totalInvestment) * CALCULATION_CONSTANTS.PERCENT_CONVERSION : 0;

  return {
    finalValue: Math.round(finalValue * 100) / 100,
    totalInvestment: Math.round(totalInvestment * 100) / 100,
    profitGain: Math.round(profitGain * 100) / 100,
    gainPercentage: Math.round(gainPercentage * 100) / 100,
    absoluteGain: Math.round(profitGain * 100) / 100,
    investmentBreakdown: {
      principal: Math.round(principalAmount * 100) / 100,
      sipTotal: monthlyContribution > 0 ? Math.round(monthlyContribution * totalMonths * 100) / 100 : undefined,
    },
  };
}

/**
 * Calculate MF Returns with detailed year-by-year breakdown
 * Useful for extended analysis
 *
 * @param input - MF calculator input parameters
 * @returns Year-by-year breakdown of returns
 */
export function calculateMFReturnsDetailed(
  input: MFCalculatorInput
): MFCalculatorOutput & { yearlyBreakdown: Array<{ year: number; value: number }> } {
  const baseResult = calculateMFReturns(input);

  const { annualReturnRate, investmentPeriodYears } = input;
  const monthlyRate = annualReturnRate / CALCULATION_CONSTANTS.PERCENT_CONVERSION / CALCULATION_CONSTANTS.MONTHS_PER_YEAR;

  const yearlyBreakdown = [];
  for (let year = 1; year <= investmentPeriodYears; year++) {
    const months = year * CALCULATION_CONSTANTS.MONTHS_PER_YEAR;
    const input_temp = { ...input, investmentPeriodYears: year };
    const yearValue = calculateMFReturns(input_temp).finalValue;
    yearlyBreakdown.push({ year, value: yearValue });
  }

  return {
    ...baseResult,
    yearlyBreakdown,
  };
}
