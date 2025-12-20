"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Upload, Play, Loader2, Trash2 } from "lucide-react";
import {
  handleDeleteVideoId,
  handleUpLoadVideo,
} from "@/services/courseService";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { formatDurationVi } from "@/lib/utils";
import { VideoAsset } from "@/types/course/course";

interface VideoUploaderProps {
  lessonId: string;
  onUploadComplete: (data: VideoAsset) => void;
  currentVideoData: VideoAsset | null;
  onDelete: () => void;
}

export function VideoUploader({
  lessonId,
  onUploadComplete,
  currentVideoData,
  onDelete,
}: VideoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState<
    "uploading" | "processing" | "done"
  >("uploading");
  const videoRef = useRef<HTMLVideoElement>(null);

  const [videoUrl, setVideoUrl] = useState<string | null>(
    currentVideoData?.originalUrl || null
  );

  useEffect(() => {
    setVideoUrl(currentVideoData?.originalUrl || null);
  }, [currentVideoData]);

  const handleDeleteVideo = async () => {
    if (!currentVideoData) return;
    const isConfirm = window.confirm("Bạn có chắc chắn muốn xóa video này?");
    if (!isConfirm) return;
    const deleteToastId = toast.loading("Đang xóa video...");
    try {
      await handleDeleteVideoId(currentVideoData.id);
      setVideoUrl(null);
      onDelete();
      toast.success("Xóa video thành công!", { id: deleteToastId });
    } catch (error) {
      console.error("Lỗi khi xóa video:", error);
      toast.error("Xóa video thất bại, vui lòng thử lại!", {
        id: deleteToastId,
      });
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setProgress(0);
    setProcessingStage("uploading");
    e.target.value = "";
    const loadingToastId = toast.loading("Đang tải video lên...");
    try {
      const response = await handleUpLoadVideo(
        file,
        lessonId,
        (percent: number) => {
          setProgress(percent);
          if (percent >= 90 && processingStage === "uploading") {
            setProcessingStage("processing");
            toast.loading("Đang xử lý video ...", {
              id: loadingToastId,
            });
          }
        }
      );

      console.log("response: ", response);
      const videoData: VideoAsset = response;

      setVideoUrl(videoData.originalUrl);
      setProcessingStage("done");
      onUploadComplete(videoData);
      toast.success("Tải video bài học thành công!", { id: loadingToastId });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Lỗi không xác định. Vui lòng kiểm tra định dạng hoặc kết nối.";
      console.error("Lỗi khi tải video:", error);
      toast.error(`Tải video thất bại. Chi tiết: ${errorMessage}`, {
        id: loadingToastId,
      });
    } finally {
      setUploading(false);
      setProgress(0);
      setProcessingStage("uploading");
    }
  };

  const uploadText = uploading
    ? processingStage === "processing"
      ? `Đang xử lý video... ${Math.floor(progress)}%`
      : `Đang tải lên... ${Math.floor(progress)}%`
    : videoUrl
    ? "Đã có video. Chọn file khác để thay thế"
    : "Chọn video hoặc kéo thả";

  const progressBarClass = uploading
    ? "absolute bottom-0 left-0 h-1 bg-primary rounded-bl-lg transition-all duration-300"
    : "hidden";

  const defaultAspectRatio = 16 / 9; // Fallback an toàn (16:9)
  const videoAspectRatio =
    currentVideoData &&
    currentVideoData.widthOriginal > 0 &&
    currentVideoData.heightOriginal > 0
      ? currentVideoData.widthOriginal / currentVideoData.heightOriginal
      : defaultAspectRatio;

  const isPortrait =
    currentVideoData &&
    currentVideoData.widthOriginal < currentVideoData.heightOriginal;

  return (
    <div className="space-y-3">
      {videoUrl && currentVideoData && (
        <div className="bg-muted rounded-lg p-4">
          <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
            <span className="text-sm font-medium text-primary flex items-center gap-2">
              <Play className="h-4 w-4" /> Thời lượng:{" "}
              {formatDurationVi(currentVideoData.duration)}
            </span>
          </div>

          <div
            // ✅ Áp dụng class Tailwind cho video Dọc

            className={`w-full rounded-lg overflow-hidden bg-black mx-auto ${
              isPortrait ? "max-w-xs" : ""
            }`}
            style={{
              aspectRatio: videoAspectRatio,

              maxHeight: "400px",
            }}
          >
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              className="w-full h-full object-cover"
              controlsList="nodownload noplaybackrate"
              disablePictureInPicture
              preload="metadata"
              key={videoUrl}
            />
          </div>

          <div className="mt-3 text-right">
            <Button
              className="cursor-pointer"
              variant="destructive"
              size="sm"
              onClick={handleDeleteVideo}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Xóa Video
            </Button>
          </div>
        </div>
      )}

      {!currentVideoData && (
        <label
          className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors relative overflow-hidden 

      ${uploading ? "bg-accent/50 cursor-not-allowed" : "hover:bg-accent/50"}`}
        >
          <div className="flex items-center gap-2 p-1">
            {uploading ? (
              <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
            ) : (
              <Upload className="h-4 w-4 text-muted-foreground" />
            )}

            <span className="text-sm text-muted-foreground font-medium">
              {uploadText}
            </span>
          </div>

          <input
            type="file"
            accept="video/mp4,video/webm,video/ogg"
            onChange={handleVideoUpload}
            disabled={uploading}
            className="hidden"
          />

          {uploading && (
            <div
              className={progressBarClass}
              style={{ width: `${progress}%` }}
            />
          )}
        </label>
      )}
    </div>
  );
}
