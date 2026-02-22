import React, { useState, useCallback, useMemo, useRef, memo } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  TextInput,
} from 'react-native';
import { produtos, Produto } from '../data/produtos';
import { Linking } from 'expo-linking';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { useSharedValue, withTiming, Easing, runOnJS } from 'react-native-reanimated';
import CustomHeader from '../components/CustomHeader';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';
import { useScrollToTop } from '../hooks/useScrollToTop';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75;
const numColumns = 2;
const cardWidth = (width - 48) / numColumns;

const ListHeader = memo(({
  searchQuery,
  onSearchChange,
  onClearSearch,
  resultCount
}: {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onClearSearch: () => void;
  resultCount: number;
}) => {
  const inputRef = useRef<TextInput>(null);
  const { theme } = useTheme();

  return (
    <View style={[styles.headerContainer, { backgroundColor: theme.background }]}>
      <View style={[styles.searchWrapper, { backgroundColor: theme.card }]}>
        <Feather name="search" size={20} color={theme.textSecondary} style={styles.searchIcon} />
        <TextInput
          ref={inputRef}
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Buscar produtos..."
          placeholderTextColor={theme.textSecondary}
          value={searchQuery}
          onChangeText={onSearchChange}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={onClearSearch} style={styles.clearButton}>
            <Feather name="x" size={18} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      <Text style={[styles.resultCount, { color: theme.textSecondary }]}>
        {resultCount} {resultCount === 1 ? 'produto encontrado' : 'produtos encontrados'}
      </Text>
    </View>
  );
});

const ListEmpty = memo(() => {
  const { theme } = useTheme();
  return (
    <View style={[styles.emptyContainer, { backgroundColor: theme.background }]}>
      <Feather name="search" size={48} color={theme.textSecondary} />
      <Text style={[styles.emptyText, { color: theme.text }]}>Nenhum produto encontrado</Text>
      <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>Tente buscar por outro termo</Text>
    </View>
  );
});

const ProdutoCard = memo(({ item, onPressWhatsApp }: { item: Produto; onPressWhatsApp: (produto: Produto) => void }) => {
  const { theme } = useTheme();
  return (
    <Pressable onPress={() => router.push(`/produto/${item.id}`)} style={styles.cardContainer}>
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Image source={{ uri: item.imagemUrl }} style={styles.cardImage} />
        <View style={styles.cardInfo}>
          <Text style={[styles.cardNome, { color: theme.text }]} numberOfLines={1}>{item.nome}</Text>
          <Text style={[styles.cardPreco, { color: theme.primary }]}>R$ {item.preco.toFixed(2)}</Text>
          <TouchableOpacity style={[styles.cardButton, { backgroundColor: theme.accent }]} onPress={() => onPressWhatsApp(item)} activeOpacity={0.8}>
            <Feather name="phone" size={14} color="#fff" />
            <Text style={styles.cardButtonText}>Reservar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
});

export default function ProdutosScreen() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const translateX = useSharedValue(-SIDEBAR_WIDTH);
  const { theme } = useTheme();
  const flatListRef = useScrollToTop<FlatList<any>>();

  const filteredProdutos = useMemo(() => {
    if (!searchQuery.trim()) return produtos;
    const query = searchQuery.toLowerCase().trim();
    return produtos.filter(p =>
      p.nome.toLowerCase().includes(query) ||
      p.descricao.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const abrirWhatsApp = useCallback((produto: Produto) => {
    const numero = '5516997923532';
    const mensagem = `Olá! Gostaria de reservar: ${produto.nome} - R$ ${produto.preco}`;
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    Linking.openURL(url);
  }, []);

  const openSidebar = useCallback(() => {
    setSidebarOpen(true);
    translateX.value = withTiming(0, { duration: 300, easing: Easing.inOut(Easing.ease) });
  }, []);

  const closeSidebar = useCallback(() => {
    translateX.value = withTiming(-SIDEBAR_WIDTH, { duration: 300, easing: Easing.inOut(Easing.ease) }, (finished) => {
      if (finished) runOnJS(setSidebarOpen)(false);
    });
  }, []);

  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const renderItem = useCallback(({ item }: { item: Produto }) => (
    <ProdutoCard item={item} onPressWhatsApp={abrirWhatsApp} />
  ), [abrirWhatsApp]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.statusBarStyle} backgroundColor={theme.headerBackground} />
      <CustomHeader
        onMenuPress={openSidebar}
        logoSource={require('../../assets/images/Logo.png')} // CAMINHO DA LOGO
      />
      <FlatList
        ref={flatListRef}
        data={filteredProdutos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={
          <ListHeader
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onClearSearch={handleClearSearch}
            resultCount={filteredProdutos.length}
          />
        }
        ListEmptyComponent={ListEmpty}
        ListFooterComponent={<Footer />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: theme.background }}
        keyboardShouldPersistTaps="handled"
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
  headerContainer: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  searchWrapper: { flexDirection: 'row', alignItems: 'center', borderRadius: 25, paddingHorizontal: 16, height: 50, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2, marginBottom: 8 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, paddingVertical: 10 },
  clearButton: { padding: 6 },
  resultCount: { fontSize: 14, marginLeft: 4, marginBottom: 8 },
  row: { justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 16 },
  cardContainer: { width: cardWidth },
  card: { borderRadius: 12, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  cardImage: { width: '100%', height: 150, resizeMode: 'cover' },
  cardInfo: { padding: 8 },
  cardNome: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  cardPreco: { fontSize: 14, fontWeight: '700', marginBottom: 6 },
  cardButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 6, borderRadius: 20, gap: 4 },
  cardButtonText: { color: '#fff', fontWeight: '600', fontSize: 12 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 20 },
  emptyText: { fontSize: 18, fontWeight: '600', marginTop: 16 },
  emptySubtext: { fontSize: 14, marginTop: 8 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999 },
});