import {
  getCourseRecommendation,
  getDetailCourse,
  getFilterCourses,
  getHomeCourses,
  getLessonDetail,
} from "@/redux/thunk/courseThunk";
import {
  addNoteToLesson,
  createLessonProgress,
  deleteNoteToLesson,
  updateLessonProgress,
  updateNoteToLesson,
} from "@/redux/thunk/lessonProgressThunk";
import {
  Course,
  CourseDetail,
  filterCourseParams,
  Lesson,
  Pagination,
} from "@/types/course/course";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CourseState {
  homeCourse: Course[];
  recommendationCourse: Course[];
  filteredCourses: Course[];
  selectedCourse: CourseDetail | null;
  selectedLesson: Lesson | null;
  filterParams: filterCourseParams;
  pagination: Pagination;
  status: "idle" | "loading" | "succeeded" | "failed";
  statusRecommendationCourse: "idle" | "loading" | "succeeded" | "failed";
  statusCourseDetail: "idle" | "loading" | "succeeded" | "failed";
  statusLessonDetail: "idle" | "loading" | "succeeded" | "failed";
  statusLessonNote: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CourseState = {
  homeCourse: [],
  recommendationCourse: [],
  filteredCourses: [],
  selectedCourse: null,
  selectedLesson: null,
  filterParams: {
    category: "all",
    level: "all",
    rating: "all",
    page: 1,
    limit: 6,
  },
  pagination: {
    total: 0,
    page: 1,
    limit: 6,
    totalPages: 0,
  },
  status: "idle",
  statusRecommendationCourse: "idle",
  statusCourseDetail: "idle",
  statusLessonDetail: "idle",
  statusLessonNote: "idle",
  error: null,
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<Partial<filterCourseParams>>) => {
      state.filterParams = { ...state.filterParams, ...action.payload };
    },
    clearFilters: (state) => {
      state.filterParams = initialState.filterParams;
    },
    clearSelectedCourse: (state) => {
      state.selectedCourse = null;
    },
    updateCourseWishlist: (
      state,
      action: PayloadAction<{ courseId: string; value: boolean }>
    ) => {
      const { courseId, value } = action.payload;
      state.homeCourse = state.homeCourse.map((c) =>
        c.id === courseId ? { ...c, isInWishlist: value } : c
      );
      state.filteredCourses = state.filteredCourses.map((c) =>
        c.id === courseId ? { ...c, isInWishlist: value } : c
      );
      state.recommendationCourse = state.recommendationCourse.map((c) =>
        c.id === courseId ? { ...c, isInWishlist: value } : c
      );
      if (state.selectedCourse?.id === courseId)
        state.selectedCourse.isInWishlist = value;
    },
    updateCourseCart: (
      state,
      action: PayloadAction<{ courseId: string; value: boolean }>
    ) => {
      const { courseId, value } = action.payload;
      state.homeCourse = state.homeCourse.map((c) =>
        c.id === courseId ? { ...c, isInCart: value } : c
      );
      state.filteredCourses = state.filteredCourses.map((c) =>
        c.id === courseId ? { ...c, isInCart: value } : c
      );
      state.recommendationCourse = state.recommendationCourse.map((c) =>
        c.id === courseId ? { ...c, isInCart: value } : c
      );
      if (state.selectedCourse?.id === courseId)
        state.selectedCourse.isInCart = value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFilterCourses.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        getFilterCourses.fulfilled,
        (
          state,
          action: PayloadAction<{
            pagination: Pagination;
            data: Course[];
          }>
        ) => {
          state.status = "succeeded";
          state.filteredCourses = action.payload.data || [];
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(getFilterCourses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      .addCase(getHomeCourses.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getHomeCourses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.homeCourse = action.payload || [];
      })
      .addCase(getHomeCourses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(getCourseRecommendation.pending, (state) => {
        state.statusRecommendationCourse = "loading";
        state.error = null;
      })
      .addCase(getCourseRecommendation.fulfilled, (state, action) => {
        state.statusRecommendationCourse = "succeeded";
        state.recommendationCourse = action.payload || [];
        console.log("course: ", state.recommendationCourse);
      })
      .addCase(getCourseRecommendation.rejected, (state, action) => {
        state.statusRecommendationCourse = "failed";
        state.error = action.payload as string;
      })

      .addCase(getDetailCourse.pending, (state) => {
        state.statusCourseDetail = "loading";
        state.error = null;
      })
      .addCase(getDetailCourse.fulfilled, (state, action) => {
        state.statusCourseDetail = "succeeded";
        state.selectedCourse = action.payload || null;
      })
      .addCase(getDetailCourse.rejected, (state, action) => {
        state.statusCourseDetail = "failed";
        state.error = action.payload as string;
      })
      .addCase(getLessonDetail.pending, (state) => {
        state.statusLessonDetail = "loading";
        state.error = null;
      })
      .addCase(getLessonDetail.fulfilled, (state, action) => {
        state.statusLessonDetail = "succeeded";
        state.selectedLesson = action.payload || null;
      })
      .addCase(getLessonDetail.rejected, (state, action) => {
        state.statusLessonDetail = "failed";
        state.error = action.payload as string;
      })

      .addCase(addNoteToLesson.pending, (state) => {
        state.statusLessonNote = "loading";
        state.error = null;
      })
      .addCase(addNoteToLesson.fulfilled, (state, action) => {
        if (!state.selectedLesson?.progress) return;

        const newNote = action.payload;

        if (!state.selectedLesson.progress.notes) {
          state.selectedLesson.progress.notes = [];
        }

        state.selectedLesson.progress.notes.push(newNote);
        state.statusLessonNote = "succeeded";
      })
      .addCase(addNoteToLesson.rejected, (state, action) => {
        state.statusLessonNote = "failed";
        state.error = (action.payload as string) || "Thêm ghi chú thất bại";
      })
      .addCase(updateNoteToLesson.pending, (state) => {
        state.statusLessonNote = "loading";
        state.error = null;
      })
      .addCase(updateNoteToLesson.fulfilled, (state, action) => {
        if (!state.selectedLesson?.progress) return;
        const updatedNote = action.payload;
        state.selectedLesson.progress.notes =
          state.selectedLesson.progress.notes?.map((note) =>
            note.id === updatedNote.id ? updatedNote : note
          );
        state.statusLessonNote = "succeeded";
      })
      .addCase(updateNoteToLesson.rejected, (state, action) => {
        state.statusLessonNote = "failed";
        state.error = (action.payload as string) || "Cập nhật ghi chú thất bại";
      })
      .addCase(deleteNoteToLesson.pending, (state) => {
        state.statusLessonNote = "loading";
        state.error = null;
      })
      .addCase(deleteNoteToLesson.fulfilled, (state, action) => {
        if (!state.selectedLesson?.progress) return;
        const deletedNoteId = action.meta.arg.noteId;
        state.selectedLesson.progress.notes =
          state.selectedLesson.progress.notes?.filter(
            (note) => note.id !== deletedNoteId
          );
        state.statusLessonNote = "succeeded";
      })
      .addCase(deleteNoteToLesson.rejected, (state, action) => {
        state.statusLessonNote = "failed";
        state.error = (action.payload as string) || "Xóa ghi chú thất bại";
      })
      .addCase(createLessonProgress.fulfilled, (state, action) => {
        if (state.selectedLesson) {
          state.selectedLesson.progress = action.payload; // update progress mới tạo
        }
      })
      .addCase(updateLessonProgress.fulfilled, (state, action) => {
        if (state.selectedLesson?.progress) {
          state.selectedLesson.progress = {
            ...state.selectedLesson.progress,
            ...action.payload,
          };
        }
      });
  },
});

export const {
  setFilter,
  clearFilters,
  clearSelectedCourse,
  updateCourseWishlist,
  updateCourseCart,
} = courseSlice.actions;
export default courseSlice.reducer;
