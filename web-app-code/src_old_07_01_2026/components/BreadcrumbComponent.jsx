import React from 'react';
import { Breadcrumb, theme } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
const { useToken } = theme;

const BreadcrumbWrapper = styled.div`
  padding: 12px 0px;
  border-bottom: 2px solid #f0f2f5;
  margin-bottom: 20px;
`;
const StyledBreadcrumb = styled(Breadcrumb)`
  .ant-breadcrumb-separator {
    color: ${props => props.theme.colorTextTertiary};
    font-weight: 400;
    margin: 0 2px;
    transition: color 0.2s ease;
  }
  .ant-breadcrumb-link {
    transition: color 0.2s ease;
    letter-spacing: -0.03em;
    
    &:hover {
      color: ${props => props.theme.colorPrimaryHover} !important;
    }
  }
  .ant-breadcrumb-item {
    letter-spacing: -0.03em;
  }
  .ant-breadcrumb-item-last > .ant-breadcrumb-separator {
    display: none;
  }
`;
const BreadcrumbComponent = ({ style }) => {
  const navigate = useNavigate();
  const { token } = useToken();
  const items = useSelector((state) => state.breadcrumb.items);
  const handleBreadcrumbClick = (path) => {
    if (path) {
      navigate(path);
    }
  };
  return (
    <BreadcrumbWrapper style={style}>
      <StyledBreadcrumb
        separator={<RightOutlined style={{ fontSize: '10px', color: token.colorTextTertiary }} />}
        items={items.map((item, index) => ({
          title: (
            <span
              style={{
                color: index === items.length - 1 ? '#2388ff' : '#323A57',
                cursor: index < items.length - 1 ? 'pointer' : 'default',
                fontWeight: index === items.length - 1 ? 550 : 550,
                transition: 'color 0.2s ease',
                fontFamily: "'Inter', sans-serif",
                letterSpacing: '-0.03em',
                fontSize: '13px',
              }}
              onClick={() => index < items.length - 1 && handleBreadcrumbClick(item.path)}
            >
              {item.title}
            </span>
          ),
        }))}
      />
    </BreadcrumbWrapper>
  );
};
export default BreadcrumbComponent;