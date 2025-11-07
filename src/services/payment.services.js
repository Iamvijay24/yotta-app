import { makeApiRequest } from '../config/api';

export const PaymentAPI = {
  purchaseCourse(data) {
    return makeApiRequest('POST', 'payment', data);
  },

  getCourseStructure(courseId) {
    return makeApiRequest('GET', `courses/${courseId}/structure`);
  },
};
