import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Shoe } from "../types";
import { useAuth } from "./AuthContext";
import { getApiUrl } from "../utils/api";
import { useToast } from "./ToastContext";

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
  const { isAuthenticated, token } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<Shoe[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [apiUrl] = useState(() => getApiUrl());
  const { showError, showSuccess } = useToast();

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

  useEffect(() => {
    if (isAuthenticated && token && isLoaded) {
      const syncWishlist = async () => {
        try {
          const response = await fetch(`${apiUrl}/wishlists`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            const items = data.data || [];
            const backendItems = items.map(
              (item: {
                shoe: string;
                shoeName: string;
                shoeImage: string;
                shoePrice: number;
              }) =>
                ({
                  id: item.shoe,
                  name: item.shoeName,
                  price: item.shoePrice,
                  images: [item.shoeImage],
                  brand: "",
                  category: "sneakers" as const,
                  sizes: [],
                  colors: [],
                  description: "",
                  features: [],
                  featured: false,
                  inStock: true,
                }) as Shoe,
            );
            setWishlistItems(backendItems);
            localStorage.setItem(
              WISHLIST_STORAGE_KEY,
              JSON.stringify(backendItems),
            );
          }
        } catch (error) {
          console.error("Failed to sync wishlist:", error);
          showError("Unable to sync wishlist. Some changes may not be saved.");
        }
      };

      syncWishlist();
    }
  }, [isAuthenticated, token, isLoaded, apiUrl, showError]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isLoaded]);

  const addToWishlist = async (shoe: Shoe) => {
    const isAlreadyInWishlist = wishlistItems.some(
      (item) => item.id === shoe.id,
    );

    setWishlistItems((prevItems) => {
      if (isAlreadyInWishlist) {
        return prevItems;
      }
      return [...prevItems, shoe];
    });

    if (!isAlreadyInWishlist) {
      showSuccess(`${shoe.name} added to wishlist`);
    }

    if (isAuthenticated && token) {
      try {
        await fetch(`${apiUrl}/wishlists`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: {
              shoe: shoe.id,
              shoeName: shoe.name,
              shoeImage: shoe.images[0],
              shoePrice: shoe.price,
            },
          }),
        });
      } catch (error) {
        console.error("Failed to add to backend wishlist:", error);
        showError("Failed to add to wishlist. Please try again.");
      }
    }
  };

  const removeFromWishlist = async (shoeId: string) => {
    setWishlistItems((prevItems) =>
      prevItems.filter((item) => item.id !== shoeId),
    );

    if (isAuthenticated && token) {
      try {
        const response = await fetch(`${apiUrl}/wishlists`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const wishlistItem = data.data.find(
            (item: { shoe: string }) => item.shoe === shoeId,
          );
          if (wishlistItem) {
            await fetch(`${apiUrl}/wishlists/${wishlistItem.id}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
          }
        }
      } catch (error) {
        console.error("Failed to remove from backend wishlist:", error);
        showError("Failed to remove from wishlist. Please try again.");
      }
    }
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

// eslint-disable-next-line react-refresh/only-export-components
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
