import { TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const PasswordToggleIcon = ({ passwordVisible, onToggle }) => (
  <TouchableOpacity onPress={onToggle}>
    <AntDesign name={passwordVisible ? 'eyeo' : 'eye'} size={20} color="#666" />
  </TouchableOpacity>
);

export default PasswordToggleIcon;
