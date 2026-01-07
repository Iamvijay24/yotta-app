// components/SearchCourseCard.jsx
import React from 'react';
import styled from 'styled-components';
import { CheckCircleFilled } from '@ant-design/icons';
import { theme } from '../shared/store/theme/index';

const CardContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-bottom: 8px;
  width: 100%;
  box-sizing: border-box;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const Thumbnail = styled.img`
  width: 60px;
  height: 40px;
  object-fit: fit;
  border-radius: 4px;
  flex-shrink: 0;
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  margin-left: 12px;
`;

const TitleContainer = styled.div`
  flex: 1;
  color: ${theme.colors.textPrimary};
  font-family: ${theme.fonts.family};
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  word-break: break-word;
  margin-right: 8px;
`;

const CheckIcon = styled(CheckCircleFilled)`
  color: #10b981;
  font-size: 16px;
  flex-shrink: 0;
`;

const SearchCourseCard = ({ course, onClick, isEnrolled }) => {
  return (
    <CardContainer onClick={onClick}>
      <Thumbnail src={course.thumbnail} alt={course.title} />
      <ContentWrapper>
        <TitleContainer>{course.title}</TitleContainer>
        {isEnrolled && <CheckIcon />}
      </ContentWrapper>
    </CardContainer>
  );
};

export default SearchCourseCard;