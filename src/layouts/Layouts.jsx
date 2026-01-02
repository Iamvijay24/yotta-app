import React, { useState } from 'react';
import { Layout } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from './Siderbar';
import HeaderComponent from './Header';
import { useAuth } from '../shared/api';

const { Content } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledContent = styled(Content)`
  overflow: initial;
`;

const ContentWrapper = styled.div`
  padding: 24px 0;
  background: #ffffff;
  border-radius: 8px;
  min-height: 860px;
`;

const MainLayout = styled(Layout)`
  margin-left: ${(props) => (props.$collapsed ? '80px' : '260px')};
  transition: margin-left 0.3s ease;
  border: 2px solid #f9f3f3ff;

  @media (max-width: 768px) {
    margin-left: 260px;
  }
`;

const Layouts = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const location = useLocation();

  const isCoursePlayer = location.pathname.includes('/courses/') && location.pathname.includes('/play');

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (isCoursePlayer) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#000' }}>
        <Outlet />
      </div>
    );
  }

  // ✅ Otherwise render full layout
  return (
    <StyledLayout hasSider>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <MainLayout $collapsed={collapsed}>
        <HeaderComponent onLogout={handleLogout} />
        <StyledContent>
          <ContentWrapper>
            <Outlet />
          </ContentWrapper>
        </StyledContent>
      </MainLayout>
    </StyledLayout>
  );
};

export default Layouts;
