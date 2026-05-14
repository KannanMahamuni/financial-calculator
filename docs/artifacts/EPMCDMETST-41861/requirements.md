# Requirements — EPMCDMETST-41861: Financial Calculator Website for MF and NPS

## Meta

| Field | Value |
|---|---|
| **Feature ID** | FEAT-0001 |
| **Ticket** | EPMCDMETST-41861 |
| **Title** | Financial Calculator Website for MF and NPS |
| **Created** | 2026-05-13 |
| **Status** | approved |
| **Author** | Kannan Mahamuni |
| **Version** | 1.0 |

---

## Problem Statement

EPAM's financial services customers need a standalone, web-based tool to calculate returns and financial projections for Mutual Fund (MF) and National Pension Scheme (NPS) investments. Currently, these calculations are scattered across internal tools or third-party platforms, creating friction for users and limiting accessibility. A unified, public-facing calculator with real-time computation, mobile-responsive design, and compliance with GDPR standards will enable users to make informed investment decisions independently while improving EPAM's market visibility in the fintech education space.

---

## Requirements

### P0 — Critical Path Requirements

| Req ID | Requirement | Priority | Status |
|---|---|---|---|
| REQ-001 | System shall provide a Mutual Fund (MF) calculator module | P0 | New |
| REQ-002 | System shall provide a National Pension Scheme (NPS) calculator module | P0 | New |
| REQ-003 | System shall load within performance thresholds | P0 | New |
| REQ-004 | System shall validate all numerical inputs client-side | P0 | New |

### P1 — High Priority Requirements

| Req ID | Requirement | Priority | Status |
|---|---|---|---|
| REQ-005 | System shall be mobile-responsive | P1 | New |
| REQ-006 | System shall support real-time calculation updates | P1 | New |
| REQ-007 | System shall provide optional feature flag for rollout control | P1 | New |
| REQ-008 | System shall be GDPR-compliant with no PII storage | P1 | New |

### P2 — Nice-to-Have Requirements

| Req ID | Requirement | Priority | Status |
|---|---|---|---|
| REQ-009 | System shall provide calculation accuracy per EPAM financial standards | P2 | New |
| REQ-010 | System shall support concurrent user load | P2 | New |

---

## Acceptance Criteria

### REQ-001: Mutual Fund (MF) Calculator

**Requirement:** System shall provide a Mutual Fund (MF) calculator module

**Acceptance Criteria:**
- **AC-001.1:** Given a user accesses the MF module with valid input fields (investment amount, investment period, expected rate of return), when entering all required values, then the system shall display the calculated compound returns in <100ms.
- **AC-001.2:** Given the user has entered MF calculation parameters, when changing any input field, then the calculation shall update in real-time without requiring a submit action.
- **AC-001.3:** Given the MF calculator is accessed, when the user attempts to submit with missing or incomplete fields, then the system shall display inline validation error messages.

---

### REQ-002: National Pension Scheme (NPS) Calculator

**Requirement:** System shall provide a National Pension Scheme (NPS) calculator module

**Acceptance Criteria:**
- **AC-002.1:** Given a user accesses the NPS module with valid input fields (monthly contribution, years to retirement, expected rate of return), when entering all required values, then the system shall calculate and display final corpus and annuity in <100ms.
- **AC-002.2:** Given the user has entered NPS calculation parameters, when changing any input field, then the calculation shall update in real-time without requiring a submit action.
- **AC-002.3:** Given NPS calculation results are displayed, then the system shall show both total corpus accumulated and estimated monthly annuity upon retirement.

---

### REQ-003: Performance Loading Thresholds

**Requirement:** System shall load within performance thresholds

**Acceptance Criteria:**
- **AC-003.1:** Given a user with a 4G mobile connection, when requesting the application, then the page shall fully load and be interactive in <2 seconds.
- **AC-003.2:** Given a user with broadband internet connection, when requesting the application, then the page shall fully load and be interactive in <500ms.
- **AC-003.3:** Given the page is loading, then a loading indicator or progress bar shall be displayed to indicate progress; content shall not appear blocked or frozen.

---

### REQ-004: Client-Side Input Validation

**Requirement:** System shall validate all numerical inputs client-side

**Acceptance Criteria:**
- **AC-004.1:** Given a user enters a negative value in an investment amount field, when attempting to proceed, then an inline error message shall be displayed: "Investment amount must be positive."
- **AC-004.2:** Given a user enters a non-numeric value (letters, special characters) in a numerical field, when attempting to proceed, then an inline error message shall be displayed: "Please enter a valid number."
- **AC-004.3:** Given a user enters a value outside the defined range (e.g., investment >₹1 Crore for MF), when attempting to proceed, then a warning message shall be displayed: "Value outside typical range. Please confirm to continue."
- **AC-004.4:** Given validation messages are displayed, then the system shall prevent calculation submission until all errors are resolved.

---

### REQ-005: Mobile Responsiveness

**Requirement:** System shall be mobile-responsive

**Acceptance Criteria:**
- **AC-005.1:** Given a viewport width of 320px (mobile), when accessing the calculator, then all input fields, buttons, and results shall be fully visible and functional without horizontal scrolling.
- **AC-005.2:** Given a viewport width of 768px (tablet) and 1920px (desktop), when accessing the calculator, then the layout shall adapt appropriately and remain fully functional.
- **AC-005.3:** Given the user is on a mobile device, when rotating the device from portrait to landscape, then the layout shall reflow gracefully and calculations shall persist.

---

### REQ-006: Real-Time Calculation Updates

**Requirement:** System shall support real-time calculation updates

**Acceptance Criteria:**
- **AC-006.1:** Given any input field contains a valid value, when the user modifies the value, then the calculation results shall update immediately (within <100ms) without requiring a submit or calculate button click.
- **AC-006.2:** Given multiple input fields are present, when the user changes one field while others have valid values, then only the affected calculation shall update; UI shall not flicker or reset.

---

### REQ-007: Feature Flag for Rollout Control

**Requirement:** System shall provide optional feature flag for rollout control

**Acceptance Criteria:**
- **AC-007.1:** Given the system is configured with a feature flag for the calculator (enabled=true), when a user accesses the calculator, then both MF and NPS modules shall be available.
- **AC-007.2:** Given the feature flag is disabled (enabled=false), when a user attempts to access the calculator, then the page shall display "Calculator is currently unavailable" without showing a 404 error.
- **AC-007.3:** Given the feature flag is disabled, when a user navigates directly to a module URL (e.g., /nps-calculator), then the system shall redirect to the home page or display the unavailable message.

---

### REQ-008: GDPR Compliance & No PII Storage

**Requirement:** System shall be GDPR-compliant with no PII storage

**Acceptance Criteria:**
- **AC-008.1:** Given a user session ends or the browser is closed, when checking browser storage (cookies, localStorage, sessionStorage), then no user input, personal data, or session identifiers shall be persisted.
- **AC-008.2:** Given the calculator is used, when monitoring network traffic, then no PII (user identity, email, phone) shall be transmitted to any external analytics or third-party services.
- **AC-008.3:** Given GDPR requirements, when the user accesses the calculator, then no cookie consent banner is required (since no tracking occurs); a simple privacy statement shall be accessible via footer link.

---

### REQ-009: Calculation Accuracy per Financial Standards

**Requirement:** System shall provide calculation accuracy per EPAM financial standards

**Acceptance Criteria:**
- **AC-009.1:** Given standard financial formulas for compound interest (FV = PV × (1 + r)^n), when comparing calculator results to reference calculations, then results shall match within 0.01% tolerance.
- **AC-009.2:** Given NPS annuity calculations using standard assumptions, when comparing results to published NPS withdrawal formulas, then results shall match within 0.5% tolerance.

---

### REQ-010: Concurrent User Load Support

**Requirement:** System shall support concurrent user load

**Acceptance Criteria:**
- **AC-010.1:** Given 500–1,000 daily active users accessing the calculator simultaneously, when monitoring system response times, then average latency shall remain <500ms for calculation results.
- **AC-010.2:** Given peak concurrent load, when measuring page load times, then P95 page load time shall not exceed 3 seconds on 4G connections.

---

## Constraints

| Constraint | Details |
|---|---|
| **Performance** | Page load <2s (4G), <500ms (broadband); Calculation latency <100ms; Support 500–1K daily users |
| **Platforms** | Web-only (no native mobile app); Desktop, tablet, mobile browsers (Chrome, Firefox, Safari, Edge) |
| **Data Storage** | Stateless (no user accounts, no persistent storage); Calculations in-memory only; GDPR-compliant (no PII retention) |
| **Compliance** | GDPR-compliant; No PII collection; Public, unauthenticated access |
| **Deployment** | Single-region deployment initially; Optional feature flag for rollout control |
| **Concurrent Users** | Steady-state 500–1K daily; No auto-scaling assumed (static hosting + CDN sufficient) |
| **Development Stack** | React (frontend), TypeScript/JavaScript, responsive CSS framework (Tailwind/Bootstrap) |

---

## Non-Goals

### 1. User Accounts & Persistent Storage
**Rationale:** This is a stateless calculator. While GDPR-compliant session handling is required, building authentication, user profiles, or saved calculation history is out of scope to maintain simplicity and standalone operation. Users perform ad-hoc calculations without logging in.

### 2. Multi-Language Localization (i18n)
**Rationale:** The calculator will launch in English only. Future versions may support regional languages (Hindi, regional Indian languages for NPS/MF markets), but initial release targets English-speaking users and EPAM's global audience.

### 3. Advanced Portfolio Analysis & Fund-Specific Data
**Rationale:** The calculator will use generic return assumptions; it will not integrate live mutual fund NAVs, fund ratings, or portfolio recommendations. Users must source fund data externally.

### 4. Mobile Native App (iOS/Android)
**Rationale:** Delivery is web-only. Mobile responsiveness is required, but native app development is deferred to Phase 2.

### 5. Backend Analytics & User Tracking
**Rationale:** To maintain GDPR compliance and privacy-by-design, no backend logging, user tracking, or analytics integration is included in MVP.

---

## Assumptions

| Assumption | Risk If Wrong | Validation Needed |
|---|---|---|
| Users will accept generic return assumptions (not live fund data) | **High** | If users expect real NAV data, calculator becomes less useful; consider Phase 2 integration with fund APIs. *Validation:* User survey post-MVP. |
| <100ms calculation latency is achievable on commodity hardware | **Low** | Financial formulas are simple; no database I/O. JavaScript execution easily meets target. *Validation:* Load testing during QA. |
| Public, unauthenticated access is acceptable (no PII concerns) | **Medium** | If regulations change or customer feedback requires authentication, refactor required. *Validation:* Legal/Compliance review before launch. |
| Single-region deployment (no geographic failover needed) | **Medium** | If uptime SLA > 99.9% becomes requirement, multi-region + CDN needed. *Validation:* SLA definition from Product Manager. |
| Feature flag implementation via environment/config (not persistent store) | **Low** | Simple toggle; no database dependencies. *Validation:* Deployment process review. |
| 500–1K daily users is steady-state (not spike traffic) | **Low** | If traffic spikes to 10K+, static hosting + CDN sufficient. Assume no auto-scaling needed. *Validation:* Monitoring + alerts post-launch. |

---

## Edge Cases

### EC-001: Negative or Zero Investment Values (REQ-001, REQ-004)
**Scenario:** User enters zero or negative investment values in MF or NPS calculators.  
**Handling:** Inline validation shall reject negative amounts; zero amount shall return zero calculation result with clear message ("Investment cannot be zero. Please enter a positive value.").

### EC-002: Network Timeout During Initial Load (REQ-003, REQ-004)
**Scenario:** User on slow 4G connection experiences page load timeout (>2 seconds) or intermittent connectivity.  
**Handling:** If page load exceeds 2 seconds, show loading indicator and progress; if >10 seconds, display "Connection timeout" with retry button. Calculation engine shall not block page render; progressive enhancement ensures core functionality loads first.

### EC-003: Device Rotation on Mobile (REQ-005, REQ-006)
**Scenario:** User on mobile device rotates device from portrait to landscape or vice versa.  
**Handling:** Layout shall reflow gracefully; calculated results shall persist; input fields shall remain focused where applicable; viewport shall adjust without losing state.

### EC-004: Extreme Input Values (REQ-001, REQ-002, REQ-004)
**Scenario:** User enters extreme values (e.g., 1000% return rate, 50-year tenure, ₹100 Crore investment).  
**Handling:** Validation shall warn user ("Return rate >50% is unusual; confirm to continue?") but allow calculation; result shall display with appropriate significant figures (no display overflow). Calculations shall not cause NaN or Infinity errors.

### EC-005: Feature Flag Disabled with Direct URL Navigation (REQ-007)
**Scenario:** User navigates directly to calculator URL via bookmark or direct link when feature flag is disabled.  
**Handling:** Page shall load but display "Calculator unavailable" message; no 404. Optionally redirect to home or show enable-pending state. No error logs or white-screen failures.

### EC-006: Browser Cache Cleared / Session Restart (REQ-008)
**Scenario:** User clears browser cache/localStorage; expects saved calculations to persist.  
**Handling:** Every calculation is stateless and in-memory; no restore is possible or required. New session starts fresh with no carryover. Privacy statement clarifies this behavior.

### EC-007: Rapid Input Changes (REQ-006)
**Scenario:** User rapidly changes multiple input fields in succession (e.g., sliders, rapid typing).  
**Handling:** Debouncing logic (50–100ms) shall prevent excessive recalculation; UI shall update smoothly without jank or flicker. Latest user input always reflects in results.

---

## Backward Compatibility

**Verdict: No Impact (Greenfield)**

**Rationale:**  
This is a new, standalone application with no existing functionality to maintain. There are no prior versions, database migrations, or legacy API contracts. Launching the calculator does not affect any existing EPAM systems or user workflows. Future features (e.g., integrations with EPAM legacy platforms, persistent storage, multi-language support) may introduce breaking changes or dependencies, but the initial MVP is fully additive and backwards-compatible by design.

---

## Glossary

| Term | Definition |
|---|---|
| **MF (Mutual Fund)** | An investment scheme that pools money from multiple investors to purchase a diversified portfolio of securities (stocks, bonds, etc.). Returns depend on market performance and fund manager decisions. |
| **NPS (National Pension Scheme)** | A government-regulated retirement savings scheme in India offering tax-free contributions and withdrawals up to specified limits. Final payout depends on accumulated corpus and annuity selection. |
| **Compound Returns / CAGR** | Compound Annual Growth Rate — the annualized return on an investment over multiple years, accounting for reinvested earnings. Formula: FV = PV × (1 + r)^n |
| **Corpus** | The total accumulated value of an NPS account at retirement, combining all contributions and investment returns. |
| **Annuity** | Regular periodic payments (e.g., monthly) paid to a retiree from accumulated NPS corpus; typically calculated using mortality and discount rate assumptions. |
| **Feature Flag** | A configuration switch that enables or disables application features without code deployment. Allows phased rollout and A/B testing. |
| **GDPR Compliance** | Adherence to EU General Data Protection Regulation; requires explicit user consent for data collection, right to deletion, and no collection of PII without consent. |
| **PII (Personally Identifiable Information)** | Data that can identify an individual (name, email, phone, address, IP address, cookies). This system intentionally does NOT collect PII. |
| **AC (Acceptance Criteria)** | Testable conditions that must be met for a requirement to be considered complete. Written in Given/When/Then format. |
| **P0/P1/P2 Priority** | P0 = Critical (must-have for MVP); P1 = High (should-have for competitive feature); P2 = Nice-to-have (deferred if needed). |

---

## Sign-Off

| Role | Name | Date | Signature |
|---|---|---|---|
| Requirements Owner | Kannan Mahamuni | 2026-05-13 | ✓ Approved |
| Product Manager | [To be assigned] | — | — |

---

**Status:** APPROVED
**Version:** 1.0
**Last Updated:** 2026-05-13
