# Financial Calculator

## Overview

A responsive, web-based financial calculator for Mutual Funds (MF) and National Pension Scheme (NPS) investments. Built with React 18, TypeScript, and Vite.

## Features

- **Mutual Fund Calculator**: Calculate returns based on principal, monthly contributions, rate of return, and investment period
- **NPS Calculator**: Calculate retirement corpus and estimated annuity
- **Real-time Calculations**: Updates results as you type (debounced)
- **Mobile-Responsive**: Works seamlessly on 320px–1920px viewports
- **GDPR-Compliant**: No PII storage, no cookies, client-side only
- **High Performance**: <2s load (4G), <500ms (broadband)
- **Feature Flags**: Optional enable/disable controls

## Tech Stack

- **Frontend**: React 18+, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Testing**: Vitest (unit), React Testing Library (integration), Playwright (e2e)
- **Build**: Vite with compression and bundle analysis
- **CI/CD**: GitHub Actions (skeleton ready)

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will start at `http://localhost:3000`

### Building

```bash
npm run build
```

### Testing

```bash
# Unit tests
npm run test

# Unit tests with UI
npm run test:ui

# Coverage report
npm run test:coverage

# E2E tests
npm run test:e2e

# E2E tests with UI
npm run test:e2e:ui
```

## Project Structure

```
src/
├── components/
│   ├── calculator/      # Calculator components
│   ├── common/          # Header, Footer, Layout
│   ├── pages/           # Page components
│   └── Router.tsx       # Route configuration
├── hooks/               # Custom React hooks
├── context/             # React Context providers
├── lib/
│   ├── calculator/      # Business logic (MF, NPS)
│   ├── types.ts         # TypeScript definitions
│   ├── constants.ts     # Constants & config
│   └── config.ts        # App configuration
├── styles/              # Global CSS
├── App.tsx              # Main App component
└── main.tsx             # Entry point

tests/
├── unit/                # Unit tests
├── integration/         # Integration tests
├── e2e/                 # End-to-end tests
└── performance/         # Performance tests
```

## Requirements

### P0 - Critical

- MF Calculator module
- NPS Calculator module
- Performance: <2s (4G), <500ms (broadband)
- Client-side input validation

### P1 - High Priority

- Mobile responsiveness (320px–1920px)
- Real-time calculation updates (<100ms latency)
- Feature flags for rollout control
- GDPR compliance (no PII, no cookies)

### P2 - Nice-to-Have

- Calculation accuracy to 0.01%–0.5%
- Support for 500–1K concurrent daily users

## Documentation

- [Architecture](./docs/ARCHITECTURE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Troubleshooting](./docs/TROUBLESHOOTING.md)
- [Calculation Reference](./docs/calculation-reference.md)

## Feature Flags

Configure in `.env.local`:

```
VITE_FEATURE_MF_CALCULATOR_ENABLED=true
VITE_FEATURE_NPS_CALCULATOR_ENABLED=true
VITE_FEATURE_ADVANCED_ANALYSIS_ENABLED=false
VITE_CALCULATION_DEBOUNCE_MS=100
```

## Performance

- Bundle size: <110KB gzipped
- Page load: <2s (4G), <500ms (broadband)
- Calculation latency: <100ms
- Mobile-first responsive design

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

Internal EPAM Project

## Support

For issues or questions, refer to [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) or contact the development team.
