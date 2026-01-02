import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CourseCard = ({ course, isEnrolled, navState, onPress }) => {
  const navigation = useNavigation();

  if (!course) return null;

  const handlePress = () => {
    if (onPress) {
      onPress(course);
    } else {
      // Default navigation to course details with enrollment status
      navigation.navigate('CourseDetails', {
        course,
        isEnrolled: isEnrolled || false,
      });
    }
  };

  const calculateProgress = () => {
    // This would come from enrolled data in a real app
    return course.progress || 0;
  };

  return (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Course Header */}
      <View style={styles.courseHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.courseTitle} numberOfLines={2}>
            {course.title?.trim() || course.name?.trim() || 'Untitled Course'}
          </Text>
          <View
            style={[
              styles.statusBadge,
              isEnrolled ? styles.enrolledBadge : styles.availableBadge,
            ]}
          >
            <Text style={styles.statusText}>
              {isEnrolled ? 'Enrolled' : 'Available'}
            </Text>
          </View>
        </View>
      </View>

      {/* Course Description */}
      <Text style={styles.courseDescription} numberOfLines={2}>
        {course.description?.trim() || 'No description available'}
      </Text>

      {/* Course Details */}
      <View style={styles.courseDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Instructor:</Text>
          <Text style={styles.detailValue}>
            {course.instructor?.trim() || 'Unknown'}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Duration:</Text>
          <Text style={styles.detailValue}>
            {course.duration?.trim() || 'N/A'}
          </Text>
        </View>
      </View>

      {/* Progress Bar for Enrolled Courses */}
      {isEnrolled && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>
            Progress: {calculateProgress()}%
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${calculateProgress()}%` },
              ]}
            />
          </View>
        </View>
      )}

      {/* Category Badge */}
      {course.category && (
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{course.category}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  courseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courseHeader: {
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  enrolledBadge: {
    backgroundColor: '#28a745',
  },
  availableBadge: {
    backgroundColor: '#6c757d',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  courseDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  courseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginTop: 2,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e9ecef',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2575fc',
    borderRadius: 3,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#2575fc',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default CourseCard;
