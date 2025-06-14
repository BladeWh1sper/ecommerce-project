import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";


export const fetchProducts = createAsyncThunk("catalog/fetchProducts", async () => {
  const response = await api.get("/products/");
  return response.data;
});

export const fetchProductById = createAsyncThunk("catalog/fetchProductById", async (id) => {
  const response = await api.get(`/admin/products/${id}`);
  return response.data;
});

export const createProduct = createAsyncThunk("catalog/createProduct", async (product) => {
  const response = await api.post("/admin/products", product);
  return response.data;
});

export const updateProduct = createAsyncThunk("catalog/updateProduct", async ({ id, ...product }) => {
  const response = await api.patch(`/admin/products/${id}`, product);
  return response.data;
});

export const deleteProduct = createAsyncThunk("catalog/deleteProduct", async (id) => {
  await api.delete(`/admin/products/${id}`);
  return id;
});

const catalogSlice = createSlice({
  name: "catalog",
  initialState: {
    products: [],
    currentProduct: null,
    status: "idle",
    error: null,
  },
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.status = "loading"; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.currentProduct = action.payload;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const idx = state.products.findIndex(p => p.id === action.payload.id);
        if (idx !== -1) state.products[idx] = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p.id !== action.payload);
      });
  },
});

export const { clearCurrentProduct } = catalogSlice.actions;
export default catalogSlice.reducer;
