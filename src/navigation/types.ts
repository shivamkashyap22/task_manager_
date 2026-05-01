import { NativeStackScreenProps } from '@react-navigation/native-stack';


export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  TaskList: undefined; 
};

export type MainStackParamList = {
  TaskList: undefined;
};

export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
export type SignupScreenProps = NativeStackScreenProps<RootStackParamList, 'Signup'>;
export type TaskListScreenProps = NativeStackScreenProps<RootStackParamList, 'TaskList'>;