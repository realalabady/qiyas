import { useState, useRef } from "react";
import { useTheme } from "@/stores/theme-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Upload, RotateCcw, Save } from "lucide-react";

export function AdminSettingsPage() {
  const { theme, updateTheme, resetTheme, applyTheme } = useTheme();
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
        showNotification("Logo updated successfully");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Failed to upload logo:", error);
      showNotification("Failed to upload logo");
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
        showNotification("Favicon updated successfully");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Failed to upload favicon:", error);
      showNotification("Failed to upload favicon");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // Apply theme to DOM
      applyTheme();
      showNotification("Settings saved successfully");
    } catch (error) {
      console.error("Failed to save settings:", error);
      showNotification("Failed to save settings");
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
            Website Settings
          </h1>
          <p className="text-muted-foreground">
            Customize your website appearance and branding
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
          <h2 className="text-xl font-bold mb-4">Color Scheme</h2>

          <div className="grid grid-cols-2 gap-6">
            {/* Primary Color */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Primary Color
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
                Accent Color
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
            <p className="text-sm font-medium mb-3">Preview</p>
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
          <h2 className="text-xl font-bold mb-4">Branding</h2>

          {/* Logo Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">
              Website Logo
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
              Upload Logo
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
            <label className="block text-sm font-medium mb-3">Favicon</label>
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
              Upload Favicon
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
            Reset to Default
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="gap-2 ml-auto"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
