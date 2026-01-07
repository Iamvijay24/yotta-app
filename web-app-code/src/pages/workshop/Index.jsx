import React from 'react'
import { Empty } from 'antd';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;

  .ant-empty {
    transform: scale(1.5);
  }
`;

const Index = () => {
  return (
    <Container>
      <Empty />
    </Container>
  )
}

export default Index
