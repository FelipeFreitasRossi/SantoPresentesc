// app/components/Sidebar.tsx
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
    setTimeout(() => router.push(rota), 100);
  };

  return (
    <Animated.View style={[styles.container, animatedStyle, { backgroundColor: theme.card }]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Feather name="x" size={28} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.text }]}>Menu</Text>
        </View>

        {/* Container principal com flex:1 e justifyContent space-between */}
        <View style={styles.content}>
          {/* Itens do menu principais */}
          <View>
            <TouchableOpacity style={styles.menuItem} onPress={() => navegarPara('/(tabs)')}>
              <Feather name="home" size={22} color={theme.text} />
              <Text style={[styles.menuText, { color: theme.text }]}>Início</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => navegarPara('/(tabs)/produtos')}>
              <Feather name="shopping-bag" size={22} color={theme.text} />
              <Text style={[styles.menuText, { color: theme.text }]}>Produtos</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => navegarPara('/(tabs)/ajuda')}>
              <Feather name="help-circle" size={22} color={theme.text} />
              <Text style={[styles.menuText, { color: theme.text }]}>Ajuda</Text>
            </TouchableOpacity>
          </View>

          {/* Botão de tema no final */}
          <TouchableOpacity style={styles.menuItem} onPress={toggleTheme}>
            <Feather name={isDarkMode ? 'sun' : 'moon'} size={22} color={theme.text} />
            <Text style={[styles.menuText, { color: theme.text }]}>
              {isDarkMode ? 'Tema Claro' : 'Tema Escuro'}
            </Text>
          </TouchableOpacity>
        </View>
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
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  closeButton: { marginRight: 20 },
  title: { fontSize: 20, fontWeight: 'bold' },
  content: {
    flex: 1,
    justifyContent: 'space-between', // Isso separa os itens principais do botão de tema
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  menuText: { fontSize: 16, marginLeft: 15 },
});