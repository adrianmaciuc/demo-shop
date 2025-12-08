# Shoe Shop Development Plan

## Project Overview

Modern e-commerce shoe shop built with Vite + React + TypeScript, featuring a clean, slick design with fresh vibes.

---

## Phase 1: Project Setup & Foundation

### 1.1 Initialize Project

- [x] Create Vite + React + TypeScript project
- [x] Install essential dependencies:
  - React Router DOM (routing)
  - Tailwind CSS (styling - recommended for rapid, modern UI)
  - Lucide React (icons)
  - Optional: Framer Motion (animations for that fresh feel)

### 1.2 Project Structure

```
src/
├── components/
│   ├── layout/
│   ├── product/
│   └── ui/
├── pages/
├── data/
├── types/
├── hooks/
└── utils/
```

### 1.3 Data Model (TypeScript Types)

```typescript
interface Shoe {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: ShoeCategory;
  images: string[];
  sizes: number[];
  colors: string[];
  description: string;
  featured: boolean;
}

type ShoeCategory = "sneakers" | "running" | "casual" | "formal" | "boots";
```

---

## Phase 2: Design System & Styling

### 2.1 Color Palette (Fresh & Modern)

- **Option A - Monochrome with Accent:**
  - Primary: Deep Black (#0A0A0A)
  - Secondary: Soft White (#F8F8F8)
  - Accent: Electric Blue or Neon Green
- **Option B - Warm Minimal (Recommended ✓):**
  - Primary: Warm Gray (#2D2D2D)
  - Secondary: Cream (#FAF9F6)
  - Accent: Terracotta/Burnt Orange (#E07A5F)
  - Why: Less harsh than pure black/white, feels premium and approachable

### 2.2 Typography

- Headings: Modern sans-serif (Inter, Outfit, or Space Grotesk)
- Body: Clean readable font (Inter or System UI)

### 2.3 UI Components to Build

- [x] Navigation bar (sticky, minimal)
- [x] Product card (hover effects, quick view)
- [x] Category filter chips
- [~] Product image gallery (with zoom) - Gallery done, zoom pending
- [x] Size selector
- [x] Add to cart button
- [~] Footer - Basic footer exists, can be enhanced

---

## Phase 3: Core Pages & Features

### 3.1 Home Page (`/`)

**Key Sections:**

- [x] Hero section (full-width banner, rotating featured shoes)
- [x] Featured products grid (3-4 highlight items)
- [x] Shop by category (visual category cards)
- [x] New arrivals section
- [x] Newsletter signup (subtle, bottom section)

**Design Notes:**

- Large, high-quality product images
- Generous white space
- Smooth scroll animations
- Minimal text, focus on visuals

### 3.2 Category Pages (`/category/:categoryName`)

**Features:**

- [x] Filtered product grid by category
- [x] Sort options (price, newest, popular)
- [x] Filter sidebar (size, color, price range, brand)
- [x] Breadcrumb navigation
- [x] Product count display

**Layout:**

- Grid: 3 columns desktop, 2 tablet, 1 mobile
- Filter toggle for mobile

### 3.3 Individual Shoe Page (`/shoe/:id`)

**Sections:**

- [x] Image gallery (main + thumbnails, zoomable)
- [x] Product info panel:
  - Name, brand, price
  - Size selector (visual, shows availability)
  - Color selector (if multiple colors)
  - Quantity selector
  - Add to cart + Buy now buttons
- [x] Accordion sections:
  - Description
  - Materials & care
  - Shipping & returns
- [x] "You might also like" section (recommendations)

**Design Notes:**

- 60/40 split: images left, info right (desktop)
- Sticky buy panel on scroll
- High-res images with smooth transitions

### 3.4 Additional Pages

- [~] `/about` - Brand story (stub exists, content pending)
- [~] `/contact` - Contact form (stub exists, form pending)
- [x] `/cart` - Shopping cart (optional for MVP)

---

## Phase 4: Routing Setup

### 4.1 Route Structure

```typescript
/                          -> Home
/category/sneakers         -> Category: Sneakers
/category/running          -> Category: Running
/category/casual           -> Category: Casual
/category/formal           -> Category: Formal
/category/boots            -> Category: Boots
/shoe/:id                  -> Individual shoe page
/about                     -> About page
/contact                   -> Contact page
```

---

## Phase 5: State Management & Data

### 5.1 Data Source (Choose One)

- **Option A - Mock Data (Recommended for MVP ✓):**
  - Create `data/shoes.ts` with hardcoded array
  - Fast to develop, no backend needed
  - Why: Get UI perfect first, easy to swap later

- **Option B - JSON File:**
  - Store in `public/data/shoes.json`
  - Fetch with `fetch()`

### 5.2 State Strategy

- React Context or Zustand for cart state
- URL params for filters/sorting
- Local state for UI interactions

---

## Phase 6: Polish & Advanced Features

### 6.1 Interactions & Animations

- [~] Smooth page transitions - Framer Motion setup done, full page transitions pending
- [x] Product card hover effects (lift, shadow)
- [ ] Image lazy loading
- [ ] Skeleton loading states
- [x] Toast notifications (add to cart confirmation)

### 6.2 Performance

- [ ] Image optimization
- [ ] Code splitting by route
- [ ] Lazy load components below fold

### 6.3 Responsive Design

- [ ] Mobile-first approach
- [ ] Touch-friendly interactions
- [ ] Hamburger menu for mobile nav

---

## Development Order (Recommended)

### Sprint 1: Foundation

1. Setup Vite + React + TypeScript
2. Install Tailwind CSS
3. Create basic routing structure
4. Build navigation component
5. Create mock data file

### Sprint 2: Core Pages

6. Build Home page (hero + featured grid)
7. Build product card component
8. Create category page with grid
9. Implement individual shoe page

### Sprint 3: Interactivity

10. Add filtering system
11. Implement size/color selection
12. Build image gallery with zoom
13. Add hover effects and animations

### Sprint 4: Polish

14. Responsive design refinement
15. Loading states
16. Performance optimization
17. Final design touches

---

## Key Decisions Needed

1. **Cart Functionality:** Full cart with checkout or just product display?
2. **Data Persistence:** Use browser storage for cart or just session state?
3. **Payment:** Integration needed or just UI mockup?
4. **Search:** Include search bar functionality?

---

## Tech Stack Summary

**Core:**

- Vite
- React 18+
- TypeScript
- React Router DOM

**Styling (Recommended):**

- Tailwind CSS (utility-first, fast development)
- Alternative: Styled Components or CSS Modules

**Optional Enhancements:**

- Framer Motion (animations)
- React Hook Form (if adding contact form)
- Zustand (if complex state needed)

---

## Next Steps

✅ **SPRINT 1 IN PROGRESS**

---

## Current Progress

### ✅ Completed (Sprint 1, 2, 3 & 4)

- Project planning and structure defined
- TypeScript types created (Shoe, Category, CartItem)
- Mock data with 18 realistic shoes across all categories
- App.tsx with Router setup
- Navigation component (responsive, with mobile menu, live cart count)
- **Home Page built** (Hero, Featured, Categories, New Arrivals, Newsletter)
- **ProductCard component** (3 variants: default, compact, featured)
- **Category Page built** (Filtering, sorting, responsive sidebar)
- **Individual Shoe Page built** (Image gallery, size/color selectors, accordion details)
- **Shopping Cart System** (Context, add/remove, cart page, toast notifications)

### 🎉 Core E-Commerce Complete!

The shop is now fully functional with:

- Product browsing and filtering
- Product detail views
- Shopping cart with quantity management
- Order summary with shipping/tax calculation
- Real-time cart updates in navigation

### 🔄 Optional Enhancements

- About & Contact pages
- Wishlist functionality
- Product search
- User reviews
- Advanced animations & polish
