import { createSlice } from "@reduxjs/toolkit";
import {
  getAllPosts,
  createPost,
  deletePost,
  toggleLike,
  getCommentsByPost,
  commentPost,
} from "../../action/postaction/index.js";

const initialState = {
  post: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  comment: [],
  postId: "",
  postFetched: false,
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    reset: () => initialState,
    resetPostId: (state) => {
      state.postId = "";
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getAllPosts.pending, (state) => {
        state.isLoading = true;
        state.message = "Fetching all the posts";
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.postFetched = true;
        state.post = action.payload;
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
        state.message = "Posting...";
      })
      .addCase(createPost.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.message = "Post created";
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Could not create post";
      })
      .addCase(deletePost.pending, (state) => {
        state.isLoading = true;
        state.message = "Deleting post...";
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.message = "Post deleted";
        state.post = state.post.filter(
          (post) => post._id !== action.payload.postId,
        );
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Could not delete post";
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const target = state.post.find(
          (post) => post._id === action.payload.postId,
        );
        if (target && Array.isArray(action.payload.likes)) {
          target.likes = action.payload.likes;
        }
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload?.message || "Could not like post";
      })
      .addCase(getCommentsByPost.pending, (state) => {
        state.comment = [];
      })
      .addCase(getCommentsByPost.fulfilled, (state, action) => {
        state.comment = action.payload.comments || [];
        state.postId = action.payload.postId;
      })
      .addCase(getCommentsByPost.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload?.message || "Could not load comments";
      })
      .addCase(commentPost.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload?.message || "Could not add comment";
      });
  },
});

export const { reset, resetPostId } = postSlice.actions;
export default postSlice.reducer;