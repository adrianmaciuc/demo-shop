import { createContext, useContext, useState, type ReactNode } from "react";
import type { Shoe, CartItem } from "../types";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (
    shoe: Shoe,
    size: number,
    color: string,
    quantity: number
  ) => void;
  removeFromCart: (shoeId: string, size: number, color: string) => void;
  updateQuantity: (
    shoeId: string,
    size: number,
    color: string,
    quantity: number
  ) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (
    shoe: Shoe,
    size: number,
    color: string,
    quantity: number
  ) => {
    setCartItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        (item) =>
          item.shoe.id === shoe.id && item.size === size && item.color === color
      );

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, { shoe, size, color, quantity }];
      }
    });
  };

  const removeFromCart = (shoeId: string, size: number, color: string) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(
            item.shoe.id === shoeId &&
            item.size === size &&
            item.color === color
          )
      )
    );
  };

  const updateQuantity = (
    shoeId: string,
    size: number,
    color: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeFromCart(shoeId, size, color);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.shoe.id === shoeId && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.shoe.price * item.quantity,

      0
    );
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
