import { db } from '../firebaseConfig';

export interface ActivityLog {
  id?: string;
  userId: string;
  taskId: string;
  taskTitle: string;
  action: 'created' | 'updated' | 'completed' | 'deleted';
  previousValue?: Record<string, any>;
  newValue?: Record<string, any>;
  timestamp: number;
  userEmail?: string;
}

const ACTIVITY_LOG_COLLECTION = 'activityLogs';

export class ActivityLogService {
  static async logActivity(log: Omit<ActivityLog, 'id'>): Promise<string> {
    try {
      
      const cleanLog: any = { timestamp: log.timestamp || Date.now() };
      if (log.userId !== undefined) cleanLog.userId = log.userId;
      if (log.taskId !== undefined) cleanLog.taskId = log.taskId;
      if (log.taskTitle !== undefined) cleanLog.taskTitle = log.taskTitle;
      if (log.action !== undefined) cleanLog.action = log.action;
      if (log.previousValue !== undefined) cleanLog.previousValue = log.previousValue;
      if (log.newValue !== undefined) cleanLog.newValue = log.newValue;
      if (log.userEmail !== undefined) cleanLog.userEmail = log.userEmail;

      const docRef = await db.collection(ACTIVITY_LOG_COLLECTION).add(cleanLog);
      return docRef.id;
    } catch (error) {
      console.error('Error logging activity:', error);
      throw error;
    }
  }

  static async getTaskActivityLogs(taskId: string): Promise<ActivityLog[]> {
    try {
      const snapshot = await db
        .collection(ACTIVITY_LOG_COLLECTION)
        .where('taskId', '==', taskId)
        .orderBy('timestamp', 'desc')
        .get();

      const logs: ActivityLog[] = [];
      snapshot.forEach((doc) => {
        logs.push({ id: doc.id, ...doc.data() } as ActivityLog);
      });
      return logs;
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      return [];
    }
  }

  static async getUserActivityLogs(userId: string, limit = 50): Promise<ActivityLog[]> {
    try {
      const snapshot = await db
        .collection(ACTIVITY_LOG_COLLECTION)
        .where('userId', '==', userId)
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .get();

      const logs: ActivityLog[] = [];
      snapshot.forEach((doc) => {
        logs.push({ id: doc.id, ...doc.data() } as ActivityLog);
      });
      return logs;
    } catch (error) {
      console.error('Error fetching user activity logs:', error);
      return [];
    }
  }

  
  static formatActivityMessage(log: ActivityLog): string {
    const timestamp = new Date(log.timestamp).toLocaleString();
    
    switch (log.action) {
      case 'created':
        return `Task created by ${log.userEmail} on ${timestamp}`;
      case 'updated':
        return `Task updated by ${log.userEmail} on ${timestamp}`;
      case 'completed':
        return `Task completed by ${log.userEmail} on ${timestamp}`;
      case 'deleted':
        return `Task deleted by ${log.userEmail} on ${timestamp}`;
      default:
        return `Activity logged on ${timestamp}`;
    }
  }
}
