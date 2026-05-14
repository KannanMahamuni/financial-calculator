# Architecture Guide

## Project Structure

```
src/
├── components/
│   ├── calculator/       # Calculator UI components
│   ├── common/           # Layout components (Header, Footer)
│   ├── pages/            # Page components
│   ├── FeatureFlagGuard.tsx
│   └── Router.tsx
├── hooks/
│   ├── useCalculator.ts    # State management hook
│   ├── useDebounce.ts      # Input debouncing
│   ├── useResponsive.ts    # Breakpoint detection
│   └── useFeatureFlag.ts   # Feature flag access
├── context/
│   └── FeatureFlagContext.tsx  # Feature flag provider
├── lib/
│   ├── calculator/         # Business logic (pure functions)
│   ├── types.ts           # TypeScript types & interfaces
│   ├── constants.ts       # Application constants
│   └── config.ts          # Configuration utilities
└── styles/
    └── globals.css
```

## Technology Stack

- **React 18+**: Component-based UI framework
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool with HMR
- **Tailwind CSS**: Utility-first styling
- **Vitest**: Fast unit testing
- **Playwright**: E2E testing
- **React Router v6**: Client-side routing

## Key Concepts

### Business Logic (Pure Functions)
All calculator logic is implemented as pure functions in `src/lib/calculator/`:
- `mfCalculator.ts`: MF compound interest calculations
- `npsCalculator.ts`: NPS corpus & annuity calculations
- `validators.ts`: Input validation rules

Benefits:
- Deterministic (same inputs → same outputs)
- Testable without mocking
- Can be run in Web Workers for heavy calculations
- Easy to port to backend

### State Management
Uses React Hooks for simplicity:
- `useCalculator`: Manages calculator inputs, validation, results
- `useDebounce`: Debounces rapid input changes (100ms)
- `useResponsive`: Responsive breakpoint detection
- `useFeatureFlag`: Access to feature flags

### Feature Flags
Environment-based feature flags via `.env`:
```
VITE_FEATURE_MF_CALCULATOR_ENABLED=true
VITE_FEATURE_NPS_CALCULATOR_ENABLED=true
VITE_FEATURE_ADVANCED_ANALYSIS_ENABLED=false
```

### Component Hierarchy

```
App
├── FeatureFlagProvider
│   └── Router
│       └── Layout
│           ├── Header
│           ├── Main Content
│           │   ├── HomePage
│           │   ├── MFCalculator
│           │   │   ├── InputForm
│           │   │   └── ResultDisplay
│           │   └── NPSCalculator
│           │       ├── InputForm
│           │       └── ResultDisplay
│           └── Footer
```

## Data Flow

### Input to Result
1. User enters value in InputForm
2. `onChange` event triggers `updateInput()` hook
3. Input is debounced (100ms) via `useDebounce`
4. Validation runs on debounced input
5. If valid, calculator function executes
6. Results displayed in ResultDisplay component

### Styling
- Global styles in `src/styles/globals.css`
- Tailwind utility classes for components
- Responsive breakpoints: xs (320px), sm (640px), md (768px), lg (1024px), xl (1280px)
- Theme colors: primary, success, error, warning

## Performance Optimizations

1. **Code Splitting**: React Router lazy loads pages
2. **Bundle Analysis**: `npm run build:analyze` shows bundle size
3. **Debouncing**: Input changes debounced to reduce re-renders
4. **Memoization**: `useMemo` prevents unnecessary calculations
5. **CSS Purging**: Tailwind removes unused CSS in production

## Testing Strategy

### Unit Tests (Vitest)
- Business logic: 90%+ coverage target
- Test edge cases, validations, formulas

### Integration Tests (React Testing Library)
- Component interactions
- Form submission flows
- Error state handling

### E2E Tests (Playwright)
- Happy path scenarios
- Mobile responsiveness
- Error scenarios
- Feature flag behavior

## Deployment

### Vercel (Recommended)
- Push to `main` branch → automatic deployment
- Preview deployments for PRs
- Zero-config with `vercel.json`

### GitHub Pages / Netlify
- Build: `npm run build`
- Deploy `dist/` folder
- Configure `netlify.toml` or GitHub Pages settings

## Environment Variables

### Development (.env.local)
```
VITE_FEATURE_MF_CALCULATOR_ENABLED=true
VITE_FEATURE_NPS_CALCULATOR_ENABLED=true
VITE_FEATURE_ADVANCED_ANALYSIS_ENABLED=false
VITE_CALCULATION_DEBOUNCE_MS=100
```

### Production
Same variables can be configured in deployment platform's env settings.

## Build & Deployment

### Development Server
```bash
npm run dev  # http://localhost:3000
```

### Production Build
```bash
npm run build     # Creates optimized dist/
npm run preview   # Preview production build locally
```

### Testing
```bash
npm run test              # Unit tests (watch mode)
npm run test:coverage     # With coverage report
npm run test:e2e         # E2E tests
npm run test:e2e:ui      # E2E tests with UI
```

## Error Handling

- Validation errors displayed inline in forms
- Calculation errors caught and logged
- Graceful fallbacks for disabled features
- 404 page for unknown routes

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Security Considerations

- ✅ No cookies or localStorage (GDPR compliant)
- ✅ All calculations client-side (no backend)
- ✅ No PII collection
- ✅ Input validation on client
- ✅ Content Security Policy headers (to be set by hosting)

## Future Enhancements (Phase 2)

- Backend API for calculations (audit trail)
- User accounts & saved calculations
- Advanced analysis & comparisons
- Multi-currency support
- API documentation
- Mobile app version
