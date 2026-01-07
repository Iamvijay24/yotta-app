// courseOverview/components/CourseHeader.jsx
import React from 'react';
import styled from 'styled-components';
import { Typography } from 'antd';
import PropTypes from 'prop-types';

const { Title, Paragraph } = Typography;

const StyledCourseTitle = styled(Title)`
  &.ant-typography {
    margin-top: 20px;
    font-size: var(--font-size-h1);
    font-weight: var(--font-weight-semi-bold);
    color: #36394A;
    margin-bottom: var(--padding-sm) !important;
    line-height: 1.3;

    @media (max-width: var(--breakpoints-md)) {
      font-size: var(--font-size-h2);
    }
  }
`;

const StyledCourseSubtitle = styled(Paragraph)`
  &.ant-typography {
    font-size: var(--font-size-md);
    font-family: var(--font-family);
    color: var(--text-tertiary);
    line-height: 1.5;
    margin-bottom: var(--gap-3xl);
  }
`;

const CourseHeader = ({ title, description }) => {
  return (
    <>
      <StyledCourseTitle>{title}</StyledCourseTitle>
      <StyledCourseSubtitle>{description}</StyledCourseSubtitle>
    </>
  );
};

CourseHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default CourseHeader;