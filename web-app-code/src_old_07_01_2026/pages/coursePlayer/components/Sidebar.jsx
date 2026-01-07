// pages/course_player/components/Sidebar.jsx (UPDATED WITH STYLED COMPONENTS)
import React, { useMemo, useEffect, useRef } from 'react';
import { Progress, Collapse, Typography } from 'antd';
import { ArrowLeft, Sparkles, Trophy, BookOpen } from 'lucide-react';
import styled from 'styled-components';
import styles from '../CoursePlayer.module.scss';
import { DownOutlined } from '@ant-design/icons';
import LessonItem from './LessonItem';
const { Text } = Typography;
const { Panel } = Collapse;

const SidebarWrapper = styled.div``;
const SidebarHeader = styled.div``;
const BackButton = styled.button``;
const ProgressSection = styled.div``;
const ProgressHeader = styled.div``;
const ProgressTitle = styled(Text)``;
const ProgressBadge = styled.div``;
const ProgressStats = styled(Text)``;
const StyledProgress = styled(Progress)``;
const SidebarContent = styled.div``;
const ContentHeading = styled.div``;
const TopicsList = styled.div``;
const StyledCollapse = styled(Collapse)``;
const SectionLabel = styled.div``;
const SectionTitle = styled(Text)``;
const TopicsCount = styled(Text)``;

const Sidebar = ({
  sections,
  activeKey,
  setActiveKey,
  allTopics,
  currentTopicId,
  handleTopicClick,
  progressPercentage,
  completedTopics,
  totalTopics,
  courseData,
  navigate,
  progressMap,
}) => {
  // Track if the user has manually interacted with the collapse
  const isManualInteractionRef = useRef(false);
  const prevTopicIdRef = useRef(null);
  const activeTopicId = useMemo(() => {
    if (allTopics && allTopics.length > 0) {
      if (currentTopicId) return currentTopicId;
      return allTopics[0]?.id;
    }
    return null;
  }, [allTopics, currentTopicId]);
  // Find which section contains the active topic
  const activeSectionKey = useMemo(() => {
    if (!sections || !activeTopicId) return null;
   
    const section = sections.find(section =>
      section.lessons.some(lesson => lesson.id === activeTopicId)
    );
   
    return section?.key || null;
  }, [sections, activeTopicId]);
  useEffect(() => {
   
    if (activeSectionKey && activeTopicId !== prevTopicIdRef.current) {
      isManualInteractionRef.current = false;
     
      setActiveKey([activeSectionKey]);
      prevTopicIdRef.current = activeTopicId;
    }
  }, [activeSectionKey, activeTopicId, setActiveKey]);
  const handleCollapseChange = (keys) => {
    isManualInteractionRef.current = true;
    setActiveKey(keys);
  };
  const items = useMemo(() => {
    if (!sections || sections.length === 0) return [];
    return sections.map(section => ({
      key: section.key,
      label: (
        <SectionLabel className={styles.sectionLabel}>
          <SectionTitle className={styles.sectionTitles}>{section.title}</SectionTitle>
          {section.lessons.length > 0 && (
            <TopicsCount className={styles.topicsCount}>
              {section.lessons.length} {section.lessons.length === 1 ? 'topic' : 'topics'}
            </TopicsCount>
          )}
        </SectionLabel>
      ),
      children: section.lessons.length > 0 ? (
        <>
          {section.lessons.map((lesson) => {
            const fullTopic = allTopics?.find(t => t.id === lesson.id);
            const completed = progressMap[lesson.id]?.completed || fullTopic?.completed || lesson.completed || false;
            const progress = progressMap[lesson.id]?.percentage || 0;
            return (
              <LessonItem
                key={lesson.id}
                onClick={() => handleTopicClick(lesson.id)}
                completed={completed}
                progress={progress}
                title={lesson.title || lesson.name || 'Unnamed Topic'}
                type={lesson.type}
                isActive={activeTopicId === lesson.id}
              />
            );
          })}
        </>
      ) : null
    }));
  }, [sections, allTopics, activeTopicId, handleTopicClick, progressMap]);
  return (
    <SidebarWrapper className={styles.sidebarWrapper}>
      <SidebarHeader className={styles.sidebarHeader}>
        <BackButton className={styles.backButton} onClick={() => navigate(`/my-progress`, { state: { course: courseData } })}>
          <ArrowLeft size={18} strokeWidth={2.5} />
          <span>Back to Course</span>
        </BackButton>
         
        <ProgressSection className={styles.progressSection}>
          <ProgressHeader className={styles.progressHeader}>
            <ProgressTitle className={styles.progressTitle}>
              <Sparkles size={16} />
              Course Progress
            </ProgressTitle>
            <ProgressBadge className={styles.progressBadge}>
              <Trophy size={12} />
              {progressPercentage}%
            </ProgressBadge>
          </ProgressHeader>
         
          <StyledProgress
            className={styles.styledProgress}
            percent={progressPercentage}
            size="small"
            showInfo={false}
          />
         
          <ProgressStats className={styles.progressStats}>
            <BookOpen size={14} />
            {completedTopics} of {totalTopics} topics completed
          </ProgressStats>
        </ProgressSection>
      </SidebarHeader>
      <SidebarContent className={styles.sidebarContent}>
        <ContentHeading className={styles.contentHeading}>
          <BookOpen size={18} strokeWidth={2.5} />
          Course Content
        </ContentHeading>
         
        <TopicsList className={styles.topicsList}>
          <StyledCollapse
            className={styles.styledCollapse}
            activeKey={activeKey}
            onChange={handleCollapseChange}
            items={items}
            expandIcon={({ isActive }) => <DownOutlined rotate={isActive ? 180 : 0} />}
            expandIconPosition="end"
          />
        </TopicsList>
      </SidebarContent>
    </SidebarWrapper>
  );
};
export default Sidebar;