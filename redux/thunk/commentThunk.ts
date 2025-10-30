import { handleGetCommentsByCourse } from "@/services/commentService";
import { ApiError } from "@/types/api/apiResponse";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export const getCommentsByCourse = createAsyncThunk(
  "comment/getByCourse",
  async (
    {
      courseId,
      page = 1,
      limit = 5,
    }: { courseId: string; page?: number; limit: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await handleGetCommentsByCourse(courseId, page, limit);
      return res;
    } catch (err: unknown) {
      const error = err as AxiosError<ApiError>;
      return rejectWithValue({
        message:
          error.response?.data?.message || "Lấy bình luận khóa học thất bại",
        errorCode: error.response?.data?.errorCode,
      });
    }
  }
);
