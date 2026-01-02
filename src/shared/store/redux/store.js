// redux/store.js (updated)
import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './slices/dashboardSlice';
import enrolledReducer from './slices/enrolledSlice'; // New import

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    enrolled: enrolledReducer, // New reducer
  },
});
