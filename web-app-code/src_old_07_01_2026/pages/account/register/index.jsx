import React, { useState } from 'react';
import { Form, Input, Button, message, Typography, Modal } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { UserOutlined, MailOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import Logo from '../../../assets/Logo_main.png';
import Frame from '../../../assets/Learning1.svg';
import { useAuth } from '../../../shared/api';
import styles from '../Account.module.scss';

const { Title, Text } = Typography;

const AuthPageContainer = styled.div``;
const LeftSection = styled.div``;
const RightSection = styled.div``;
const LogoContainer = styled.div``;
const FormContainer = styled.div``;
const AuthTitle = styled(Title)``;
const Subtitle = styled(Text)``;
const StyledForm = styled(Form)``;
const LinkSection = styled.div``;
const SubmitButton = styled(Button)``;
const FloatingShape = styled.div``;
const FrameImage = styled.img``;
const VerificationModal = styled(Modal)``;
const VerificationCodeInput = styled(Input)``;
const VerificationInfo = styled.div``;
const ResendButton = styled(Button)``;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [verificationModalVisible, setVerificationModalVisible] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();
  const { register, verifyEmail, resendVerificationCode } = useAuth();

  const handleFinish = async (values) => {
    setLoading(true);
    setUserEmail(values.email);
    try {
      await register(values.email, values.password, values.name);
      message.success("Registration successful! Please check your email for verification code.");
      setVerificationModalVisible(true);
    } catch (error) {
      console.error("Registration error:", error);
      
      if (error.code === "UsernameExistsException") {
        message.error("User already exists with this email.");
      } else if (error.code === "InvalidParameterException") {
        message.error("Invalid email format or password requirements not met.");
      } else {
        message.error("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      message.error("Please enter a valid 6-digit verification code.");
      return;
    }
    setVerificationLoading(true);
    try {
      await verifyEmail(userEmail, verificationCode);
      message.success("Email verified successfully! You can now login.");
      setVerificationModalVisible(false);
      setVerificationCode('');
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Verification error:", error);
      if (error.code === "CodeMismatchException") {
        message.error("Invalid verification code. Please try again.");
      } else if (error.code === "ExpiredCodeException") {
        message.error("Verification code has expired. Please request a new one.");
      } else {
        message.error("Verification failed. Please try again.");
      }
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    try {
      await resendVerificationCode(userEmail);
      message.success("Verification code sent to your email!");
    } catch (error) {
      console.error("Resend code error:", error);
      message.error("Failed to resend code. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleVerificationCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(value);
  };

  return (
    <AuthPageContainer className={styles.authPageContainer}>
      <LeftSection className={styles.leftSection}>
        <LogoContainer className={styles.logoContainer}>
          <img src={Logo} alt="Yotta Logo" aria-label="Yotta Logo" />
        </LogoContainer>
        
        <FormContainer className={styles.formContainer}>
          <AuthTitle className={styles.authTitle}>Join Yotta</AuthTitle>
          <Subtitle className={styles.subTitle}>Create your account to start your journey</Subtitle>
          
          <StyledForm
            name="register"
            onFinish={handleFinish}
            layout="vertical"
            size="large"
            requiredMark={false}
            className={styles.styledForm}
          >
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Please input your full name!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Full Name" />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <SubmitButton type="primary" htmlType="submit" loading={loading} className={styles.submitButton}>
                Sign Up
              </SubmitButton>
            </Form.Item>
          </StyledForm>
          <LinkSection className={styles.linkSection}>
            Already have an account? <Link to="/" aria-label="Log in">Log in</Link>
          </LinkSection>
        </FormContainer>
      </LeftSection>
      
      <RightSection className={styles.rightSection}>
        <FloatingShape className={styles.floatingShape} />
        <FloatingShape className={styles.floatingShape} />
        <FloatingShape className={styles.floatingShape} />
        <FrameImage src={Frame} alt="Learning Illustration" className={styles.frameImage} />
      </RightSection>
      
      <VerificationModal
        title={
          <div className={styles.modalTitleContainer}>
            <SafetyOutlined className={styles.modalIcon} />
            <Title level={3} className={styles.modalTitle}>Verify Your Email</Title>
          </div>
        }
        open={verificationModalVisible}
        onCancel={() => {
          setVerificationModalVisible(false);
          setVerificationCode('');
        }}
        footer={null}
        centered
        width={450}
        closable={false}
        className={styles.verificationModal}
      >
        <VerificationInfo className={styles.verificationInfo}>
          We've sent a 6-digit verification code to<br />
          <strong>{userEmail}</strong>
        </VerificationInfo>
        
        <VerificationCodeInput
          placeholder="000000"
          value={verificationCode}
          onChange={handleVerificationCodeChange}
          maxLength={6}
          autoFocus
          aria-label="Verification code"
          className={styles.verificationCodeInput}
        />
        
        <SubmitButton
          type="primary"
          onClick={handleVerificationSubmit}
          loading={verificationLoading}
          disabled={verificationCode.length !== 6}
          className={`${styles.submitButton} ${styles.verificationSubmitButton}`}
        >
          Verify Email
        </SubmitButton>
        
        <ResendButton
          type="text"
          onClick={handleResendCode}
          loading={resendLoading}
          className={styles.resendButton}
        >
          Didn't receive the code? Resend
        </ResendButton>
      </VerificationModal>
    </AuthPageContainer>
  );
};

export default Register;