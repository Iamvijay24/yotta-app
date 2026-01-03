import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const CourseCard = ({ course, onPress, isEnrolled = false }) => {
  const hasAIAssistance =
    course.AI_exists || course.ai_enabled || course.aiAssistance;

  const handleCardClick = () => {
    if (onPress) {
      onPress(course);
    }
  };

  const handleEnrollClick = () => {
    if (onPress) {
      onPress(course);
    }
  };

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={handleCardClick}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: course.thumbnail || 'https://via.placeholder.com/300x200',
          }}
          style={styles.courseImage}
          resizeMode="cover"
        />
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>
            {course.tags && course.tags.length > 0
              ? course.tags[0]
              : course.category || 'Uncategorized'}
          </Text>
        </View>
        {hasAIAssistance && (
          <View style={styles.aiBadge}>
            <AntDesign name="android" size={12} color="#fff" />
            <Text style={styles.aiBadgeText}>AI Tutor</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.metaSection}>
          <View style={styles.authorSection}>
            <Text style={styles.byText}>By</Text>
            <Text style={styles.author}>Yotta Academy</Text>
          </View>
        </View>

        <Text style={styles.title} numberOfLines={1}>
          {course.title || course.name}
        </Text>

        <Text style={styles.description} numberOfLines={2}>
          {course.description}
        </Text>

        <TouchableOpacity
          style={[styles.enrollButton, isEnrolled && styles.enrolledButton]}
          onPress={handleEnrollClick}
        >
          <Text style={styles.enrollButtonText}>
            {isEnrolled ? 'Enrolled' : 'Enroll Now'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    maxWidth: 350,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 16,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 162,
  },
  courseImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#19213D',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  aiBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  aiBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  content: {
    padding: 16,
    flex: 1,
  },
  metaSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  byText: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '400',
  },
  author: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '400',
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: '#19213D',
    lineHeight: 20,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 15,
    marginBottom: 16,
  },
  enrollButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#2b7af5',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  enrolledButton: {
    backgroundColor: '#3fbeab',
  },
  enrollButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CourseCard;
