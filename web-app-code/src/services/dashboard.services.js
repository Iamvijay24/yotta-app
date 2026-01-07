import { makeApiRequest } from '../config/api';

export const DashboardAPI = {
  getAllCourses() {
    return makeApiRequest('GET', 'courses');
  },
  getCourseStructure(courseId) {
    return makeApiRequest('GET', `courses/${courseId}/structure`);
  }
};