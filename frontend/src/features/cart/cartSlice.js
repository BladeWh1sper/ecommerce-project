import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";


export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async () => {
    const response = await api.get("/cart/");
    return response.data;
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (item) => {
    const response = await api.post("/cart/", item);
    return response.data;
  }
);

export const deleteFromCart = createAsyncThunk(
  "cart/deleteFromCart",
  async (itemId) => {
    await api.delete(`/cart/${itemId}`);
    return itemId;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const existing = state.items.find(item => item.product_id === action.payload.product_id);
        if (existing) {
          existing.quantity = action.payload.quantity;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(deleteFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

export default cartSlice.reducer;
