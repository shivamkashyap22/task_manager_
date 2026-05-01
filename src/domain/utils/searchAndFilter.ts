import { Task } from '../models/Task';
import { Validations } from './validations';



export interface SearchOptions {
  query: string;
  caseSensitive?: boolean;
  fields?: ('title' | 'description' | 'category')[];
}

export interface FilterOptions {
  status?: 'active' | 'completed';
  priority?: ('low' | 'medium' | 'high')[];
  category?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  isOverdue?: boolean;
}

export class SearchAndFilterService {
  
  static searchTasks(tasks: Task[], options: SearchOptions): Task[] {
    const { query, caseSensitive = false, fields = ['title', 'category'] } = options;
    
    if (!query || query.trim().length === 0) {
      return tasks;
    }

    const searchQuery = caseSensitive ? query : query.toLowerCase();

    return tasks.filter(task => {
      if (fields.includes('title')) {
        const title = caseSensitive ? task.title : task.title.toLowerCase();
        if (title.includes(searchQuery)) return true;
      }

      if (fields.includes('description')) {
        const description = caseSensitive ? task.description : task.description.toLowerCase();
        if (description.includes(searchQuery)) return true;
      }

      if (fields.includes('category')) {
        const category = caseSensitive ? task.category : task.category.toLowerCase();
        if (category.includes(searchQuery)) return true;
      }

      return false;
    });
  }

  
  static filterTasks(tasks: Task[], options: FilterOptions): Task[] {
    return tasks.filter(task => {
      
      if (options.status) {
        const isActive = !task.isComplete;
        const matches = options.status === 'active' ? isActive : !isActive;
        if (!matches) return false;
      }

      
      if (options.priority && options.priority.length > 0) {
        if (!options.priority.includes(task.priority)) return false;
      }

      
      if (options.category && options.category.length > 0) {
        if (!options.category.includes(task.category)) return false;
      }

      
      if (options.dateRange) {
        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 0, 0, 0);
        
        const startDate = new Date(options.dateRange.start);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(options.dateRange.end);
        endDate.setHours(23, 59, 59, 999);

        if (taskDate < startDate || taskDate > endDate) return false;
      }

      
      if (options.isOverdue !== undefined) {
        const isOverdue = Validations.isTaskOverdue(new Date(task.dueDate), task.isComplete);
        if (options.isOverdue && !isOverdue) return false;
        if (!options.isOverdue && isOverdue) return false;
      }

      return true;
    });
  }

  
  static searchAndFilter(
    tasks: Task[],
    searchOptions?: SearchOptions,
    filterOptions?: FilterOptions
  ): Task[] {
    let result = tasks;

    if (searchOptions) {
      result = this.searchTasks(result, searchOptions);
    }

    if (filterOptions) {
      result = this.filterTasks(result, filterOptions);
    }

    return result;
  }

  
  static getUniqueCategories(tasks: Task[]): string[] {
    const categories = new Set<string>();
    tasks.forEach(task => {
      if (task.category) {
        categories.add(task.category);
      }
    });
    return Array.from(categories).sort();
  }

  
  static getUniquePriorities(tasks: Task[]): ('low' | 'medium' | 'high')[] {
    const priorities = new Set<'low' | 'medium' | 'high'>();
    tasks.forEach(task => {
      priorities.add(task.priority);
    });
    return Array.from(priorities).sort();
  }

  
  static sortTasks(
    tasks: Task[],
    sortBy: 'dueDate' | 'priority' | 'created' | 'title',
    order: 'asc' | 'desc' = 'asc'
  ): Task[] {
    const sorted = [...tasks];
    const multiplier = order === 'asc' ? 1 : -1;

    switch (sortBy) {
      case 'dueDate':
        return sorted.sort((a, b) => (a.dueDate - b.dueDate) * multiplier);
      
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return sorted.sort((a, b) => 
          (priorityOrder[a.priority] - priorityOrder[b.priority]) * multiplier
        );
      
      case 'created':
        return sorted.sort((a, b) => 
          ((a.createdAt || 0) - (b.createdAt || 0)) * multiplier
        );
      
      case 'title':
        return sorted.sort((a, b) => 
          a.title.localeCompare(b.title) * multiplier
        );
      
      default:
        return sorted;
    }
  }
}
