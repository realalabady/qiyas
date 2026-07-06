import { useState } from "react";
import { useArticles } from "@/stores/articles-store";
import type { Article } from "@/data/seed-articles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { buildArticleI18n } from "@/lib/localized-content";

export function AdminArticlesPage() {
  const { articles, addArticle, updateArticle, deleteArticle } = useArticles();
  const { t } = useLanguage();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);

  const emptyForm: Omit<Article, "id" | "createdAt" | "updatedAt" | "views"> =
    {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      image: null,
      author: "Admin",
      category: "Personality",
      tags: [],
      published: false,
    };

  const [formData, setFormData] =
    useState<Omit<Article, "id" | "createdAt" | "updatedAt" | "views">>(
      emptyForm,
    );

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddArticle = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      showNotification(t("admin.articles.title_content_required"));
      return;
    }

    const slug =
      formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-");

    setTranslating(true);
    showNotification(t("admin.articles.translating"));
    const i18n = await buildArticleI18n(formData);
    setTranslating(false);

    addArticle({ ...formData, slug, i18n });

    setFormData(emptyForm);
    setShowForm(false);
    setEditingId(null);
    showNotification(t("admin.articles.created"));
  };

  const handleEditArticle = (article: Article) => {
    setFormData({
      title: article.title,
      slug: article.slug,
      content: article.content,
      excerpt: article.excerpt,
      image: article.image,
      author: article.author,
      category: article.category,
      tags: article.tags,
      published: article.published,
    });
    setEditingId(article.id);
    setShowForm(true);
  };

  const handleUpdateArticle = async () => {
    if (!editingId) return;

    setTranslating(true);
    showNotification(t("admin.articles.translating"));
    const i18n = await buildArticleI18n(formData);
    setTranslating(false);

    updateArticle(editingId, { ...formData, i18n });
    setFormData(emptyForm);
    setShowForm(false);
    setEditingId(null);
    showNotification(t("admin.articles.updated"));
  };

  const handleDeleteArticle = (id: string) => {
    if (confirm(t("admin.articles.delete_confirm"))) {
      deleteArticle(id);
      showNotification(t("admin.articles.deleted"));
    }
  };

  const handleTogglePublish = (id: string, currentState: boolean) => {
    updateArticle(id, { published: !currentState });
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setShowForm(false);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">
              {t("admin.articles")}
            </h1>
            <p className="text-muted-foreground">
              {t("admin.articles.page_subtitle")}
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
            {showForm ? t("admin.common.cancel") : t("admin.articles.new")}
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
                ? t("admin.articles.edit_title")
                : t("admin.articles.create_title")}
            </h2>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("admin.articles.title_label")}
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder={t("admin.articles.title_placeholder")}
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("admin.articles.slug_label")}
                </label>
                <Input
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder={t("admin.articles.slug_placeholder")}
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("admin.articles.excerpt_label")}
                </label>
                <Input
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  placeholder={t("admin.articles.excerpt_placeholder")}
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("admin.articles.content_label")}
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder={t("admin.articles.content_placeholder")}
                  className="w-full h-40 p-3 rounded-lg bg-white/5 border border-border/40 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("admin.articles.category_label")}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full p-3 rounded-lg bg-white/5 border border-border/40 text-foreground focus:outline-none focus:border-primary/50 [&>option]:bg-slate-900 [&>option]:text-slate-100"
                >
                  <option>Personality</option>
                  <option>Intelligence</option>
                  <option>Career</option>
                  <option>Psychology</option>
                  <option>Lifestyle</option>
                </select>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("admin.articles.image_label")}
                </label>
                <Input
                  value={formData.image || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Published Toggle */}
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
                  {t("admin.articles.publish_immediately")}
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={resetForm}>
                  {t("admin.common.cancel")}
                </Button>
                <Button
                  disabled={translating}
                  onClick={editingId ? handleUpdateArticle : handleAddArticle}
                >
                  {translating
                    ? t("admin.articles.translating")
                    : editingId
                      ? t("admin.articles.update")
                      : t("admin.articles.create")}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Articles List */}
        <div className="space-y-4">
          {articles.length === 0 ? (
            <Card className="glass-card p-8 text-center">
              <p className="text-muted-foreground">
                {t("admin.articles.no_articles")}
              </p>
            </Card>
          ) : (
            articles.map((article) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="glass-card p-5 flex items-center gap-4 hover:border-primary/50 transition-colors">
                  {article.image && (
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg truncate">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {article.category} • {article.views}{" "}
                      {t("admin.articles.views_unit")}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() =>
                        handleTogglePublish(article.id, article.published)
                      }
                      title={
                        article.published
                          ? t("admin.quizzes.unpublish_btn")
                          : t("admin.quizzes.publish_btn")
                      }
                    >
                      {article.published ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleEditArticle(article)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDeleteArticle(article.id)}
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
      </div>
    </div>
  );
}
