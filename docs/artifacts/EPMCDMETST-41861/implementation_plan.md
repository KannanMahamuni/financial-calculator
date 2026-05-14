# Implementation Plan — EPMCDMETST-41861: Financial Calculator

## Meta

| Field | Value |
|---|---|
| **Feature ID** | FEAT-0001 |
| **Ticket** | EPMCDMETST-41861 |
| **Title** | Financial Calculator Website for MF and NPS |
| **Tech Stack** | React 18+, TypeScript, Vite, Tailwind CSS, Vitest, Playwright |
| **Team Size** | 2 developers |
| **Sprint Duration** | 2 weeks (10 business days) |
| **Estimated Effort** | 44 hours (covers setup, build, test, deploy) |
| **Delivery Target** | Fully functional MVP, 90%+ unit test coverage, deployed to staging |
| **Status** | Ready for Implementation |

---

## Implementation Strategy

### Approach: Wave-Based Topological Sequencing

Implementation is divided into 4 **dependency-ordered waves**. Each wave completes before the next begins, ensuring no blocked tasks.

```
Wave 0 (Setup & Config)
    ↓
Wave 1 (Business Logic)
    ↓
Wave 2 (Hooks & State Management)
    ↓
Wave 3 (React Components)
    ↓
Wave 4 (Routing, Pages, E2E Tests, Deployment)
```

### Timeline: 7-Day Sprint (10 Business Days)

| Period | Deliverable |
|---|---|
| **Day 1** | Project setup complete; TypeScript types defined; CI/CD skeleton |
| **Day 2** | Business logic (MF, NPS, validators) + unit tests (95%+ coverage) |
| **Day 3** | Hooks + context + state management |
| **Day 4–5** | React components (all forms, displays, layouts) + integration tests |
| **Day 6** | Routing, pages, error pages, feature flag integration |
| **Day 7** | E2E tests, performance testing, deployment to staging |

---

## Implementation Steps

### Wave 0: Project Setup & Configuration (Day 1, 6h)

**TASK-001: Initialize Vite + React + TypeScript**
- Create React 18+ app with Vite
- Configure TypeScript (strict mode)
- Set up .gitignore, .env templates
- Effort: 1h
- Files Created: `vite.config.ts`, `tsconfig.json`, `src/main.tsx`, `src/App.tsx`

**TASK-002: Configure Tailwind CSS**
- Install Tailwind CSS v3
- Set up PurgeCSS for production optimization
- Create `tailwind.config.js`, `globals.css`
- Effort: 0.5h
- Files Created: `tailwind.config.js`, `src/styles/globals.css`

**TASK-003: Set Up Testing Infrastructure**
- Initialize Vitest for unit tests
- Install @testing-library/react for integration tests
- Install Playwright for e2e tests
- Configure test runners (unit, integration, e2e)
- Effort: 1.5h
- Files Created: `vitest.config.ts`, `playwright.config.ts`, `tests/setup.ts`

**TASK-004: CI/CD Skeleton & Git**
- Initialize Git repo
- Create GitHub Actions / GitLab CI pipeline (skeleton)
- Add dependency audit checks
- Add bundle size monitoring
- Effort: 1.5h
- Files Created: `.github/workflows/ci.yml` or `.gitlab-ci.yml`, `.github/dependabot.yml`

**TASK-005: Project Structure & Types**
- Create base directory structure (src/components, src/lib, src/hooks, etc.)
- Define TypeScript interfaces for calculator inputs/outputs (validation, MF, NPS)
- Define error types and constants
- Effort: 1.5h
- Files Created: `src/lib/types.ts`, `src/lib/constants.ts`, `src/lib/config.ts`

**Dependencies:** None (Wave 0 is the foundation)

---

### Wave 1: Business Logic & Unit Tests (Day 2, 8h)

**TASK-006: Implement MF Calculator Engine**
- Write pure function: `calculateMFReturns(principal, rate, years) => MFCalculatorOutput`
- Handle edge cases (zero principal, extreme rates, negative inputs)
- Formula: FV = PV × (1+r)^n
- Effort: 1.5h
- Files Created: `src/lib/calculator/mfCalculator.ts`

**TASK-007: Implement NPS Calculator Engine**
- Write pure functions:
  - `calculateNPSCorpus(monthlyContribution, years, rate) => NPSCalculatorOutput`
  - `calculateAnnuity(corpus, withdrawalRate) => monthlyAnnuity`
- Handle recurring contributions (annuity formula)
- Effort: 1.5h
- Files Created: `src/lib/calculator/npsCalculator.ts`

**TASK-008: Input Validation**
- Write `validators.ts` with:
  - `validateMFInput(input) => ValidationError[]`
  - `validateNPSInput(input) => ValidationError[]`
  - Range checks, type checks, error messages
- Effort: 1h
- Files Created: `src/lib/calculator/validators.ts`

**TASK-009: Unit Tests (MF Calculator)**
- Test `calculateMFReturns()` against reference formulas
- Test edge cases (0 principal, extreme rates, negative inputs)
- Test accuracy within 0.01% tolerance
- Target: 95%+ coverage
- Effort: 1.5h
- Files Created: `tests/unit/mfCalculator.test.ts`

**TASK-010: Unit Tests (NPS Calculator)**
- Test `calculateNPSCorpus()` with various contribution schedules
- Test annuity calculation
- Test accuracy within 0.5% tolerance
- Target: 95%+ coverage
- Effort: 1.5h
- Files Created: `tests/unit/npsCalculator.test.ts`

**TASK-011: Unit Tests (Validators)**
- Test valid inputs pass validation
- Test invalid inputs return appropriate errors
- Test boundary conditions
- Target: 90%+ coverage
- Effort: 1h
- Files Created: `tests/unit/validators.test.ts`

**Dependencies:** TASK-001 (types), TASK-003 (test setup)

---

### Wave 2: Hooks & State Management (Day 3, 6h)

**TASK-012: Implement useCalculator Hook**
- State management for calculator (inputs, results, errors)
- Handle input changes, reset functionality
- Manage error state
- Effort: 2h
- Files Created: `src/hooks/useCalculator.ts`

**TASK-013: Implement useDebounce Hook**
- Debounce input changes (100ms delay)
- Prevent excessive recalculations during rapid typing
- Effort: 1h
- Files Created: `src/hooks/useDebounce.ts`

**TASK-014: Implement useResponsive Hook**
- Detect viewport breakpoints (mobile 320px, tablet 768px, desktop 1920px)
- Update on window resize
- Effort: 1h
- Files Created: `src/hooks/useResponsive.ts`

**TASK-015: Implement useFeatureFlag Hook**
- Read feature flag from config or environment
- Provide `isCalculatorEnabled()`, `isMFEnabled()`, `isNPSEnabled()`
- Effort: 1h
- Files Created: `src/hooks/useFeatureFlag.ts`

**TASK-016: Create FeatureFlagContext**
- Provide feature flags to all components
- Wrap App with context provider
- Effort: 1h
- Files Created: `src/context/FeatureFlagContext.tsx`

**Dependencies:** TASK-006, TASK-007, TASK-008 (calculator logic)

---

### Wave 3: React Components (Days 4–5, 11h)

**TASK-017: Implement InputForm Component**
- Generic input form for MF/NPS calculators
- Input fields with labels, placeholders, validation messages
- Real-time validation feedback (inline error messages)
- Responsive layout (Tailwind CSS)
- Effort: 2h
- Files Created: `src/components/calculator/InputForm.tsx`

**TASK-018: Implement ResultDisplay Component**
- Display calculation results (final value, returns, corpus, annuity)
- Formatted numbers (₹ currency, 2 decimal places)
- Mobile-responsive layout
- Effort: 1.5h
- Files Created: `src/components/calculator/ResultDisplay.tsx`

**TASK-019: Implement MFCalculator Component**
- Container component for MF calculator
- Integrate InputForm + ResultDisplay + useCalculator hook
- Real-time calculation on input change (debounced)
- Responsive mobile/tablet/desktop
- Effort: 1.5h
- Files Created: `src/components/calculator/MFCalculator.tsx`

**TASK-020: Implement NPSCalculator Component**
- Container component for NPS calculator
- Integrate InputForm + ResultDisplay + useCalculator hook
- Real-time calculation on input change (debounced)
- Responsive mobile/tablet/desktop
- Effort: 1.5h
- Files Created: `src/components/calculator/NPSCalculator.tsx`

**TASK-021: Implement Layout Components**
- Header component (logo, title, navigation)
- Footer component (copyright, privacy link)
- Layout wrapper component
- Effort: 1.5h
- Files Created: `src/components/common/Header.tsx`, `src/components/common/Footer.tsx`, `src/components/common/Layout.tsx`

**TASK-022: Integration Tests (Components)**
- Test InputForm with valid/invalid inputs
- Test real-time calculation updates
- Test error message display
- Test responsive layout adjustments
- Target: 85%+ coverage
- Effort: 2h
- Files Created: `tests/integration/components.test.tsx`

**TASK-023: Styling & Responsive Design**
- Fine-tune Tailwind CSS classes for all components
- Verify mobile (320px), tablet (768px), desktop (1920px) layouts
- Color scheme, spacing, typography
- Effort: 1h
- Files Created: `src/styles/components.css` (if needed)

**Dependencies:** TASK-012 (useCalculator hook), TASK-013 (useDebounce hook), TASK-014 (useResponsive hook)

---

### Wave 4: Routing, Pages, E2E Tests & Deployment (Days 6–7, 13h)

**TASK-024: Implement React Router**
- Set up React Router v6
- Create routes: `/`, `/mf-calculator`, `/nps-calculator`, `/about`, 404 page
- Lazy load calculator pages (code splitting)
- Effort: 1.5h
- Files Created: `src/components/Router.tsx`, `src/components/pages/HomePage.tsx`, `src/components/pages/CalculatorPage.tsx`, `src/components/pages/NotFoundPage.tsx`

**TASK-025: Integrate Feature Flag**
- Wrap calculator routes with feature flag check
- Show "Calculator Unavailable" message when flag disabled
- Effort: 1h
- Files Created: `src/components/FeatureFlagGuard.tsx`

**TASK-026: E2E Tests (Happy Path)**
- Test MF calculator end-to-end (input → result)
- Test NPS calculator end-to-end (input → corpus + annuity)
- Test real-time updates
- Effort: 2h
- Files Created: `tests/e2e/mf-calculator.spec.ts`, `tests/e2e/nps-calculator.spec.ts`

**TASK-027: E2E Tests (Mobile Responsiveness)**
- Test layout on 320px (mobile), 768px (tablet), 1920px (desktop)
- Test device rotation (portrait ↔ landscape)
- Test touch interactions
- Effort: 1.5h
- Files Created: `tests/e2e/responsive.spec.ts`

**TASK-028: E2E Tests (Error Scenarios)**
- Test negative input rejection
- Test zero input rejection
- Test non-numeric input handling
- Test feature flag disable scenario
- Effort: 1.5h
- Files Created: `tests/e2e/error-scenarios.spec.ts`

**TASK-029: Performance Testing**
- Measure page load time (LCP) on 4G throttle
- Measure calculation latency (<100ms)
- Verify bundle size <110KB gzipped
- Effort: 1.5h
- Files Created: `tests/performance/performance.test.ts`

**TASK-030: Build & Deployment Setup**
- Configure Vite build optimization (minification, code splitting)
- Set up CI/CD pipeline (GitHub Actions or GitLab CI)
- Configure deployment to Vercel or Netlify
- Test staging deployment
- Effort: 3h
- Files Created: `.github/workflows/deploy.yml`, `vercel.json` or `netlify.toml`

**TASK-031: Security Audit**
- Verify no cookies/localStorage used
- Verify no external API calls (except future Phase 2)
- Verify no PII collection
- Run `npm audit`; fix any critical/high vulnerabilities
- Verify CSP headers
- Effort: 1h
- Files Created: `security-checklist.md`

**TASK-032: Documentation & Deployment Runbook**
- Create `ARCHITECTURE.md` (developer onboarding)
- Create `DEPLOYMENT.md` (how to deploy to production)
- Create `TROUBLESHOOTING.md` (common issues + fixes)
- Create calculator reference formulas documentation
- Effort: 1h
- Files Created: `docs/ARCHITECTURE.md`, `docs/DEPLOYMENT.md`, `docs/TROUBLESHOOTING.md`, `docs/calculation-reference.md`

**Dependencies:** TASK-019 (MFCalculator), TASK-020 (NPSCalculator), TASK-022 (integration tests)

---

## File Structure & Component Manifest

### Directory Tree (After Implementation)

```
financial-calculator/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx                  (TASK-021)
│   │   │   ├── Footer.tsx                  (TASK-021)
│   │   │   └── Layout.tsx                  (TASK-021)
│   │   ├── calculator/
│   │   │   ├── InputForm.tsx               (TASK-017)
│   │   │   ├── ResultDisplay.tsx           (TASK-018)
│   │   │   ├── MFCalculator.tsx            (TASK-019)
│   │   │   └── NPSCalculator.tsx           (TASK-020)
│   │   ├── pages/
│   │   │   ├── HomePage.tsx                (TASK-024)
│   │   │   ├── CalculatorPage.tsx          (TASK-024)
│   │   │   └── NotFoundPage.tsx            (TASK-024)
│   │   ├── FeatureFlagGuard.tsx            (TASK-025)
│   │   └── Router.tsx                      (TASK-024)
│   ├── hooks/
│   │   ├── useCalculator.ts                (TASK-012)
│   │   ├── useDebounce.ts                  (TASK-013)
│   │   ├── useResponsive.ts                (TASK-014)
│   │   └── useFeatureFlag.ts               (TASK-015)
│   ├── context/
│   │   └── FeatureFlagContext.tsx          (TASK-016)
│   ├── lib/
│   │   ├── types.ts                        (TASK-005)
│   │   ├── constants.ts                    (TASK-005)
│   │   ├── config.ts                       (TASK-005)
│   │   └── calculator/
│   │       ├── mfCalculator.ts             (TASK-006)
│   │       ├── npsCalculator.ts            (TASK-007)
│   │       └── validators.ts               (TASK-008)
│   ├── styles/
│   │   └── globals.css                     (TASK-002)
│   ├── App.tsx                             (TASK-001)
│   └── main.tsx                            (TASK-001)
├── tests/
│   ├── unit/
│   │   ├── mfCalculator.test.ts            (TASK-009)
│   │   ├── npsCalculator.test.ts           (TASK-010)
│   │   └── validators.test.ts              (TASK-011)
│   ├── integration/
│   │   └── components.test.tsx             (TASK-022)
│   ├── e2e/
│   │   ├── mf-calculator.spec.ts           (TASK-026)
│   │   ├── nps-calculator.spec.ts          (TASK-026)
│   │   ├── responsive.spec.ts              (TASK-027)
│   │   ├── error-scenarios.spec.ts         (TASK-028)
│   │   └── feature-flag.spec.ts            (TASK-028)
│   ├── performance/
│   │   └── performance.test.ts             (TASK-029)
│   └── setup.ts                            (TASK-003)
├── docs/
│   ├── ARCHITECTURE.md                     (TASK-032)
│   ├── DEPLOYMENT.md                       (TASK-032)
│   ├── TROUBLESHOOTING.md                  (TASK-032)
│   └── calculation-reference.md            (TASK-032)
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── robots.txt
├── .github/
│   └── workflows/
│       ├── ci.yml                          (TASK-004)
│       └── deploy.yml                      (TASK-030)
├── vite.config.ts                          (TASK-001)
├── tsconfig.json                           (TASK-001)
├── tailwind.config.js                      (TASK-002)
├── vitest.config.ts                        (TASK-003)
├── playwright.config.ts                    (TASK-003)
├── package.json
├── package-lock.json
├── .env.example
├── .env.local (not committed)
├── vercel.json (or netlify.toml)           (TASK-030)
├── security-checklist.md                   (TASK-031)
└── README.md

**Total Files:** 28 new, 6 config, 0 modifications to existing files
```

### Component Manifest

| Component | Purpose | Responsibility | Files |
|---|---|---|---|
| **MFCalculator** | Container for MF calculator | State mgmt, real-time updates, error handling | `MFCalculator.tsx`, `InputForm.tsx`, `ResultDisplay.tsx`, `mfCalculator.ts` |
| **NPSCalculator** | Container for NPS calculator | State mgmt, real-time updates, error handling | `NPSCalculator.tsx`, `InputForm.tsx`, `ResultDisplay.tsx`, `npsCalculator.ts` |
| **InputForm** | Generic input form | Accept user inputs, validate, show errors | `InputForm.tsx`, `validators.ts` |
| **ResultDisplay** | Display calculation results | Format & display results | `ResultDisplay.tsx` |
| **Layout** | App wrapper | Header, footer, main content area | `Header.tsx`, `Footer.tsx`, `Layout.tsx` |
| **Router** | Navigation | Route requests to correct page/calculator | `Router.tsx` |
| **FeatureFlagGuard** | Access control | Hide calculator if feature flag disabled | `FeatureFlagGuard.tsx`, `useFeatureFlag.ts` |

---

## Dependencies & Setup

### npm Packages to Install

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.x.x",
    "tailwindcss": "^3.x.x",
    "autoprefixer": "^10.x.x",
    "postcss": "^8.x.x"
  },
  "devDependencies": {
    "typescript": "^5.x.x",
    "@types/react": "^18.x.x",
    "@types/react-dom": "^18.x.x",
    "vite": "^4.x.x",
    "@vitejs/plugin-react": "^4.x.x",
    "vitest": "^0.34.x.x",
    "@testing-library/react": "^14.x.x",
    "@testing-library/jest-dom": "^6.x.x",
    "@playwright/test": "^1.40.x.x",
    "eslint": "^8.x.x",
    "prettier": "^3.x.x"
  }
}
```

**Total Packages:** ~15 core dependencies (lean stack, minimizes bundle size)

### Environment Configuration

**`.env.example`:**
```
REACT_APP_CALCULATOR_ENABLED=true
REACT_APP_MF_ENABLED=true
REACT_APP_NPS_ENABLED=true
REACT_APP_API_BASE_URL=http://localhost:3000
```

**Deployment (Vercel/Netlify):**
- Vercel auto-detects Vite build
- Netlify.toml specifies build command: `npm run build`
- Environment variables set in CI/CD platform

### Build & Run Commands

```bash
npm install              # Install dependencies
npm run dev              # Start dev server (localhost:5173)
npm run build            # Build for production (dist/)
npm run build:analyze    # Build + analyze bundle size
npm run test:unit        # Run unit tests
npm run test:integration # Run integration tests
npm run test:e2e         # Run e2e tests
npm run test:perf        # Run performance tests
npm run test:all         # Run all tests
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
npm run deploy           # Deploy to production (CI/CD)
```

---

## Testing Plan

### Unit Tests (Wave 1, Tasks 009–011)

**Files Created:**
- `tests/unit/mfCalculator.test.ts` (TASK-009)
- `tests/unit/npsCalculator.test.ts` (TASK-010)
- `tests/unit/validators.test.ts` (TASK-011)

**Coverage Target:** 95%+

**Test Scenarios:**

| Module | Tests | Expected Coverage |
|---|---|---|
| `mfCalculator.ts` | 8 tests (formula accuracy, edge cases, extremes) | 95% |
| `npsCalculator.ts` | 10 tests (corpus calc, annuity, edge cases) | 95% |
| `validators.ts` | 12 tests (valid inputs, range checks, errors) | 90% |
| **Total** | **30 unit tests** | **93% overall** |

### Integration Tests (Wave 3, Task 022)

**Files Created:**
- `tests/integration/components.test.tsx` (TASK-022)

**Coverage Target:** 85%+

**Test Scenarios:**
- InputForm + ResultDisplay integration
- Real-time calculation updates (debounce timing)
- Error message display
- Mobile layout responsiveness

| Component | Tests | Expected Coverage |
|---|---|---|
| MFCalculator.tsx | 4 integration tests | 85% |
| NPSCalculator.tsx | 4 integration tests | 85% |
| InputForm.tsx | 3 integration tests | 80% |
| **Total** | **11 integration tests** | **84% overall** |

### End-to-End Tests (Wave 4, Tasks 026–028)

**Files Created:**
- `tests/e2e/mf-calculator.spec.ts` (TASK-026)
- `tests/e2e/nps-calculator.spec.ts` (TASK-026)
- `tests/e2e/responsive.spec.ts` (TASK-027)
- `tests/e2e/error-scenarios.spec.ts` (TASK-028)

**Test Scenarios:**

| Scenario | Tests | Expected Outcome |
|---|---|---|
| **Happy Path (MF)** | 2 tests | Input → Calculate → Result ✓ |
| **Happy Path (NPS)** | 2 tests | Input → Calculate → Corpus + Annuity ✓ |
| **Real-Time Updates** | 2 tests | Debounced result update <100ms ✓ |
| **Mobile Responsive** | 3 tests | 320px, 768px, 1920px layouts ✓ |
| **Device Rotation** | 1 test | Portrait ↔ Landscape ✓ |
| **Error Scenarios** | 5 tests | Negative, zero, non-numeric inputs rejected ✓ |
| **Feature Flag** | 2 tests | Enabled: show calculator; Disabled: show message ✓ |
| **Performance** | 2 tests | Page load <2s, calc latency <100ms ✓ |
| **Total** | **19 e2e tests** | **All critical paths covered** |

### Test Execution Timeline

| Period | Task | Command |
|---|---|---|
| Day 2 end | Unit tests green | `npm run test:unit` → **30/30 PASS** |
| Day 4 end | Integration tests green | `npm run test:integration` → **11/11 PASS** |
| Day 7 morning | E2E tests green | `npm run test:e2e` → **19/19 PASS** |
| Day 7 end | All tests + performance | `npm run test:all && npm run test:perf` → **60/60 PASS** |

---

## Deployment Checklist

### Pre-Launch (Day 7, Morning)

- [ ] All tests passing (unit, integration, e2e)
- [ ] Bundle size <110KB gzipped verified
- [ ] Page load time <2s (4G), <500ms (broadband) verified
- [ ] Calculation latency <100ms verified
- [ ] No console errors on Chrome, Firefox, Safari, Edge
- [ ] Mobile layout verified (320px, 768px, 1920px)
- [ ] Feature flag integration tested
- [ ] Security audit passed (`npm audit` clean)
- [ ] No PII collection verified (no cookies, no localStorage)
- [ ] Privacy policy accessible in footer
- [ ] 404 page working
- [ ] Feature flag disable scenario tested

### Deployment (Day 7, Afternoon)

- [ ] Staging deployment successful (Vercel/Netlify preview URL)
- [ ] Smoke test on staging (MF calc, NPS calc, mobile, feature flag)
- [ ] CI/CD pipeline logs clean (no warnings)
- [ ] Staging URL working (https://, no mixed content)
- [ ] Performance metrics captured (LCP, FCP, CLS)

### Post-Launch (Day 8)

- [ ] Production deployment successful
- [ ] Production URL accessible
- [ ] Final smoke test on production
- [ ] Monitoring/alerts configured
- [ ] Team trained on deployment rollback procedure

---

## Risk Mitigation

### Risk-001: Bundle Size Exceeds 110KB

**Probability:** Medium  
**Impact:** High (fails performance requirement)

**Mitigation:**
- Add bundle analyzer in CI/CD (`npm run build:analyze`)
- Set hard limit: fail CI if gzip > 120KB
- Prioritize code-splitting (lazy load calculator pages)
- Remove unused CSS with Tailwind PurgeCSS

**Contingency:** If bundle > 120KB, defer non-critical features to Phase 2

---

### Risk-002: Calculation Accuracy Issues

**Probability:** Low  
**Impact:** High (violates REQ-009, breaks financial credibility)

**Mitigation:**
- Create `calculation-reference.md` before Phase 5 (MF & NPS formulas with test vectors)
- Every unit test compares against reference values
- Accuracy tolerance: MF ±0.01%, NPS ±0.5%
- Manual verification of 10+ random calculations before launch

**Contingency:** If accuracy issues found in QA, extend Phase 8 (Verification) by 1–2 days

---

### Risk-003: Mobile UX Issues

**Probability:** Medium  
**Impact:** Medium (breaks mobile-responsive requirement)

**Mitigation:**
- Test early & often on real devices (iPhone, Android)
- Use Chrome DevTools responsive mode + Playwright mobile tests
- Finalize mobile specs / Storybook by end of Day 3
- Get stakeholder review of mobile layouts before Day 5

**Contingency:** If major mobile issues, allocate 2h for emergency responsive fixes

---

### Risk-004: Feature Flag Complexity

**Probability:** Low  
**Impact:** Medium (deployment flexibility reduced)

**Mitigation:**
- Implement environment variable approach (simple, proven)
- Test feature flag disable scenario in e2e tests
- Document deployment procedure in `DEPLOYMENT.md`

**Contingency:** If feature flag not working, fall back to always-on for MVP; revisit in Phase 2

---

### Risk-005: Debounce Timing Feels Slow

**Probability:** Low  
**Impact:** Low (UX quality, not functional requirement)

**Mitigation:**
- Use 100ms debounce (standard)
- A/B test 50ms vs 100ms in QA phase (Phase 8)
- Gather user feedback post-launch

**Contingency:** Reduce debounce to 50ms if users perceive lag

---

## Pre-Implementation Baseline

**Before Phase 5 Starts:**

1. **Test Baseline:**
   ```bash
   npm test:unit
   # Expected: 0 PASS, 0 FAIL (no test files yet)
   
   npm test:unit -- --coverage
   # Expected: 0% coverage (no source code yet)
   ```

2. **Build Baseline:**
   ```bash
   npm run build
   # Expected: ~10KB gzipped (only React + Tailwind + main.tsx)
   ```

3. **Performance Baseline:**
   ```
   Lighthouse (empty app):
   - LCP (Largest Contentful Paint): ~500ms (broadband)
   - FCP (First Contentful Paint): ~300ms
   - CLS (Cumulative Layout Shift): 0
   ```

**End-of-Phase-5 Target:**

1. **Test Results:**
   ```
   ✓ 30 unit tests PASS (95%+ coverage)
   ✓ 11 integration tests PASS (85%+ coverage)
   ✓ 19 e2e tests PASS (all critical paths)
   ✓ Overall coverage: ~90%
   ```

2. **Build Size:**
   ```
   dist/ bundle: ~95KB gzipped (includes React, Tailwind, all components)
   ```

3. **Performance Metrics:**
   ```
   Page Load (4G throttle): ~1.8s (target: <2s) ✓
   Page Load (broadband): ~400ms (target: <500ms) ✓
   MF Calculation Latency: ~45ms (target: <100ms) ✓
   NPS Calculation Latency: ~50ms (target: <100ms) ✓
   ```

---

## Pipeline Continuation

### Deliverables at End of Phase 5 (Implementation)

1. ✅ Fully functional React app (MF + NPS calculators)
2. ✅ 90%+ unit test coverage (business logic)
3. ✅ 19 e2e smoke tests (all critical paths)
4. ✅ Deployed to staging (Vercel/Netlify preview URL)
5. ✅ Performance metrics captured
6. ✅ Security audit passed

### Phase 6: Simplification (Code Review & Refactoring)

**Focus:** Reduce complexity, improve code quality, eliminate duplication

- Use `@sdlc-simplify` agent
- Review recent git commits
- Identify refactoring opportunities
- Apply: Extract common components, reduce prop drilling, simplify hooks
- Output: `implementation.md` (Phase 5 summary + simplification notes)

### Phase 7: Code Review & Security Scan (Parallel)

**Focus:** Quality gate before verification

- Use `@code-review` agent (TypeScript/JS rules)
- Use `@security-scan` agent (OWASP Top 10, PII leakage, secrets)
- Fix critical/high findings
- Output: Review findings + recommendations

### Phase 8: Verification (Test Results & QA Verify)

**Focus:** Confirm implementation matches requirements

- Use `@sdlc-verify` agent (requirements traceability)
- Use `@sdlc-qa-verify` agent (run manual + e2e tests)
- Verify all 10 requirements met
- Output: `verification_report.md` + `qa_verification_report.md`

### Phase 9: Risk Assessment

**Focus:** Identify pre-ship risks and mitigation

- Use `@sdlc-risk` agent
- Evaluate: performance, security, scalability, maintainability risks
- Output: `risk_assessment.md` with recommendation (ship / ship_with_monitoring / fix_first)

### Phase 10: PR Creation

**Focus:** Open PR for implementation

- Invoke `/create-pr` prompt
- Open implementation PR on GitHub/GitLab
- Link to design_spec, requirements, verification_report
- Output: PR URL(s)

---

## Summary

| Metric | Value |
|---|---|
| **Total Tasks** | 32 |
| **Total Files** | 28 new |
| **Estimated Effort** | 44 hours |
| **Sprint Duration** | 7 days (2 weeks) |
| **Team Size** | 2 developers |
| **Unit Test Coverage** | 95%+ |
| **Integration Test Coverage** | 85%+ |
| **E2E Tests** | 19 critical paths |
| **Bundle Size Target** | <110KB gzipped |
| **Page Load Target** | <2s (4G), <500ms (broadband) |
| **Calculation Latency Target** | <100ms |

---

**Status:** READY FOR IMPLEMENTATION  
**Next Step:** Phase 5 — Execute Tasks in Wave Order (Day 1 onward)
