import { create } from "zustand";
import type { Article } from "@/data/seed-articles";
import { SAMPLE_ARTICLES } from "@/data/seed-articles";

interface ArticlesStore {
  articles: Article[];
  searchQuery: string;
  selectedCategory: string | null;

  // Actions
  setArticles: (articles: Article[]) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;

  // CRUD
  addArticle: (
    article: Omit<Article, "id" | "createdAt" | "updatedAt" | "views">,
  ) => void;
  updateArticle: (id: string, updates: Partial<Article>) => void;
  deleteArticle: (id: string) => void;

  // Queries
  getFilteredArticles: () => Article[];
  getArticleBySlug: (slug: string) => Article | undefined;
  getArticlesByCategory: (category: string) => Article[];
  getTrendingArticles: (limit?: number) => Article[];
}

export const useArticles = create<ArticlesStore>((set, get) => {
  // Initialize with sample articles
  const initialArticles: Article[] = SAMPLE_ARTICLES.map((article, index) => ({
    ...article,
    id: `article-${index + 1}`,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  }));

  return {
    articles: initialArticles,
    searchQuery: "",
    selectedCategory: null,

    setArticles: (articles) => set({ articles }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    setSelectedCategory: (category) => set({ selectedCategory: category }),

    addArticle: (article) => {
      const newArticle: Article = {
        ...article,
        id: `article-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        views: 0,
      };
      set((state) => ({
        articles: [newArticle, ...state.articles],
      }));
    },

    updateArticle: (id, updates) => {
      set((state) => ({
        articles: state.articles.map((article) =>
          article.id === id
            ? { ...article, ...updates, updatedAt: new Date() }
            : article,
        ),
      }));
    },

    deleteArticle: (id) => {
      set((state) => ({
        articles: state.articles.filter((article) => article.id !== id),
      }));
    },

    getFilteredArticles: () => {
      const { articles, searchQuery, selectedCategory } = get();
      return articles.filter((article) => {
        const matchesSearch =
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
          !selectedCategory || article.category === selectedCategory;
        return matchesSearch && matchesCategory && article.published;
      });
    },

    getArticleBySlug: (slug) => {
      return get().articles.find((article) => article.slug === slug);
    },

    getArticlesByCategory: (category) => {
      return get().articles.filter(
        (article) => article.category === category && article.published,
      );
    },

    getTrendingArticles: (limit = 5) => {
      return get()
        .articles.filter((article) => article.published)
        .sort((a, b) => b.views - a.views)
        .slice(0, limit);
    },
  };
});
