import { makeApiRequest } from '../config/api';

export const EnrolledAPI = {
  getEnrolledCourses() {
    return makeApiRequest('GET', `user/enrollments`);
  }
};