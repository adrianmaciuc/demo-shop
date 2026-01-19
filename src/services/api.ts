import type { User, WishlistItem, UserOrder, Address } from "../types";

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

interface RequestOptions {
  method?: string;
  body?: string;
  headers?: Record<string, string>;
}

class ApiService {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: options.method || "GET",
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
      body: options.body,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "API request failed");
    }

    return response.json();
  }

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

  async getCurrentUser() {
    return this.request<ApiResponse<User>>("/users/me");
  }

  async updateUser(userId: string, data: Partial<User>) {
    return this.request<ApiResponse<User>>(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async getWishlist() {
    return this.request<ApiResponse<WishlistItem[]>>("/wishlists");
  }

  async addToWishlist(
    shoeId: string,
    shoeName: string,
    shoeImage: string,
    shoePrice: number,
  ) {
    return this.request<ApiResponse<WishlistItem>>("/wishlists", {
      method: "POST",
      body: JSON.stringify({
        data: {
          shoe: shoeId,
          shoeName,
          shoeImage,
          shoePrice,
        },
      }),
    });
  }

  async removeFromWishlist(wishlistItemId: string) {
    return this.request<void>(`/wishlists/${wishlistItemId}`, {
      method: "DELETE",
    });
  }

  async getOrders() {
    return this.request<ApiResponse<UserOrder[]>>("/orders");
  }

  async getOrder(orderId: string) {
    return this.request<ApiResponse<UserOrder>>(`/orders/${orderId}`);
  }

  async createOrder(orderData: {
    items: Array<{
      shoe: string;
      size: number;
      color: string;
      quantity: number;
      price: number;
    }>;
    shippingAddress: Address;
    billingAddress: Address;
    paymentMethod: string;
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  }) {
    return this.request<ApiResponse<UserOrder>>("/orders", {
      method: "POST",
      body: JSON.stringify({ data: orderData }),
    });
  }
}

export const api = new ApiService();
