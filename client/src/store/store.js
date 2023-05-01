import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

// Store
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
