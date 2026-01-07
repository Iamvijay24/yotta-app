// courseOverview/components/SidebarFullCourse.jsx
import React from 'react';
import styled from 'styled-components';
import { Typography, Button } from 'antd';
import PropTypes from 'prop-types';
import { IoBookOutline, IoVolumeHigh } from 'react-icons/io5';
import { BiAbacus } from 'react-icons/bi';
import { PiClockUserBold} from 'react-icons/pi';
import { IoIosPeople } from 'react-icons/io';
import { FaMedal } from 'react-icons/fa';

const { Text } = Typography;

const StyledSidebarCards = styled.div`
  padding: 0;
  margin-bottom: var(--gap-3xl);
  border-bottom: 1px solid var(--border);
`;

const StyledFullCourseTitle = styled(Text)`
  &.ant-typography {
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-medium);
    color: var(--text-lighter);
    font-size: var(--font-size-md);
    text-transform: uppercase;
    margin-bottom: var(--gap-xl);
    display: block;
  }
`;

const StyledFullCourseStats = styled.div`
  display: flex;
  align-items: center;
  width: var(--course-overview-stats-container-width);
  padding: var(--padding-sm);
  margin-bottom: var(--gap-3xl);
  border: 1px solid var(--border-dark);
  border-radius: var(--radius-lg);
  position: relative;

  & > * {
    flex: 1;
    text-align: center;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 1px;
    background-color: var(--border-dark);
    transform: translateX(-50%);
  }
`;

const StyledStatContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--gap-xs);
  flex: 1;
  padding-left: var(--padding-xs);
`;

const StyledStatText = styled.div`
  display: flex;
  padding-left: var(--padding-md);
  flex-direction: column;
  align-items: center;
  gap: 0px;
`;

const StyledStatTitle = styled(Text)`
  &.ant-typography {
    font-weight: var(--font-weight-medium);
    font-size: var(--font-size-xs);
    line-height: var(--line-height-tight);
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 2px;
  }
`;

const StyledStatValue = styled(Text)`
  &.ant-typography {
    font-weight: var(--font-weight-medium);
    font-size: var(--font-size-xs);
    line-height: var(--line-height-tight);
    text-transform: uppercase;
    color: var(--text-secondary);
    margin: 0;
  }
`;

const StyledInfoItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: var(--padding-sm);
  gap: var(--gap-md);

  .infoLabel {
    font-family: var(--font-family);
    color: var(--text-tertiary);
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-light);
    line-height: var(--line-height-relaxed);
  }

  .infoValue {
    font-family: var(--font-family);
    color: var(--text-secondary);
    font-weight: var(--font-weight-medium);
    font-size: var(--font-size-md);
    line-height: var(--line-height-relaxed);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  .infoIcon {
    font-size: var(--font-size-md);
    color: var(--icon-primary);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const StyledEnrollSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--gap-2xl);
`;

const StyledEnrollBtn = styled(Button)`
  &.ant-btn {
    height: var(--button-height-lg);
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-medium);
    border: none;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-button-primary);
    color: white;
    margin: var(--gap-3xl) 0;
    background: var(--primary); /* your actual button color here */

    &.ant-btn-loading {
      background: var(--primary) !important;
      color: white !important;
    }

    .ant-btn-loading-icon .anticon {
      color: white !important;
      font-size: var(--font-size-xl);
    }

    &:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-button-primary-hover);
      background: var(--primary-hover);
    }
  }
`;

const StyledPriceSection = styled.div`
  display: flex;
  gap: var(--gap-md);
  background: var(--background-secondary);
  align-items: baseline;
`;

const StyledPriceCurrent = styled(Text)`
  &.ant-typography {
    font-family: var(--font-family);
    font-size: var(--font-size-4xl);
    font-weight: var(--font-weight-medium);
    color: var(--text-lighter);
    line-height: var(--line-height-relaxed);
    display: block;
  }
`;

const StyledPriceOriginal = styled(Text)`
  &.ant-typography {
    font-family: var(--font-family);
    font-size: var(--font-size-4xl);
    font-weight: var(--font-weight-medium);
    color: var(--text-lighter);
    line-height: var(--line-height-relaxed);
    text-decoration: line-through;
    display: block;
  }
`;

const StyledStatIcon = styled.div`
  font-size: var(--font-size-lg);
  color: var(--icon-primary);
`;

const StyledInfoIcon = styled.div`
  font-size: var(--font-size-2xl);
  color: var(--text-tertiary);
  
`;

const SidebarFullCourse = ({
  courseData,
  totalDurationFormatted,
  totalLessons,
  difficulty,
  language,
  handlePurchase,
  enrollLoading
}) => {

  const formatDuration = (duration) => {
    if (!duration) return "0 hours";

    const [hh, mm] = duration.split(":");
    const hours = parseInt(hh, 10);
    const minutes = parseInt(mm, 10);

    const totalHours = minutes >= 30 ? hours + 0.5 : hours;

    return `${totalHours} hours`;
  };
  return (
    <StyledSidebarCards>
      <StyledFullCourseTitle>Course Details</StyledFullCourseTitle>
      <StyledFullCourseStats>
        <StyledStatContainer>
          <StyledStatIcon as={IoBookOutline} />
          <StyledStatText>
            <StyledStatTitle>lessons</StyledStatTitle>
            <StyledStatValue>{totalLessons}</StyledStatValue>
          </StyledStatText>
        </StyledStatContainer>
        <StyledStatContainer>
          <StyledStatIcon as={BiAbacus} />
          <StyledStatText>
            <StyledStatTitle>difficulty</StyledStatTitle>
            <StyledStatValue>{difficulty}</StyledStatValue>
          </StyledStatText>
        </StyledStatContainer>
      </StyledFullCourseStats>
      <StyledInfoItem>
        <StyledInfoIcon as={IoIosPeople } />
        <span className="infoLabel">Students:</span>
        <span className="infoValue">{courseData.students}</span>
      </StyledInfoItem>
      <StyledInfoItem>
        <StyledInfoIcon as={IoVolumeHigh} />
        <span className="infoLabel">Language:</span>
        <span className="infoValue">{language}</span>
      </StyledInfoItem>
      <StyledInfoItem>
        <StyledInfoIcon as={PiClockUserBold} />
        <span className="infoLabel">Duration:</span>
        <span className="infoValue">{formatDuration(courseData.duration)}</span>
      </StyledInfoItem>
      <StyledEnrollSection>
        <StyledEnrollBtn
          type="primary"
          onClick={handlePurchase}
          loading={enrollLoading}
          disabled={enrollLoading}
        >
          {enrollLoading ? 'Processing...' : 'Enroll now'}
        </StyledEnrollBtn>
        <StyledPriceSection>
          <StyledPriceCurrent>₹{courseData.offerPrice}</StyledPriceCurrent>
          {courseData.oldPrice && Number(courseData.oldPrice) > Number(courseData.offerPrice) && (
            <StyledPriceOriginal>₹{courseData.oldPrice}</StyledPriceOriginal>
          )}
        </StyledPriceSection>
      </StyledEnrollSection>
    </StyledSidebarCards>
  );
};

SidebarFullCourse.propTypes = {
  courseData: PropTypes.object.isRequired,
  totalDurationFormatted: PropTypes.string,
  totalLessons: PropTypes.number.isRequired,
  difficulty: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  handlePurchase: PropTypes.func.isRequired,
  enrollLoading: PropTypes.bool.isRequired,
};

export default SidebarFullCourse;
