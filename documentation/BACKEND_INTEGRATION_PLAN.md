# Backend Integration Plan - Apex Shoes E-Commerce

This document outlines the comprehensive plan for adding backend functionality to Apex Shoes using Strapi v5 with SQLite database. The implementation is divided into three phases: Frontend User Features, Backend Setup, and Integration.

## Overview

**Current State**: Demo e-commerce frontend with mock data, localStorage-based wishlist/cart
**Target State**: Full-stack e-commerce with user authentication, persistent data, and order management

**Technology Additions**:

- **Backend**: Strapi v5 (latest) with SQLite database
- **Authentication**: JWT-based auth via Strapi Users & Permissions plugin
- **Data Persistence**: User profiles, wishlists, orders stored in Strapi
- **API Communication**: RESTful API with JWT tokens

**References**:

- Strapi v5 Documentation: https://docs.strapi.io/
- Strapi Installation Guide: https://docs.strapi.io/cms/installation
- Strapi Authentication: https://docs.strapi.io/cms/features/users-permissions
- Strapi Database Configuration: https://docs.strapi.io/cms/configurations/database

---

## Phase 1: Frontend User Features

### Goal

Add user authentication UI, profile management, order tracking, and integrate wishlist with user accounts. All features will work with mock data initially and prepare for backend connection.

### 1.1 Authentication System

#### Components to Create

**`src/pages/LoginPage.tsx`** (NEW)

- Login form with email/password fields
- Form validation using existing validation utilities
- Error handling and loading states
- Navigation to profile or redirect after login
- Links to registration page

**`src/pages/RegisterPage.tsx`** (NEW)

- Registration form with username, email, password, confirm password
- Form validation
- Success/error handling
- Navigation to login after registration

**`src/components/auth/AuthFormStyles.ts`** (NEW)

- Reusable form styling components
- Input field components with validation states
- Button components

#### Context to Create

**`src/context/AuthContext.tsx`** (NEW)

- Authentication state management (user, token, loading, error)
- Login, register, logout functions
- JWT token storage in localStorage
- Persist authentication state across sessions
- Check token validity on app load
- Provide `useAuth()` hook

**AuthContext Type Definition**:

```typescript
interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  error: string | null;
}
```

### 1.2 Navigation Updates

**Update `src/components/layout/Navigation.tsx`**

Add user menu with conditional rendering:

- **Before login**: Login and Register links
- **After login**: User avatar/icon with dropdown menu containing:
  - My Profile
  - My Orders
  - My Wishlist
  - Logout

**New UI Elements**:

- User avatar/icon button in nav actions area
- Dropdown menu component (reuse or create new)
- Badge for logged-in state

### 1.3 Profile Management

#### Components to Create

**`src/pages/ProfilePage.tsx`** (NEW)

- User information display (username, email, member since date)
- Edit profile functionality (update username, email)
- Change password section
- Loading and error states

**`src/pages/OrdersPage.tsx`** (NEW - rename from existing or new)

- Display user's order history
- Order status tracking (processing, shipped, delivered)
- Order details view
- Reorder functionality

### 1.4 Wishlist Integration with User Account

#### Updates to `src/context/WishlistContext.tsx`

Add backend sync capability:

- `syncWishlistWithBackend()` function
- Fetch wishlist from backend when user logs in
- Push local wishlist changes to backend
- Handle merge conflicts (server wins)

#### Updates to `src/pages/WishlistPage.tsx`

- Add "Save to account" button for non-logged-in users
- Add "Sync with account" functionality
- Show wishlist sync status

### 1.5 Product Page Enhancements

**Update `src/pages/ShoePage.tsx`**

Add "Add to Wishlist" button functionality:

- For logged-in users: Sync to backend immediately
- For non-logged-in users: Show toast "Login to save to your wishlist"
- Visual feedback on wishlist state

### 1.6 Type System Updates

**Update `src/types/index.ts`**

Add new types for user features:

```typescript
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  phone?: string;
  addresses: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface UserOrder {
  id: string;
  orderNumber: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  shoe: Shoe;
  size: number;
  color: string;
  quantity: number;
  price: number;
}

export interface WishlistItem {
  id: string;
  shoeId: string;
  addedAt: string;
}
```

### 1.7 API Service Layer

**Create `src/services/api.ts`** (NEW)

Abstract backend communication:

```typescript
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1337/api";

interface ApiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

class ApiService {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)["Authorization"] =
        `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "API request failed");
    }

    return response.json();
  }

  // Auth endpoints
  async login(identifier: string, password: string) {
    const response = await this.request<
      ApiResponse<{ user: User; jwt: string }>
    >("/auth/local", {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
    });
    this.setToken(response.data.jwt);
    return response.data;
  }

  async register(username: string, email: string, password: string) {
    const response = await this.request<
      ApiResponse<{ user: User; jwt: string }>
    >("/auth/local/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    });
    this.setToken(response.data.jwt);
    return response.data;
  }

  // User endpoints
  async getCurrentUser() {
    return this.request<ApiResponse<User>>("/users/me");
  }

  async updateUser(userId: string, data: Partial<User>) {
    return this.request<ApiResponse<User>>(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Wishlist endpoints
  async getWishlist() {
    return this.request<ApiResponse<WishlistItem[]>>("/wishlists");
  }

  async addToWishlist(shoeId: string) {
    return this.request<ApiResponse<WishlistItem>>("/wishlists", {
      method: "POST",
      body: JSON.stringify({ shoe: shoeId }),
    });
  }

  async removeFromWishlist(wishlistItemId: string) {
    return this.request<void>(`/wishlists/${wishlistItemId}`, {
      method: "DELETE",
    });
  }

  // Order endpoints
  async getOrders() {
    return this.request<ApiResponse<UserOrder[]>>("/orders");
  }

  async getOrder(orderId: string) {
    return this.request<ApiResponse<UserOrder>>(`/orders/${orderId}`);
  }

  async createOrder(orderData: CreateOrderData) {
    return this.request<ApiResponse<UserOrder>>("/orders", {
      method: "POST",
      body: JSON.stringify({ data: orderData }),
    });
  }
}

export const api = new ApiService();
```

### 1.8 Environment Configuration

**Create `.env.example`**

```env
VITE_API_URL=http://localhost:1337/api
VITE_STRAPI_TOKEN=your-development-token
```

### 1.9 Routing Updates

**Update `src/App.tsx`**

Add new routes:

```typescript
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));

// In routes array:
{ path: "/login", element: <LoginPage /> },
{ path: "/register", element: <RegisterPage /> },
{ path: "/profile", element: <ProfilePage /> },
{ path: "/orders", element: <OrdersPage /> },
```

### 1.10 Testing (Phase 1)

**Test Files to Create**:

- `src/__tests__/context/AuthContext.test.tsx`
- `src/__tests__/pages/LoginPage.test.tsx`
- `src/__tests__/pages/RegisterPage.test.tsx`
- `src/__tests__/services/api.test.ts`

**Coverage Requirement**: Maintain 70% coverage

---

## Phase 2: Backend Setup with Strapi v5

### Goal

Create Strapi v5 backend with SQLite database, configure authentication, and define content types for users, wishlists, and orders.

### 2.1 Project Initialization

**Create Strapi Project**:

```bash
cd /home/adi/Desktop/code/demo-shop
npx create-strapi-app@latest backend --quickstart --no-run
cd backend
npm install better-sqlite3
```

**References**:

- Strapi Installation: https://docs.strapi.io/cms/installation
- SQLite Configuration: https://docs.strapi.io/cms/configurations/database

### 2.2 Database Configuration

**File: `backend/config/database.ts`**

```typescript
import path from "path";

export default ({ env }) => ({
  connection: {
    client: "sqlite",
    connection: {
      filename: path.join(__dirname, "..", "..", "data.db"),
    },
    useNullAsDefault: true,
  },
});
```

**Environment Variables: `backend/.env`**

```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=your-app-keys-here
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt
JWT_SECRET=your-jwt-secret
```

### 2.3 Content Type Definitions

**Create `backend/src/api/wishlist/content-types/wishlist/schema.json`**

```json
{
  "kind": "collectionType",
  "collectionName": "wishlists",
  "info": {
    "singularName": "wishlist",
    "pluralName": "wishlists",
    "displayName": "Wishlist",
    "description": "User wishlist items"
  },
  "options": {
    "draftAndPublish": false,
    "comment": ""
  },
  "pluginOptions": {
    "content-manager": {
      "visible": true
    },
    "content-type-builder": {
      "visible": true
    }
  },
  "attributes": {
    "user": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user",
      "inversedBy": "wishlists"
    },
    "shoe": {
      "type": "string",
      "required": true
    },
    "shoeName": {
      "type": "string"
    },
    "shoeImage": {
      "type": "string"
    },
    "shoePrice": {
      "type": "float"
    },
    "addedAt": {
      "type": "datetime",
      "default": "now()"
    }
  }
}
```

**Create `backend/src/api/order/content-types/order/schema.json`**

```json
{
  "kind": "collectionType",
  "collectionName": "orders",
  "info": {
    "singularName": "order",
    "pluralName": "orders",
    "displayName": "Order",
    "description": "Customer orders"
  },
  "options": {
    "draftAndPublish": false,
    "comment": ""
  },
  "pluginOptions": {
    "content-manager": {
      "visible": true
    },
    "content-type-builder": {
      "visible": true
    }
  },
  "attributes": {
    "orderNumber": {
      "type": "string",
      "required": true,
      "unique": true
    },
    "user": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user",
      "inversedBy": "orders"
    },
    "status": {
      "type": "enumeration",
      "enum": ["pending", "processing", "shipped", "delivered", "cancelled"],
      "default": "pending"
    },
    "items": {
      "type": "json",
      "required": true
    },
    "shippingAddress": {
      "type": "json"
    },
    "billingAddress": {
      "type": "json"
    },
    "paymentMethod": {
      "type": "string"
    },
    "subtotal": {
      "type": "float"
    },
    "shipping": {
      "type": "float"
    },
    "tax": {
      "type": "float"
    },
    "total": {
      "type": "float"
    }
  }
}
```

### 2.4 Update User Extended Fields

**File: `backend/src/extensions/users-permissions/content-types/user/schema.json`**

Add extended fields to default user schema:

```json
{
  "attributes": {
    "phone": {
      "type": "string"
    },
    "addresses": {
      "type": "json"
    },
    "wishlists": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::wishlist.wishlist",
      "mappedBy": "user"
    },
    "orders": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::order.order",
      "mappedBy": "user"
    }
  }
}
```

### 2.5 Controllers

**File: `backend/src/api/wishlist/controllers/wishlist.ts`**

```typescript
import type { Core } from "@strapi/strapi";

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async find(ctx) {
    const userId = ctx.state.user?.id;
    if (!userId) {
      return ctx.unauthorized("You must be logged in");
    }

    const wishlists = await strapi.entityService.findMany(
      "api::wishlist.wishlist",
      {
        filters: { user: userId },
        sort: { addedAt: "DESC" },
      },
    );

    return wishlists;
  },

  async create(ctx) {
    const userId = ctx.state.user?.id;
    if (!userId) {
      return ctx.unauthorized("You must be logged in");
    }

    const { shoe, shoeName, shoeImage, shoePrice } = ctx.request.body.data;

    const existing = await strapi.entityService.findMany(
      "api::wishlist.wishlist",
      {
        filters: { user: userId, shoe },
      },
    );

    if (existing.length > 0) {
      return ctx.badRequest("Item already in wishlist");
    }

    const wishlist = await strapi.entityService.create(
      "api::wishlist.wishlist",
      {
        data: {
          user: userId,
          shoe,
          shoeName,
          shoeImage,
          shoePrice,
          addedAt: new Date(),
        },
      },
    );

    return wishlist;
  },

  async delete(ctx) {
    const userId = ctx.state.user?.id;
    const { id } = ctx.params;

    if (!userId) {
      return ctx.unauthorized("You must be logged in");
    }

    const wishlist = await strapi.entityService.findOne(
      "api::wishlist.wishlist",
      id,
    );

    if (!wishlist || wishlist.user !== userId) {
      return ctx.notFound("Wishlist item not found");
    }

    await strapi.entityService.delete("api::wishlist.wishlist", id);

    return { success: true };
  },
});
```

**File: `backend/src/api/order/controllers/order.ts`**

```typescript
import type { Core } from "@strapi/strapi";

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async find(ctx) {
    const userId = ctx.state.user?.id;
    if (!userId) {
      return ctx.unauthorized("You must be logged in");
    }

    const orders = await strapi.entityService.findMany("api::order.order", {
      filters: { user: userId },
      sort: { createdAt: "DESC" },
    });

    return orders;
  },

  async findOne(ctx) {
    const userId = ctx.state.user?.id;
    const { id } = ctx.params;

    if (!userId) {
      return ctx.unauthorized("You must be logged in");
    }

    const order = await strapi.entityService.findOne("api::order.order", id);

    if (!order || order.user !== userId) {
      return ctx.notFound("Order not found");
    }

    return order;
  },

  async create(ctx) {
    const userId = ctx.state.user?.id;
    if (!userId) {
      return ctx.unauthorized("You must be logged in");
    }

    const orderData = ctx.request.body.data;

    const order = await strapi.entityService.create("api::order.order", {
      data: {
        user: userId,
        orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...orderData,
      },
    });

    return order;
  },
});
```

### 2.6 Routes Configuration

**File: `backend/src/api/wishlist/routes/wishlist.ts`**

```typescript
export default {
  routes: [
    {
      method: "GET",
      path: "/wishlists",
      handler: "wishlist.find",
      config: {
        auth: { type: "jwt" },
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/wishlists",
      handler: "wishlist.create",
      config: {
        auth: { type: "jwt" },
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "DELETE",
      path: "/wishlists/:id",
      handler: "wishlist.delete",
      config: {
        auth: { type: "jwt" },
        policies: [],
        middlewares: [],
      },
    },
  ],
};
```

**File: `backend/src/api/order/routes/order.ts`**

```typescript
export default {
  routes: [
    {
      method: "GET",
      path: "/orders",
      handler: "order.find",
      config: {
        auth: { type: "jwt" },
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/orders/:id",
      handler: "order.findOne",
      config: {
        auth: { type: "jwt" },
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/orders",
      handler: "order.create",
      config: {
        auth: { type: "jwt" },
        policies: [],
        middlewares: [],
      },
    },
  ],
};
```

### 2.7 Services

**File: `backend/src/api/wishlist/services/wishlist.ts`**

```typescript
import type { Core } from "@strapi/strapi";

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async sync(userId: string, shoes: any[]) {
    const existingItems = await strapi.entityService.findMany(
      "api::wishlist.wishlist",
      {
        filters: { user: userId },
      },
    );

    const existingShoeIds = new Set(existingItems.map((item) => item.shoe));

    const newItems = shoes.filter((shoe) => !existingShoeIds.has(shoe.id));

    for (const shoe of newItems) {
      await strapi.entityService.create("api::wishlist.wishlist", {
        data: {
          user: userId,
          shoe: shoe.id,
          shoeName: shoe.name,
          shoeImage: shoe.images[0],
          shoePrice: shoe.price,
          addedAt: new Date(),
        },
      });
    }

    return strapi.entityService.findMany("api::wishlist.wishlist", {
      filters: { user: userId },
      sort: { addedAt: "DESC" },
    });
  },
});
```

**File: `backend/src/api/order/services/order.ts`**

```typescript
import type { Core } from "@strapi/strapi";

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async generateOrderNumber() {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  async updateStatus(orderId: string, status: string) {
    return strapi.entityService.update("api::order.order", orderId, {
      data: { status },
    });
  },
});
```

### 2.8 Permissions Configuration

**File: `backend/config/plugins.ts`**

```typescript
export default ({ env }) => ({
  "users-permissions": {
    config: {
      ratelimit: {
        enabled: true,
        interval: { min: 5 },
        max: 5,
      },
    },
  },
});
```

### 2.9 API Response Formats

**File: `backend/src/api/order/content-types/order/lifecycles.ts`**

Ensure order creation clears cart after successful checkout (webhook or callback pattern)

### 2.10 Backend Testing

**Test Strategy**:

- Unit tests for controllers and services
- Integration tests for API endpoints
- Use Supertest for HTTP assertions

**Coverage Requirement**: 70%

---

## Phase 3: Frontend-Backend Integration

### Goal

Connect frontend to Strapi backend, handle authentication flow, sync data, and ensure seamless user experience.

### 3.1 Environment Configuration

**Update `.env` in frontend root**:

```env
VITE_API_URL=http://localhost:1337/api
VITE_STRAPI_TOKEN=development-token
```

### 3.2 API Service Integration

**Update `src/services/api.ts`**

Add error handling, retry logic, and token refresh mechanism:

```typescript
class ApiService {
  private token: string | null = null;
  private refreshTokenTimeout: number | null = null;

  // ... existing methods ...

  private async refreshToken() {
    if (!this.token) return;

    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: this.token }),
      });

      if (response.ok) {
        const { jwt } = await response.json();
        this.setToken(jwt);
        this.scheduleTokenRefresh(jwt);
      } else {
        this.logout();
      }
    } catch {
      this.logout();
    }
  }

  private scheduleTokenRefresh(token: string) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiry = payload.exp * 1000;
    const timeout = expiry - Date.now() - 60000;

    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }

    this.refreshTokenTimeout = window.setTimeout(
      () => this.refreshToken(),
      Math.max(0, timeout),
    );
  }

  logout() {
    this.token = null;
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
    localStorage.removeItem("auth_token");
  }
}

export const api = new ApiService();
```

### 3.3 AuthContext Integration

**Update `src/context/AuthContext.tsx`**

Integrate with API service:

```typescript
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("auth_token");
      if (storedToken) {
        try {
          api.setToken(storedToken);
          const response = await api.getCurrentUser();
          setUser(response.data);
          setToken(storedToken);
        } catch {
          localStorage.removeItem("auth_token");
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (identifier: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { jwt, user } = await api.login(identifier, password);
      localStorage.setItem("auth_token", jwt);
      setToken(jwt);
      setUser(user);
      api.setToken(jwt);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { jwt, user } = await api.register(username, email, password);
      localStorage.setItem("auth_token", jwt);
      setToken(jwt);
      setUser(user);
      api.setToken(jwt);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.logout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        clearError: () => setError(null),
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
```

### 3.4 Wishlist Sync Integration

**Update `src/context/WishlistContext.tsx`**

Add backend sync:

```typescript
export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, token } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<Shoe[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (savedWishlist) {
      try {
        const parsed = JSON.parse(savedWishlist);
        setWishlistItems(parsed);
      } catch (error) {
        console.error("Failed to parse wishlist:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Sync with backend when user logs in
  useEffect(() => {
    if (isAuthenticated && token) {
      const syncWishlist = async () => {
        try {
          const response = await api.getWishlist();
          const backendItems = response.data.map(
            (item) =>
              ({
                id: item.shoe,
                name: item.shoeName,
                price: item.shoePrice,
                images: [item.shoeImage],
                // ... map other required fields
              }) as Shoe,
          );
          setWishlistItems(backendItems);
          localStorage.setItem(
            WISHLIST_STORAGE_KEY,
            JSON.stringify(backendItems),
          );
        } catch (error) {
          console.error("Failed to sync wishlist:", error);
        }
      };

      syncWishlist();
    }
  }, [isAuthenticated, token]);

  const addToWishlist = async (shoe: Shoe) => {
    setWishlistItems((prevItems) => {
      if (prevItems.some((item) => item.id === shoe.id)) {
        return prevItems;
      }
      const newItems = [...prevItems, shoe];
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(newItems));
      return newItems;
    });

    if (isAuthenticated) {
      try {
        await api.addToWishlist(shoe.id);
      } catch (error) {
        console.error("Failed to add to backend wishlist:", error);
      }
    }
  };

  const removeFromWishlist = async (shoeId: string) => {
    setWishlistItems((prevItems) => {
      const newItems = prevItems.filter((item) => item.id !== shoeId);
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(newItems));
      return newItems;
    });

    if (isAuthenticated) {
      try {
        // Need to get wishlist item ID first
        const response = await api.getWishlist();
        const wishlistItem = response.data.find((item) => item.shoe === shoeId);
        if (wishlistItem) {
          await api.removeFromWishlist(wishlistItem.id);
        }
      } catch (error) {
        console.error("Failed to remove from backend wishlist:", error);
      }
    }
  };

  // ... rest of context
};
```

### 3.5 Order Creation Integration

**Update `src/pages/CheckoutPage.tsx`**

Add order creation to backend during checkout:

```typescript
const handleSubmit = async () => {
  if (!isAuthenticated) {
    navigate("/login?redirect=/checkout");
    return;
  }

  try {
    const orderData = {
      items: cartItems.map((item) => ({
        shoe: item.shoe.id,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.shoe.price,
      })),
      shippingAddress: formData,
      billingAddress: formData,
      paymentMethod: paymentMethod,
      subtotal: summary.subtotal,
      shipping: summary.shipping,
      tax: summary.tax,
      total: summary.total,
    };

    const response = await api.createOrder(orderData);
    const orderId = response.data.orderNumber;

    clearCart();
    navigate("/order-success", { state: { orderId } });
  } catch (error) {
    console.error("Order creation failed:", error);
    setError("Failed to create order. Please try again.");
  }
};
```

### 3.6 Profile Page Integration

**Update `src/pages/ProfilePage.tsx`**

Add data fetching and updates:

```typescript
const ProfilePage = () => {
  const { user, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleSave = async () => {
    try {
      await api.updateUser(user.id, formData);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        {/* Profile form */}
      </div>
    </PageTransition>
  );
};
```

### 3.7 Orders Page Integration

**Update `src/pages/OrdersPage.tsx`**

Add order fetching:

```typescript
const OrdersPage = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchOrders = async () => {
        try {
          const response = await api.getOrders();
          setOrders(response.data);
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchOrders();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        {/* Orders list */}
      </div>
    </PageTransition>
  );
};
```

### 3.8 Error Handling

**Create `src/components/ui/ErrorBoundary.tsx`**

Catch and display errors gracefully:

```typescript
class ErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          <h2 className="font-bold">Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 3.9 Loading States

**Update Components**

Add consistent loading states across all pages:

- Skeleton loaders for profile page
- Spinner for form submissions
- Loading overlay for data fetching

### 3.10 CORS Configuration

**Update `backend/config/server.ts`**

```typescript
export default ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  app: {
    keys: env.array("APP_KEYS"),
  },
  webhooks: {
    populateRelations: env.bool("WEBHOOKS_POPULATE_RELATIONS", false),
  },
});
```

**Add CORS middleware if needed**

---

## Development Workflow

### Running Development Servers

**Terminal 1 - Frontend**:

```bash
cd /home/adi/Desktop/code/demo-shop
npm run dev
```

**Terminal 2 - Backend**:

```bash
cd /home/adi/Desktop/code/demo-shop/backend
npm run develop
```

### Access Points

- **Frontend**: http://localhost:5173
- **Backend Admin**: http://localhost:1337/admin
- **Backend API**: http://localhost:1337/api

### Initial Setup Steps

1. Create Strapi admin user at first run
2. Configure content types via Admin Panel
3. Set up API tokens for development
4. Test authentication flow
5. Verify CRUD operations for wishlist and orders

---

## Testing Strategy

### Frontend Tests

- AuthContext unit tests
- Login/Register page integration tests
- Wishlist sync functionality tests
- API service mock tests

### Backend Tests

- Controller unit tests
- API endpoint integration tests
- Authentication flow tests

### E2E Tests (Optional - Playwright)

- Complete user registration flow
- Login -> Add to wishlist -> Checkout -> View order
- Data persistence verification

---

## Security Considerations

### Frontend

- Store JWT in localStorage (consider httpOnly cookies for production)
- Implement token refresh mechanism
- Sanitize all user inputs
- Use HTTPS in production

### Backend

- Enable rate limiting for auth endpoints
- Validate all incoming data
- Use Strapi's built-in sanitization
- Configure CORS properly
- Set up proper permissions for each endpoint

---

## Deployment Considerations

### Development

- Run both frontend and backend locally
- Use ngrok or similar for webhook testing

### Production

- Deploy Strapi to a VPS or cloud provider
- Use PostgreSQL instead of SQLite for production
- Configure environment variables
- Set up SSL/TLS
- Configure proper CORS for frontend domain
- Consider using a CDN for static assets

---

## References and Resources

### Official Documentation

- Strapi v5 Documentation: https://docs.strapi.io/
- Strapi Installation Guide: https://docs.strapi.io/cms/installation
- Strapi Database Configuration: https://docs.strapi.io/cms/configurations/database
- Strapi Authentication: https://docs.strapi.io/cms/features/users-permissions
- Strapi API Documentation: https://docs.strapi.io/cms/api-docs
- Strapi Controller Development: https://docs.strapi.io/cms/backend-customization/controllers
- Strapi Service Development: https://docs.strapi.io/cms/backend-customization/services
- Strapi Route Configuration: https://docs.strapi.io/cms/backend-customization/routes

### Additional Resources

- Strapi GitHub: https://github.com/strapi/strapi
- Strapi Community Forum: https://forum.strapi.io/
- Strapi Discord: https://discord.strapi.io/
