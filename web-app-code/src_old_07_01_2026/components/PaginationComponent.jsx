// components/PaginationComponent.jsx
import React from 'react';
import { Pagination } from 'antd';
import styled from 'styled-components';

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
  padding: 20px 0;
`;

const PaginationComponent = ({ total, currentPage, onPageChange, pageSize }) => {
  return (
    <PaginationWrapper>
      <Pagination
        current={currentPage}
        total={total}
        pageSize={pageSize}
        onChange={onPageChange}
        showSizeChanger={false}
        showQuickJumper={false}
        showLessItems={true}
      />
    </PaginationWrapper>
  );
};

export default PaginationComponent;