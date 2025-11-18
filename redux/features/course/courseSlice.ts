import {
  getDetailCourse,
  getFilterCourses,
  getHomeCourses,
} from "@/redux/thunk/courseThunk";
import {
  Course,
  CourseDetail,
  filterCourseParams,
  Pagination,
} from "@/types/course/course";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CourseState {
  homeCourse: Course[];
  filteredCourses: Course[];
  selectedCourse: CourseDetail | null;
  filterParams: filterCourseParams;
  pagination: Pagination;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CourseState = {
  homeCourse: [],
  filteredCourses: [],
  selectedCourse: null,
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

      .addCase(getDetailCourse.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getDetailCourse.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedCourse = action.payload || null;
      })
      .addCase(getDetailCourse.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
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
