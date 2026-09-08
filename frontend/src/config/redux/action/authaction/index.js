import clientServer from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

const loginUser = createAsyncThunk("user/login", async (user, thunkApi) => {
  try {
    const response = await clientServer.post("/api/users/login", {
      email: user.email,
      password: user.password,
    });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    } else {
      return thunkApi.rejectWithValue({ message: "Token not found" });
    }

    return thunkApi.fulfillWithValue(response.data.token);
  } catch (error) {
    return thunkApi.rejectWithValue(error.response.data);
  }
});

const registerUser = createAsyncThunk(
  "user/register",
  async (user, thunkApi) => {
    try {
      const response = await clientServer.post("/api/users/register", {
        name: user.name,
        username: user.username,
        email: user.email,
        password: user.password,
      });

      return thunkApi.fulfillWithValue(response.data);
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

const getAboutUser = createAsyncThunk(
  "user/getAboutUser",
  async (_, thunkApi) => {
    try {
      const response = await clientServer.get(
        "/api/users/get-user-and-profile",
      );

      return thunkApi.fulfillWithValue(response.data);
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

const getAllUsers = createAsyncThunk("user/getAllUsers", async (_, thunkApi) => {
  try {
    const response = await clientServer.get("/api/users/get-all-users-profile");

    return thunkApi.fulfillWithValue(response.data);
  } catch (error) {
    return thunkApi.rejectWithValue(error.response.data);
  }
});

const getUserByUsername = createAsyncThunk(
  "user/getUserByUsername",
  async (username, thunkApi) => {
    try {
      const response = await clientServer.get("/api/users/get-user", {
        params: { username },
      });

      return thunkApi.fulfillWithValue(response.data);
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

const sendConnectionRequest = createAsyncThunk(
  "user/sendConnectionRequest",
  async (connectionId, thunkApi) => {
    try {
      const response = await clientServer.post(
        "/api/users/send-connection-request",
        { connectionId },
      );

      return thunkApi.fulfillWithValue(response.data);
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

const cancelConnectionRequest = createAsyncThunk(
  "user/cancelConnectionRequest",
  async (connectionId, thunkApi) => {
    try {
      const response = await clientServer.post(
        "/api/users/cancel-connection-request",
        { connectionId },
      );

      return thunkApi.fulfillWithValue(response.data);
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

const getConnectionStatus = createAsyncThunk(
  "user/getConnectionStatus",
  async (userId, thunkApi) => {
    try {
      const response = await clientServer.get("/api/users/connection-status", {
        params: { userId },
      });

      return thunkApi.fulfillWithValue(response.data);
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

const getConnectionRequests = createAsyncThunk(
  "user/getConnectionRequests",
  async (_, thunkApi) => {
    try {
      const response = await clientServer.get(
        "/api/users/what-are-my-connections",
      );

      return thunkApi.fulfillWithValue(response.data);
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

const respondConnectionRequest = createAsyncThunk(
  "user/respondConnectionRequest",
  async ({ requestId, action_type }, thunkApi) => {
    try {
      const response = await clientServer.post(
        "/api/users/accept-connection-request",
        { requestId, action_type },
      );

      return thunkApi.fulfillWithValue(response.data);
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

const getMyConnections = createAsyncThunk(
  "user/getMyConnections",
  async (_, thunkApi) => {
    try {
      const response = await clientServer.get("/api/users/my-connections");

      return thunkApi.fulfillWithValue(response.data);
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);

export {
  loginUser,
  registerUser,
  getAboutUser,
  getAllUsers,
  getUserByUsername,
  sendConnectionRequest,
  cancelConnectionRequest,
  getConnectionStatus,
  getConnectionRequests,
  respondConnectionRequest,
  getMyConnections,
};
