import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { Task } from '../../domain/models/Task';
import { COLORS } from '../theme/colors';

interface TaskItemProps {
  item: Task;
  onEdit: (item: Task) => void;
  onToggleComplete: (item: Task) => void;
}

const getPriorityStyles = (priority: 'low' | 'medium' | 'high') => {
  switch (priority) {
    case 'high':
      return { backgroundColor: '#2a0a0a', textColor: '#ff453a', borderColor: '#3a0a0a' };
    case 'medium':
      return { backgroundColor: '#1a1000', textColor: '#ffd60a', borderColor: '#2a1a00' };
    case 'low':
    default:
      return { backgroundColor: '#0a1a0a', textColor: '#32d74b', borderColor: '#0a2a0a' };
  }
};

const isTaskOverdue = (task: Task): boolean => {
  if (task.isComplete) return false;
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const taskDueDate = new Date(task.dueDate).setHours(0, 0, 0, 0);
  return taskDueDate < todayStart;
};

const TaskItem = ({ item, onEdit, onToggleComplete }: TaskItemProps) => {
  const priorityStyles = getPriorityStyles(item.priority);
  const overdue = isTaskOverdue(item);

  return (
    <View style={[styles.taskCard, overdue && styles.taskCardOverdue]}>
      <TouchableOpacity style={styles.taskRowFront} onPress={() => onEdit(item)}>
        <TouchableOpacity
          style={styles.checkboxWrapper}
          onPress={() => onToggleComplete(item)}
        >
          <Checkbox.Android
            status={item.isComplete ? 'checked' : 'unchecked'}
            color={COLORS.accent}
            uncheckedColor={COLORS.subtleText}
          />
        </TouchableOpacity>
        <View style={styles.taskTextContainer}>
          <View style={styles.titleRow}>
            <Text style={[styles.taskTitle, item.isComplete && styles.taskComplete]} numberOfLines={1}>
              {item.title}
            </Text>
            {overdue && (
              <View style={styles.overdueBadge}>
                <Text style={styles.overdueBadgeText}>OVERDUE</Text>
              </View>
            )}
          </View>
          <View style={styles.chipRow}>
            <View style={[styles.categoryChip, { borderColor: COLORS.accent }]}>
              <Text style={styles.categoryChipText}>{item.category}</Text>
            </View>
            <View style={[styles.priorityChip, { backgroundColor: priorityStyles.backgroundColor, borderColor: priorityStyles.borderColor }]}>
              <Text style={[styles.priorityChipText, { color: priorityStyles.textColor }]}>
                {item.priority.toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={styles.dueDateText}>
            Due: {new Date(item.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  taskCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  taskCardOverdue: {
    borderColor: '#3a0a0a',
    borderLeftWidth: 3,
    borderLeftColor: '#ff453a',
  },
  taskRowFront: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  checkboxWrapper: {
    width: 24,
    height: 24,
  },
  taskTextContainer: {
    flex: 1,
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  taskComplete: {
    textDecorationLine: 'line-through',
    color: COLORS.subtleText,
    opacity: 0.5,
  },
  overdueBadge: {
    backgroundColor: '#3a0a0a',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ff453a',
  },
  overdueBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#ff453a',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  categoryChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 212, 170, 0.1)',
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.accent,
    textTransform: 'capitalize',
  },
  priorityChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  priorityChipText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dueDateText: {
    fontSize: 11,
    color: COLORS.subtleText,
    marginTop: 4,
  },
});

export default React.memo(TaskItem);