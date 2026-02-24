import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Dimensions, StatusBar, TouchableOpacity } from 'react-native';
import { looks } from '../data/looks';         
import { Feather } from '@expo/vector-icons';
import CustomHeader from '../components/CustomHeader';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';
import { useScrollToTop } from '../hooks/useScrollToTop';
import Animated, { useSharedValue, withTiming, Easing, runOnJS } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75;
const numColumns = 2;
const imageSize = (width - 48) / numColumns;

export default function LooksScreen() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const translateX = useSharedValue(-SIDEBAR_WIDTH);
  const { theme } = useTheme();
  const flatListRef = useScrollToTop<FlatList<any>>();

  const openSidebar = useCallback(() => {
    setSidebarOpen(true);
    translateX.value = withTiming(0, { duration: 300, easing: Easing.inOut(Easing.ease) });
  }, []);

  const closeSidebar = useCallback(() => {
    translateX.value = withTiming(-SIDEBAR_WIDTH, { duration: 300, easing: Easing.inOut(Easing.ease) }, (finished) => {
      if (finished) runOnJS(setSidebarOpen)(false);
    });
  }, []);

  const renderItem = ({ item }: { item: typeof looks[0] }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.imagemUrl }} style={styles.image} />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.statusBarStyle} backgroundColor={theme.headerBackground} />
      <CustomHeader
        onMenuPress={openSidebar}
        logoSource={require('../../assets/images/Logo.png')} // mesmo caminho da logo
      />
      <FlatList
        ref={flatListRef}
        data={looks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={<Text style={[styles.headerTitle, { color: theme.text }]}>Looks Reais</Text>}
        ListFooterComponent={<Footer />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: theme.background }}
      />
      {sidebarOpen && (
        <>
          <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeSidebar} />
          <Sidebar translateX={translateX} onClose={closeSidebar} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { flexGrow: 1, paddingBottom: 0 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  row: { justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 16 },
  itemContainer: { width: imageSize, marginBottom: 16 },
  image: { width: imageSize, height: imageSize, borderRadius: 12, resizeMode: 'cover' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999 },
});