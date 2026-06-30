import { useState } from "react";
import { useQuizzesAdmin } from "@/stores/quizzes-admin-store";
import type { Quiz, QuizFormData } from "@/stores/quizzes-admin-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Eye, EyeOff, Copy, Search } from "lucide-react";
import { ImageUpload } from "@/components/quiz/image-upload";
import { ResultsEditor } from "@/components/quiz/results-editor";
import { QuestionEditor } from "@/components/quiz/question-editor";
import {
  getResultOptions,
  normalizeSlug,
  validateQuizConfig,
} from "@/lib/quiz-validation";
import { useLanguage } from "@/lib/i18n";

const CATEGORIES = [
  "Personality Tests",
  "IQ Tests",
  "Mental Age Tests",
  "Friendship Tests",
  "Relationship Tests",
  "Career Tests",
  "Entertainment Quizzes",
  "Anime Quizzes",
  "TV Show Quizzes",
  "Color Personality Tests",
  "Stress Tests",
  "Memory Tests",
  "General Knowledge",
];

export function AdminQuizzesPage() {
  const {
    quizzes,
    addQuiz,
    updateQuiz,
    deleteQuiz,
    duplicateQuiz,
    publishQuiz,
    unpublishQuiz,
  } = useQuizzesAdmin();
  const { t } = useLanguage();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  const [formData, setFormData] = useState<QuizFormData>({
    title: "",
    slug: "",
    description: "",
    category: "Personality Tests",
    thumbnail: "",
    seoTitle: "",
    seoDescription: "",
    quizType: "weighted_personality",
    questions: [],
    results: [],
    published: false,
  });

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddQuiz = () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      showNotification(t("admin.quizzes.title_desc_required"));
      return;
    }

    const slug = normalizeSlug(formData.slug || formData.title);
    if (!slug) {
      showNotification(t("admin.quizzes.slug_required"));
      return;
    }

    const isDuplicateSlug = quizzes.some((quiz) => quiz.slug === slug);
    if (isDuplicateSlug) {
      showNotification(t("admin.quizzes.slug_duplicate"));
      return;
    }

    if (formData.published && !validation.isValid) {
      showNotification(t("admin.quizzes.fix_errors"));
      return;
    }

    addQuiz({ ...formData, slug });
    resetForm();
    showNotification(t("admin.quizzes.created"));
  };

  const handleEditQuiz = (quiz: Quiz) => {
    setFormData({
      title: quiz.title,
      slug: quiz.slug,
      description: quiz.description,
      category: quiz.category,
      thumbnail: quiz.thumbnail,
      seoTitle: quiz.seoTitle,
      seoDescription: quiz.seoDescription,
      quizType: quiz.quizType,
      questions: quiz.questions,
      results: quiz.results,
      published: quiz.published,
    });
    setEditingId(quiz.id);
    setShowForm(true);
  };

  const handleUpdateQuiz = () => {
    if (!editingId) return;
    if (!formData.title.trim() || !formData.description.trim()) {
      showNotification(t("admin.quizzes.title_desc_required"));
      return;
    }

    const slug = normalizeSlug(formData.slug || formData.title);
    if (!slug) {
      showNotification(t("admin.quizzes.slug_required"));
      return;
    }

    const isDuplicateSlug = quizzes.some(
      (quiz) => quiz.slug === slug && quiz.id !== editingId,
    );
    if (isDuplicateSlug) {
      showNotification(t("admin.quizzes.slug_duplicate"));
      return;
    }

    if (formData.published && !validation.isValid) {
      showNotification(t("admin.quizzes.fix_errors"));
      return;
    }

    updateQuiz(editingId, { ...formData, slug });
    resetForm();
    showNotification(t("admin.quizzes.updated"));
  };

  const handleDeleteQuiz = (id: string) => {
    if (confirm(t("admin.quizzes.delete_confirm"))) {
      deleteQuiz(id);
      showNotification(t("admin.quizzes.deleted"));
    }
  };

  const handleDuplicateQuiz = (id: string) => {
    duplicateQuiz(id);
    showNotification(t("admin.quizzes.duplicated"));
  };

  const handleTogglePublish = (id: string, published: boolean) => {
    if (published) {
      unpublishQuiz(id);
      showNotification(t("admin.quizzes.unpublished_msg"));
    } else {
      const quiz = quizzes.find((q) => q.id === id);
      if (!quiz) return;
      const publishValidation = validateQuizConfig(quiz, t);
      if (!publishValidation.isValid) {
        showNotification(t("admin.quizzes.publish_errors"));
        return;
      }
      publishQuiz(id);
      showNotification(t("admin.quizzes.published_msg"));
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      description: "",
      category: "Personality Tests",
      thumbnail: "",
      seoTitle: "",
      seoDescription: "",
      quizType: "weighted_personality",
      questions: [],
      results: [],
      published: false,
    });
    setShowForm(false);
    setEditingId(null);
  };

  const resultOptions = getResultOptions(formData.results);
  const validation = validateQuizConfig(formData, t);

  const filteredQuizzes = quizzes.filter(
    (q) =>
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">
              {t("admin.quizzes.page_title")}
            </h1>
            <p className="text-muted-foreground">
              {t("admin.quizzes.page_subtitle")}
            </p>
          </div>
          <Button
            onClick={() => {
              if (showForm) resetForm();
              else setShowForm(true);
            }}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            {showForm ? t("admin.common.cancel") : t("admin.quizzes.new")}
          </Button>
        </div>

        {/* Notification */}
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-4 rounded-lg bg-green-500/20 text-green-400 border border-green-500/50"
          >
            {notification}
          </motion.div>
        )}

        {/* Form */}
        {showForm && (
          <Card className="glass-card p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingId
                ? t("admin.quizzes.edit_title")
                : t("admin.quizzes.create_title")}
            </h2>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("admin.quizzes.title_label")}
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder={t("admin.quizzes.title_placeholder")}
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("admin.quizzes.slug_label")}
                </label>
                <Input
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      slug: normalizeSlug(e.target.value),
                    })
                  }
                  placeholder={t("admin.quizzes.slug_placeholder")}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("admin.quizzes.description_label")}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder={t("admin.quizzes.description_placeholder")}
                  className="w-full h-24 p-3 rounded-lg bg-white/5 border border-border/40 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("admin.quizzes.category_label")}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full p-3 rounded-lg bg-white/5 border border-border/40 text-foreground focus:outline-none focus:border-primary/50 [&>option]:bg-slate-900 [&>option]:text-slate-100"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quiz Type */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("admin.quizzes.type_label")}
                </label>
                <select
                  value={formData.quizType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quizType: e.target.value as QuizFormData["quizType"],
                    })
                  }
                  className="w-full p-3 rounded-lg bg-white/5 border border-border/40 text-foreground focus:outline-none focus:border-primary/50 [&>option]:bg-slate-900 [&>option]:text-slate-100"
                >
                  <option value="weighted_personality">
                    {t("admin.quizzes.type_weighted")}
                  </option>
                  <option value="personality_based">
                    {t("admin.quizzes.type_personality")}
                  </option>
                  <option value="score_based">
                    {t("admin.quizzes.type_score")}
                  </option>
                  <option value="percentage_matching">
                    {t("admin.quizzes.type_percentage")}
                  </option>
                </select>
              </div>

              {/* Thumbnail */}
              <ImageUpload
                value={formData.thumbnail}
                onChange={(url) => setFormData({ ...formData, thumbnail: url })}
              />

              {/* SEO Title */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("admin.quizzes.seo_title_label")}
                </label>
                <Input
                  value={formData.seoTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, seoTitle: e.target.value })
                  }
                  placeholder={t("admin.quizzes.seo_title_placeholder")}
                />
              </div>

              {/* SEO Description */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("admin.quizzes.seo_desc_label")}
                </label>
                <textarea
                  value={formData.seoDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, seoDescription: e.target.value })
                  }
                  placeholder={t("admin.quizzes.seo_desc_placeholder")}
                  className="w-full h-20 p-3 rounded-lg bg-white/5 border border-border/40 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
                />
              </div>

              <Card className="p-4 bg-white/5 border border-border/50">
                <p className="text-sm font-medium mb-2">
                  {t("admin.quizzes.workflow_title")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("admin.quizzes.workflow_hint")}
                </p>
              </Card>

              {!validation.isValid && (
                <Card className="p-4 bg-red-500/10 border border-red-500/40">
                  <p className="text-sm font-medium text-red-300 mb-2">
                    {t("admin.quizzes.validation_title")}
                  </p>
                  <ul className="space-y-1 text-xs text-red-200 list-disc pl-4">
                    {validation.errors.slice(0, 8).map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                    {validation.errors.length > 8 && (
                      <li>+{validation.errors.length - 8} more…</li>
                    )}
                  </ul>
                </Card>
              )}

              {/* Questions Editor */}
              <div className="p-4 rounded-lg border border-border/40 bg-white/2">
                <QuestionEditor
                  questions={formData.questions}
                  onChange={(questions) =>
                    setFormData({ ...formData, questions })
                  }
                  quizType={formData.quizType}
                  resultOptions={resultOptions}
                />
              </div>

              {/* Results Editor */}
              <div className="p-4 rounded-lg border border-border/40 bg-white/2">
                <ResultsEditor
                  results={formData.results}
                  onChange={(results) => setFormData({ ...formData, results })}
                />
              </div>

              {/* Publish */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) =>
                    setFormData({ ...formData, published: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <label htmlFor="published" className="text-sm font-medium">
                  {t("admin.quizzes.publish_immediately")}
                </label>
                {!validation.isValid && (
                  <span className="text-xs text-muted-foreground">
                    {t("admin.quizzes.draft_note")}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={resetForm}>
                  {t("admin.common.cancel")}
                </Button>
                <Button onClick={editingId ? handleUpdateQuiz : handleAddQuiz}>
                  {editingId
                    ? t("admin.quizzes.update")
                    : t("admin.quizzes.create")}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder={t("admin.quizzes.search_placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-10"
            />
          </div>
        </div>

        {/* Quizzes List */}
        <div className="space-y-3">
          {filteredQuizzes.length === 0 ? (
            <Card className="glass-card p-8 text-center">
              <p className="text-muted-foreground">
                {searchQuery
                  ? t("admin.quizzes.no_search_results")
                  : t("admin.quizzes.no_quizzes")}
              </p>
            </Card>
          ) : (
            filteredQuizzes.map((quiz) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="glass-card p-4 flex items-center gap-4 hover:border-primary/50 transition-colors">
                  {quiz.thumbnail && (
                    <img
                      src={quiz.thumbnail}
                      alt={quiz.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg truncate">{quiz.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {quiz.category} • {quiz.questions.length}{" "}
                      {t("admin.quizzes.questions_unit")}
                    </p>
                  </div>

                  <div className="hidden sm:flex gap-4 text-sm text-muted-foreground">
                    <span>
                      {quiz.questions.length} {t("admin.quizzes.questions_unit")}
                    </span>
                    <span>
                      {quiz.results.length} {t("admin.quizzes.results_label")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() =>
                        handleTogglePublish(quiz.id, quiz.published)
                      }
                      title={
                        quiz.published
                          ? t("admin.quizzes.unpublish_btn")
                          : t("admin.quizzes.publish_btn")
                      }
                    >
                      {quiz.published ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDuplicateQuiz(quiz.id)}
                      title={t("admin.quizzes.duplicate_btn")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleEditQuiz(quiz)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDeleteQuiz(quiz.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <Card className="glass-card p-4 text-center">
            <p className="text-2xl font-bold gradient-text">{quizzes.length}</p>
            <p className="text-sm text-muted-foreground">
              {t("admin.stats.total_quizzes")}
            </p>
          </Card>
          <Card className="glass-card p-4 text-center">
            <p className="text-2xl font-bold gradient-text">
              {quizzes.filter((q) => q.published).length}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("admin.quizzes.published_stat")}
            </p>
          </Card>
          <Card className="glass-card p-4 text-center">
            <p className="text-2xl font-bold gradient-text">
              {quizzes.filter((q) => !q.published).length}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("admin.quizzes.drafts_stat")}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
