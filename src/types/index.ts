export type ShoeCategory =
  | "sneakers"
  | "running"
  | "casual"
  | "formal"
  | "boots";

export interface Shoe {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: ShoeCategory;
  images: string[];
  sizes: number[];
  colors: string[];
  description: string;
  features: string[];
  featured: boolean;
  inStock: boolean;
}

export interface CartItem {
  shoe: Shoe;
  size: number;
  color: string;
  quantity: number;
}

export interface CategoryInfo {
  id: ShoeCategory;
  name: string;
  description: string;
  image: string;
}

export interface OrderSummary {
  cartItems: CartItem[];
  subtotal: number;
  voucherDiscount: number;
  appliedVoucher: string | null;
  shipping: number;
  tax: number;
  total: number;
  country: string;
  shippingAddress?: Address;
  billingAddress?: Address;
}

export interface PaymentFormData {
  paymentMethod: "card" | "cash";
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
}

export interface CompletedOrder extends OrderSummary {
  paymentMethod: string;
  orderDate: Date;
  orderId: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  phone?: string;
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

export interface UserPreferences {
  newsletter?: boolean;
  language?: string;
  currency?: string;
  notifications?: {
    email?: boolean;
    sms?: boolean;
    push?: boolean;
  };
}

export interface ExtendedUser {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  avatar?: {
    url: string;
    id: number;
    name: string;
  };
  addresses?: Address[];
  defaultShippingAddress?: Address;
  defaultBillingAddress?: Address;
  marketingConsent?: boolean;
  preferences?: UserPreferences;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
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
  shoeName: string;
  shoeImage: string;
  shoePrice: number;
  addedAt: string;
}
