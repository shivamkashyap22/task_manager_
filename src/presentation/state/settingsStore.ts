import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'system';

interface SettingsState {
  themeMode: ThemeMode;
  notificationsEnabled: boolean;
  isLoading: boolean;
  
  
  loadSettings: () => Promise<void>;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  setNotificationsEnabled: (enabled: boolean) => Promise<void>;
}

const SETTINGS_KEY = 'app_settings';

export const useSettingsStore = create<SettingsState>((set) => ({
  themeMode: 'light',
  notificationsEnabled: true,
  isLoading: false,

  loadSettings: async () => {
    set({ isLoading: true });
    try {
      const savedSettings = await AsyncStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        set({
          themeMode: settings.themeMode || 'light',
          notificationsEnabled: settings.notificationsEnabled !== false,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      set({ isLoading: false });
    }
  },

  setThemeMode: async (mode: ThemeMode) => {
    set({ themeMode: mode });
    try {
      const currentSettings = await AsyncStorage.getItem(SETTINGS_KEY);
      const settings = currentSettings ? JSON.parse(currentSettings) : {};
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify({
        ...settings,
        themeMode: mode,
      }));
    } catch (error) {
      console.error('Error saving theme settings:', error);
    }
  },

  setNotificationsEnabled: async (enabled: boolean) => {
    set({ notificationsEnabled: enabled });
    try {
      const currentSettings = await AsyncStorage.getItem(SETTINGS_KEY);
      const settings = currentSettings ? JSON.parse(currentSettings) : {};
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify({
        ...settings,
        notificationsEnabled: enabled,
      }));
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  },
}));
