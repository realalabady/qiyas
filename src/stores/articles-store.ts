import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Article } from "@/data/seed-articles";
import { SAMPLE_ARTICLES } from "@/data/seed-articles";
import {
  deleteDocById,
  fetchAllDocs,
  fetchPublishedDocs,
  saveDocById,
} from "@/lib/firebase/firestore-data";

const COLLECTION = "articles";

interface ArticlesStore {
  articles: Article[];
  searchQuery: string;
  selectedCategory: string | null;

  // Actions
  setArticles: (articles: Article[]) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  /** Local-only: attach generated translations without writing to the cloud. */
  setArticleI18n: (id: string, i18n: Article["i18n"]) => void;

  // Firestore sync
  hydrate: () => Promise<void>;
  syncOnAdmin: () => Promise<void>;
  pushAllToCloud: () => Promise<number>;

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

const seedArticles = (): Article[] =>
  SAMPLE_ARTICLES.map((article, index) => ({
    ...article,
    id: `article-${index + 1}`,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  }));

const normalizeArticle = (raw: Partial<Article>): Article => ({
  id: raw.id || `article-${Date.now()}`,
  slug: raw.slug || "",
  title: raw.title || "",
  excerpt: raw.excerpt || "",
  content: raw.content || "",
  category: raw.category || "General",
  author: raw.author || "Al-Maarefah Team",
  tags: raw.tags || [],
  image: raw.image ?? null,
  published: Boolean(raw.published),
  i18n: raw.i18n,
  views: Number.isFinite(raw.views) ? Number(raw.views) : 0,
  createdAt: raw.createdAt ? new Date(raw.createdAt) : new Date(),
  updatedAt: raw.updatedAt ? new Date(raw.updatedAt) : new Date(),
});

export const useArticles = create<ArticlesStore>()(
  persist(
    (set, get) => ({
      articles: seedArticles(),
      searchQuery: "",
      selectedCategory: null,

      setArticles: (articles) => set({ articles }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setArticleI18n: (id, i18n) =>
        set((state) => ({
          articles: state.articles.map((a) =>
            a.id === id ? { ...a, i18n } : a,
          ),
        })),

      // Public load: pull published articles from Firestore. Keep seed/cache
      // content if the collection hasn't been populated yet.
      hydrate: async () => {
        try {
          const remote = await fetchPublishedDocs<Article>(COLLECTION);
          if (remote.length > 0) {
            set({ articles: remote.map(normalizeArticle) });
          }
        } catch (error) {
          console.error("articles hydrate failed", error);
        }
      },

      // Admin load: read everything (including drafts) from Firestore.
      // Non-destructive — keeps local content if the cloud is still empty.
      syncOnAdmin: async () => {
        try {
          const remote = await fetchAllDocs<Article>(COLLECTION);
          if (remote.length > 0) {
            set({ articles: remote.map(normalizeArticle) });
          }
        } catch (error) {
          console.error("articles syncOnAdmin failed", error);
        }
      },

      // Explicit "sync my local content to the cloud" action (admin button).
      pushAllToCloud: async () => {
        const local = get().articles;
        await Promise.all(
          local.map((article) => saveDocById(COLLECTION, article.id, article)),
        );
        return local.length;
      },

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
        saveDocById(COLLECTION, newArticle.id, newArticle).catch((error) =>
          console.error("addArticle save failed", error),
        );
      },

      updateArticle: (id, updates) => {
        set((state) => ({
          articles: state.articles.map((article) =>
            article.id === id
              ? { ...article, ...updates, updatedAt: new Date() }
              : article,
          ),
        }));
        const updated = get().articles.find((article) => article.id === id);
        if (updated) {
          saveDocById(COLLECTION, id, updated).catch((error) =>
            console.error("updateArticle save failed", error),
          );
        }
      },

      deleteArticle: (id) => {
        set((state) => ({
          articles: state.articles.filter((article) => article.id !== id),
        }));
        deleteDocById(COLLECTION, id).catch((error) =>
          console.error("deleteArticle failed", error),
        );
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
    }),
    {
      name: "qiyas-articles-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ articles: state.articles }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<ArticlesStore> | undefined;
        const articles = persisted?.articles?.length
          ? persisted.articles.map((article) => normalizeArticle(article))
          : currentState.articles;
        return {
          ...currentState,
          articles,
        };
      },
    },
  ),
);
