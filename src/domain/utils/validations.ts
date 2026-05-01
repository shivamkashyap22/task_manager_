

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export class Validations {
  
  static validateTaskTitle(title: string): ValidationResult {
    if (!title || title.trim().length === 0) {
      return { isValid: false, error: 'Task title is required' };
    }
    if (title.length > 100) {
      return { isValid: false, error: 'Task title must be less than 100 characters' };
    }
    return { isValid: true };
  }

  
  static validateTaskDescription(description: string): ValidationResult {
    if (description && description.length > 500) {
      return { isValid: false, error: 'Description must be less than 500 characters' };
    }
    return { isValid: true };
  }

  
  static validateDueDate(dueDate: Date): ValidationResult {
    if (!dueDate || isNaN(dueDate.getTime())) {
      return { isValid: false, error: 'Please select a valid due date' };
    }
    return { isValid: true };
  }

  
  static validateCategory(category: string): ValidationResult {
    if (!category || category.trim().length === 0) {
      return { isValid: false, error: 'Category is required' };
    }
    if (category.length > 50) {
      return { isValid: false, error: 'Category must be less than 50 characters' };
    }
    return { isValid: true };
  }

  
  static validatePriority(priority: string): ValidationResult {
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(priority)) {
      return { isValid: false, error: 'Priority must be low, medium, or high' };
    }
    return { isValid: true };
  }

  
  static validateEmail(email: string): ValidationResult {
    if (!email || email.trim().length === 0) {
      return { isValid: false, error: 'Email is required' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }
    return { isValid: true };
  }

  
  static validatePassword(password: string): ValidationResult {
    if (!password || password.length === 0) {
      return { isValid: false, error: 'Password is required' };
    }
    if (password.length < 6) {
      return { isValid: false, error: 'Password must be at least 6 characters' };
    }
    return { isValid: true };
  }

  
  static isTaskOverdue(dueDate: Date, isComplete: boolean): boolean {
    if (isComplete) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const taskDate = new Date(dueDate);
    taskDate.setHours(0, 0, 0, 0);
    
    return taskDate < today;
  }

  
  static isTaskDueToday(dueDate: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const taskDate = new Date(dueDate);
    taskDate.setHours(0, 0, 0, 0);
    
    return taskDate.getTime() === today.getTime();
  }

  
  static isTaskDueSoon(dueDate: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const taskDate = new Date(dueDate);
    taskDate.setHours(0, 0, 0, 0);
    
    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    
    return taskDate > today && taskDate <= threeDaysFromNow;
  }
}
