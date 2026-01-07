import React from 'react';
import { Typography, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { StarFilled } from '@ant-design/icons';
import styled from 'styled-components';
import { theme } from '../../../shared/store/theme/index';
import styles from '../MyProgress.module.scss';
import Img1 from '../../../assets/course1.jpg'

const { Text } = Typography;

const RecommendedCard = styled.div``;

const RecommendedImage = styled.img``;

const RecommendedContent = styled.div``;

const TopSection = styled.div``;

const RecommendedHeader = styled.div``;

const RatingSection = styled.div``;

const RatingStars = styled.div``;

const RecommendedInfo = styled.div``;

const BottomSection = styled.div``;

const EnrollButton = styled(Button)`
  width: 80px;
  height: ${theme.components.button.height.sm};
  color: white !important;
  border-radius: ${theme.radii.sm};
  font-family: ${theme.fonts.family};
  font-weight: ${theme.fonts.weights.medium};
  font-size: ${theme.fonts.sizes.base};
  transition: ${theme.transitions.base};

  &:hover {
    color: white !important;
    transform: scale(1.05);
  }

  ${props => props.$isEnrolled && `
    background-color: ${theme.colors.success};
    border: none;

    &:hover {
      background-color: ${theme.colors.successHover} !important;
      border-color: ${theme.colors.successHover} !important;
    }
  `}
`;

const LectureSection = styled.div``;

const RecommendedCardComponent = ({ course, isEnrolled = false, navState = {} }) => {
  const navigate = useNavigate();
  const handleEnrollClick = (e) => {
    e.stopPropagation();
    const courseId = course.course_id || course.id;
    const state = {
      ...(isEnrolled ? { course } : {}),
      ...navState
    };
    const path = isEnrolled ? `/courses/${courseId}/play` : `/courses/${courseId}`;
    navigate(path, { state });
  };
  const rating = course.rating || 4.5;
  const filledStars = Math.floor(rating);
  const buttonType = isEnrolled ? 'default' : 'primary';
  const buttonText = isEnrolled ? 'Enrolled' : 'Enroll';

  const formatDuration = (duration) => {
    if (!duration) return "0 hours";

    const [hh, mm] = duration.split(":");
    const hours = parseInt(hh, 10);
    const minutes = parseInt(mm, 10);

    const totalHours = minutes >= 30 ? hours + 0.5 : hours;

    return `${totalHours} hours`;
  };

  return (
    <RecommendedCard className={styles.recommendedCard}>
      <RecommendedImage
        className={styles.recommendedImage}
        src={course.thumbnail}
        alt={course.title}
        onError={(e) => { e.target.src = Img1; }}
      />
      <RecommendedContent className={styles.recommendedContent}>
        <TopSection className={styles.topSection}>
          <RecommendedHeader className={styles.recommendedHeader}>
            <Text className={styles.recommendedAuthor}>By Yotta Academy</Text>
            <RatingSection className={styles.ratingSection}>
              <RatingStars className={styles.ratingStars}>
                {[...Array(5)].map((_, i) => (
                  <StarFilled
                    key={i}
                    style={{ color: theme.colors.starYellow, opacity: i < filledStars ? 1 : 0.3 }}
                  />
                ))}
              </RatingStars>
            </RatingSection>
          </RecommendedHeader>
          <RecommendedInfo className={styles.recommendedInfo}>
            <Text className={styles.recommendedTitle}>{course.title}</Text>
            <Text className={styles.recommendedDescription}>{course.description}</Text>
          </RecommendedInfo>
        </TopSection>
        <BottomSection className={styles.bottomSection}>
          <EnrollButton $isEnrolled={isEnrolled} type={buttonType} onClick={handleEnrollClick}>{buttonText}</EnrollButton>
          <LectureSection className={styles.lectureSection}>
            {formatDuration(course.duration)} | {course.overall_lessons} lectures
          </LectureSection>
        </BottomSection>
      </RecommendedContent>
    </RecommendedCard>
  );
};

export default RecommendedCardComponent;