"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useSession } from "next-auth/react";

// Types
export interface CartItem {
   id: string;
   name: string;
   price: number;
   quantity: number;
   image: string;
   stockCount: number;
}

interface CartState {
   items: CartItem[];
   totalItems: number;
   totalPrice: number;
}

type CartAction =
   | {
        type: "ADD_TO_CART";
        payload: Omit<CartItem, "quantity"> & { quantity?: number };
     }
   | { type: "REMOVE_FROM_CART"; payload: { id: string } }
   | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
   | { type: "CLEAR_CART" }
   | { type: "LOAD_CART"; payload: CartItem[] };

interface CartContextType extends CartState {
   addToCart: (
      product: Omit<CartItem, "quantity"> & { quantity?: number }
   ) => void;
   removeFromCart: (id: string) => void;
   updateQuantity: (id: string, quantity: number) => void;
   clearCart: () => void;
   getItemQuantity: (id: string) => number;
   migrateGuestCart: () => void;
}

// Initial state
const initialState: CartState = {
   items: [],
   totalItems: 0,
   totalPrice: 0,
};

// Reducer
function cartReducer(state: CartState, action: CartAction): CartState {
   switch (action.type) {
      case "ADD_TO_CART": {
         const existingItem = state.items.find(
            (item) => item.id === action.payload.id
         );
         const quantityToAdd = action.payload.quantity || 1;

         let newItems: CartItem[];

         if (existingItem) {
            // Update existing item quantity (don't exceed stock)
            const newQuantity = Math.min(
               existingItem.quantity + quantityToAdd,
               existingItem.stockCount
            );

            newItems = state.items.map((item) =>
               item.id === action.payload.id
                  ? { ...item, quantity: newQuantity }
                  : item
            );
         } else {
            // Add new item
            const newItem: CartItem = {
               ...action.payload,
               quantity: Math.min(quantityToAdd, action.payload.stockCount),
            };
            newItems = [...state.items, newItem];
         }

         return calculateTotals(newItems);
      }

      case "REMOVE_FROM_CART": {
         const newItems = state.items.filter(
            (item) => item.id !== action.payload.id
         );
         return calculateTotals(newItems);
      }

      case "UPDATE_QUANTITY": {
         if (action.payload.quantity <= 0) {
            const newItems = state.items.filter(
               (item) => item.id !== action.payload.id
            );
            return calculateTotals(newItems);
         }

         const newItems = state.items.map((item) =>
            item.id === action.payload.id
               ? {
                    ...item,
                    quantity: Math.min(
                       action.payload.quantity,
                       item.stockCount
                    ),
                 }
               : item
         );
         return calculateTotals(newItems);
      }

      case "CLEAR_CART": {
         return { ...initialState };
      }

      case "LOAD_CART": {
         return calculateTotals(action.payload);
      }

      default:
         return state;
   }
}

// Helper function to calculate totals
function calculateTotals(items: CartItem[]): CartState {
   const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
   const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
   );

   return {
      items,
      totalItems,
      totalPrice,
   };
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper function to get user-specific storage key
const getCartStorageKey = (userId?: string): string => {
   return userId ? `ecommerce-cart-${userId}` : "ecommerce-cart-guest";
};

// Cart provider component
export function CartProvider({ children }: { children: React.ReactNode }) {
   const { data: session, status } = useSession();
   const [state, dispatch] = useReducer(cartReducer, initialState);
   const userId = session?.user?.id;
   const cartStorageKey = getCartStorageKey(userId);

   // Load cart from localStorage on mount and when user changes
   useEffect(() => {
      if (typeof window !== "undefined" && status !== "loading") {
         try {
            const savedCart = localStorage.getItem(cartStorageKey);
            if (savedCart) {
               const cartData = JSON.parse(savedCart);
               dispatch({ type: "LOAD_CART", payload: cartData });
            } else {
               // Clear cart if no saved cart for current user
               dispatch({ type: "CLEAR_CART" });
            }
         } catch (error) {
            console.error("Error loading cart from localStorage:", error);
            dispatch({ type: "CLEAR_CART" });
         }
      }
   }, [cartStorageKey, status]);

   // Save cart to localStorage whenever it changes
   useEffect(() => {
      if (typeof window !== "undefined" && status !== "loading") {
         try {
            localStorage.setItem(cartStorageKey, JSON.stringify(state.items));
         } catch (error) {
            console.error("Error saving cart to localStorage:", error);
         }
      }
   }, [state.items, cartStorageKey, status]);

   // Clear cart when user logs out (session becomes null after being authenticated)
   useEffect(() => {
      if (status === "unauthenticated" && state.items.length > 0) {
         dispatch({ type: "CLEAR_CART" });
      }
   }, [status, state.items.length]);

   // Migrate guest cart when user logs in
   useEffect(() => {
      if (status === "authenticated" && userId) {
         migrateGuestCart();
      }
   }, [status, userId]);

   // Context methods
   const addToCart = (
      product: Omit<CartItem, "quantity"> & { quantity?: number }
   ) => {
      dispatch({ type: "ADD_TO_CART", payload: product });
   };

   const removeFromCart = (id: string) => {
      dispatch({ type: "REMOVE_FROM_CART", payload: { id } });
   };

   const updateQuantity = (id: string, quantity: number) => {
      dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
   };

   const clearCart = () => {
      dispatch({ type: "CLEAR_CART" });
   };

   const getItemQuantity = (id: string): number => {
      const item = state.items.find((item) => item.id === id);
      return item ? item.quantity : 0;
   };

   const migrateGuestCart = () => {
      if (typeof window !== "undefined" && userId) {
         try {
            const guestCartKey = getCartStorageKey();
            const guestCart = localStorage.getItem(guestCartKey);

            if (guestCart) {
               const guestCartData = JSON.parse(guestCart);
               if (guestCartData.length > 0) {
                  // Merge guest cart with current user cart
                  guestCartData.forEach((guestItem: CartItem) => {
                     dispatch({ type: "ADD_TO_CART", payload: guestItem });
                  });
                  // Clear guest cart after migration
                  localStorage.removeItem(guestCartKey);
               }
            }
         } catch (error) {
            console.error("Error migrating guest cart:", error);
         }
      }
   };

   const contextValue: CartContextType = {
      ...state,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getItemQuantity,
      migrateGuestCart,
   };

   return (
      <CartContext.Provider value={contextValue}>
         {children}
      </CartContext.Provider>
   );
}

// Custom hook to use cart context
export function useCart() {
   const context = useContext(CartContext);
   if (context === undefined) {
      throw new Error("useCart must be used within a CartProvider");
   }
   return context;
}
