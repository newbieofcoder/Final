import { configureStore } from "@reduxjs/toolkit";
import xeMayReducer from "./xeMaySlice";

export const store = configureStore({
  reducer: {
    xeMay: xeMayReducer,
  },
});
