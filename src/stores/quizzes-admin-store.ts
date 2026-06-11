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
  },

  updateQuiz: (id, updates) => {
    set((state) => ({
      quizzes: state.quizzes.map((quiz) =>
        quiz.id === id ? { ...quiz, ...updates, updatedAt: new Date() } : quiz,
      ),
    }));
  },

  deleteQuiz: (id) => {
    set((state) => ({
      quizzes: state.quizzes.filter((quiz) => quiz.id !== id),
    }));
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
