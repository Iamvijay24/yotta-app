import { TouchableOpacity, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { styles } from './styles';

const CoursesListHeader = ({ onPressAccount, onPressNotifications }) => (
  <View style={styles.header}>
    <View style={styles.headerContent}>
      <View style={styles.headerIcons}>
        <TouchableOpacity style={styles.headerIcon} onPress={onPressAccount}>
          <AntDesign name="user" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={onPressNotifications}
        >
          <AntDesign name="bells" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

export default CoursesListHeader;
