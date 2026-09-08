import { createSlice } from "@reduxjs/toolkit";
import {
  loginUser,
  registerUser,
  getAboutUser,
  getAllUsers,
  getUserByUsername,
  sendConnectionRequest,
  getConnectionStatus,
  getConnectionRequests,
  getMyConnections,
} from "../../action/authaction";

const initialState = {
  user: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  loggedIn: false,
  isTokenThere: false,
  message: "",
  profileFetched: false,
  connections: [],
  connectionRequests: [],
  allProfileFetched: false,
  users: [],
  viewedUser: null,
  viewedProfile: null,
  viewedUserFetched: false,
  connectionMessage: "",
  connectionStatus: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    handleLoginUser: (state) => {
      state.message = "hello";
    },
    emptyMessage: (state) => {
      state.message = "";
    },
    setTokenIsThere: (state) => {
      state.isTokenThere = true;
    },
    setTokenIsNotThere: (state) => {
      state.isTokenThere = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Knocking the door.....";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.loggedIn = true;
        state.isTokenThere = true;
        state.message = "Login is successful";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Login failed";
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Registering you";
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "Registration successful. Please sign in.";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Registration failed";
      })
      .addCase(getAboutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.profileFetched = true;
        state.user = action.payload;
      })
      .addCase(getAboutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Could not load profile";
      })
      // .addCase(getAllUser.pending, (state) => {
      //   state.isLoading = true;
      // })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.allProfileFetched = true;
        state.users = action.payload;
      })
      .addCase(getUserByUsername.pending, (state) => {
        state.viewedUserFetched = false;
        state.viewedUser = null;
        state.viewedProfile = null;
        state.connectionMessage = "";
        state.connectionStatus = null;
      })
      .addCase(getUserByUsername.fulfilled, (state, action) => {
        state.viewedUserFetched = true;
        state.viewedUser = action.payload.user;
        state.viewedProfile = action.payload.profile;
      })
      .addCase(getUserByUsername.rejected, (state, action) => {
        state.viewedUserFetched = true;
        state.isError = true;
        state.message = action.payload?.message || "Could not load profile";
      })
      .addCase(sendConnectionRequest.fulfilled, (state, action) => {
        state.connectionMessage = action.payload?.message || "Request sent";
      })
      .addCase(sendConnectionRequest.rejected, (state, action) => {
        state.connectionMessage =
          action.payload?.message || "Could not send request";
      })
      .addCase(getConnectionStatus.pending, (state) => {
        state.connectionStatus = null;
      })
      .addCase(getConnectionStatus.fulfilled, (state, action) => {
        state.connectionStatus = action.payload;
      })
      .addCase(getConnectionRequests.fulfilled, (state, action) => {
        state.connectionRequests = action.payload;
      })
      .addCase(getMyConnections.fulfilled, (state, action) => {
        state.connections = action.payload;
      });
    // .addCase(getAboutUser.rejected, (state, action) => {
    //   state.isLoading = false;
    //   state.isError = true;
    //   state.message = action.payload?.message || "Could not load profile";
    // });
  },
});

export const {
  reset,
  handleLoginUser,
  emptyMessage,
  setTokenIsThere,
  setTokenIsNotThere,
} = authSlice.actions;
export default authSlice.reducer;
