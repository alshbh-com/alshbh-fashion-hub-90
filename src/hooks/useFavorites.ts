import { useState, useEffect, useCallback } from "react";

export interface FavoriteItem {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  discountPrice?: number;
  image: string;
  rating?: number;
}

const FAVORITES_KEY = "alshbh_favorites";

export const useFavorites = () => {
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem(FAVORITES_KEY);
    if (savedFavorites) {
      try {
        setItems(JSON.parse(savedFavorites));
      } catch (error) {
        console.error("Error loading favorites:", error);
        setItems([]);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(items));
    }
  }, [items, isLoaded]);

  // Add item to favorites
  const addItem = useCallback((item: FavoriteItem) => {
    setItems((prevItems) => {
      // Check if item already exists
      if (prevItems.some((i) => i.id === item.id)) {
        return prevItems;
      }
      return [...prevItems, item];
    });
  }, []);

  // Remove item from favorites
  const removeItem = useCallback((itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  }, []);

  // Toggle favorite status
  const toggleItem = useCallback((item: FavoriteItem) => {
    setItems((prevItems) => {
      const exists = prevItems.some((i) => i.id === item.id);
      if (exists) {
        return prevItems.filter((i) => i.id !== item.id);
      }
      return [...prevItems, item];
    });
  }, []);

  // Check if item is in favorites
  const isFavorite = useCallback(
    (itemId: string) => {
      return items.some((item) => item.id === itemId);
    },
    [items]
  );

  return {
    items,
    addItem,
    removeItem,
    toggleItem,
    isFavorite,
    itemCount: items.length,
    isLoaded,
  };
};
