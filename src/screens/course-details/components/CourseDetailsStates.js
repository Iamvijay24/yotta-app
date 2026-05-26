import { Text, TouchableOpacity, View } from 'react-native';

import CourseDetailsHeader from './CourseDetailsHeader';

export const CourseNotFoundState = ({ navigation, styles }) => (
  <>
    <CourseDetailsHeader
      title="Course Details"
      onBack={() => navigation.goBack()}
      styles={styles}
    />
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>Course not found</Text>
      <Text style={styles.errorSubtext}>Unable to load course information</Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.retryButtonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  </>
);

export const CourseLoadingState = ({ title, onBack, styles }) => (
  <>
    <CourseDetailsHeader title={title} onBack={onBack} styles={styles} />
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Loading course details...</Text>
    </View>
  </>
);

export const CourseErrorState = ({ title, onBack, error, onRetry, styles }) => (
  <>
    <CourseDetailsHeader title={title} onBack={onBack} styles={styles} />
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>Failed to load course details</Text>
      <Text style={styles.errorSubtext}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  </>
);

export const CourseEmptyState = ({ title, onBack, styles }) => (
  <>
    <CourseDetailsHeader title={title} onBack={onBack} styles={styles} />
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Course details not available</Text>
    </View>
  </>
);
