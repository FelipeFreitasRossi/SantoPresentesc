import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image, ImageSourcePropType } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

type Props = {
  onMenuPress: () => void;
  logoSource?: ImageSourcePropType; // Aceita require ou { uri: string }
};

export default function CustomHeader({ onMenuPress, logoSource }: Props) {
  const { theme } = useTheme();

  return (
    <SafeAreaView edges={['top']} style={[styles.safeArea, { backgroundColor: theme.headerBackground }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
          <Feather name="menu" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>SantoPresente</Text>
        {logoSource ? (
          <Image source={logoSource} style={styles.logo} />
        ) : (
          <View style={styles.rightPlaceholder} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#fff' },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  menuButton: { padding: 8 },
  title: { fontSize: 18, fontWeight: '400', letterSpacing: 0.5, textAlign: 'center' },
  rightPlaceholder: { width: 40 },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'cover',
  },
});