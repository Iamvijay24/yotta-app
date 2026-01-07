import { makeApiRequest } from '../config/api';


export const PaymentAPI = {
  purchaseCourse(data) {
    return makeApiRequest('POST', 'payment', data);
  },

  getCourseverified(courseId, sessionId) {
    return makeApiRequest('GET', `payment/${courseId}/${sessionId}`);
  }
};