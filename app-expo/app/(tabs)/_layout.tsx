import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function TabsLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Início', tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} /> }} />
      <Tabs.Screen name="produtos" options={{ title: 'Produtos', tabBarIcon: ({ color, size }) => <Feather name="shopping-bag" size={size} color={color} /> }} />
      <Tabs.Screen name="ajuda" options={{ title: 'Ajuda', tabBarIcon: ({ color, size }) => <Feather name="help-circle" size={size} color={color} /> }} />
    </Tabs>
  );
}