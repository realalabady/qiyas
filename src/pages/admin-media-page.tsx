import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Upload, Trash2, Copy, Download } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface MediaFile {
  id: string;
  name: string;
  url: string;
  size: number;
  uploadedAt: Date;
  type: "image" | "video";
}

export function AdminMediaPage() {
  const { t, language } = useLanguage();
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([
    {
      id: "media-1",
      name: "personality-quiz-hero.jpg",
      url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
      size: 245000,
      uploadedAt: new Date(),
      type: "image",
    },
    {
      id: "media-2",
      name: "iq-test-banner.jpg",
      url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
      size: 189000,
      uploadedAt: new Date(),
      type: "image",
    },
  ]);

  const [notification, setNotification] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);

    for (const file of files) {
      try {
        // Create a data URL for preview (in production, upload to Firebase Storage)
        const reader = new FileReader();
        reader.onload = (event) => {
          const newFile: MediaFile = {
            id: `media-${Date.now()}`,
            name: file.name,
            url: event.target?.result as string,
            size: file.size,
            uploadedAt: new Date(),
            type: file.type.startsWith("image") ? "image" : "video",
          };
          setMediaFiles((prev) => [newFile, ...prev]);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Upload error:", error);
      }
    }

    setUploading(false);
    showNotification(t("admin.media.upload_success"));
    e.target.value = "";
  };

  const handleDelete = (id: string) => {
    if (confirm(t("admin.media.delete_confirm"))) {
      setMediaFiles((prev) => prev.filter((f) => f.id !== id));
      showNotification(t("admin.media.file_deleted"));
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    showNotification(t("admin.media.url_copied"));
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(language === "ar" ? "ar" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            {t("admin.media.page_title")}
          </h1>
          <p className="text-muted-foreground">
            {t("admin.media.page_subtitle")}
          </p>
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

        {/* Upload Area */}
        <Card className="glass-card p-8 mb-8">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="p-4 rounded-xl bg-primary/10">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-lg mb-1">{t("admin.media.upload_files")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("admin.media.upload_hint")}
              </p>
            </div>
            <label htmlFor="file-upload" className="cursor-pointer">
              <Button asChild disabled={uploading}>
                <span>
                  {uploading ? t("admin.media.uploading") : t("admin.media.select_files")}
                </span>
              </Button>
              <input
                id="file-upload"
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleUpload}
                className="hidden"
              />
            </label>
            <p className="text-xs text-muted-foreground/60">
              {t("admin.media.max_size")}
            </p>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="glass-card p-4 text-center">
            <p className="text-2xl font-bold gradient-text">
              {mediaFiles.length}
            </p>
            <p className="text-sm text-muted-foreground">{t("admin.media.total_files")}</p>
          </Card>
          <Card className="glass-card p-4 text-center">
            <p className="text-2xl font-bold gradient-text">
              {mediaFiles.filter((f) => f.type === "image").length}
            </p>
            <p className="text-sm text-muted-foreground">{t("admin.media.images")}</p>
          </Card>
          <Card className="glass-card p-4 text-center">
            <p className="text-2xl font-bold gradient-text">
              {formatSize(mediaFiles.reduce((sum, f) => sum + f.size, 0))}
            </p>
            <p className="text-sm text-muted-foreground">{t("admin.media.total_size")}</p>
          </Card>
        </div>

        {/* Media Grid */}
        {mediaFiles.length === 0 ? (
          <Card className="glass-card p-12 text-center">
            <p className="text-muted-foreground">{t("admin.media.no_files")}</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mediaFiles.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="glass-card overflow-hidden hover:border-primary/50 transition-colors group">
                  {/* Preview */}
                  <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
                    {file.type === "image" ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <video
                        src={file.url}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-sm truncate mb-2">
                      {file.name}
                    </h3>
                    <div className="space-y-1 text-xs text-muted-foreground mb-4">
                      <p>{formatSize(file.size)}</p>
                      <p>{formatDate(file.uploadedAt)}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleCopyUrl(file.url)}
                        className="flex-1"
                        title={t("admin.media.copy_url")}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        asChild
                        className="flex-1"
                      >
                        <a href={file.url} download title={t("admin.media.download")}>
                          <Download className="w-4 h-4" />
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(file.id)}
                        className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                        title={t("admin.media.delete")}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
