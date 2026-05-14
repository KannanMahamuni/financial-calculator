# Design Review — EPMCDMETST-41861: Financial Calculator

## Meta

| Field | Value |
|---|---|
| **Ticket** | EPMCDMETST-41861 |
| **Title** | Financial Calculator Website for MF and NPS |
| **Design Spec Version** | 1.0 |
| **Reviewed** | 2026-05-13 |
| **Reviewer** | Architecture Review Board |
| **Status** | Complete |

---

## Summary

**Verdict: `APPROVE`**

The architecture design is **solid, feasible, and well-justified**. All 10 requirements (4 P0, 4 P1, 2 P2) are clearly addressed. The client-side-only approach is appropriate for the constraints (greenfield, <100ms latency, GDPR-compliant, 500–1K users). Technology choices (React 18+, TypeScript, Vite, Tailwind) are well-reasoned with clear ADRs. Security & testing strategies are comprehensive. **No blocking issues; proceed to Phase 4 (Implementation Planning).**

---

## Findings

### ✅ STRENGTHS

| Finding | Strength | Impact |
|---|---|---|
| **F-001: Greenfield Advantage** | No legacy dependencies; clean slate enables optimal tech stack choice | High: Enables fast iteration, fewer constraints |
| **F-002: Client-Side-Only Rationale** | Excellent justification for <100ms latency requirement and GDPR compliance | High: Reduces infrastructure cost, simplifies deployment |
| **F-003: Pure Functions for Calculations** | Deterministic, testable, parallelizable business logic | High: Enables accurate test coverage (90%+) and reproducible results |
| **F-004: ADR Discipline** | 6 ADRs with clear rationale, alternatives considered, consequences documented | High: Architectural decisions are defensible and reversible |
| **F-005: Security-by-Design** | GDPR compliance built in (zero storage, no cookies); privacy-first approach | High: Reduces compliance risk and regulatory burden |
| **F-006: Performance-Focused Stack** | Vite for fast builds, Tailwind for small CSS, memoization for React, debouncing for UX | High: Achieves <2s (4G) / <500ms (broadband) targets |
| **F-007: Mobile-First Responsive Design** | Tailwind CSS responsive utilities; tested on 320px–1920px viewports | Medium: Achieves P1 requirement (mobile-responsive) |
| **F-008: Testing Strategy** | Unit (Vitest, 90%+), integration (React Testing Library), e2e (Playwright), performance tests | High: Clear testing path; achievable coverage |
| **F-009: Feature Flag Flexibility** | Environment variable + runtime config options; future-proof for Phase 2 | Medium: Enables phased rollout and A/B testing |

---

### ⚠️ CONCERNS (MINOR — All Resolvable)

| Finding | Concern | Severity | Recommendation | Effort |
|---|---|---|---|---|
| **C-001: Bundle Size Risk** | Target <100KB gzipped is aggressive with React 18 + Tailwind. Reality: likely 90–110KB. | Minor | Include bundle monitoring in CI/CD. Accept 110KB if necessary; gzip handles it. | Low |
| **C-002: Calculation Accuracy Tolerance** | Design specifies 0.01% tolerance for MF, 0.5% for NPS. Reference implementation needed to verify. | Minor | Create `reference-calculations.md` before Phase 5; unit tests must compare against it. | Low |
| **C-003: Error Message UX** | Design mentions "inline validation" but no mockup/wireframe. Implementation may vary. | Minor | Create Figma/Storybook component specs during Phase 5. Ensure consistency across MF/NPS. | Medium |
| **C-004: Debounce Timing (100ms)** | Chosen value is reasonable but untested. Faster users may perceive 100ms delay. | Minor | A/B test 50ms vs 100ms during QA (Phase 8). Accept 100ms if verified to feel responsive. | Low |
| **C-005: Feature Flag Deployment** | Environment variable approach requires rebuild to toggle. Phase 2 should add runtime config endpoint. | Minor | Document in Phase 2 roadmap. For MVP, rebuild is acceptable. | Low (future) |

---

### 🟢 CRITICAL PATH ALIGNMENT

| P0 Requirement | Addressed By | Confidence |
|---|---|---|
| **REQ-001: MF Calculator Module** | `MFCalculator.tsx` + `mfCalculator.ts` business logic + unit tests | ✓ Confident |
| **REQ-002: NPS Calculator Module** | `NPSCalculator.tsx` + `npsCalculator.ts` business logic + unit tests | ✓ Confident |
| **REQ-003: Performance Loading** | Vite build optimization, Tailwind CSS purging, code splitting, <100KB bundle | ✓ Confident |
| **REQ-004: Input Validation** | Client-side validators in `validators.ts`, inline error display, field constraints | ✓ Confident |

| P1 Requirement | Addressed By | Confidence |
|---|---|---|
| **REQ-005: Mobile-Responsive** | Tailwind CSS responsive utilities, 320px–1920px viewport testing | ✓ Confident |
| **REQ-006: Real-Time Updates** | React state + useCallback/useMemo, debounce hook (100ms) | ✓ Confident |
| **REQ-007: Feature Flag** | Environment variable + feature flag context; optional runtime config | ✓ Confident |
| **REQ-008: GDPR Compliance** | Zero storage, no cookies, no localStorage, no external tracking | ✓ Confident |

---

## Recommendations for Implementation (Phase 5)

### High Priority (Do Before Day 1)

1. **Create Calculation Reference Sheet** (`docs/calculation-reference.md`)
   - Standard MF formula: FV = PV × (1+r)^n with test vectors
   - Standard NPS formula: FV = PMT × [((1+r)^n - 1) / r] with test vectors
   - Annuity formula: Monthly = Corpus × 4% / 12
   - Used by unit tests to verify accuracy within 0.01–0.5% tolerance

2. **Set Up CI/CD Bundle Monitoring**
   - Add `npm run build:analyze` (webpack-bundle-analyzer or similar)
   - Fail CI if bundle exceeds 120KB gzipped
   - Track bundle size per commit

3. **Component Wireframes / Storybook Setup**
   - Create visual specs for MFCalculator, NPSCalculator, InputForm, ResultDisplay
   - Ensure error message styling is consistent
   - Define breakpoints for responsive layouts (mobile 320px, tablet 768px, desktop 1920px)

### Medium Priority (Week 1)

4. **Test Setup**
   - Initialize Vitest for unit tests
   - Configure React Testing Library for integration tests
   - Set up Playwright for e2e tests
   - Aim for 90%+ coverage on business logic by end of Phase 5

5. **Performance Baseline**
   - Measure LCP (Largest Contentful Paint) on local 4G throttle
   - Measure calculator latency (input → result) end-to-end
   - Document in `performance-baseline.md`

6. **Security Checklist**
   - Verify CSP headers in deployment config
   - Confirm no external API calls (except future Phase 2)
   - Verify no cookies/localStorage used
   - Run `npm audit` in CI; fail on critical/high vulnerabilities

### Low Priority (Nice-to-Have)

7. **Documentation**
   - Create `ARCHITECTURE.md` (developer onboarding)
   - Document deployment process (Vercel/Netlify/S3+CF)
   - Create troubleshooting guide for common issues

---

## Architecture Quality Assessment

| Criterion | Rating | Evidence |
|---|---|---|
| **Completeness** | ✓ Excellent | All 10 requirements mapped to components/features; no gaps |
| **Feasibility** | ✓ Excellent | 2-person team can build in 2 weeks; tech stack proven |
| **Technology Justification** | ✓ Excellent | Each major choice has an ADR with alternatives |
| **Security** | ✓ Excellent | GDPR-compliant, input validation, no data leaks |
| **Performance** | ✓ Strong | Client-side-only ensures <100ms latency; bundle under 120KB reasonable |
| **Testability** | ✓ Strong | Pure functions, component isolation, clear test targets (90%+ achievable) |
| **Maintainability** | ✓ Good | TypeScript reduces bugs; React patterns well-known; clear file structure |
| **Scalability** | ✓ Good | Stateless design supports 500–1K concurrent users without backend scaling |

---

## Sign-Off

### Verdict: ✅ APPROVE

**Rationale:**
- All critical requirements clearly addressed (P0/P1)
- Technology stack well-justified with ADRs
- Client-side-only approach appropriate for constraints
- Security & testing strategies comprehensive
- No blocking issues; minor concerns are resolvable during Phase 5
- Team can implement within 2-week sprint

**Conditions:**
- Implement calculation reference sheet (F-002 recommendation) before writing unit tests
- Set up bundle size monitoring in CI/CD (C-001 mitigation)
- Run security audit checklist before going live (Phase 9)

**Path Forward:**
- Phase 4: Implementation Planning (detailed task breakdown)
- Phase 5: Implementation (code development + testing)
- Phase 6: Simplification (code review + refactoring)

---

| Role | Name | Date | Sign-Off |
|---|---|---|---|
| **Design Reviewer** | Architecture Review Board | 2026-05-13 | ✓ **APPROVED** |
| **Tech Lead** | [TBD] | — | — |

---

**Review Status:** COMPLETE  
**Approval Status:** APPROVED FOR IMPLEMENTATION  
**Next Phase:** Phase 4 — Implementation Planning
