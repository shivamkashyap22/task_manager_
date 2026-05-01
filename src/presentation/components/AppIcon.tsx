import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-paper';
import { COLORS } from '../theme/colors';

const AppIcon = () => (
  <View style={styles.iconContainer}>
    <View style={styles.iconInner}>
      <Icon source="check-decagram" size={50} color={COLORS.accent} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  iconContainer: {
    width: 110,
    height: 110,
    borderRadius: 24,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 40,
  },
  iconInner: {
    width: 86,
    height: 86,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 212, 170, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
});

export default AppIcon;