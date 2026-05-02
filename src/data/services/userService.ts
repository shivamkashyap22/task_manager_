import { db } from '../firebaseConfig';
import { User, CreateUserPayload, UserRole } from '../../domain/models/User';

const USERS_COLLECTION = 'users';

export class UserService {
  static async createUser(userId: string, payload: CreateUserPayload): Promise<void> {
    const user: User = {
      id: userId,
      email: payload.email,
      role: payload.role,
      createdAt: Date.now(),
    };
    
    await db.collection(USERS_COLLECTION).doc(userId).set(user);
  }

  static async getUser(userId: string): Promise<User | null> {
    const docSnap = await db.collection(USERS_COLLECTION).doc(userId).get();
    
    // ✅ FIX HERE (.exists not .exists())
    if (!docSnap.exists) {
      return null;
    }
    
    return docSnap.data() as User;
  }

  static async updateUserRole(userId: string, role: UserRole): Promise<void> {
    await db.collection(USERS_COLLECTION).doc(userId).update({ role });
  }

  static async updateUserDisplayName(userId: string, displayName: string): Promise<void> {
    await db.collection(USERS_COLLECTION).doc(userId).update({ displayName });
  }

  static async getUsersByRole(role: UserRole): Promise<User[]> {
    const snapshot = await db
      .collection(USERS_COLLECTION)
      .where('role', '==', role)
      .get();

    const users: User[] = [];
    snapshot.forEach((doc) => {
      users.push(doc.data() as User);
    });

    return users;
  }
}