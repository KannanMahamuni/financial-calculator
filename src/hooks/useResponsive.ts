/**
 * useResponsive Hook
 * Detects viewport breakpoints and responsive state
 */

import { useEffect, useState } from 'react'
import { ResponsiveBreakpoint, BREAKPOINTS } from '../lib/types'
import { PERFORMANCE } from '../lib/constants'

/**
 * Calculate breakpoint from width
 */
const getBreakpointFromWidth = (width: number, height: number): ResponsiveBreakpoint => ({
  isMobile: width <= BREAKPOINTS.SM,
  isTablet: width > BREAKPOINTS.SM && width <= BREAKPOINTS.LG,
  isDesktop: width > BREAKPOINTS.LG,
  screenWidth: width,
  screenHeight: height,
});

/**
 * Custom hook to detect responsive breakpoints
 *
 * @returns Responsive breakpoint information
 */
export function useResponsive(): ResponsiveBreakpoint {
  const [breakpoint, setBreakpoint] = useState<ResponsiveBreakpoint>(() =>
    getBreakpointFromWidth(window.innerWidth, window.innerHeight)
  )

  useEffect(() => {
    let resizeTimer: NodeJS.Timeout
    
    const debouncedResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        setBreakpoint(getBreakpointFromWidth(window.innerWidth, window.innerHeight))
      }, PERFORMANCE.RESIZE_DEBOUNCE_MS)
    }

    window.addEventListener('resize', debouncedResize)

    return () => {
      window.removeEventListener('resize', debouncedResize)
      clearTimeout(resizeTimer)
    }
  }, [])

  return breakpoint
}
