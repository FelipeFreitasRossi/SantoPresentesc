import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, SharedValue } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75;

type Props = {
  translateX: SharedValue<number>;
  onClose: () => void;
};

export default function Sidebar({ translateX, onClose }: Props) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const navegarPara = (rota: string) => {
    onClose(); // Fecha a sidebar primeiro
    // Pequeno atraso para a animação de fechar acontecer antes da navegação
    setTimeout(() => {
      router.push(rota);
    }, 100);
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Feather name="x" size={28} color="#FAF9F6" />
          </TouchableOpacity>
          <Text style={styles.title}>Menu</Text>
        </View>
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navegarPara('/(tabs)')}
          >
            <Feather name="home" size={22} color="#FAF9F6" />
            <Text style={styles.menuText}>Início</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navegarPara('/(tabs)/produtos')}
          >
            <Feather name="shopping-bag" size={22} color="#FAF9F6" />
            <Text style={styles.menuText}>Produtos</Text>
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
    backgroundColor: '#1a1a1a',
    zIndex: 1000,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  closeButton: {
    marginRight: 20,
  },
  title: {
    color: '#FAF9F6',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
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
  menuText: {
    color: '#FAF9F6',
    fontSize: 16,
    marginLeft: 15,
  },
});