// layouts/Header.jsx
import React, { useState } from 'react';
import { Layout, Button, Popover, Empty } from 'antd';
import styled from 'styled-components';
import SearchBarComponent from '../components/SearchBarComponent';
import { FaRegBell } from 'react-icons/fa';

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
  width: 40px;
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

const NotificationContainer = styled.div`
  width: 320px;
  max-height: 400px;
  overflow-y: auto;
`;

const NotificationHeader = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  font-family: Inter, sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: #10151bff;
`;

const EmptyNotificationContainer = styled.div`
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const EmptyText = styled.div`
  margin-top: 12px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  color: #6b7280;
  text-align: center;
`;

const HeaderComponent = ({ toggleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);

  const handleSearch = (query) => {
    setSearchQuery(query);
    console.log('Search query:', query);
  };

  const handleNotificationOpenChange = (open) => {
    setNotificationOpen(open);
  };

  const notificationContent = (
    <NotificationContainer>
      <NotificationHeader>Notifications</NotificationHeader>
      <EmptyNotificationContainer>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <EmptyText>
              No notifications yet
              <br />
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                We'll notify you when something arrives
              </span>
            </EmptyText>
          }
        />
      </EmptyNotificationContainer>
    </NotificationContainer>
  );

  return (
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
          <Popover
            content={notificationContent}
            trigger="click"
            placement="bottomRight"
            open={notificationOpen}
            onOpenChange={handleNotificationOpenChange}
            overlayStyle={{ paddingTop: '8px' }}
          >
            <IconButton type="text" icon={<FaRegBell />} />
          </Popover>
        </RightSection>
      </HeaderContent>
    </StyledHeader>
  );
};

export default HeaderComponent;