import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../shared/api';
import { Spin } from 'antd';
import styled from 'styled-components';
import { getCookie } from 'cookies-next';
import LoadSpinner from './LoadSpinner';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
`;

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const authToken = getCookie('idToken');
  const location = useLocation();

  if (loading) {
    return (
      <LoadingContainer>
        <LoadSpinner/>
      </LoadingContainer>
    );
  }

  if (isAuthenticated || authToken) {
    return children;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
