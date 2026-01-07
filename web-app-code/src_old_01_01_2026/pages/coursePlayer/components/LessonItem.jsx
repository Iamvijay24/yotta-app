// pages/course_player/components/LessonItem.jsx (UPDATED WITH STYLED COMPONENTS)
import React from 'react';
import { Typography, Progress } from 'antd';
import { CheckCircle2, PlayCircle, FileText, HelpCircle } from 'lucide-react';
import styled from 'styled-components';
import styles from '../CoursePlayer.module.scss';
const { Text } = Typography;

const LessonItemWrapper = styled.div``;
const LessonIcon = styled.div``;
const LessonInfo = styled.div``;
const LessonTitle = styled(Text)``;
const StyledProgressItem = styled(Progress)` 
  .ant-progress-inner {
    background: #F0F2F5 !important;
    border-radius: 12px;
    overflow: hidden;
    height: 3px !important;
  }

  .ant-progress-bg {
    background: #60a5fa !important;
    border-radius: 12px;
    height: 3px !important;
    box-shadow: 0 1px 4px rgba(35, 136, 255, 0.3);
  }

  .ant-progress-text {
    font-size: 10px !important;
    color: #666f8d !important;
    font-weight: 400 !important;
  }`;

const LessonItem = ({ onClick, completed, progress = 0, title, type, isActive }) => {
  const getIcon = () => {
    if (completed) {
      return <CheckCircle2 size={18} strokeWidth={2.5} />;
    }
   
    switch (type) {
      case 'video':
        return <PlayCircle size={18} strokeWidth={2.5} />;
      case 'article':
        return <FileText size={18} strokeWidth={2.5} />;
      case 'quiz':
        return <HelpCircle size={18} strokeWidth={2.5} />;
      default:
        return <FileText size={18} strokeWidth={2.5} />;
    }
  };
  return (
    <LessonItemWrapper
      className={`${styles.lessonItemWrapper} ${isActive ? styles.active : ''}`}
      onClick={onClick}
    >
      <LessonIcon className={`${styles.lessonIcon} ${completed ? styles.completed : styles.incomplete}`}>
        {getIcon()}
      </LessonIcon>
     
      <LessonInfo className={styles.lessonInfo}>
        <LessonTitle className={styles.lessonTitle}>
          {title || 'Unnamed Topic'}
        </LessonTitle>
         
        {type === 'video' && progress > 0 && !completed && (
          <StyledProgressItem
            className={styles.progress}
            percent={progress}
            size="small"
            showInfo={true}
            style={{ marginTop: 4, marginBottom: 0 }}
          />
        )}
      </LessonInfo>
    </LessonItemWrapper>
  );
};
export default LessonItem;