import React, { useState } from 'react';
import { Form, Input, Button, message, Typography } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
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
const VerificationCodeInput = styled(Input)``;
const LinkSection = styled.div``;
const SubmitButton = styled(Button)``;
const FloatingShape = styled.div``;
const FrameImage = styled.img``;

const ForgotPassword = () => {
  const { forgotPassword, resetPassword } = useAuth();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = async (values) => {
    setLoading(true);
    try {
      await forgotPassword(values.email);
      message.success('Verification code sent to your email.');
      setEmail(values.email);
      setStep(2);
    } catch (error) {
      console.error('Forgot password error:', error);
      message.error('Failed to send reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values) => {
    setLoading(true);
    try {
      await resetPassword(email, values.code, values.newPassword);
      message.success('Password reset successfully! You can now log in.');
      navigate('/login');
    } catch (error) {
      console.error('Reset password error:', error);
      if (error.code === 'CodeMismatchException') {
        message.error('Invalid verification code.');
      } else if (error.code === 'ExpiredCodeException') {
        message.error('Code expired. Request a new one.');
      } else {
        message.error('Password reset failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageContainer className={styles.authPageContainer}>
      <LeftSection className={styles.leftSectionForgot}>
        <LogoContainer className={styles.logoContainer}>
          <img src={Logo} alt="Yotta Logo" aria-label="Yotta Logo" />
        </LogoContainer>
        
        <FormContainer className={styles.formContainer}>
          {step === 1 ? (
            <>
              <AuthTitle className={styles.authTitle}>Forgot Password</AuthTitle>
              <Subtitle className={styles.subTitle}>Enter your email to receive a reset code</Subtitle>
              <StyledForm
                name="forgot-password"
                onFinish={handleSendCode}
                layout="vertical"
                requiredMark={false}
                className={styles.styledForm}
              >
                <Form.Item
                  name="email"
                  rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
                >
                  <Input prefix={<MailOutlined />} placeholder="Enter your email" />
                </Form.Item>
                <Form.Item>
                  <SubmitButton type="primary" htmlType="submit" loading={loading} className={styles.submitButton}>
                    Send Verification Code
                  </SubmitButton>
                </Form.Item>
              </StyledForm>
            </>
          ) : (
            <>
              <AuthTitle level={2} className={styles.authTitle}>Reset Password</AuthTitle>
              <Subtitle className={styles.subTitle}>Enter the code and your new password</Subtitle>
              <StyledForm
                name="reset-password"
                onFinish={handleResetPassword}
                layout="vertical"
                requiredMark={false}
                className={styles.styledForm}
              >
                <Form.Item
                  name="code"
                  rules={[{ required: true, message: 'Please enter the verification code!' }]}
                >
                  <VerificationCodeInput
                    prefix={<SafetyOutlined />}
                    placeholder="000000"
                    maxLength={6}
                    className={styles.verificationCodeInput}
                  />
                </Form.Item>
                <Form.Item
                  name="newPassword"
                  rules={[
                    { required: true, message: 'Please enter your new password!' },
                    { min: 6, message: 'Password must be at least 6 characters!' },
                  ]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="New Password" />
                </Form.Item>
                <Form.Item>
                  <SubmitButton type="primary" htmlType="submit" loading={loading} className={styles.submitButton}>
                    Reset Password
                  </SubmitButton>
                </Form.Item>
              </StyledForm>
            </>
          )}
          <LinkSection className={styles.linkSection}>
            Remember your password? <Link to="/login" aria-label="Log in">Log in</Link>
          </LinkSection>
        </FormContainer>
      </LeftSection>
      
      <RightSection className={styles.rightSection}>
        <FloatingShape className={styles.floatingShape} />
        <FloatingShape className={styles.floatingShape} />
        <FloatingShape className={styles.floatingShape} />
        <FrameImage src={Frame} alt="Learning Illustration" className={styles.frameImage} />
      </RightSection>
    </AuthPageContainer>
  );
};

export default ForgotPassword;