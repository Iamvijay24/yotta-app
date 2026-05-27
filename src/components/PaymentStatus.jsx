import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Result, Spin } from 'antd';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PaymentAPI } from '../services/payment.services';

const PaymentStatus = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const status = useMemo(() => queryParams.get('status'), [queryParams]);
  const courseId = useMemo(() => queryParams.get('courseId'), [queryParams]);

  const [loading, setLoading] = useState(true);
  const hasVerified = useRef(false);
  const redirectTimeoutRef = useRef(null);

  // Refs to capture current values for the setTimeout callback,
  // preventing stale closure over status, courseId, and navigate.
  const statusRef = useRef(status);
  const courseIdRef = useRef(courseId);
  const navigateRef = useRef(navigate);

  // Keep refs in sync with the latest values on each render.
  statusRef.current = status;
  courseIdRef.current = courseId;
  navigateRef.current = navigate;

  const handleRedirect = useCallback(() => {
    // Clear any previously scheduled redirect
    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current);
    }

    redirectTimeoutRef.current = setTimeout(() => {
      // Read from refs to always get the latest values
      const currentStatus = statusRef.current;
      const currentCourseId = courseIdRef.current;
      const currentNavigate = navigateRef.current;

      if (currentStatus === 'success') {
        currentNavigate(`/courses/${currentCourseId}/play`);
      } else if (currentStatus === 'failed') {
        currentNavigate(`/courses/${currentCourseId}`);
      } else {
        currentNavigate('/courses');
      }
    }, 3000);
  }, []); // No dependencies needed — we read from refs inside the callback

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

  // Clean up the pending redirect timeout on unmount to prevent
  // stale navigations to unmounted components
  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

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
