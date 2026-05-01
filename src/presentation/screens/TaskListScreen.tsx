import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, UIManager, Platform, Keyboard, Alert, ScrollView } from 'react-native';
import { Appbar, FAB, ActivityIndicator, Searchbar, Chip } from 'react-native-paper';
import { SwipeListView } from 'react-native-swipe-list-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTaskStore } from '../state/taskStore';
import { useAuthStore } from '../state/authStore';
import { AuthService } from '../../data/services/authService';
import AddTaskModal from '../components/AddTaskModal';
import TaskItem from '../components/TaskItem';
import EmptyState from '../components/EmptyState';
import DashboardStats from '../components/DashboardStats';
import { Task, TaskFilterType } from '../../domain/models/Task';
import { COLORS } from '../theme/colors';
import { showSuccessToast } from '../../domain/utils/toastManager';


const groupTasks = (tasks: Task[]) => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const todayStart = today.setHours(0, 0, 0, 0);
  const tomorrowStart = tomorrow.setHours(0, 0, 0, 0);
  
  const sections: { title: string; data: Task[] }[] = [
    { title: 'Overdue', data: [] },
    { title: 'Today', data: [] },
    { title: 'Tomorrow', data: [] },
    { title: 'This Week', data: [] },
  ];
  
  tasks.forEach(task => {
    const taskDueDate = new Date(task.dueDate).setHours(0, 0, 0, 0);
    
    if (!task.isComplete && taskDueDate < todayStart) {
      sections[0].data.push(task);
    } else if (taskDueDate === todayStart) {
      sections[1].data.push(task);
    } else if (taskDueDate === tomorrowStart) {
      sections[2].data.push(task);
    } else if (taskDueDate > tomorrowStart) {
      sections[3].data.push(task);
    }
  });

  return sections.filter(section => section.data.length > 0);
};

const TaskListScreen = () => {
  const insets = useSafeAreaInsets();
  const { 
    tasks, 
    isLoading, 
    fetchTasks, 
    deleteTask, 
    updateTask, 
    filter, 
    setFilter,
    getTaskStats,
    getFilteredTasks,
  } = useTaskStore();
  const { userProfile } = useAuthStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);

  useEffect(() => { 
    fetchTasks(); 
  }, []);

  useEffect(() => { 
    if (!isLoading) { 
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring); 
    } 
  }, [tasks]);
  
  const filteredTasks = useMemo(() => {
    const baseFiltered = getFilteredTasks().filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      task.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return baseFiltered;
  }, [tasks, searchQuery, filter, getFilteredTasks]);

  const taskSections = useMemo(() => groupTasks(filteredTasks), [filteredTasks]);
  const taskStats = useMemo(() => getTaskStats(), [tasks]);

  const filterOptions: { label: string; value: TaskFilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
    { label: `Overdue (${taskStats.overdue})`, value: 'overdue' },
  ];

  const handleEdit = useCallback((task: Task) => { 
    setTaskToEdit(task); 
    setModalVisible(true); 
  }, []);

  const handleToggleComplete = useCallback((task: Task) => { 
    updateTask(task.id, { isComplete: !task.isComplete });
    const message = !task.isComplete ? 'Task completed!' : 'Task marked as incomplete';
    showSuccessToast(message);
  }, [updateTask]);

  const handleDeleteTask = (task: Task) => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${task.title}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            await deleteTask(task.id);
            showSuccessToast('Task deleted successfully');
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleAddNew = () => { 
    setTaskToEdit(undefined); 
    setModalVisible(true); 
  };

  const handleFilterChange = (value: TaskFilterType) => {
    setFilter(value);
  };
  
  const renderHiddenItem = (data: { item: Task }) => (
    <View style={styles.taskRowBack}>
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => handleDeleteTask(data.item)}
      >
        <Appbar.Action icon="delete" color="white" size={24} />
      </TouchableOpacity>
    </View>
  );

  const renderSectionHeader = ({ section: { title } }: any) => (
    <Text style={[styles.sectionHeader, title === 'Overdue' && styles.overdueSectionHeader]}>
      {title}
    </Text>
  );

  return (
    <View style={styles.container}>
      {}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <LinearGradient colors={['#00897B', '#00695C']} style={StyleSheet.absoluteFillObject} />
        <View style={styles.headerContent}>
          {searchVisible ? (
            <Searchbar 
              placeholder="Search tasks..." 
              onChangeText={setSearchQuery} 
              value={searchQuery} 
              style={styles.searchbar} 
              autoFocus 
              onBlur={() => setSearchVisible(false)} 
              iconColor={COLORS.primary} 
            />
          ) : (
            <>
              <View style={styles.titleRow}>
                 <Appbar.Content 
                  title="Task Manager" 
                  titleStyle={styles.headerTitle} 
                  style={{ flex: 1 }} 
                />
                {userProfile && (
                  <Chip
                    style={[
                      styles.roleChip, 
                      { backgroundColor: userProfile.role === 'admin' ? '#FF6B6B' : '#4ECDC4' }
                    ]}
                    textStyle={styles.roleChipText}
                  >
                    {userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1)}
                  </Chip>
                )}
              </View>
              <View style={styles.headerActions}>
                <Appbar.Action 
                  icon="magnify" 
                  onPress={() => setSearchVisible(true)} 
                  color={COLORS.white} 
                />
                <Appbar.Action 
                  icon="logout" 
                  onPress={() => AuthService.signOut()} 
                  color={COLORS.white} 
                />
              </View>
            </>
          )}
        </View>
      </View>

      {}
      {!searchVisible && (
        <DashboardStats 
          total={taskStats.total}
          completed={taskStats.completed}
          overdue={taskStats.overdue}
          dueSoon={taskStats.dueSoon}
        />
      )}

      {}
      {!searchVisible && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {filterOptions.map(option => (
            <Chip
              key={option.value}
              selected={filter === option.value}
              onPress={() => handleFilterChange(option.value)}
              style={[
                styles.filterChip,
                filter === option.value && styles.filterChipActive
              ]}
              textStyle={[
                styles.filterChipText,
                filter === option.value && styles.filterChipTextActive
              ]}
            >
              {option.label}
            </Chip>
          ))}
        </ScrollView>
      )}

      {}
      {isLoading && tasks.length === 0 ? (
        <ActivityIndicator style={{ flex: 1 }} size="large" color={COLORS.primary} />
      ) : taskSections.length === 0 ? (
        <EmptyState />
      ) : (
        <SwipeListView
          sections={taskSections}
          renderItem={({ item }) => (
            <TaskItem 
              item={item} 
              onEdit={handleEdit} 
              onToggleComplete={handleToggleComplete}
            />
          )}
          renderHiddenItem={renderHiddenItem}
          renderSectionHeader={renderSectionHeader}
          rightOpenValue={-75}
          disableRightSwipe
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          useSectionList
          onScroll={() => Keyboard.dismiss()}
        />
      )}

      {}
      <FAB 
        style={styles.fab} 
        icon="plus" 
        onPress={handleAddNew}
      />

      {}
      <AddTaskModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        taskToEdit={taskToEdit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  header: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    gap: 12,
  },
  roleChip: {
    height: 32,
    alignSelf: 'center',
  },
  roleChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  headerActions: {
    flexDirection: 'row',
  },
  searchbar: {
    flex: 1,
    borderRadius: 12,
  },
  filterContainer: {
    paddingVertical: 12,
    maxHeight: 60,
  },
  filterContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.primaryLight,
    borderWidth: 1,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 12,
    color: COLORS.text,
  },
  filterChipTextActive: {
    color: COLORS.white,
  },
  listContent: { 
    paddingHorizontal: 16, 
    paddingBottom: 100,
  },
  sectionHeader: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: COLORS.text, 
    marginTop: 24, 
    marginBottom: 8, 
    paddingHorizontal: 4,
  },
  overdueSectionHeader: { 
    color: '#FF6B6B', 
    fontSize: 19, 
    fontWeight: '700' 
  },
  taskRowBack: { 
    alignItems: 'center', 
    flex: 1, 
    marginVertical: 1, 
    marginBottom: 12,
  },
  deleteButton: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    position: 'absolute', 
    top: 0, 
    bottom: 0, 
    right: 0, 
    width: 75, 
    backgroundColor: COLORS.danger, 
    borderRadius: 16,
  },
  fab: { 
    position: 'absolute', 
    margin: 24, 
    right: 0, 
    bottom: 0, 
    backgroundColor: COLORS.primary, 
    borderRadius: 18,
  },
});

export default TaskListScreen;
