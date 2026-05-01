import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { COLORS } from '../theme/colors';

const EmptyState = () => (
  <View style={styles.container}>
    {}
    <View style={styles.iconContainer}>
      <Svg width={64} height={64} viewBox="0 0 24 24">
        <Circle cx="12" cy="12" r="10" fill="none" stroke={COLORS.accent} strokeWidth="1.5" opacity="0.3" />
        <Circle cx="12" cy="12" r="6" fill="none" stroke={COLORS.accent} strokeWidth="1" opacity="0.5" />
        <Path
          d="M12 6v6l4 2"
          stroke={COLORS.accent}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <Circle cx="12" cy="12" r="2" fill={COLORS.accent} opacity="0.8" />
      </Svg>
    </View>
    <Text style={styles.title}>SYSTEM IDLE</Text>
    <Text style={styles.subtitle}>No tasks found. Create one to begin.</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.subtleText,
    marginBottom: 8,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
  },
});

export default EmptyState;