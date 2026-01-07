import { StarFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import styles from '../Courses.module.scss';
import Img1 from '../../../assets/course1.jpg';
import { RiRobot3Line } from 'react-icons/ri';

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
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
  padding: 4px 9px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4), 0 0 20px rgba(236, 72, 153, 0.2);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(139, 92, 246, 0.5), 0 0 24px rgba(236, 72, 153, 0.3);
  }
  
  span {
    font-family: var(--font-family);
    font-size: 11px;
    font-weight: 600;
    color: white;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
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
            <RiRobot3Line style={{color: '#ffff', fontSize:'12px'}}/>
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
          {/* <RatingSection className={styles.ratingSection}>
            <StarFilled className={styles.starIcon} />
            <div className={styles.rating}>{course.rating}/5</div>
          </RatingSection> */}
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