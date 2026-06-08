import { create } from "zustand";

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  color: string;
  createdAt: Date;
}

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "cat-1",
    name: "Personality Tests",
    slug: "personality-tests",
    icon: "🧠",
    description: "Discover your personality traits and characteristics",
    color: "#ec4899",
    createdAt: new Date(),
  },
  {
    id: "cat-2",
    name: "IQ Tests",
    slug: "iq-tests",
    icon: "🎓",
    description: "Test your intelligence and cognitive abilities",
    color: "#f59e0b",
    createdAt: new Date(),
  },
  {
    id: "cat-3",
    name: "Entertainment",
    slug: "entertainment",
    icon: "🎬",
    description: "Fun quizzes about movies, TV shows, and entertainment",
    color: "#8b5cf6",
    createdAt: new Date(),
  },
];

interface CategoriesStore {
  categories: Category[];
  addCategory: (category: Omit<Category, "id" | "createdAt">) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  getCategories: () => Category[];
}

export const useCategories = create<CategoriesStore>((set, get) => ({
  categories: DEFAULT_CATEGORIES,

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
}));
