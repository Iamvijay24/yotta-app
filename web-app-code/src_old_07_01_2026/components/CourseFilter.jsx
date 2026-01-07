import React, { useState, useMemo, useEffect } from 'react';
import { Select } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import styles from '../pages/courses/Courses.module.scss'; // Adjust path as needed

const { Option } = Select;

const CourseFilter = ({ courses, status, onFilterChange }) => {
  const [selectedTag, setSelectedTag] = useState('All');

  // Normalize tag function
  const normalizeTag = (tag) => {
    if (!tag) return '';
    return tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();
  };

  const getUniqueTags = useMemo(() => {
    if (!courses || !Array.isArray(courses)) {
      return [];
    }
    const tagsSet = new Set();
    courses.forEach(course => {
      if (course.tags && Array.isArray(course.tags)) {
        course.tags.forEach(tag => {
          const normalized = normalizeTag(tag);
          if (normalized) tagsSet.add(normalized);
        });
      }
    });
    return Array.from(tagsSet).sort();
  }, [courses]);

  const tags = useMemo(() => ['All', ...getUniqueTags], [getUniqueTags]);

  // Memoized filtered courses
  const filteredBaseCourses = useMemo(() => {
    if (status !== 'succeeded' || !courses || !Array.isArray(courses)) return [];
    if (selectedTag === 'All') {
      return courses;
    } else {
      return courses.filter(course =>
        course.tags && Array.isArray(course.tags) && 
        course.tags.some(tag => normalizeTag(tag) === selectedTag)
      );
    }
  }, [courses, status, selectedTag]);

  useEffect(() => {
    onFilterChange(filteredBaseCourses);
  }, [filteredBaseCourses, onFilterChange]);

  const handleTagChange = (value) => {
    setSelectedTag(value);
  };

  return (
    <div className={styles.filterSection}>
      <FilterOutlined className={styles.filterIcon} />
      <Select
        className={styles.filterSelect}
        value={selectedTag}
        onChange={handleTagChange}
      >
        {tags.map(tag => (
          <Option key={tag} value={tag}>{tag}</Option>
        ))}
      </Select>
    </div>
  );
};

export default CourseFilter;