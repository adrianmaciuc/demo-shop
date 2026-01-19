# Directus + SQLite Backend Integration Plan

## 🎯 Overview

Replace hardcoded mock data (`src/data/shoes.ts`) with a Directus CMS backend using SQLite database. This provides:

- Admin panel for content management
- REST/GraphQL API automatically generated
- Image upload and optimization
- No custom backend code needed
- Full TypeScript support

---

## 📁 Proposed Backend Folder Structure

```
demo-shop/
├── backend/                          # NEW: Directus CMS setup
│   ├── .env                         # Environment variables
│   ├── .env.example                 # Example env template
│   ├── package.json                 # Backend dependencies
│   ├── database/
│   │   └── database.db             # SQLite database file
│   ├── uploads/                     # Directus file uploads
│   │   └── images/
│   ├── extensions/                  # Custom Directus extensions
│   │   ├── hooks/                  # Database hooks
│   │   ├── endpoints/              # Custom API endpoints
│   │   └── modules/                # Custom modules
│   ├── scripts/                     # Migration & utility scripts
│   │   ├── migrate-data.ts        # Data migration script
│   │   ├── migrate-images.ts      # Image download/upload script
│   │   └── seed-data.ts           # Optional: seed initial data
│   ├── backups/                     # Database backups
│   │   └── README.md              # Backup instructions
│   ├── config.yaml                  # Directus configuration
│   └── README.md                   # Backend setup guide
│
├── src/
│   ├── lib/
│   │   └── directus.ts            # Directus client setup (NEW)
│   ├── services/
│   │   └── directus/              # API service layer (NEW)
│   │       ├── shoes.ts           # Shoes API calls
│   │       └── index.ts
│   ├── hooks/
│   │   └── useShoes.ts           # Custom React hooks (NEW)
│   ├── data/
│   │   └── shoes.ts              # Keep until migration complete
│   └── types/
│       └── index.ts              # Update with Directus types
│
├── .env.local                      # Frontend env vars (NEW)
└── package.json                    # Add Directus SDK
```

---

## 🗄️ Database Schema Design

### Collection: `shoes` (Primary)

| Field        | Type          | Required | Default |
| ------------ | ------------- | -------- | ------- |
| id           | UUID          | Yes      | Auto    |
| name         | string(255)   | Yes      | -       |
| brand        | string(100)   | Yes      | -       |
| price        | decimal(10,2) | Yes      | -       |
| category     | enum          | Yes      | -       |
| description  | text          | Yes      | -       |
| featured     | boolean       | Yes      | false   |
| in_stock     | boolean       | Yes      | true    |
| date_created | timestamp     | Yes      | auto    |
| date_updated | timestamp     | Yes      | auto    |

**Category enum values:**

- `sneakers`
- `running`
- `casual`
- `formal`
- `boots`

### Related Collections

#### 1. `shoe_images` (One-to-Many)

| Field      | Type    | Required | Description            |
| ---------- | ------- | -------- | ---------------------- |
| id         | UUID    | Yes      | Primary key            |
| shoe_id    | UUID    | Yes      | FK → shoes.id          |
| image      | UUID    | Yes      | FK → directus_files.id |
| sort_order | integer | Yes      | 0 (for ordering)       |

#### 2. `shoe_sizes` (Many-to-Many Junction)

| Field   | Type         | Required | Description           |
| ------- | ------------ | -------- | --------------------- |
| id      | UUID         | Yes      | Primary key           |
| shoe_id | UUID         | Yes      | FK → shoes.id         |
| size    | decimal(3,1) | Yes      | Shoe size (e.g., 9.5) |

#### 3. `shoe_colors` (Many-to-Many Junction)

| Field   | Type       | Required | Description   |
| ------- | ---------- | -------- | ------------- |
| id      | UUID       | Yes      | Primary key   |
| shoe_id | UUID       | Yes      | FK → shoes.id |
| color   | string(50) | Yes      | Color name    |

#### 4. `shoe_features` (One-to-Many)

| Field      | Type        | Required | Description         |
| ---------- | ----------- | -------- | ------------------- |
| id         | UUID        | Yes      | Primary key         |
| shoe_id    | UUID        | Yes      | FK → shoes.id       |
| feature    | string(255) | Yes      | Feature description |
| sort_order | integer     | Yes      | 0 (for ordering)    |

---

## 🔧 Technical Stack

### Backend

- **Directus** - Headless CMS with automatic API generation
- **SQLite** - Serverless, zero-configuration database
- **Node.js** - Required for Directus runtime
- **npm/npx** - Directus CLI and package management

### Frontend Updates

- **@directus/sdk** - TypeScript SDK for Directus API
- **React Query/TanStack Query** - Optional caching and state management
- **TypeScript** - Type safety with generated schema types

### Prerequisites

Before starting, ensure you have:

- **Node.js 18.x or higher** - Required for Directus
- **npm 9.x or higher** - Package manager
- **Directus CLI** (optional, can use npx):
  ```bash
  npm install -g directus
  ```

### Running Directus Without Docker

This project uses Node.js and npx to run Directus directly - **no Docker required**.

**Option 1: Run with npx (Recommended)**

```bash
cd backend
npx directus start
```

**Option 2: Install Directus globally**

```bash
npm install -g directus
directus start
```

**Option 3: Run as npm script**

```bash
cd backend
npm start
```

**Stop Directus:**

- Press `Ctrl+C` in the terminal
- Or kill process: `kill $(lsof -ti:8055)`

**Run in background:**

```bash
# Linux/Mac
npx directus start &

# Windows (PowerShell)
Start-Process npx -ArgumentList "directus", "start"

# Windows (CMD)
start /B npx directus start
```

**View logs:**

- Logs appear directly in your terminal
- Database file location: `backend/database/database.db`
- File uploads location: `backend/uploads/`

### Backend

- **Directus** - Headless CMS with automatic API generation
- **SQLite** - Serverless, zero-configuration database
- **Node.js** - Required for Directus runtime
- **npm/npx** - Directus CLI and package management

### Frontend Updates

- **@directus/sdk** - TypeScript SDK for Directus API
- **React Query/TanStack Query** - Optional caching and state management
- **TypeScript** - Type safety with generated schema types

---

## 📅 Migration Phases (4-5 weeks)

### Phase 1: Backend Setup (Week 1)

**Tasks:**

1. Create `backend/` folder structure
2. Initialize Node.js project and install Directus
3. Configure SQLite database
4. Set up environment variables
5. Create database collections (schema)
6. Set up file storage for images
7. Access admin panel at `http://localhost:8055`

**Commands:**

```bash
cd backend
npm init -y
npm install directus
npx directus start
# Access: http://localhost:8055
```

**Or run in background:**

```bash
# Linux/Mac
npx directus start &

# Windows (PowerShell)
Start-Process npx -ArgumentList "directus", "start"
```

**Deliverables:**

- ✅ Directus running on port 8055
- ✅ SQLite database initialized
- ✅ Admin panel accessible
- ✅ All collections created with proper relationships
- ✅ Public role configured with read permissions

---

### Phase 2: Data Migration (Week 2)

**Tasks:**

1. Create migration script for 267 shoes
2. Migrate shoe data from `src/data/shoes.ts`
3. Handle sizes, colors, features as related collections
4. Test data integrity

**Migration Script Structure:**

```typescript
// backend/scripts/migrate-data.ts
import { createDirectus, rest, createItems } from "@directus/sdk";
import { shoes } from "../../src/data/shoes";

const client = createDirectus("http://localhost:8055").with(rest());

async function migrateShoes() {
  for (const shoe of shoes) {
    // 1. Create shoe record
    const shoeResult = await client.request(
      createItems("shoes", [
        {
          name: shoe.name,
          brand: shoe.brand,
          price: shoe.price,
          category: shoe.category,
          description: shoe.description,
          featured: shoe.featured,
          in_stock: shoe.inStock,
        },
      ]),
    );

    const shoeId = shoeResult[0].id;

    // 2. Create sizes
    for (const size of shoe.sizes) {
      await client.request(
        createItems("shoe_sizes", [
          {
            shoe_id: shoeId,
            size,
          },
        ]),
      );
    }

    // 3. Create colors
    for (const color of shoe.colors) {
      await client.request(
        createItems("shoe_colors", [
          {
            shoe_id: shoeId,
            color,
          },
        ]),
      );
    }

    // 4. Create features
    for (const feature of shoe.features) {
      await client.request(
        createItems("shoe_features", [
          {
            shoe_id: shoeId,
            feature,
          },
        ]),
      );
    }

    // 5. Create images (Phase 3)
    // Will be handled separately based on image strategy decision
  }
}

migrateShoes();
```

**Deliverables:**

- ✅ All 267 shoes migrated to database
- ✅ All related records created (sizes, colors, features)
- ✅ Data integrity verified
- ✅ Migration script documented

---

### Phase 3: Image Handling (Week 2-3)

### Two Options Available:

#### Option A: Keep Unsplash URLs (Quick - 1 day)

**Approach:**

- Add `images_url` field (JSON type) to `shoes` collection
- Store current Unsplash URLs as JSON array
- No download/upload needed
- Directus used only for data management

**Schema Addition:**

```json
{
  "collection": "shoes",
  "fields": {
    "images_url": {
      "type": "json",
      "required": true
    }
  }
}
```

**Pros:**

- ✅ Fastest implementation
- ✅ No migration complexity
- ✅ Unsplash handles CDN and optimization
- ✅ Minimal code changes

**Cons:**

- ❌ No image management in Directus
- ❌ Can't use Directus image transformations
- ❌ Dependent on Unsplash availability
- ❌ Content editors can't upload custom images

---

#### Option B: Migrate to Directus Files (Recommended - 3-5 days)

**Approach:**

1. Download all Unsplash images (534 images estimated)
2. Upload to Directus file storage
3. Create `shoe_images` relations
4. Replace URL references with file IDs

**Migration Script:**

```typescript
// backend/scripts/migrate-images.ts
import fs from "fs";
import path from "path";
import { createDirectus, rest, uploadFiles, createItems } from "@directus/sdk";

const client = createDirectus("http://localhost:8055").with(rest());

async function downloadImage(url: string, filename: string): Promise<Buffer> {
  const response = await fetch(url);
  return Buffer.from(await response.arrayBuffer());
}

async function uploadImage(buffer: Buffer, filename: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", new Blob([buffer]), filename);

  const result = await client.request(uploadFiles(formData));
  return result.id;
}

async function migrateImages() {
  const shoes = await fetch("http://localhost:8055/items/shoes?limit=-1")
    .then((res) => res.json())
    .then((data) => data.data);

  for (const shoe of shoes) {
    const images = shoe.images_url || [];
    const shoeId = shoe.id;

    for (let i = 0; i < images.length; i++) {
      const imageUrl = images[i];
      const filename = `shoe-${shoeId}-${i}.jpg`;

      // Download
      const buffer = await downloadImage(imageUrl, filename);

      // Upload
      const fileId = await uploadImage(buffer, filename);

      // Create relation
      await client.request(
        createItems("shoe_images", [
          {
            shoe_id: shoeId,
            image: fileId,
            sort_order: i,
          },
        ]),
      );
    }

    // Remove old images_url field
    await client.request(updateItem("shoes", shoeId, { images_url: null }));
  }
}

migrateImages();
```

**Pros:**

- ✅ Complete image management in Directus
- ✅ On-the-fly image transformations
- ✅ CDN support (S3 integration)
- ✅ Content editors can upload images
- ✅ Better performance control
- ✅ Future-proof architecture

**Cons:**

- ❌ More complex migration
- ❌ Requires storage space
- ❌ Initial setup time

**Image Transformations Available:**

```
http://localhost:8055/assets/{file_id}?width=400&height=400&format=webp&quality=80
```

Parameters:

- `width`, `height` - Resize dimensions
- `quality` - 1-100 compression
- `fit` - cover, contain, fill, inside, outside
- `format` - webp, jpg, png, avif
- `blur` - 0-100
- `rotate`, `flip`, `flop`
- `brightness`, `contrast`, `saturation`

---

### Phase 4: Frontend Integration (Week 3-4)

**Tasks:**

1. Install `@directus/sdk`
2. Create Directus client (`src/lib/directus.ts`)
3. Build API service layer (`src/services/directus/shoes.ts`)
4. Update components to use API instead of mock data
5. Add environment variables (`.env.local`)

#### Install SDK

```bash
npm install @directus/sdk
```

#### Create Directus Client

```typescript
// src/lib/directus.ts
import { createDirectus, rest, type DirectusClient } from "@directus/sdk";

// Define your schema
type Schema = {
  shoes: {
    id: string;
    name: string;
    brand: string;
    price: number;
    category: string;
    description: string;
    featured: boolean;
    in_stock: boolean;
    shoe_images: {
      id: string;
      image: {
        id: string;
        filename_disk: string;
        filename_download: string;
      };
      sort_order: number;
    }[];
    shoe_sizes: {
      size: number;
    }[];
    shoe_colors: {
      color: string;
    }[];
    shoe_features: {
      feature: string;
    }[];
  }[];
};

let client: DirectusClient<Schema> | null = null;

export const getDirectusClient = () => {
  if (!client) {
    client = createDirectus<Schema>(import.meta.env.VITE_DIRECTUS_URL).with(
      rest(),
    );
  }
  return client;
};
```

#### Create API Service Layer

```typescript
// src/services/directus/shoes.ts
import { readItems, readItem } from "@directus/sdk";
import { getDirectusClient, type Schema } from "@/lib/directus";
import type { Shoe } from "@/types";

export const shoesService = {
  async getAll(params?: {
    filter?: Record<string, any>;
    sort?: string | string[];
    limit?: number;
    offset?: number;
  }): Promise<Shoe[]> {
    const client = getDirectusClient();

    const response = await client.request(
      readItems("shoes", {
        fields: [
          "id",
          "name",
          "brand",
          "price",
          "category",
          "description",
          "featured",
          "in_stock",
          "shoe_images.image.id",
          "shoe_images.image.filename_download",
          "shoe_images.sort_order",
          "shoe_sizes.size",
          "shoe_colors.color",
          "shoe_features.feature",
        ],
        ...params,
      }),
    );

    return this.transformResponse(response);
  },

  async getById(id: string): Promise<Shoe> {
    const client = getDirectusClient();

    const response = await client.request(
      readItem("shoes", id, {
        fields: [
          "*",
          "shoe_images.image.*",
          "shoe_sizes.size",
          "shoe_colors.color",
          "shoe_features.feature",
        ],
      }),
    );

    return this.transformResponse([response])[0];
  },

  async getFeatured(): Promise<Shoe[]> {
    return this.getAll({
      filter: { featured: { _eq: true } },
      sort: ["-date_created"],
    });
  },

  async getByCategory(category: string): Promise<Shoe[]> {
    return this.getAll({
      filter: { category: { _eq: category } },
    });
  },

  transformResponse(shoes: any[]): Shoe[] {
    return shoes.map((shoe) => ({
      id: shoe.id,
      name: shoe.name,
      brand: shoe.brand,
      price: shoe.price,
      category: shoe.category as any,
      description: shoe.description,
      featured: shoe.featured,
      inStock: shoe.in_stock,
      images:
        shoe.shoe_images
          ?.sort((a, b) => a.sort_order - b.sort_order)
          .map(
            (img: any) =>
              // Use buildDirectusImageUrl utility for transformations
              // import { buildDirectusImageUrl } from '@/utils/directus-image'
              // buildDirectusImageUrl(img.image.id, { width: 800, format: 'webp', quality: 85 })
              `${import.meta.env.VITE_DIRECTUS_URL}/assets/${img.image.id}`,
          ) || [],
      sizes: shoe.shoe_sizes?.map((s: any) => s.size) || [],
      colors: shoe.shoe_colors?.map((c: any) => c.color) || [],
      features: shoe.shoe_features?.map((f: any) => f.feature) || [],
    }));
  },
};
```

#### Create Image Transformation Utilities

**Create utility file for Directus image transformations:**

```bash
# Create file
touch src/utils/directus-image.ts
```

**Basic implementation (simple version):**

```typescript
// src/utils/directus-image.ts
interface ImageTransformOptions {
  width?: number;
  height?: number;
  format?: "webp" | "avif" | "jpg" | "png";
  quality?: number;
  fit?: "cover" | "contain" | "fill" | "inside" | "outside";
  flip?: "horizontal" | "vertical";
  rotate?: number;
}

export const buildDirectusImageUrl = (
  fileId: string,
  options: ImageTransformOptions = {},
): string => {
  const baseUrl = import.meta.env.VITE_DIRECTUS_URL;
  const params = new URLSearchParams();

  if (options.width) params.append("width", options.width.toString());
  if (options.height) params.append("height", options.height.toString());
  if (options.format) params.append("format", options.format);
  if (options.quality) params.append("quality", options.quality.toString());
  if (options.fit) params.append("fit", options.fit);
  if (options.flip) params.append("flip", options.flip);
  if (options.rotate) params.append("rotate", options.rotate.toString());

  const queryString = params.toString();
  return queryString
    ? `${baseUrl}/assets/${fileId}?${queryString}`
    : `${baseUrl}/assets/${fileId}`;
};

// Presets for common use cases
export const getThumbnailUrl = (fileId: string): string =>
  buildDirectusImageUrl(fileId, {
    width: 300,
    height: 300,
    fit: "cover",
    format: "webp",
    quality: 75,
  });

export const getGalleryUrl = (fileId: string): string =>
  buildDirectusImageUrl(fileId, {
    width: 800,
    height: 800,
    fit: "cover",
    format: "webp",
    quality: 85,
  });
```

**Note:** See "Directus Built-in Image Transformations" section (below) for comprehensive utilities and presets.

#### Update Environment Variables

```bash
# .env.local
VITE_DIRECTUS_URL=http://localhost:8055
VITE_DIRECTUS_PUBLIC_TOKEN=your-static-token-here
```

#### Update Components

```typescript
// Before (mock data)
import { shoes } from "../data/shoes";

const featuredShoes = shoes.filter((s) => s.featured).slice(0, 3);

// After (Directus API)
import { shoesService } from "@/services/directus/shoes";

const [featuredShoes, setFeaturedShoes] = useState<Shoe[]>([]);

useEffect(() => {
  shoesService.getFeatured().then(setFeaturedShoes);
}, []);
```

**Pages to Update:**

- `src/pages/HomePage.tsx` - Featured shoes, new arrivals
- `src/pages/CategoryPage.tsx` - Category filtering
- `src/pages/ShoePage.tsx` - Product details
- Any other components using `shoes` data

**Deliverables:**

- ✅ Directus SDK installed
- ✅ Client and service layer created
- ✅ All components updated to use API
- ✅ Loading states implemented
- ✅ Error handling added

---

### Phase 5: Testing & Cleanup (Week 5)

**Tasks:**

1. Test all pages with new API
2. Verify filtering, sorting, cart functionality
3. Add error handling & loading states
4. Remove `src/data/shoes.ts` after successful migration
5. Update documentation
6. Performance optimization

**Testing Checklist:**

- ✅ Home page loads featured shoes
- ✅ Category pages filter correctly
- ✅ Product detail pages load individual shoes
- ✅ Size/color selectors work
- ✅ Add to cart functionality intact
- ✅ Wishlist functionality intact
- ✅ Images display correctly
- ✅ Loading states appear during API calls
- ✅ Error states display on failures
- ✅ Mobile responsive behavior maintained

**Performance Optimization:**

```typescript
// Optional: Add React Query for caching
import { useQuery } from "@tanstack/react-query";

export const useShoes = (params?: any) => {
  return useQuery({
    queryKey: ["shoes", params],
    queryFn: () => shoesService.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

**Cleanup Tasks:**

```bash
# Remove mock data file
rm src/data/shoes.ts

# Update imports (should all be replaced)
# Run tests to ensure nothing broke
npm test

# Type check
npm run type-check

# Build to verify
npm run build
```

**Deliverables:**

- ✅ All tests passing
- ✅ Mock data removed
- ✅ Documentation updated
- ✅ Performance optimized
- ✅ Error handling complete

---

## 🔐 Security Setup

### 1. Public Access (Anonymous Users)

**Create Public Role:**

1. Go to Directus Admin Panel → Settings → Roles & Permissions
2. Create "Public" role
3. Grant read permissions:
   - `shoes` collection (all fields)
   - `shoe_images` collection (all fields)
   - `shoe_sizes` collection (all fields)
   - `shoe_colors` collection (all fields)
   - `shoe_features` collection (all fields)
   - `directus_files` collection (read only for images)

**Generate Static Token:**

```bash
# In Directus Admin Panel
Settings → API Tokens → Create New Token
- Name: "Public Read Access"
- Role: Public
- Access: Read-only
- Copy the token
```

**Use Static Token in Frontend:**

```typescript
// src/lib/directus.ts
import { staticToken } from "@directus/sdk";

const client = createDirectus<Schema>(import.meta.env.VITE_DIRECTUS_URL)
  .with(rest())
  .with(staticToken(import.meta.env.VITE_DIRECTUS_PUBLIC_TOKEN));
```

### 2. Admin Access (Content Editors)

**Default Admin Credentials:**

```bash
# Set in .env
ADMIN_EMAIL: 'admin@example.com'
ADMIN_PASSWORD: 'password'
```

**Additional Admin Users:**

- Create in Directus Admin Panel
- Assign to "Admin" role
- Full CRUD permissions on all collections

### 3. CORS Configuration

**Environment Variables:**

```bash
# backend/.env
CORS_ENABLED=true
CORS_ORIGIN=http://localhost:5173
CORS_METHODS=GET,POST,PATCH,DELETE
CORS_ALLOWED_HEADERS=*
```

**Production:**

```bash
CORS_ORIGIN=https://yourdomain.com
```

### 4. File Upload Restrictions

**Configure in Directus:**

```bash
# Environment variables
STORAGE_LOCAL_MAX_FILE_SIZE=5242880  # 5MB
STORAGE_LOCAL_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp
```

### 5. Environment Variables Security

**Backend (.env) - NEVER COMMIT:**

```bash
# Directus Configuration
KEY='your-32-character-random-key'
SECRET='your-32-character-random-secret'
PUBLIC_URL='http://localhost:8055'

# Admin Account
ADMIN_EMAIL='admin@example.com'
ADMIN_PASSWORD='your-secure-password'

# Database (SQLite)
DB_CLIENT='sqlite3'
DB_FILENAME='./database/database.db'

# CORS
CORS_ENABLED='true'
CORS_ORIGIN='http://localhost:5173'

# Storage
STORAGE_LOCATIONS='local'
STORAGE_LOCAL_ROOT='./uploads'
STORAGE_LOCAL_MAX_FILE_SIZE='5242880'
```

**Frontend (.env.local) - SAFE TO COMMIT:**

```bash
VITE_DIRECTUS_URL=http://localhost:8055
VITE_DIRECTUS_PUBLIC_TOKEN=your-public-read-token
```

---

## 🖼️ Image Handling Decision

### Current State Analysis

**Current Setup:**

- 267 shoes
- 1-2 images per shoe (estimated 534 total images)
- Unsplash URLs stored in `images` array
- URLs like: `https://images.unsplash.com/photo-xxx?w=800`

### Recommended Approach: Option B (Migrate to Directus)

**Why Recommended:**

1. **Complete Control**
   - Content editors can upload custom images
   - No dependency on Unsplash
   - Better for long-term maintainability

2. **Built-in Image Transformations** ⭐ KEY BENEFIT
   - **Zero additional setup** - included with Directus
   - **Powered by Sharp** - one of the fastest image processing libraries
   - On-the-fly resize, crop, rotate, flip
   - Format conversion (WebP, AVIF, JPEG, PNG)
   - Quality optimization
   - Effects (blur, brightness, contrast, grayscale, sepia)
   - URL-based API - simple to use
   - **See full transformation documentation below**

3. **CDN Support**
   - Easy S3 integration
   - Global distribution
   - Automatic scaling

4. **Ecosystem Benefits**
   - Consistent with headless CMS philosophy
   - Future-proof architecture
   - Better asset management

### Migration Strategy (Option B)

**Step 1: Batch Download**

```typescript
// backend/scripts/download-images.ts
import fetch from "node-fetch";
import fs from "fs";
import path from "path";

async function downloadImage(url: string, filepath: string) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  fs.writeFileSync(filepath, Buffer.from(buffer));
}

async function downloadAllImages() {
  const shoes = require("../../src/data/shoes").shoes;

  for (const shoe of shoes) {
    for (let i = 0; i < shoe.images.length; i++) {
      const url = shoe.images[i];
      const filename = `${shoe.id}-${i}.jpg`;
      const filepath = path.join("temp-images", filename);

      await downloadImage(url, filepath);
      console.log(`Downloaded: ${filename}`);
    }
  }
}

downloadAllImages();
```

**Step 2: Batch Upload**

```typescript
// backend/scripts/upload-images.ts
import { createDirectus, rest, uploadFiles, createItems } from "@directus/sdk";
import fs from "fs";

const client = createDirectus("http://localhost:8055").with(rest());

async function uploadImage(filepath: string) {
  const buffer = fs.readFileSync(filepath);
  const filename = path.basename(filepath);

  const formData = new FormData();
  formData.append("file", new Blob([buffer]), filename);

  const result = await client.request(uploadFiles(formData));
  return result.id;
}

async function uploadAllImages() {
  const shoes = await client.request(readItems("shoes", { limit: -1 }));

  for (const shoe of shoes) {
    const shoeData = require("../../src/data/shoes").shoes.find(
      (s) => s.id === shoe.id,
    );

    for (let i = 0; i < shoeData.images.length; i++) {
      const filepath = path.join("temp-images", `${shoe.id}-${i}.jpg`);
      const fileId = await uploadImage(filepath);

      await client.request(
        createItems("shoe_images", [
          {
            shoe_id: shoe.id,
            image: fileId,
            sort_order: i,
          },
        ]),
      );

      console.log(`Uploaded: ${shoe.id} - Image ${i}`);
    }
  }
}

uploadAllImages();
```

**Step 3: Optimize Images with Directus Transformations**

```typescript
// Use Directus built-in transformations
// See "Directus Built-in Image Transformations" section for full details

// Simple utility function
const getOptimizedImageUrl = (
  fileId: string,
  width: number,
  height: number
) => {
  return `${import.meta.env.VITE_DIRECTUS_URL}/assets/${fileId}?width=${width}&height=${height}&format=webp&quality=80`;
};

// Or use the comprehensive utility (create: src/utils/directus-image.ts)
// See "Directus Built-in Image Transformations" section

// Component
<img
  src={getOptimizedImageUrl(shoe.images[0].image.id, 400, 400)}
  alt={shoe.name}
  loading="lazy"
/>
```

---

## 🖼️ Directus Built-in Image Transformations

Directus includes **powerful, built-in image transformations** powered by [Sharp](https://sharp.pixelplumbing.com/) - one of the fastest image processing libraries for Node.js. No additional services needed!

### ✅ Why Use Directus Transformations?

**Benefits:**

- ✅ Zero additional setup (included with Directus)
- ✅ No extra services to maintain
- ✅ Seamlessly integrated with your CMS
- ✅ Fast processing (Sharp is optimized)
- ✅ URL-based API (simple to use)
- ✅ Supports modern formats (WebP, AVIF)
- ✅ CDN-ready (works with S3, CloudFront, etc.)

### 🎛️ Available Transformations

#### **Resize & Dimensions**

| Parameter | Description                    | Example       |
| --------- | ------------------------------ | ------------- |
| `width`   | Set image width in pixels      | `?width=400`  |
| `height`  | Set image height in pixels     | `?height=400` |
| `fit`     | How to fit image to dimensions | `?fit=cover`  |

**Fit Options:**

- `cover` - Crop to fill (default for aspect ratio mismatch)
- `contain` - Fit inside without cropping
- `fill` - Stretch to fill
- `inside` - Fit inside, maintain aspect ratio
- `outside` - Fill outside, maintain aspect ratio

**Examples:**

```bash
# 400x400 square thumbnail
/assets/file-id?width=400&height=400

# 800px wide, maintain aspect ratio
/assets/file-id?width=800

# Cover fit (crop to fill)
/assets/file-id?width=400&height=400&fit=cover

# Contain fit (no crop, add borders if needed)
/assets/file-id?width=400&height=400&fit=contain
```

#### **Rotation & Flipping**

| Parameter | Description                            | Example            |
| --------- | -------------------------------------- | ------------------ |
| `rotate`  | Rotate image in degrees (90, 180, 270) | `?rotate=90`       |
| `flip`    | Flip horizontally or vertically        | `?flip=horizontal` |

**Flip Options:**

- `horizontal` - Mirror left-to-right
- `vertical` - Mirror top-to-bottom
- `both` - Mirror both ways

**Examples:**

```bash
# Rotate 90 degrees clockwise
/assets/file-id?rotate=90

# Flip horizontally
/assets/file-id?flip=horizontal

# Rotate and flip
/assets/file-id?rotate=180&flip=vertical
```

#### **Quality & Format**

| Parameter | Description           | Example        |
| --------- | --------------------- | -------------- |
| `format`  | Output image format   | `?format=webp` |
| `quality` | Image quality (1-100) | `?quality=80`  |

**Format Options:**

- `webp` - Modern format, smaller size (recommended)
- `avif` - Newest format, best compression (best for modern browsers)
- `jpg` - JPEG format
- `png` - PNG format
- `tiff` - TIFF format

**Quality Guidelines:**

- `60-70` - Low quality, smallest size (thumbnails)
- `70-80` - Medium quality (good balance)
- `80-90` - High quality, larger size (full images)
- `90-100` - Maximum quality (near lossless)

**Examples:**

```bash
# Convert to WebP with 80% quality
/assets/file-id?format=webp&quality=80

# High quality JPEG
/assets/file-id?format=jpg&quality=90

# Modern AVIF format
/assets/file-id?format=avif&quality=70
```

#### **Effects & Adjustments**

| Parameter    | Description                         | Example          |
| ------------ | ----------------------------------- | ---------------- |
| `blur`       | Blur amount (0-100)                 | `?blur=10`       |
| `brightness` | Brightness adjustment (-100 to 100) | `?brightness=20` |
| `contrast`   | Contrast adjustment (-100 to 100)   | `?contrast=20`   |
| `grayscale`  | Grayscale (0-100)                   | `?grayscale=100` |
| `sepia`      | Sepia effect (0-100)                | `?sepia=50`      |

**Examples:**

```bash
# Slight blur
/assets/file-id?blur=5

# Brighten image
/assets/file-id?brightness=20

# High contrast
/assets/file-id?contrast=30

# Convert to grayscale
/assets/file-id?grayscale=100

# Vintage sepia effect
/assets/file-id?sepia=60
```

### 🎯 Real-World Examples for Shoe Shop

#### **Product Thumbnails (ProductCard)**

```bash
/assets/file-id?width=300&height=300&fit=cover&format=webp&quality=75
```

#### **Hero Images (Homepage)**

```bash
/assets/file-id?width=1200&height=600&fit=cover&format=webp&quality=85
```

#### **Gallery Images (Product Detail)**

```bash
# Main image
/assets/file-id?width=800&height=800&fit=cover&format=webp&quality=85

# Thumbnail
/assets/file-id?width=100&height=100&fit=cover&format=webp&quality=70
```

#### **Category Banners**

```bash
/assets/file-id?width=1600&height=400&fit=cover&format=webp&quality=85
```

#### **Zoomed Images (ImageZoom Component)**

```bash
/assets/file-id?width=2000&height=2000&fit=inside&format=webp&quality=90
```

### 🔧 Frontend Utility Functions

Create reusable utilities for image transformations:

```typescript
// src/utils/directus-image.ts

interface ImageTransformOptions {
  width?: number;
  height?: number;
  format?: "webp" | "avif" | "jpg" | "png";
  quality?: number;
  fit?: "cover" | "contain" | "fill" | "inside" | "outside";
  flip?: "horizontal" | "vertical" | "both";
  rotate?: 90 | 180 | 270;
  blur?: number;
  brightness?: number;
  contrast?: number;
  grayscale?: number;
  sepia?: number;
}

export const buildDirectusImageUrl = (
  fileId: string,
  options: ImageTransformOptions = {},
): string => {
  const baseUrl = import.meta.env.VITE_DIRECTUS_URL;
  const params = new URLSearchParams();

  // Add parameters if provided
  if (options.width) params.append("width", options.width.toString());
  if (options.height) params.append("height", options.height.toString());
  if (options.format) params.append("format", options.format);
  if (options.quality) params.append("quality", options.quality.toString());
  if (options.fit) params.append("fit", options.fit);
  if (options.flip) params.append("flip", options.flip);
  if (options.rotate) params.append("rotate", options.rotate.toString());
  if (options.blur) params.append("blur", options.blur.toString());
  if (options.brightness)
    params.append("brightness", options.brightness.toString());
  if (options.contrast) params.append("contrast", options.contrast.toString());
  if (options.grayscale)
    params.append("grayscale", options.grayscale.toString());
  if (options.sepia) params.append("sepia", options.sepia.toString());

  const queryString = params.toString();
  return queryString
    ? `${baseUrl}/assets/${fileId}?${queryString}`
    : `${baseUrl}/assets/${fileId}`;
};

// Preset helpers for common use cases

export const getThumbnailUrl = (fileId: string): string => {
  return buildDirectusImageUrl(fileId, {
    width: 300,
    height: 300,
    fit: "cover",
    format: "webp",
    quality: 75,
  });
};

export const getGalleryImageUrl = (fileId: string): string => {
  return buildDirectusImageUrl(fileId, {
    width: 800,
    height: 800,
    fit: "cover",
    format: "webp",
    quality: 85,
  });
};

export const getHeroImageUrl = (fileId: string): string => {
  return buildDirectusImageUrl(fileId, {
    width: 1200,
    height: 600,
    fit: "cover",
    format: "webp",
    quality: 85,
  });
};

export const getZoomImageUrl = (fileId: string): string => {
  return buildDirectusImageUrl(fileId, {
    width: 2000,
    height: 2000,
    fit: "inside",
    format: "webp",
    quality: 90,
  });
};

// Responsive image helper with srcset
export const getResponsiveImageUrls = (
  fileId: string,
  baseWidth: number,
  baseHeight: number,
): { src: string; srcset: string } => {
  const baseUrl = buildDirectusImageUrl(fileId, {
    width: baseWidth,
    height: baseHeight,
    fit: "cover",
    format: "webp",
    quality: 80,
  });

  const srcset = [
    buildDirectusImageUrl(fileId, {
      width: baseWidth * 0.5,
      height: baseHeight * 0.5,
      fit: "cover",
      format: "webp",
      quality: 70,
    }),
    buildDirectusImageUrl(fileId, {
      width: baseWidth,
      height: baseHeight,
      fit: "cover",
      format: "webp",
      quality: 80,
    }),
    buildDirectusImageUrl(fileId, {
      width: baseWidth * 1.5,
      height: baseHeight * 1.5,
      fit: "cover",
      format: "webp",
      quality: 85,
    }),
    buildDirectusImageUrl(fileId, {
      width: baseWidth * 2,
      height: baseHeight * 2,
      fit: "cover",
      format: "webp",
      quality: 90,
    }),
  ]
    .map((url, index) => {
      const width = baseWidth * (0.5 + index * 0.5);
      return `${url} ${Math.round(width)}w`;
    })
    .join(", ");

  return { src: baseUrl, srcset };
};
```

### 📝 Usage in Components

#### **ProductCard Component**

```typescript
import { getThumbnailUrl } from '@/utils/directus-image';

<ProductCard>
  <img
    src={getThumbnailUrl(shoe.images[0].image.id)}
    alt={shoe.name}
    loading="lazy"
  />
</ProductCard>
```

#### **ShoePage Gallery**

```typescript
import { getGalleryImageUrl, getZoomImageUrl } from '@/utils/directus-image';

<img
  src={getGalleryImageUrl(mainImage.image.id)}
  onClick={() => handleZoom(getZoomImageUrl(mainImage.image.id))}
  alt={shoe.name}
/>

<!-- Thumbnails -->
{shoe.images.map((img, index) => (
  <img
    key={img.id}
    src={buildDirectusImageUrl(img.image.id, {
      width: 100,
      height: 100,
      fit: 'cover',
      format: 'webp',
      quality: 70,
    })}
    onClick={() => setMainImage(img)}
  />
))}
```

#### **Responsive Images with Srcset**

```typescript
import { getResponsiveImageUrls } from '@/utils/directus-image';

const { src, srcset } = getResponsiveImageUrls(
  shoe.images[0].image.id,
  400,
  400
);

<img
  src={src}
  srcSet={srcset}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  alt={shoe.name}
  loading="lazy"
/>
```

### ⚙️ Directus Configuration

Directus image transformations are enabled by default. You can configure limits and behavior:

**Environment Variables:**

```bash
# backend/.env

# Maximum image dimension (pixels)
IMAGE_TRANSFORM_MAX_SIZE=2048

# Enable/disable transformations
IMAGE_TRANSFORM_ENABLED=true

# Default quality (0-100)
IMAGE_QUALITY_DEFAULT=80

# Allowed formats
IMAGE_FORMATS=webp,avif,jpg,png

# Cache transformations (recommended for production)
IMAGE_CACHE_ENABLED=true
IMAGE_CACHE_TTL=3600  # 1 hour in seconds
```

### 🚀 Performance Optimization

#### **Enable Caching**

```bash
# backend/.env
IMAGE_CACHE_ENABLED=true
IMAGE_CACHE_TTL=3600
```

This caches transformed images on disk, so subsequent requests are instant.

#### **Use WebP for Most Images**

```typescript
const getImageUrl = (fileId: string) => {
  return buildDirectusImageUrl(fileId, {
    width: 400,
    height: 400,
    format: "webp", // Smaller than JPEG
    quality: 80,
  });
};
```

WebP is typically 25-35% smaller than JPEG with similar quality.

#### **Progressive Loading with Low-Quality Placeholder**

```typescript
const getImageUrls = (fileId: string) => ({
  // High-quality version (lazy loaded)
  full: buildDirectusImageUrl(fileId, {
    width: 800,
    height: 800,
    format: 'webp',
    quality: 85,
  }),
  // Low-quality placeholder (immediate)
  placeholder: buildDirectusImageUrl(fileId, {
    width: 100,
    height: 100,
    format: 'webp',
    quality: 30,
  }),
});

// Component usage
<img
  src={getImageUrls(shoe.images[0].image.id).placeholder}
  data-src={getImageUrls(shoe.images[0].image.id).full}
  alt={shoe.name}
  className="lazy-load"
/>
```

### 📊 Transformation Performance

| Operation      | Speed (relative) | Notes                           |
| -------------- | ---------------- | ------------------------------- |
| Resize         | ⚡ Very Fast     | O(n) complexity                 |
| Crop           | ⚡ Very Fast     | Minimal overhead                |
| Format Convert | ⚡ Fast          | WebP/AVIF encoding is optimized |
| Rotate/Flip    | ⚡ Very Fast     | No re-encoding needed           |
| Effects        | ⚡ Fast          | Blur, brightness, etc.          |
| Combination    | ⚡⚡ Fast        | Operations are chained          |

**Best Practices:**

- ✅ Use WebP format (25-35% smaller than JPEG)
- ✅ Enable caching for production
- ✅ Use `fit=cover` for consistent dimensions
- ✅ Quality 75-85 for good balance
- ✅ Lazy load below-the-fold images
- ✅ Use srcset for responsive images

### 🎓 Complete Example: Image Utility File

```typescript
// src/utils/directus-image.ts (Final Version)
import type { Shoe } from "@/types";

interface ImageTransformOptions {
  width?: number;
  height?: number;
  format?: "webp" | "avif" | "jpg" | "png";
  quality?: number;
  fit?: "cover" | "contain" | "fill" | "inside" | "outside";
  flip?: "horizontal" | "vertical" | "both";
  rotate?: 90 | 180 | 270;
  blur?: number;
  brightness?: number;
  contrast?: number;
  grayscale?: number;
  sepia?: number;
}

export const buildDirectusImageUrl = (
  fileId: string,
  options: ImageTransformOptions = {},
): string => {
  const baseUrl = import.meta.env.VITE_DIRECTUS_URL;
  const params = new URLSearchParams();

  if (options.width) params.append("width", options.width.toString());
  if (options.height) params.append("height", options.height.toString());
  if (options.format) params.append("format", options.format);
  if (options.quality) params.append("quality", options.quality.toString());
  if (options.fit) params.append("fit", options.fit);
  if (options.flip) params.append("flip", options.flip);
  if (options.rotate) params.append("rotate", options.rotate.toString());
  if (options.blur) params.append("blur", options.blur.toString());
  if (options.brightness)
    params.append("brightness", options.brightness.toString());
  if (options.contrast) params.append("contrast", options.contrast.toString());
  if (options.grayscale)
    params.append("grayscale", options.grayscale.toString());
  if (options.sepia) params.append("sepia", options.sepia.toString());

  const queryString = params.toString();
  return queryString
    ? `${baseUrl}/assets/${fileId}?${queryString}`
    : `${baseUrl}/assets/${fileId}`;
};

// Presets for shoe shop use cases
export const SHOE_IMAGE_PRESETS = {
  thumbnail: (fileId: string) =>
    buildDirectusImageUrl(fileId, {
      width: 300,
      height: 300,
      fit: "cover",
      format: "webp",
      quality: 75,
    }),

  gallery: (fileId: string) =>
    buildDirectusImageUrl(fileId, {
      width: 800,
      height: 800,
      fit: "cover",
      format: "webp",
      quality: 85,
    }),

  hero: (fileId: string) =>
    buildDirectusImageUrl(fileId, {
      width: 1200,
      height: 600,
      fit: "cover",
      format: "webp",
      quality: 85,
    }),

  zoom: (fileId: string) =>
    buildDirectusImageUrl(fileId, {
      width: 2000,
      height: 2000,
      fit: "inside",
      format: "webp",
      quality: 90,
    }),

  thumbnailSmall: (fileId: string) =>
    buildDirectusImageUrl(fileId, {
      width: 100,
      height: 100,
      fit: "cover",
      format: "webp",
      quality: 70,
    }),

  categoryBanner: (fileId: string) =>
    buildDirectusImageUrl(fileId, {
      width: 1600,
      height: 400,
      fit: "cover",
      format: "webp",
      quality: 85,
    }),
} as const;

// Helper to get all images for a shoe
export const getShoeImages = (shoe: Shoe) => {
  const images = shoe.shoe_images || [];
  return {
    thumbnail: images[0]?.image.id
      ? SHOE_IMAGE_PRESETS.thumbnail(images[0].image.id)
      : "",
    thumbnails: images.map((img) => SHOE_IMAGE_PRESETS.thumbnail(img.image.id)),
    gallery: images.map((img) => SHOE_IMAGE_PRESETS.gallery(img.image.id)),
    thumbnailsSmall: images.map((img) =>
      SHOE_IMAGE_PRESETS.thumbnailSmall(img.image.id),
    ),
    zoom: images.map((img) => SHOE_IMAGE_PRESETS.zoom(img.image.id)),
  };
};
```

### ✅ Summary

**Directus built-in image transformations provide:**

- ✅ All essential operations (resize, crop, rotate, flip, format, quality)
- ✅ URL-based API (simple to use)
- ✅ Fast processing (powered by Sharp)
- ✅ Modern format support (WebP, AVIF)
- ✅ Zero additional setup
- ✅ CDN-ready
- ✅ Caching support
- ✅ No maintenance overhead

**Perfect for:**

- Product thumbnails
- Image galleries
- Responsive images
- Hero banners
- Zoomed detail views
- On-the-fly optimization

---

## 📦 Configuration Files

### backend/package.json

```json
{
  "name": "directus-backend",
  "version": "1.0.0",
  "description": "Directus CMS backend for shoe shop",
  "main": "index.js",
  "scripts": {
    "start": "directus start",
    "migrate": "ts-node scripts/migrate-data.ts",
    "migrate-images": "ts-node scripts/migrate-images.ts"
  },
  "dependencies": {
    "directus": "^10.0.0"
  },
  "devDependencies": {
    "ts-node": "^10.9.0",
    "@types/node": "^20.0.0"
  }
}
```

### backend/.env.example

```bash
# Directus Configuration
DIRECTUS_KEY='your-32-character-random-key'
DIRECTUS_SECRET='your-32-character-random-secret'
PUBLIC_URL='http://localhost:8055'

# Admin Account
ADMIN_EMAIL='admin@example.com'
ADMIN_PASSWORD='change-this-password'

# Database (SQLite)
DB_CLIENT='sqlite3'
DB_FILENAME='./database/database.db'

# CORS
CORS_ENABLED='true'
CORS_ORIGIN='http://localhost:5173'

# Storage
STORAGE_LOCATIONS='local'
STORAGE_LOCAL_ROOT='./uploads'
STORAGE_LOCAL_MAX_FILE_SIZE='5242880'
```

### frontend/.env.local

```bash
VITE_DIRECTUS_URL=http://localhost:8055
VITE_DIRECTUS_PUBLIC_TOKEN=your-static-public-token
```

### backend/config.yaml (Optional Directus Config)

```yaml
self:
  access_token:
    time_to_live: 900
    refresh_token:
      time_to_live: 2592000

storage:
  local:
    driver: "local"
    root: "./uploads"
    max_file_size: "5242880"
    allowed_mime_types:
      - "image/jpeg"
      - "image/png"
      - "image/webp"
```

---

## 📋 Implementation Checklist

### Before Starting - Decisions Needed

- [ ] **Image Handling:**
  - [ ] Option A: Keep Unsplash URLs (faster)
  - [ ] Option B: Migrate to Directus files (recommended)
  - **Decision:** \***\*\_\_\_\*\***

- [ ] **Backend Location:**
  - [ ] Create `backend/` folder in project root
  - [ ] Or separate repository
  - **Decision:** \***\*\_\_\_\*\***

- [ ] **Database Backup Strategy:**
  - [ ] Simple file backups
  - [ ] Automated backup script
  - **Decision:** \***\*\_\_\_\*\***

- [ ] **Authentication:**
  - [ ] Public read access only (no user accounts)
  - [ ] User accounts for wishlist, saved items
  - **Decision:** \***\*\_\_\_\*\***

- [ ] **Content Management:**
  - [ ] Admin panel for product management only
  - [ ] Future: blog pages, CMS for other content
  - **Decision:** \***\*\_\_\_\*\***

- [ ] **Development Workflow:**
  - [ ] Run both frontend and backend simultaneously
  - [ ] Use npm scripts or run Directus directly
  - **Decision:** **\_**

### Phase 1: Backend Setup

- [ ] Create backend folder structure
- [ ] Initialize Node.js project (npm init)
- [ ] Install Directus (npm install directus)
- [ ] Create .env.example and .env files
- [ ] Start Directus (npx directus start)
- [ ] Access admin panel
- [ ] Create collections in Directus
- [ ] Set up relationships between collections
- [ ] Create "Public" role
- [ ] Configure permissions for public role
- [ ] Generate static API token
- [ ] Test API access via browser

### Phase 2: Data Migration

- [ ] Create migration script template
- [ ] Test migration with single shoe
- [ ] Run full migration for all 267 shoes
- [ ] Verify shoe data in Directus admin
- [ ] Check related collections (sizes, colors, features)
- [ ] Validate data integrity
- [ ] Create backup of migrated data

### Phase 3: Image Handling

#### If Option A (Keep URLs):

- [ ] Add images_url field to shoes collection
- [ ] Update migration script to include URLs
- [ ] Run migration
- [ ] Update frontend to use images_url field

#### If Option B (Migrate Files):

- [ ] Create image download script
- [ ] Download all images to temp folder
- [ ] Create image upload script
- [ ] Upload images to Directus
- [ ] Create shoe_images relations
- [ ] Verify images in admin panel
- [ ] Update frontend to use shoe_images
- [ ] Test image transformations

### Phase 4: Frontend Integration

- [ ] Install @directus/sdk package
- [ ] Create src/lib/directus.ts
- [ ] Create src/services/directus folder
- [ ] Create shoes.ts service
- [ ] Create index.ts for exports
- [ ] Create src/hooks/useShoes.ts (optional)
- [ ] Create src/utils/directus-image.ts (image transformation utilities)
- [ ] Add environment variables to .env.local
- [ ] Update HomePage to use API
- [ ] Update CategoryPage to use API
- [ ] Update ShoePage to use API
- [ ] Update any other pages using shoes data
- [ ] Add loading states
- [ ] Add error handling
- [ ] Test all pages with new API

### Phase 5: Testing & Cleanup

- [ ] Run all existing tests
- [ ] Test home page loading
- [ ] Test category filtering
- [ ] Test product detail pages
- [ ] Test add to cart functionality
- [ ] Test wishlist functionality
- [ ] Test image loading and transformations
- [ ] Test different image formats (WebP, AVIF)
- [ ] Test image quality settings
- [ ] Test responsive images
- [ ] Test error states
- [ ] Test loading states
- [ ] Remove src/data/shoes.ts
- [ ] Update imports if any remain
- [ ] Run npm run type-check
- [ ] Run npm run lint
- [ ] Run npm run build
- [ ] Update documentation
- [ ] Create backup script
- [ ] Document migration process

---

## 🚀 Getting Started

### Quick Start Guide

**1. Clone and Setup Backend**

```bash
cd backend
npm init -y
npm install directus
cp .env.example .env
# Edit .env with your configuration
npx directus start
```

**Or install globally for easier access:**

```bash
npm install -g directus
directus start
```

**2. Access Admin Panel**

- Open: http://localhost:8055
- Login with admin credentials
- Create collections and set permissions

**3. Migrate Data**

```bash
cd backend/scripts
npx ts-node migrate-data.ts
```

**4. Update Frontend**

```bash
cd ..
npm install @directus/sdk
# Create service layer
# Update components
```

**5. Test Integration**

```bash
npm run dev
# Open http://localhost:5173
# Verify data loads from Directus
```

**6. Stop Directus**

```bash
# Press Ctrl+C in terminal running Directus
# Or kill process: kill $(lsof -ti:8055)
```

---

## 📊 Estimated Timeline

| Phase                         | Duration      | Dependencies |
| ----------------------------- | ------------- | ------------ |
| Phase 1: Backend Setup        | 1 week        | None         |
| Phase 2: Data Migration       | 1 week        | Phase 1      |
| Phase 3: Image Handling       | 1-3 days      | Phase 2      |
| Phase 4: Frontend Integration | 1 week        | Phase 3      |
| Phase 5: Testing & Cleanup    | 1 week        | Phase 4      |
| **Total**                     | **4-5 weeks** | Sequential   |

---

## 🎓 Learning Resources

### Directus Documentation

- [Official Documentation](https://docs.directus.io/)
- [Getting Started Guide](https://docs.directus.io/getting-started/)
- [API Reference](https://docs.directus.io/reference/)

### Directus SDK

- [JavaScript/TypeScript SDK](https://docs.directus.io/reference/sdk/)
- [Directus SDK Examples](https://github.com/directus/sdk-js)

### SQLite & Directus

- [SQLite with Directus](https://docs.directus.io/getting-started/installing/)
- [Database Configuration](https://docs.directus.io/getting-started/configuring/)

---

## ❓ FAQ

### Q: Can I switch from SQLite to PostgreSQL later?

**A:** Yes! Directus makes it easy to switch databases. Just change the DB configuration and migrate the data.

### Q: Do I need Docker?

**A:** No! This project uses Node.js/npx to run Directus directly. No Docker required. Just run: `npx directus start`

### Q: How do I handle user accounts?

**A:** Directus has built-in authentication. You can create a `users` collection and use Directus Auth for login/registration.

### Q: Can I use GraphQL instead of REST?

**A:** Yes! Directus supports both REST and GraphQL. Just replace the `rest()` SDK call with `graphql()`.

### Q: How do I handle search?

**A:** Directus has built-in search. Use `filter` with `_contains` or implement full-text search with custom endpoints.

### Q: Can I deploy this to production?

**A:** Yes! Directus is production-ready. Consider:

- Switching from SQLite to PostgreSQL
- Using S3 for file storage
- Setting up proper backups
- Using HTTPS
- Implementing rate limiting

### Q: What about caching?

**A:** Use React Query/TanStack Query in the frontend. Directus also supports Redis caching.

### Q: How do I handle image uploads in the admin panel?

**A:** The Directus admin panel has built-in file upload. Content editors can drag-and-drop images directly.

---

## 🤝 Support & Next Steps

**Need Help?**

- Directus Discord: https://discord.gg/directus
- Directus GitHub: https://github.com/directus/directus
- Documentation: https://docs.directus.io/

**Next Steps After Migration:**

1. Implement user authentication
2. Add review system
3. Create admin dashboard analytics
4. Set up automated backups
5. Deploy to production
6. Implement real-time updates (WebSockets)

---

## 📝 Notes

- Keep `src/data/shoes.ts` until migration is fully complete and tested
- Test thoroughly before removing mock data
- Document any customizations or deviations from this plan
- Regular backups during migration process
- Consider versioning database schema
- **No Docker required** - This project uses Node.js and npx
- **Directus built-in image transformations** are powerful enough for most use cases - no external services needed
  - Resize, crop, rotate, flip
  - Format conversion (WebP, AVIF, JPEG, PNG)
  - Quality optimization
  - Effects (blur, brightness, contrast, grayscale, sepia)
  - URL-based API
  - See "Directus Built-in Image Transformations" section for details
- Generate secure keys with: `openssl rand -base64 32` (Linux/Mac) or use an online generator for Windows

### Quick Reference Commands

**Start Directus:**

```bash
cd backend
npx directus start
```

**Stop Directus:**

```bash
# Press Ctrl+C
# Or kill: kill $(lsof -ti:8055)
```

**Test Image Transformations:**

```bash
# Once Directus is running and images are uploaded, test transformations
# Replace {file-id} with actual image ID

# Basic resize
curl "http://localhost:8055/assets/{file-id}?width=400&height=400" -o test-resize.jpg

# Format conversion to WebP
curl "http://localhost:8055/assets/{file-id}?format=webp&quality=80" -o test-webp.webp

# Crop with fit=cover
curl "http://localhost:8055/assets/{file-id}?width=800&height=600&fit=cover" -o test-crop.jpg

# Rotate
curl "http://localhost:8055/assets/{file-id}?rotate=90" -o test-rotate.jpg

# Combined transformations
curl "http://localhost:8055/assets/{file-id}?width=400&height=400&format=webp&quality=75&fit=cover" -o test-complete.webp
```

**Or open in browser:**

```
http://localhost:8055/assets/{file-id}?width=400&height=400&format=webp&quality=75&fit=cover
```

**Generate secure keys:**

```bash
# Linux/Mac
KEY=$(openssl rand -base64 32)
SECRET=$(openssl rand -base64 32)

# Windows (PowerShell)
$env:KEY = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
$env:SECRET = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

---

**Last Updated:** January 15, 2026
**Version:** 2.0 (No Docker)
**Status:** Planning Phase
