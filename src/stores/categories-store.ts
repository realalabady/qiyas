import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  color: string;
  createdAt: Date;
}

const normalizeCategory = (raw: Partial<Category>): Category => ({
  id: raw.id || `cat-${Date.now()}`,
  name: raw.name || "",
  slug: raw.slug || "",
  icon: raw.icon || "🧠",
  description: raw.description || "",
  color: raw.color || "#ec4899",
  createdAt: raw.createdAt ? new Date(raw.createdAt) : new Date(),
});

interface CategoriesStore {
  categories: Category[];
  addCategory: (category: Omit<Category, "id" | "createdAt">) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  getCategories: () => Category[];
}

export const useCategories = create<CategoriesStore>()(
  persist(
    (set, get) => ({
      categories: [],

      addCategory: (category) => {
        const newCategory: Category = {
          ...category,
          id: `cat-${Date.now()}`,
          createdAt: new Date(),
        };
        set((state) => ({
          categories: [...state.categories, newCategory],
        }));
      },

      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((cat) =>
            cat.id === id ? { ...cat, ...updates } : cat,
          ),
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((cat) => cat.id !== id),
        }));
      },

      getCategories: () => get().categories,
    }),
    {
      name: "qiyas-categories-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ categories: state.categories }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<CategoriesStore> | undefined;
        return {
          ...currentState,
          categories: (persisted?.categories || []).map((cat) =>
            normalizeCategory(cat),
          ),
        };
      },
    },
  ),
);
