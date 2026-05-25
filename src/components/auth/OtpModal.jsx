import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { styles } from '../../styles/loginStyles';

const OtpModal = ({
  visible,
  otp,
  setOtp,
  email,
  onClose,
  onVerify,
  onResend,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Verify Email</Text>

          <Text style={styles.modalSubtitle}>
            Verification code sent to {email}
          </Text>

          <TextInput
            style={styles.otpInput}
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
            maxLength={6}
          />

          <TouchableOpacity style={styles.verifyButton} onPress={onVerify}>
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onResend}>
            <Text style={styles.linkText}>Resend Code</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.linkText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default OtpModal;
