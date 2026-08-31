import { useState, useRef, type ChangeEvent, type DragEvent } from "react";
import { UploadCloud, Image as ImageIcon, Link as LinkIcon, X, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

const PRESET_IMAGES = [
  {
    name: "Air Conditioner",
    url: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Smart TV",
    url: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Solar & Inverter",
    url: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "CCTV Camera",
    url: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Water Pump",
    url: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Electrical Cables",
    url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Technician & Tools",
    url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Smart Lock",
    url: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
  },
];

/**
 * Compresses an image file client-side using HTML5 Canvas to keep storage lightweight.
 */
function compressImage(file: File, maxDim = 1000, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function ImageUploadField({
  value,
  onChange,
  label = "Product Image",
  className = "",
}: ImageUploadProps) {
  const [mode, setMode] = useState<"upload" | "url" | "presets">("upload");
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setIsProcessing(true);
    try {
      const compressed = await compressImage(file);
      onChange(compressed);
    } catch (err) {
      console.error("Image compression error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-muted-foreground uppercase">
          {label}
        </label>
        <div className="flex rounded-lg border border-border/80 p-0.5 text-xs bg-secondary/50">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`flex items-center gap-1 rounded-md px-2 py-0.5 font-medium transition-colors ${
              mode === "upload" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <UploadCloud className="size-3" /> Upload
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`flex items-center gap-1 rounded-md px-2 py-0.5 font-medium transition-colors ${
              mode === "url" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LinkIcon className="size-3" /> URL
          </button>
          <button
            type="button"
            onClick={() => setMode("presets")}
            className={`flex items-center gap-1 rounded-md px-2 py-0.5 font-medium transition-colors ${
              mode === "presets" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="size-3" /> Presets
          </button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileInputChange}
        className="hidden"
      />

      {/* Live preview if image exists */}
      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-border bg-secondary/20 p-2">
          <div className="flex items-center gap-3">
            <div className="relative size-20 shrink-0 overflow-hidden rounded-lg border border-border bg-card">
              <img
                src={value}
                alt="Uploaded preview"
                className="size-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <p className="text-xs font-medium truncate text-foreground">
                {value.startsWith("data:") ? "Uploaded Image (Optimized)" : value}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {value.startsWith("data:")
                  ? `Base64 Data (~${Math.round((value.length * 3) / 4 / 1024)} KB)`
                  : "External Web URL"}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 px-2.5 text-xs"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadCloud className="mr-1 size-3" /> Change
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2.5 text-xs text-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={() => onChange("")}
                >
                  <X className="mr-1 size-3" /> Remove
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Upload input panels */
        <div>
          {mode === "upload" && (
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-primary bg-primary/5 scale-[1.01]"
                  : "border-border hover:border-primary/50 hover:bg-secondary/40"
              }`}
            >
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
                <UploadCloud className="size-5" />
              </div>
              <p className="text-sm font-semibold">
                {isProcessing ? "Optimizing image..." : "Click to browse or drag & drop"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                PNG, JPG, WebP, GIF up to 10MB (automatically optimized)
              </p>
            </div>
          )}

          {mode === "url" && (
            <div className="space-y-1.5">
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <p className="text-[11px] text-muted-foreground">
                Paste any publicly accessible image web URL.
              </p>
            </div>
          )}

          {mode === "presets" && (
            <div className="grid grid-cols-4 gap-2">
              {PRESET_IMAGES.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => onChange(preset.url)}
                  className="group relative flex flex-col items-center overflow-hidden rounded-lg border border-border bg-card p-1.5 text-left transition-all hover:border-primary hover:shadow-xs"
                >
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="h-14 w-full rounded object-cover"
                  />
                  <span className="mt-1 block w-full truncate text-[10px] font-medium text-foreground text-center">
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
