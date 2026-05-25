// File: services/payment.services.js
import { makeApiRequest } from '../config/api';

export const PaymentAPI = {
  purchaseCourse(data) {
    return makeApiRequest('POST', 'payment', data);
  },

  getCourseVerified(courseId, sessionId) {
    return makeApiRequest('GET', `payment/${courseId}/${sessionId}`);
  },
};
