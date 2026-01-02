import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { EnrolledAPI } from '../../../../services/enrolled.services.js';

export const fetchEnrolledCourses = createAsyncThunk(
  'enrolled/fetchEnrolledCourses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await EnrolledAPI.getEnrolledCourses();
      console.log(response);

      if (response.status === 'success') {
        const courseIds = [...new Set(response.courses.map(c => c.course_id))];
        const enrolledMap = Object.fromEntries(
          response.courses.map(c => [
            c.course_id,
            {
              progress: c.progress || 0,
              currentLecture: c.current_lecture || 0,
              enrollment_id: c.enrollment_id || `enr_${c.course_id}`,
            },
          ]),
        );
        return { courseIds, enrolledMap };
      } else {
        return rejectWithValue('No enrolled courses found');
      }
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      return rejectWithValue(
        error.response?.data || 'Failed to fetch enrolled courses',
      );
    }
  },
);

const enrolledSlice = createSlice({
  name: 'enrolled',
  initialState: {
    courseIds: [],
    enrolledMap: {},
    status: 'idle',
    error: null,
  },
  reducers: {
    clearEnrolled: state => {
      state.courseIds = [];
      state.enrolledMap = {};
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchEnrolledCourses.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchEnrolledCourses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.courseIds = action.payload.courseIds;
        state.enrolledMap = action.payload.enrolledMap;
      })
      .addCase(fetchEnrolledCourses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearEnrolled } = enrolledSlice.actions;
export default enrolledSlice.reducer;
