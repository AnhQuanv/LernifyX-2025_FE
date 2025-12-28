"use client";

import type React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
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
import { extractPlaybackId, formatDurationVi } from "@/lib/utils";
import { VideoAsset } from "@/types/course/course";
import MuxPlayer from "@mux/mux-player-react";

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
  const [uploadStats, setUploadStats] = useState<{
    speed: string;
    eta: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sử dụng useMemo để tính toán playbackId từ currentVideoData
  const playbackId = useMemo(
    () => extractPlaybackId(currentVideoData?.originalUrl),
    [currentVideoData?.originalUrl]
  );

  useEffect(() => {
    const url = localStorage.getItem(`upload_url_${lessonId}`);
    const fileName = localStorage.getItem(`upload_filename_${lessonId}`);
    const savedProgress = localStorage.getItem(`upload_progress_${lessonId}`);

    if (url && !currentVideoData) {
      setIsPaused(true);
      setSavedFileName(fileName);
      if (savedProgress) setProgress(parseInt(savedProgress));
    }
  }, [lessonId, currentVideoData]);

  const clearUploadStorage = () => {
    localStorage.removeItem(`upload_url_${lessonId}`);
    localStorage.removeItem(`upload_taskid_${lessonId}`);
    localStorage.removeItem(`upload_filename_${lessonId}`);
    localStorage.removeItem(`upload_progress_${lessonId}`);
  };

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

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isPaused && savedFileName && file.name !== savedFileName) {
      const confirmNew = window.confirm(
        `File đang chọn khác với file cũ. Tải mới từ đầu?`
      );
      if (!confirmNew) {
        e.target.value = "";
        return;
      }
      clearUploadStorage();
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

      // Backend trả về VideoAsset chứa originalUrl
      onUploadComplete(response as VideoAsset);
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
      setIsPaused(false);
      setProgress(0);
      onDelete();
      toast.success("Đã xóa video");
    } catch {
      toast.error("Lỗi khi xóa video");
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* CASE 1: ĐÃ CÓ VIDEO - DÙNG MUX PLAYER */}
      {playbackId && !uploading && (
        <div className="overflow-hidden border border-emerald-100 rounded-xl bg-white shadow-sm">
          <div className="flex items-center justify-between p-3 bg-emerald-50/50">
            <span className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
              <Play className="h-3.5 w-3.5 fill-emerald-600" />
              {currentVideoData?.duration
                ? formatDurationVi(currentVideoData.duration)
                : "00:00"}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-7 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Xóa video
            </Button>
          </div>

          <MuxPlayer
            className="w-full aspect-video"
            playbackId={playbackId}
            metadata={{
              player_name: "lms-video-player",
              video_id: lessonId,
            }}
            accentColor="#dc2626"
            primaryColor="#FFFFFF"
            streamType="on-demand"
          />
        </div>
      )}

      {/* CASE 2: ĐANG UPLOAD HOẶC TRỐNG */}
      {(!playbackId || uploading || isPaused) && (
        <div className="relative group">
          <label
            className={`
              relative flex flex-col items-center justify-center min-h-55 border-2 border-dashed rounded-xl transition-all p-8
              ${
                isPaused
                  ? "border-slate-800 bg-slate-50"
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
              <div className="flex flex-col items-center w-full max-w-xs space-y-4">
                <div className="relative flex items-center justify-center">
                  <Loader2 className="h-14 w-14 text-primary animate-spin" />
                  <span className="absolute text-[11px] font-bold text-primary">
                    {progress}%
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-700">
                    {progress === 100
                      ? "Đang xử lý dữ liệu..."
                      : "Đang tải video..."}
                  </p>
                  {uploadStats && progress < 100 && (
                    <p className="text-[10px] text-slate-500 italic">
                      Còn lại: {uploadStats.eta}
                    </p>
                  )}
                </div>
              </div>
            ) : isPaused ? (
              <div className="flex flex-col items-center text-center space-y-4">
                <RefreshCcw className="h-8 w-8 text-slate-600" />
                <div>
                  <h3 className="text-sm font-bold uppercase">
                    Tiến trình chưa hoàn thành
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    File: <strong>{savedFileName}</strong> ({progress}%)
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="px-4 py-2 bg-black text-white text-[11px] font-bold rounded-lg">
                    CHỌN LẠI FILE ĐỂ TIẾP TỤC
                  </span>
                  <button
                    onClick={handleCancelProgress}
                    className="flex items-center justify-center gap-1 text-xs text-slate-400 underline"
                  >
                    <XCircle className="h-4 w-4" /> Hủy bỏ tiến trình này
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4 text-slate-400 group-hover:text-primary transition-colors">
                <div className="p-5 bg-slate-100 rounded-full group-hover:bg-primary/10">
                  <Upload className="h-10 w-10" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-600 group-hover:text-primary">
                    Tải lên video bài học
                  </p>
                  <p className="text-[10px] opacity-70 italic">
                    Hỗ trợ MP4, WebM (Tối đa 2GB)
                  </p>
                </div>
              </div>
            )}

            {uploading && (
              <div className="absolute bottom-0 left-0 w-full h-1.5 bg-slate-100 rounded-b-xl overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
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
