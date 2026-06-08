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
      showNotification("Title and description are required");
      return;
    }

    const slug =
      formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-");

    addQuiz({
      ...formData,
      slug,
    });

    resetForm();
    showNotification("Quiz created successfully");
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
      showNotification("Title and description are required");
      return;
    }

    updateQuiz(editingId, formData);
    resetForm();
    showNotification("Quiz updated successfully");
  };

  const handleDeleteQuiz = (id: string) => {
    if (confirm("Are you sure? This cannot be undone.")) {
      deleteQuiz(id);
      showNotification("Quiz deleted successfully");
    }
  };

  const handleDuplicateQuiz = (id: string) => {
    duplicateQuiz(id);
    showNotification("Quiz duplicated successfully");
  };

  const handleTogglePublish = (id: string, published: boolean) => {
    if (published) {
      unpublishQuiz(id);
      showNotification("Quiz unpublished");
    } else {
      publishQuiz(id);
      showNotification("Quiz published");
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
              Quiz Management
            </h1>
            <p className="text-muted-foreground">
              Create, edit, and manage quizzes
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
            {showForm ? "Cancel" : "New Quiz"}
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
              {editingId ? "Edit Quiz" : "Create New Quiz"}
            </h2>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Quiz title"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium mb-2">Slug</label>
                <Input
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="quiz-slug (auto-generated if empty)"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Quiz description"
                  className="w-full h-24 p-3 rounded-lg bg-white/5 border border-border/40 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full p-3 rounded-lg bg-white/5 border border-border/40 text-foreground focus:outline-none focus:border-primary/50"
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
                  Quiz Type
                </label>
                <select
                  value={formData.quizType}
                  onChange={(e) =>
                    setFormData({ ...formData, quizType: e.target.value as any })
                  }
                  className="w-full p-3 rounded-lg bg-white/5 border border-border/40 text-foreground focus:outline-none focus:border-primary/50"
                >
                  <option value="weighted_personality">
                    Weighted Personality (Default - Best for personality quizzes)
                  </option>
                  <option value="personality_based">
                    Personality-Based (Direct result mapping)
                  </option>
                  <option value="score_based">
                    Score-Based (Numeric scoring)
                  </option>
                  <option value="percentage_matching">
                    Percentage Matching (Show match percentages)
                  </option>
                </select>
              </div>

              {/* Thumbnail */}
              <ImageUpload
                value={formData.thumbnail}
                onChange={(url) =>
                  setFormData({ ...formData, thumbnail: url })
                }
                label="Quiz Thumbnail"
                placeholder="Click to upload or paste image URL"
              />

              {/* SEO Title */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  SEO Title
                </label>
                <Input
                  value={formData.seoTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, seoTitle: e.target.value })
                  }
                  placeholder="SEO optimized title"
                />
              </div>

              {/* SEO Description */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  SEO Description
                </label>
                <textarea
                  value={formData.seoDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, seoDescription: e.target.value })
                  }
                  placeholder="SEO optimized description"
                  className="w-full h-20 p-3 rounded-lg bg-white/5 border border-border/40 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
                />
              </div>

              {/* Questions Editor */}
              <div className="p-4 rounded-lg border border-border/40 bg-white/2">
                <QuestionEditor
                  questions={formData.questions}
                  onChange={(questions) =>
                    setFormData({ ...formData, questions })
                  }
                  quizType={formData.quizType}
                />
              </div>

              {/* Results Editor */}
              <div className="p-4 rounded-lg border border-border/40 bg-white/2">
                <ResultsEditor
                  results={formData.results}
                  onChange={(results) =>
                    setFormData({ ...formData, results })
                  }
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
                  Publish immediately
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button onClick={editingId ? handleUpdateQuiz : handleAddQuiz}>
                  {editingId ? "Update Quiz" : "Create Quiz"}
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
              placeholder="Search quizzes..."
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
                  ? "No quizzes match your search"
                  : "No quizzes yet"}
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
                  {/* Thumbnail */}
                  {quiz.thumbnail && (
                    <img
                      src={quiz.thumbnail}
                      alt={quiz.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg truncate">{quiz.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {quiz.category} • {quiz.questions.length} questions
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="hidden sm:flex gap-4 text-sm text-muted-foreground">
                    <span>{quiz.questions.length} Q's</span>
                    <span>{quiz.results.length} Results</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() =>
                        handleTogglePublish(quiz.id, quiz.published)
                      }
                      title={quiz.published ? "Unpublish" : "Publish"}
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
                      title="Duplicate"
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
            <p className="text-sm text-muted-foreground">Total Quizzes</p>
          </Card>
          <Card className="glass-card p-4 text-center">
            <p className="text-2xl font-bold gradient-text">
              {quizzes.filter((q) => q.published).length}
            </p>
            <p className="text-sm text-muted-foreground">Published</p>
          </Card>
          <Card className="glass-card p-4 text-center">
            <p className="text-2xl font-bold gradient-text">
              {quizzes.filter((q) => !q.published).length}
            </p>
            <p className="text-sm text-muted-foreground">Drafts</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
