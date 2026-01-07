import React from 'react';
import { Typography, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../../../shared/store/theme/index';
import styles from '../MyProgress.module.scss';
import Img1 from '../../../assets/course1.jpg'

const { Text } = Typography;

const CourseCard = styled.div``;

const CourseImage = styled.img``;

const CourseContent = styled.div``;

const ProgressInfo = styled.div``;

const ProgressBarWrapper = styled.div``;

const AIBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  padding: 4px 10px;
  border-radius: var(--radius-xs);
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  
  span {
    font-family: var(--font-family);
    font-size: 11px;
    font-weight: 500;
    color: white;
    text-transform: uppercase;
    letter-spacing: var(--letter-spacing-small);
  }
  
  &::before {
    content: '✨';
    font-size: 11px;
  }
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background-color: ${theme.colors.success};
  border-radius: 50px;
  width: ${props => props.width}%;
  transition: width 0.3s ease;
`;

const ContinueButton = styled(Button)`
  width: 100%;
  margin-top: 4px;
  height: 32px;
  background-color: ${theme.colors.success};
  border: none;
  border-radius: ${theme.radii.sm};
  color: white;
  font-family: ${theme.fonts.family};
  font-weight: ${theme.fonts.weights.medium};
  font-size: ${theme.fonts.sizes.sm};
  transition: ${theme.transitions.base};
  flex-shrink: 0;

  &:hover {
    background-color: ${theme.colors.successHover} !important;
    color: white !important;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const EnrolledCard = ({ course, continueState = {} }) => {
  const navigate = useNavigate();
  const handleContinueLearning = (e) => {
    e.stopPropagation();
    navigate(`/courses/${course.id}/play`, { state: { course, ...continueState } });
  };
  const roundedProgress = parseFloat((course.progress || 0).toFixed(2));

  const hasAIAssistance = course.AI_exists || course.ai_enabled || course.aiAssistance ;
  // Ensure fallback for thumbnail directly in src to avoid load issues
  const thumbnailSrc = course.thumbnail || Img1;
  return (
    <CourseCard className={styles.courseCard}>
      <div className={styles.imageContainer}>
        <CourseImage
        className={styles.courseImage}
        src={thumbnailSrc}
        alt={course.title || 'Course thumbnail'}
        onError={(e) => {
          // If even fallback fails, set a placeholder or data URL
          e.target.src = Img1;
          e.target.onerror = null; // Prevent loop
        }}
        />
        {hasAIAssistance && (
          <AIBadge>
            <span>AI Tutor</span>
          </AIBadge>
        )}
      </div>
      
      <CourseContent className={styles.courseContent}>
        <Text className={styles.courseAuthor}>By {course.author || 'Yotta Academy'}</Text>
        <Text className={styles.courseTitle}>{course.title}</Text>
        <ProgressInfo className={styles.progressInfo}>
          <Text className={styles.progressText}>{roundedProgress || 0}%</Text>
          <Text className={styles.lectureText}>{course.currentLecture || 0}/{course.totalLectures || 0} lectures</Text>
        </ProgressInfo>
        <ProgressBarWrapper className={styles.progressBarWrapper}>
          <ProgressBarFill width={roundedProgress || 0} />
        </ProgressBarWrapper>
        <ContinueButton onClick={handleContinueLearning}>
          Continue Learning
        </ContinueButton>
      </CourseContent>
    </CourseCard>
  );
};

export default EnrolledCard;