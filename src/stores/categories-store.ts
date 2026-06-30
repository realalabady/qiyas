import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  deleteDocById,
  fetchAllDocs,
  saveDocById,
} from "@/lib/firebase/firestore-data";

const COLLECTION = "categories";

export type CategoryType = "quiz" | "article";

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  color: string;
  type: CategoryType;
  createdAt: Date;
}

const normalizeCategory = (raw: Partial<Category>): Category => ({
  id: raw.id || `cat-${Date.now()}`,
  name: raw.name || "",
  slug: raw.slug || "",
  icon: raw.icon || "🧠",
  description: raw.description || "",
  color: raw.color || "#ec4899",
  // Default legacy categories (created before the quiz/article split) to "quiz".
  type: raw.type === "article" ? "article" : "quiz",
  createdAt: raw.createdAt ? new Date(raw.createdAt) : new Date(),
});

interface CategoriesStore {
  categories: Category[];
  hydrate: () => Promise<void>;
  syncOnAdmin: () => Promise<void>;
  pushAllToCloud: () => Promise<number>;
  addCategory: (category: Omit<Category, "id" | "createdAt">) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  getCategories: () => Category[];
  getCategoriesByType: (type: CategoryType) => Category[];
}

export const useCategories = create<CategoriesStore>()(
  persist(
    (set, get) => ({
      categories: [],

      hydrate: async () => {
        try {
          const remote = await fetchAllDocs<Category>(COLLECTION);
          if (remote.length > 0) {
            set({ categories: remote.map((cat) => normalizeCategory(cat)) });
          }
        } catch (error) {
          console.error("categories hydrate failed", error);
        }
      },

      syncOnAdmin: async () => {
        try {
          const remote = await fetchAllDocs<Category>(COLLECTION);
          if (remote.length > 0) {
            set({ categories: remote.map((cat) => normalizeCategory(cat)) });
          }
        } catch (error) {
          console.error("categories syncOnAdmin failed", error);
        }
      },

      // Explicit "sync my local content to the cloud" action (admin button).
      pushAllToCloud: async () => {
        const local = get().categories;
        await Promise.all(
          local.map((cat) => saveDocById(COLLECTION, cat.id, cat)),
        );
        return local.length;
      },

      addCategory: (category) => {
        const newCategory: Category = {
          ...category,
          id: `cat-${Date.now()}`,
          createdAt: new Date(),
        };
        set((state) => ({
          categories: [...state.categories, newCategory],
        }));
        saveDocById(COLLECTION, newCategory.id, newCategory).catch((error) =>
          console.error("addCategory save failed", error),
        );
      },

      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((cat) =>
            cat.id === id ? { ...cat, ...updates } : cat,
          ),
        }));
        const updated = get().categories.find((cat) => cat.id === id);
        if (updated) {
          saveDocById(COLLECTION, id, updated).catch((error) =>
            console.error("updateCategory save failed", error),
          );
        }
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((cat) => cat.id !== id),
        }));
        deleteDocById(COLLECTION, id).catch((error) =>
          console.error("deleteCategory failed", error),
        );
      },

      getCategories: () => get().categories,

      getCategoriesByType: (type) =>
        get().categories.filter((cat) => cat.type === type),
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
