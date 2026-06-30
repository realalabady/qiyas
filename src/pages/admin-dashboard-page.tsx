/**
 * Admin Dashboard — Overview with key metrics and action links.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FileText,
  FolderOpen,
  Image,
  Users,
  Brain,
  Settings,
  UploadCloud,
  Loader,
} from "lucide-react";
import { pageTransition, staggerContainer, staggerItem } from "@/lib/motion";
import { useQuizzesAdmin } from "@/stores/quizzes-admin-store";
import { useArticles } from "@/stores/articles-store";
import { useCategories } from "@/stores/categories-store";
import { useAnalyticsStore } from "@/stores/analytics-store";
import { useLanguage } from "@/lib/i18n";

const QUICK_ACTIONS = [
  { labelKey: "admin.action.create_quiz", to: "/admin/quizzes", icon: FileText },
  { labelKey: "admin.action.manage_quizzes", to: "/admin/quizzes", icon: Brain },
  { labelKey: "admin.action.categories", to: "/admin/categories", icon: FolderOpen },
  { labelKey: "admin.action.media_library", to: "/admin/media", icon: Image },
  { labelKey: "admin.action.settings", to: "/admin/settings", icon: Settings },
];

export function AdminDashboardPage() {
  const quizStore = useQuizzesAdmin();
  const analyticsStore = useAnalyticsStore();
  const { t } = useLanguage();

  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Push this admin's local content up to Firestore so it shows on every device.
  const handleSyncToCloud = async () => {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const [quizzes, articles, categories] = await Promise.all([
        useQuizzesAdmin.getState().pushAllToCloud(),
        useArticles.getState().pushAllToCloud(),
        useCategories.getState().pushAllToCloud(),
      ]);
      setSyncMessage(
        `${t("admin.dashboard.sync_success_prefix")} ${quizzes} ${t("admin.dashboard.sync_quizzes")}, ${articles} ${t("admin.dashboard.sync_articles")}, ${categories} ${t("admin.dashboard.sync_categories")}.`,
      );
    } catch (error) {
      console.error("sync to cloud failed", error);
      setSyncMessage(t("admin.dashboard.sync_failed"));
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMessage(null), 6000);
    }
  };

  // Get real stats
  const totalQuizzes = quizStore.quizzes.length;
  const publishedQuizzes = quizStore.getPublishedQuizzes().length;
  const totalCompletions = analyticsStore.getTotalCompletions();
  const categories = [...new Set(quizStore.quizzes.map((q) => q.category))]
    .length;

  const DASHBOARD_STATS = [
    {
      label: t("admin.stats.total_quizzes"),
      value: totalQuizzes.toString(),
      icon: Brain,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: t("admin.stats.published_quizzes"),
      value: publishedQuizzes.toString(),
      icon: FileText,
      color: "from-green-500 to-emerald-500",
    },
    {
      label: t("admin.stats.quiz_completions"),
      value: totalCompletions > 0 ? totalCompletions.toLocaleString() : "0",
      icon: Users,
      color: "from-purple-500 to-pink-500",
    },
    {
      label: t("admin.stats.categories"),
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
        <motion.div
          variants={staggerItem}
          className="mb-12 flex flex-wrap items-start justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {t("admin.dashboard")}
            </h1>
            <p className="text-slate-400">{t("admin.welcome")}</p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <button
              onClick={handleSyncToCloud}
              disabled={syncing}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg hover:opacity-90 disabled:opacity-60 transition"
            >
              {syncing ? (
                <Loader size={16} className="animate-spin" />
              ) : (
                <UploadCloud size={16} />
              )}
              {syncing
                ? t("admin.dashboard.syncing")
                : t("admin.dashboard.sync_to_cloud")}
            </button>
            {syncMessage && (
              <span className="text-xs text-slate-300 max-w-xs text-right">
                {syncMessage}
              </span>
            )}
          </div>
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
          <h2 className="text-2xl font-bold text-white mb-6">{t("admin.quick_actions")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.labelKey} to={action.to}>
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
                      {t(action.labelKey)}
                    </span>
                  </motion.button>
                </Link>
              );
            })}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
