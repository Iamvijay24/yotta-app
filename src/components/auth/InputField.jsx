import { TextInput, View } from 'react-native';

import { styles } from '../../styles/loginStyles';

const InputField = ({ icon, rightIcon, ...props }) => {
  return (
    <View style={styles.inputContainer}>
      {icon}

      <TextInput style={styles.input} placeholderTextColor="#666" {...props} />

      {rightIcon}
    </View>
  );
};

export default InputField;
