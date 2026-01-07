import React, { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Typography } from "antd";
import { PaymentAPI } from "../services/payment.services";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

const PaymentStatus = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status");
  const courseId = queryParams.get("courseId");
  const isDiscount = queryParams.get("discount") === "true";

  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const hasVerified = useRef(false);

  const verifyPayment = useCallback(async(courseId, sessionId, status) => {
    try {
      await PaymentAPI.getCourseverified(courseId, sessionId);
    } catch (error) {
      console.error("Error verifying payment:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    const storedSession = localStorage.getItem("session_id");
    const storedCourse = localStorage.getItem("course_id");

    if (storedSession && storedCourse) {
      verifyPayment(storedCourse, storedSession, status);
    } else {
      setLoading(false);
    }
  }, [courseId, status, verifyPayment]);

  useEffect(() => {
    if (loading) return;

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          if (status === "success") {
            // For 100% discount enrollments, go home
            if (isDiscount) {
              navigate('/my-progress');
            } else {
              navigate(`/courses/${courseId}/play`);
            }
          } else if (status === "failed") {
            navigate(`/courses/${courseId}`);
          } else {
            navigate("/courses");
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [loading, status, courseId, navigate, isDiscount]);

  return (
    <div style={styles.container}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={styles.card}
      >
        {loading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={{
              width: 50,
              height: 50,
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #3498db',
              borderRadius: '50%',
              margin: '0 auto',
            }}
          />
        ) : status === "success" ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, ease: "backOut" }}
          >
            <svg
              width="100"
              height="100"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10" stroke="#52c41a" strokeWidth="2" fill="#e6f7e6" />
              <path d="M8 12l3 3 5-5" stroke="#52c41a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        ) : (
          <motion.div
            animate={{ x: [0, -5, 5, -5, 5, 0] }}
            transition={{ duration: 0.5 }}
            style={{ display: 'inline-block' }}
          >
            <svg
              width="100"
              height="100"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10" stroke="#ff4d4f" strokeWidth="2" fill="#ffe6e6" />
              <path d="M8 8l8 8M16 8l-8 8" stroke="#ff4d4f" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </motion.div>
        )}

        <Title level={3} style={{ marginTop: 16 }}>
          {loading
            ? "Processing Payment"
            : status === "success"
              ? "Payment Successful 🎉"
              : "Payment Failed ❌"}
        </Title>

        <Text type="secondary">
          {loading
            ? "Please wait while we verify your payment"
            : `You’ll be redirected shortly... (${countdown}s)`}
        </Text>
      </motion.div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8fafc, #eef2ff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    background: "#fff",
    padding: "40px 32px",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
    width: 380,
  },
};

export default PaymentStatus;
