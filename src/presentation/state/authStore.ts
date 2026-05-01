import { create } from 'zustand';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../data/firebaseConfig';
import { UserService } from '../../data/services/userService';
import { User } from '../../domain/models/User';

interface AuthState {
  firebaseUser: FirebaseUser | null;
  userProfile: User | null;
  isLoading: boolean;
  setUser: (user: FirebaseUser | null) => void;
  setUserProfile: (profile: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  firebaseUser: null,
  userProfile: null,
  isLoading: true,
  setUser: (user) => set({ firebaseUser: user }),
  setUserProfile: (profile) => set({ userProfile: profile }),
}));

onAuthStateChanged(auth, async (firebaseUser) => {
  useAuthStore.getState().setUser(firebaseUser);
  
  if (firebaseUser) {
    
    const userProfile = await UserService.getUser(firebaseUser.uid);
    useAuthStore.getState().setUserProfile(userProfile);
  } else {
    useAuthStore.getState().setUserProfile(null);
  }
  
  if (useAuthStore.getState().isLoading) {
    useAuthStore.setState({ isLoading: false });
  }
});