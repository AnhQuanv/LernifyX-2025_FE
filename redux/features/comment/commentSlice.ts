// src/redux/slice/commentSlice.ts
import { getCommentsByCourse } from "@/redux/thunk/commentThunk";
import { Comment } from "@/types/comment/comment";
import { Pagination } from "@/types/course/course";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CommentState {
  comments: Comment[];
  pagination: Pagination;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CommentState = {
  comments: [],
  status: "idle",
  pagination: {
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 0,
  },
  error: null,
};

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    clearComments: (state) => {
      state.comments = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCommentsByCourse.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        getCommentsByCourse.fulfilled,
        (
          state,
          action: PayloadAction<{
            pagination: Pagination;
            data: Comment[];
          }>
        ) => {
          state.status = "succeeded";
          state.pagination = action.payload.pagination;
          state.comments = action.payload.data;
          console.log("Comments fetched successfully:", action.payload.data);
        }
      )
      .addCase(getCommentsByCourse.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;
