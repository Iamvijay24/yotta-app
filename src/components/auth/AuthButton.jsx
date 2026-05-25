import { Text, TouchableOpacity } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import { styles } from '../../styles/loginStyles';

const AuthButton = ({ title, onPress }) => {
  return (
    <LinearGradient
      colors={['#3b82f6', '#2563eb']}
      style={styles.buttonGradient}
    >
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default AuthButton;
