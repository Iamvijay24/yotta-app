// courseOverview/components/TableOfContents.jsx
import React from 'react';
import styled from 'styled-components';
import { Typography, Collapse } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import styles from './../CourseOverview.module.scss'
const { Title, Text } = Typography;
const { Panel } = Collapse;
const TocSection = styled.div``;
const TocHeader = styled.div``;
const TocTitle = styled.div``;
const TotalLessonsText = styled.div``;
const StyledCollapse = styled(Collapse)`
  &.ant-collapse {
    border-radius: var(--radius-md);
    background: var(--background-muted);
    border: none !important;
    .ant-collapse-item {
      border: none !important;
      border-radius: var(--radius-md);
      margin-bottom: 3px;
      overflow: hidden;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .ant-collapse-header {
      padding: var(--padding-sm) var(--font-size-sm) !important;
      font-family: var(--font-family);
      font-weight: var(--font-weight-medium);
      font-size: var(--font-size-md);
      color: var(--text-secondary);
      background: transparent !important;
      border: none !important;
      &:hover {
        background: var(--background-secondary);
      }
    }
    .ant-collapse-content {
      background: transparent !important;
      border: none !important;
    }
    .ant-collapse-content-box {
      padding: 0 !important;
    }
  }
`;
const SectionPanel = styled(Panel)`
  .ant-collapse-header {
    background: transparent;
  }
`;
const LessonList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;
const LessonItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--padding-sm) var(--gap-xl);
  &:hover {
    background: var(--surface-hover);
  }
`;
const LessonContent = styled.div`
  display: flex;
  align-items: center;
  gap: var(--gap-md);
  flex: 1;
`;
const LessonName = styled(Text)`
  &.ant-typography {
    font-family: var(--font-family);
    font-weight: var(--font-weight-light);
    font-size: var(--font-size-base);
    line-height: var(--line-height-relaxed);
    color: var(--text-tertiary);
  }
`;
const LessonDuration = styled(Text)`
  &.ant-typography {
    font-family: var(--font-family);
    font-weight: var(--font-weight-light);
    font-size: var(--font-size-base);
    line-height: var(--line-height-relaxed);
    color: var(--text-tertiary);
  }
`;
const EmptyLessons = styled.div`
  padding: var(--gap-xl);
  text-align: center;
  color: var(--text-muted);
  font-size: var(--font-size-md);
`;
const ExpandIcon = styled(DownOutlined)`
  &.rotated {
    transform: rotate(180deg);
  }
`;
const Icon = styled.span`
  font-size: var(--font-size-base);
  color: var(--icon-secondary);
`;
const VideoIcon = styled.div`
  font-size: 13px;
  color: #565C72;
`;
const ArticleIcon = styled.div`
  font-size: 13px;
  color: #565C72;
`;
const QuizIcon = styled.div`
  font-size: 13px;
  color: #565C72;
`;
const TableOfContents = ({
  sections,
  activeKey,
  setActiveKey,
  videoDurations,
  totalLessons,
  getIcon
}) => {
  return (
    <TocSection className={styles.tocSection}>
      <TocHeader className={styles.tocHeader}>
        <TocTitle  className={styles.tocTitle}>COURSE TABLE OF CONTENTS</TocTitle>
        <TotalLessonsText className={styles.totalLessonsText}>{totalLessons} Lessons</TotalLessonsText>
      </TocHeader>
      <StyledCollapse
        activeKey={activeKey}
        onChange={setActiveKey}
        expandIcon={({ isActive }) => <ExpandIcon className={isActive ? 'rotated' : ''} />}
        expandIconPosition="end"
      >
        {sections.map((section) => (
          <SectionPanel header={section.title} key={section.key}>
            <LessonList>
              {section.lessons.map((lesson, lIdx) => (
                <LessonItem key={lesson.id || `${section.key}_${lIdx}`}>
                  <LessonContent>
                    {getIcon(lesson.type)}
                    <LessonName>{lesson.title}</LessonName>
                  </LessonContent>
                  <LessonDuration>
                    {videoDurations[lesson.id] ?? '—'}
                  </LessonDuration>
                </LessonItem>
              ))}
              {section.lessons.length === 0 && (
                <EmptyLessons>
                  Content coming soon...
                </EmptyLessons>
              )}
            </LessonList>
          </SectionPanel>
        ))}
      </StyledCollapse>
    </TocSection>
  );
};
TableOfContents.propTypes = {
  sections: PropTypes.array.isRequired,
  activeKey: PropTypes.array.isRequired,
  setActiveKey: PropTypes.func.isRequired,
  videoDurations: PropTypes.object.isRequired,
  totalLessons: PropTypes.number.isRequired,
  getIcon: PropTypes.func.isRequired,
};
export default TableOfContents;