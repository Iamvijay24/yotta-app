import React, { useRef, useState, useEffect, useMemo } from 'react';
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
import styles from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../shared/api/AuthContext';
import { PaymentAPI } from '../../services/payment.services';
import { DashboardAPI } from '../../services/dashboard.services';
import StripePayment from '../../components/StripePayment';
import course_overview from '../../components/data/course_overview';
import CourseDetailsHeader from './components/CourseDetailsHeader';
import {
  CourseEmptyState,
  CourseErrorState,
  CourseLoadingState,
  CourseNotFoundState,
} from './components/CourseDetailsStates';
import ExpandableLessonItem from './components/ExpandableLessonItem';

const CourseDetailsScreen = ({ navigation, route }) => {
  const { course, isEnrolled = false } = route.params || {};
  const { user, isAuthenticated } = useAuth();

  // Hooks must be called unconditionally, before any early returns
  const unmountedRef = useRef(false);
  const [enrollLoading, setEnrollLoading] = useState(false);

  // Early return if no course data
  if (!course) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <CourseNotFoundState navigation={navigation} styles={styles} />
      </SafeAreaView>
    );
  }
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

  // Mark unmounted on cleanup
  useEffect(() => {
    return () => {
      unmountedRef.current = true;
    };
  }, []);

  // Fetch course structure on component mount
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        setError(null);
        const courseId = course.course_id || course.id;
        const response = await DashboardAPI.getCourseStructure(courseId);
        if (unmountedRef.current) return;
        setCourseData(response);
      } catch (err) {
        console.error('Error fetching course data:', err);
        // Don't set error if we get 502 but have fallback data
        if (err.response?.status !== 502) {
          if (unmountedRef.current) return;
          setError(err.message || 'Failed to load course details');
        }
      } finally {
        if (unmountedRef.current) return;
        setLoading(false);
      }
    };

    if (course) {
      fetchCourseData();
    }
  }, [course]);

  // Calculate durations when course data changes
  useEffect(() => {
    if (unmountedRef.current) return;
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

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <CourseLoadingState
          title={course.title || 'Course Details'}
          onBack={() => navigation.goBack()}
          styles={styles}
        />
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <CourseErrorState
          title={course.title || 'Course Details'}
          onBack={() => navigation.goBack()}
          error={error}
          styles={styles}
          onRetry={() => {
            const courseId = course.course_id || course.id;
            DashboardAPI.getCourseStructure(courseId)
              .then(setCourseData)
              .catch(setError);
          }}
        />
      </SafeAreaView>
    );
  }

  // No course data
  if (!resolvedCourseData) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <CourseEmptyState
          title={course.title || 'Course Details'}
          onBack={() => navigation.goBack()}
          styles={styles}
        />
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
        <CourseDetailsHeader
          title={
            resolvedCourseData?.course?.title ||
            course?.title ||
            'Course Details'
          }
          onBack={() => navigation.goBack()}
          styles={styles}
        />

        <Image
          source={{
            uri: resolvedCourseData.course?.thumbnail || course.thumbnail,
          }}
          style={styles.thumbnail}
          resizeMode="cover"
          defaultSource={require('../../assets/course1.jpg')}
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
                  .map(lesson => (
                    <ExpandableLessonItem
                      key={lesson.lesson_id}
                      lesson={lesson}
                      isExpanded={expandedLessons.has(lesson.lesson_id)}
                      onToggle={() => toggleLessonExpansion(lesson.lesson_id)}
                      videoDurations={videoDurations}
                      styles={styles}
                    />
                  ))}
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
            onCancel={() => {}}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default CourseDetailsScreen;
