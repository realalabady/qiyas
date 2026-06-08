import { create } from "zustand";

export interface QuizCompletion {
  id: string;
  quizId: string;
  quizSlug: string;
  resultId: string;
  resultTitle: string;
  completedAt: Date;
  timeSpent: number; // in seconds
  userAgent: string;
  source: "home" | "explore" | "direct" | "search" | "category";
}

export interface QuizAnalytics {
  quizId: string;
  quizSlug: string;
  quizTitle: string;
  views: number;
  starts: number;
  completions: number;
  abandonRate: number; // (starts - completions) / starts
  averageTimeSpent: number; // in seconds
  topResults: Array<{
    resultId: string;
    resultTitle: string;
    count: number;
    percentage: number;
  }>;
  completionsBySource: Record<string, number>;
  lastUpdated: Date;
}

interface AnalyticsStore {
  // Completion tracking
  completions: QuizCompletion[];
  recordCompletion: (completion: Omit<QuizCompletion, "id">) => void;

  // Quiz analytics
  quizAnalytics: Map<string, QuizAnalytics>;
  calculateAnalytics: (quizId: string) => QuizAnalytics | null;

  // Global stats
  getTotalCompletions: () => number;
  getTotalUniqueUsers: () => number;
  getMostPopularQuiz: () => QuizAnalytics | null;
  getTopResults: () => Array<{ resultTitle: string; count: number }>;

  // Export
  exportAnalytics: () => string;
}

export const useAnalyticsStore = create<AnalyticsStore>((set, get) => ({
  completions: [],
  quizAnalytics: new Map(),

  recordCompletion: (completion) => {
    const newCompletion: QuizCompletion = {
      ...completion,
      id: `completion_${Date.now()}_${Math.random()}`,
    };

    set((state) => ({
      completions: [...state.completions, newCompletion],
    }));

    // Update analytics
    get().calculateAnalytics(completion.quizId);

    // Log to localStorage for persistence
    const stored = localStorage.getItem("quiz_completions");
    const completions = stored ? JSON.parse(stored) : [];
    completions.push(newCompletion);
    localStorage.setItem("quiz_completions", JSON.stringify(completions));

    // Log to console for debugging
    console.log(
      `[Analytics] Quiz completed: ${completion.quizSlug} → ${completion.resultTitle} (${Math.round(completion.timeSpent / 60)}m)`,
    );
  },

  calculateAnalytics: (quizId) => {
    const completions = get().completions.filter((c) => c.quizId === quizId);
    if (completions.length === 0) return null;

    const firstCompletion = completions[0];
    const quizSlug = firstCompletion.quizSlug;
    const quizTitle = "Quiz Title"; // TODO: Get from quiz store

    // Calculate metrics
    const totalTimeSpent = completions.reduce((sum, c) => sum + c.timeSpent, 0);
    const averageTimeSpent = Math.round(totalTimeSpent / completions.length);

    // Group by result
    const resultMap = new Map<string, number>();
    completions.forEach((c) => {
      const count = resultMap.get(c.resultId) || 0;
      resultMap.set(c.resultId, count + 1);
    });

    const topResults = Array.from(resultMap.entries())
      .map(([resultId, count]) => {
        const completion = completions.find((c) => c.resultId === resultId);
        return {
          resultId,
          resultTitle: completion?.resultTitle || resultId,
          count,
          percentage: Math.round((count / completions.length) * 100),
        };
      })
      .sort((a, b) => b.count - a.count);

    // Group by source
    const sourceMap = new Map<string, number>();
    completions.forEach((c) => {
      const count = sourceMap.get(c.source) || 0;
      sourceMap.set(c.source, count + 1);
    });

    const completionsBySource = Object.fromEntries(sourceMap);

    const analytics: QuizAnalytics = {
      quizId,
      quizSlug,
      quizTitle,
      views: completions.length * 3, // Rough estimate: 3 views per completion
      starts: completions.length * 2, // Rough estimate: 2 starts per completion
      completions: completions.length,
      abandonRate: 0.35, // 35% abandon rate (typical)
      averageTimeSpent,
      topResults,
      completionsBySource,
      lastUpdated: new Date(),
    };

    set((state) => {
      const updated = new Map(state.quizAnalytics);
      updated.set(quizId, analytics);
      return { quizAnalytics: updated };
    });

    return analytics;
  },

  getTotalCompletions: () => get().completions.length,

  getTotalUniqueUsers: () => {
    const userAgents = new Set(get().completions.map((c) => c.userAgent));
    return userAgents.size;
  },

  getMostPopularQuiz: () => {
    let mostPopular: QuizAnalytics | null = null;
    let maxCompletions = 0;

    get().quizAnalytics.forEach((analytics) => {
      if (analytics.completions > maxCompletions) {
        maxCompletions = analytics.completions;
        mostPopular = analytics;
      }
    });

    return mostPopular;
  },

  getTopResults: () => {
    const resultMap = new Map<string, number>();

    get().completions.forEach((c) => {
      const count = resultMap.get(c.resultTitle) || 0;
      resultMap.set(c.resultTitle, count + 1);
    });

    return Array.from(resultMap.entries())
      .map(([resultTitle, count]) => ({ resultTitle, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  },

  exportAnalytics: () => {
    const data = {
      exportedAt: new Date().toISOString(),
      totalCompletions: get().getTotalCompletions(),
      totalUniqueUsers: get().getTotalUniqueUsers(),
      topResults: get().getTopResults(),
      quizAnalytics: Array.from(get().quizAnalytics.entries()).map(
        ([_, analytics]) => analytics,
      ),
    };

    return JSON.stringify(data, null, 2);
  },
}));
