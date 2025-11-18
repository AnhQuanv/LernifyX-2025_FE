import {
  addToCart,
  getUserAllCart,
  getUserCart,
  removeFromCart,
} from "@/redux/thunk/cartThunk";
import { Course, Pagination } from "@/types/course/course";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  allCourses: Course[];
  items: Course[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  pagination: Pagination;
}

const initialState: CartState = {
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

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserCart.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(
      getUserCart.fulfilled,
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
    builder.addCase(getUserCart.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });

    builder.addCase(getUserAllCart.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(
      getUserAllCart.fulfilled,
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
    builder.addCase(getUserAllCart.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });

    builder.addCase(addToCart.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(addToCart.fulfilled, (state, action) => {
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
    builder.addCase(addToCart.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });

    builder.addCase(removeFromCart.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(removeFromCart.fulfilled, (state, action) => {
      state.status = "succeeded";
      const courseId = action.payload as string;
      state.items = state.items.filter((item) => item.id !== courseId);
      state.allCourses = state.allCourses.filter(
        (item) => item.id !== courseId
      );
      state.error = null;
    });
    builder.addCase(removeFromCart.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
