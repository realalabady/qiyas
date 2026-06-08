/**
 * Analytics page — Track quiz performance, views, shares, completions.
 */

import { motion } from "framer-motion";
import { Eye, Play, CheckCircle, Share2, BarChart3 } from "lucide-react";
import { pageTransition, staggerContainer, staggerItem } from "@/lib/motion";

const ANALYTICS_DATA = [
  {
    label: "Total Views",
    value: "128,450",
    trend: "+12.5%",
    icon: Eye,
    color: "from-blue-500 to-cyan-500",
  },
  {
    label: "Quiz Starts",
    value: "92,340",
    trend: "+8.2%",
    icon: Play,
    color: "from-green-500 to-emerald-500",
  },
  {
    label: "Completions",
    value: "78,120",
    trend: "+5.1%",
    icon: CheckCircle,
    color: "from-purple-500 to-pink-500",
  },
  {
    label: "Social Shares",
    value: "34,560",
    trend: "+23.4%",
    icon: Share2,
    color: "from-orange-500 to-red-500",
  },
];

const TOP_QUIZZES = [
  {
    title: "Personality Color Test",
    views: 45230,
    completions: 38920,
    completionRate: "86%",
  },
  { title: "IQ Test", views: 32450, completions: 24560, completionRate: "76%" },
  {
    title: "Love Language Test",
    views: 28340,
    completions: 22890,
    completionRate: "81%",
  },
  {
    title: "Introvert/Extrovert Test",
    views: 22430,
    completions: 18340,
    completionRate: "82%",
  },
];

export function AdminAnalyticsPage() {
  return (
    <motion.div
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-8 px-4"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div variants={staggerItem} className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <BarChart3 size={32} className="text-blue-400" />
            Analytics
          </h1>
          <p className="text-slate-400">
            Track quiz performance and user engagement metrics.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {ANALYTICS_DATA.map((metric) => {
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
                  <div
                    className={`bg-gradient-to-br ${metric.color} p-2 rounded-lg`}
                  >
                    <Icon size={16} className="text-white" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white mb-2">
                  {metric.value}
                </p>
                <p className="text-sm text-green-400 font-medium">
                  {metric.trend} vs last month
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
            Top Performing Quizzes
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                    Quiz Title
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">
                    Views
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">
                    Completions
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">
                    Completion Rate
                  </th>
                </tr>
              </thead>
              <tbody>
                {TOP_QUIZZES.map((quiz, i) => (
                  <motion.tr
                    key={i}
                    variants={staggerItem}
                    className="border-b border-slate-700/30 hover:bg-slate-700/20 transition"
                  >
                    <td className="py-3 px-4 text-white">{quiz.title}</td>
                    <td className="py-3 px-4 text-right text-slate-300">
                      {quiz.views.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-300">
                      {quiz.completions.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-block bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                        {quiz.completionRate}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
