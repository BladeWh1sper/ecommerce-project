import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
import catalogReducer from '../features/catalog/catalogSlice';
import ordersReducer from '../features/orders/ordersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    catalog: catalogReducer,
    orders: ordersReducer,
  },
});
