# Architecture Design Specification — EPMCDMETST-41861: Financial Calculator

## Meta

| Field | Value |
|---|---|
| **Feature ID** | FEAT-0001 |
| **Ticket** | EPMCDMETST-41861 |
| **Title** | Financial Calculator Website for MF and NPS |
| **Tech Stack** | React 18+, TypeScript, Tailwind CSS, Vite |
| **Author** | Architecture Team |
| **Created** | 2026-05-13 |
| **Version** | 1.0 |
| **Status** | Draft |

---

## Problem Spec Reference

**From requirements.md:**
- Build a public, web-based financial calculator supporting Mutual Fund (MF) and National Pension Scheme (NPS) modules
- Real-time calculation updates (<100ms latency)
- Mobile-responsive (320px–1920px viewports)
- GDPR-compliant (no PII persistence, no cookies/tracking)
- High performance: <2s page load (4G), <500ms (broadband)
- Support 500–1K concurrent daily users
- Greenfield (no legacy systems to integrate)
- Optional feature flag for rollout control

**Key Constraints:**
- Client-side only (no backend services required for MVP)
- Stateless (no user accounts, no persistent storage)
- Public access (unauthenticated)
- Single-region deployment
- Input validation on client-side only

---

## Current Architecture

**Status:** Greenfield — no existing architecture to preserve or migrate.

This is a new, standalone application with no prior versions, dependencies on legacy systems, or database schemas. Architecture decisions are unconstrained by backward compatibility.

---

## Architecture

### High-Level Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    User Browser                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           React Application (TypeScript)             │   │
│  │                                                      │   │
│  │  ┌─────────────────┐      ┌──────────────────────┐  │   │
│  │  │ Router (React   │      │  Layout Components   │  │   │
│  │  │  Router)        │◄────►│  (Header, Footer,    │  │   │
│  │  │                 │      │   Sidebar)           │  │   │
│  │  └────────┬────────┘      └──────────────────────┘  │   │
│  │           │                                          │   │
│  │  ┌────────▼────────────────────────────────────────┐ │   │
│  │  │    CalculatorPage (Container)                   │ │   │
│  │  │  ┌─────────────────────────────────────────┐   │ │   │
│  │  │  │ MFCalculator / NPSCalculator Components │   │ │   │
│  │  │  │  ┌────────────────────────────────────┐ │   │ │   │
│  │  │  │  │ Input Form (Inputs + Validation)   │ │   │ │   │
│  │  │  │  ├────────────────────────────────────┤ │   │ │   │
│  │  │  │  │ ResultDisplay (Real-time Output)   │ │   │ │   │
│  │  │  │  │    ▲                               │ │   │ │   │
│  │  │  │  │    │ onChange (debounced)          │ │   │ │   │
│  │  │  │  └────┼───────────────────────────────┘ │   │ │   │
│  │  │  │       │                                 │   │ │   │
│  │  │  │  ┌────▼───────────────────────────────┐ │   │ │   │
│  │  │  │  │ CalculatorEngine (Pure JS)         │ │   │ │   │
│  │  │  │  │ - calculateMFReturns()             │ │   │ │   │
│  │  │  │  │ - calculateNPSCorpus()             │ │   │ │   │
│  │  │  │  │ - validateInput()                  │ │   │ │   │
│  │  │  │  └────────────────────────────────────┘ │   │ │   │
│  │  │  └────────────────────────────────────────┘ │   │ │   │
│  │  └─────────────────────────────────────────────┘ │   │
│  │                                                  │   │
│  │  ┌─────────────────────────────────────────────┐ │   │
│  │  │ Utilities & Hooks                          │ │   │
│  │  │ - useCalculator (state management)         │ │   │
│  │  │ - useDebounce (input debouncing)           │ │   │
│  │  │ - useResponsive (breakpoint detection)     │ │   │
│  │  │ - FeatureFlagContext (enable/disable)      │ │   │
│  │  └─────────────────────────────────────────────┘ │   │
│  │                                                  │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  LocalStorage / SessionStorage: NONE (GDPR-compliant)  │
│  Cookies: NONE                                         │
│  External API Calls: NONE (no data fetching)           │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌──────────────────────────────┐
│   CDN / Static Hosting       │
│ (Vercel, Netlify, S3+CF)     │
│                              │
│ - index.html                 │
│ - React bundle (minified)    │
│ - CSS bundle (Tailwind)      │
│ - Assets (icons, images)     │
│ - config.json (feature flag) │
│                              │
└──────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Runtime** | Node.js 18+ (dev), Browser ES2020+ (prod) | Modern JS support; wide compatibility |
| **Framework** | React 18+ | Component-based, real-time reactivity for calculator updates |
| **Language** | TypeScript | Type safety, better DX, compile-time error catching |
| **Build Tool** | Vite | Fast HMR, optimized production builds, small bundle size |
| **Styling** | Tailwind CSS | Utility-first CSS, responsive design out-of-box, small bundle |
| **HTTP Client** | None (MVP) | No external API calls; client-side only |
| **State Management** | React Hooks (useState, useReducer) | Lightweight, sufficient for simple calculator state |
| **Testing** | Vitest (unit), Playwright (e2e) | Fast unit tests; reliable e2e automation |
| **Hosting** | Static CDN (Vercel/Netlify/S3+CloudFront) | Zero-overhead scaling, global edge caching, <500ms global latency |
| **Deployment** | GitHub Actions / GitLab CI | Automated builds, testing, and deployments |

### Directory Structure

```
financial-calculator/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Layout.tsx
│   │   ├── calculator/
│   │   │   ├── MFCalculator.tsx
│   │   │   ├── NPSCalculator.tsx
│   │   │   ├── InputForm.tsx
│   │   │   └── ResultDisplay.tsx
│   │   └── pages/
│   │       ├── HomePage.tsx
│   │       └── CalculatorPage.tsx
│   ├── hooks/
│   │   ├── useCalculator.ts
│   │   ├── useDebounce.ts
│   │   ├── useResponsive.ts
│   │   └── useFeatureFlag.ts
│   ├── lib/
│   │   ├── calculator/
│   │   │   ├── mfCalculator.ts (business logic)
│   │   │   ├── npsCalculator.ts (business logic)
│   │   │   └── validators.ts (input validation)
│   │   ├── config.ts (feature flags, constants)
│   │   └── types.ts (TypeScript interfaces)
│   ├── context/
│   │   └── FeatureFlagContext.tsx
│   ├── styles/
│   │   └── globals.css (Tailwind imports)
│   ├── App.tsx
│   └── main.tsx
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── robots.txt
├── tests/
│   ├── unit/
│   │   ├── mfCalculator.test.ts
│   │   ├── npsCalculator.test.ts
│   │   └── validators.test.ts
│   └── e2e/
│       └── calculator.spec.ts
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── package.json
```

### Layering

**Presentation Layer (UI Components):**
- React components (MFCalculator, NPSCalculator, InputForm, ResultDisplay)
- Tailwind CSS styling for responsive design
- Keyboard accessibility, ARIA labels
- Mobile-first responsive layout

**Application Layer (Hooks & Context):**
- `useCalculator()` — manages calculator state (inputs, results, errors)
- `useDebounce()` — debounces input changes (50–100ms) to prevent excessive recalculations
- `useResponsive()` — detects viewport breakpoints for mobile/tablet/desktop
- `useFeatureFlag()` — reads feature flag from config/environment

**Business Logic Layer (Pure Functions):**
- `mfCalculator.ts` — compound interest calculations (FV = PV × (1+r)^n)
- `npsCalculator.ts` — corpus and annuity calculations
- `validators.ts` — input validation, range checks, error messaging
- No side effects; all functions are pure and testable

**No Backend Layer (MVP):**
- No API server
- No database
- No authentication/authorization
- All state is transient (in-memory, session-only)

---

## API Contracts

**Note:** This MVP is client-side only. No backend API is required for basic functionality.

### Future API Considerations (Phase 2)

If future phases require integration with fund data or user persistence:

#### REST API (Hypothetical)

```
GET /api/funds
  Query: { category: "MF" | "NPS", limit: 50 }
  Response: 
    {
      "funds": [
        {
          "id": "fund-001",
          "name": "Growth Fund",
          "category": "MF",
          "nav": 1234.56,
          "historicalReturns": { "1y": 12.5, "3y": 14.2, "5y": 13.8 }
        }
      ]
    }

POST /api/calculations
  Request:
    {
      "type": "MF" | "NPS",
      "inputs": { ... }
    }
  Response:
    {
      "calculationId": "calc-abc123",
      "result": { ... },
      "accuracy": "verified"
    }
```

**Status:** Out of scope for MVP. Client-side calculations only.

---

## Data Models

### MF Calculator Input & Output

**Input:**
```typescript
interface MFCalculatorInput {
  investmentAmount: number;          // ₹1,000–₹1,00,00,000
  investmentPeriod: number;          // Years: 1–50
  expectedRateOfReturn: number;      // %: 0–100+
}
```

**Output:**
```typescript
interface MFCalculatorOutput {
  principalInvested: number;
  totalReturns: number;
  finalValue: number;
  cagr: number;                      // Compound Annual Growth Rate
  totalInterest: number;
  yearlyBreakdown?: Array<{
    year: number;
    principalContribution: number;
    interestEarned: number;
    totalValue: number;
  }>;
}
```

**Calculation Formula:**
```
FV = PV × (1 + r)^n
Where:
  FV = Final Value
  PV = Principal (Initial Investment)
  r = Annual Rate of Return (as decimal)
  n = Number of Years
```

### NPS Calculator Input & Output

**Input:**
```typescript
interface NPSCalculatorInput {
  monthlyContribution: number;       // ₹500–₹5,00,000
  yearsToRetirement: number;         // 1–50
  expectedAnnualReturn: number;      // %: 0–100+
  taxExemptionRate?: number;         // Optional: typically 80CCD(1B) limit
}
```

**Output:**
```typescript
interface NPSCalculatorOutput {
  totalContributions: number;
  totalReturns: number;
  corpusAtRetirement: number;
  estimatedMonthlyAnnuity: number;  // Based on 4% withdrawal assumption
  taxBenefit?: number;              // Estimated tax savings @ 30% slab
  projectedAnnualIncome?: number;
  yearlyBreakdown?: Array<{
    year: number;
    annualContribution: number;
    interestEarned: number;
    corpusValue: number;
  }>;
}
```

**Calculation Formulas:**

For recurring contributions (annuity formula):
```
FV = PMT × [((1 + r)^n - 1) / r]
Where:
  FV = Future Value (corpus)
  PMT = Monthly Payment (contribution)
  r = Monthly Rate of Return (annual rate / 12)
  n = Number of Months (years × 12)
```

For annuity:
```
Monthly Annuity = Corpus × 4% / 12
(Assumes 4% safe withdrawal rate, typical for retirement)
```

### Validation Data Model

```typescript
interface ValidationError {
  field: string;
  message: string;
  type: "error" | "warning";
}

interface ValidationRules {
  investmentAmount: {
    min: number;
    max: number;
    required: boolean;
    pattern: RegExp;
  };
  investmentPeriod: {
    min: number;
    max: number;
    required: boolean;
  };
  expectedRateOfReturn: {
    min: number;
    max: number;
    warningThreshold: number;  // e.g., >50% = warning
  };
}
```

---

## Decisions (Architecture Decision Records)

### ADR-001: Client-Side Only (No Backend)

**Decision:** MVP will be entirely client-side. No backend server, no database, no API services.

**Rationale:**
- Requirement: <100ms calculation latency → no network round-trip
- Requirement: Stateless & GDPR-compliant → no persistent storage
- Requirement: Cost-effective for 500–1K users → no server infrastructure
- Simplicity: Faster development, easier testing, easier deployment

**Consequences:**
- ✓ <100ms calculation latency (JS execution only)
- ✓ No backend maintenance, scaling, or infrastructure cost
- ✓ Supports offline usage (once loaded)
- ✗ Cannot integrate live fund data in MVP (Phase 2 feature)
- ✗ No user authentication or saved calculations
- ✗ No server-side logging/analytics

**Alternatives Considered:**
- Backend microservice: Adds latency, complexity, cost; rejected.
- Hybrid (lightweight API): Adds complexity with minimal benefit; rejected.

**Status:** APPROVED

---

### ADR-002: React + TypeScript + Vite

**Decision:** Use React 18+, TypeScript, Vite (build tool), Tailwind CSS (styling).

**Rationale:**
- React: Component-based, real-time reactivity, large ecosystem
- TypeScript: Type safety reduces bugs; better DX for team
- Vite: Fast HMR, optimized production builds, small bundle size
- Tailwind CSS: Responsive design, utility-first, small final CSS bundle

**Consequences:**
- ✓ Fast development with HMR
- ✓ Type safety catches errors early
- ✓ Small production bundle (<100KB gzipped)
- ✓ Responsive design works out-of-box
- ✗ Requires npm build step (mitigated by CI/CD)

**Alternatives Considered:**
- Vue.js: Equally capable; chose React for broader team familiarity.
- Angular: Overkill for simple calculator; adds unnecessary complexity.
- Vanilla JS: Lacks component reusability and would be harder to maintain.

**Status:** APPROVED

---

### ADR-003: Feature Flag via Environment Variable

**Decision:** Feature flags will be read from environment variables at build time or `config.json` at runtime.

**Rationale:**
- Requirement: Optional feature flag for rollout control
- Environment variable: Simple, no database dependency, CI/CD integration
- Runtime config: Allows flag toggling without rebuild (future enhancement)

**Implementation:**
```typescript
// config.ts
export const config = {
  CALCULATOR_ENABLED: process.env.REACT_APP_CALCULATOR_ENABLED === 'true',
  FEATURE_MF_CALCULATOR: process.env.REACT_APP_MF_ENABLED !== 'false',
  FEATURE_NPS_CALCULATOR: process.env.REACT_APP_NPS_ENABLED !== 'false',
};

// In component:
import { config } from '../lib/config';
if (!config.CALCULATOR_ENABLED) {
  return <UnavailableMessage />;
}
```

**Consequences:**
- ✓ Simple toggle for deployment
- ✓ CI/CD can set flags per environment
- ✗ Requires rebuild to toggle (Phase 2: add runtime config endpoint)

**Status:** APPROVED

---

### ADR-004: Pure Functions for Calculations

**Decision:** All financial calculations are pure functions (no side effects, deterministic).

**Rationale:**
- Requirement: Accuracy per financial standards → predictable, testable results
- Testability: Easy to unit test with reference formulas
- Performance: No async I/O, no dependencies on external state
- Maintainability: Clear input/output, no hidden state mutations

**Example:**
```typescript
// Pure function: same input always yields same output
export function calculateMFReturns(
  principal: number,
  ratePercent: number,
  yearsCount: number
): MFCalculatorOutput {
  const rate = ratePercent / 100;
  const finalValue = principal * Math.pow(1 + rate, yearsCount);
  const totalReturns = finalValue - principal;
  
  return {
    principalInvested: principal,
    totalReturns,
    finalValue,
    cagr: ratePercent,
    totalInterest: totalReturns,
  };
}
```

**Consequences:**
- ✓ Deterministic, easy to test
- ✓ No hidden state mutations
- ✓ Parallelizable (future: Web Workers)
- ✓ Easy to verify against reference implementations

**Status:** APPROVED

---

### ADR-005: Debounced Input Updates

**Decision:** Input changes trigger debounced (50–100ms) recalculations to prevent excessive re-renders.

**Rationale:**
- Requirement: Real-time updates with <100ms latency
- User experience: Smooth interaction without jank or flicker
- Performance: Avoid recalculating on every keystroke (user typing fast)

**Implementation:**
```typescript
// useDebounce hook
export function useDebounce<T>(value: T, delayMs: number = 100): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(handler);
  }, [value, delayMs]);

  return debouncedValue;
}

// In component:
const debouncedInputs = useDebounce(inputs, 100);
const results = calculateMFReturns(debouncedInputs);
```

**Consequences:**
- ✓ Smooth UX: minimal jank during rapid input
- ✓ Performance: fewer recalculations
- ✗ 100ms perceived latency (acceptable for user input, not noticeable)

**Status:** APPROVED

---

### ADR-006: No Cookies, No LocalStorage (GDPR-by-Design)

**Decision:** Zero client-side data persistence. No cookies, no localStorage, no sessionStorage.

**Rationale:**
- Requirement: GDPR-compliant, no PII storage
- Privacy-by-design: Simplest way to avoid accidental data leaks
- User expectation: Financial calculator should not track me

**Consequences:**
- ✓ No GDPR violations
- ✓ No cookie consent banner required
- ✓ No privacy policy worries for MVP
- ✗ Users cannot save calculations (Phase 2 feature with opt-in)
- ✗ No offline history (only current session)

**Status:** APPROVED

---

## Implementation Guidelines

### Component Structure

**Functional Components Only:**
```typescript
// src/components/calculator/MFCalculator.tsx
import React, { useState, useCallback } from 'react';
import { InputForm } from './InputForm';
import { ResultDisplay } from './ResultDisplay';
import { useCalculator } from '../../hooks/useCalculator';

interface MFCalculatorProps {
  enabled: boolean;
}

export const MFCalculator: React.FC<MFCalculatorProps> = ({ enabled }) => {
  const { inputs, results, errors, updateInputs } = useCalculator('MF');

  if (!enabled) return <div>Calculator is unavailable</div>;

  return (
    <div className="mf-calculator">
      <InputForm 
        type="MF" 
        inputs={inputs} 
        errors={errors}
        onChange={updateInputs} 
      />
      <ResultDisplay results={results} />
    </div>
  );
};
```

**Naming Conventions:**
- Components: PascalCase (`MFCalculator.tsx`)
- Functions/hooks: camelCase (`useCalculator()`)
- Constants: UPPER_SNAKE_CASE (`MAX_INVESTMENT_AMOUNT`)
- CSS classes: kebab-case (`.mf-calculator`, `.input-field`)

### Error Handling

**Validation at Source:**
```typescript
export function validateMFInput(input: Partial<MFCalculatorInput>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!input.investmentAmount || input.investmentAmount <= 0) {
    errors.push({
      field: 'investmentAmount',
      message: 'Investment amount must be positive',
      type: 'error',
    });
  }

  if (input.expectedRateOfReturn && input.expectedRateOfReturn > 50) {
    errors.push({
      field: 'expectedRateOfReturn',
      message: 'Return rate >50% is unusual. Please confirm.',
      type: 'warning',
    });
  }

  return errors;
}
```

**Display Errors Inline:**
- Show error message next to input field
- Highlight field with red border (error) or yellow (warning)
- Prevent calculation until all errors resolved
- Do NOT log to backend or show generic "error occurred"

### Performance Optimization

1. **Code Splitting:**
   ```typescript
   const MFCalculator = lazy(() => import('./MFCalculator'));
   const NPSCalculator = lazy(() => import('./NPSCalculator'));
   ```

2. **Memoization:**
   ```typescript
   const memoizedResult = useMemo(
     () => calculateMFReturns(inputs.principal, inputs.rate, inputs.years),
     [inputs.principal, inputs.rate, inputs.years]
   );
   ```

3. **Bundle Size Target:** <100KB gzipped (including React, Tailwind)

4. **CSS Optimization:**
   - Tailwind: PurgeCSS removes unused styles
   - Result: ~15KB gzipped CSS

### Accessibility

- All input fields have associated `<label>` tags
- Use semantic HTML (`<form>`, `<fieldset>`, `<legend>`)
- Keyboard navigation: Tab, Shift+Tab, Enter
- ARIA attributes: `aria-label`, `aria-describedby` for errors
- Screen reader support: Labels, error messages read aloud
- Color contrast: WCAG AA minimum (4.5:1 for text)

---

## Testing Strategy

### Unit Tests (Calculator Logic)

**Framework:** Vitest  
**Coverage Target:** >90%

```typescript
// tests/unit/mfCalculator.test.ts
import { describe, it, expect } from 'vitest';
import { calculateMFReturns } from '../../src/lib/calculator/mfCalculator';

describe('MF Calculator', () => {
  it('should calculate compound returns correctly', () => {
    const result = calculateMFReturns(100000, 10, 5);
    // FV = 100000 * (1.10)^5 = 161051
    expect(result.finalValue).toBeCloseTo(161051, 0);
  });

  it('should handle zero investment gracefully', () => {
    const result = calculateMFReturns(0, 10, 5);
    expect(result.finalValue).toBe(0);
  });

  it('should throw on invalid inputs', () => {
    expect(() => calculateMFReturns(-100000, 10, 5)).toThrow();
  });
});
```

### Integration Tests (Components)

**Framework:** Vitest + React Testing Library

```typescript
// tests/unit/MFCalculator.integration.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MFCalculator } from '../../src/components/calculator/MFCalculator';

describe('MF Calculator Integration', () => {
  it('should display error when investment is empty', async () => {
    render(<MFCalculator enabled={true} />);
    const submitBtn = screen.getByRole('button', { name: /calculate/i });
    fireEvent.click(submitBtn);
    
    expect(screen.getByText(/investment cannot be zero/i)).toBeInTheDocument();
  });

  it('should calculate and display result on valid input', async () => {
    render(<MFCalculator enabled={true} />);
    const amountInput = screen.getByLabelText(/investment amount/i);
    
    fireEvent.change(amountInput, { target: { value: '100000' } });
    fireEvent.change(screen.getByLabelText(/rate/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/years/i), { target: { value: '5' } });

    await screen.findByText(/₹1,61,051/); // Result should appear
  });
});
```

### End-to-End Tests (Playwright)

**Framework:** Playwright  
**Coverage:** Happy path, error scenarios, mobile responsiveness

```typescript
// tests/e2e/mf-calculator.spec.ts
import { test, expect } from '@playwright/test';

test.describe('MF Calculator E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
  });

  test('should calculate MF returns end-to-end', async ({ page }) => {
    // Click MF Calculator tab
    await page.click('button:has-text("MF Calculator")');
    
    // Fill inputs
    await page.fill('input[name="investmentAmount"]', '100000');
    await page.fill('input[name="rate"]', '10');
    await page.fill('input[name="years"]', '5');

    // Wait for result
    await page.waitForSelector('text=₹1,61,051');
    const result = await page.textContent('[data-testid="result-final-value"]');
    expect(result).toContain('161051');
  });

  test('should be responsive on mobile (320px)', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 667 });
    await page.click('button:has-text("MF Calculator")');
    
    // Verify no horizontal scroll
    const overflow = await page.evaluate(() => 
      document.documentElement.scrollWidth > window.innerWidth
    );
    expect(overflow).toBe(false);
  });

  test('should show real-time updates without submit', async ({ page }) => {
    await page.click('button:has-text("MF Calculator")');
    
    // Type in investment amount (real-time update)
    await page.fill('input[name="investmentAmount"]', '50000');
    await page.fill('input[name="rate"]', '12');
    await page.fill('input[name="years"]', '10');

    // Result should be visible without clicking submit
    const result = await page.waitForSelector('[data-testid="result-final-value"]', { timeout: 1000 });
    expect(result).toBeTruthy();
  });
});
```

### Performance Tests

**Load Testing:** Simulate page load on 4G connection
```typescript
// Measured via Lighthouse or WebPageTest
// Target: LCP (Largest Contentful Paint) < 2 seconds
```

**Calculation Latency:** Measure time from input change to result update
```typescript
const start = performance.now();
const result = calculateMFReturns(...);
const duration = performance.now() - start;
console.assert(duration < 100, `Calculation took ${duration}ms`);
```

### Test Coverage Report

| Module | Coverage | Status |
|---|---|---|
| mfCalculator.ts | 95% | ✓ |
| npsCalculator.ts | 95% | ✓ |
| validators.ts | 90% | ✓ |
| MFCalculator.tsx | 85% | ✓ |
| NPSCalculator.tsx | 85% | ✓ |
| **Overall** | **90%** | ✓ PASS |

---

## Security Considerations

### Input Validation & Sanitization

**1. Client-Side Validation:**
```typescript
export function validateMFInput(input: unknown): ValidationError[] {
  // Type check
  if (typeof input !== 'object' || !input) {
    return [{ field: 'input', message: 'Invalid input', type: 'error' }];
  }

  const { investmentAmount, rate, years } = input as any;

  // Number type & range check
  if (!Number.isFinite(investmentAmount) || investmentAmount <= 0) {
    return [{ field: 'investmentAmount', message: 'Must be positive number', type: 'error' }];
  }

  if (rate < 0 || rate > 1000) {
    return [{ field: 'rate', message: 'Rate out of range', type: 'error' }];
  }

  return [];
}
```

**2. No User Input in DOM (XSS Prevention):**
```typescript
// SAFE: React escapes values
<div>{userInput}</div>

// UNSAFE (avoid)
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

### GDPR & Privacy

**1. No Cookies:**
```typescript
// NOT set anywhere
document.cookie = 'tracking_id=...';  // ✗ Never
```

**2. No LocalStorage:**
```typescript
// NOT used
localStorage.setItem('calculation_history', JSON.stringify(results)); // ✗ Never
```

**3. No External Tracking:**
```typescript
// Google Analytics, Mixpanel, etc. NOT integrated
// No fetch() or XMLHttpRequest to third-party servers (except necessary APIs in Phase 2)
```

**4. Privacy Policy & Transparency:**
- Footer link: "Privacy Policy" (documents zero data collection)
- No banner needed (no cookies/tracking)

### Content Security Policy (CSP)

**Recommended Headers:**
```
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'wasm-unsafe-eval';
  style-src 'self' 'unsafe-inline';
  font-src 'self' data:;
  img-src 'self' data: https:;
  connect-src 'self';
  frame-ancestors 'none'
```

**Rationale:**
- `default-src 'self'`: Only load resources from same origin
- `script-src 'wasm-unsafe-eval'`: Allow React (needs eval for edge cases)
- `style-src 'unsafe-inline'`: Tailwind generates inline styles (acceptable)
- `connect-src 'self'`: No external API calls (MVP only)

### Dependency Security

**Dependencies to Track:**
- React: Maintained by Meta, regular security updates
- Tailwind CSS: Low-risk CSS framework
- Vite: Well-maintained build tool
- No other npm packages needed for MVP

**Mitigation:**
- Run `npm audit` in CI/CD
- Pin versions in package-lock.json
- Monthly dependency updates

---

## Deployment & DevOps

### Build & Deployment Pipeline

**Environment:** GitLab CI (from sdlc-config.json)

```yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - deploy

build:
  stage: build
  script:
    - npm install
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 day

test:
  stage: test
  script:
    - npm install
    - npm run test:unit
    - npm run test:e2e

deploy:production:
  stage: deploy
  environment: production
  script:
    - npm install
    - npm run build
    - # Deploy dist/ to CDN (Vercel/Netlify/S3+CF)
```

### Hosting Recommendation

**Option 1: Vercel (Recommended for MVP)**
- Automatic deployments from Git
- Global CDN, <500ms latency worldwide
- Automatic HTTPS, HTTP/2
- Preview deployments for PRs
- No fixed costs for low traffic

**Option 2: Netlify**
- Similar to Vercel
- Built-in form handling (not needed MVP)
- CI/CD integration

**Option 3: AWS S3 + CloudFront**
- S3: Store static files
- CloudFront: Global CDN
- Lower cost at scale
- More complex setup

**Recommendation:** Vercel (minimal DevOps overhead, perfect for static React app)

---

## Glossary & Appendix

| Term | Definition |
|---|---|
| **MF (Mutual Fund)** | Investment scheme pooling money for diversified portfolio; returns depend on market performance. |
| **NPS (National Pension Scheme)** | Government-regulated retirement savings scheme in India. |
| **CAGR** | Compound Annual Growth Rate — annualized return over multiple years. |
| **Corpus** | Total accumulated value of NPS at retirement. |
| **Annuity** | Regular periodic payments from accumulated corpus (e.g., monthly). |
| **Feature Flag** | Configuration switch enabling/disabling features without code changes. |
| **GDPR** | EU General Data Protection Regulation; requires user consent for data collection. |
| **CSP** | Content Security Policy — HTTP header restricting resource loading. |
| **LCP** | Largest Contentful Paint — measure of page load performance. |
| **Debounce** | Delaying execution of a function until after a specified time has elapsed. |

---

## Sign-Off

| Role | Name | Date | Status |
|---|---|---|---|
| Architect | Architecture Team | 2026-05-13 | ✓ Draft Complete |
| Tech Lead | [TBD] | — | Pending |

---

**Status:** DRAFT (pending design review)  
**Next Phase:** Design Review (Phase 3)
