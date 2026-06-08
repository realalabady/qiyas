import { create } from "zustand";
import {
  QuizEngine,
  type QuizConfig,
  type UserAnswers,
  type QuizResult,
} from "@/lib/quiz-engine";

interface QuizTakeStore {
  // State
  quizConfig: QuizConfig | null;
  engine: QuizEngine | null;
  currentQuestionIndex: number;
  userAnswers: UserAnswers;
  result: QuizResult | null;
  isCalculating: boolean;

  // Actions
  loadQuiz: (config: QuizConfig) => void;
  answerQuestion: (questionId: string, answerId: string | string[]) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  goToQuestion: (index: number) => void;
  calculateResult: () => void;
  resetQuiz: () => void;

  // Queries
  getCurrentQuestion: () => any | null;
  getProgress: () => number;
  canGoNext: () => boolean;
  canGoPrevious: () => boolean;
}

export const useQuizTakeStore = create<QuizTakeStore>((set, get) => ({
  quizConfig: null,
  engine: null,
  currentQuestionIndex: 0,
  userAnswers: {},
  result: null,
  isCalculating: false,

  loadQuiz: (config) => {
    const engine = new QuizEngine(config);
    set({
      quizConfig: config,
      engine,
      currentQuestionIndex: 0,
      userAnswers: {},
      result: null,
    });
  },

  answerQuestion: (questionId, answerId) => {
    const { engine } = get();
    if (!engine) return;

    engine.answerQuestion(questionId, answerId);

    set((state) => ({
      userAnswers: {
        ...state.userAnswers,
        [questionId]: answerId,
      },
    }));
  },

  nextQuestion: () => {
    set((state) => {
      if (
        state.currentQuestionIndex <
        (state.quizConfig?.questions.length || 0) - 1
      ) {
        return { currentQuestionIndex: state.currentQuestionIndex + 1 };
      }
      return state;
    });
  },

  previousQuestion: () => {
    set((state) => {
      if (state.currentQuestionIndex > 0) {
        return { currentQuestionIndex: state.currentQuestionIndex - 1 };
      }
      return state;
    });
  },

  goToQuestion: (index) => {
    set((state) => {
      if (index >= 0 && index < (state.quizConfig?.questions.length || 0)) {
        return { currentQuestionIndex: index };
      }
      return state;
    });
  },

  calculateResult: () => {
    const { engine } = get();
    if (!engine) return;

    set({ isCalculating: true });

    // Simulate calculation delay for UX
    setTimeout(() => {
      const result = engine.calculateResult();
      set({ result, isCalculating: false });
    }, 500);
  },

  resetQuiz: () => {
    set({
      quizConfig: null,
      engine: null,
      currentQuestionIndex: 0,
      userAnswers: {},
      result: null,
      isCalculating: false,
    });
  },

  getCurrentQuestion: () => {
    const { quizConfig, currentQuestionIndex } = get();
    return quizConfig?.questions[currentQuestionIndex] || null;
  },

  getProgress: () => {
    const { currentQuestionIndex, quizConfig } = get();
    if (!quizConfig) return 0;
    return Math.round(
      ((currentQuestionIndex + 1) / quizConfig.questions.length) * 100,
    );
  },

  canGoNext: () => {
    const { currentQuestionIndex, quizConfig } = get();
    return currentQuestionIndex < (quizConfig?.questions.length || 0) - 1;
  },

  canGoPrevious: () => {
    const { currentQuestionIndex } = get();
    return currentQuestionIndex > 0;
  },
}));
