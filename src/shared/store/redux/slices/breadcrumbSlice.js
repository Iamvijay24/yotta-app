import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const breadcrumbSlice = createSlice({
  name: 'breadcrumb',
  initialState,
  reducers: {
    setBreadcrumb: (state, action) => {
      state.items = action.payload;
    },
    clearBreadcrumb: (state) => {
      state.items = [];
    },
  },
});

export const { setBreadcrumb, clearBreadcrumb } = breadcrumbSlice.actions;
export default breadcrumbSlice.reducer;