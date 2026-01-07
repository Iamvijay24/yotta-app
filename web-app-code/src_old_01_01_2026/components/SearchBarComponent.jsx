// components/SearchBarComponent.jsx
import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const StyledSearch = styled(Input)`
  width: 100%;
  max-width: 400px;
  border-radius: 8px;
  
  .ant-input {
    border-radius: 8px;
  }

  &:hover, &:focus, &.ant-input-affix-wrapper-focused {
    border-color: #3b82f6;
  }
`;

const SearchBarComponent = ({ value, onChange, placeholder = "Search courses, workshops, or content..." }) => {
  return (
    <StyledSearch
      placeholder={placeholder}
      prefix={<SearchOutlined />}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      size="large"
      allowClear
    />
  );
};

export default SearchBarComponent;