/**
 * Admin Dashboard — Overview with key metrics and action links.
 */

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BarChart3,
  FileText,
  FolderOpen,
  Image,
  Users,
  Brain,
  Settings,
} from "lucide-react";
import { pageTransition, staggerContainer, staggerItem } from "@/lib/motion";
import { useQuizzesAdmin } from "@/stores/quizzes-admin-store";
import { useAnalyticsStore } from "@/stores/analytics-store";

const QUICK_ACTIONS = [
  { label: "Create Quiz", to: "/admin/quizzes/create", icon: FileText },
  { label: "Manage Quizzes", to: "/admin/quizzes", icon: Brain },
  { label: "Categories", to: "/admin/categories", icon: FolderOpen },
  { label: "Media Library", to: "/admin/media", icon: Image },
  { label: "Analytics", to: "/admin/analytics", icon: BarChart3 },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

export function AdminDashboardPage() {
  const quizStore = useQuizzesAdmin();
  const analyticsStore = useAnalyticsStore();

  // Get real stats
  const totalQuizzes = quizStore.quizzes.length;
  const publishedQuizzes = quizStore.getPublishedQuizzes().length;
  const totalCompletions = analyticsStore.getTotalCompletions();
  const categories = [...new Set(quizStore.quizzes.map((q) => q.category))].length;

  const DASHBOARD_STATS = [
    {
      label: "Total Quizzes",
      value: totalQuizzes.toString(),
      icon: Brain,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Published Quizzes",
      value: publishedQuizzes.toString(),
      icon: FileText,
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Quiz Completions",
      value: totalCompletions > 0 ? totalCompletions.toLocaleString() : "0",
      icon: Users,
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Categories",
      value: categories.toString(),
      icon: FolderOpen,
      color: "from-orange-500 to-red-500",
    },
  ];
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
          <h1 className="text-4xl font-bold text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-400">
            Welcome back! Here's your quiz platform overview.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {DASHBOARD_STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={staggerItem}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50 hover:border-slate-600 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-white mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg`}
                  >
                    <Icon size={20} className="text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div variants={staggerItem} className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.to} to={action.to}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full h-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700/50 hover:border-slate-600 transition flex items-center justify-center gap-3 group"
                  >
                    <Icon
                      size={20}
                      className="text-slate-400 group-hover:text-blue-400 transition"
                    />
                    <span className="font-medium text-slate-300 group-hover:text-white transition">
                      {action.label}
                    </span>
                  </motion.button>
                </Link>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          variants={staggerItem}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700/50"
        >
          <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[
              {
                action: "Quiz Created",
                quiz: "Personality Color Test",
                time: "2 hours ago",
              },
              { action: "Quiz Published", quiz: "IQ Test", time: "1 day ago" },
              {
                action: "Category Added",
                quiz: "Career Tests",
                time: "3 days ago",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition"
              >
                <div>
                  <p className="text-white font-medium">{item.action}</p>
                  <p className="text-sm text-slate-400">{item.quiz}</p>
                </div>
                <p className="text-xs text-slate-500">{item.time}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
