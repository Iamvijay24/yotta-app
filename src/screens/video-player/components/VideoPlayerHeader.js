import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { styles } from '../styles';

const VideoPlayerHeader = ({ title, subtitle, onBack }) => (
  <View style={styles.header}>
    <TouchableOpacity style={styles.backButton} onPress={onBack}>
      <Icon name="arrow-back" size={24} color="#fff" />
    </TouchableOpacity>
    <View style={styles.headerContent}>
      <Text style={styles.headerTitle} numberOfLines={1}>
        {title || 'Video Player'}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.headerSubtitleScroll}
      >
        <Text style={styles.headerSubtitle}>{subtitle || 'Course'}</Text>
      </ScrollView>
    </View>
  </View>
);

export default VideoPlayerHeader;
