import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";


export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }
);


export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", loginData);
      localStorage.setItem("access_token", response.data.access_token);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }
);


export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  localStorage.removeItem("access_token");
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("access_token") || null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.access_token;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.token = null;
      });
  },
});

export default authSlice.reducer;
