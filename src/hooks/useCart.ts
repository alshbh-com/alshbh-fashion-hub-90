import { useState, useEffect, useCallback } from "react";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  nameAr: string;
  price: number;
  discountPrice?: number;
  image: string;
  color: string;
  colorHex: string;
  size: string;
  quantity: number;
}

const CART_KEY = "alshbh_cart";

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_KEY);
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading cart:", error);
        setItems([]);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    }
  }, [items, isLoaded]);

  // Add item to cart
  const addItem = useCallback((item: Omit<CartItem, "id">) => {
    setItems((prevItems) => {
      // Check if item with same product, color, and size exists
      const existingIndex = prevItems.findIndex(
        (i) =>
          i.productId === item.productId &&
          i.color === item.color &&
          i.size === item.size
      );

      if (existingIndex > -1) {
        // Update quantity if item exists
        const updatedItems = [...prevItems];
        updatedItems[existingIndex].quantity += item.quantity;
        return updatedItems;
      }

      // Add new item with unique ID
      return [...prevItems, { ...item, id: `${Date.now()}-${Math.random()}` }];
    });
  }, []);

  // Remove item from cart
  const removeItem = useCallback((itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  }, []);

  // Clear cart
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Calculate subtotal
  const subtotal = items.reduce((total, item) => {
    const price = item.discountPrice || item.price;
    return total + price * item.quantity;
  }, 0);

  // Get total item count
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    itemCount,
    isLoaded,
  };
};
