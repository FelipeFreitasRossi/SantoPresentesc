// app/theme/themes.ts

export type ThemeColors = {
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  accent: string;
  headerBackground: string;
  footerBackground: string;
  iconColor: string;
  statusBarStyle: 'light-content' | 'dark-content';
};

export const lightTheme: ThemeColors = {
  background: '#F8F9FA',
  card: '#FFFFFF',
  text: '#222',
  textSecondary: '#666',
  border: '#eee',
  primary: '#2ecc71',
  accent: '#25D366',
  headerBackground: '#FFFFFF',
  footerBackground: '#FFFFFF',
  iconColor: '#555',
  statusBarStyle: 'dark-content',
};

export const darkTheme: ThemeColors = {
  background: '#121212',
  card: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  border: '#333',
  primary: '#2ecc71',
  accent: '#25D366',
  headerBackground: '#1E1E1E',
  footerBackground: '#1E1E1E',
  iconColor: '#CCCCCC',
  statusBarStyle: 'light-content',
};