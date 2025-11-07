// File: services/dashboard.services.js
import { makeApiRequest } from '../config/api';

// Fetch all courses
export const DashboardAPI = {
  getAllCourses() {
    return makeApiRequest('GET', 'courses');
  },
  // NEW: Fetch course structure by ID
  getCourseStructure(courseId) {
    return makeApiRequest('GET', `courses/${courseId}/structure`);
  },
};
