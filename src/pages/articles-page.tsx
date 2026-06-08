import { useMemo } from "react";
import { useArticles } from "@/stores/articles-store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Search, ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function ArticlesPage() {
  const { t } = useLanguage();
  const {
    articles,
    searchQuery,
    selectedCategory,
    setSearchQuery,
    setSelectedCategory,
    getFilteredArticles,
  } = useArticles();

  const categories = useMemo(() => {
    const cats = new Set(articles.map((a) => a.category));
    return Array.from(cats);
  }, [articles]);

  const filteredArticles = getFilteredArticles();

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-bold gradient-text mb-4">
              {t("articles.title")}
            </h1>
            <p className="text-xl text-muted-foreground">
              Explore insights and tips about personality, psychology, and
              personal development
            </p>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              size="sm"
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="glass-card h-full flex flex-col overflow-hidden hover:border-primary/50 transition-colors cursor-pointer group">
                  {/* Image */}
                  {article.image && (
                    <div className="overflow-hidden h-40 bg-gradient-to-br from-primary/20 to-accent/20">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    {/* Category */}
                    <div className="mb-3">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-primary/20 text-primary">
                        {article.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                      {article.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{article.author}</span>
                      <span>{article.views.toLocaleString()} views</span>
                    </div>

                    {/* Read More */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-4 gap-2 justify-start -ml-3 group/btn"
                    >
                      {t("articles.read_more")}
                      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="glass-card p-12 text-center">
            <p className="text-muted-foreground text-lg">
              No articles found matching your search
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
