import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

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

const ExpandableLessonItem = ({
  lesson,
  isExpanded,
  onToggle,
  videoDurations,
  styles,
}) => (
  <View key={lesson.lesson_id} style={styles.lessonItem}>
    <TouchableOpacity style={styles.lessonHeader} onPress={onToggle}>
      <View style={styles.lessonTitleContainer}>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        <Text style={styles.lessonTopics}>
          {lesson.topics.length} topic{lesson.topics.length !== 1 ? 's' : ''}
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
        {lesson.topics.map(topic => (
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

export default ExpandableLessonItem;
