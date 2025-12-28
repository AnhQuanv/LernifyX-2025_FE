"use client";

import type React from "react";
import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, ImageIcon, X, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { handleUpLoadImage } from "@/services/courseService";
import toast from "react-hot-toast";

interface ImageUploaderProps {
  onUploadComplete?: (imageUrl: string) => void;
  title?: string;
  description?: string;
  currentImageUrl?: string;
}

export function ImageUploader({
  onUploadComplete,
  title = "Upload Hình Ảnh",
  description = "Chọn hình ảnh đại diện cho khóa học (JPG, PNG)",
  currentImageUrl,
}: ImageUploaderProps) {
  const [uploadedImage, setUploadedImage] = useState<{
    file: File;
    preview: string;
  } | null>(null);

  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayImageUrl = uploadedImage?.preview || currentImageUrl;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setUploadedImage(null);
      setUploadProgress(0);
      setIsUploading(true);

      const loadingToastId = toast.loading("Đang tải ảnh lên...");

      try {
        const res = await handleUpLoadImage(file, setUploadProgress);
        const uploadedUrl = res;

        setIsUploading(false);
        setUploadProgress(100);
        setUploadedImage({ file, preview: uploadedUrl });

        onUploadComplete?.(uploadedUrl);

        toast.success("Tải ảnh lên thành công!", {
          id: loadingToastId,
        });
      } catch (err) {
        console.error("Upload failed", err);
        setIsUploading(false);
        setUploadProgress(0);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        toast.error("Tải ảnh thất bại, thử lại!", {
          id: loadingToastId,
        });
      }
    }
  };

  const handleRemove = () => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage.preview);
    }
    setUploadedImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (displayImageUrl && !uploadedImage) {
      onUploadComplete?.("");
      toast.success("Đã xóa hình ảnh đã lưu.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {isUploading && (
          <div className="p-4 border rounded-lg">
            <p className="font-semibold text-center mb-2">
              Đang Tải Lên... ({uploadProgress}%)
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {!isUploading && !displayImageUrl && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
          >
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="font-semibold text-foreground">
              Nhấp để chọn hình ảnh
            </p>
            <p className="text-sm text-muted-foreground">
              hoặc kéo thả hình ảnh vào đây
            </p>
          </div>
        )}

        {displayImageUrl && (
          <div className="space-y-4">
            <div className="relative w-full h-52 overflow-hidden rounded-2xl group">
              <Image
                src={displayImageUrl}
                alt="Preview"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Button variant="secondary" size="sm" onClick={handleRemove}>
                  <X className="h-4 w-4 mr-2" /> Xóa
                </Button>
              </div>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-semibold text-green-900">
                  {uploadedImage ? "Tải lên thành công" : "Hình ảnh đã lưu"}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full cursor-pointer"
            >
              Chọn Hình Ảnh Khác
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
