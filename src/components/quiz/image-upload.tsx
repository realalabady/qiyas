import { useState } from "react";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  label?: string;
}

export function ImageUpload({
  value,
  onChange,
  placeholder = "Upload an image",
  label = "Image",
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(value);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setPreview(dataUrl);
      onChange(dataUrl);
      setIsLoading(false);
    };
    reader.onerror = () => {
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    setPreview("");
    onChange("");
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>

      <div className="space-y-3">
        {/* Preview */}
        {preview && (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border/40 bg-white/5">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              onClick={handleClear}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/80 hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        )}

        {/* Upload Area */}
        <label className="flex flex-col items-center justify-center w-full p-6 rounded-lg border-2 border-dashed border-border/40 hover:border-primary/50 transition-colors cursor-pointer bg-white/2 hover:bg-white/5">
          <div className="flex flex-col items-center justify-center gap-2">
            <Upload className="w-6 h-6 text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                {isLoading ? "Uploading..." : placeholder}
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, GIF (max 5MB)
              </p>
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isLoading}
            className="hidden"
          />
        </label>

        {/* URL Input Alternative */}
        <div className="relative">
          <input
            type="text"
            value={preview}
            onChange={(e) => {
              setPreview(e.target.value);
              onChange(e.target.value);
            }}
            placeholder="Or paste image URL"
            className="w-full p-3 rounded-lg bg-white/5 border border-border/40 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 text-sm"
          />
          {preview && (
            <button
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
