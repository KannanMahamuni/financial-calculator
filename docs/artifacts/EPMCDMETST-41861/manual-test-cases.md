# Manual Test Cases — EPMCDMETST-41861: Financial Calculator

## Overview

This document contains manual test cases for the Financial Calculator website (MF & NPS modules). Test cases are derived from acceptance criteria in `requirements.md` and follow coverage-first approach: happy path, negative validation, edge cases, and performance.

**Scope:** Web application (Chrome, Firefox, Safari, Edge) on desktop, tablet, and mobile (320px–1920px)  
**User Base:** Public, no authentication required  
**Total Test Cases:** 18 (High: 8, Medium: 7, Low: 3)

---

## Manual Test Cases

### TC-001: Verify MF Calculator Loads Successfully
| Field | Value |
|---|---|
| **TC ID** | TC-001 |
| **Title** | Verify MF Calculator Module Loads Successfully |
| **Preconditions** | Browser open to application homepage; JavaScript enabled; 4G or broadband connection |
| **Test Steps** | 1. Navigate to application homepage<br/>2. Locate "Mutual Fund Calculator" button/link<br/>3. Click to open MF calculator module |
| **Expected Result** | MF calculator page loads within 2 seconds (4G) / 500ms (broadband); all input fields visible; no JS errors in console |
| **Type** | Functional / Smoke |
| **Priority** | **High** |

---

### TC-002: MF Calculator — Happy Path (Valid Inputs)
| Field | Value |
|---|---|
| **TC ID** | TC-002 |
| **Title** | MF Calculator: Calculate Returns with Valid Inputs |
| **Preconditions** | MF Calculator page loaded; input fields ready for entry |
| **Test Steps** | 1. Enter Investment Amount: ₹1,00,000<br/>2. Enter Investment Period: 10 years<br/>3. Enter Expected Rate of Return: 12%<br/>4. Observe real-time result update |
| **Expected Result** | Result displays: Compound Returns = ₹3,10,585 (approx); Result updates within <100ms; No error messages |
| **Type** | Functional |
| **Priority** | **High** |

---

### TC-003: NPS Calculator Loads Successfully
| Field | Value |
|---|---|
| **TC ID** | TC-003 |
| **Title** | Verify NPS Calculator Module Loads Successfully |
| **Preconditions** | Browser open to application homepage; JavaScript enabled |
| **Test Steps** | 1. Navigate to application homepage<br/>2. Locate "NPS Calculator" button/link<br/>3. Click to open NPS calculator module |
| **Expected Result** | NPS calculator page loads within 2 seconds; all input fields visible (monthly contribution, years to retirement, return rate); no JS errors |
| **Type** | Functional / Smoke |
| **Priority** | **High** |

---

### TC-004: NPS Calculator — Happy Path (Valid Inputs)
| Field | Value |
|---|---|
| **TC ID** | TC-004 |
| **Title** | NPS Calculator: Calculate Corpus and Annuity with Valid Inputs |
| **Preconditions** | NPS Calculator page loaded; input fields ready for entry |
| **Test Steps** | 1. Enter Monthly Contribution: ₹5,000<br/>2. Enter Years to Retirement: 20<br/>3. Enter Expected Return Rate: 10%<br/>4. Observe real-time result updates |
| **Expected Result** | Results display: Total Corpus ≈ ₹21.5 Lac; Monthly Annuity ≈ ₹17,917 (approx); Results update within <100ms; No errors |
| **Type** | Functional |
| **Priority** | **High** |

---

### TC-005: Input Validation — Negative Investment Amount (MF)
| Field | Value |
|---|---|
| **TC ID** | TC-005 |
| **Title** | MF Calculator: Reject Negative Investment Amount |
| **Preconditions** | MF Calculator page loaded |
| **Test Steps** | 1. Enter Investment Amount: -₹50,000<br/>2. Attempt to view or recalculate result |
| **Expected Result** | Inline error message displays: "Investment amount must be positive"; Result field remains blank or shows previous valid result; Input field is highlighted in red (optional) |
| **Type** | Negative / Validation |
| **Priority** | **High** |

---

### TC-006: Input Validation — Non-Numeric Input
| Field | Value |
|---|---|
| **TC ID** | TC-006 |
| **Title** | MF Calculator: Reject Non-Numeric Input in Investment Field |
| **Preconditions** | MF Calculator page loaded; Investment Amount field focused |
| **Test Steps** | 1. Click on Investment Amount field<br/>2. Type: "ABC123" or special characters<br/>3. Tab to next field or attempt calculation |
| **Expected Result** | Field rejects non-numeric input OR displays error: "Please enter a valid number"; Field retains valid previous value or clears with error message |
| **Type** | Negative / Validation |
| **Priority** | **High** |

---

### TC-007: Input Validation — Zero Investment (MF)
| Field | Value |
|---|---|
| **TC ID** | TC-007 |
| **Title** | MF Calculator: Reject Zero Investment Amount |
| **Preconditions** | MF Calculator page loaded |
| **Test Steps** | 1. Enter Investment Amount: 0<br/>2. Enter Investment Period: 5 years<br/>3. Enter Return Rate: 12%<br/>4. Observe calculation result |
| **Expected Result** | Error message displays: "Investment cannot be zero. Please enter a positive value"; Calculation does not execute; Input field is highlighted |
| **Type** | Negative / Validation |
| **Priority** | **High** |

---

### TC-008: Real-Time Calculation Update (MF)
| Field | Value |
|---|---|
| **TC ID** | TC-008 |
| **Title** | MF Calculator: Real-Time Result Update on Input Change |
| **Preconditions** | MF Calculator loaded with previous valid inputs; Results displayed |
| **Test Steps** | 1. Verify result is displayed (e.g., ₹3,10,585)<br/>2. Change Investment Period from 10 to 15 years (without clicking submit)<br/>3. Observe result field update |
| **Expected Result** | Result updates automatically within <100ms; New result reflects 15-year calculation; No page refresh required; Result = ₹5,31,089 (approx) |
| **Type** | Functional / Performance |
| **Priority** | **High** |

---

### TC-009: Mobile Responsiveness — Portrait View (320px)
| Field | Value |
|---|---|
| **TC ID** | TC-009 |
| **Title** | MF Calculator Mobile View (Portrait 320px): Verify Layout and Usability |
| **Preconditions** | Browser resized to 320px width (mobile portrait); MF Calculator page loaded |
| **Test Steps** | 1. Verify all input fields visible without horizontal scroll<br/>2. Verify buttons (e.g., Calculate, Clear) visible<br/>3. Enter valid inputs: ₹50,000, 5 years, 10%<br/>4. Verify result displays below inputs |
| **Expected Result** | All elements stack vertically; No horizontal scrolling required; Input and results fully readable; Calculation works correctly |
| **Type** | Functional / UI |
| **Priority** | **High** |

---

### TC-010: Mobile Responsiveness — Landscape View (Tablet 768px)
| Field | Value |
|---|---|
| **TC ID** | TC-010 |
| **Title** | MF Calculator Tablet View (Landscape 768px): Verify Layout Adaptation |
| **Preconditions** | Browser resized to 768px width; MF Calculator page loaded |
| **Test Steps** | 1. Verify layout adjusts (inputs may be side-by-side or stacked)<br/>2. Enter valid inputs: ₹1,00,000, 10 years, 12%<br/>3. Verify result displays with adequate spacing |
| **Expected Result** | Layout adapts for 768px width; All elements clearly visible; Calculation result accurate; No overlapping elements |
| **Type** | Functional / UI |
| **Priority** | **High** |

---

### TC-011: Device Rotation — Portrait to Landscape
| Field | Value |
|---|---|
| **TC ID** | TC-011 |
| **Title** | Mobile: Device Rotation Preserves Calculation State and Input |
| **Preconditions** | Mobile device (or emulator) in portrait orientation; MF Calculator with inputs and result displayed |
| **Test Steps** | 1. Enter inputs: ₹75,000, 7 years, 11%<br/>2. Verify result displays: ₹1,56,389 (approx)<br/>3. Rotate device from portrait to landscape<br/>4. Verify result still displays; Inputs preserved |
| **Expected Result** | Layout reflows for landscape orientation; Input values persist; Calculated result persists and remains visible; No data loss or refresh |
| **Type** | Functional / UI |
| **Priority** | **Medium** |

---

### TC-012: Performance — Page Load Time (4G Connection)
| Field | Value |
|---|---|
| **TC ID** | TC-012 |
| **Title** | Application Page Load Time on 4G Connection |
| **Preconditions** | Network throttled to 4G (10 Mbps down, 5 Mbps up); Browser DevTools open for timing |
| **Test Steps** | 1. Open DevTools > Network tab<br/>2. Navigate to application homepage<br/>3. Monitor page load time (Largest Contentful Paint / LCP)<br/>4. Verify calculator is interactive after load |
| **Expected Result** | Page fully loads (LCP) within 2 seconds; Core calculator UI visible and interactive within threshold; No blocked rendering |
| **Type** | Performance / Non-Functional |
| **Priority** | **High** |

---

### TC-013: Performance — Calculation Latency
| Field | Value |
|---|---|
| **TC ID** | TC-013 |
| **Title** | MF Calculator: Calculation Result Latency <100ms |
| **Preconditions** | MF Calculator loaded; DevTools Performance tab available; Valid inputs ready |
| **Test Steps** | 1. Open DevTools > Performance tab<br/>2. Enter all inputs: ₹2,00,000, 15 years, 13%<br/>3. Record performance timeline<br/>4. Measure time from last input change to result update in DOM |
| **Expected Result** | Calculation result updates within <100ms of input change; Timeline shows no long-running JavaScript blocking rendering |
| **Type** | Performance / Non-Functional |
| **Priority** | **Medium** |

---

### TC-014: GDPR Compliance — No Data Persistence After Session End
| Field | Value |
|---|---|
| **TC ID** | TC-014 |
| **Title** | GDPR: Verify No User Data Persisted to Storage |
| **Preconditions** | Browser DevTools open; Storage tab available; Fresh browser session |
| **Test Steps** | 1. Open Application<br/>2. Enter MF Calculator inputs: ₹1,00,000, 10 years, 12%<br/>3. Perform calculations<br/>4. Inspect DevTools > Application > Storage (Cookies, Local Storage, Session Storage)<br/>5. Close browser tab or session<br/>6. Reopen browser and check Storage again |
| **Expected Result** | No cookies, localStorage, or sessionStorage entries created during session; After session close, no user input or personal data recoverable from storage; New session starts with clean state |
| **Type** | Compliance / Security |
| **Priority** | **Medium** |

---

### TC-015: Feature Flag — Calculator Disabled
| Field | Value |
|---|---|
| **TC ID** | TC-015 |
| **Title** | Feature Flag: Calculator Unavailable When Disabled |
| **Preconditions** | Application deployed with feature flag CALCULATOR_ENABLED = false; User attempts access |
| **Test Steps** | 1. Navigate to application homepage<br/>2. Attempt to click "Mutual Fund Calculator" link<br/>3. If redirected, verify redirect destination; If message shown, verify message content |
| **Expected Result** | Page displays "Calculator is currently unavailable" message (friendly); No 404 error; Home page remains accessible; No JS console errors |
| **Type** | Functional / Configuration |
| **Priority** | **Medium** |

---

### TC-016: Extreme Input Values — Very High Return Rate
| Field | Value |
|---|---|
| **TC ID** | TC-016 |
| **Title** | MF Calculator: Handle Extreme Input (High Return Rate) |
| **Preconditions** | MF Calculator loaded |
| **Test Steps** | 1. Enter Investment Amount: ₹1,00,000<br/>2. Enter Investment Period: 20 years<br/>3. Enter Return Rate: 150% (extreme/unrealistic)<br/>4. Attempt calculation |
| **Expected Result** | Validation warning: "Return rate >50% is unusual. Confirm to continue?"; Calculation proceeds if user confirms; Result displays correctly (FV = ₹1,00,000 × (1+1.5)^20); No NaN or overflow errors |
| **Type** | Negative / Edge Case |
| **Priority** | **Medium** |

---

### TC-017: Calculation Accuracy (MF) — Verify Formula
| Field | Value |
|---|---|
| **TC ID** | TC-017 |
| **Title** | MF Calculator: Verify Calculation Accuracy Against Reference Formula |
| **Preconditions** | MF Calculator loaded; Reference calculation performed manually (FV = PV × (1+r)^n) |
| **Test Steps** | 1. Input: Investment = ₹1,00,000, Period = 5 years, Return = 10%<br/>2. Actual Result: ₹1,00,000 × (1.10)^5 = ₹1,61,051<br/>3. Calculator Result: _______<br/>4. Calculate Tolerance: |Actual − Calculator| / Actual × 100% |
| **Expected Result** | Calculator result: ₹1,61,051 (or within 0.01% tolerance); Tolerance = 0.01% or less; No rounding errors beyond acceptable limits |
| **Type** | Accuracy / Functional |
| **Priority** | **Low** |

---

### TC-018: Accessibility — Keyboard Navigation (Tab Key)
| Field | Value |
|---|---|
| **TC ID** | TC-018 |
| **Title** | MF Calculator: Keyboard Navigation (Tab Key) for Accessibility |
| **Preconditions** | MF Calculator page loaded; Keyboard available; No mouse input |
| **Test Steps** | 1. Press Tab repeatedly to navigate through all input fields<br/>2. Verify focus indicator visible on each field<br/>3. Enter values using keyboard and arrow keys where applicable<br/>4. Tab to submit/calculate button; Press Enter to calculate |
| **Expected Result** | All input fields reachable via Tab key; Focus indicator (outline/highlight) visible; Calculation executes when Enter pressed; Screen reader announces field labels and current values |
| **Type** | Accessibility / UI |
| **Priority** | **Low** |

---

## Automation Hints

### Test Data Files Needed
- `test-data/mf-calculator-testcases.json` — Investment scenarios (amount, period, rate, expected result)
- `test-data/nps-calculator-testcases.json` — NPS scenarios (monthly contribution, years, rate, expected corpus/annuity)
- `test-data/invalid-inputs.json` — Negative, zero, and non-numeric inputs

### Reusable Step Definitions (if needed)
- `Given the MF Calculator page is loaded` → Navigate to /calculator/mf
- `When the user enters investment amount "<amount>"` → Fill input field with value
- `When the user changes the investment period to "<years>"` → Clear field and enter new value
- `Then the result should display within "<time>" milliseconds` → Verify DOM update latency
- `And the result should be approximately "<amount>"` → Compare with tolerance

### Page Objects
- `CalculatorPage.ts` — Base calculator page (inputs, results, buttons)
- `MFCalculatorPage.ts` — MF-specific selectors and methods
- `NPSCalculatorPage.ts` — NPS-specific selectors and methods

### Feature Files to Generate (Automation)
- `features/mf-calculator.feature` — MF calculator scenarios (happy path, validation, performance)
- `features/nps-calculator.feature` — NPS calculator scenarios
- `features/calculator-mobile.feature` — Mobile responsiveness tests

### Recommended Tool
- **Framework:** Playwright + Cucumber (Gherkin syntax)
- **Language:** TypeScript
- **Reporting:** HTML + Screenshots on failure
- **CI/CD Integration:** GitLab CI (run on PR and main branch)

---

## Test Coverage Summary

| Coverage Area | Test Cases | Priority | Status |
|---|---|---|---|
| **Smoke / Happy Path** | TC-001, TC-002, TC-003, TC-004 | High | ✓ Manual Ready |
| **Input Validation** | TC-005, TC-006, TC-007 | High | ✓ Manual Ready |
| **Real-Time Updates** | TC-008 | High | ✓ Manual Ready |
| **Mobile Responsiveness** | TC-009, TC-010, TC-011 | High / Medium | ✓ Manual Ready |
| **Performance** | TC-012, TC-013 | High / Medium | ✓ Manual Ready |
| **Compliance / Security** | TC-014, TC-015 | Medium | ✓ Manual Ready |
| **Edge Cases** | TC-016 | Medium | ✓ Manual Ready |
| **Accuracy** | TC-017 | Low | ✓ Manual Ready |
| **Accessibility** | TC-018 | Low | ✓ Manual Ready |

**Total:** 18 manual test cases (High: 8, Medium: 7, Low: 3)

---

## Automation Priority

**For MVP (Immediate Automation):**
1. TC-002 (MF Happy Path)
2. TC-004 (NPS Happy Path)
3. TC-005 (Negative Validation)
4. TC-008 (Real-Time Update)
5. TC-009 (Mobile Responsiveness)

**For Phase 2 (Secondary Automation):**
- TC-012, TC-013 (Performance / Latency tests)
- TC-014 (GDPR Compliance verification)
- TC-017 (Accuracy verification)

---

**Generated by:** SDLC QA Generate Agent  
**Date:** 2026-05-13  
**Status:** Ready for Automation Script Generation  
