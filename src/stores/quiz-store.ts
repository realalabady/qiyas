/**
 * Quiz store using Zustand.
 * Manages quiz state: current question, answers, progress, results.
 * Auto-saves to localStorage.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface QuizAnswer {
  questionId: string;
  optionId: string;
  timestamp: number;
}

export interface QuizState {
  // Current quiz session
  currentQuizSlug: string | null;
  currentQuestionIndex: number;
  answers: Record<string, string>;
  startTime: number | null;
  completed: boolean;
  result: { key: string; title: string; emoji: string } | null;

  // Actions
  startQuiz: (slug: string) => void;
  answerQuestion: (questionId: string, optionId: string) => void;
  goNextQuestion: () => void;
  goPreviousQuestion: () => void;
  submitQuiz: (
    resultKey: string,
    resultTitle: string,
    resultEmoji: string,
  ) => void;
  resetQuiz: () => void;
  getCurrentAnswer: (questionId: string) => string | undefined;
  getProgress: (totalQuestions: number) => number;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      currentQuizSlug: null,
      currentQuestionIndex: 0,
      answers: {},
      startTime: null,
      completed: false,
      result: null,

      startQuiz: (slug: string) => {
        set({
          currentQuizSlug: slug,
          currentQuestionIndex: 0,
          answers: {},
          startTime: Date.now(),
          completed: false,
          result: null,
        });
      },

      answerQuestion: (questionId: string, optionId: string) => {
        set((state) => ({
          answers: {
            ...state.answers,
            [questionId]: optionId,
          },
        }));
      },

      goNextQuestion: () => {
        set((state) => ({
          currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, 99),
        }));
      },

      goPreviousQuestion: () => {
        set((state) => ({
          currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
        }));
      },

      submitQuiz: (
        resultKey: string,
        resultTitle: string,
        resultEmoji: string,
      ) => {
        set({
          completed: true,
          result: {
            key: resultKey,
            title: resultTitle,
            emoji: resultEmoji,
          },
        });
      },

      resetQuiz: () => {
        set({
          currentQuizSlug: null,
          currentQuestionIndex: 0,
          answers: {},
          startTime: null,
          completed: false,
          result: null,
        });
      },

      getCurrentAnswer: (questionId: string) => {
        return get().answers[questionId];
      },

      getProgress: (totalQuestions: number) => {
        return Math.round(
          ((get().currentQuestionIndex + 1) / totalQuestions) * 100,
        );
      },
    }),
    {
      name: "quiz-storage",
      partialize: (state) => ({
        currentQuizSlug: state.currentQuizSlug,
        currentQuestionIndex: state.currentQuestionIndex,
        answers: state.answers,
        startTime: state.startTime,
        completed: state.completed,
        result: state.result,
      }),
    },
  ),
);
