import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../theme/colors';

interface DashboardStatsProps {
  total: number;
  completed: number;
  overdue: number;
  dueSoon: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ total, completed, overdue, dueSoon }) => {
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.statsRow}>
        {}
        <View style={[styles.statCard, styles.statCardGlow]}>
          <LinearGradient
            colors={['#1a1a1a', '#0f0f0f']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.statDot} />
            <Text style={styles.statNumber}>{total}</Text>
            <Text style={styles.statLabel}>TOTAL TASKS</Text>
          </LinearGradient>
        </View>

        {}
        <View style={[styles.statCard, styles.statCardGlow]}>
          <LinearGradient
            colors={['#1a1a1a', '#0f0f0f']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.statNumber}>{completionRate}<Text style={styles.percentSign}>%</Text></Text>
            <Text style={styles.statLabel}>COMPLETION</Text>
          </LinearGradient>
        </View>
      </View>

      <View style={styles.statsRow}>
        {}
        <View style={[styles.statCard, overdue > 0 && styles.overdueCard]}>
          <LinearGradient
            colors={overdue > 0 ? ['#1a0a0a', '#0f0505'] : ['#1a1a1a', '#0f0f0f']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={[styles.statNumber, overdue > 0 && styles.overdueNumber]}>{overdue}</Text>
            <Text style={[styles.statLabel, overdue > 0 && styles.overdueLabel]}>OVERDUE</Text>
          </LinearGradient>
        </View>

        {}
        <View style={[styles.statCard, dueSoon > 0 && styles.dueSoonCard]}>
          <LinearGradient
            colors={dueSoon > 0 ? ['#0a1a1a', '#050f0f'] : ['#1a1a1a', '#0f0f0f']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {dueSoon > 0 && <View style={styles.statDotAccent} />}
            <Text style={[styles.statNumber, dueSoon > 0 && styles.dueSoonNumber]}>{dueSoon}</Text>
            <Text style={[styles.statLabel, dueSoon > 0 && styles.dueSoonLabel]}>DUE SOON</Text>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
    gap: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  statCardGlow: {
    shadowColor: '#00d4aa',
    shadowRadius: 20,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 8 },
  },
  gradient: {
    paddingVertical: 20,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderRadius: 16,
  },
  statDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accent,
    marginBottom: 8,
    opacity: 0.5,
  },
  statDotAccent: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00d4aa',
    marginBottom: 8,
    opacity: 0.8,
  },
  statNumber: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.text,
    lineHeight: 40,
    marginBottom: 4,
    letterSpacing: -1,
  },
  percentSign: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.subtleText,
  },
  statLabel: {
    fontSize: 9,
    color: COLORS.subtleText,
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  overdueCard: {
    borderColor: '#3a0a0a',
  },
  overdueNumber: {
    color: '#ff453a',
  },
  overdueLabel: {
    color: '#ff453a',
  },
  dueSoonCard: {
    borderColor: '#0a1a1a',
  },
  dueSoonNumber: {
    color: '#00d4aa',
  },
  dueSoonLabel: {
    color: '#00d4aa',
  },
});

export default DashboardStats;