// components/Sidebar.jsx (updated - integrated Confirmation modal for logout)
import React, { useState, useEffect } from 'react';
import { Menu, Avatar, Button, Space, Typography, Tooltip } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  BookOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import styles from './layout.module.scss';
import Logo from '../assets/Logo_main2.png'
import Logo1 from '../assets/Logo1.png'
import { useAuth } from '../shared/api/AuthContext';
import { TbLayoutSidebarLeftCollapseFilled, TbLayoutSidebarLeftExpandFilled, TbLayoutSidebarRightExpandFilled } from "react-icons/tb";
import Confirmation from '../components/Confirmation';

const { Text, Title } = Typography;

const StyledSider = styled.div`
  overflow: auto;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: ${props => props.$collapsed ? '80px' : '260px'};
  background-color: #F9FAFC;
  scrollbar-width: thin;
  scrollbar-color: #d1d5db #f9fafb;
  transition: width 0.3s ease;
  z-index: 1000;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #f9fafb;
  }
  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
  
  @media (max-width: 768px) {
    width: ${props => props.$mobileOpen ? '260px' : '0'};
    transform: translateX(${props => props.$mobileOpen ? '0' : '-100%'});
    box-shadow: ${props => props.$mobileOpen ? '2px 0 8px rgba(0,0,0,0.15)' : 'none'};
  }
`;

const TopContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.$collapsed ? '24px 16px' : '24px 16px'};
  
  @media (max-width: 768px) {
    justify-content: space-between;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  justify-content: flex-end;
  flex-shrink: 0;
  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`;

const CollapsedLogoWrapper = styled.div`
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoImage = styled.img`
  transition: opacity 0.2s ease;
  opacity: ${props => (props.$isHovered ? 0 : 1)};
  pointer-events: ${props => (props.$isHovered ? 'none' : 'auto')};
  position: relative;
  z-index: 2;
`;

const ExpandIconWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${props => (props.$isHovered ? 1 : 0)};
  pointer-events: none;
  transition: opacity 0.2s ease;
  font-size: 20px;
  color: #1890ff;
  z-index: 3;
`;

const ToggleButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ToggleButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  width: 36px;
  padding: 0;
  color: #6b7280;
  font-size: 18px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background-color: white;
  
  .anticon {
    font-size: 18px;
  }
  
  &:hover {
    color: #1890ff;
    border-color: #1890ff;
    background-color: #f0f7ff;
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  transition: all 0.2s ease;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const ProfileCard = styled.div`
  margin: 0 16px 16px 16px;
  padding: 12px;
  background-color: ${props => props.$collapsed ? 'none' : 'white'};
  border-radius: 8px;
  box-shadow: ${props => props.$collapsed ? 'none' : '0 1px 3px rgba(0,0,0,0.1)'};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  @media (max-width: 768px) {
    flex-direction: row;
    text-align: left;
  }
`;

const ProfileInfo = styled.div`
  display: ${props => props.$collapsed ? 'flex' : 'none'};
  flex-direction: column;
  align-items: center;
  width: 100%;
  @media (max-width: 768px) {
    display: none;
  }
`;

const ProfileInfoExpanded = styled.div`
  display: ${props => props.$collapsed ? 'none' : 'flex'};
  align-items: center;
  gap: 12px;
  width: 100%;
  @media (max-width: 768px) {
    display: flex;
  }
`;

const LogoutContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px ${props => props.$collapsed ? '16px' : '16px'};
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;
  @media (max-width: 768px) {
    padding: 16px 16px;
  }
`;

const StyledMenu = styled(Menu)`
  && {
    background-color: transparent;
    border: none;
    padding: 0 16px;
  }
  .ant-menu-item {
    transition: background-color 0.2s ease;
  }
`;

const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (collapsed) {
      setIsLogoHovered(false);
    }
  }, [collapsed]);

  const pathToKey = {
    '/': '1',
    '/my-progress': '1',
    '/courses': '2',
    '/support': '3',
  };

  const getCurrentKey = () => {
    const pathname = location.pathname;
    if (pathname.startsWith('/my-progress/')) {
      return '1';
    }
    if (pathname.startsWith('/courses')) {
      return '2';
    }
    if (pathname.startsWith('/support')){
      return '3'
    }
    return '1';
  };

  const currentKey = getCurrentKey();

  const createMenuItem = (key, icon, label) => {
    if (collapsed) {
      return {
        key,
        label: (
          <Tooltip
            title={label}
            placement="right"
            styles={{ body: { color: '#b2b6bcff', fontSize: '13px' } }}
            mouseEnterDelay={0.15}
            mouseLeaveDelay={0.05}
            destroyOnHidden={false}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                cursor: 'pointer',
              }}
            >
              {icon}
            </div>
          </Tooltip>
        ),
      };
    }
    // Expanded state — regular label
    return {
      key,
      icon,
      label,
    };
  };

  const menuItems = [
    {
      key: 'main-menu',
      type: 'group',
      label: collapsed ? null : 'MAIN MENU',
      children: [
        createMenuItem('1', <DashboardOutlined />, 'My Progress'),
        createMenuItem('2', <BookOutlined />, 'Explore Courses'),
        createMenuItem('3', <PieChartOutlined />, 'Support'),
      ],
    },
  ];

  const handleMenuClick = ({ key }) => {
    const routes = {
      '1': '/my-progress',
      '2': '/courses',
      '3': '/support',
    };
   
    navigate(routes[key]);
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

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleLogoClick = () => {
    if (collapsed) {
      setCollapsed(false);
    }
  };

  const userName = user?.name || 'User Name';
  const userEmail = user?.email || 'user@gmail.com';
  const shortName = userName.split(' ')[0];

  return (
    <>
      <StyledSider $collapsed={collapsed} $mobileOpen={!collapsed}>
        <TopContainer $collapsed={collapsed}>
          <LogoContainer onClick={handleLogoClick}>
            {collapsed ? (
              <Tooltip
                title={isLogoHovered ? "Expand Sidebar" : null}
                placement="right"
                overlayInnerStyle={{ color: '#b2b6bcff' }}
                mouseEnterDelay={0.1}
                mouseLeaveDelay={0.1}
              >
                <CollapsedLogoWrapper
                  onMouseEnter={() => setIsLogoHovered(true)}
                  onMouseLeave={() => setIsLogoHovered(false)}
                >
                  <LogoImage
                    src={Logo1}
                    alt="YOTTA Logo"
                    style={{ width: '40px', height: '40px', cursor: 'pointer' }}
                    $isHovered={isLogoHovered}
                  />
                  <ExpandIconWrapper $isHovered={isLogoHovered}>
                    <TbLayoutSidebarLeftExpandFilled />
                  </ExpandIconWrapper>
                </CollapsedLogoWrapper>
              </Tooltip>
            ) : (
              <img
                src={Logo}
                alt="YOTTA Logo"
                style={{ width: '140px', height: '55px' }}
              />
            )}
          </LogoContainer>
          {!collapsed && (
            <ToggleButtonContainer>
              <Tooltip
                title="Collapse Sidebar"
                placement="right"
                overlayInnerStyle={{ color: '#b2b6bcff' }}
                mouseEnterDelay={0.1}
                mouseLeaveDelay={0.1}
              >
                <ToggleButton
                  type="default"
                  icon={<TbLayoutSidebarRightExpandFilled />}
                  onClick={toggleCollapse}
                />
              </Tooltip>
            </ToggleButtonContainer>
          )}
        </TopContainer>
        <ProfileCard $collapsed={collapsed}>
          <ProfileInfo $collapsed={collapsed}>
            <Avatar size={40} icon={<UserOutlined />} style={{ backgroundColor: '#d1d5db' }} />
            <div style={{ marginTop: '8px' }}>
              <div style={{ fontSize: '12px', fontWeight: 500, color: '#1f2937' }}>{shortName}</div>
            </div>
          </ProfileInfo>
          
          <ProfileInfoExpanded $collapsed={collapsed}>
            <Avatar size={40} icon={<UserOutlined />} style={{ backgroundColor: '#d1d5db' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Text style={{ fontSize: '14px', fontWeight: 500, color: '#1f2937' }}>{userName}</Text>
              <Text style={{ fontSize: '12px', color: '#6b7280' }}>{userEmail}</Text>
            </div>
          </ProfileInfoExpanded>
        </ProfileCard>
        <StyledMenu
          mode="inline"
          selectedKeys={[currentKey]}
          items={menuItems}
          onClick={handleMenuClick}
          className={styles.antMenuOverride}
          inlineCollapsed={collapsed}
          overflowedIndicator={null}
        />
        <LogoutContainer $collapsed={collapsed}>
          <Tooltip
            title={collapsed ? "Logout Account" : ""}
            placement="right"
            styles={{ body: { color: '#b2b6bcff', fontSize: '13px' } }}
            mouseEnterDelay={0.15}
            mouseLeaveDelay={0.05}
            destroyOnHidden={false}
          >
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogoutClick}
              style={{
                width: '100%',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'flex-start',
                color: '#6b7280',
                fontSize: '14px',
                marginBottom: '10px',
                transition: 'all 0.2s ease',
              }}
            >
              {!collapsed && 'Logout Account'}
            </Button>
          </Tooltip>
        </LogoutContainer>
      </StyledSider>
      <Confirmation
        visible={showConfirm}
        onCancel={handleCancelLogout}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};

export default Sidebar;