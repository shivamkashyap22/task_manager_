# Task Management Application

A modern, feature-rich task management application built with React Native, Expo, and Firebase. Manage your tasks efficiently with role-based access control, real-time updates, and an intuitive user interface.

## 📋 Features

### Core Features
- **User Authentication**: Secure sign-up and login with Firebase Authentication
- **Task Management**: Create, read, update, and delete tasks with ease
- **Task Organization**: Categorize tasks and set priority levels (Low, Medium, High)
- **Due Date Tracking**: Set due dates for tasks and receive visual indicators for overdue items
- **Task Completion**: Mark tasks as complete and track completion progress

### Advanced Features
- **Overdue Task Detection**: Automatically identifies and highlights overdue tasks
- **Dashboard Analytics**: View task statistics including total, completed, overdue, and due soon counts
- **Task Filtering**: Filter tasks by status (All, Active, Completed, Overdue)
- **Search Functionality**: Search tasks by title or category
- **Role-Based Access Control**: Admin and Member roles with different permissions
- **Activity Logging**: Track who created or modified tasks (bonus feature)
- **Dark Mode Support**: Toggle between light and dark themes (bonus feature)

### UI/UX Enhancements
- **Form Validation**: Comprehensive client-side validation with user-friendly error messages
- **Responsive Design**: Optimized for both mobile and tablet devices
- **Loading States**: Visual feedback during data operations
- **Empty States**: Helpful messages when no tasks are available
- **Swipe Actions**: Swipe to delete tasks with confirmation dialog
- **Toast Notifications**: Real-time feedback for user actions
- **Confirmation Dialogs**: Prevent accidental task deletion

## 🛠 Tech Stack

### Frontend
- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Native Stack Navigator)
- **State Management**: Zustand
- **UI Components**: React Native Paper
- **Styling**: React Native StyleSheet
- **Date/Time Picker**: @react-native-community/datetimepicker
- **Async Storage**: @react-native-async-storage/async-storage
- **Animations**: Expo Linear Gradient, LayoutAnimation

### Backend
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **Hosting**: Firebase (for web deployment)

### Development
- **Language**: TypeScript
- **Build Tool**: Babel
- **Package Manager**: npm/yarn

## Screenshots 
<img width="1080" height="2400" alt="Screenshot_1777573560" src="https://github.com/user-attachments/assets/f1be7f49-07a2-4c11-b7f6-004082909fcd" />
<img width="1080" height="2400" alt="Screenshot_1777573565" src="https://github.com/user-attachments/assets/24eecaa1-fc03-4228-a620-961f16d542d3" />
<img width="1080" height="2400" alt="Screenshot_1777573589" src="https://github.com/user-attachments/assets/a9e245fd-5995-4cd0-a006-a6322d5bc635" />
<img width="1080" height="2400" alt="Screenshot_1777573614" src="https://github.com/user-attachments/assets/9c77a29d-e9f0-47ae-b480-ed913c775165" />



## 📁 Project Structure

```
Task_app/
├── src/
│   ├── data/
│   │   ├── firebaseConfig.ts           # Firebase configuration
│   │   └── services/
│   │       ├── authService.ts          # Authentication logic
│   │       ├── taskService.ts          # Task CRUD operations
│   │       ├── userService.ts          # User profile management
│   │       └── activityLogService.ts   # Activity logging
│   ├── domain/
│   │   ├── models/
│   │   │   ├── AuthCredentials.ts      # Auth data models
│   │   │   ├── Task.ts                 # Task data model
│   │   │   └── User.ts                 # User data model
│   │   └── utils/
│   │       ├── rbac.ts                 # Role-based access control
│   │       ├── validations.ts          # Form validation utilities
│   │       └── toastManager.ts         # Toast notification manager
│   ├── navigation/
│   │   ├── AuthStack.tsx               # Auth navigation flow
│   │   ├── MainStack.tsx               # Main app navigation
│   │   ├── RootNavigator.tsx           # Root navigator
│   │   └── types.ts                    # Navigation types
│   ├── presentation/
│   │   ├── components/
│   │   │   ├── AddTaskModal.tsx        # Task creation/editing modal
│   │   │   ├── TaskItem.tsx            # Task list item component
│   │   │   ├── DashboardStats.tsx      # Dashboard statistics display
│   │   │   ├── EmptyState.tsx          # Empty state UI
│   │   │   └── AppIcon.tsx             # App icon component
│   │   ├── screens/
│   │   │   ├── LoginScreen.tsx         # Login page
│   │   │   ├── SignupScreen.tsx        # Registration page
│   │   │   └── TaskListScreen.tsx      # Main task list page
│   │   ├── state/
│   │   │   ├── authStore.ts            # Auth state management
│   │   │   ├── taskStore.ts            # Task state management
│   │   │   └── settingsStore.ts        # Settings/preferences state
│   │   └── theme/
│   │       └── colors.ts               # Color themes (light & dark)
│   └── types/
│       └── env.d.ts                    # Environment type definitions
├── android/                            # Android-specific configuration
├── app.json                            # Expo app configuration
├── package.json                        # Project dependencies
├── tsconfig.json                       # TypeScript configuration
├── babel.config.js                     # Babel configuration
└── README.md                           # This file
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Android Studio / Xcode (for mobile development)

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd Task_app
```

### Step 2: Install Dependencies
```bash
npm install
# or
yarn install
```

### Step 3: Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or use an existing one
3. Create a Firestore database
4. Enable Authentication (Email/Password)
5. Copy your Firebase configuration

6. Update `src/data/firebaseConfig.ts`:
```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

### Step 4: Configure Environment Variables

Create a `.env` file in the root directory:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Step 5: Run the Application

**Web (Development)**:
```bash
npm run web
# or
yarn web
```

**Android**:
```bash
npm run android
# or
yarn android
```

**iOS**:
```bash
npm run ios
# or
yarn ios
```

## 📚 API Endpoints & Data Models

Since this app uses Firebase, here are the key Firestore collections and operations:

### Authentication
- **Sign Up**: Creates user profile in Firestore
- **Login**: Authenticates user with Firebase
- **Logout**: Signs out user

### Users Collection
```
users/
├── {userId}/
│   ├── email: string
│   ├── displayName: string
│   ├── role: 'admin' | 'member'
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
```

### Tasks Collection
```
tasks/
├── {taskId}/
│   ├── title: string
│   ├── description: string
│   ├── category: string
│   ├── priority: 'low' | 'medium' | 'high'
│   ├── dueDate: timestamp
│   ├── isComplete: boolean
│   ├── userId: string
│   ├── createdAt: timestamp
│   ├── updatedAt: timestamp
│   └── tags: array
```

### Activity Logs Collection
```
activityLogs/
├── {logId}/
│   ├── userId: string
│   ├── taskId: string
│   ├── taskTitle: string
│   ├── action: 'created' | 'updated' | 'completed' | 'deleted'
│   ├── previousValue: object
│   ├── newValue: object
│   ├── timestamp: timestamp
│   └── userEmail: string
```

## 👥 User Roles

### Member Role
- Create new tasks
- Edit own tasks
- Delete own tasks
- View own tasks only
- Mark tasks as complete
- Basic filtering and search

### Admin Role
- All member permissions
- View all users' tasks
- Manage user accounts
- Access activity logs

## 🔐 Security & Validation

### Frontend Validation
- Task title: Required, 1-100 characters
- Task description: Optional, max 500 characters
- Task category: Required, 1-50 characters
- Priority: Must be low, medium, or high
- Due date: Must be a valid date
- Email: Must match email format
- Password: Minimum 6 characters

### Backend Security (Firebase Rules)
- Users can only access their own data
- Admin users have elevated permissions
- Activity logs are immutable
- Timestamps are set server-side

## 🎨 Themes

The app supports light and dark modes.

### Light Theme
- Background: #F4F7F6
- Surface: #FFFFFF
- Text: #263238
- Primary: #00796B

### Dark Theme
- Background: #121212
- Surface: #1E1E1E
- Text: #FFFFFF
- Primary: #00897B

## 📱 Demo Credentials

For testing purposes, create an account using:
- **Email**: demo@example.com
- **Password**: Demo@123
- **Role**: Member

## 🚀 Railway Deployment

### Prerequisites
- Railway account (https://railway.app)
- GitHub account with repository access

### Backend Deployment 

1. **Push code to GitHub**:
```bash
git add .
git commit -m "Deployment ready"
git push origin main
```

2. **Connect to Railway**:
   - Visit Railway.app and login
   - Click "New Project"
   - Select "Deploy from GitHub"
   - Choose your repository
   - Select branch (main)

3. **Configure Environment**:
   - Go to project settings
   - Add environment variables:
     - FIREBASE_PROJECT_ID
     - FIREBASE_API_KEY
     - FIREBASE_AUTH_DOMAIN
     - etc.

4. **Configure Build Settings**:
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Root Directory: `.`

5. **Add Custom Domain**:
   - Go to Deployments
   - Add custom domain
   - Configure DNS records

### Frontend Web Deployment (Expo)

1. **Build for web**:
```bash
npm run build:web
```




**Version**: 1.0.0  
**Last Updated**: April 2026

    Navigate to the project directory

    cd your-repository-name

    Install dependencies
    This command installs all the necessary packages defined in package.json.

    npm install

    Install iOS Pods (For iOS development only)

    cd ios
    pod install
    cd ..

Running the Application

    To run on the iOS Simulator:

    npx react-native run-ios

    To run on an Android Emulator/Device:
    (Ensure you have an emulator running or a device connected)

    npx react-native run-android

