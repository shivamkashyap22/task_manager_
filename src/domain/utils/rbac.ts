import { UserRole } from '../domain/models/User';

export type Permission = 'create_task' | 'edit_task' | 'delete_task' | 'view_all_tasks' | 'manage_users';

const rolePermissions: Record<UserRole, Permission[]> = {
  member: ['create_task', 'edit_task', 'delete_task'],
  admin: ['create_task', 'edit_task', 'delete_task', 'view_all_tasks', 'manage_users'],
};


export const hasPermission = (role: UserRole, permission: Permission): boolean => {
  return rolePermissions[role].includes(permission);
};


export const canPerformAction = (role: UserRole | undefined, permission: Permission): boolean => {
  if (!role) return false;
  return hasPermission(role, permission);
};


export const getRolePermissions = (role: UserRole): Permission[] => {
  return rolePermissions[role];
};
