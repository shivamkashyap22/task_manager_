# Task Management App - API Documentation

## Overview

This application uses Firebase Firestore for the backend, which provides real-time cloud database functionality. Below is the comprehensive API reference for all data models and operations.

## Base Configuration

All requests are made through Firebase SDK directly. No traditional HTTP endpoints are required for the mobile app.

## Authentication

### Sign Up
```typescript
// Request
AuthService.signUp(email: string, password: string, role: 'admin' | 'member')

// Response
{
  user: {
    uid: string;
    email: string;
  }
  userProfile: {
    uid: string;
    email: string;
    role: 'admin' | 'member';
    createdAt: timestamp;
  }
}
```

### Log In
```typescript
// Request
AuthService.signIn(email: string, password: string)

// Response
{
  user: {
    uid: string;
    email: string;
  }
}
```

### Log Out
```typescript
// Request
AuthService.signOut()

// Response
void (success or throws error)
```

## Data Models

### User Model
```typescript
interface User {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'member';
  createdAt: number; // timestamp
  updatedAt: number; // timestamp
  profilePicture?: string;
  settings?: {
    notificationsEnabled: boolean;
    theme: 'light' | 'dark';
  }
}
```

**Firestore Collection**: `users/{userId}`

### Task Model
```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: number; // timestamp
  priority: 'low' | 'medium' | 'high';
  category: string;
  isComplete: boolean;
  userId: string;
  createdAt?: number;
  updatedAt?: number;
  assignedTo?: string;
  tags?: string[];
}
```

**Firestore Collection**: `tasks/{taskId}`

### Activity Log Model
```typescript
interface ActivityLog {
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
```

**Firestore Collection**: `activityLogs/{logId}`

## Task Operations

### Create Task
```typescript
// Request
TaskService.addTask(taskPayload: NewTaskPayload)

// Payload
{
  title: string;        // Required, 1-100 chars
  description: string;  // Optional, max 500 chars
  dueDate: number;      // Required, Unix timestamp
  priority: 'low' | 'medium' | 'high'; // Required
  category: string;     // Required, 1-50 chars
  isComplete: boolean;  // false by default
  userId: string;       // Set from auth
  createdAt: number;    // Set server-side
  updatedAt: number;    // Set server-side
  tags?: string[];      // Optional
}

// Response
string (taskId)
```

### Get Tasks
```typescript
// Request
TaskService.getTasks(userId: string)

// Response
Task[]
```

### Update Task
```typescript
// Request
TaskService.updateTask(taskId: string, updates: Partial<Task>)

// Updates can include:
{
  title?: string;
  description?: string;
  dueDate?: number;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  isComplete?: boolean;
  updatedAt: number; // Set server-side
}

// Response
void
```

### Delete Task
```typescript
// Request
TaskService.deleteTask(taskId: string)

// Response
void
```

## User Operations

### Get User Profile
```typescript
// Request
UserService.getUserProfile(userId: string)

// Response
User
```

### Update User Profile
```typescript
// Request
UserService.updateUserProfile(userId: string, updates: Partial<User>)

// Response
void
```

## Activity Log Operations

### Log Activity
```typescript
// Request
ActivityLogService.logActivity(log: Omit<ActivityLog, 'id'>)

// Response
string (logId)
```

### Get Task Activity Logs
```typescript
// Request
ActivityLogService.getTaskActivityLogs(taskId: string)

// Response
ActivityLog[]
```

### Get User Activity Logs
```typescript
// Request
ActivityLogService.getUserActivityLogs(userId: string, limit?: number)

// Response
ActivityLog[] (max 50 by default)
```

## Validation Rules

### Task Validation
- **Title**: Required, 1-100 characters
- **Description**: Optional, maximum 500 characters
- **Category**: Required, 1-50 characters
- **Priority**: Must be 'low', 'medium', or 'high'
- **Due Date**: Must be a valid Date object
- **userId**: Must match authenticated user's ID

### User Validation
- **Email**: Must match email format
- **Password**: Minimum 6 characters
- **Role**: Must be 'admin' or 'member'

## Query Examples

### Get All Active Tasks for a User
```typescript
const userId = auth.currentUser.uid;
const snapshot = await db
  .collection('tasks')
  .where('userId', '==', userId)
  .where('isComplete', '==', false)
  .orderBy('dueDate', 'asc')
  .get();
```

### Get Overdue Tasks
```typescript
const today = new Date();
today.setHours(0, 0, 0, 0);
const todayTimestamp = today.getTime();

const snapshot = await db
  .collection('tasks')
  .where('userId', '==', userId)
  .where('dueDate', '<', todayTimestamp)
  .where('isComplete', '==', false)
  .get();
```

### Get Tasks by Category
```typescript
const snapshot = await db
  .collection('tasks')
  .where('userId', '==', userId)
  .where('category', '==', 'Work')
  .orderBy('dueDate', 'asc')
  .get();
```

### Get Tasks by Priority
```typescript
const snapshot = await db
  .collection('tasks')
  .where('userId', '==', userId)
  .where('priority', '==', 'high')
  .orderBy('dueDate', 'asc')
  .get();
```

## Firestore Security Rules

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId;
      allow create: if request.auth.uid == request.resource.data.uid;
    }

    // Tasks collection
    match /tasks/{taskId} {
      allow read: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
      allow update: if request.auth.uid == resource.data.userId;
      allow delete: if request.auth.uid == resource.data.userId;
    }

    // Activity logs collection
    match /activityLogs/{logId} {
      allow read: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
      allow update, delete: if false;
    }
  }
}
```

## Rate Limiting

Firebase has built-in rate limiting:
- **Free Tier**: 20,000 reads/writes/deletes per day
- **Paid Tier**: Up to 50 per second per collection

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| UNAUTHENTICATED | User not logged in | Login first |
| PERMISSION_DENIED | User lacks permissions | Check Firestore rules |
| NOT_FOUND | Document doesn't exist | Verify document ID |
| INVALID_ARGUMENT | Invalid query | Check query syntax |
| FAILED_PRECONDITION | Precondition failed | Retry operation |

## Pagination

### Implementing Pagination
```typescript
// Get first page
const firstPage = await db
  .collection('tasks')
  .where('userId', '==', userId)
  .orderBy('dueDate', 'desc')
  .limit(10)
  .get();

// Get next page using last document
const lastDoc = firstPage.docs[firstPage.docs.length - 1];
const nextPage = await db
  .collection('tasks')
  .where('userId', '==', userId)
  .orderBy('dueDate', 'desc')
  .limit(10)
  .startAfter(lastDoc)
  .get();
```

## Performance Tips

1. **Index frequently queried fields**
   - Set up Firestore indexes for complex queries
   - Firestore will suggest indexes automatically

2. **Limit documents returned**
   - Use `.limit()` for large collections
   - Implement pagination

3. **Use real-time listeners efficiently**
   - Only listen to specific collections/documents
   - Unsubscribe when no longer needed

4. **Batch operations**
   - Group related writes in transactions
   - Use batch writes for multiple documents

## Versioning

**Current API Version**: 1.0.0

The API follows semantic versioning. Breaking changes will increment the major version.

## Support

For API-related questions or issues:
- Check Firebase documentation: https://firebase.google.com/docs
- Open GitHub issue: https://github.com/yourusername/task-app/issues
- Email support: support@taskapp.com
