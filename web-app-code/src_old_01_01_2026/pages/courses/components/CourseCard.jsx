import { StarFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import styles from '../Courses.module.scss';
import Img1 from '../../../assets/course1.jpg';

const CardContainer = styled.div``;
const ImageContainer = styled.div``;
const CategoryBadge = styled.div``;
const Content = styled.div``;
const MetaSection = styled.div``;
const AuthorSection = styled.div``;
const ByText = styled.div``;
const Author = styled.div``;
const RatingSection = styled.div``;
const Title = styled.div``;
const Description = styled.div``;

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

const EnrollButton = styled.button`
  width: 100%;
  height: var(--button-height-md);
  margin-top: auto;
  font-family: var(--font-family);
  font-weight: var(--font-weight-semi-bold);
  font-size: var(--font-size-md);
  border: none;
  border-radius: var(--radius-sm);
  color: white;
  transition: var(--transition-base);
  background-color: var(--secondary);
  
  &.enrolled {
    background-color: var(--success);
    &:hover {
      background-color: var(--success-hover) !important;
    }
  }
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(43, 122, 251, 0.4);
    color: white !important;
    background-color: var(--secondary) !important;
  }
  
  &:active {
    transform: translateY(0);
  }
  
  :global(.ant-btn) {
    &:hover {
      color: white !important;
    }
  }
`;

const CourseCard = ({ course, isEnrolled = false, navState = {} }) => {
  const navigate = useNavigate();
  const buttonText = isEnrolled ? 'Enrolled' : 'Enroll Now';
  const courseId = course.course_id || course.id;
  
  const handleEnrollClick = (e) => {
    e.stopPropagation();
    const state = {
      ...(isEnrolled ? { course } : {}),
      ...navState
    };
    const path = isEnrolled ? `/courses/${courseId}/play` : `/courses/${courseId}`;
    navigate(path, { state });
  };
  
  const handleCardClick = () => {
    const state = {
      ...(isEnrolled ? { course } : {}),
      ...navState
    };
    const path = isEnrolled ? `/courses/${courseId}/play` : `/courses/${courseId}`;
    navigate(path, { state });
  };
  
  
  const hasAIAssistance = course.AI_exists || course.ai_enabled || course.aiAssistance;
  
  return (
    <CardContainer className={styles.cardContainer} onClick={handleCardClick}>
      <ImageContainer className={styles.imageContainer}>
        <img 
          className={styles.courseImage} 
          src={course.thumbnail} 
          alt={course.title} 
          onError={(e) => { e.target.src = Img1; }}
        />
        <CategoryBadge className={styles.categoryBadge}>
          {course.tags && course.tags.length > 0 ? course.tags[0] : 'Uncategorized'}
        </CategoryBadge>
        {hasAIAssistance && (
          <AIBadge>
            <span>AI Tutor</span>
          </AIBadge>
        )}
      </ImageContainer>
      <Content className={styles.content}>
        <MetaSection className={styles.metaSection}>
          <AuthorSection className={styles.authorSection}>
            <ByText className={styles.byText}>By</ByText>
            <Author className={styles.author}>Yotta Academy</Author>
          </AuthorSection>
          <RatingSection className={styles.ratingSection}>
            <StarFilled className={styles.starIcon} />
            <div className={styles.rating}>{course.rating}/5</div>
          </RatingSection>
        </MetaSection>
        <Title className={styles.title}>{course.title}</Title>
        <Description className={styles.description}>{course.description}</Description>
        <EnrollButton 
          className={isEnrolled ? 'enrolled' : ''} 
          onClick={handleEnrollClick}
        >
          {buttonText}
        </EnrollButton>
      </Content>
    </CardContainer>
  );
};

export default CourseCard;