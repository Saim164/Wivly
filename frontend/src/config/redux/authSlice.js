import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import client from "@/config/client";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (data, thunkApi) => {
    try {
      const response = await client.post("/api/users/register", data);
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, thunkApi) => {
    try {
      const response = await client.post("/api/users/login", data);
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

export const getAboutUser = createAsyncThunk(
  "auth/getAboutUser",
  async (_, thunkApi) => {
    try {
      const response = await client.get("/api/users/get-user-and-profile");
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

export const getAllUsers = createAsyncThunk(
  "auth/getAllUsers",
  async (_, thunkApi) => {
    try {
      const response = await client.get("/api/users/get-all-users-profile");
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

export const getTopUsers = createAsyncThunk(
  "auth/getTopUsers",
  async (_, thunkApi) => {
    try {
      const response = await client.get("/api/users/top-users");
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

export const getUserByUsername = createAsyncThunk(
  "auth/getUserByUsername",
  async (username, thunkApi) => {
    try {
      const response = await client.get("/api/users/get-user", {
        params: { username },
      });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

export const updateProfileData = createAsyncThunk(
  "auth/updateProfileData",
  async (data, thunkApi) => {
    try {
      const response = await client.post("/api/users/update-profile-data", {
        bio: data.bio,
        currentPost: data.currentPost,
        pastWork: data.pastWork,
        education: data.education,
      });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

export const uploadProfilePicture = createAsyncThunk(
  "auth/uploadProfilePicture",
  async (file, thunkApi) => {
    try {
      const formData = new FormData();
      formData.append("profile_picture", file);
      const response = await client.post(
        "/api/users/upload-profile-picture",
        formData,
      );
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

export const downloadResume = createAsyncThunk(
  "auth/downloadResume",
  async (userId, thunkApi) => {
    try {
      const response = await client.get("/api/users/download-resume", {
        params: { id: userId },
      });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

export const sendConnectionRequest = createAsyncThunk(
  "auth/sendConnectionRequest",
  async (connectionId, thunkApi) => {
    try {
      const response = await client.post("/api/users/send-connection-request", {
        connectionId,
      });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

export const cancelConnectionRequest = createAsyncThunk(
  "auth/cancelConnectionRequest",
  async (connectionId, thunkApi) => {
    try {
      const response = await client.post(
        "/api/users/cancel-connection-request",
        { connectionId },
      );
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

export const respondConnectionRequest = createAsyncThunk(
  "auth/respondConnectionRequest",
  async ({ requestId, action_type }, thunkApi) => {
    try {
      const response = await client.post(
        "/api/users/respond-connection-request",
        { requestId, action_type },
      );
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

export const getReceivedRequests = createAsyncThunk(
  "auth/getReceivedRequests",
  async (_, thunkApi) => {
    try {
      const response = await client.get("/api/users/received-requests");
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

export const getMyConnections = createAsyncThunk(
  "auth/getMyConnections",
  async (_, thunkApi) => {
    try {
      const response = await client.get("/api/users/my-connections");
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

export const getConnectionStatus = createAsyncThunk(
  "auth/getConnectionStatus",
  async (userId, thunkApi) => {
    try {
      const response = await client.get("/api/users/connection-status", {
        params: { userId },
      });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

const initialState = {
  user: null,
  users: [],
  topUsers: [],
  viewedUser: null,
  viewedProfile: null,
  viewedUserFetched: false,
  connectionStatus: null,
  connectionRequests: [],
  connections: [],
  loggedIn: false,
  profileFetched: false,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    clearMessage: (state) => {
      state.message = "";
      state.isError = false;
      state.isSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "Creating your account...";
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Account created. Please sign in.";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Registration failed";
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "Signing you in...";
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.loggedIn = true;
        state.message = "";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Login failed";
      })
      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.profileFetched = true;
        state.user = action.payload;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(getTopUsers.fulfilled, (state, action) => {
        state.topUsers = action.payload;
      })
      .addCase(getUserByUsername.pending, (state) => {
        state.viewedUserFetched = false;
        state.viewedUser = null;
        state.viewedProfile = null;
        state.connectionStatus = null;
      })
      .addCase(getUserByUsername.fulfilled, (state, action) => {
        state.viewedUserFetched = true;
        state.viewedUser = action.payload.user;
        state.viewedProfile = action.payload.profile;
      })
      .addCase(getUserByUsername.rejected, (state) => {
        state.viewedUserFetched = true;
      })
      .addCase(getConnectionStatus.pending, (state) => {
        state.connectionStatus = null;
      })
      .addCase(getConnectionStatus.fulfilled, (state, action) => {
        state.connectionStatus = action.payload;
      })
      .addCase(getReceivedRequests.fulfilled, (state, action) => {
        state.connectionRequests = action.payload;
      })
      .addCase(getMyConnections.fulfilled, (state, action) => {
        state.connections = action.payload;
      });
  },
});

export const { reset, clearMessage } = authSlice.actions;
export default authSlice.reducer;
