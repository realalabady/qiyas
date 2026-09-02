import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { QUIZZES } from "@/data/seed-quizzes";
import {
  PERSONALITY_QUIZ,
  IQ_QUIZ,
  CAREER_QUIZ,
  COMPATIBILITY_QUIZ,
} from "@/data/seed-engine-quizzes";
import type { QuizType } from "@/lib/quiz-engine";
import {
  deleteDocById,
  fetchAllDocs,
  fetchPublishedDocs,
  saveDocById,
} from "@/lib/firebase/firestore-data";

const COLLECTION = "quizzes";

export type QuestionType =
  | "personality"
  | "scored"
  | "image-choice"
  | "multiple-select";

export interface Answer {
  id: string;
  text: string;
  image?: string;
  weights?: Record<string, number>; // For weighted_personality
  score?: number; // For score_based
  resultId?: string; // For personality_based
}

export interface Question {
  id: string;
  text: string;
  description?: string;
  type: QuestionType;
  image?: string;
  answers: Answer[];
}

export interface Result {
  id: string;
  title: string;
  description: string;
  image?: string;
  strengths?: string[];
  weaknesses?: string[];
  careers?: string[];
  personality?: string; // Category name for weighted types
}

/**
 * Per-language snapshot of a quiz's *display text*. Questions/answers/results
 * are keyed by their stable id so translations survive reordering. Ids, slugs,
 * weights, scores and category linkage are never stored here.
 */
export interface QuizI18n {
  title?: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  questions?: Record<string, { text?: string; answers?: Record<string, string> }>;
  results?: Record<
    string,
    {
      title?: string;
      description?: string;
      strengths?: string[];
      weaknesses?: string[];
      careers?: string[];
    }
  >;
}

export type QuizLang = "en" | "ar";

export interface Quiz {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  thumbnail: string;
  seoTitle: string;
  seoDescription: string;
  quizType: QuizType; // Quiz engine type
  questions: Question[];
  results: Result[];
  published: boolean;
  /** Auto-generated translations keyed by language. Optional for legacy data. */
  i18n?: Partial<Record<QuizLang, QuizI18n>>;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizFormData extends Omit<
  Quiz,
  "id" | "createdAt" | "updatedAt"
> {}

interface QuizzesStore {
  quizzes: Quiz[];
  editingId: string | null;

  // Actions
  setQuizzes: (quizzes: Quiz[]) => void;
  setEditingId: (id: string | null) => void;
  /** Local-only: attach generated translations without writing to the cloud. */
  setQuizI18n: (id: string, i18n: Quiz["i18n"]) => void;

  // Firestore sync
  hydrate: () => Promise<void>;
  syncOnAdmin: () => Promise<void>;
  pushAllToCloud: () => Promise<number>;

  // CRUD
  addQuiz: (quiz: Omit<Quiz, "id" | "createdAt" | "updatedAt">) => void;
  updateQuiz: (id: string, updates: Partial<Quiz>) => void;
  deleteQuiz: (id: string) => void;
  duplicateQuiz: (id: string) => void;

  // Queries
  getQuizBySlug: (slug: string) => Quiz | undefined;
  getPublishedQuizzes: () => Quiz[];
  getQuizzesByCategory: (category: string) => Quiz[];

  // Publishing
  publishQuiz: (id: string) => void;
  unpublishQuiz: (id: string) => void;
}

const seedQuizzes = (): Quiz[] =>
  [
    PERSONALITY_QUIZ,
    IQ_QUIZ,
    CAREER_QUIZ,
    COMPATIBILITY_QUIZ,
    ...(QUIZZES as unknown as any[]).map((quiz: any) => ({
      id: quiz.id,
      title: quiz.title,
      slug: quiz.slug,
      description: quiz.description,
      category: quiz.category,
      thumbnail: quiz.thumbnail,
      seoTitle: quiz.seoTitle,
      seoDescription: quiz.seoDescription,
      quizType: "weighted_personality" as const,
      questions: [],
      results: [],
      published: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
  ] as Quiz[];

const normalizeQuiz = (raw: Partial<Quiz>): Quiz => ({
  id: raw.id || `quiz-${Date.now()}`,
  title: raw.title || "",
  slug: raw.slug || "",
  description: raw.description || "",
  category: raw.category || "General Knowledge",
  thumbnail: raw.thumbnail || "",
  seoTitle: raw.seoTitle || raw.title || "",
  seoDescription: raw.seoDescription || raw.description || "",
  quizType: raw.quizType || "weighted_personality",
  questions: raw.questions || [],
  results: raw.results || [],
  published: Boolean(raw.published),
  i18n: raw.i18n,
  createdAt: raw.createdAt ? new Date(raw.createdAt) : new Date(),
  updatedAt: raw.updatedAt ? new Date(raw.updatedAt) : new Date(),
});

export const useQuizzesAdmin = create<QuizzesStore>()(
  persist(
    (set, get) => ({
      quizzes: seedQuizzes(),
      editingId: null,

  setQuizzes: (quizzes) => set({ quizzes }),
  setEditingId: (id) => set({ editingId: id }),
  setQuizI18n: (id, i18n) =>
    set((state) => ({
      quizzes: state.quizzes.map((q) => (q.id === id ? { ...q, i18n } : q)),
    })),

  // Public load: pull published quizzes from Firestore. Keep seed/cache
  // content if the collection hasn't been populated yet.
  hydrate: async () => {
    try {
      const remote = await fetchPublishedDocs<Quiz>(COLLECTION);
      if (remote.length > 0) {
        set({ quizzes: remote.map((quiz) => normalizeQuiz(quiz)) });
      }
    } catch (error) {
      console.error("quizzes hydrate failed", error);
    }
  },

  // Admin load: read everything (including drafts) from Firestore.
  // Non-destructive — keeps local content if the cloud is still empty.
  syncOnAdmin: async () => {
    try {
      const remote = await fetchAllDocs<Quiz>(COLLECTION);
      if (remote.length > 0) {
        set({ quizzes: remote.map((quiz) => normalizeQuiz(quiz)) });
      }
    } catch (error) {
      console.error("quizzes syncOnAdmin failed", error);
    }
  },

  // Explicit "sync my local content to the cloud" action (admin button).
  pushAllToCloud: async () => {
    const local = get().quizzes;
    await Promise.all(
      local.map((quiz) => saveDocById(COLLECTION, quiz.id, quiz)),
    );
    return local.length;
  },

  addQuiz: (quiz) => {
    const newQuiz: Quiz = {
      ...quiz,
      id: `quiz-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((state) => ({
      quizzes: [newQuiz, ...state.quizzes],
    }));
    saveDocById(COLLECTION, newQuiz.id, newQuiz).catch((error) =>
      console.error("addQuiz save failed", error),
    );
  },

  updateQuiz: (id, updates) => {
    set((state) => ({
      quizzes: state.quizzes.map((quiz) =>
        quiz.id === id ? { ...quiz, ...updates, updatedAt: new Date() } : quiz,
      ),
    }));
    const updated = get().quizzes.find((quiz) => quiz.id === id);
    if (updated) {
      saveDocById(COLLECTION, id, updated).catch((error) =>
        console.error("updateQuiz save failed", error),
      );
    }
  },

  deleteQuiz: (id) => {
    set((state) => ({
      quizzes: state.quizzes.filter((quiz) => quiz.id !== id),
    }));
    deleteDocById(COLLECTION, id).catch((error) =>
      console.error("deleteQuiz failed", error),
    );
  },

  duplicateQuiz: (id) => {
    const quiz = get().quizzes.find((q) => q.id === id);
    if (!quiz) return;

    const duplicated: Quiz = {
      ...quiz,
      id: `quiz-${Date.now()}`,
      slug: `${quiz.slug}-copy`,
      title: `${quiz.title} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
      published: false,
    };

    set((state) => ({
      quizzes: [duplicated, ...state.quizzes],
    }));
    saveDocById(COLLECTION, duplicated.id, duplicated).catch((error) =>
      console.error("duplicateQuiz save failed", error),
    );
  },

  getQuizBySlug: (slug) => {
    return get().quizzes.find((q) => q.slug === slug);
  },

  getPublishedQuizzes: () => {
    return get().quizzes.filter((q) => q.published);
  },

  getQuizzesByCategory: (category) => {
    return get().quizzes.filter((q) => q.category === category);
  },

  publishQuiz: (id) => {
    get().updateQuiz(id, { published: true });
  },

      unpublishQuiz: (id) => {
        get().updateQuiz(id, { published: false });
      },
    }),
    {
      name: "qiyas-quizzes-admin-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ quizzes: state.quizzes }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<QuizzesStore> | undefined;
        const quizzes = persisted?.quizzes?.length
          ? persisted.quizzes.map((quiz) => normalizeQuiz(quiz))
          : currentState.quizzes;
        return {
          ...currentState,
          quizzes,
        };
      },
    },
  ),
);
