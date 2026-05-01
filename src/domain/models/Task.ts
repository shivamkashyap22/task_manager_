export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: number;
  priority: 'low' | 'medium' | 'high';
  category: string;
  isComplete: boolean;
  userId: string;
  createdAt?: number;
  updatedAt?: number;
  assignedTo?: string; 
  tags?: string[];
}

export type NewTaskPayload = Omit<Task, 'id'>;

export interface TaskStats {
  total: number;
  completed: number;
  overdue: number;
  dueSoon: number; 
}


export type TaskFilterType = 'all' | 'active' | 'completed' | 'overdue' | 'dueSoon';