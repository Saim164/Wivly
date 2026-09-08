import { configureStore } from "@reduxjs/toolkit";
import authreducer from "./reducer/authreducer";
import postreducer from "./reducer/postreducer";

const store = configureStore({
  reducer: {
    auth: authreducer,
    posts: postreducer,
  },
});

export default store;