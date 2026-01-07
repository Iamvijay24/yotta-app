import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DashboardAPI } from '../../../../services/dashboard.services';

export const fetchAllCourses = createAsyncThunk(
  'dashboard/fetchAllCourses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await DashboardAPI.getAllCourses();
      if (Array.isArray(response)) return response;
      if (Array.isArray(response.courses)) return response.courses;
      return [];
    } catch (error) {
      console.error('Error fetching courses:', error);
      return rejectWithValue(error.response?.data || 'Failed to fetch courses');
    }
  }
);

export const fetchCourseStructure = createAsyncThunk(
  'dashboard/fetchCourseStructure',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await DashboardAPI.getCourseStructure(courseId);
      if (!response || !response.course)
        return rejectWithValue({ status: 404, message: 'Course not found' });
      return { courseId, data: response };
    } catch (error) {
      console.error('Error fetching course structure:', error);
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || 'Failed to fetch course structure';
      return rejectWithValue({ status, message });
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    courses: [],
    courseStructures: {},
    courseStructureLoading: {},
    courseStructureErrors: {},
    status: 'idle',
    error: null,
  },
  reducers: {
    clearCourses: (state) => {
      state.courses = [];
      state.status = 'idle';
      state.error = null;
    },
    clearCourseStructure: (state, action) => {
      const courseId = action.payload;
      delete state.courseStructures[courseId];
      delete state.courseStructureLoading[courseId];
      delete state.courseStructureErrors[courseId];
    },
    clearAllCourseStructures: (state) => {
      state.courseStructures = {};
      state.courseStructureLoading = {};
      state.courseStructureErrors = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Courses
      .addCase(fetchAllCourses.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllCourses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.courses = action.payload;
      })
      .addCase(fetchAllCourses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Fetch Course Structure
      .addCase(fetchCourseStructure.pending, (state, action) => {
        const id = action.meta.arg;
        state.courseStructureLoading[id] = true;
        state.courseStructureErrors[id] = null;
      })
      .addCase(fetchCourseStructure.fulfilled, (state, action) => {
        const { courseId, data } = action.payload;
        state.courseStructureLoading[courseId] = false;
        state.courseStructures[courseId] = data;
      })
      .addCase(fetchCourseStructure.rejected, (state, action) => {
        const id = action.meta.arg;
        state.courseStructureLoading[id] = false;
        state.courseStructureErrors[id] = action.payload;
      });
  },
});

export const { clearCourses, clearCourseStructure, clearAllCourseStructures } =
  dashboardSlice.actions;

export default dashboardSlice.reducer;
