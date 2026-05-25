import { Text, TouchableOpacity, View } from 'react-native';

import LoadSpinner from '../../components/LoadSpinner';
import { styles } from './styles';

export const LoadingState = () => (
  <View style={styles.emptyState}>
    <LoadSpinner />
  </View>
);

export const ErrorState = ({ message, onRetry }) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>{message}</Text>
    <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
      <Text style={styles.retryButtonText}>Retry</Text>
    </TouchableOpacity>
  </View>
);

export const EmptyState = () => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyText}>No courses found</Text>
  </View>
);
