import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import client from "@/config/client";

export const getAllPosts = createAsyncThunk(
  "posts/getAllPosts",
  async (_, thunkApi) => {
    try {
      const response = await client.get("/api/posts/get-all-posts");
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async ({ body, file }, thunkApi) => {
    try {
      const formData = new FormData();
      formData.append("body", body);
      if (file) formData.append("media", file);

      const response = await client.post("/api/posts/create-post", formData);
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId, thunkApi) => {
    try {
      const response = await client.delete("/api/posts/delete-post", {
        data: { post_id: postId },
      });
      return { ...response.data, postId };
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

export const toggleLike = createAsyncThunk(
  "posts/toggleLike",
  async (postId, thunkApi) => {
    try {
      const response = await client.post("/api/posts/toggle-like", {
        post_id: postId,
      });
      return { ...response.data, postId };
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

export const getComments = createAsyncThunk(
  "posts/getComments",
  async (postId, thunkApi) => {
    try {
      const response = await client.get("/api/posts/get-comments-by-post", {
        params: { post_id: postId },
      });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

export const addComment = createAsyncThunk(
  "posts/addComment",
  async ({ postId, body }, thunkApi) => {
    try {
      const response = await client.post("/api/posts/comment-post", {
        post_id: postId,
        commentBody: body,
      });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

const initialState = {
  posts: [],
  comments: [],
  isLoading: false,
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(getAllPosts.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPost.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createPost.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(
          (post) => post._id !== action.payload.postId,
        );
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p._id === action.payload.postId);
        if (post && Array.isArray(action.payload.likes)) {
          post.likes = action.payload.likes;
        }
      })
      .addCase(getComments.pending, (state) => {
        state.comments = [];
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.comments = action.payload.comments || [];
      });
  },
});

export default postSlice.reducer;
