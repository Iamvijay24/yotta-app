// layouts/Header.jsx
import React, { useState } from 'react';
import { Layout, Button, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import SearchBarComponent from '../components/SearchBarComponent';
import { LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../shared/api/AuthContext';
import Confirmation from '../components/Confirmation';

const { Header } = Layout;
const StyledHeader = styled(Header)`
  padding: 0;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 30;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;
const HeaderContent = styled.div`
  padding: 0 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  @media (min-width: 768px) {
    padding: 0 24px;
  }
`;
const CenterSection = styled.div`
  display: none;
  flex: 1;
  max-width: 300px;
  margin: 0 10px;
  @media (min-width: 768px) {
    display: flex;
  }
`;
const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  @media (min-width: 768px) {
    gap: 10px;
  }
`;
const IconButton = styled(Button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 40px;
  border-radius: 50%;
  border: none;
  box-shadow: none;
  background-color: transparent;
  &:hover {
    background-color: #0a0ef6ff;
  }
  svg {
    font-size: 20px;
    color: #1f2937;
  }
`;

const HeaderComponent = ({ toggleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (import.meta.env.DEV) console.log('Search query:', query);
  };

  const handleLogoutClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmLogout = () => {
    logout();
    navigate('/login', { replace: true });
    setShowConfirm(false);
  };

  const handleCancelLogout = () => {
    setShowConfirm(false);
  };

  return (
    <div>
      <StyledHeader>
        <HeaderContent>
          <CenterSection>
            <SearchBarComponent
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search courses, workshops, or content..."
            />
          </CenterSection>
          <RightSection>
            <Tooltip
              title="Logout"
              placement="bottom"
              overlayInnerStyle={{ color: '#b2b6bcff' }}
              mouseEnterDelay={0.05}
              mouseLeaveDelay={0.05}
            >
              <IconButton type="text" icon={<LogoutOutlined />} onClick={handleLogoutClick} />
            </Tooltip>
          </RightSection>
        </HeaderContent>
      </StyledHeader>
      <Confirmation
        visible={showConfirm}
        onCancel={handleCancelLogout}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
};

export default HeaderComponent;
