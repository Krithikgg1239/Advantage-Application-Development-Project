import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

const failMsg = (err, fallback) =>
  err.response?.data?.message || err.response?.data || fallback;

export const fetchCampaigns = createAsyncThunk(
  "campaigns/fetchCampaigns",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/campaigns");
      return res.data;
    } catch (err) {
      return rejectWithValue(failMsg(err, "Failed to fetch campaigns"));
    }
  }
);

export const fetchActiveCampaigns = createAsyncThunk(
  "campaigns/fetchActiveCampaigns",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/campaigns/active");
      return res.data;
    } catch (err) {
      return rejectWithValue(failMsg(err, "Failed to fetch active campaigns"));
    }
  }
);

export const createCampaign = createAsyncThunk(
  "campaigns/createCampaign",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/campaigns", formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(failMsg(err, "Failed to create campaign"));
    }
  }
);

export const approveCampaign = createAsyncThunk(
  "campaigns/approveCampaign",
  async (id, { rejectWithValue }) => {
    try {
      await api.put(`/campaigns/${id}/approve`);
      return id;
    } catch (err) {
      return rejectWithValue(failMsg(err, "Failed to approve campaign"));
    }
  }
);

export const rejectCampaign = createAsyncThunk(
  "campaigns/rejectCampaign",
  async (id, { rejectWithValue }) => {
    try {
      await api.put(`/campaigns/${id}/reject`);
      return id;
    } catch (err) {
      return rejectWithValue(failMsg(err, "Failed to reject campaign"));
    }
  }
);

export const deleteCampaign = createAsyncThunk(
  "campaigns/deleteCampaign",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/campaigns/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(failMsg(err, "Failed to delete campaign"));
    }
  }
);

export const clickCampaign = createAsyncThunk(
  "campaigns/clickCampaign",
  async (id, { rejectWithValue }) => {
    try {
      await api.post(`/campaigns/${id}/click`);
      return id;
    } catch (err) {
      return rejectWithValue(failMsg(err, "Failed to register click"));
    }
  }
);

export const buyCampaign = createAsyncThunk(
  "campaigns/buyCampaign",
  async (id, { rejectWithValue }) => {
    try {
      await api.post(`/campaigns/${id}/buy`);
      return id;
    } catch (err) {
      return rejectWithValue(failMsg(err, "Failed to buy campaign"));
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const campaignSlice = createSlice({
  name: "campaigns",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCampaigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchActiveCampaigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchActiveCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCampaign.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(approveCampaign.fulfilled, (state, action) => {
        const campaign = state.items.find((c) => c.id === action.payload);
        if (campaign) campaign.status = "ACTIVE";
      })
      .addCase(rejectCampaign.fulfilled, (state, action) => {
        const campaign = state.items.find((c) => c.id === action.payload);
        if (campaign) campaign.status = "REJECTED";
      })
      .addCase(deleteCampaign.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      })
      .addCase(clickCampaign.fulfilled, (state, action) => {
        const campaign = state.items.find((c) => c.id === action.payload);
        if (campaign) campaign.clickCount = (campaign.clickCount || 0) + 1;
      })
      .addCase(buyCampaign.fulfilled, (state, action) => {
        const campaign = state.items.find((c) => c.id === action.payload);
        if (campaign) campaign.buyCount = (campaign.buyCount || 0) + 1;
      });
  },
});

export default campaignSlice.reducer;