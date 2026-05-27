import { useCallback, useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Result, Spin } from 'antd';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PaymentAPI } from '../services/payment.services';

const PaymentStatus = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get('status');
  const courseId = queryParams.get('courseId');

  const [loading, setLoading] = useState(true);
  const hasVerified = useRef(false);

  const handleRedirect = useCallback(() => {
    setTimeout(() => {
      if (status === 'success') {
        navigate(`/courses/${courseId}/play`);
      } else if (status === 'failed') {
        navigate(`/courses/${courseId}`);
      } else {
        navigate('/courses');
      }
    }, 3000);
  }, [courseId, navigate, status]);

  const verifyPayment = useCallback(
    async (verifiedCourseId, sessionId) => {
      try {
        await PaymentAPI.getCourseVerified(verifiedCourseId, sessionId);
      } catch (error) {
        console.error('Error verifying payment:', error);
      } finally {
        setLoading(false);
        handleRedirect();
      }
    },
    [handleRedirect],
  );

  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    const checkPaymentStatus = async () => {
      const storedSession = await AsyncStorage.getItem('session_id');
      const storedCourse = await AsyncStorage.getItem('course_id');

      // Clean up payment session IDs from storage after reading
      await AsyncStorage.removeItem('session_id');
      await AsyncStorage.removeItem('course_id');

      if (storedSession && storedCourse) {
        verifyPayment(storedCourse, storedSession);
      } else {
        setLoading(false);
        handleRedirect();
      }
    };

    checkPaymentStatus();
  }, [handleRedirect, verifyPayment]);

  const renderStatus = () => {
    if (loading) {
      return <Spin size="large" tip="Processing payment..." />;
    }

    if (status === 'success') {
      return (
        <Result
          status="success"
          title="Payment Successful!"
          subTitle="Verifying payment and redirecting..."
        />
      );
    }

    return (
      <Result
        status="error"
        title="Payment Failed!"
        subTitle="Verifying and redirecting back to course overview..."
      />
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        flexDirection: 'column',
      }}
    >
      {renderStatus()}
    </div>
  );
};

export default PaymentStatus;
