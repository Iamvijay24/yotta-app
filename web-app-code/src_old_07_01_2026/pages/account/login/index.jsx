import { useState } from 'react';
import { Form, Input, Button, Checkbox, message, Typography, Modal } from 'antd';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { MailOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
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
const RememberForgotContainer = styled.div``;
const ForgotLink = styled(Link)``;
const SubmitButton = styled(Button)``;
const LinkSection = styled.div``;
const FloatingShape = styled.div``;
const FrameImage = styled.img``;
const VerificationModal = styled(Modal)``;
const VerificationCodeInput = styled(Input)``;
const VerificationInfo = styled.div``;
const ResendButton = styled(Button)``;

const Login = () => {
  const [emailLoading, setEmailLoading] = useState(false);
  const [verificationModalVisible, setVerificationModalVisible] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  
  const { login, verifyEmail, resendVerificationCode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/my-progress';

  const handleFinish = async (values) => {
    setEmailLoading(true);
    setTempPassword(values.password);
    setUserEmail(values.email);
    try {
      await login(values.email, values.password);
      message.success("Login successful!");
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      
      if (error.code === "UserNotFoundException") {
        message.error("User not found. Please check your email.");
      } else if (error.code === "NotAuthorizedException") {
        message.error("Incorrect password. Please try again.");
      } else if (error.code === "UserNotConfirmedException") {
        try {
          await resendVerificationCode(values.email);
          message.success("Verification code resent to your email. Please check your inbox.");
        } catch (resendError) {
          console.error("Resend error:", resendError);
          message.error("Failed to resend code. Please try signup again.");
        }
        setVerificationModalVisible(true);
      } else if (error.message === "NEW_PASSWORD_REQUIRED") {
        message.error("New password required. Please check your email.");
      } else {
        message.error("Login failed. Please try again.");
      }
    } finally {
      setEmailLoading(false);
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
      message.success("Email verified successfully!");
      setVerificationModalVisible(false);
      setVerificationCode('');
      
      if (tempPassword) {
        try {
          await login(userEmail, tempPassword);
          message.success("Login successful!");
          navigate(from, { replace: true });
        } catch (retryError) {
          console.error("Retry login error:", retryError);
          message.warning("Email verified! Please login again manually.");
        }
        setTempPassword('');
      }
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
      <LeftSection className={styles.leftSectionLogin}>
        <LogoContainer className={styles.logoContainerLogin}>
          <img src={Logo} alt="Yotta Logo" aria-label="Yotta Logo" />
        </LogoContainer>
        
        <FormContainer className={styles.formContainer}>
          <AuthTitle className={styles.authTitle}>Welcome Back</AuthTitle>
          <Subtitle className={styles.subTitle}>Hey, welcome back to your special place</Subtitle>
          
          <StyledForm
            name="login"
            onFinish={handleFinish}
            layout="vertical"
            requiredMark={false}
            className={styles.styledForm}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="user@gmail.com"
                autoComplete="email"
                aria-label="Email address"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your password"
                autoComplete="current-password"
                aria-label="Password"
              />
            </Form.Item>
            <ForgotLink to="/forgot" aria-label="Forgot Password" className={styles.forgotLink}>
              Forgot Password?
            </ForgotLink>
            <Form.Item>
              <SubmitButton 
                type="primary" 
                htmlType="submit" 
                loading={emailLoading} 
                className={styles.submitButton}
              >
                Sign In
              </SubmitButton>
            </Form.Item>
          </StyledForm>
          <LinkSection className={styles.linkSection}>
            Don't have an account?
            <Link to="/register" aria-label="Sign Up">Sign Up</Link>
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

export default Login;