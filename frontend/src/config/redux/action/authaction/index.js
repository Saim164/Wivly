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

export { loginUser, registerUser, getAboutUser , getAllUsers };
