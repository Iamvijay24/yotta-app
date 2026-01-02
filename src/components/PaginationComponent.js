import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

const PaginationComponent = ({
  total,
  currentPage,
  onPageChange,
  pageSize,
  loading = false,
}) => {
  const totalPages = Math.ceil(total / pageSize);
  const hasMore = currentPage < totalPages;

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      onPageChange(currentPage + 1);
    }
  };

  if (!hasMore && currentPage > 1) {
    return (
      <View style={styles.endMessage}>
        <Text style={styles.endText}>You've reached the end of the list</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.loadMoreButton,
          (!hasMore || loading) && styles.disabledButton,
        ]}
        onPress={handleLoadMore}
        disabled={!hasMore || loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#2575fc" />
        ) : (
          <Text style={[styles.loadMoreText, !hasMore && styles.disabledText]}>
            Load More Courses
          </Text>
        )}
      </TouchableOpacity>

      <Text style={styles.pageInfo}>
        Page {currentPage} of {totalPages} ({total} total courses)
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  loadMoreButton: {
    backgroundColor: '#2575fc',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#e9ecef',
  },
  loadMoreText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledText: {
    color: '#6c757d',
  },
  pageInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
    textAlign: 'center',
  },
  endMessage: {
    padding: 20,
    alignItems: 'center',
  },
  endText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default PaginationComponent;
