import clientServer from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

const getAllPosts = createAsyncThunk(
  "post/getAllPosts",
  async (_, thunkApi) => {
    try {
      const response = await clientServer.get("/api/posts/get-all-posts");
      return thunkApi.fulfillWithValue(response.data);
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

const createPost = createAsyncThunk(
  "post/createPost",
  async (userData, thunkApi) => {
    const { file, body } = userData;
    try {
      const formData = new FormData();
      formData.append("body", body);
      if (file) {
        formData.append("media", file);
      }

      const response = await clientServer.post(
        "/api/posts/create-post",
        formData,
      );

      return thunkApi.fulfillWithValue(response.data);
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

const deletePost = createAsyncThunk(
  "post/deletePost",
  async (postId, thunkApi) => {
    try {
      const response = await clientServer.delete("/api/posts/delete-post", {
        data: { post_id: postId },
      });
      return thunkApi.fulfillWithValue({ ...response.data, postId });
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

const toggleLike = createAsyncThunk(
  "post/toggleLike",
  async (postId, thunkApi) => {
    try {
      const response = await clientServer.post("/api/posts/toggle-like", {
        post_id: postId,
      });
      return thunkApi.fulfillWithValue({ ...response.data, postId });
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

const getCommentsByPost = createAsyncThunk(
  "post/getCommentsByPost",
  async (postId, thunkApi) => {
    try {
      const response = await clientServer.get(
        "/api/posts/get-comments-by-post",
        { params: { post_id: postId } },
      );
      return thunkApi.fulfillWithValue({ ...response.data, postId });
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

const commentPost = createAsyncThunk(
  "post/commentPost",
  async ({ postId, commentBody }, thunkApi) => {
    try {
      const response = await clientServer.post("/api/posts/comment-post", {
        post_id: postId,
        commentBody,
      });
      return thunkApi.fulfillWithValue(response.data);
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

export {
  getAllPosts,
  createPost,
  deletePost,
  toggleLike,
  getCommentsByPost,
  commentPost,
};