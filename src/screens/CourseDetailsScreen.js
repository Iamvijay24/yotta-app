import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
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

const CourseDetailsScreen = ({ navigation, route }) => {
  const { course } = route.params;
  const { user, isAuthenticated } = useAuth();
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [expandedLessons, setExpandedLessons] = useState(new Set());
  const [courseData] = useState({
    status: 'success',
    course: {
      category_id: 9,
      rating: 3,
      category_name: 'AI & Machine Learning',
      status: 'published',
      reviews: 400,
      course_id: 'dffdf5cc',
      completed_lessons: 5,
      overall_lessons: 89,
      thumbnail:
        'https://www.google.com/search?sca_esv=7ea9874e2de762c7&sxsrf=AE3TifPdZQVCqHpKteyT9XJPsxPmXl03KQ:1760796341919&udm=2&fbs=AIIjpHxU7SXXniUZfeShr2fp4giZud1z6kQpMfoEdCJxnpm_3W-pLdZZVzNY_L9_ftx08kwv-_tUbRt8pOUS8_MjaceHuSAD6YvWZ0rfFzwmtmaBgLepZn2IJkVH-w3cPU5sPVz9l1Pp06apNShUnFfpGUJOF8p91U6HxH3ukND0OVTTVy0CGuHNdViLZqynGb0mLSRGeGVO46qnJ_2yk3F0uV6R6BW9rQ&q=machine+learning+with+python&sa=X&ved=2ahUKEwinme3D9a2QAxXmzzgGHStRJF8QtKgLegQIFRAB&biw=1540&bih=747&dpr=1#vhid=HagnSMI8BN39AM&vssid=mosaic',
      description:
        'Learn to build chatbots using Generative AI with hands-on projects.',
      price: 150,
      tags: ['python', 'AI', 'programming'],
      title: 'Building Chatbots using Generative AI with HandsOn',
      requirements: [
        'A computer with internet access.',
        'Basic understanding of Python programming.',
        'Free or trial account with OpenAI API or similar LLM service.',
      ],
      certificate: 'Upon completion of the course',
      oldPrice: '2000',
      difficulty: 'Moderate',
      language: 'English',
      students: '2300',
      learnings: [
        'Understand the fundamentals of Generative AI and Large Language Models (LLMs).',
        "Learn how chatbots work — from rule-based systems to generative AI-driven designs, Explore prompt engineering techniques to make chatbots more effective, Build a functional chatbot using OpenAI's GPT models with hands-on examples.",
        'Integrate the chatbot into web or messaging platforms, Understand ethical AI principles and deployment best practices',
      ],
      offerPrice: '399',
      duration: '4 hours 32 mins',
      instructor_id: 'fdf7d178',
    },
    structure: [
      {
        lesson_id: '5ac20093',
        course_id: 'dffdf5cc',
        title: 'Designing Conversational Flows',
        order_index: 2,
        topics: [
          {
            lesson_id: '5ac20093',
            topic_id: '6c4dff8f',
            content_url:
              'https://videoassistant-videos-bucket.s3.amazonaws.com/ce6958b3.mp4',
            description: 'Testing conversation flows',
            thumbnail:
              'https://videoassistant-videos-bucket.s3.amazonaws.com/ce6958b3_thumbnail.png',
            duration: '3 mins',
            title: 'Testing conversation flows',
            type: 'video',
          },
          {
            lesson_id: '5ac20093',
            topic_id: '8e434b4c',
            content_url:
              'https://videoassistant-videos-bucket.s3.amazonaws.com/a7ef1b24.mp4',
            description: 'Understanding user intents',
            thumbnail:
              'https://videoassistant-videos-bucket.s3.amazonaws.com/a7ef1b24_thumbnail.png',
            duration: '3 mins',
            title: 'Understanding user intents',
            type: 'video',
          },
          {
            lesson_id: '5ac20093',
            topic_id: 'ba7f2ad6',
            content_url:
              'https://videoassistant-videos-bucket.s3.amazonaws.com/92400372.mp4',
            description: 'Designing conversation flow diagrams',
            thumbnail:
              'https://videoassistant-videos-bucket.s3.amazonaws.com/92400372_thumbnail.png',
            duration: '3 mins',
            title: 'Designing conversation flow diagrams',
            type: 'video',
          },
          {
            lesson_id: '5ac20093',
            topic_id: 'a7b4a923',
            content_url:
              'https://videoassistant-videos-bucket.s3.amazonaws.com/55ef3666.mp4',
            description: 'Creating dialogue scenarios',
            thumbnail:
              'https://videoassistant-videos-bucket.s3.amazonaws.com/55ef3666_thumbnail.png',
            duration: '3 mins',
            title: 'Creating dialogue scenarios',
            type: 'video',
          },
        ],
      },
      {
        lesson_id: '985fea60',
        course_id: 'dffdf5cc',
        title: 'Natural Language Processing (NLP)',
        order_index: 3,
        topics: [
          {
            lesson_id: '985fea60',
            topic_id: '429bd3e2',
            content_url:
              'https://videoassistant-videos-bucket.s3.amazonaws.com/ef780ce5.mp4',
            description:
              'Sentiment analysis and Named Entity Recognition (NER)',
            thumbnail:
              'https://videoassistant-videos-bucket.s3.amazonaws.com/ef780ce5_thumbnail.png',
            duration: '3 mins',
            title: 'Sentiment analysis and Named Entity Recognition (NER)',
            type: 'video',
          },
          {
            lesson_id: '985fea60',
            topic_id: '3019646b',
            content_url:
              'https://videoassistant-videos-bucket.s3.amazonaws.com/cf7c86fe.mp4',
            description: 'Introduction to NLP',
            thumbnail:
              'https://videoassistant-videos-bucket.s3.amazonaws.com/cf7c86fe_thumbnail.png',
            duration: '3 mins',
            title: 'Introduction to NLP',
            type: 'video',
          },
          {
            lesson_id: '985fea60',
            topic_id: 'abf895c9',
            content_url:
              'https://videoassistant-videos-bucket.s3.amazonaws.com/d4397a0c.mp4',
            description: 'Tokenization and Text Preprocessing',
            thumbnail:
              'https://videoassistant-videos-bucket.s3.amazonaws.com/d4397a0c_thumbnail.png',
            duration: '3 mins',
            title: 'Tokenization and Text Preprocessing',
            type: 'video',
          },
          {
            lesson_id: '985fea60',
            topic_id: 'a85f568e',
            content_url:
              'https://videoassistant-videos-bucket.s3.amazonaws.com/e7feeeda.mp4',
            description: 'Training NLP models',
            thumbnail:
              'https://videoassistant-videos-bucket.s3.amazonaws.com/e7feeeda_thumbnail.png',
            duration: '3 mins',
            title: 'Training NLP models',
            type: 'video',
          },
        ],
      },
      {
        lesson_id: '6957017d',
        course_id: 'dffdf5cc',
        title: 'Deployment and Integration',
        order_index: 4,
        topics: [
          {
            lesson_id: '6957017d',
            topic_id: '2ccc8209',
            content_url:
              'https://videoassistant-videos-bucket.s3.amazonaws.com/199f4c13.mp4',
            description: 'Scaling chatbot infrastructure',
            thumbnail:
              'https://videoassistant-videos-bucket.s3.amazonaws.com/199f4c13_thumbnail.png',
            duration: '3 mins',
            title: 'Scaling chatbot infrastructure',
            type: 'video',
          },
          {
            lesson_id: '6957017d',
            topic_id: '2c5b385a',
            content_url:
              'https://videoassistant-videos-bucket.s3.amazonaws.com/a0bf8a07.mp4',
            description: 'Integrating chatbots with messaging platforms',
            thumbnail:
              'https://videoassistant-videos-bucket.s3.amazonaws.com/a0bf8a07_thumbnail.png',
            duration: '3 mins',
            title: 'Integrating chatbots with messaging platforms',
            type: 'video',
          },
          {
            lesson_id: '6957017d',
            topic_id: '77129dbe',
            content_url:
              'https://videoassistant-videos-bucket.s3.amazonaws.com/3d532e69.mp4',
            description: 'Monitoring performance and user feedback',
            thumbnail:
              'https://videoassistant-videos-bucket.s3.amazonaws.com/3d532e69_thumbnail.png',
            duration: '3 mins',
            title: 'Monitoring performance and user feedback',
            type: 'video',
          },
          {
            lesson_id: '6957017d',
            topic_id: 'e48b130f',
            content_url:
              'https://videoassistant-videos-bucket.s3.amazonaws.com/89e351ea.mp4',
            description: 'Deploying chatbots on various platforms',
            thumbnail:
              'https://videoassistant-videos-bucket.s3.amazonaws.com/89e351ea_thumbnail.png',
            duration: '3 mins',
            title: 'Deploying chatbots on various platforms',
            type: 'video',
          },
        ],
      },
      {
        lesson_id: 'fdaaeaa0',
        course_id: 'dffdf5cc',
        title: 'Introduction to Chatbots',
        order_index: 1,
        topics: [
          {
            lesson_id: 'fdaaeaa0',
            topic_id: '7ad93d84',
            content_url:
              'https://videoassistant-videos-bucket.s3.amazonaws.com/41a8839b.mp4',
            description: 'Introduction to Generative AI',
            thumbnail:
              'https://videoassistant-videos-bucket.s3.amazonaws.com/41a8839b_thumbnail.png',
            duration: '3 mins',
            title: 'Introduction to Generative AI',
            type: 'video',
          },
          {
            lesson_id: 'fdaaeaa0',
            topic_id: 'a69b76f7',
            content_url:
              'https://videoassistant-videos-bucket.s3.amazonaws.com/6c67a931.mp4',
            description: 'Overview of chatbots',
            thumbnail:
              'https://videoassistant-videos-bucket.s3.amazonaws.com/6c67a931_thumbnail.png',
            duration: '3 mins',
            title: 'Overview of chatbots',
            type: 'video',
          },
          {
            lesson_id: 'fdaaeaa0',
            topic_id: '16d8b353',
            content_url:
              'https://videoassistant-videos-bucket.s3.amazonaws.com/97e33a33.mp4',
            description: 'Benefits of using chatbots',
            thumbnail:
              'https://videoassistant-videos-bucket.s3.amazonaws.com/97e33a33_thumbnail.png',
            duration: '3 mins',
            title: 'Benefits of using chatbots',
            type: 'video',
          },
        ],
      },
      {
        lesson_id: '2c555f33',
        course_id: 'dffdf5cc',
        title: 'Advanced Topics in Chatbot Development',
        order_index: 5,
        topics: [
          {
            lesson_id: '2c555f33',
            topic_id: '96ffd284',
            content_url:
              'https://videoassistant-videos-bucket.s3.amazonaws.com/ef8569ec.mp4',
            description: 'Multi-turn conversations',
            thumbnail:
              'https://videoassistant-videos-bucket.s3.amazonaws.com/ef8569ec_thumbnail.png',
            duration: '3 mins',
            title: 'Multi-turn conversations',
            type: 'video',
          },
          {
            lesson_id: '2c555f33',
            topic_id: '7080af4b',
            content_url:
              'https://videoassistant-videos-bucket.s3.amazonaws.com/d118edd5.mp4',
            description: 'Context and memory management',
            thumbnail:
              'https://videoassistant-videos-bucket.s3.amazonaws.com/d118edd5_thumbnail.png',
            duration: '3 mins',
            title: 'Context and memory management',
            type: 'video',
          },
          {
            lesson_id: '2c555f33',
            topic_id: 'd437f862',
            content_url:
              'https://videoassistant-videos-bucket.s3.amazonaws.com/bcf5f463.mp4',
            description: 'Future trends in chatbot development',
            thumbnail:
              'https://videoassistant-videos-bucket.s3.amazonaws.com/bcf5f463_thumbnail.png',
            duration: '3 mins',
            title: 'Future trends in chatbot development',
            type: 'video',
          },
          {
            lesson_id: '2c555f33',
            topic_id: 'd4197e26',
            content_url:
              'https://videoassistant-videos-bucket.s3.amazonaws.com/d337f4b3.mp4',
            description: 'Persisting conversation history',
            thumbnail:
              'https://videoassistant-videos-bucket.s3.amazonaws.com/d337f4b3_thumbnail.png',
            duration: '3 mins',
            title: 'Persisting conversation history',
            type: 'video',
          },
        ],
      },
    ],
  });

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
    if (!courseData.course.offerPrice) {
      Alert.alert('Error', 'Course price information is missing');
      return;
    }
    setEnrollLoading(true);
    try {
      const userId = user?.sub || user?.['cognito:username'];
      const payload = {
        payment_plan: courseData.course.offerPrice,
        user_id: userId,
        course_id: courseData.course.course_id,
        success_url: '', // Not needed for mobile, can be empty or add dummy
        cancel_url: '', // Not needed for mobile
      };
      const response = await PaymentAPI.purchaseCourse(payload);
      console.log(response);

      const { data } = response;
      if (data?.checkout_url) {
        // Open external browser for payment
        await Linking.openURL(data.checkout_url);
        // After payment, user would return to app and we might check payment status
        // For now, just show success message
        Alert.alert(
          'Payment Initiated',
          'You will be redirected to complete your payment',
        );
      } else {
        throw new Error('No checkout URL returned');
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
                <View style={styles.topicBullet}>
                  <Text style={styles.topicBulletText}>{index + 1}</Text>
                </View>
                <View style={styles.topicContent}>
                  <Text style={styles.topicTitle}>{topic.title}</Text>
                  <Text style={styles.topicDuration}>{topic.duration}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

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
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>

        <Image
          source={{ uri: courseData.course.thumbnail }}
          style={styles.thumbnail}
          resizeMode="cover"
        />

        <View style={styles.content}>
          <Text style={styles.title}>{courseData.course.title}</Text>

          <View style={styles.metaContainer}>
            <Text style={styles.metaText}>
              Category: {courseData.course.category_name}
            </Text>
            <Text style={styles.metaText}>
              Rating: {courseData.course.rating}/5
            </Text>
            <Text style={styles.metaText}>
              Students: {courseData.course.students}
            </Text>
            <Text style={styles.metaText}>
              Duration: {courseData.course.duration}
            </Text>
            <Text style={styles.metaText}>
              Language: {courseData.course.language}
            </Text>
          </View>

          <Text style={styles.description}>
            {courseData.course.description}
          </Text>

          <Text style={styles.sectionTitle}>What You'll Learn</Text>
          {courseData.course.learnings.map((learning, index) => (
            <Text key={index} style={styles.learningItem}>
              • {learning}
            </Text>
          ))}

          <Text style={styles.sectionTitle}>Requirements</Text>
          {courseData.course.requirements.map((req, index) => (
            <Text key={index} style={styles.requirementItem}>
              • {req}
            </Text>
          ))}

          <Text style={styles.sectionTitle}>Course Structure</Text>
          {courseData.structure
            .sort((a, b) => a.order_index - b.order_index)
            .map(renderExpandableLessonItem)}

          <View style={styles.priceContainer}>
            <Text style={styles.oldPrice}>₹{courseData.course.oldPrice}</Text>
            <Text style={styles.price}>₹{courseData.course.offerPrice}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.enrollButton}
          onPress={handleEnroll}
          disabled={enrollLoading}
        >
          <Text style={styles.enrollButtonText}>
            {enrollLoading ? 'Processing...' : 'Enroll Now'}
          </Text>
        </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#2575fc',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
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
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  oldPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2575fc',
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
});

export default CourseDetailsScreen;
