import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
`;

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  z-index: 9999;
  animation: ${fadeIn} 0.5s ease-out;
`;

const DotsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 1.5rem;
`;

const Dot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  animation: ${bounce} 1.4s ease-in-out infinite both;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);

  &:nth-child(1) {
    animation-delay: -0.32s;
  }

  &:nth-child(2) {
    animation-delay: -0.16s;
  }

  &:nth-child(3) {
    animation-delay: 0s;
  }
`;

const LoadingText = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #4a5568;
  text-align: center;
  letter-spacing: 0.5px;
  opacity: 0.9;
`;

const Subtitle = styled.div`
  font-size: 12px;
  color: #718096;
  margin-top: 0.5rem;
  opacity: 0.7;
  text-align: center;
  max-width: 280px;
  line-height: 1.4;
`;

const LoadSpinner = ({ text = 'Loading...', subtitle }) => {
  return (
    <Wrapper>
      <DotsContainer>
        <Dot />
        <Dot />
        <Dot />
      </DotsContainer>
      <LoadingText>{text}</LoadingText>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
    </Wrapper>
  );
};

export default LoadSpinner;
