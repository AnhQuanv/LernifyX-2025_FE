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
import axios from "axios";

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

export const handleUpLoadVideo = (
  file: File,
  lessonId: string,
  onProgress: ProgressCallback
) => {
  return new Promise(async (resolve, reject) => {
    const SOCKET_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const socket: Socket = io(SOCKET_URL, {});
    const uuidv4 = uuid.v4;
    const taskId = uuidv4();
    console.log("Task ID được tạo:", taskId, typeof taskId);
    socket.on("connect", () => {
      socket.emit("register_upload", taskId);
    });

    const cleanupSocket = () => {
      socket.off("upload_complete");
      socket.off("upload_error");
    };

    // Lắng nghe sự kiện WebSocket (giữ nguyên logic)
    socket.on("upload_complete", (data) => {
      if (data.taskId === taskId) {
        cleanupSocket();
        onProgress(100);
        console.log("✅ Frontend đã nhận sự kiện hoàn thành:", data);
        resolve(data.data);
      }
    });

    socket.on("upload_error", (data) => {
      if (data.taskId === taskId) {
        cleanupSocket();
        console.error("❌ Lỗi WebSocket:", data.message);
        reject(new Error(data.message || "Lỗi tải lên từ Server."));
      }
    });

    try {
      const uploadUrlResponse = await axiosClient.post("mux/upload-url", {
        taskId,
        lessonId,
      });
      const muxUploadUrl = uploadUrlResponse.data.data.uploadUrl;
      console.log("🌐 Mux Upload URL nhận được:", muxUploadUrl);
      const formData = new FormData();
      formData.append("file", file); // 🚨 Chỉ cần file, không cần api_key, timestamp, signature, eager, etc.
      await axios.put(muxUploadUrl, file, {
        headers: {
          "Content-Type": file.type,
          Authorization: undefined,
        },
        withCredentials: false,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.lengthComputable) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total!
            );
            onProgress(percent);
          }
        },
      });

      console.log(
        "File uploaded successfully to Mux, waiting for asset processing webhook..."
      );
    } catch (error) {
      cleanupSocket();
      reject(error);
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
  console.log("dto: ", dto);
  const res = await axiosClient.post("course/create", dto);
  console.log("res: ", res);
  return res.data.data;
};

export const handleUpdateCourse = async (dto: UpdateCourseDto) => {
  console.log("dto: ", dto);
  const res = await axiosClient.put("course/update", dto);
  console.log("res: ", res);
  return res.data.data;
};

export const handleDeleteCourse = async (courseId: string) => {
  const res = await axiosClient.delete("course/delete", {
    data: { courseId: courseId },
  });
  console.log("res: ", res);
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
  console.log("id: ", courseId);
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
  console.log("id: ", courseId);
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
