import { Text, TouchableOpacity, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { styles } from './styles';

const AccountMenu = ({ items }) => (
  <View style={styles.menuSection}>
    <Text style={styles.sectionTitle}>Settings</Text>
    {items.map(item => (
      <TouchableOpacity
        key={item.id}
        style={styles.menuItem}
        onPress={item.action}
      >
        <View style={styles.menuItemContent}>
          <AntDesign
            name={item.icon}
            size={22}
            color="#2575fc"
            style={styles.menuIcon}
          />
          <Text style={styles.menuTitle}>{item.title}</Text>
        </View>
        <AntDesign name="right" size={18} color="#b0b0b0" />
      </TouchableOpacity>
    ))}
  </View>
);

export default AccountMenu;
