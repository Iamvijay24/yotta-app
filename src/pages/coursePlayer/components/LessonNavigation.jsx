// pages/course_player/components/LessonNavigation.jsx
import React, { useState } from 'react';
import { Typography } from 'antd';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../../shared/store/theme/index';
import styles from '../CoursePlayer.module.scss';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Star,
  User,
  ClipboardCheck,
  Eye,
  Target,
  Users,
  Clock,
  Globe,
  Award,
  Zap
} from 'lucide-react';
const { Title, Text, Paragraph } = Typography;

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.3); }
  50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.6); }
  100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.3); }
`;
const NavigationContainer = styled.div``;

const ProgressBarContainer = styled.div``;

const ProgressBar = styled.div`
  height: 100%;
  background: linear-gradient(90deg, ${theme.colors.primary}, #3b82f6);
  border-radius: ${theme.radii.full};
  transition: width 0.3s ease;
  animation: ${glow} 2s ease-in-out infinite;
`;
const CompactNavButtons = styled.div``;

const TopicIndicator = styled.div``;

const CompactNavButton = styled.button``;

const ContentCard = styled.div``;

const TabsContainer = styled.div``;

const Tab = styled.button`
  flex: 1;
  padding: 16px 24px;
  background: none;
  border: none;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-family: ${theme.fonts.family};
  gap: 8px;
  color: ${props => props.$active ? theme.colors.primary : theme.colors.textSecondary};
  border-bottom: 0px solid ${props => props.$active ? theme.colors.borderDark : 'transparent'};
  margin-bottom: -2px;
  transition: all ${theme.transitions.slow};

  &:hover {
    color: ;
    barder-bottom: none;
    transform: translateY(-1px);
  }

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
`;
const ContentSection = styled.div``;

const SectionTitle = styled(Title)`
  && {
    font-family: ${theme.fonts.family};
    font-size: 16px;
    color: ${theme.colors.textPrimary};
    font-wieght: ;
    display: flex;
    align-items: center;
    gap: 5px;
  }
`;

const SectionIcon = styled.div``;

const DescriptionText = styled(Paragraph)`
  && {
    color: ${theme.colors.textTertiary};
    font-family: ${theme.fonts.family};
    line-height: 1.7;
    font-size: 14px;
    margin-bottom: 0;
    margin-left: 10px;
  }
`;
const RequirementsList = styled.ul``;

const RequirementItem = styled.li``;

const LearningsList = styled.ul``;

const LearningItem = styled.li``;

const InfoRow = styled.div``;

const InfoLabel = styled(Text)`
  && {
    color: ${theme.colors.textSecondary};
    font-family: ${theme.fonts.family};
    font-weight: 400;
    display: flex;
    align-items: center;
    font-size: 13px;
    gap: 6px;
  }
`;

const InfoValue = styled(Text)`
  && {
    color: ${theme.colors.textPrimary};
    font-weight: 400;
    font-family: ${theme.fonts.family};
    font-size: 13px;
  }
`;

const SkillTag = styled.span``;

const ActionButton = styled.button``;

const LessonNavigation = ({
  currentTopicData,
  currentTopic,
  totalTopics,
  handlePrevious,
  handleNext,
  courseData
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  // Extract course info from nested structure
  const course = courseData?.course || courseData;
  const isFirstTopic = currentTopic === 0;
  const isLastTopic = currentTopic === totalTopics - 1;
  const progress = ((currentTopic + 1) / totalTopics) * 100;
  return (
    <NavigationContainer className={styles.navigationContainer}>
      <ProgressBarContainer className={styles.progressBarContainer}>
        <ProgressBar style={{ width: `${progress}%` }} />
      </ProgressBarContainer>
      <CompactNavButtons className={styles.compactNavButtons}>
        <CompactNavButton
          onClick={handlePrevious}
          disabled={isFirstTopic}
          aria-label="Previous lesson"
          className={styles.compactNavButton}
        >
          <ChevronLeft size={16} />
          <span>Previous</span>
        </CompactNavButton>
        
        <TopicIndicator className={styles.topicIndicator}>
          Topics: {currentTopic + 1}/{totalTopics}
        </TopicIndicator>
        
        <CompactNavButton
          onClick={handleNext}
          disabled={isLastTopic}
          aria-label="Next lesson"
          className={styles.compactNavButton}
        >
          <span>Next</span>
          <ChevronRight size={16} />
        </CompactNavButton>
      </CompactNavButtons>
      <ContentCard className={styles.contentCard}>
        <TabsContainer className={styles.tabsContainer}>
          <Tab
            $active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
          >
            <Eye size={18} />
            Course Overview
          </Tab>
          <Tab
            $active={activeTab === 'skills'}
            onClick={() => setActiveTab('skills')}
          >
            <Target size={18} />
            Skills Gained
          </Tab>
          <Tab
            $active={activeTab === 'instructor'}
            onClick={() => setActiveTab('instructor')}
          >
            <User size={18} />
            Instructor
          </Tab>
          <Tab
            $active={activeTab === 'requirements'}
            onClick={() => setActiveTab('requirements')}
          >
            <ClipboardCheck size={18} />
            Requirements
          </Tab>
        </TabsContainer>
        <ContentSection className={styles.contentSection}>
          {activeTab === 'overview' && (
            <>
              <SectionTitle level={4}>
                <SectionIcon className={styles.sectionIcon}>
                  <BookOpen size={16} />
                </SectionIcon>
                Course Overview
              </SectionTitle>
              <DescriptionText >
                {course?.description || currentTopicData?.description || 'No description available.'}
              </DescriptionText>
              
              {course?.learnings && course.learnings.length > 0 && (
                <>
                  <SectionTitle level={4}>
                    <SectionIcon className={styles.sectionIconSmall}>
                      <Star size={16} />
                    </SectionIcon>
                    What you'll learn
                  </SectionTitle>
                  <LearningsList className={styles.learningsList}>
                    {course.learnings.map((learning, index) => (
                      <LearningItem key={index} className={styles.learningItem}>{learning}</LearningItem>
                    ))}
                  </LearningsList>
                </>
              )}
            </>
          )}
          {activeTab === 'skills' && (
            <>
              <SectionTitle level={4}>
                <SectionIcon className={styles.sectionIcon}>
                  <Star size={16} />
                </SectionIcon>
                Skills You'll Gain
              </SectionTitle>
              <DescriptionText>
                Complete this course to develop essential skills in {course?.category_name || 'this field'}.
              </DescriptionText>
              {course?.tags && course.tags.length > 0 && (
                <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {course.tags.map((tag, index) => (
                    <SkillTag key={index} className={styles.skillTag}>
                      <Zap size={14} />
                      {tag}
                    </SkillTag>
                  ))}
                </div>
              )}
            </>
          )}
          {activeTab === 'instructor' && (
            <>
              <SectionTitle level={4}>
                <SectionIcon className={styles.sectionIcon}>
                  <User size={16} />
                </SectionIcon>
                Instructor
              </SectionTitle>
              <DescriptionText>
                Instructor : {course?.instructor_name || 'Yotta Academy'}
              </DescriptionText>
              <div style={{ marginTop: 10 }}>
                <InfoRow className={styles.infoRow}>
                  <InfoLabel>
                    <Star size={13} />
                    Course Rating
                  </InfoLabel>
                  <InfoValue>{course?.rating || 'N/A'} </InfoValue>
                </InfoRow>
                <InfoRow className={styles.infoRow}>
                  <InfoLabel>
                    <Users size={13} />
                    Total Reviews
                  </InfoLabel>
                  <InfoValue>{course?.reviews || 0}</InfoValue>
                </InfoRow>
                <InfoRow className={styles.infoRow}>
                  <InfoLabel>
                    <Users size={13} />
                    Students Enrolled
                  </InfoLabel>
                  <InfoValue>{course?.students || 0}</InfoValue>
                </InfoRow>
              </div>
            </>
          )}
          {activeTab === 'requirements' && (
            <>
              <SectionTitle level={4}>
                <SectionIcon className={styles.sectionIcon}>
                  <ClipboardCheck size={16} />
                </SectionIcon>
                Requirements
              </SectionTitle>
              {course?.requirements && course.requirements.length > 0 ? (
                <RequirementsList className={styles.requirementsList}>
                  {course.requirements.map((req, index) => (
                    <RequirementItem key={index} className={styles.requirementItem}>{req} </RequirementItem>
                  ))}
                </RequirementsList>
              ) : (
                <DescriptionText>No specific requirements listed for this course.</DescriptionText>
              )}
              
              
            </>
          )}
        </ContentSection>
      </ContentCard>
    </NavigationContainer>
  );
};
export default LessonNavigation;
