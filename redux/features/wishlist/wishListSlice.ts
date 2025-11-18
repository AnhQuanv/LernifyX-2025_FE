import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Course, Pagination } from "@/types/course/course";
import {
  addToWishlist,
  getUserAllWishlist,
  getUserWishlist,
  removeFromWishlist,
} from "@/redux/thunk/wishlistThunk";

interface WishlistState {
  allCourses: Course[];
  items: Course[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  pagination: Pagination;
}

const initialState: WishlistState = {
  items: [],
  allCourses: [],
  status: "idle",
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 6,
    totalPages: 0,
  },
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserWishlist.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(
      getUserWishlist.fulfilled,
      (
        state,
        action: PayloadAction<{
          pagination: Pagination;
          data: Course[];
        }>
      ) => {
        state.status = "succeeded";
        state.items = action.payload.data || [];
        state.pagination = action.payload.pagination;
      }
    );
    builder.addCase(getUserWishlist.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });

    builder.addCase(getUserAllWishlist.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(
      getUserAllWishlist.fulfilled,
      (
        state,
        action: PayloadAction<{
          pagination: Pagination;
          data: Course[];
        }>
      ) => {
        state.status = "succeeded";
        state.allCourses = action.payload.data || [];
      }
    );
    builder.addCase(getUserAllWishlist.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });

    builder.addCase(addToWishlist.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(addToWishlist.fulfilled, (state, action) => {
      state.status = "succeeded";
      const newCourse = action.payload as Course;

      if (!state.items.some((c) => c.id === newCourse.id)) {
        state.items.push(newCourse);
      }
      if (!state.allCourses.some((c) => c.id === newCourse.id)) {
        state.allCourses.push(newCourse);
      }

      state.error = null;
    });
    builder.addCase(addToWishlist.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });

    builder.addCase(removeFromWishlist.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(removeFromWishlist.fulfilled, (state, action) => {
      state.status = "succeeded";
      const courseId = action.payload as string;
      state.items = state.items.filter((item) => item.id !== courseId);
      state.allCourses = state.allCourses.filter(
        (item) => item.id !== courseId
      );
      state.error = null;
    });
    builder.addCase(removeFromWishlist.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
