import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Shoe } from "../types";

interface WishlistContextType {
  wishlistItems: Shoe[];
  addToWishlist: (shoe: Shoe) => void;
  removeFromWishlist: (shoeId: string) => void;
  isInWishlist: (shoeId: string) => boolean;
  clearWishlist: () => void;
  getWishlistCount: () => number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

const WISHLIST_STORAGE_KEY = "apex_shoes_wishlist";

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
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
        console.error("Failed to parse wishlist from localStorage:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isLoaded]);

  const addToWishlist = (shoe: Shoe) => {
    setWishlistItems((prevItems) => {
      // Check if shoe already in wishlist
      if (prevItems.some((item) => item.id === shoe.id)) {
        return prevItems;
      }
      return [...prevItems, shoe];
    });
  };

  const removeFromWishlist = (shoeId: string) => {
    setWishlistItems((prevItems) =>
      prevItems.filter((item) => item.id !== shoeId),
    );
  };

  const isInWishlist = (shoeId: string) => {
    return wishlistItems.some((item) => item.id === shoeId);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  const getWishlistCount = () => {
    return wishlistItems.length;
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        getWishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
