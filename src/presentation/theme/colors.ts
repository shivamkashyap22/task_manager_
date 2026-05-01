export const COLORS_LIGHT = {
  primary: '#1a1a1a',
  primaryLight: '#f5f5f5',
  background: '#0a0a0a',
  surface: '#141414',
  text: '#ffffff',
  subtleText: '#888888',
  white: '#ffffff',
  danger: '#ff3b30',
  priorityHigh: '#ff3b30',
  priorityMedium: '#ffcc00',
  priorityLow: '#34c759',
  accent: '#00d4aa',
  card: '#1a1a1a',
  border: '#2a2a2a',
  success: '#34c759',
};

export const COLORS_DARK = {
  primary: '#00d4aa',
  primaryLight: '#0a2a2a',
  background: '#000000',
  surface: '#0a0a0a',
  text: '#ffffff',
  subtleText: '#999999',
  white: '#ffffff',
  danger: '#ff453a',
  priorityHigh: '#ff453a',
  priorityMedium: '#ffd60a',
  priorityLow: '#32d74b',
  accent: '#00d4aa',
  card: '#0f0f0f',
  border: '#1a1a1a',
  success: '#32d74b',
};


export const COLORS = COLORS_DARK;


export const getColorsByTheme = (isDarkMode: boolean) => {
  return isDarkMode ? COLORS_DARK : COLORS_LIGHT;
};