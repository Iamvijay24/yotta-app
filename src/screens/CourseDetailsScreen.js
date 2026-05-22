import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  Alert,
  Linking,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../shared/api/AuthContext';
import { PaymentAPI } from '../services/payment.services';
import { DashboardAPI } from '../services/dashboard.services';
import StripePayment from '../components/StripePayment';
import course_overview from '../components/data/course_overview';

const CourseDetailsScreen = ({ navigation, route }) => {
  const { course, isEnrolled = false } = route.params || {};
  const { user, isAuthenticated } = useAuth();

  // Early return if no course data
  if (!course) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Course Details</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Course not found</Text>
          <Text style={styles.errorSubtext}>
            Unable to load course information
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [expandedLessons, setExpandedLessons] = useState(new Set());
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoDurations, setVideoDurations] = useState({});
  const [totalDurationFormatted, setTotalDurationFormatted] = useState(null);
  const [couponCode, setCouponCode] = useState('');

  // Helper functions
  const capitalize = str =>
    !str ? 'Unknown' : str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const parseApiDurationToSeconds = durStr => {
    if (!durStr) return 0;
    const trimmed = durStr.trim().toLowerCase();
    if (trimmed.includes('min') || trimmed.includes('mins')) {
      const match = trimmed.match(/(\d+)/);
      return match ? parseInt(match[1]) * 60 : 0;
    }
    const parts = trimmed.split(':');
    if (parts.length === 3) {
      return (
        parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2])
      );
    } else if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    return 0;
  };

  const formatDuration = duration => {
    if (!duration) return '0 hours';

    // Ensure duration is a string
    const durationStr = String(duration);

    // If duration is already formatted (like "5h 30m"), return as is
    if (durationStr.includes('h') || durationStr.includes('m')) {
      return durationStr;
    }

    // Handle HH:MM:SS or HH:MM format
    const parts = durationStr.split(':');
    let hours = 0;
    let minutes = 0;

    if (parts.length === 3) {
      // HH:MM:SS format - treat as HH:MM
      hours = parseInt(parts[0], 10);
      minutes = parseInt(parts[1], 10);
    } else if (parts.length === 2) {
      // HH:MM format
      hours = parseInt(parts[0], 10);
      minutes = parseInt(parts[1], 10);
    } else {
      return '0 hours';
    }

    // Use the same logic as the web version
    const totalHours = minutes >= 30 ? hours + 0.5 : hours;
    return totalHours === 1 ? '1 hour' : `${totalHours} hours`;
  };

  const formatTotalDuration = totalSeconds => {
    if (!totalSeconds || totalSeconds <= 0) return null;

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (hours > 0) {
      return minutes >= 30 ? `${hours + 0.5} hours` : `${hours} hours`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    }
    return null;
  };

  // Resolve data with fallback - ensure we always have a valid structure
  const resolvedCourseData = useMemo(() => {
    let rawStructure = courseData;

    // If no courseData, provide fallback data regardless of error state
    if (!rawStructure) {
      rawStructure = {
        course: {
          title: course?.title || course_overview.title,
          description: course?.description || course_overview.description,
          thumbnail: course?.thumbnail || course_overview.thumbnail,
          overall_lessons: course_overview.total_lessons,
          students: course_overview.students,
          rating: course_overview.rating,
          difficulty: course_overview.difficulty,
          language: course_overview.language,
          duration: course_overview.duration,
          oldPrice: course_overview.oldPrice,
          offerPrice: course_overview.offerPrice,
          certificate: course_overview.certificate,
          requirements: course_overview.requirements,
          learnings: course_overview.learnings,
        },
        structure: course_overview.modules,
      };
    }

    // Ensure the structure always has required properties
    if (!rawStructure.course) {
      rawStructure.course = {
        title: course?.title || 'Course Details',
        description: 'No description available',
        thumbnail: course_overview.thumbnail,
      };
    }

    return rawStructure;
  }, [courseData, error, course]);

  // Fetch course structure on component mount
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        setError(null);
        const courseId = course.course_id || course.id;
        const response = await DashboardAPI.getCourseStructure(courseId);
        setCourseData(response);
      } catch (err) {
        console.error('Error fetching course data:', err);
        // Don't set error if we get 502 but have fallback data
        if (err.response?.status !== 502) {
          setError(err.message || 'Failed to load course details');
        }
      } finally {
        setLoading(false);
      }
    };

    if (course) {
      fetchCourseData();
    }
  }, [course]);

  // Calculate durations when course data changes
  useEffect(() => {
    if (resolvedCourseData?.structure) {
      const durationsMap = {};
      let totalSeconds = 0;
      resolvedCourseData.structure.forEach(module => {
        if (module.topics) {
          module.topics.forEach(topic => {
            if (topic.duration) {
              durationsMap[topic.topic_id] = topic.duration;
              const seconds = parseApiDurationToSeconds(topic.duration);
              totalSeconds += seconds;
            }
          });
        }
      });
      setVideoDurations(durationsMap);
      if (totalSeconds > 0) {
        setTotalDurationFormatted(formatTotalDuration(totalSeconds));
      } else {
        setTotalDurationFormatted(null);
      }
    }
  }, [resolvedCourseData]);

  const toggleLessonExpansion = lessonId => {
    setExpandedLessons(prev => {
      const newSet = new Set(prev);
      if (newSet.has(lessonId)) {
        newSet.delete(lessonId);
      } else {
        newSet.add(lessonId);
      }
      return newSet;
    });
  };

  const handleEnroll = async () => {
    if (!isAuthenticated || !user) {
      Alert.alert(
        'Authentication Required',
        'Please log in to purchase this course',
      );
      navigation.navigate('Login');
      return;
    }

    setEnrollLoading(true);
    try {
      const courseId =
        resolvedCourseData.course.course_id || resolvedCourseData.course.id;
      const payload = {
        payment_plan: resolvedCourseData.course.offerPrice || '400',
        course_id: courseId,
        coupon_code: couponCode || null,
        success_url: '', // Mobile app doesn't need redirect URLs
        cancel_url: '', // Mobile app doesn't need redirect URLs
      };

      const { data } = await PaymentAPI.purchaseCourse(payload);

      // Check if 100% discount - show payment status component
      if (data?.discount_percent === 100) {
        // Refresh enrolled courses to update UI state
        // dispatch(fetchEnrolledCourses()); // Would need to import dispatch
        Alert.alert(
          'Success!',
          'Course enrolled successfully with 100% discount!',
        );
        return;
      }

      if (data?.checkout_url) {
        // For mobile, we navigate to the Stripe checkout URL
        // Since it's a mobile app, we use Linking to open in browser
        await Linking.openURL(data.checkout_url);
        Alert.alert(
          'Payment Initiated',
          'You will be redirected to complete your payment in the browser.',
        );
      } else {
        throw new Error('No checkout URL returned from backend');
      }
    } catch (err) {
      console.error('Payment error:', err);
      const errMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to process payment.';
      Alert.alert('Payment Error', errMessage);
    } finally {
      setEnrollLoading(false);
    }
  };

  const getIcon = type => {
    switch (type?.toLowerCase()) {
      case 'video':
        return 'videocam';
      case 'article':
        return 'article';
      case 'quiz':
        return 'quiz';
      default:
        return 'radio-button-checked';
    }
  };

  const renderExpandableLessonItem = lesson => {
    const isExpanded = expandedLessons.has(lesson.lesson_id);

    return (
      <View key={lesson.lesson_id} style={styles.lessonItem}>
        <TouchableOpacity
          style={styles.lessonHeader}
          onPress={() => toggleLessonExpansion(lesson.lesson_id)}
        >
          <View style={styles.lessonTitleContainer}>
            <Text style={styles.lessonTitle}>{lesson.title}</Text>
            <Text style={styles.lessonTopics}>
              {lesson.topics.length} topic
              {lesson.topics.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <Icon
            name={isExpanded ? 'expand-more' : 'chevron-right'}
            size={24}
            color="#666"
            style={styles.expandIcon}
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.topicsContainer}>
            {lesson.topics.map((topic, index) => (
              <View key={topic.topic_id} style={styles.topicItem}>
                <View style={styles.topicIconContainer}>
                  <Icon name={getIcon(topic.type)} size={16} color="#565C72" />
                </View>
                <View style={styles.topicContent}>
                  <Text style={styles.topicTitle}>{topic.title}</Text>
                  <Text style={styles.topicDuration}>
                    {videoDurations[topic.topic_id] || topic.duration || '—'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {course.title || 'Course Details'}
          </Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading course details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {course.title || 'Course Details'}
          </Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load course details</Text>
          <Text style={styles.errorSubtext}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              // Retry logic would go here
              const courseId = course.course_id || course.id;
              DashboardAPI.getCourseStructure(courseId)
                .then(setCourseData)
                .catch(setError);
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // No course data
  if (!resolvedCourseData) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {course.title || 'Course Details'}
          </Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Course details not available</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {resolvedCourseData?.course?.title ||
              course?.title ||
              'Course Details'}
          </Text>
        </View>

        <Image
          source={{
            uri: resolvedCourseData.course?.thumbnail || course.thumbnail,
          }}
          style={styles.thumbnail}
          resizeMode="cover"
          defaultSource={require('../assets/course1.jpg')}
        />

        <View style={styles.content}>
          <Text style={styles.title}>
            {resolvedCourseData.course?.title ||
              course.title ||
              'Untitled Course'}
          </Text>

          {/* Course stats sidebar-like info */}
          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Icon name="library-books" size={20} color="#2575fc" />
                <View style={styles.statTextContainer}>
                  <Text style={styles.statTitle}>Lessons</Text>
                  <Text style={styles.statValue}>
                    {resolvedCourseData.course?.overall_lessons ||
                      resolvedCourseData.structure?.reduce(
                        (a, s) => a + (s.topics?.length || 0),
                        0,
                      ) ||
                      'N/A'}
                  </Text>
                </View>
              </View>
              <View style={styles.statItem}>
                <Icon name="timeline" size={20} color="#2575fc" />
                <View style={styles.statTextContainer}>
                  <Text style={styles.statTitle}>Difficulty</Text>
                  <Text style={styles.statValue}>
                    {capitalize(resolvedCourseData.course?.difficulty) || 'N/A'}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Icon name="people" size={20} color="#2575fc" />
                <View style={styles.statTextContainer}>
                  <Text style={styles.statTitle}>Language</Text>
                  <Text style={styles.statValue}>
                    {resolvedCourseData.course?.language}
                  </Text>
                </View>
              </View>
              <View style={styles.statItem}>
                <Icon name="schedule" size={20} color="#2575fc" />
                <View style={styles.statTextContainer}>
                  <Text style={styles.statTitle}>Duration</Text>
                  <Text style={styles.statValue}>
                    {formatDuration(resolvedCourseData.course?.duration) ||
                      totalDurationFormatted ||
                      'N/A'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <Text style={styles.description}>
            {resolvedCourseData.course?.description ||
              course.description ||
              'No description available'}
          </Text>

          {resolvedCourseData.course?.learnings &&
            resolvedCourseData.course.learnings.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>What You'll Learn</Text>
                {resolvedCourseData.course.learnings.map((learning, index) => (
                  <Text key={index} style={styles.learningItem}>
                    • {learning}
                  </Text>
                ))}
              </>
            )}

          {resolvedCourseData.course?.requirements &&
            resolvedCourseData.course.requirements.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Requirements</Text>
                <Text style={styles.assignmentText}>
                  Plan to dedicate a minimum of 1-2 hours a day to watch
                  lectures videos, engage in Q&A sessions and complete
                  assignments.
                </Text>
                {resolvedCourseData.course.requirements.map((req, index) => (
                  <Text key={index} style={styles.requirementItem}>
                    • {req}
                  </Text>
                ))}
              </>
            )}

          {resolvedCourseData.structure &&
            resolvedCourseData.structure.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>
                  Course Table of Contents
                </Text>
                <Text style={styles.totalLessonsText}>
                  {resolvedCourseData.structure.reduce(
                    (a, s) => a + (s.topics?.length || 0),
                    0,
                  )}{' '}
                  Lessons
                </Text>
                {resolvedCourseData.structure
                  .sort((a, b) => a.order_index - b.order_index)
                  .map(renderExpandableLessonItem)}
              </>
            )}

          {!isEnrolled && resolvedCourseData.course?.offerPrice && (
            <View style={styles.priceContainer}>
              <View style={styles.priceSection}>
                <Text style={styles.currentPrice}>
                  ${resolvedCourseData.course.offerPrice}
                </Text>
                {resolvedCourseData.course.oldPrice &&
                  Number(resolvedCourseData.course.oldPrice) >
                    Number(resolvedCourseData.course.offerPrice) && (
                    <Text style={styles.originalPrice}>
                      ${resolvedCourseData.course.oldPrice}
                    </Text>
                  )}
              </View>
              <View style={styles.couponSection}>
                <Text style={styles.couponText}>Enter Coupon Code</Text>
                <View style={styles.couponInputContainer}>
                  <TextInput
                    style={styles.couponInput}
                    placeholder="Enter coupon code"
                    placeholderTextColor="#999"
                    value={couponCode}
                    onChangeText={setCouponCode}
                    autoCapitalize="characters"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    style={styles.couponButton}
                    onPress={async () => {
                      if (couponCode.trim()) {
                        try {
                          // Validate coupon with backend
                          const validationPayload = {
                            coupon_code: couponCode.trim(),
                            course_id:
                              resolvedCourseData.course.course_id ||
                              resolvedCourseData.course.id,
                          };

                          // You can add a coupon validation API call here if your backend supports it
                          // For now, we'll just show that the coupon is applied
                          Alert.alert(
                            'Coupon Applied',
                            `Coupon "${couponCode}" will be applied during payment.`,
                          );
                          // Don't clear the coupon code - keep it for payment
                        } catch (error) {
                          Alert.alert('Error', 'Invalid coupon code');
                          setCouponCode('');
                        }
                      } else {
                        Alert.alert('Error', 'Please enter a coupon code');
                      }
                    }}
                  >
                    <Text style={styles.couponButtonText}>Apply</Text>
                  </TouchableOpacity>
                </View>
                {couponCode && (
                  <Text style={styles.appliedCouponText}>
                    Applied coupon: {couponCode}
                  </Text>
                )}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {isEnrolled ? (
          <TouchableOpacity
            style={styles.enrollButton}
            onPress={() => {
              // Extract all topics from course structure
              const allTopics = [];
              if (resolvedCourseData.structure) {
                resolvedCourseData.structure.forEach(module => {
                  if (module.topics) {
                    module.topics.forEach(topic => {
                      allTopics.push({
                        ...topic,
                        sectionTitle: module.title,
                        sectionKey: module.lesson_id,
                      });
                    });
                  }
                });
              }

              if (allTopics.length > 0) {
                navigation.navigate('VideoPlayer', {
                  course: resolvedCourseData.course,
                  allTopics,
                  currentTopicIndex: 0,
                });
              } else {
                Alert.alert(
                  'No Content',
                  'No video content available for this course yet.',
                );
              }
            }}
          >
            <Text style={styles.enrollButtonText}>Continue Learning</Text>
          </TouchableOpacity>
        ) : (
          <StripePayment
            courseId={
              resolvedCourseData.course.course_id ||
              resolvedCourseData?.course?.id
            }
            courseData={resolvedCourseData.course}
            couponCode={couponCode}
            navigation={navigation}
            onSuccess={() => {
              // Handle successful payment
              Alert.alert('Success', 'Payment completed successfully!');
              // Optionally navigate to course content or refresh enrolled courses
            }}
            onCancel={() => {
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120, // Space for footer
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 15,
    textAlign: 'center',
  },
  thumbnail: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  metaContainer: {
    marginBottom: 15,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  learningItem: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666',
    marginBottom: 5,
    marginLeft: 10,
  },
  requirementItem: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666',
    marginBottom: 5,
    marginLeft: 10,
  },
  lessonItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  lessonTopics: {
    fontSize: 14,
    color: '#666',
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lessonTitleContainer: {
    flex: 1,
  },
  expandIcon: {
    marginLeft: 10,
  },
  topicsContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  topicBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2575fc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  topicBulletText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  topicContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topicTitle: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  topicDuration: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  priceContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  currentPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2575fc',
  },
  originalPrice: {
    fontSize: 18,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  couponSection: {
    marginTop: 15,
  },
  couponText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  couponInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  couponInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#fff',
    color: '#333',
  },
  couponButton: {
    backgroundColor: '#2575fc',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    minWidth: 80,
  },
  couponButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  enrollButton: {
    backgroundColor: '#2575fc',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  enrollButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2575fc',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  statsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 5,
  },
  statTextContainer: {
    marginLeft: 10,
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  assignmentText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  totalLessonsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  priceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topicIconContainer: {
    marginRight: 12,
  },
  appliedCouponText: {
    fontSize: 12,
    color: '#2575fc',
    fontWeight: '600',
    marginTop: 8,
  },
});

export default CourseDetailsScreen;
