import { getAllCourses } from "@/redux/thunk/courseThunk";
import { Course, filterCourseParams } from "@/types/course/course";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface CourseState {
  listCourse: Course[];
  selectedCourse: Course | null;
  filterParams: filterCourseParams;
  pagination: Pagination;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CourseState = {
  listCourse: [],
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
      .addCase(getAllCourses.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        getAllCourses.fulfilled,
        (
          state,
          action: PayloadAction<{
            pagination: Pagination;
            data: Course[];
          }>
        ) => {
          state.status = "succeeded";
          state.listCourse = action.payload.data || [];
          state.pagination =
            action.payload.pagination || initialState.pagination;
        }
      )
      .addCase(getAllCourses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { setFilter, clearFilters, clearSelectedCourse } =
  courseSlice.actions;
export default courseSlice.reducer;
