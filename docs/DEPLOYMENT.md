# Deployment Guide

## Prerequisites

- Node.js 18+
- npm or yarn
- Git

## Local Development

### Setup
```bash
# Clone and navigate
cd financial-calculator

# Install dependencies
npm install

# Create .env.local
cp .env.example .env.local

# Start development server
npm run dev
```

App runs at `http://localhost:3000`

### Build Locally
```bash
# Production build
npm run build

# Preview production build
npm run preview

# Analyze bundle size
npm run build:analyze
```

## Continuous Integration (CI)

### GitHub Actions Pipeline
Automatically runs on push to `main` or `develop`:

1. **Lint & Test**: ESLint, Vitest coverage
2. **Build**: Production build with artifact upload
3. **Security**: npm audit for vulnerabilities

View status in `.github/workflows/ci.yml`

## Deployment Options

### Option 1: Vercel (Recommended)

**Setup:**
1. Connect GitHub repo to Vercel
2. Vercel detects React app automatically
3. Configure environment variables in Vercel dashboard:
   ```
   VITE_FEATURE_MF_CALCULATOR_ENABLED=true
   VITE_FEATURE_NPS_CALCULATOR_ENABLED=true
   ```
4. Deploy on push to `main`

**Commands:**
```bash
# Install Vercel CLI
npm i -g vercel

# Login & deploy
vercel

# Deploy to production
vercel --prod
```

### Option 2: Netlify

**Setup:**
1. Connect GitHub repo to Netlify
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Add environment variables in Netlify dashboard
4. Deploy on push to `main`

### Option 3: GitHub Pages

**Setup:**
1. Add to `package.json`:
   ```json
   "homepage": "https://username.github.io/financial-calculator"
   ```
2. Create `.github/workflows/deploy-gh-pages.yml`
3. Push to deploy

### Option 4: Docker

**Dockerfile:**
```dockerfile
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18
WORKDIR /app
RUN npm i -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

**Build & run:**
```bash
docker build -t financial-calc .
docker run -p 3000:3000 financial-calc
```

## Environment Variables

### Available Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `VITE_FEATURE_MF_CALCULATOR_ENABLED` | `true` | Enable/disable MF calculator |
| `VITE_FEATURE_NPS_CALCULATOR_ENABLED` | `true` | Enable/disable NPS calculator |
| `VITE_FEATURE_ADVANCED_ANALYSIS_ENABLED` | `false` | Enable advanced features |
| `VITE_CALCULATION_DEBOUNCE_MS` | `100` | Debounce delay in ms |

### Setting Variables

**Local Development (.env.local):**
```bash
VITE_FEATURE_MF_CALCULATOR_ENABLED=true
```

**Vercel:**
- Settings → Environment Variables → Add

**Netlify:**
- Settings → Build & deploy → Environment → Add

**Docker:**
```bash
docker run \
  -e VITE_FEATURE_MF_CALCULATOR_ENABLED=true \
  -p 3000:3000 \
  financial-calc
```

## Performance Optimization

### Bundle Size
- Target: <110KB gzipped
- Check with: `npm run build:analyze`

### Caching
- Vercel: Automatic edge caching
- Netlify: Configure in `netlify.toml`
- GitHub Pages: Set cache headers

### CDN
- Vercel: Built-in global edge network
- Netlify: Built-in global CDN
- Custom: CloudFlare or AWS CloudFront

## Monitoring & Observability

### Performance Monitoring
- Vercel Analytics (built-in)
- Google Analytics (add script to index.html)
- Web Vitals: LCP, FID, CLS

### Error Tracking
- Sentry (optional integration)
- Browser console errors
- User feedback forms

### Logging
- Client-side: Console logs (development only)
- Server-side: CDN logs available

## Rollback & Recovery

### Vercel
```bash
# View deployments
vercel list

# Promote previous deployment
vercel promote <deployment-url>

# Rollback in Vercel dashboard
```

### Netlify
- Go to Deploys → Select previous version → Publish

### Manual Rollback
```bash
# Revert git commit
git revert <commit-hash>
git push

# CI/CD will deploy previous version
```

## Security Checklist

- [ ] Environment variables configured
- [ ] No secrets in code or git history
- [ ] CSP headers configured on server
- [ ] HTTPS enforced (automatic on Vercel/Netlify)
- [ ] npm audit runs in CI
- [ ] Dependencies up to date

## Troubleshooting

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Deployment Timeout
- Increase timeout in CI/CD settings
- Optimize build (lazy load, code split)
- Check network connection

### Feature Flags Not Working
- Verify `.env` variables exist
- Check `VITE_` prefix (required for Vite)
- Rebuild after env change

### Performance Issues
- Check bundle size: `npm run build:analyze`
- Review network waterfall in DevTools
- Enable gzip compression on server

## Support & Debugging

### Development
```bash
npm run dev              # With HMR
npm run build           # Check build errors
npm run test:coverage   # Verify tests pass
```

### Production Debugging
- Check browser console for errors
- Use network tab to verify requests
- Check server logs (if applicable)

## Deployment Checklist

- [ ] All tests passing
- [ ] Bundle size <120KB gzipped
- [ ] Environment variables configured
- [ ] Performance baseline established
- [ ] Feature flags enabled/disabled as planned
- [ ] Accessibility tested
- [ ] Mobile responsiveness verified
- [ ] Browser compatibility checked
- [ ] Security audit completed
- [ ] Deployment notified to stakeholders
