import { createSlice } from "@reduxjs/toolkit";

// Manages analytics-related state. Kept intentionally minimal — the
// dashboard currently derives its metrics directly from campaigns.items,
// but this slice exists as the dedicated home for analytics state as the
// app grows (e.g. historical ROI trend data for ROIChart).
const initialState = {
  roiHistory: [],
  loading: false,
  error: null,
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    setRoiHistory: (state, action) => {
      state.roiHistory = action.payload;
    },
  },
});

export const { setRoiHistory } = analyticsSlice.actions;
export default analyticsSlice.reducer;