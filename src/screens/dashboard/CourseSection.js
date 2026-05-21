import { FlatList, RefreshControl, Text, View } from 'react-native';

import CourseCard from './CourseCard';
import { styles } from './styles';

const CourseSection = ({
  title,
  data,
  onCoursePress,
  refreshing,
  onRefresh,
  horizontal = false,
  showEmpty = false,
}) => (
  <View style={horizontal ? styles.availableSection : styles.content}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <CourseCard item={item} onPress={onCoursePress} />
      )}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.coursesList}
      showsVerticalScrollIndicator={false}
      horizontal={horizontal}
      refreshControl={
        !horizontal ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#2575fc"
          />
        ) : undefined
      }
      ListEmptyComponent={
        showEmpty ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              You haven't enrolled in any courses yet.
            </Text>
          </View>
        ) : null
      }
    />
  </View>
);

export default CourseSection;
