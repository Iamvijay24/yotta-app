import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { styles } from '../styles';

const getTopicIcon = type => {
  if (type === 'video') return 'videocam';
  if (type === 'quiz') return 'quiz';
  return 'article';
};

const VideoTopicNavigation = ({
  allTopics,
  currentTopicIndex,
  onSelectTopic,
  onPrev,
  onNext,
}) => (
  <View style={styles.navigationContainer}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.topicsScroll}
    >
      {allTopics.map((topic, index) => {
        const isActive = index === currentTopicIndex;
        return (
          <TouchableOpacity
            key={topic.id || index}
            style={[styles.topicButton, isActive && styles.activeTopicButton]}
            onPress={() => onSelectTopic(index)}
          >
            <View style={styles.topicIcon}>
              <Icon
                name={getTopicIcon(topic.type)}
                size={16}
                color={isActive ? '#2575fc' : '#666'}
              />
            </View>
            <Text
              style={[styles.topicTitle, isActive && styles.activeTopicTitle]}
              numberOfLines={2}
            >
              {topic.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>

    <View style={styles.navButtons}>
      <TouchableOpacity
        style={[
          styles.navButton,
          currentTopicIndex === 0 && styles.disabledNavButton,
        ]}
        onPress={onPrev}
        disabled={currentTopicIndex === 0}
      >
        <Icon
          name="chevron-left"
          size={24}
          color={currentTopicIndex === 0 ? '#ccc' : '#2575fc'}
        />
        <Text
          style={[
            styles.navButtonText,
            currentTopicIndex === 0 && styles.disabledNavText,
          ]}
        >
          Previous
        </Text>
      </TouchableOpacity>

      <View style={styles.progressIndicator}>
        <Text style={styles.progressText}>
          {currentTopicIndex + 1} of {allTopics.length}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${((currentTopicIndex + 1) / allTopics.length) * 100}%`,
              },
            ]}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.navButton,
          currentTopicIndex === allTopics.length - 1 &&
            styles.disabledNavButton,
        ]}
        onPress={onNext}
        disabled={currentTopicIndex === allTopics.length - 1}
      >
        <Text
          style={[
            styles.navButtonText,
            currentTopicIndex === allTopics.length - 1 &&
              styles.disabledNavText,
          ]}
        >
          Next
        </Text>
        <Icon
          name="chevron-right"
          size={24}
          color={
            currentTopicIndex === allTopics.length - 1 ? '#ccc' : '#2575fc'
          }
        />
      </TouchableOpacity>
    </View>
  </View>
);

export default VideoTopicNavigation;
