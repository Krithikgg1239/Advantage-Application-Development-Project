import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import campaignsReducer from "./slices/campaignSlice";
import analyticsReducer from "./slices/analyticsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    campaigns: campaignsReducer,
    analytics: analyticsReducer,
  },
});

export default store;