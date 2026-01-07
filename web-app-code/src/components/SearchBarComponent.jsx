// components/SearchBarComponent.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Input, Empty } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { fetchAllCourses } from '../shared/store/redux/slices/dashboardSlice';
import { fetchEnrolledCourses } from '../shared/store/redux/slices/enrolledSlice';
import { fetchCourseStructure } from '../shared/store/redux/slices/dashboardSlice';
import SearchCourseCard from './SearchCourseCard';
import { theme } from '../shared/store/theme/index';
import LoadSpinner from './LoadSpinner';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-8px);
  }
`;

const StyledSearch = styled(Input)`
  width: 100%;
  max-width: 400px;
  border-radius: 8px;
  .ant-input {
    border-radius: 8px;
  }
  &:hover, &:focus, &.ant-input-affix-wrapper-focused {
    border-color: #3b82f6;
  }
`;

const PageContainer = styled.div`
  color: ${theme.colors.textPrimary};
  font-family: ${theme.fonts.family};
  width: 100%;
  position: relative;
`;

const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px; 
`;

const ResultsDropdown = styled.div`
  position: absolute;
  top: 100%; 
  left: 0;
  right: 0;
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
  width: 700px;
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid #f0f0f0;
  margin-top: 4px;
  animation: ${props => props.$isClosing ? fadeOut : fadeIn} 0.2s ease-in-out;
  animation-fill-mode: forwards;
  
  /* Hide scrollbar */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  background: white;
  border-radius: 8px;
  width: 100%;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background: transparent;
`;

const SearchBarComponent = ({ 
  placeholder = "Search courses, workshops, or content...", 
  value: externalValue, 
  onChange: externalOnChange 
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [internalValue, setInternalValue] = useState(externalValue || '');
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const searchValue = externalValue !== undefined ? externalValue : internalValue;
  const dropdownRef = useRef(null);
  const searchWrapperRef = useRef(null);

  // Sync internal value with external if controlled
  useEffect(() => {
    if (externalValue !== undefined) {
      setInternalValue(externalValue);
    }
  }, [externalValue]);

  // Redux state
  const { courses: allCourses, status: dashboardStatus, error: dashboardError } = useSelector(
    (state) => state.dashboard || { courses: [], status: 'idle', error: null }
  );
  const { courseIds: enrolledCourseIds, status: enrolledStatus, error: enrolledError } = useSelector(
    (state) => state.enrolled || { courseIds: [], status: 'idle', error: null }
  );
  const enrolledIds = useMemo(() => new Set(enrolledCourseIds), [enrolledCourseIds]);

  // Fetch courses and enrolled if not loaded
  useEffect(() => {
    if (dashboardStatus === 'idle' && allCourses.length === 0) {
      dispatch(fetchAllCourses());
    }
  }, [dispatch, dashboardStatus, allCourses.length]);

  useEffect(() => {
    if (enrolledStatus === 'idle' && enrolledCourseIds.length === 0) {
      dispatch(fetchEnrolledCourses());
    }
  }, [dispatch, enrolledStatus, enrolledCourseIds.length]);

  // Filter courses based on search value
  const filteredCourses = useMemo(() => {
    if (!searchValue.trim()) return [];
    const query = searchValue.toLowerCase().trim();
    return allCourses.filter((course) => {
      const titleMatch = course.title.toLowerCase().includes(query);
      const descMatch = course.description.toLowerCase().includes(query);
      const tagsMatch = course.tags.some((tag) => tag.toLowerCase().includes(query));
      const learningsMatch = course.learnings.some((learning) => learning.toLowerCase().includes(query));
      return titleMatch || descMatch || tagsMatch || learningsMatch;
    });
  }, [allCourses, searchValue]);

  // Open dropdown when there's search value
  useEffect(() => {
    if (searchValue.trim()) {
      setIsOpen(true);
      setIsClosing(false);
    } else {
      handleClose();
    }
  }, [searchValue]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 200); // Match animation duration
  };

  const handleSearchChange = (e) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    if (externalOnChange) {
      externalOnChange(newValue);
    }
  };

  const handleCardClick = (courseId) => {
    // Clear search value
    setInternalValue('');
    if (externalOnChange) {
      externalOnChange('');
    }
    
    handleClose();
    dispatch(fetchCourseStructure(courseId));
    if (enrolledIds.has(courseId)) {
      navigate(`/courses/${courseId}/play`);
    } else {
      navigate(`/courses/${courseId}`);
    }
  };

  // Determine content for dropdown
  let dropdownContent = null;
  if (isOpen) {
    if (dashboardStatus === 'loading' || enrolledStatus === 'loading') {
      dropdownContent = (
        <LoadingWrapper>
          <LoadSpinner />
        </LoadingWrapper>
      );
    } else if (dashboardStatus === 'failed' || enrolledStatus === 'failed') {
      dropdownContent = (
        <Empty
          description={
            typeof dashboardError === 'string'
              ? dashboardError
              : typeof enrolledError === 'string'
              ? enrolledError
              : dashboardError?.message || enrolledError?.message || 'Failed to load courses'
          }
        />
      );
    } else if (filteredCourses.length === 0) {
      dropdownContent = <Empty description="No courses found" />;
    } else {
      dropdownContent = (
        <div>
          {filteredCourses.map((course) => (
            <SearchCourseCard
              key={course.course_id}
              course={course}
              onClick={() => handleCardClick(course.course_id)}
              isEnrolled={enrolledIds.has(course.course_id)}
            />
          ))}
        </div>
      );
    }
  }

  return (
    <PageContainer>
      <SearchWrapper ref={searchWrapperRef}>
        <StyledSearch
          placeholder={placeholder}
          prefix={<SearchOutlined />}
          value={searchValue}
          onChange={handleSearchChange}
          size="large"
          allowClear
        />
        {isOpen && (
          <>
            <Overlay onClick={handleClose} />
            <ResultsDropdown ref={dropdownRef} $isClosing={isClosing}>
              {dropdownContent}
            </ResultsDropdown>
          </>
        )}
      </SearchWrapper>
    </PageContainer>
  );
};

export default SearchBarComponent;