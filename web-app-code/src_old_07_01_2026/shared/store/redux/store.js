// redux/store.js (updated)
import { configureStore } from '@reduxjs/toolkit';
import breadcrumbReducer from './slices/breadcrumbSlice';
import dashboardReducer from './slices/dashboardSlice';
import enrolledReducer from './slices/enrolledSlice'; // New import

const store = configureStore({
  reducer: {
    breadcrumb: breadcrumbReducer,
    dashboard: dashboardReducer,
    enrolled: enrolledReducer, // New reducer
  },
});

export default store;