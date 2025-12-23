"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Upload,
  Play,
  Loader2,
  Trash2,
  RefreshCcw,
  XCircle,
} from "lucide-react";
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
  const [isPaused, setIsPaused] = useState(false);
  const [savedFileName, setSavedFileName] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(
    currentVideoData?.originalUrl || null
  );
  const [uploadStats, setUploadStats] = useState<{
    speed: string;
    eta: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Khôi phục trạng thái khi trang web load lại (F5)
  useEffect(() => {
    const url = localStorage.getItem(`upload_url_${lessonId}`);
    const fileName = localStorage.getItem(`upload_filename_${lessonId}`);
    const savedProgress = localStorage.getItem(`upload_progress_${lessonId}`);

    if (url && !currentVideoData) {
      setIsPaused(true);
      setSavedFileName(fileName);
      if (savedProgress) setProgress(parseInt(savedProgress));
    }
    setVideoUrl(currentVideoData?.originalUrl || null);
  }, [lessonId, currentVideoData]);

  // Hàm dọn dẹp localStorage theo bài học
  const clearUploadStorage = () => {
    localStorage.removeItem(`upload_url_${lessonId}`);
    localStorage.removeItem(`upload_taskid_${lessonId}`);
    localStorage.removeItem(`upload_filename_${lessonId}`);
    localStorage.removeItem(`upload_progress_${lessonId}`);
  };

  // 2. Xử lý khi nhấn nút Hủy bỏ tiến trình cũ
  const handleCancelProgress = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      window.confirm("Bạn có chắc muốn hủy bỏ tiến trình cũ và tải file mới?")
    ) {
      clearUploadStorage();
      setIsPaused(false);
      setProgress(0);
      setSavedFileName(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // 3. Xử lý Upload chính
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // KIỂM TRA: Nếu đang dừng dở mà chọn file khác file cũ
    if (isPaused && savedFileName && file.name !== savedFileName) {
      const confirmNew = window.confirm(
        `File đang chọn (${file.name}) khác với file đang tải dở (${savedFileName}). Tải file mới từ đầu?`
      );
      if (!confirmNew) {
        e.target.value = "";
        return;
      }
      clearUploadStorage(); // Xóa sạch dấu vết file cũ trước khi bắt đầu file mới
      setProgress(0);
    }

    const savedUrl = localStorage.getItem(`upload_url_${lessonId}`);
    setUploading(true);
    setIsPaused(false);

    const tid = toast.loading(
      savedUrl ? "Đang nối lại tiến trình..." : "Bắt đầu tải lên..."
    );

    try {
      const response = await handleUpLoadVideo(
        file,
        lessonId,
        (percent, stats) => {
          setProgress((prev) => Math.max(prev, percent));
          if (stats) setUploadStats(stats);
        },
        savedUrl || undefined
      );

      const videoData = response as VideoAsset;
      setVideoUrl(videoData.originalUrl);
      onUploadComplete(videoData);
      toast.success("Tải video thành công!", { id: tid });
    } catch {
      setIsPaused(true);
      setSavedFileName(file.name);
      toast.error("Tải lên thất bại", { id: tid });
    } finally {
      setUploading(false);
      setUploadStats(null);
      if (e.target) e.target.value = "";
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Bạn muốn xóa video bài học này?")) return;

    try {
      if (currentVideoData?.id) {
        await handleDeleteVideoId(currentVideoData.id);
      }
      clearUploadStorage();
      setVideoUrl(null);
      setProgress(0);
      setIsPaused(false);
      setSavedFileName(null);
      onDelete();
      toast.success("Đã xóa video bài học");
    } catch (e) {
      console.error("Delete error:", e);
      toast.error("Lỗi khi xóa video hoặc dọn dẹp tiến trình");
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* TRƯỜNG HỢP 1: ĐÃ CÓ VIDEO */}
      {videoUrl && currentVideoData && !uploading && (
        <div className="overflow-hidden border border-emerald-100 rounded-xl bg-white shadow-sm">
          <div className="flex items-center justify-between p-3 bg-emerald-50/50">
            <span className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
              <Play className="h-3.5 w-3.5 fill-emerald-600" />
              {formatDurationVi(currentVideoData.duration)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-7 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Xóa video
            </Button>
          </div>
          <video
            src={videoUrl}
            controls
            className="w-full aspect-video bg-black"
          />
        </div>
      )}

      {/* TRƯỜNG HỢP 2: ĐANG UPLOAD HOẶC CHỜ KHÔI PHỤC */}
      {(!currentVideoData || uploading || isPaused) && (
        <div className="relative group">
          <label
            className={`
              relative flex flex-col items-center justify-center min-h-55 border-2 border-dashed rounded-xl transition-all p-8
              ${
                isPaused
                  ? "border-black-800 "
                  : "border-slate-200 bg-slate-50/50 hover:border-primary/50 hover:bg-white"
              }
              ${uploading ? "cursor-wait opacity-90" : "cursor-pointer"}
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleVideoUpload}
              disabled={uploading}
            />

            {uploading ? (
              <div className="flex flex-col items-center w-full max-w-xs space-y-4 animate-in fade-in zoom-in-95">
                <div className="relative flex items-center justify-center">
                  <Loader2 className="h-14 w-14 text-primary animate-spin" />
                  <span className="absolute text-[11px] font-black text-primary">
                    {progress}%
                  </span>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                    {progress === 100
                      ? "Đang xử lý dữ liệu..."
                      : "Đang tải video..."}
                  </p>
                  {uploadStats && progress < 100 && (
                    <div className="flex flex-col text-[10px] text-slate-500 font-medium italic animate-in fade-in duration-500">
                      <span>Tốc độ: {uploadStats.speed} Mbps</span>
                      <span>Còn lại khoảng: {uploadStats.eta}</span>
                    </div>
                  )}
                  <p className="text-[10px] text-slate-500 italic">
                    Vui lòng không đóng hoặc làm mới tab này
                  </p>
                </div>
              </div>
            ) : isPaused ? (
              <div className="flex flex-col items-center text-center space-y-4 animate-in slide-in-from-bottom-2">
                <div className="p-4 ">
                  <RefreshCcw className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold uppercase">
                    Tiến trình chưa xong
                  </h3>
                  <p className="text-[11px] px-6 leading-relaxed">
                    Video{" "}
                    <span className="font-bold underline">
                      &quot;{savedFileName}&quot;
                    </span>{" "}
                    đã tải được {progress}%.
                    <br />
                    Chọn lại file này để tiếp tục tải lên.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <span className="inline-flex items-center px-4 py-2 bg-black text-white text-[11px] font-bold rounded-lg shadow-md group-hover:bg-black-700">
                    CHỌN LẠI FILE KHÔI PHỤC
                  </span>
                  <button
                    onClick={handleCancelProgress}
                    className="flex items-center justify-center gap-1 text-[15px] text-slate-400 hover:text-slate-500 underline transition-colors cursor-pointer"
                  >
                    <XCircle className="h-8 w-8" /> Hủy bỏ tiến trình này
                  </button>
                </div>
              </div>
            ) : (
              /* Giao diện mặc định */
              <div className="flex flex-col items-center space-y-4 text-slate-400 group-hover:text-primary transition-colors">
                <div className="p-5 bg-slate-100 rounded-full group-hover:bg-primary/10 transition-colors">
                  <Upload className="h-10 w-10" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-bold text-slate-600 group-hover:text-primary">
                    Tải lên video bài học
                  </p>
                  <p className="text-[10px] opacity-70 italic">
                    Hỗ trợ MP4, WebM (Tối đa 2GB)
                  </p>
                </div>
              </div>
            )}

            {/* Thanh Progress Bar dưới đáy */}
            {uploading && (
              <div className="absolute bottom-0 left-0 w-full h-1.5 bg-slate-100 rounded-b-xl overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </label>
        </div>
      )}
    </div>
  );
}
