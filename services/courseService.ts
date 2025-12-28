import axiosClient from "@/lib/axios";
import {
  CreateCourseDto,
  filterCourseParams,
  filterTeacherCourseParams,
  ProgressCallback,
  UpdateCourseDto,
} from "@/types/course/course";
import * as uuid from "uuid";
import { io, Socket } from "socket.io-client";
import * as UpChunk from "@mux/upchunk";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const SOCKET_URL = BASE_URL ? `${BASE_URL}` : "http://localhost:10000";

const socket: Socket = io(SOCKET_URL, {
  reconnection: true,
  reconnectionAttempts: 5,
  autoConnect: false,
  transports: ["websocket", "polling"],
});
export const handleGetHomeCourses = async () => {
  const res = await axiosClient.get("course/home");
  return res.data.data;
};

export const handleGetFilteredCourses = async ({
  params,
}: { params?: filterCourseParams } = {}) => {
  const res = await axiosClient.get("course/filter", { params });
  return res.data.data;
};

export const handleGetDetailCourse = async (courseId: string) => {
  const res = await axiosClient.get("course/detail", { params: { courseId } });
  return res.data.data;
};

export const handleGetMyLearningCourses = async ({
  progressStatus,
  page,
  limit,
}: { progressStatus?: string; page?: number; limit?: number } = {}) => {
  const res = await axiosClient.get("course/my-learning", {
    params: { progressStatus, page, limit },
  });
  return res.data.data;
};

export const handleGetLessonDetail = async (
  courseId: string,
  lessonId: string
) => {
  const res = await axiosClient.get(`course/${courseId}/lesson/${lessonId}`, {
    params: { courseId, lessonId },
  });
  return res.data.data;
};

export const handleGetCourseRecommendation = async () => {
  const res = await axiosClient.get("user-preferences/recommendations");
  return res.data.data;
};

export const handleUpLoadImage = async (
  file: File,
  onProgress: ProgressCallback
) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await axiosClient.post("cloudinary/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (progressEvent) => {
      const { loaded, total } = progressEvent;
      const percent = total ? Math.round((loaded * 100) / total) : 0;
      onProgress(percent);
    },
  });
  return res.data.data;
};

// Direct Upload URL từ Mux Backend, URL này có một thời hạn nhất định (mặc định thường là 24 giờ).
// export const handleUpLoadVideo = (
//   file: File,
//   lessonId: string,
//   onProgress: (percent: number, stats?: { speed: string; eta: string }) => void,
//   existingUrl?: string
// ) => {
//   return new Promise(async (resolve, reject) => {
//     // 1. Khôi phục taskId cũ hoặc tạo mới
//     let taskId = localStorage.getItem(`upload_taskid_${lessonId}`);
//     if (!taskId) {
//       taskId = uuid.v4();
//     }

//     socket.connect();
//     let lastTime = Date.now();
//     let lastBytes = 0;
//     let smoothedSpeed = 0;
//     let lastUiUpdate = 0;
//     const smoothingFactor = 0.05;
//     const cleanup = () => {
//       socket.off("upload_complete");
//       socket.off("upload_error");
//       socket.off("connect");
//       socket.disconnect();
//     };

//     socket.on("connect", () => {
//       socket.emit("register_upload", taskId);
//     });

//     // Lắng nghe tín hiệu hoàn thành từ Backend qua Socket
//     socket.once("upload_complete", (data) => {
//       if (data.taskId === taskId) {
//         onProgress(100);
//         // Dọn dẹp bộ nhớ khi thực sự thành công
//         localStorage.removeItem(`upload_url_${lessonId}`);
//         localStorage.removeItem(`upload_taskid_${lessonId}`);
//         localStorage.removeItem(`upload_filename_${lessonId}`);
//         localStorage.removeItem(`upload_progress_${lessonId}`);
//         resolve(data.data);
//         cleanup();
//       }
//     });

//     socket.once("upload_error", (data) => {
//       if (data.taskId === taskId) {
//         reject(new Error(data.message));
//         cleanup();
//       }
//     });

//     try {
//       let muxUploadUrl = existingUrl;
//       if (!muxUploadUrl) {
//         const res = await axiosClient.post("mux/upload-url", {
//           taskId,
//           lessonId,
//         });
//         muxUploadUrl = res.data.data.uploadUrl;

//         // Lưu thông tin để khôi phục khi F5
//         localStorage.setItem(`upload_taskid_${lessonId}`, taskId!);
//         localStorage.setItem(`upload_url_${lessonId}`, muxUploadUrl!);
//         localStorage.setItem(`upload_filename_${lessonId}`, file.name);
//       }

//       const upload = UpChunk.createUpload({
//         endpoint: muxUploadUrl!,
//         file: file,
//         chunkSize: 51200,
//         attempts: 5,
//         dynamicChunkSize: false,
//       });

//       upload.on("progress", (ev) => {
//         const percent = ev.detail;
//         const now = Date.now();
//         const bytesUploaded = (file.size * percent) / 100;

//         // Tính toán tốc độ tức thời
//         const timeDiff = (now - lastTime) / 1000; // giây
//         const bytesDiff = bytesUploaded - lastBytes;

//         if (timeDiff > 0 && bytesDiff > 0) {
//           const instantSpeed = bytesDiff / timeDiff;

//           // EMA: Smoothed = (Instant * Alpha) + (PreviousSmoothed * (1 - Alpha))
//           if (smoothedSpeed === 0) smoothedSpeed = instantSpeed;
//           else
//             smoothedSpeed =
//               instantSpeed * smoothingFactor +
//               smoothedSpeed * (1 - smoothingFactor);

//           lastTime = now;
//           lastBytes = bytesUploaded;
//         }

//         if (now - lastUiUpdate > 1000 || percent === 100 || percent === 0) {
//           lastUiUpdate = now;

//           const bytesRemaining = file.size - bytesUploaded;
//           const secondsRemaining =
//             smoothedSpeed > 0 ? Math.round(bytesRemaining / smoothedSpeed) : 0;

//           const speedMbps = ((smoothedSpeed * 8) / (1024 * 1024)).toFixed(2);

//           const minutes = Math.floor(secondsRemaining / 60);
//           const seconds = secondsRemaining % 60;
//           const etaLabel =
//             minutes > 0 ? `${minutes}p ${seconds}s` : `${seconds}s`;

//           onProgress(Math.round(percent), { speed: speedMbps, eta: etaLabel });
//           localStorage.setItem(
//             `upload_progress_${lessonId}`,
//             Math.round(percent).toString()
//           );
//         }
//       });

//       upload.on("success", () => {
//         console.log(" Byte đã tải lên Mux. Đang đợi Webhook xử lý Asset...");
//       });

//       upload.on("error", (err) => {
//         if (err.detail.includes("404") || err.detail.includes("410")) {
//           localStorage.removeItem(`upload_url_${lessonId}`);
//           localStorage.removeItem(`upload_taskid_${lessonId}`);
//         }
//         reject(new Error(err.detail));
//         cleanup();
//       });
//     } catch (error) {
//       reject(error);
//       cleanup();
//     }
//   });
// };

// Đảm bảo bạn đã import axiosClient và socket instance của mình

export const handleUpLoadVideo = (
  file: File,
  lessonId: string,
  onProgress: (percent: number, stats?: { speed: string; eta: string }) => void,
  existingUrl?: string
) => {
  return new Promise(async (resolve, reject) => {
    const taskId =
      localStorage.getItem(`upload_taskid_${lessonId}`) || uuid.v4();
    let lastTime = Date.now();
    let lastBytes = 0;
    let smoothedSpeed = 0;
    let lastUiUpdate = 0;
    const smoothingFactor = 0.05; // Giúp con số tốc độ không bị nhảy quá nhanh

    // 2. Thiết lập Socket Room
    const register = () => {
      console.log("[WS] Đang đăng ký taskId vào Room:", taskId);
      socket.emit("register_upload", taskId);
    };

    if (socket.connected) register();
    else socket.connect();

    socket.on("connect", register);

    const cleanup = () => {
      socket.off("connect", register);
      socket.off("upload_complete");
      socket.off("upload_error");
    };

    // 3. Lắng nghe tín hiệu hoàn thành từ Backend (Webhook qua Socket)
    socket.on("upload_complete", (data) => {
      if (data.taskId === taskId) {
        onProgress(100);
        // Dọn dẹp bộ nhớ khi thực sự thành công
        localStorage.removeItem(`upload_url_${lessonId}`);
        localStorage.removeItem(`upload_taskid_${lessonId}`);
        localStorage.removeItem(`upload_filename_${lessonId}`);
        localStorage.removeItem(`upload_progress_${lessonId}`);

        console.log("✅ Video đã sẵn sàng trên Mux!");
        resolve(data.data);
        cleanup();
      }
    });

    socket.on("upload_error", (data) => {
      if (data.taskId === taskId) {
        reject(new Error(data.message));
        cleanup();
      }
    });

    try {
      // 4. Lấy Mux Upload URL
      let muxUploadUrl = existingUrl;
      if (!muxUploadUrl) {
        const res = await axiosClient.post("mux/upload-url", {
          taskId,
          lessonId,
        });
        muxUploadUrl = res.data.data.uploadUrl;

        localStorage.setItem(`upload_taskid_${lessonId}`, taskId);
        localStorage.setItem(`upload_url_${lessonId}`, muxUploadUrl!);
        localStorage.setItem(`upload_filename_${lessonId}`, file.name);
      }

      // 5. Khởi tạo UpChunk
      const upload = UpChunk.createUpload({
        endpoint: muxUploadUrl!,
        file: file,
        chunkSize: 51200, // 512 KB
        attempts: 5,
        dynamicChunkSize: false,
      });

      // 6. Theo dõi tiến trình tải lên
      upload.on("progress", (ev) => {
        const percent = ev.detail;
        const now = Date.now();
        const bytesUploaded = (file.size * percent) / 100;

        // Tính toán tốc độ và ETA
        const timeDiff = (now - lastTime) / 1000; // giây
        const bytesDiff = bytesUploaded - lastBytes;

        if (timeDiff > 0 && bytesDiff > 0) {
          const instantSpeed = bytesDiff / timeDiff;
          // Áp dụng EMA (Exponential Moving Average) để mượt số liệu
          smoothedSpeed =
            smoothedSpeed === 0
              ? instantSpeed
              : instantSpeed * smoothingFactor +
                smoothedSpeed * (1 - smoothingFactor);

          lastTime = now;
          lastBytes = bytesUploaded;
        }

        // Cập nhật giao diện mỗi 1 giây hoặc khi xong
        if (now - lastUiUpdate > 1000 || percent === 100) {
          lastUiUpdate = now;
          const bytesRemaining = file.size - bytesUploaded;
          const secondsRemaining =
            smoothedSpeed > 0 ? Math.round(bytesRemaining / smoothedSpeed) : 0;
          const speedMbps = ((smoothedSpeed * 8) / (1024 * 1024)).toFixed(2);

          const minutes = Math.floor(secondsRemaining / 60);
          const seconds = secondsRemaining % 60;
          const etaLabel =
            minutes > 0 ? `${minutes}p ${seconds}s` : `${seconds}s`;

          onProgress(Math.round(percent), { speed: speedMbps, eta: etaLabel });

          localStorage.setItem(
            `upload_progress_${lessonId}`,
            Math.round(percent).toString()
          );
        }
      });

      upload.on("success", () => {
        console.log("📤 Tải lên Mux hoàn tất. Đang chờ xử lý video...");
      });

      upload.on("error", (err) => {
        // Nếu lỗi 404/410 là do URL Mux hết hạn, xóa lưu trữ để lần sau lấy URL mới
        if (err.detail.status === 404 || err.detail.status === 410) {
          localStorage.removeItem(`upload_url_${lessonId}`);
          localStorage.removeItem(`upload_taskid_${lessonId}`);
        }
        reject(
          new Error(`UpChunk Error: ${err.detail.message || "Unknown error"}`)
        );
        cleanup();
      });
    } catch (error) {
      reject(error);
      cleanup();
    }
  });
};

export const handleDeleteVideoId = async (lessonVideoId: string) => {
  const res = await axiosClient.delete("mux/delete-video", {
    data: {
      lessonVideoId: lessonVideoId,
    },
  });

  return res.data.data;
};

export const handleCreateCourse = async (dto: CreateCourseDto) => {
  const res = await axiosClient.post("course/create", dto);
  return res.data.data;
};

export const handleUpdateCourse = async (dto: UpdateCourseDto) => {
  const res = await axiosClient.put("course/update", dto);
  return res.data.data;
};

export const handleDeleteCourse = async (courseId: string) => {
  const res = await axiosClient.delete("course/delete", {
    data: { courseId: courseId },
  });
  return res.data.data;
};

export const handleGetTeacher = async ({
  search,
  limit,
  page,
}: {
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const res = await axiosClient.get("course/teacher", {
    params: {
      search,
      limit,
      page,
    },
  });
  return res.data.data;
};

export const handleGetTeacherDetail = async (teacherId: string) => {
  const res = await axiosClient.get("course/teacher-course-detail", {
    params: {
      teacherId,
    },
  });
  return res.data.data;
};

export const handleGetTeacherFilteredCourses = async ({
  params,
}: { params?: filterTeacherCourseParams } = {}) => {
  const res = await axiosClient.get("course/teacher-filter", { params });
  return res.data.data;
};

export const handleGetTeacherCourseCounts = async () => {
  const res = await axiosClient.get("course/teacher-counts");
  return res.data.data;
};

export const handleGetTeacherCourseDetail = async (courseId: string) => {
  const res = await axiosClient.get("course/teacher-detail", {
    params: { courseId },
  });
  return res.data.data;
};

export const handleGetTeacherCourseStudentProgress = async ({
  courseId,
  page = 1,
  limit = 5,
}: {
  courseId: string;
  page?: number;
  limit: number;
}) => {
  const res = await axiosClient.get("course/teacher-student-progress", {
    params: { courseId, page, limit },
  });
  return res.data.data;
};

export const handleGetTeacherCourseEdit = async (courseId: string) => {
  const res = await axiosClient.get("course/teacher-edit", {
    params: { courseId },
  });
  return res.data.data;
};

export const handleGetTeacherCoursesRevenue = async () => {
  const res = await axiosClient.get("course/teacher-course-revenue");
  return res.data.data;
};

export const handleGetTeacherCoursesRevenuePage = async () => {
  const res = await axiosClient.get("course/teacher-revenue-page");
  return res.data.data;
};
