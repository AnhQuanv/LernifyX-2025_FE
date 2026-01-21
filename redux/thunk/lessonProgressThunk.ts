import {
  handleAddNoteToLesson,
  handleCreateLessonProgress,
  handleDeleteNoteToLesson,
  handleUpdateLessonProgress,
  handleUpdateNoteToLesson,
} from "@/services/lessonProgressService";
import { ApiError } from "@/types/api/apiResponse";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export const createLessonProgress = createAsyncThunk(
  "lessonProgress/createLessonProgress",
  async ({ lessonId }: { lessonId: string }, { rejectWithValue }) => {
    try {
      const res = await handleCreateLessonProgress(lessonId);
      return res;
    } catch (err: unknown) {
      const error = err as AxiosError<ApiError>;
      return rejectWithValue({
        message:
          error.response?.data?.message || "Thêm tiến trình bài học thất bại",
        errorCode: error.response?.data?.errorCode,
      });
    }
  },
);

export const updateLessonProgress = createAsyncThunk(
  "lessonProgress/updateLessonProgress",
  async (
    {
      progressId,
      completed,
      lastPosition,
    }: { progressId: string; completed?: boolean; lastPosition?: number },
    { rejectWithValue },
  ) => {
    try {
      const res = await handleUpdateLessonProgress(
        progressId,
        completed,
        lastPosition,
      );
      return res;
    } catch (err: unknown) {
      const error = err as AxiosError<ApiError>;
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          "Cập nhật tiến trình bài học thất bại",
        errorCode: error.response?.data?.errorCode,
      });
    }
  },
);

export const addNoteToLesson = createAsyncThunk(
  "note/addNoteToLesson",
  async (
    {
      progressId,
      text,
      videoTimestamp,
    }: { progressId: string; text: string; videoTimestamp: number },
    { rejectWithValue },
  ) => {
    try {
      const res = await handleAddNoteToLesson(progressId, text, videoTimestamp);
      return res;
    } catch (err: unknown) {
      const error = err as AxiosError<ApiError>;
      return rejectWithValue({
        message: error.response?.data?.message || "Thêm ghi chú thất bại",
        errorCode: error.response?.data?.errorCode,
      });
    }
  },
);

export const updateNoteToLesson = createAsyncThunk(
  "note/updateNoteToLesson",
  async (
    { noteId, text }: { noteId: string; text: string },
    { rejectWithValue },
  ) => {
    try {
      const res = await handleUpdateNoteToLesson(noteId, text);
      return res;
    } catch (err: unknown) {
      const error = err as AxiosError<ApiError>;
      return rejectWithValue({
        message: error.response?.data?.message || "Cập nhật ghi chú thất bại",
        errorCode: error.response?.data?.errorCode,
      });
    }
  },
);

export const deleteNoteToLesson = createAsyncThunk(
  "note/deleteNoteToLesson",
  async ({ noteId }: { noteId: string }, { rejectWithValue }) => {
    try {
      const res = await handleDeleteNoteToLesson(noteId);
      return res;
    } catch (err: unknown) {
      const error = err as AxiosError<ApiError>;
      return rejectWithValue({
        message: error.response?.data?.message || "Xóa ghi chú thất bại",
        errorCode: error.response?.data?.errorCode,
      });
    }
  },
);
