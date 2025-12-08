import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "../../context/CartContext";
import type { ReactNode } from "react";

// Mock shoe data for testing
const mockShoe = {
  id: "test-shoe-1",
  name: "Test Shoe",
  brand: "TestBrand",
  price: 99.99,
  category: "sneakers" as const,
  images: ["https://example.com/shoe.jpg"],
  sizes: [8, 9, 10],
  colors: ["Black", "White"],
  description: "A test shoe",
  features: ["Feature 1", "Feature 2"],
  featured: true,
  inStock: true,
};

const mockShoe2 = {
  ...mockShoe,
  id: "test-shoe-2",
  name: "Test Shoe 2",
  price: 129.99,
};

describe("CartContext", () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <CartProvider>{children}</CartProvider>
  );

  describe("addToCart", () => {
    it("should add an item to the cart", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockShoe, 9, "Black", 1);
      });

      expect(result.current.cartItems).toHaveLength(1);
      expect(result.current.cartItems[0]).toEqual({
        shoe: mockShoe,
        size: 9,
        color: "Black",
        quantity: 1,
      });
    });

    it("should increment quantity if item already exists", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockShoe, 9, "Black", 1);
        result.current.addToCart(mockShoe, 9, "Black", 2);
      });

      expect(result.current.cartItems).toHaveLength(1);
      expect(result.current.cartItems[0].quantity).toBe(3);
    });

    it("should add different sizes as separate items", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockShoe, 9, "Black", 1);
        result.current.addToCart(mockShoe, 10, "Black", 1);
      });

      expect(result.current.cartItems).toHaveLength(2);
    });

    it("should add different colors as separate items", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockShoe, 9, "Black", 1);
        result.current.addToCart(mockShoe, 9, "White", 1);
      });

      expect(result.current.cartItems).toHaveLength(2);
    });
  });

  describe("removeFromCart", () => {
    it("should remove an item from the cart", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockShoe, 9, "Black", 1);
        result.current.removeFromCart(mockShoe.id, 9, "Black");
      });

      expect(result.current.cartItems).toHaveLength(0);
    });

    it("should only remove the specified item", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockShoe, 9, "Black", 1);
        result.current.addToCart(mockShoe, 9, "White", 1);
        result.current.removeFromCart(mockShoe.id, 9, "Black");
      });

      expect(result.current.cartItems).toHaveLength(1);
      expect(result.current.cartItems[0].color).toBe("White");
    });
  });

  describe("updateQuantity", () => {
    it("should update item quantity", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockShoe, 9, "Black", 1);
        result.current.updateQuantity(mockShoe.id, 9, "Black", 5);
      });

      expect(result.current.cartItems[0].quantity).toBe(5);
    });

    it("should remove item if quantity is set to 0", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockShoe, 9, "Black", 1);
        result.current.updateQuantity(mockShoe.id, 9, "Black", 0);
      });

      expect(result.current.cartItems).toHaveLength(0);
    });

    it("should remove item if quantity is negative", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockShoe, 9, "Black", 1);
        result.current.updateQuantity(mockShoe.id, 9, "Black", -1);
      });

      expect(result.current.cartItems).toHaveLength(0);
    });
  });

  describe("clearCart", () => {
    it("should clear all items from the cart", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockShoe, 9, "Black", 1);
        result.current.addToCart(mockShoe2, 10, "White", 2);
        result.current.clearCart();
      });

      expect(result.current.cartItems).toHaveLength(0);
    });
  });

  describe("getCartTotal", () => {
    it("should calculate correct total for single item", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockShoe, 9, "Black", 1);
      });

      expect(result.current.getCartTotal()).toBe(99.99);
    });

    it("should calculate correct total with multiple quantities", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockShoe, 9, "Black", 3);
      });

      expect(result.current.getCartTotal()).toBeCloseTo(299.97, 2);
    });

    it("should calculate correct total for multiple items", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockShoe, 9, "Black", 1);
        result.current.addToCart(mockShoe2, 10, "White", 2);
      });

      const expected = 99.99 + 129.99 * 2;
      expect(result.current.getCartTotal()).toBeCloseTo(expected, 2);
    });

    it("should return 0 for empty cart", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      expect(result.current.getCartTotal()).toBe(0);
    });
  });

  describe("getCartItemCount", () => {
    it("should return correct count for single item", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockShoe, 9, "Black", 1);
      });

      expect(result.current.getCartItemCount()).toBe(1);
    });

    it("should count total quantity of all items", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockShoe, 9, "Black", 3);
        result.current.addToCart(mockShoe2, 10, "White", 2);
      });

      expect(result.current.getCartItemCount()).toBe(5);
    });

    it("should return 0 for empty cart", () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      expect(result.current.getCartItemCount()).toBe(0);
    });
  });

  describe("useCart hook error handling", () => {
    it("should throw error when used outside CartProvider", () => {
      // Suppress console.error for this test
      const spy = jest.spyOn(console, "error").mockImplementation(() => {});

      expect(() => {
        renderHook(() => useCart());
      }).toThrow("useCart must be used within a CartProvider");

      spy.mockRestore();
    });
  });
});
