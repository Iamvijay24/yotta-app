import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CourseDetailsHeader = ({ title, onBack, styles }) => (
  <View style={styles.header}>
    <TouchableOpacity style={styles.backButton} onPress={onBack}>
      <Icon name="arrow-back" size={24} color="#666" />
    </TouchableOpacity>

    <Text
      style={styles.headerTitle}
      numberOfLines={1}
      ellipsizeMode="tail"
    >
      {title}
    </Text>
  </View>
);

export default CourseDetailsHeader;
