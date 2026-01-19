import { renderHook, act } from "@testing-library/react";
import { WishlistProvider, useWishlist } from "../../context/WishlistContext";
import { AuthProvider } from "../../context/AuthContext";
import type { ReactNode } from "react";
import type { Shoe } from "../../types";

const mockShoe: Shoe = {
  id: "test-shoe-1",
  name: "Test Shoe",
  brand: "TestBrand",
  price: 99.99,
  category: "sneakers",
  images: ["https://example.com/shoe.jpg"],
  sizes: [8, 9, 10],
  colors: ["Black", "White"],
  description: "A test shoe",
  features: ["Feature 1", "Feature 2"],
  featured: true,
  inStock: true,
};

const mockShoe2: Shoe = {
  ...mockShoe,
  id: "test-shoe-2",
  name: "Test Shoe 2",
  price: 129.99,
};

const createWrapper = () => {
  return ({ children }: { children: ReactNode }) => (
    <AuthProvider>
      <WishlistProvider>{children}</WishlistProvider>
    </AuthProvider>
  );
};

describe("WishlistContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("addToWishlist", () => {
    it("should add an item to the wishlist", () => {
      const { result } = renderHook(() => useWishlist(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.addToWishlist(mockShoe);
      });

      expect(result.current.wishlistItems).toHaveLength(1);
      expect(result.current.wishlistItems[0].id).toBe("test-shoe-1");
    });

    it("should not add duplicate items", () => {
      const { result } = renderHook(() => useWishlist(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.addToWishlist(mockShoe);
        result.current.addToWishlist(mockShoe);
      });

      expect(result.current.wishlistItems).toHaveLength(1);
    });

    it("should add different items as separate entries", () => {
      const { result } = renderHook(() => useWishlist(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.addToWishlist(mockShoe);
        result.current.addToWishlist(mockShoe2);
      });

      expect(result.current.wishlistItems).toHaveLength(2);
    });
  });

  describe("removeFromWishlist", () => {
    it("should remove an item from the wishlist", () => {
      const { result } = renderHook(() => useWishlist(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.addToWishlist(mockShoe);
        result.current.removeFromWishlist(mockShoe.id);
      });

      expect(result.current.wishlistItems).toHaveLength(0);
    });

    it("should only remove the specified item", () => {
      const { result } = renderHook(() => useWishlist(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.addToWishlist(mockShoe);
        result.current.addToWishlist(mockShoe2);
        result.current.removeFromWishlist(mockShoe.id);
      });

      expect(result.current.wishlistItems).toHaveLength(1);
      expect(result.current.wishlistItems[0].id).toBe("test-shoe-2");
    });
  });

  describe("isInWishlist", () => {
    it("should return true for items in wishlist", () => {
      const { result } = renderHook(() => useWishlist(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.addToWishlist(mockShoe);
      });

      expect(result.current.isInWishlist(mockShoe.id)).toBe(true);
    });

    it("should return false for items not in wishlist", () => {
      const { result } = renderHook(() => useWishlist(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isInWishlist(mockShoe.id)).toBe(false);
    });

    it("should return false after item is removed", () => {
      const { result } = renderHook(() => useWishlist(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.addToWishlist(mockShoe);
        result.current.removeFromWishlist(mockShoe.id);
      });

      expect(result.current.isInWishlist(mockShoe.id)).toBe(false);
    });
  });

  describe("clearWishlist", () => {
    it("should remove all items from the wishlist", () => {
      const { result } = renderHook(() => useWishlist(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.addToWishlist(mockShoe);
        result.current.addToWishlist(mockShoe2);
        result.current.clearWishlist();
      });

      expect(result.current.wishlistItems).toHaveLength(0);
    });
  });

  describe("getWishlistCount", () => {
    it("should return correct count", () => {
      const { result } = renderHook(() => useWishlist(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.addToWishlist(mockShoe);
        result.current.addToWishlist(mockShoe2);
      });

      expect(result.current.getWishlistCount()).toBe(2);
    });

    it("should return 0 for empty wishlist", () => {
      const { result } = renderHook(() => useWishlist(), {
        wrapper: createWrapper(),
      });

      expect(result.current.getWishlistCount()).toBe(0);
    });
  });

  describe("useWishlist hook error handling", () => {
    it("should throw error when used outside WishlistProvider", () => {
      const spy = jest.spyOn(console, "error").mockImplementation(() => {});

      expect(() => {
        renderHook(() => useWishlist());
      }).toThrow("useWishlist must be used within a WishlistProvider");

      spy.mockRestore();
    });
  });
});
