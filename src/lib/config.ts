/**
 * Application Configuration
 */

import { AppConfig, FeatureFlags } from './types';
import { FEATURE_FLAGS, PERFORMANCE, CURRENCY } from './constants';

/**
 * Get Application Configuration based on environment
 */
export const getAppConfig = (): AppConfig => {
  return {
    version: '1.0.0',
    environment: (import.meta.env.MODE as 'development' | 'production') || 'production',
    featureFlags: {
      isMFCalculatorEnabled: FEATURE_FLAGS.MF_CALCULATOR_ENABLED,
      isNPSCalculatorEnabled: FEATURE_FLAGS.NPS_CALCULATOR_ENABLED,
      isAdvancedAnalysisEnabled: FEATURE_FLAGS.ADVANCED_ANALYSIS_ENABLED,
    } as FeatureFlags,
    calculationDebounceMs: PERFORMANCE.CALCULATION_DEBOUNCE_MS,
    currencyCode: CURRENCY.CODE,
    currencySymbol: CURRENCY.SYMBOL,
  };
};

/**
 * Generic formatter using Intl.NumberFormat
 */
const formatWithIntl = (
  value: number,
  options: Intl.NumberFormatOptions,
  locale = CURRENCY.LOCALE
): string => {
  return new Intl.NumberFormat(locale, options).format(value);
};

/**
 * Formatter for Indian Currency
 */
export const formatCurrency = (value: number): string => {
  return formatWithIntl(value, {
    style: 'currency',
    currency: CURRENCY.CODE,
    minimumFractionDigits: CURRENCY.MIN_FRACTION_DIGITS,
    maximumFractionDigits: CURRENCY.MAX_FRACTION_DIGITS,
  });
};

/**
 * Format large numbers with commas
 */
export const formatNumber = (value: number, decimalPlaces: number = 2): string => {
  return formatWithIntl(value, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
};

/**
 * Get viewport breakpoint name
 */
export const getBreakpointName = (width: number): string => {
  if (width < 640) return 'xs';
  if (width < 768) return 'sm';
  if (width < 1024) return 'md';
  if (width < 1280) return 'lg';
  if (width < 1536) return 'xl';
  return '2xl';
};
