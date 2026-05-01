import { create } from 'zustand';
import { Task, NewTaskPayload, TaskStats, TaskFilterType } from '../../domain/models/Task';
import { TaskService } from '../../data/services/taskService';
import { ActivityLogService } from '../../data/services/activityLogService';
import { useAuthStore } from './authStore';
import { Validations } from '../../domain/utils/validations';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  filter: TaskFilterType;
  
  
  fetchTasks: () => Promise<void>;
  addTask: (taskPayload: Omit<Task, 'id' | 'userId' | 'isComplete'>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  setFilter: (filter: TaskFilterType) => void;
  
  
  getOverdueTasks: () => Task[];
  getDueSoonTasks: () => Task[];
  getActiveTasks: () => Task[];
  getCompletedTasks: () => Task[];
  getTaskStats: () => TaskStats;
  getFilteredTasks: () => Task[];
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  filter: 'all',

  fetchTasks: async () => {
    const userId = useAuthStore.getState().firebaseUser?.uid;
    if (!userId) return;

    set({ isLoading: true, error: null });
    try {
      const tasks = await TaskService.getTasks(userId);
      set({ tasks, isLoading: false });
    } catch (e) {
      set({ error: 'Failed to fetch tasks.', isLoading: false });
    }
  },

  addTask: async (taskPayload) => {
    const userId = useAuthStore.getState().firebaseUser?.uid;
    const userProfile = useAuthStore.getState().userProfile;
    if (!userId) {
      set({ error: 'You must be logged in to create a task.' });
      return;
    }

    const newTaskData: NewTaskPayload = { 
      ...taskPayload, 
      userId, 
      isComplete: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    try {
      const newTaskId = await TaskService.addTask(newTaskData);
      const newTaskWithId: Task = {
        id: newTaskId,
        ...newTaskData,
      };

      set(state => ({
        tasks: [...state.tasks, newTaskWithId].sort((a, b) => a.dueDate - b.dueDate)
      }));

      
      await ActivityLogService.logActivity({
        userId,
        taskId: newTaskId,
        taskTitle: taskPayload.title,
        action: 'created',
        newValue: newTaskData,
        timestamp: Date.now(),
        userEmail: userProfile?.email,
      });

    } catch (error) {
      console.error('Error saving task to Firestore:', error);
      set({ error: 'Failed to save task. Please try again.' });
    }
  },

  updateTask: async (taskId, updates) => {
    const userId = useAuthStore.getState().firebaseUser?.uid;
    const userProfile = useAuthStore.getState().userProfile;
    
    try {
      const task = get().tasks.find(t => t.id === taskId);
      await TaskService.updateTask(taskId, { ...updates, updatedAt: Date.now() });
      set(state => ({
        tasks: state.tasks.map(task => 
          task.id === taskId ? { ...task, ...updates, updatedAt: Date.now() } : task
        ).sort((a, b) => a.dueDate - b.dueDate)
      }));

      
      if (task && userId) {
        const action: 'updated' | 'completed' = updates.isComplete !== undefined && updates.isComplete !== task.isComplete 
          ? 'completed' 
          : 'updated';
        
        await ActivityLogService.logActivity({
          userId,
          taskId,
          taskTitle: task.title,
          action,
          previousValue: task,
          newValue: updates,
          timestamp: Date.now(),
          userEmail: userProfile?.email,
        });
      }
    } catch (error) {
      set({ error: 'Failed to update task.' });
    }
  },

  deleteTask: async (taskId) => {
    const userId = useAuthStore.getState().firebaseUser?.uid;
    const userProfile = useAuthStore.getState().userProfile;
    
    try {
      const task = get().tasks.find(t => t.id === taskId);
      await TaskService.deleteTask(taskId);
      set(state => ({
        tasks: state.tasks.filter(task => task.id !== taskId)
      }));

      
      if (task && userId) {
        await ActivityLogService.logActivity({
          userId,
          taskId,
          taskTitle: task.title,
          action: 'deleted',
          previousValue: task,
          timestamp: Date.now(),
          userEmail: userProfile?.email,
        });
      }
    } catch (error) {
      set({ error: 'Failed to delete task.' });
    }
  },

  setFilter: (filter: TaskFilterType) => {
    set({ filter });
  },

  getOverdueTasks: () => {
    return get().tasks.filter(task => Validations.isTaskOverdue(new Date(task.dueDate), task.isComplete));
  },

  getDueSoonTasks: () => {
    return get().tasks.filter(task => 
      !task.isComplete && 
      Validations.isTaskDueSoon(new Date(task.dueDate)) &&
      !Validations.isTaskOverdue(new Date(task.dueDate), task.isComplete)
    );
  },

  getActiveTasks: () => {
    return get().tasks.filter(task => !task.isComplete);
  },

  getCompletedTasks: () => {
    return get().tasks.filter(task => task.isComplete);
  },

  getTaskStats: (): TaskStats => {
    const state = get();
    const overdue = state.getOverdueTasks();
    const dueSoon = state.getDueSoonTasks();
    const completed = state.getCompletedTasks();
    
    return {
      total: state.tasks.length,
      completed: completed.length,
      overdue: overdue.length,
      dueSoon: dueSoon.length,
    };
  },

  getFilteredTasks: (): Task[] => {
    const state = get();
    const filter = state.filter;

    switch (filter) {
      case 'active':
        return state.getActiveTasks();
      case 'completed':
        return state.getCompletedTasks();
      case 'overdue':
        return state.getOverdueTasks();
      case 'dueSoon':
        return state.getDueSoonTasks();
      case 'all':
      default:
        return state.tasks;
    }
  },
}));