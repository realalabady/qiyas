/**
 * Analytics page — real quiz performance from recorded events
 * (views, starts, completions). Data comes from the analytics store,
 * which persists to localStorage.
 */

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Eye, Play, CheckCircle, Users, BarChart3, Download } from "lucide-react";
import { pageTransition, staggerContainer, staggerItem } from "@/lib/motion";
import { useAnalyticsStore } from "@/stores/analytics-store";
import { useQuizzesAdmin } from "@/stores/quizzes-admin-store";
import { Button } from "@/components/ui/button";

export function AdminAnalyticsPage() {
  const analytics = useAnalyticsStore();
  const quizzes = useQuizzesAdmin((s) => s.quizzes);

  const totals = {
    views: analytics.getTotalViews(),
    starts: analytics.getTotalStarts(),
    completions: analytics.getTotalCompletions(),
    uniqueUsers: analytics.getTotalUniqueUsers(),
  };

  const perQuiz = useMemo(() => {
    return quizzes
      .map((q) => analytics.getQuizAnalytics(q.id, q.title))
      .filter((a): a is NonNullable<typeof a> => a !== null)
      .sort((a, b) => b.views - a.views);
    // Recompute when underlying events change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizzes, analytics.completions, analytics.views, analytics.starts]);

  const cards = [
    { label: "Total Views", value: totals.views, icon: Eye, color: "from-blue-500 to-cyan-500" },
    { label: "Quiz Starts", value: totals.starts, icon: Play, color: "from-green-500 to-emerald-500" },
    { label: "Completions", value: totals.completions, icon: CheckCircle, color: "from-purple-500 to-pink-500" },
    { label: "Unique Users", value: totals.uniqueUsers, icon: Users, color: "from-orange-500 to-red-500" },
  ];

  const handleExport = () => {
    const blob = new Blob([analytics.exportAnalytics()], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qiyas-analytics-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const hasData =
    totals.views > 0 || totals.starts > 0 || totals.completions > 0;

  return (
    <motion.div
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-8 px-4"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={staggerItem}
          className="mb-12 flex items-start justify-between gap-4 flex-wrap"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <BarChart3 size={32} className="text-blue-400" />
              Analytics
            </h1>
            <p className="text-slate-400">
              Real quiz performance from recorded views, starts and completions.
            </p>
          </div>
          <Button onClick={handleExport} variant="outline" className="gap-2">
            <Download size={16} />
            Export JSON
          </Button>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {cards.map((metric) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                variants={staggerItem}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50"
              >
                <div className="flex items-start justify-between mb-4">
                  <p className="text-slate-400 text-sm font-medium">
                    {metric.label}
                  </p>
                  <div className={`bg-gradient-to-br ${metric.color} p-2 rounded-lg`}>
                    <Icon size={16} className="text-white" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white">
                  {metric.value.toLocaleString()}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          variants={staggerItem}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700/50"
        >
          <h2 className="text-xl font-bold text-white mb-6">
            Quiz Performance
          </h2>

          {!hasData ? (
            <p className="text-slate-400 text-sm py-8 text-center">
              No analytics yet. Views, starts and completions will appear here
              as users interact with published quizzes.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50 text-slate-400 text-sm">
                    <th className="text-left py-3 px-4 font-semibold">Quiz</th>
                    <th className="text-right py-3 px-4 font-semibold">Views</th>
                    <th className="text-right py-3 px-4 font-semibold">Starts</th>
                    <th className="text-right py-3 px-4 font-semibold">Completions</th>
                    <th className="text-right py-3 px-4 font-semibold">Abandon Rate</th>
                    <th className="text-right py-3 px-4 font-semibold">Avg Time</th>
                  </tr>
                </thead>
                <tbody>
                  {perQuiz.map((a) => (
                    <tr
                      key={a.quizId}
                      className="border-b border-slate-700/30 hover:bg-slate-700/20 transition"
                    >
                      <td className="py-3 px-4 text-white">{a.quizTitle}</td>
                      <td className="py-3 px-4 text-right text-slate-300">
                        {a.views.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-300">
                        {a.starts.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-300">
                        {a.completions.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="inline-block bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-sm font-medium">
                          {Math.round(a.abandonRate * 100)}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-300">
                        {a.averageTimeSpent > 0
                          ? `${Math.floor(a.averageTimeSpent / 60)}m ${a.averageTimeSpent % 60}s`
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
