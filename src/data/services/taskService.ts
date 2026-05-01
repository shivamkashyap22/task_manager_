import { db } from '../firebaseConfig';
import { Task, NewTaskPayload } from '../../domain/models/Task';

const TASKS_COLLECTION = 'tasks';

export class TaskService {
  static async getTasks(userId: string): Promise<Task[]> {
    
    const snapshot = await db
      .collection(TASKS_COLLECTION)
      .where('userId', '==', userId)
      .orderBy('dueDate', 'asc')
      .get();
      
    const tasks: Task[] = [];
    snapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() } as Task);
    });
    return tasks;
  }

  static async addTask(taskPayload: NewTaskPayload): Promise<string> {
    
    const docRef = await db.collection(TASKS_COLLECTION).add(taskPayload);
    return docRef.id;
  }

  static async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    
    const taskDoc = db.collection(TASKS_COLLECTION).doc(taskId);
    return taskDoc.update(updates);
  }

  static async deleteTask(taskId: string): Promise<void> {
    
    const taskDoc = db.collection(TASKS_COLLECTION).doc(taskId);
    return taskDoc.delete();
  }
}