import { makeApiRequest } from '../config/api';

export const TrackingAPI = {
  trackTopics(data) {
    return makeApiRequest('POST', 'track', data);
  },

  getEnrollmentProgress(enrollmentId) {
    return makeApiRequest('GET', `enrollment/${enrollmentId}`);
  },

  getAllCourseProgress(){
    return makeApiRequest('GET', `user/summary`)
  }
};
