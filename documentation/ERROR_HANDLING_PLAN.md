# Error Handling Plan - Apex Shoes E-Commerce

## Overview

This document outlines a comprehensive plan for implementing proper error handling across the Apex Shoes e-commerce application. The goal is to ensure users receive clear, actionable feedback when errors occur, replacing generic messages with specific guidance.

---

## Current State Analysis

### Strengths

- AuthContext has error state management
- API service throws meaningful errors
- Forms use Formik validation
- Product not found states are implemented

### Critical Issues (Immediate Attention)

| Location                | Issue                                         | Severity |
| ----------------------- | --------------------------------------------- | -------- |
| `ShoePage.tsx:89`       | Uses `alert()` instead of proper notification | HIGH     |
| `WishlistContext.tsx`   | API errors only logged to console             | HIGH     |
| `AuthContext.tsx:57-60` | Network failure silently clears session       | MEDIUM   |
| No ErrorBoundary        | Lazy loading failures crash app               | HIGH     |

### Missing Components

- Toast notification system
- Error boundary for route-level errors
- 404 NotFound page
- Consistent error display patterns
- Detailed API error messages

---

## Error Scenarios by Category

### 1. Authentication & Registration

| Scenario                   | Current Behavior            | Desired Behavior                                                            |
| -------------------------- | --------------------------- | --------------------------------------------------------------------------- |
| Email already taken        | Shows "Registration failed" | Shows "Email is already registered. Please use a different email or login." |
| Username already taken     | Shows generic error         | Shows "Username is already taken. Please choose a different username."      |
| Invalid email format       | Formik validation           | Keep existing, ensure clear message                                         |
| Password too weak          | No validation               | Show specific requirements                                                  |
| Network error during login | Silent failure              | Show "Unable to connect. Please check your internet connection."            |
| Session expired            | Silent redirect             | Show "Your session has expired. Please log in again."                       |

### 2. Shopping Operations

| Scenario                      | Current Behavior                | Desired Behavior                                              |
| ----------------------------- | ------------------------------- | ------------------------------------------------------------- |
| Size not selected             | `alert("Please select a size")` | Toast notification with clear message                         |
| Color not selected            | No validation                   | Show "Please select a color"                                  |
| Product out of stock          | No indication                   | Show "This product is currently out of stock"                 |
| Invalid voucher code          | Works correctly                 | Keep as-is                                                    |
| Quantity exceeds stock        | No validation                   | Show "Only {X} items available"                               |
| Cart item becomes unavailable | Silent removal                  | Notify user "Some items in your cart are no longer available" |

### 3. Wishlist Operations

| Scenario                         | Current Behavior   | Desired Behavior                                                  |
| -------------------------------- | ------------------ | ----------------------------------------------------------------- |
| Add to wishlist API failure      | Console error only | Toast notification "Failed to add to wishlist. Please try again." |
| Remove from wishlist API failure | Console error only | Toast notification "Failed to remove from wishlist."              |
| Sync wishlist on load failure    | Console error only | Show error banner "Unable to load wishlist"                       |
| Add duplicate item               | Silent             | Show "Item already in wishlist"                                   |

### 4. Cart Operations

| Scenario                   | Current Behavior | Desired Behavior                                |
| -------------------------- | ---------------- | ----------------------------------------------- |
| Update quantity (negative) | Allows negative  | Prevent and show "Quantity must be at least 1"  |
| Remove all items           | No feedback      | Toast "Cart cleared"                            |
| Apply expired voucher      | No validation    | Show "This voucher has expired"                 |
| Apply max usage reached    | No validation    | Show "This voucher has reached its usage limit" |

### 5. Checkout & Payment

| Scenario                           | Current Behavior   | Desired Behavior                                                     |
| ---------------------------------- | ------------------ | -------------------------------------------------------------------- |
| Card number invalid                | Generic validation | Show "Please enter a valid 16-digit card number"                     |
| Expiry date invalid                | Generic validation | Show "Please enter a valid expiry date (MM/YY)"                      |
| CVV invalid                        | Generic validation | Show "CVV must be 3 or 4 digits"                                     |
| Payment processing error           | Generic error      | Show specific error from payment provider                            |
| Order creation failure             | Error banner       | Show "Unable to process order. Please try again or contact support." |
| Insufficient stock during checkout | No check           | Show "Some items are no longer available. Please review your cart."  |

### 6. Routing & Data

| Scenario               | Current Behavior          | Desired Behavior                                       |
| ---------------------- | ------------------------- | ------------------------------------------------------ |
| Invalid product ID     | Shows "Product Not Found" | Keep as-is, ensure good UX                             |
| Invalid order ID       | Shows error message       | Keep as-is                                             |
| 404 page               | No dedicated page         | Show friendly "Page not found" with navigation options |
| Unauthenticated access | Redirects silently        | Show "Please log in to access this page"               |
| Lazy loading failure   | App crashes               | Error boundary with reload option                      |

### 7. Forms

| Scenario                        | Current Behavior   | Desired Behavior                          |
| ------------------------------- | ------------------ | ----------------------------------------- |
| Contact form - missing fields   | Validation exists  | Ensure clear error messages               |
| Profile update - network error  | Shows error banner | Add retry option                          |
| Newsletter - invalid email      | No validation      | Show "Please enter a valid email address" |
| Newsletter - already subscribed | No feedback        | Show "You're already subscribed!"         |
| Address form - validation       | Minimal            | Show specific field errors                |

---

## Implementation Plan

### Phase 1: Foundation (Critical)

#### 1.1 Create Toast Notification System

**File**: `src/context/ToastContext.tsx`

```typescript
interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type: Toast["type"], duration?: number) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}
```

**Features**:

- Multiple toast support (stack overflow)
- Auto-dismiss with configurable duration
- Success, error, warning, info types
- Smooth animations with Framer Motion
- Accessible (ARIA attributes)

**Update**: `App.tsx`

- Wrap app with ToastProvider
- Add ToastContainer component at root level

#### 1.2 Replace alert() in ShoePage.tsx

**Location**: `src/pages/ShoePage.tsx:87-91`

**Current**:

```typescript
const handleAddToCart = () => {
  if (!selectedSize) {
    alert("Please select a size");
    return;
  }
  // ...
};
```

**New**:

```typescript
const handleAddToCart = () => {
  if (!selectedSize) {
    showError("Please select a size before adding to cart");
    return;
  }
  // ...
};
```

#### 1.3 Create Error Boundary Component

**File**: `src/components/ui/ErrorBoundary.tsx`

```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  { children: ReactNode; fallback?: ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

**Update**: `App.tsx`

- Wrap Suspense fallbacks with ErrorBoundary
- Add recovery option for users

#### 1.4 Create NotFound Page

**File**: `src/pages/NotFoundPage.tsx`

```typescript
const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/">Go back home</Link>
    </div>
  );
};
```

**Update**: `App.tsx`

- Add route for `/404`
- Configure to catch all unmatched routes

---

### Phase 2: Authentication Errors (High Priority)

#### 2.1 Update AuthContext Error Handling

**File**: `src/context/AuthContext.tsx`

**Enhancements**:

1. Add specific error types:

```typescript
type AuthError =
  | "EMAIL_TAKEN"
  | "USERNAME_TAKEN"
  | "INVALID_CREDENTIALS"
  | "NETWORK_ERROR"
  | "SESSION_EXPIRED"
  | "UNKNOWN";
```

2. Update error messages:

```typescript
const ERROR_MESSAGES: Record<AuthError, string> = {
  EMAIL_TAKEN:
    "This email is already registered. Please use a different email or login.",
  USERNAME_TAKEN:
    "This username is already taken. Please choose a different username.",
  INVALID_CREDENTIALS: "Invalid email or password. Please try again.",
  NETWORK_ERROR: "Unable to connect. Please check your internet connection.",
  SESSION_EXPIRED: "Your session has expired. Please log in again.",
  UNKNOWN: "An unexpected error occurred. Please try again.",
};
```

3. Add toast notifications for auth errors

#### 2.2 Enhance API Service Error Messages

**File**: `src/services/api.ts`

```typescript
private getUserFriendlyError(error: unknown): string {
  if (isAxiosError(error)) {
    switch (error.response?.status) {
      case 400:
        return 'Invalid request. Please check your input and try again.';
      case 401:
        return 'Your session has expired. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        if (error.response?.data?.message?.includes('email')) {
          return 'This email is already registered.';
        }
        if (error.response?.data?.message?.includes('username')) {
          return 'This username is already taken.';
        }
        return 'This information is already in use.';
      case 422:
        return 'Please check your input and try again.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'A server error occurred. Please try again later.';
      default:
        return 'An error occurred. Please try again.';
    }
  }

  if (error instanceof TypeError) {
    return 'Unable to connect. Please check your internet connection.';
  }

  return 'An unexpected error occurred. Please try again.';
}
```

---

### Phase 3: Shopping Operations (High Priority)

#### 3.1 Fix CartContext Validation

**File**: `src/context/CartContext.tsx`

**Add validation to updateQuantity**:

```typescript
const updateQuantity = (
  shoeId: string,
  size: number,
  color: string,
  quantity: number,
) => {
  if (quantity < 1) {
    showError("Quantity must be at least 1");
    return;
  }

  const item = cart.find(
    (item) =>
      item.shoe.id === shoeId && item.size === size && item.color === color,
  );

  if (item && quantity > item.shoe.stock) {
    showError(`Only ${item.shoe.stock} items available`);
    return;
  }

  // Existing update logic...
};
```

#### 3.2 Add Wishlist Error Notifications

**File**: `src/context/WishlistContext.tsx`

**Replace console.error with showToast calls**:

```typescript
// In addToWishlist:
try {
  await api.wishlist.add(shoeId);
} catch (error) {
  showError("Failed to add to wishlist. Please try again.");
  console.error("Failed to add to wishlist:", error);
}

// In removeFromWishlist:
try {
  await api.wishlist.remove(shoeId);
} catch (error) {
  showError("Failed to remove from wishlist. Please try again.");
  console.error("Failed to remove from wishlist:", error);
}

// In syncWishlist:
try {
  await api.wishlist.sync(localWishlist);
} catch (error) {
  showError("Unable to sync wishlist. Some changes may not be saved.");
  console.error("Wishlist sync failed:", error);
}
```

#### 3.3 Add Stock Validation to ShoePage

**File**: `src/pages/ShoePage.tsx`

```typescript
const handleAddToCart = () => {
  if (!selectedSize) {
    showError("Please select a size before adding to cart");
    return;
  }

  if (!selectedColor) {
    showError("Please select a color before adding to cart");
    return;
  }

  if (shoe.stock === 0) {
    showError("This product is currently out of stock");
    return;
  }

  if (shoe.stock < selectedQuantity) {
    showError(`Only ${shoe.stock} items available`);
    return;
  }

  // Existing add to cart logic...
};
```

---

### Phase 4: Form Validation Enhancement (Medium Priority)

#### 4.1 Enhance Validation Utilities

**File**: `src/utils/validation.ts`

**Add error message functions**:

```typescript
export const validateCardNumber = (
  cardNumber: string,
): { valid: boolean; error?: string } => {
  const cleaned = cardNumber.replace(/\s/g, "");
  if (!/^\d{16}$/.test(cleaned)) {
    return { valid: false, error: "Card number must be 16 digits" };
  }
  if (!luhnCheck(cleaned)) {
    return { valid: false, error: "Invalid card number" };
  }
  return { valid: true };
};

export const validateExpiryDate = (
  expiryDate: string,
): { valid: boolean; error?: string } => {
  const match = expiryDate.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
  if (!match) {
    return { valid: false, error: "Use format MM/YY" };
  }

  const month = parseInt(match[1], 10);
  const year = 2000 + parseInt(match[2], 10);
  const now = new Date();
  const expiry = new Date(year, month, 0);

  if (expiry < now) {
    return { valid: false, error: "Card has expired" };
  }

  return { valid: true };
};

export const validateCVV = (
  cvv: string,
): { valid: boolean; error?: string } => {
  if (!/^\d{3,4}$/.test(cvv)) {
    return { valid: false, error: "CVV must be 3 or 4 digits" };
  }
  return { valid: true };
};
```

#### 4.2 Update Checkout Page Validation

**File**: `src/pages/CheckoutPage.tsx`

**Use enhanced validation with error messages**:

```typescript
const validateForm = (): boolean => {
  let isValid = true;

  const cardResult = validateCardNumber(cardNumber);
  if (!cardResult.valid) {
    formik.setFieldError("cardNumber", cardResult.error);
    isValid = false;
  }

  const expiryResult = validateExpiryDate(expiryDate);
  if (!expiryResult.valid) {
    formik.setFieldError("expiryDate", expiryResult.error);
    isValid = false;
  }

  const cvvResult = validateCVV(cvv);
  if (!cvvResult.valid) {
    formik.setFieldError("cvv", cvvResult.error);
    isValid = false;
  }

  return isValid;
};
```

---

### Phase 5: Polish & Consistency (Medium Priority)

#### 5.1 Standardize Error Display Components

**Create**: `src/components/ui/ErrorAlert.tsx`

```typescript
interface ErrorAlertProps {
  error: string;
  onDismiss?: () => void;
  className?: string;
}

const ErrorAlert = ({ error, onDismiss, className = '' }: ErrorAlertProps) => (
  <div className={`p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 ${className}`}>
    <div className="flex items-start justify-between">
      <p>{error}</p>
      {onDismiss && (
        <button onClick={onDismiss} className="ml-4 hover:opacity-70">
          <X size={16} />
        </button>
      )}
    </div>
  </div>
);
```

**Create**: `src/components/ui/SuccessAlert.tsx`

```typescript
interface SuccessAlertProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
}

const SuccessAlert = ({ message, onDismiss, className = '' }: SuccessAlertProps) => (
  <div className={`p-4 bg-green-50 border border-green-200 rounded-lg text-green-600 ${className}`}>
    <div className="flex items-start justify-between">
      <p>{message}</p>
      {onDismiss && (
        <button onClick={onDismiss} className="ml-4 hover:opacity-70">
          <X size={16} />
        </button>
      )}
    </div>
  </div>
);
```

#### 5.2 Add Newsletter Form Validation

**File**: `src/pages/HomePage.tsx`

```typescript
const handleNewsletterSubmit = (e: FormEvent) => {
  e.preventDefault();

  if (!email) {
    showError("Please enter your email address");
    return;
  }

  if (!validateEmail(email)) {
    showError("Please enter a valid email address");
    return;
  }

  // Submit logic...
  showSuccess("Thank you for subscribing!");
  setEmail("");
};
```

#### 5.3 Add Global Unhandled Rejection Handler

**File**: `src/main.tsx`

```typescript
// Handle unhandled promise rejections
window.addEventListener(
  "unhandledrejection",
  (event: PromiseRejectionEvent) => {
    event.preventDefault();
    console.error("Unhandled Promise Rejection:", event.reason);

    // Optionally show a toast for critical errors
    if (
      event.reason instanceof Error &&
      event.reason.message.includes("network")
    ) {
      showError("Connection lost. Please check your internet connection.");
    }
  },
);
```

---

## File Changes Summary

### New Files to Create

| File                                  | Purpose                                 |
| ------------------------------------- | --------------------------------------- |
| `src/context/ToastContext.tsx`        | Global toast notification system        |
| `src/components/ui/ErrorAlert.tsx`    | Reusable error alert component          |
| `src/components/ui/SuccessAlert.tsx`  | Reusable success alert component        |
| `src/components/ui/ErrorBoundary.tsx` | Error boundary for route-level errors   |
| `src/pages/NotFoundPage.tsx`          | 404 page                                |
| `src/utils/validation.ts`             | Enhanced validation with error messages |

### Files to Modify

| File                              | Changes                                          |
| --------------------------------- | ------------------------------------------------ |
| `src/App.tsx`                     | Add ToastProvider, ErrorBoundary, NotFound route |
| `src/context/AuthContext.tsx`     | Specific error messages, toast notifications     |
| `src/context/CartContext.tsx`     | Quantity validation, error messages              |
| `src/context/WishlistContext.tsx` | Toast notifications for API failures             |
| `src/pages/ShoePage.tsx`          | Replace alert() with toast                       |
| `src/pages/CheckoutPage.tsx`      | Enhanced form validation                         |
| `src/pages/HomePage.tsx`          | Newsletter form validation                       |
| `src/services/api.ts`             | User-friendly error messages                     |

---

## Testing Checklist

### Unit Tests

- [ ] ToastContext shows and dismisses correctly
- [ ] ErrorBoundary catches and renders fallback
- [ ] Validation functions return correct error messages
- [ ] AuthContext handles all error types

### Integration Tests

- [ ] Registration shows email taken error
- [ ] Registration shows username taken error
- [ ] Login shows network error
- [ ] Add to cart without size shows toast
- [ ] Invalid voucher shows error
- [ ] Checkout with invalid card shows specific error

### E2E Tests (Playwright)

- [ ] User sees toast on failed login
- [ ] User sees error when adding duplicate wishlist item
- [ ] User sees 404 page on invalid route
- [ ] Error boundary shows on lazy loading failure
- [ ] Cart prevents negative quantity

---

## Success Metrics

1. **No hardcoded alert() calls** - All replaced with toast notifications
2. **Console errors reduced** - Critical errors logged, user-facing errors shown to user
3. **Error messages specific** - Users know exactly what went wrong and how to fix it
4. **Consistent UI** - Same error alert component used everywhere
5. **User satisfaction** - Reduced confusion from generic error messages

---

## Timeline

| Phase   | Duration | Focus                                       |
| ------- | -------- | ------------------------------------------- |
| Phase 1 | 1-2 days | Foundation (Toast, ErrorBoundary, NotFound) |
| Phase 2 | 1 day    | Authentication errors                       |
| Phase 3 | 1-2 days | Shopping operations                         |
| Phase 4 | 1 day    | Form validation enhancement                 |
| Phase 5 | 1 day    | Polish and consistency                      |

**Total Estimated Time**: 5-7 days

---

## References

- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Axios Error Handling](https://axios-http.com/docs/handling_errors)
- [WCAG Accessibility Guidelines for Errors](https://www.w3.org/WAI/WCAG21/Understanding/error-identification.html)
- [User Experience Guidelines for Error Messages](https://www.nngroup.com/articles/error-message-guidelines/)
