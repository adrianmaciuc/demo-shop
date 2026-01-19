# AGENTS.md - Apex Shoes E-Commerce

Contains project overview, tech stack, architecture, build commands, code style conventions, testing patterns, and operational procedures.

## Project Overview

**Apex Shoes** (sole-street) - A demo e-commerce shoe shop built with React 19, TypeScript, Vite and Strapi.

**Purpose**: Demo/educational project with mock data, but with strapi for users.

## Technology Stack

Read package.json for tech stack
Repo may have multiple package.json - read them all to fully understand

## Architecture

### Directory Structure

```
Front end is at root level
Back end is in separate folder called backend
Testing framework for end to end should have its own tests folder at root level
Unit tests with hest live in src/__tests__
```

### Key Architecture Patterns

**State Management**

- React Context API (CartContext, WishlistContext)
- Custom hooks: `useCart()`, `useWishlist()`
- No external state management library

**Routing**

- React Router DOM v7 with lazy loading
- Code splitting with `React.lazy()` and `Suspense`
- Page transitions with Framer Motion (AnimatePresence + PageTransition)

**Styling**

- Tailwind CSS v4 (utility-first)
- Custom animations defined in tailwind.config.js (shimmer)
- CSS variables for theme colors
- Warm minimal color palette: Primary (#2D2D2D), Secondary (#FAF9F6), Accent (#E07A5F)

**Code Splitting**

- Manual chunks in vite.config.ts: vendor (react, react-dom, react-router-dom), motion (framer-motion)

## Type System

**Key Types** (src/types/index.ts):

## Build & Development Commands

### Development

```bash
npm run dev          # Start development server (Vite)
npm run build        # Build for production (tsc -b && vite build)
npm run preview      # Preview production build
```

### Code Quality (CRITICAL - Run after each change)

```bash
npm run lint         # Run ESLint - MOST IMPORTANT
npm run lint:fix     # Fix ESLint errors automatically
npm run type-check   # Run TypeScript type checking - IMPORTANT
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

### Testing

```bash
npm run test           # Run Jest tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage report
```

## Code Style & Linting

### ESLint Configuration

**Config Files**: eslint.config.js (flat config), .eslintrc.cjs (legacy)

**Plugins Used**:

- `@typescript-eslint` - TypeScript rules
- `react-hooks` - React Hooks rules
- `react-refresh` - Component refresh optimization
- `simple-import-sort` - Auto-sort imports (ERROR level)
- `unused-imports` - Detect/remove unused imports

**Key Rules**:

- Unused imports: ERROR (use eslint-plugin-unused-imports)
- Import sorting: ERROR (enforced order: external, internal)
- React Hooks rules: recommended
- `@typescript-eslint/no-unused-vars`: off (handled by unused-imports plugin)
- Max warnings: 2

**Import Order** (enforced by simple-import-sort):

1. React imports
2. External library imports
3. Internal imports (src/...)
4. Type imports
5. Relative imports

### Prettier Configuration

**Note**: No .prettierrc file found - using defaults or inline configs

- Check format: `npm run format:check`
- Format: `npm run format`
- Ignores: node_modules, dist, .vscode, .idea, \*.log, .env

### Testing Conventions

- Test files: `**/__tests__/**/*.test.ts?(x)` or `**/?(*.)+(spec|test).ts?(x)`
- Coverage threshold: 70% (branches, functions, lines, statements)
- Test environment: jsdom
- Setup: src/jest.setup.ts (mocks for matchMedia, IntersectionObserver)
- Collect coverage from: `src/**/*.{ts,tsx}` (excluding .d.ts, main.tsx, .stories.tsx)

## Key Features & Functionality

### Responsive Design

- Mobile-first approach
- Breakpoints: <640px (mobile), 640px-1024px (tablet), >1024px (desktop)

### Animations

- Framer Motion for transitions
- Page transitions (AnimatePresence)
- Shimmer loading skeletons
- Particle burst effects

## Component Patterns

### Custom Hooks

- `useCart()` - Access cart state and methods
- `useWishlist()` - Access wishlist state and methods

### Lazy Loading Pattern

```tsx
const ComponentName = lazy(() => import("./pages/ComponentName"));
// Wrap in <Suspense fallback={<PageLoader />}>
```

### Context Providers

- Wrapping order: CartProvider → WishlistProvider → Router → App
- Providers defined in src/context/

### UI Components

- Reusable components in src/components/ui/
- Skeleton loading states
- Empty states
- Image zoom functionality
- Lazy image loading

## Important Notes for Agents

1. **Always run `npm run lint` and `npm run type-check` after changes** - These are critical and must pass
2. **Import sorting is enforced** - Let ESLint auto-fix or follow the import order pattern
3. **No comments in code** unless explicitly requested (per project style)
4. **Use TypeScript types** from src/types/index.ts
5. **Lazy load pages** - All page components are lazy-loaded
6. **Use Context API** for global state - no Redux, Zustand, etc.
7. **Mock data** - All product data is in src/data/shoes.ts
8. **Backend** - used with strapi
9. **Test coverage threshold is 70%** - New code should maintain this
10. **Tailwind CSS v4** - Using the Vite plugin, not v3 syntax
11. Run tests at the end of each change to ensure everything is OK

## MCP Tools & External Resources

### Context7 MCP

If Context7 MCP is available, always consult the official documentation related to the task before performing any action. Use Context7 to:

- Look up API references for libraries and frameworks used in this project
- Verify best practices for React, TypeScript, Vite, Tailwind CSS, and other dependencies
- Check for updated patterns or deprecated APIs
- Research how to implement new features correctly

Always prefer official documentation over assumptions or outdated knowledge.

### Playwright MCP

If browser validation is required, use Playwright MCP. This is the preferred way to:

- Verify UI changes render correctly in a real browser environment
- Test user interactions (clicks, form submissions, navigation)
- Check responsive design across different screen sizes
- Validate that pages load without JavaScript errors
- Take screenshots or snapshots of the application state

Use Playwright MCP for any task that requires verifying how the application actually behaves in a browser, as opposed to Jest unit tests which use jsdom.

### Chrome DevTools MCP

If browser debugging and inspection is required, use Chrome DevTools MCP. This provides direct access to browser DevTools protocols for:

- **DOM Inspection & Interaction**: Take snapshots of the page, click elements, fill forms, hover, drag, and press keys
- **Console Access**: List and retrieve console messages, debug logs, errors, and warnings
- **Network Monitoring**: Monitor network requests, view headers, response bodies, and timing
- **Performance Profiling**: Start/stop performance traces, analyze Core Web Vitals (LCP, FID, CLS)
- **Page Navigation**: Navigate to URLs, go back/forward, reload with cache control
- **Emulation**: Simulate different network conditions (3G/4G, offline), geolocation, CPU throttling
- **Screenshots**: Take viewport or full-page screenshots for visual verification

Common debugging scenarios:

- Debug console errors in a real browser
- Inspect React component structure via the accessibility tree
- Verify form behavior and validation
- Profile rendering performance
- Check network requests for missing resources
- Take visual snapshots to verify UI changes

## Environment & Dependencies

**Node.js**: 18.x or higher required

**Key Dependencies** (package.json):

- @tailwindcss/vite, framer-motion, lucide-react, react, react-dom, react-router-dom

**Dev Dependencies**:

- @testing-library/\*, eslint, jest, prettier, tailwindcss, typescript, vite

## Configuration Files Summary

- `vite.config.ts` - Vite with React plugin, Tailwind plugin, manual chunks
- `tailwind.config.js` - Tailwind theme with custom shimmer animation
- `tsconfig.json` - Root config (references app and node configs)
- `tsconfig.app.json` - App TypeScript config (strict mode enabled)
- `jest.config.ts` - Jest config with ts-jest preset, jsdom environment, 70% coverage threshold
- `eslint.config.js` - ESLint flat config
- `.eslintrc.cjs` - Legacy ESLint config (may be phased out)
- `.prettierignore` - Files to ignore during formatting
