import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";


export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async () => {
    const response = await api.get("/orders/");
    return response.data;
  }
);


export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData) => {
    const response = await api.post("/orders/", orderData);
    return response.data;
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orders.push(action.payload);
      });
  },
});

export default ordersSlice.reducer;
