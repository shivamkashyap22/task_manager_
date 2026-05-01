export type UserRole = 'admin' | 'member';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: number;
  displayName?: string;
}

export interface CreateUserPayload {
  email: string;
  role: UserRole;
}
