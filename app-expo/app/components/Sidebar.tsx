import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, SharedValue } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75;

type Props = { translateX: SharedValue<number>; onClose: () => void };

export default function Sidebar({ translateX, onClose }: Props) {
  const { theme, isDarkMode, toggleTheme } = useTheme();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const navegarPara = (rota: string) => {
    onClose();
    setTimeout(() => router.push(rota), 150);
  };

  const menuItens = [
    { icone: 'home', label: 'Início', rota: '/(tabs)' },
    { icone: 'shopping-bag', label: 'Produtos', rota: '/(tabs)/produtos' },
    { icone: 'camera', label: 'Looks', rota: '/(tabs)/looks' },
    { icone: 'help-circle', label: 'Ajuda', rota: '/(tabs)/ajuda' },
  ];

  return (
    <Animated.View style={[styles.container, animatedStyle, { backgroundColor: theme.card }]}>
      <SafeAreaView style={styles.safeArea}>

        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Feather name="x" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Menu</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.menuList}>
          {menuItens.map((item) => (
            <TouchableOpacity
              key={item.rota}
              style={styles.menuItem}
              onPress={() => navegarPara(item.rota)}
            >
              <View style={[styles.iconCircle, { backgroundColor: theme.primary + '20' }]}>
                <Feather name={item.icone} size={22} color={theme.primary} />
              </View>
              <Text style={[styles.menuLabel, { color: theme.text }]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
          <View style={[styles.iconCircle, { backgroundColor: theme.text + '20' }]}>
            <Feather name={isDarkMode ? 'sun' : 'moon'} size={22} color={theme.text} />
          </View>
          <Text style={[styles.themeText, { color: theme.text }]}>
            {isDarkMode ? 'Tema Claro' : 'Tema Escuro'}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SIDEBAR_WIDTH,
    height: '100%',
    zIndex: 1000,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  closeButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  menuList: { paddingTop: 20 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuLabel: { fontSize: 16, fontWeight: '500' },
  divider: { height: 1, marginVertical: 16, marginHorizontal: 20 },
  themeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  themeText: { fontSize: 16, fontWeight: '500', marginLeft: 16 },
});