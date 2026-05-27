import { Text, TouchableOpacity, View } from 'react-native';

import { styles } from '../styles';

const VideoPlayerEmptyState = ({ onBack }) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>No video content available</Text>
    <TouchableOpacity style={styles.backButton} onPress={onBack}>
      <Text style={styles.backButtonText}>Go Back</Text>
    </TouchableOpacity>
  </View>
);

export default VideoPlayerEmptyState;
