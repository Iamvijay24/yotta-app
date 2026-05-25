import { Text, TouchableOpacity, View } from 'react-native';

import { styles } from './styles';

const CourseCard = ({ item, onPress }) => (
  <TouchableOpacity style={styles.courseCard} onPress={() => onPress(item)}>
    <View style={styles.courseHeader}>
      <View style={styles.courseTitleContainer}>
        <Text style={styles.courseTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View
          style={[
            styles.statusBadge,
            item.enrolled ? styles.enrolledBadge : styles.notEnrolledBadge,
          ]}
        >
          <Text style={styles.statusText}>
            {item.enrolled ? 'Enrolled' : 'Available'}
          </Text>
        </View>
      </View>
    </View>

    <Text style={styles.courseDescription} numberOfLines={2}>
      {item.description}
    </Text>

    <View style={styles.courseDetails}>
      <View style={styles.detailItem}>
        <Text style={styles.detailLabel}>Instructor:</Text>
        <Text style={styles.detailValue}>{item.instructor}</Text>
      </View>
      <View style={styles.detailItem}>
        <Text style={styles.detailLabel}>Duration:</Text>
        <Text style={styles.detailValue}>{item.duration}</Text>
      </View>
    </View>

    {item.enrolled && (
      <View style={styles.progressContainer}>
        <Text style={styles.progressLabel}>Progress: {item.progress}%</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
        </View>
      </View>
    )}
  </TouchableOpacity>
);

export default CourseCard;
