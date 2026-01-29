import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { useDispatch } from 'react-redux';
import { fetchEnrolledCourses } from '../shared/store/redux/slices/enrolledSlice';
import { PaymentAPI } from '../services/payment.services';

const StripePayment = ({
  courseId,
  courseData,
  couponCode,
  onSuccess,
  onCancel,
  navigation, // Add navigation prop
}) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Fetch Payment Intent from backend
      const payload = {
        payment_plan: courseData.offerPrice || '400',
        course_id: courseId,
        coupon_code: couponCode || null,
        platform: 'mobile',
      };

      const response = await PaymentAPI.purchaseCourse(payload);
      console.log('Payment response:', response);

      // Extract client secret from response
      let clientSecret = null;

      if (response.type === 'payment_intent' && response.data?.payment_intent) {
        clientSecret = response.data.payment_intent;
      } else if (response.paymentIntent) {
        clientSecret = response.paymentIntent;
      } else if (response.clientSecret) {
        clientSecret = response.clientSecret;
      }

      if (!clientSecret) {
        Alert.alert('Error', 'No payment intent received from server');
        return;
      }

      console.log('Using client secret:', clientSecret);

      // 2. Initialize the Payment Sheet
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'Yotta Academy',
        returnURL: 'yottaacademy://stripe-redirect',
      });

      if (initError) {
        console.error('Init error:', initError);
        Alert.alert('Error', initError.message);
        onCancel?.();
        return;
      }

      // 3. Present the Payment Sheet (The Native UI)
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        console.error('Present error:', presentError);
        Alert.alert(
          `Payment Error: ${presentError.code}`,
          presentError.message,
        );
        onCancel?.();
      } else {
        // Payment successful - update enrolled courses and navigate to success screen
        console.log('Payment successful, updating enrolled courses...');

        // Update enrolled courses state to show "Enrolled" status immediately
        dispatch(fetchEnrolledCourses());

        // Navigate to success screen with course details
        navigation.navigate('PaymentSuccess', {
          courseId: courseId,
          courseTitle: courseData?.title || 'Course',
        });

        onSuccess?.();
      }
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', 'Payment failed. Please try again.');
      onCancel?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.payButton, loading && styles.payButtonDisabled]}
        onPress={handlePayment}
        disabled={loading}
      >
        <Text style={styles.payButtonText}>
          {loading
            ? 'Processing...'
            : `Pay $${courseData?.offerPrice || '400'}`}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  payButton: {
    backgroundColor: '#2575fc',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonDisabled: {
    backgroundColor: '#ccc',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StripePayment;
