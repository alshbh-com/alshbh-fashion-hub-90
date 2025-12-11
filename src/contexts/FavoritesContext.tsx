import React, { createContext, useContext, ReactNode } from "react";
import { useFavorites, FavoriteItem } from "@/hooks/useFavorites";

interface FavoritesContextType {
  items: FavoriteItem[];
  addItem: (item: FavoriteItem) => void;
  removeItem: (itemId: string) => void;
  toggleItem: (item: FavoriteItem) => void;
  isFavorite: (itemId: string) => boolean;
  itemCount: number;
  isLoaded: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const favorites = useFavorites();

  return (
    <FavoritesContext.Provider value={favorites}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavoritesContext = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavoritesContext must be used within a FavoritesProvider");
  }
  return context;
};
