import { Text, TouchableOpacity, View } from 'react-native';

import { styles } from './styles';

const AccountMenu = ({ items }) => (
  <View style={styles.menuSection}>
    {items.map(item => (
      <TouchableOpacity
        key={item.id}
        style={styles.menuItem}
        onPress={item.action}
      >
        <View style={styles.menuItemContent}>
          <Text style={styles.menuIcon}>{item.icon}</Text>
          <Text style={styles.menuTitle}>{item.title}</Text>
        </View>
        <Text style={styles.menuArrow}>›</Text>
      </TouchableOpacity>
    ))}
  </View>
);

export default AccountMenu;
