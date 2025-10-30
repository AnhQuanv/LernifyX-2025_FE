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
        console.log("Detail course fetched in slice:", state.selectedCourse);
      });
  },
});

export const { setFilter, clearFilters, clearSelectedCourse } =
  courseSlice.actions;
export default courseSlice.reducer;
