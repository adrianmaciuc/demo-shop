# SQLite to PostgreSQL/Supabase Migration Plan

**Project**: Apex Shoes E-Commerce  
**Current Setup**: Strapi v5 + SQLite (locally), frontend on Vercel, backend on Render  
**Target Setup**: Strapi v5 + PostgreSQL (via Supabase), same deployment platforms  
**Date**: January 2026  
**Data Migration**: Starting fresh - no data preservation required

---

## 📋 Table of Contents

1. [Overview & Rationale](#overview--rationale)
2. [Current Architecture Analysis](#current-architecture-analysis)
3. [Supabase Setup](#supabase-setup)
4. [Backend Configuration](#backend-configuration)
5. [Database Schema Migration](#database-schema-migration)
6. [Local Development Setup](#local-development-setup)
7. [Testing & Validation](#testing--validation)
8. [Deployment to Render](#deployment-to-render)
9. [Frontend Integration](#frontend-integration)
10. [Manual Configuration Checklist](#manual-configuration-checklist)
11. [Rollback Plan](#rollback-plan)
12. [Post-Migration Validation](#post-migration-validation)

---

## 🎯 Overview & Rationale

### Why PostgreSQL + Supabase?

| Aspect          | SQLite                      | PostgreSQL/Supabase                     |
| --------------- | --------------------------- | --------------------------------------- |
| **Scalability** | Single file, limited        | Highly scalable, production-ready       |
| **Concurrency** | Limited connection handling | Handles high concurrent requests        |
| **Backups**     | Manual file backup          | Automatic, point-in-time recovery       |
| **Security**    | File-system based           | Enterprise-grade security, encryption   |
| **Render.com**  | Not recommended             | Perfect for Render deployments          |
| **Cost**        | Free (storage)              | Free tier, pay-as-you-go                |
| **Features**    | Basic                       | Realtime, Auth, Storage, Edge Functions |

### Current Limitations with SQLite

- ❌ Cannot handle high traffic (concurrent requests blocked)
- ❌ No built-in backups or recovery
- ❌ File-based on server filesystem (risky in production)
- ❌ Difficult to scale horizontally
- ❌ Performance degrades with large datasets

### Supabase Advantages

- ✅ PostgreSQL database with automatic backups
- ✅ Free tier with 500MB storage
- ✅ Realtime features out-of-the-box
- ✅ Built-in authentication & authorization
- ✅ REST API automatically generated
- ✅ Point-in-time recovery (PITR)
- ✅ Perfect for Strapi deployment
- ✅ Easy SSL/TLS configuration

---

## 🏗️ Current Architecture Analysis

### Backend Stack

```
┌─────────────────────────────────────┐
│      Render.com (Production)        │
│  ┌───────────────────────────────┐  │
│  │    Strapi v5 (Node.js)        │  │
│  │  - Port: 1337                 │  │
│  │  - Deployment: Node.js build  │  │
│  │  - Database: SQLite (.tmp/)   │  │
│  │  - Auth: Users & Permissions  │  │
│  │  - API: RESTful               │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Frontend Stack

```
┌─────────────────────────────────────┐
│     Vercel.com (Production)         │
│  ┌───────────────────────────────┐  │
│  │   React 19 + TypeScript       │  │
│  │  - Vite build system          │  │
│  │  - Tailwind CSS               │  │
│  │  - React Router DOM           │  │
│  │  - Contexts: Auth/Cart        │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
       ↓ API calls (REST)
       ↓ to backend:1337
```

### Current Database Content Types (Strapi)

- **Shoes**: Product catalog
- **Orders**: Order management
- **Users**: User accounts (via Users & Permissions plugin)
- **Wishlist**: User wishlists (if implemented)

---

## 🚀 Supabase Setup

### Step 1: Create Supabase Account

**Manual Configuration Required ✋**

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with email or GitHub account
4. Create organization (free tier available)

### Step 2: Create Project

**Manual Configuration Required ✋**

1. In Supabase dashboard, click "New Project"
2. Configure:
   - **Name**: `apex-shoes-prod` (or similar)
   - **Password**: Generate a strong password (save for `.env`)
   - **Region**: Choose closest to your deployment region
     - If deploying on Render: Check Render's data center locations
     - Recommended: EU (Frankfurt) or US (Virginia)
3. Click "Create new project"
4. Wait for database to initialize (~2 minutes)

### Step 3: Retrieve Connection Details

**Manual Configuration Required ✋**

In Supabase dashboard:

1. Go to **Project** → Click **Connect** button (top-level navigation)
2. Under **Connection string**, change the dropdown from **Direct connection** to **Transaction pooler**
3. Copy the **Connection string** - use this as your `DATABASE_URL`:
   ```
   postgresql://postgres:[password]@[host]:6543/postgres?sslmode=require
   ```
4. For Strapi, also note the individual values:
   - **Host**: `[project-ref].supabase.co`
   - **Database**: `postgres`
   - **Port**: `5432` (direct) or `6543` (transaction pooler)
   - **Username**: `postgres`
   - **Password**: [Your master password]

**Why Transaction Pooler?**
- Supabase Free tier only allows 3 direct connections
- Transaction pooler (port 6543) enables connection pooling
- Better for serverless/Node.js apps like Strapi that open many short-lived connections
- Strapi works perfectly with pooled connections

5. Add to `.env` file (for Strapi):
   ```env
   DATABASE_CLIENT=postgres
   DATABASE_URL=postgresql://postgres:[password]@[host]:6543/postgres?sslmode=require
   DATABASE_SSL=true
   ```

**Important:** Do NOT include `https://` in any connection string - PostgreSQL uses `postgresql://` protocol.

### Step 4: Network Security

**Manual Configuration Required ✋**

1. In Supabase dashboard → **Settings** → **Database**
2. Scroll to **IP Whitelist**
3. Add your local machine IP:
   - Get IP from terminal: `curl https://api.ipify.org`
   - Add IP to whitelist
4. Add Render's IP ranges (deployment address ranges)
   - Render uses dynamic IPs; allow all: `0.0.0.0/0` (requires SSL)
   - Or check Render's current outbound IPs

---

## 🔧 Backend Configuration

### Phase 1: Update Strapi Configuration

#### File: `/demo-shop-backend/config/database.ts`

**Changes Required:**

1. Update from SQLite to PostgreSQL connection
2. Use `DATABASE_URL` for better pooling support
3. Add SSL configuration for Supabase
4. Keep existing connection configs as fallbacks

```typescript
import path from "path";

export default ({ env }) => {
  const client = env("DATABASE_CLIENT", "postgres");

  const connections = {
    mysql: {
      connection: {
        host: env("DATABASE_HOST", "localhost"),
        port: env.int("DATABASE_PORT", 3306),
        database: env("DATABASE_NAME", "strapi"),
        user: env("DATABASE_USERNAME", "strapi"),
        password: env("DATABASE_PASSWORD", "strapi"),
        ssl: env.bool("DATABASE_SSL", false) && {
          rejectUnauthorized: false,
        },
      },
      pool: {
        min: env.int("DATABASE_POOL_MIN", 2),
        max: env.int("DATABASE_POOL_MAX", 10),
      },
    },
    postgres: {
      connection: {
        connectionString: env("DATABASE_URL"),
        ssl: env.bool("DATABASE_SSL", true)
          ? { rejectUnauthorized: false }
          : false,
        schema: env("DATABASE_SCHEMA", "public"),
      },
      pool: {
        min: env.int("DATABASE_POOL_MIN", 2),
        max: env.int("DATABASE_POOL_MAX", 10),
      },
    },
    sqlite: {
      connection: {
        filename: path.join(
          __dirname,
          "..",
          "..",
          env("DATABASE_FILENAME", ".tmp/data.db"),
        ),
      },
      useNullAsDefault: true,
    },
    // ... mysql, sqlite configs
  };

  const connection = connections[client];

  return {
    connection: {
      client,
      ...connection,
      acquireConnectionTimeout: env.int("DATABASE_CONNECTION_TIMEOUT", 60000),
    },
  };
};
```

#### File: `/demo-shop-backend/.env.example`

Add new PostgreSQL examples:

```env
# ============================================
# DATABASE CONFIGURATION
# ============================================

# For PostgreSQL/Supabase (Production) - USE TRANSACTION POOLER
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://postgres:[password]@[project-ref].supabase.co:6543/postgres?sslmode=require
DATABASE_SSL=true
DATABASE_SCHEMA=public
DATABASE_POOL_MIN=1
DATABASE_POOL_MAX=3

# For SQLite (Local Development - Optional)
# DATABASE_CLIENT=sqlite
# DATABASE_FILENAME=.tmp/data.db
```

#### File: `/demo-shop-backend/package.json`

Add PostgreSQL driver dependency:

```diff
{
  "dependencies": {
    "@strapi/plugin-cloud": "5.33.3",
    "@strapi/plugin-users-permissions": "5.33.3",
    "@strapi/strapi": "5.33.3",
    "better-sqlite3": "12.4.1",
+   "pg": "^8.11.3",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-router-dom": "^6.0.0",
    "styled-components": "^6.0.0"
  }
}
```

### Phase 2: Environment Variables Setup

#### Local Development

**File**: `/demo-shop-backend/.env`

```env
# ============================================
# SUPABASE POSTGRESQL (Transaction Pooler)
# ============================================
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@pyigzocgbryuaqqgximk.supabase.co:6543/postgres?sslmode=require
DATABASE_SSL=true
DATABASE_SCHEMA=public
DATABASE_POOL_MIN=1
DATABASE_POOL_MAX=3

# ============================================
# STRAPI CONFIG
# ============================================
HOST=0.0.0.0
PORT=1337
APP_KEYS=your-app-keys
JWT_SECRET=your-jwt-secret
ADMIN_JWT_SECRET=your-admin-jwt-secret
NODE_ENV=development
```

#### Production (Render)

**Manual Configuration Required ✋**

In Render dashboard:

1. Go to your backend service
2. Settings → Environment
3. Add variables (use Transaction Pooler port 6543):
   ```
   DATABASE_CLIENT=postgres
   DATABASE_URL=postgresql://postgres:[password]@[host].supabase.co:6543/postgres?sslmode=require
   DATABASE_SSL=true
   DATABASE_SCHEMA=public
   DATABASE_POOL_MIN=1
   DATABASE_POOL_MAX=3
   NODE_ENV=production
   ```
4. Trigger redeploy from GitHub

---

## 📊 Database Schema Migration

### Overview

Since we're starting from scratch, we don't need data migration scripts. However, we need to:

1. ✅ Let Strapi auto-generate schema from content types
2. ✅ Recreate content types in Strapi
3. ✅ Test data insertion

### Schema Creation Strategy

**Strapi will auto-create schema on first run with:**

1. All content type tables
2. User and permissions tables (from plugin)
3. Audit logs
4. Draft/publish tables

### Content Types to Recreate (Strapi Admin Panel)

#### 1. Shoes Collection

**Fields:**

- `name` (Text) - Required
- `brand` (Text) - Required
- `price` (Decimal) - Required
- `category` (Select: sneakers, running, casual, formal, boots) - Required
- `description` (Rich text) - Required
- `featured` (Boolean) - Default: false
- `in_stock` (Boolean) - Default: true
- `images` (Media, multiple) - Required
- `sizes` (Decimal, multiple) - Required
- `colors` (Text, multiple) - Optional

#### 2. Orders Collection

**Fields:**

- `orderNumber` (Text, unique) - Required
- `user` (Relation to Users) - Required
- `status` (Select: pending, processing, shipped, delivered, cancelled)
- `items` (JSON) - Required
- `shippingAddress` (JSON) - Required
- `total` (Decimal) - Required
- `createdAt` (DateTime) - Auto

#### 3. Wishlists Collection

**Fields:**

- `user` (Relation to Users) - Required
- `shoes` (Relation to Shoes, many-to-many) - Required

### Steps to Create Schema

1. **Run Strapi with PostgreSQL** (next section)
2. **Login to Strapi Admin** (http://localhost:1337/admin)
3. **Create content types** via admin UI:
   - Content Manager → Create new collection type
   - Define fields as above
4. **Set permissions** (Users & Permissions → Roles)
5. **Publish content types**

---

## 💻 Local Development Setup

### Step 1: Update Dependencies

```bash
cd /home/adi/Desktop/code/apex-shoes/demo-shop-backend

# Install PostgreSQL driver
npm install pg

# Verify Strapi is up to date
npm update @strapi/strapi

# Install all dependencies
npm install
```

### Step 2: Configure Environment

Create `.env` file with Supabase credentials (use Transaction Pooler):

```env
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://postgres:your-password@your-project.supabase.co:6543/postgres?sslmode=require
DATABASE_SSL=true
DATABASE_SCHEMA=public
DATABASE_POOL_MIN=1
DATABASE_POOL_MAX=3
HOST=0.0.0.0
PORT=1337
NODE_ENV=development
APP_KEYS=key1,key2,key3
JWT_SECRET=your-jwt-secret
ADMIN_JWT_SECRET=your-admin-jwt-secret
```

**Get APP_KEYS and Secrets:**

```bash
# Generate new secrets in Strapi
npm run strapi
# Or manually create strong random strings (32+ chars each)
```

### Step 3: Test Local Connection

```bash
cd /home/adi/Desktop/code/apex-shoes/demo-shop-backend

# Start Strapi development server
npm run dev

# Expected output:
# ┌───────────────────────────────────────────────┐
# │ Welcome to Strapi 5                           │
# │                                               │
# │ URL: http://localhost:1337/admin              │
# └───────────────────────────────────────────────┘
```

### Step 4: Initial Admin User

On first run with new database:

1. Strapi prompts to create admin user
2. Enter email and password
3. Admin panel opens at `http://localhost:1337/admin`

### Step 5: Verify PostgreSQL Connection

In Supabase dashboard:

1. Go to **Settings** → **Network**
2. Ensure your local IP is in **Allowed IPs**
   - Find your IP: `curl https://api.ipify.org`
   - Add it to the allowlist
3. Go to **SQL Editor**
4. Run query to verify tables created:
   ```sql
   SELECT * FROM information_schema.tables
   WHERE table_schema = 'public';
   ```
5. Should see Strapi system tables created

---

## ✅ Testing & Validation

### Phase 1: Local Connection Tests

#### Test 1: Database Connectivity

```bash
cd /demo-shop-backend
npm run dev

# Check logs:
# ✓ Database connection established
# ✓ Schema synchronized
```

#### Test 2: Admin Panel

```
Visit: http://localhost:1337/admin
- Should load without errors
- Should let you create admin user on first visit
```

#### Test 3: API Endpoint

```bash
curl http://localhost:1337/api/shoes
# Should return empty array (no shoes created yet)
# Response: { "data": [], "meta": {} }
```

#### Test 4: Content Type Creation

1. Login to admin at `http://localhost:1337/admin`
2. Create a content type "Shoes"
3. Add sample shoe entry
4. Verify API returns data:
   ```bash
   curl http://localhost:1337/api/shoes
   # Should return created shoe
   ```

### Phase 2: Deployment Validation (Render)

#### Pre-deployment Checklist

- [ ] `.env` file created with Supabase credentials
- [ ] `package.json` includes `pg` driver
- [ ] `config/database.ts` updated for PostgreSQL
- [ ] Content types created in local Strapi
- [ ] Sample data created and verified
- [ ] All tests passed locally

#### Deployment Steps

1. **Push to GitHub:**

   ```bash
   git add .
   git commit -m "chore: migrate database to PostgreSQL/Supabase"
   git push origin main
   ```

2. **Update Render Environment Variables:**
   - Go to Render dashboard → Backend service
   - Settings → Environment
   - Add all PostgreSQL variables
   - Save and trigger redeploy

3. **Monitor Deployment:**
   - Check Render logs for errors
   - Verify database tables created
   - Test API endpoints

---

## 🎨 Frontend Integration

### Current Frontend Setup

**File Structure:**

```
demo-shop-frontend/
├── src/
│   ├── services/
│   │   ├── api.ts (API client)
│   │   └── directus/
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   │   └── WishlistContext.tsx
│   ├── types/
│   │   └── index.ts
│   └── ...
└── package.json
```

### API Service Updates

#### File: `/demo-shop-frontend/src/services/api.ts`

**Changes Required:**

1. Update base URL to Render backend (already may be set)
2. Ensure JWT token handling
3. Add error handling for Supabase SSL

```typescript
import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL || "https://your-backend.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
```

#### Environment Variables

**File**: `/demo-shop-frontend/.env.production`

```env
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

**File**: `/demo-shop-frontend/.env.development`

```env
REACT_APP_API_URL=http://localhost:1337/api
```

### Context Integration

No changes needed to AuthContext, CartContext, or WishlistContext. They already:

- Store JWT tokens
- Make API calls
- Handle errors appropriately

### Testing Frontend with New Backend

```bash
cd /demo-shop-frontend

# Build frontend
npm run build

# Test with backend running locally
npm run preview

# Visit http://localhost:4173
# - Login should work
# - Cart operations should sync
# - Wishlist should persist
```

---

## 📋 Manual Configuration Checklist

### Pre-Migration

- [ ] Read this entire plan
- [ ] Backup any important SQLite data (optional, starting fresh)
- [ ] Create GitHub branch for changes
- [ ] Notify team of upcoming migration window

### Supabase Setup (Manual ✋)

- [ ] Create Supabase account at supabase.com
- [ ] Create new project in Supabase
- [ ] Get connection string (USE TRANSACTION POOLER):
  - [ ] Go to **Project** → **Connect** button (top nav)
  - [ ] Select **Transaction pooler** from dropdown
  - [ ] Copy DATABASE_URL: `_____________________`
- [ ] Configure IP whitelist in Supabase dashboard
  - [ ] Add local machine IP
  - [ ] Add Render's outbound IPs (or allow 0.0.0.0/0 with SSL)

### Local Development (Semi-Automated)

- [ ] Run: `npm install pg`
- [ ] Create `.env` file with Supabase credentials
- [ ] Use Transaction Pooler: `DATABASE_URL=postgresql://...@...supabase.co:6543/postgres?sslmode=`
- [ ] Add pool settings: `DATABASE_POOL_MIN=1`, `DATABASE_POOL_MAX=3`
- [ ] Update `config/database.ts` to PostgreSQL config
- [ ] Update `.env.example` with PostgreSQL template
- [ ] Run: `npm run dev`
- [ ] Create admin user in Strapi
- [ ] Create content types (Shoes, Orders, etc.)
- [ ] Add sample data for testing

### Testing (Automated)

- [ ] Database connection test passes
- [ ] Admin panel loads at `http://localhost:1337/admin`
- [ ] API endpoints respond at `http://localhost:1337/api`
- [ ] Frontend connects to local backend
- [ ] All CRUD operations work:
  - [ ] Create shoe → API returns data
  - [ ] Read shoes → API returns list
  - [ ] Update shoe → API reflects changes
  - [ ] Delete shoe → API confirms deletion

### Render Deployment (Manual ✋)

- [ ] Commit changes to GitHub
- [ ] Update Render environment variables:
  - [ ] DATABASE_CLIENT=postgres
  - [ ] DATABASE_URL=`postgresql://postgres:[password]@[host].supabase.co:6543/postgres?sslmode=require`
  - [ ] DATABASE_POOL_MIN=1
  - [ ] DATABASE_POOL_MAX=3
- [ ] Trigger manual deploy in Render
- [ ] Monitor deploy logs for errors
- [ ] Test production API at `https://your-backend.onrender.com/api`

### Vercel Frontend (Optional Updates)

- [ ] Update `REACT_APP_API_URL` environment variable if backend URL changed
- [ ] Trigger redeploy to pick up new environment
- [ ] Test login, cart, wishlist in production

### Post-Migration Validation

- [ ] Verify Supabase database has all tables
- [ ] Test admin login at `https://your-backend.onrender.com/admin`
- [ ] Test API endpoints with cURL
- [ ] Test frontend on Vercel
- [ ] Monitor error logs for issues
- [ ] Verify backups are enabled in Supabase

---

## ⏮️ Rollback Plan

If migration fails:

### Option 1: Revert to SQLite (Quick)

```bash
# Revert database config
git checkout config/database.ts

# Revert environment
rm .env
cp .env.sqlite .env

# Reinstall
npm install

# Run with SQLite
npm run dev
```

### Option 2: Restore from GitHub

```bash
# Revert to pre-migration commit
git revert [migration-commit-hash]
git push origin main

# Render will auto-redeploy with old config
```

### Option 3: Keep Supabase, Fix Issues

1. Check Render logs for specific errors
2. Verify Supabase network settings
3. Check environment variables match exactly
4. Restart Render service with updated config

---

## 🔍 Post-Migration Validation

### Week 1 Checks

- [ ] Monitor error logs (Render + Supabase)
- [ ] Verify database backups running (Supabase automatic)
- [ ] Test user registration and login flows
- [ ] Verify order creation and retrieval
- [ ] Check API response times (should be similar to SQLite)
- [ ] Validate SSL certificate (should auto-renew)
- [ ] Monitor database size in Supabase dashboard

### Performance Benchmarks

| Operation        | Expected Time | Location     |
| ---------------- | ------------- | ------------ |
| Create user      | < 200ms       | Strapi Admin |
| List shoes (100) | < 300ms       | Frontend     |
| Place order      | < 500ms       | Frontend     |
| Query wishlist   | < 150ms       | Frontend     |

### Backup Verification

1. Supabase dashboard → Backups
2. Verify automatic backups running daily
3. Test point-in-time recovery (optional):
   - Create test table
   - Delete it
   - Recover from backup
   - Verify table restored

### Data Integrity Checks

```sql
-- In Supabase SQL Editor
-- Verify key tables exist and have correct schemas

SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check shoe count
SELECT COUNT(*) FROM shoes;

-- Check user count
SELECT COUNT(*) FROM strapi_users;

-- Check order count
SELECT COUNT(*) FROM orders;
```

---

## 📚 Reference Architecture (Post-Migration)

```
┌──────────────────────────────────────────────────────────┐
│                    Vercel CDN                            │
│              (Frontend - React + TypeScript)             │
│                  https://apex-shoes.com                  │
└────────────────────────┬─────────────────────────────────┘
                         │ HTTPS REST API
                         ↓
┌──────────────────────────────────────────────────────────┐
│                   Render.com                             │
│              (Backend - Strapi v5 + Node.js)             │
│              https://backend.onrender.com:1337           │
└────────────────────────┬─────────────────────────────────┘
                         │ Database Connection (SSL)
                         ↓
┌──────────────────────────────────────────────────────────┐
│                  Supabase PostgreSQL                      │
│         (Managed Database with Auto Backups)             │
│          host.supabase.co:5432 (SSL Connection)          │
│                                                          │
│  ┌──────────────────────────────────────────────┐       │
│  │         Database: postgres                   │       │
│  │  ├─ Public Schema                            │       │
│  │  │  ├─ shoes (products)                      │       │
│  │  │  ├─ orders (user orders)                  │       │
│  │  │  ├─ wishlists (saved items)               │       │
│  │  │  └─ strapi_* (Strapi system tables)       │       │
│  │  └─ Automatic backups (daily)                │       │
│  │  └─ Point-in-time recovery (14 days)         │       │
│  └──────────────────────────────────────────────┘       │
└──────────────────────────────────────────────────────────┘
```

---

## 🚨 Important Notes

### SSL/TLS Connections

- **Required**: Supabase enforces SSL for all connections
- **Handled by**: Strapi automatically with `DATABASE_SSL=true`
- **Certificate**: Managed by Supabase (no action needed)

### Connection Pooling

- **Local**: Strapi uses connection pooling (default: 2-10 connections)
- **Supabase Free**: Only 3 direct connections - USE TRANSACTION POOLER (port 6543)
- **Production**: Use `DATABASE_URL` with transaction pooler for better connection management
- **Pool settings** (add to `.env`):
  ```
  DATABASE_POOL_MIN=1
  DATABASE_POOL_MAX=3
  ```

### Data Migration

- **Decision**: Starting fresh with new database
- **Reason**: Demo app with non-critical data
- **Backup**: SQLite database file can be kept for reference

### Costs

**Supabase Free Tier:**

- Storage: 500MB
- Bandwidth: 2GB/month
- Database connections: **3 direct** (use Transaction Pooler for more)

**Critical for Free Tier:**
- Use **Transaction Pooler** (port 6543) for connection pooling
- Set pool limits: `DATABASE_POOL_MIN=1`, `DATABASE_POOL_MAX=3`
- This allows handling more concurrent requests despite the 3 connection limit

**When to upgrade:**

- Storage > 500MB
- High concurrent usage
- Advanced features needed

---

## 📞 Support Resources

### Documentation Links

- [Supabase Docs](https://supabase.com/docs)
- [Supabase PostgreSQL](https://supabase.com/docs/guides/database)
- [Strapi Database Guide](https://docs.strapi.io/cms/configurations/database)
- [Strapi PostgreSQL Setup](https://docs.strapi.io/cms/configurations/database#postgresql)
- [Render Deployment Docs](https://docs.render.com)

### Common Issues & Solutions

| Issue                                    | Solution                               |
| ---------------------------------------- | -------------------------------------- |
| `getaddrinfo ENOTFOUND https`            | Remove `https://` from host - use `postgresql://` protocol |
| `Knex: Timeout acquiring a connection`   | Use Transaction Pooler (port 6543) + DATABASE_URL |
| `ERROR: password authentication failed`  | Check Supabase password in `.env`      |
| `connect ECONNREFUSED`                   | Verify Supabase host and whitelist IP  |
| `SSL: CERTIFICATE_VERIFY_FAILED`         | Set `sslmode=require` in DATABASE_URL  |
| `error: relation "shoes" does not exist` | Create content type in Strapi admin    |
| `timeout connecting to database`         | Use Transaction Pooler (Supabase Free) |

---

## ✨ Next Steps After Migration

Once PostgreSQL is live:

1. **Monitor Performance** (Week 1)
   - Check response times
   - Monitor database metrics
   - Review error logs

2. **Implement Advanced Features**
   - Realtime updates (Supabase Realtime)
   - Full-text search (PostgreSQL native)
   - Complex queries (PostgreSQL advantages)

3. **Scale Features**
   - Add analytics
   - Implement caching layer
   - Add webhooks for events

4. **Security Enhancements**
   - Enable Row-Level Security (RLS)
   - Implement audit logging
   - Add rate limiting

---

## 📝 Change Log

| Date        | Item                   | Status      |
| ----------- | ---------------------- | ----------- |
| Jan 19 2026 | Plan created           | ✅ Complete |
| TBD         | Supabase account setup | ⏳ Pending  |
| TBD         | Backend configuration  | ⏳ Pending  |
| TBD         | Local testing complete | ⏳ Pending  |
| TBD         | Render deployment      | ⏳ Pending  |
| TBD         | Post-launch validation | ⏳ Pending  |

---

**Last Updated**: January 19, 2026  
**Prepared by**: Migration Planning Agent  
**Status**: Ready for Implementation
