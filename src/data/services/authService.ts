import { auth } from '../firebaseConfig';
import { AuthCredentials, SignUpCredentials } from '../../domain/models/AuthCredentials';
import { UserService } from './userService';
import { UserRole } from '../../domain/models/User';

export class AuthService {
  static async signUp({ email, password, role = 'member' }: SignUpCredentials) {
    
    const result = await auth.createUserWithEmailAndPassword(email, password);
    
    
    await UserService.createUser(result.user.uid, {
      email,
      role: role as UserRole,
    });
    
    return result;
  }

  static async signIn({ email, password }: AuthCredentials) {
    
    return auth.signInWithEmailAndPassword(email, password);
  }

  static async signOut() {
    
    return auth.signOut();
  }
}