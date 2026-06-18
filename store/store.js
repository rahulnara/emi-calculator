import { configureStore } from "@reduxjs/toolkit";
import emiReducer from "./emiSlice.js";

export const store = configureStore({
  reducer: {
    emi: emiReducer
  }
});
