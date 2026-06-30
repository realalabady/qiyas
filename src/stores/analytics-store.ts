import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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
  // Raw events
  completions: QuizCompletion[];
  views: Record<string, number>; // quizId -> count
  starts: Record<string, number>; // quizId -> count

  // Recording
  recordView: (quizId: string) => void;
  recordStart: (quizId: string) => void;
  recordCompletion: (completion: Omit<QuizCompletion, "id">) => void;

  // Per-quiz analytics (computed from real events)
  getQuizAnalytics: (quizId: string, quizTitle?: string) => QuizAnalytics | null;

  // Global stats
  getTotalCompletions: () => number;
  getTotalViews: () => number;
  getTotalStarts: () => number;
  getTotalUniqueUsers: () => number;
  getTopResults: () => Array<{ resultTitle: string; count: number }>;

  // Export
  exportAnalytics: () => string;
}

export const useAnalyticsStore = create<AnalyticsStore>()(
  persist(
    (set, get) => ({
      completions: [],
      views: {},
      starts: {},

      recordView: (quizId) => {
        if (!quizId) return;
        set((state) => ({
          views: { ...state.views, [quizId]: (state.views[quizId] || 0) + 1 },
        }));
      },

      recordStart: (quizId) => {
        if (!quizId) return;
        set((state) => ({
          starts: { ...state.starts, [quizId]: (state.starts[quizId] || 0) + 1 },
        }));
      },

      recordCompletion: (completion) => {
        const newCompletion: QuizCompletion = {
          ...completion,
          id: `completion_${Date.now()}_${Math.round(Math.random() * 1e6)}`,
        };
        set((state) => ({
          completions: [...state.completions, newCompletion],
        }));
      },

      getQuizAnalytics: (quizId, quizTitle) => {
        const completions = get().completions.filter((c) => c.quizId === quizId);
        const views = get().views[quizId] || 0;
        const starts = get().starts[quizId] || 0;

        if (completions.length === 0 && views === 0 && starts === 0) {
          return null;
        }

        const quizSlug = completions[0]?.quizSlug || "";

        const totalTimeSpent = completions.reduce(
          (sum, c) => sum + c.timeSpent,
          0,
        );
        const averageTimeSpent = completions.length
          ? Math.round(totalTimeSpent / completions.length)
          : 0;

        // Group completions by result
        const resultMap = new Map<string, number>();
        completions.forEach((c) => {
          resultMap.set(c.resultId, (resultMap.get(c.resultId) || 0) + 1);
        });
        const topResults = Array.from(resultMap.entries())
          .map(([resultId, count]) => ({
            resultId,
            resultTitle:
              completions.find((c) => c.resultId === resultId)?.resultTitle ||
              resultId,
            count,
            percentage: completions.length
              ? Math.round((count / completions.length) * 100)
              : 0,
          }))
          .sort((a, b) => b.count - a.count);

        // Group by source
        const sourceMap = new Map<string, number>();
        completions.forEach((c) => {
          sourceMap.set(c.source, (sourceMap.get(c.source) || 0) + 1);
        });

        // Real abandon rate: started but never completed.
        const abandonRate =
          starts > 0
            ? Math.max(0, (starts - completions.length) / starts)
            : 0;

        return {
          quizId,
          quizSlug,
          quizTitle: quizTitle || quizSlug || quizId,
          views,
          starts,
          completions: completions.length,
          abandonRate,
          averageTimeSpent,
          topResults,
          completionsBySource: Object.fromEntries(sourceMap),
          lastUpdated: new Date(),
        };
      },

      getTotalCompletions: () => get().completions.length,

      getTotalViews: () =>
        Object.values(get().views).reduce((sum, n) => sum + n, 0),

      getTotalStarts: () =>
        Object.values(get().starts).reduce((sum, n) => sum + n, 0),

      getTotalUniqueUsers: () => {
        const userAgents = new Set(get().completions.map((c) => c.userAgent));
        return userAgents.size;
      },

      getTopResults: () => {
        const resultMap = new Map<string, number>();
        get().completions.forEach((c) => {
          resultMap.set(c.resultTitle, (resultMap.get(c.resultTitle) || 0) + 1);
        });
        return Array.from(resultMap.entries())
          .map(([resultTitle, count]) => ({ resultTitle, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);
      },

      exportAnalytics: () => {
        const data = {
          exportedAt: new Date().toISOString(),
          totalViews: get().getTotalViews(),
          totalStarts: get().getTotalStarts(),
          totalCompletions: get().getTotalCompletions(),
          totalUniqueUsers: get().getTotalUniqueUsers(),
          topResults: get().getTopResults(),
          completions: get().completions,
        };
        return JSON.stringify(data, null, 2);
      },
    }),
    {
      name: "qiyas-analytics-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        completions: state.completions,
        views: state.views,
        starts: state.starts,
      }),
    },
  ),
);
