import { useState, useRef } from "react";
import { useTheme } from "@/stores/theme-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Upload, RotateCcw, Save } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function AdminSettingsPage() {
  const { theme, updateTheme, resetTheme, applyTheme } = useTheme();
  const { t } = useLanguage();
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleColorChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "primaryColor" | "accentColor",
  ) => {
    updateTheme({ [type]: e.target.value });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsSaving(true);
      // TODO: Upload to Firebase Storage
      // For now, create a data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        updateTheme({ logo: dataUrl });
        showNotification(t("admin.settings.logo_updated"));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Failed to upload logo:", error);
      showNotification(t("admin.settings.logo_upload_failed"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleFaviconUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsSaving(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        updateTheme({ favicon: dataUrl });
        showNotification(t("admin.settings.favicon_updated"));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Failed to upload favicon:", error);
      showNotification(t("admin.settings.favicon_upload_failed"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // Apply theme to DOM
      applyTheme();
      showNotification(t("admin.settings.saved"));
    } catch (error) {
      console.error("Failed to save settings:", error);
      showNotification(t("admin.settings.save_failed"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            {t("admin.settings.page_title")}
          </h1>
          <p className="text-muted-foreground">
            {t("admin.settings.page_subtitle")}
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

        {/* Color Settings */}
        <Card className="p-6 mb-6 glass-card">
          <h2 className="text-xl font-bold mb-4">{t("admin.settings.color_scheme")}</h2>

          <div className="grid grid-cols-2 gap-6">
            {/* Primary Color */}
            <div>
              <label className="block text-sm font-medium mb-3">
                {t("admin.settings.primary_color")}
              </label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={theme.primaryColor}
                  onChange={(e) => handleColorChange(e, "primaryColor")}
                  className="w-16 h-10 rounded-lg cursor-pointer"
                />
                <Input
                  type="text"
                  value={theme.primaryColor}
                  onChange={(e) =>
                    updateTheme({ primaryColor: e.target.value })
                  }
                  className="flex-1 font-mono text-xs"
                />
              </div>
            </div>

            {/* Accent Color */}
            <div>
              <label className="block text-sm font-medium mb-3">
                {t("admin.settings.accent_color")}
              </label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={theme.accentColor}
                  onChange={(e) => handleColorChange(e, "accentColor")}
                  className="w-16 h-10 rounded-lg cursor-pointer"
                />
                <Input
                  type="text"
                  value={theme.accentColor}
                  onChange={(e) => updateTheme({ accentColor: e.target.value })}
                  className="flex-1 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm font-medium mb-3">{t("admin.settings.preview")}</p>
            <div className="flex gap-2">
              <div
                className="w-24 h-24 rounded-lg"
                style={{ backgroundColor: theme.primaryColor }}
              />
              <div
                className="w-24 h-24 rounded-lg"
                style={{ backgroundColor: theme.accentColor }}
              />
            </div>
          </div>
        </Card>

        {/* Logo Settings */}
        <Card className="p-6 mb-6 glass-card">
          <h2 className="text-xl font-bold mb-4">{t("admin.settings.branding")}</h2>

          {/* Logo Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">
              {t("admin.settings.website_logo")}
            </label>
            {theme.logo && (
              <div className="mb-4">
                <img
                  src={theme.logo}
                  alt="logo preview"
                  className="max-h-20 rounded-lg"
                />
              </div>
            )}
            <Button
              variant="outline"
              onClick={() => logoInputRef.current?.click()}
              disabled={isSaving}
              className="gap-2"
            >
              <Upload className="w-4 h-4" />
              {t("admin.settings.upload_logo")}
            </Button>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </div>

          {/* Favicon Upload */}
          <div>
            <label className="block text-sm font-medium mb-3">{t("admin.settings.favicon")}</label>
            {theme.favicon && (
              <div className="mb-4">
                <img
                  src={theme.favicon}
                  alt="favicon preview"
                  className="w-8 h-8 rounded"
                />
              </div>
            )}
            <Button
              variant="outline"
              onClick={() => faviconInputRef.current?.click()}
              disabled={isSaving}
              className="gap-2"
            >
              <Upload className="w-4 h-4" />
              {t("admin.settings.upload_favicon")}
            </Button>
            <input
              ref={faviconInputRef}
              type="file"
              accept="image/*"
              onChange={handleFaviconUpload}
              className="hidden"
            />
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={resetTheme}
            disabled={isSaving}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            {t("admin.settings.reset")}
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="gap-2 ml-auto"
          >
            <Save className="w-4 h-4" />
            {isSaving ? t("admin.settings.saving") : t("admin.settings.save_changes")}
          </Button>
        </div>
      </div>
    </div>
  );
}
