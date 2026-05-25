import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Result, Spin } from "antd";
import { PaymentAPI } from "../services/payment.services";

const PaymentStatus = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status");
  const courseId = queryParams.get("courseId");

  const [loading, setLoading] = useState(true);
  const hasVerified = useRef(false);

  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    const storedSession = localStorage.getItem("session_id");
    const storedCourse = localStorage.getItem("course_id");

    if (storedSession && storedCourse) {
      verifyPayment(storedCourse, storedSession, status);
    } else {
      setLoading(false);
      handleRedirect(status, courseId);
    }
  }, []);

  const verifyPayment = async (courseId, sessionId, status) => {
    try {
      await PaymentAPI.getCourseVerified(courseId, sessionId);
    } catch (error) {
      console.error("Error verifying payment:", error);
    } finally {
      setLoading(false);
      handleRedirect(status, courseId);
    }
  };

  const handleRedirect = (status, courseId) => {
    setTimeout(() => {
      if (status === "success") {
        navigate(`/courses/${courseId}/play`);
      } else if (status === "failed") {
        navigate(`/courses/${courseId}`);
      } else {
        navigate("/courses");
      }
    }, 3000);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        flexDirection: "column",
      }}
    >
      {loading ? (
        <Spin size="large" tip="Processing payment..." />
      ) : status === "success" ? (
        <Result
          status="success"
          title="Payment Successful!"
          subTitle="Verifying payment and redirecting..."
        />
      ) : (
        <Result
          status="error"
          title="Payment Failed!"
          subTitle="Verifying and redirecting back to course overview..."
        />
      )}
    </div>
  );
};

export default PaymentStatus;
