import { configureStore } from "@reduxjs/toolkit";
import authreducer from "./reducer/authreducer";

const store = configureStore({
  reducer: {
    auth: authreducer,
  },
});

export default store;
