import { useState } from "react";
import { useArticles } from "@/stores/articles-store";
import type { Article } from "@/data/seed-articles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react";

export function AdminArticlesPage() {
  const { articles, addArticle, updateArticle, deleteArticle } = useArticles();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const [formData, setFormData] = useState<
    Omit<Article, "id" | "createdAt" | "updatedAt" | "views">
  >({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    image: null,
    author: "Admin",
    category: "Personality",
    tags: [],
    published: false,
  });

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddArticle = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      showNotification("Title and content are required");
      return;
    }

    const slug =
      formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-");
    addArticle({
      ...formData,
      slug,
    });

    setFormData({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      image: null,
      author: "Admin",
      category: "Personality",
      tags: [],
      published: false,
    });
    setShowForm(false);
    setEditingId(null);
    showNotification("Article created successfully");
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

  const handleUpdateArticle = () => {
    if (!editingId) return;

    updateArticle(editingId, formData);
    setFormData({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      image: null,
      author: "Admin",
      category: "Personality",
      tags: [],
      published: false,
    });
    setShowForm(false);
    setEditingId(null);
    showNotification("Article updated successfully");
  };

  const handleDeleteArticle = (id: string) => {
    if (confirm("Are you sure you want to delete this article?")) {
      deleteArticle(id);
      showNotification("Article deleted successfully");
    }
  };

  const handleTogglePublish = (id: string, currentState: boolean) => {
    updateArticle(id, { published: !currentState });
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">
              Manage Articles
            </h1>
            <p className="text-muted-foreground">
              Create, edit, and manage articles for your platform
            </p>
          </div>
          <Button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              if (showForm) {
                setFormData({
                  title: "",
                  slug: "",
                  content: "",
                  excerpt: "",
                  image: null,
                  author: "Admin",
                  category: "Personality",
                  tags: [],
                  published: false,
                });
              }
            }}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            {showForm ? "Cancel" : "New Article"}
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
              {editingId ? "Edit Article" : "Create New Article"}
            </h2>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Article title"
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
                  placeholder="auto-generated-slug (auto-generated if empty)"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Excerpt
                </label>
                <Input
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  placeholder="Brief summary of the article"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Article content..."
                  className="w-full h-40 p-3 rounded-lg bg-white/5 border border-border/40 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
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
                  Image URL
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
                  Publish immediately
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({
                      title: "",
                      slug: "",
                      content: "",
                      excerpt: "",
                      image: null,
                      author: "Admin",
                      category: "Personality",
                      tags: [],
                      published: false,
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={editingId ? handleUpdateArticle : handleAddArticle}
                >
                  {editingId ? "Update Article" : "Create Article"}
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
                No articles yet. Create one to get started!
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
                  {/* Image */}
                  {article.image && (
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg truncate">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {article.category} • {article.views} views
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() =>
                        handleTogglePublish(article.id, article.published)
                      }
                      title={article.published ? "Unpublish" : "Publish"}
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
