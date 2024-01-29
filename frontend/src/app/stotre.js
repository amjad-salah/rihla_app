import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/users/authSlice';
import { apiSlice } from '../features/api/apiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
