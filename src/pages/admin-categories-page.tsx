import { useState } from "react";
import { useCategories } from "@/stores/categories-store";
import type { CategoryType } from "@/stores/categories-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const ICON_OPTIONS = [
  "🧠",
  "🎓",
  "🎬",
  "❤️",
  "⚽",
  "🎨",
  "📚",
  "🎮",
  "💼",
  "🏥",
  "🎭",
  "🌟",
  "🚀",
  "💡",
  "🎯",
  "🏆",
];

export function AdminCategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } =
    useCategories();
  const { t } = useLanguage();

  const [kind, setKind] = useState<CategoryType>("quiz");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Categories shown for the active tab (quiz vs article).
  const visibleCategories = categories.filter((c) => c.type === kind);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    icon: "🧠",
    description: "",
    color: "#ec4899",
  });

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddCategory = () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      showNotification(t("admin.categories.name_desc_required"));
      return;
    }

    const slug =
      formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-");

    addCategory({
      name: formData.name,
      slug,
      icon: formData.icon,
      description: formData.description,
      color: formData.color,
      type: kind,
    });

    resetForm();
    showNotification(t("admin.categories.created"));
  };

  const handleEditCategory = (id: string) => {
    const category = categories.find((c) => c.id === id);
    if (!category) return;

    setKind(category.type);
    setFormData({
      name: category.name,
      slug: category.slug,
      icon: category.icon,
      description: category.description,
      color: category.color,
    });
    setEditingId(id);
    setShowForm(true);
  };

  const handleUpdateCategory = () => {
    if (!editingId) return;
    if (!formData.name.trim() || !formData.description.trim()) {
      showNotification(t("admin.categories.name_desc_required"));
      return;
    }

    updateCategory(editingId, {
      name: formData.name,
      slug: formData.slug,
      icon: formData.icon,
      description: formData.description,
      color: formData.color,
      type: kind,
    });

    resetForm();
    showNotification(t("admin.categories.updated"));
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm(t("admin.categories.delete_confirm"))) {
      deleteCategory(id);
      showNotification(t("admin.categories.deleted"));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      icon: "🧠",
      description: "",
      color: "#ec4899",
    });
    setShowForm(false);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">
              {t("admin.categories.page_title")}
            </h1>
            <p className="text-muted-foreground">
              {t("admin.categories.page_subtitle")}
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
            {showForm ? t("admin.common.cancel") : t("admin.categories.new")}
          </Button>
        </div>

        {/* Quiz / Article tabs */}
        <div className="mb-6 inline-flex rounded-lg border border-border/50 bg-white/5 p-1">
          {(["quiz", "article"] as const).map((value) => (
            <button
              key={value}
              onClick={() => {
                setKind(value);
                if (showForm && !editingId) resetForm();
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                kind === value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {value === "quiz"
                ? t("admin.categories.tab_quizzes")
                : t("admin.categories.tab_articles")}
            </button>
          ))}
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
                ? t("admin.categories.edit_title")
                : t("admin.categories.create_title")}
            </h2>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("admin.categories.name_label")}
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder={t("admin.categories.name_placeholder")}
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("admin.categories.slug_label")}
                </label>
                <Input
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder={t("admin.categories.slug_placeholder")}
                />
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("admin.categories.icon_label")}
                </label>
                <div className="flex gap-2 flex-wrap">
                  {ICON_OPTIONS.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`text-2xl p-2 rounded-lg transition-all ${
                        formData.icon === icon
                          ? "bg-primary/20 ring-2 ring-primary"
                          : "hover:bg-white/5"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("admin.categories.color_label")}
                </label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    className="w-16 h-10 rounded-lg cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    className="flex-1 font-mono text-xs"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("admin.categories.description_label")}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder={t("admin.categories.description_placeholder")}
                  className="w-full h-20 p-3 rounded-lg bg-white/5 border border-border/40 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={resetForm}>
                  {t("admin.common.cancel")}
                </Button>
                <Button
                  onClick={editingId ? handleUpdateCategory : handleAddCategory}
                >
                  {editingId
                    ? t("admin.categories.update")
                    : t("admin.categories.create")}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Categories Grid */}
        {visibleCategories.length === 0 && !showForm && (
          <Card className="glass-card p-8 text-center text-muted-foreground">
            {kind === "quiz"
              ? t("admin.categories.tab_quizzes")
              : t("admin.categories.tab_articles")}{" "}
            — 0
          </Card>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleCategories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card
                className="glass-card p-6 hover:border-primary/50 transition-colors"
                style={{
                  borderLeftColor: category.color,
                  borderLeftWidth: "4px",
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl">{category.icon}</div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleEditCategory(category.id)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <h3 className="font-bold text-lg mb-2">{category.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
                <p className="text-xs text-muted-foreground/60 mt-3">
                  {category.slug}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
