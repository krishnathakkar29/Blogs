"use client";

import type React from "react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Upload, ImageIcon, Loader2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { s3Upload } from "@/lib/s3";

interface UploadedImage {
  url: string;
  filename: string;
  altText?: string;
  size: number;
}

interface ImageUploadProps {
  onInsert: (imageUrl: string, altText: string) => void;
  onCancel: () => void;
  blogId?: string;
}

export function ImageUpload({ onInsert, onCancel, blogId }: ImageUploadProps) {
  const [altText, setAltText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(
    null
  );
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);

    try {
      for (const file of files) {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image file`);
          continue;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large (max 5MB)`);
          continue;
        }
        console.log("Uploading file to S3:", file);
        const data = await s3Upload(file);
        console.log("Upload response:", data);
        if (!data?.fileName || !data.fileName) {
          toast.error("Something went wrong");
          return;
        }

        const newImage: UploadedImage = {
          url: data.url,
          filename: file.name,
          size: file.size,
        };

        setUploadedImages((prev) => [...prev, newImage]);
        toast.success(`${file.name} uploaded successfully`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload images");
    } finally {
      setIsUploading(false);
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      toast.success("URL copied to clipboard");
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      toast.error("Failed to copy URL");
    }
  };

  const handleInsert = () => {
    if (!selectedImage) {
      toast.error("Please select an image first");
      return;
    }
    onInsert(
      selectedImage.url,
      altText || selectedImage.filename.replace(/\.[^/.]+$/, "")
    );
  };

  return (
    <div className="space-y-4 p-4 border border-zinc-800 rounded-md bg-zinc-900/50">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Add Images</h3>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Upload Section */}
      <div className="space-y-4">
        <div className="border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center">
          <ImageIcon className="h-12 w-12 mx-auto text-zinc-500 mb-4" />
          <p className="text-sm text-zinc-400 mb-4">Upload images to S3</p>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Select Images
              </>
            )}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
        <p className="text-xs text-zinc-500">
          Supported: JPG, PNG, GIF, WebP (Max 5MB each)
        </p>
      </div>


      {uploadedImages.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Uploaded Images</h4>
          <div className="grid grid-cols-2 gap-4 max-h-64 overflow-y-auto">
            {uploadedImages.map((image, index) => (
              <div
                key={index}
                className={`relative border rounded-lg overflow-hidden cursor-pointer transition-all ${
                  selectedImage?.url === image.url
                    ? "border-blue-500 ring-2 ring-blue-500/20"
                    : "border-zinc-700 hover:border-zinc-600"
                }`}
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image.url || "/placeholder.svg?height=96&width=96"}
                  alt={image.filename}
                  className="w-full h-24 object-cover"
                />
                <div className="p-2 bg-zinc-900">
                  <p className="text-xs text-zinc-400 truncate">
                    {image.filename}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-zinc-500">
                      {(image.size / 1024).toFixed(1)}KB
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(image.url);
                      }}
                    >
                      {copiedUrl === image.url ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Image Actions */}
      {selectedImage && (
        <div className="space-y-4 p-4 border border-zinc-700 rounded-lg bg-zinc-800/50">
          <div className="flex items-center gap-4">
            <img
              src={selectedImage.url || "/placeholder.svg?height=64&width=64"}
              alt={selectedImage.filename}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <p className="text-sm font-medium">{selectedImage.filename}</p>
              <p className="text-xs text-zinc-400 break-all">
                {selectedImage.url}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="altText">Alt Text (for accessibility)</Label>
            <Input
              id="altText"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Describe the image..."
              className="bg-zinc-900 border-zinc-800"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleInsert}>Insert Image</Button>
          </div>
        </div>
      )}
    </div>
  );
}
