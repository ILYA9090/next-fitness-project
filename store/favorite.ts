import {
  FavoriteEntityType,
  FavoriteItem,
  getFavorites,
  toggleFavorite,
} from "@/lib/api/actions";
import { create } from "zustand";

interface FavoritesStore {
  favorites: FavoriteItem[];
  isLoading: boolean;
  isInitialized: boolean;
  fetchFavorites: () => Promise<void>;
  toggle: (entityId: number, entityType: FavoriteEntityType) => Promise<void>;
  isFavorited: (entityId: number, entityType: FavoriteEntityType) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  favorites: [],
  isLoading: false,
  isInitialized: false,

  fetchFavorites: async () => {
    if (get().isInitialized || get().isLoading) return;

    set({ isLoading: true });
    try {
      const favorites = await getFavorites();
      set({ favorites, isInitialized: true });
    } catch (error) {
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  toggle: async (entityId, entityType) => {
    const { favorites } = get();
    const isCurrentlyFavorited = favorites.some(
      (f) => f.id === entityId && f.type === entityType,
    );

    const newFavorites = isCurrentlyFavorited
      ? favorites.filter((f) => !(f.id === entityId && f.type === entityType))
      : [...favorites, { id: entityId, type: entityType }];

    set({ favorites: newFavorites });

    try {
      // Реальный запрос на сервер
      await toggleFavorite(entityId, entityType);
    } catch (error) {
      set({ favorites });
      console.error(error);
    }
  },

  isFavorited: (entityId, entityType) => {
    return get().favorites.some(
      (f) => f.id === entityId && f.type === entityType,
    );
  },
}));
