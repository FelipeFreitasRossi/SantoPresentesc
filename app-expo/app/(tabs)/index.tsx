import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
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
} from 'react-native';
import { produtos, Produto } from '../data/produtos';
import { Linking } from 'expo-linking';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { useSharedValue, withTiming, Easing, runOnJS, FadeInDown } from 'react-native-reanimated';
import PagerView from 'react-native-pager-view';
import CustomHeader from '../components/CustomHeader';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';
import { useScrollToTop } from '../hooks/useScrollToTop';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75;

const carrosselImages = [
  { id: '1', image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', titulo: 'Oversized', subtitulo: 'Conforto e estilo' },
  { id: '2', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', titulo: 'Moletons', subtitulo: 'Aconchegantes' },
  { id: '3', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', titulo: 'Camisas', subtitulo: 'Fé em cada detalhe' },
];

const categorias = [
  { id: '1', nome: 'Oversized', icone: '👕', cor: '#FF6B6B' },
  { id: '2', nome: 'Moletons', icone: '🧥', cor: '#4ECDC4' },
  { id: '3', nome: 'Camisas', icone: '👔', cor: '#FFD166' },
  { id: '4', nome: 'Babylooks', icone: '👶', cor: '#A8D5E5' },
];

const BannerCarrossel = memo(() => {
  const [activePage, setActivePage] = useState(0);
  const pagerRef = useRef<PagerView>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextPage = (activePage + 1) % carrosselImages.length;
      pagerRef.current?.setPage(nextPage);
    }, 3000);
    return () => clearInterval(interval);
  }, [activePage]);

  return (
    <View style={styles.carrosselContainer}>
      <PagerView ref={pagerRef} style={styles.pagerView} initialPage={0} onPageSelected={(e) => setActivePage(e.nativeEvent.position)}>
        {carrosselImages.map((item) => (
          <View key={item.id} style={styles.page}>
            <Image source={{ uri: item.image }} style={styles.carrosselImage} />
            <View style={styles.overlay}>
              <Text style={styles.carrosselTitulo}>{item.titulo}</Text>
              <Text style={styles.carrosselSubtitulo}>{item.subtitulo}</Text>
            </View>
          </View>
        ))}
      </PagerView>
      <View style={styles.pagination}>
        {carrosselImages.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.dot, index === activePage ? styles.dotActive : styles.dotInactive]}
            onPress={() => pagerRef.current?.setPage(index)}
          />
        ))}
      </View>
    </View>
  );
});

const Categorias = memo(() => {
  const { theme } = useTheme();
  return (
    <Animated.View entering={FadeInDown.delay(200).duration(600)} style={[styles.categoriasContainer, { backgroundColor: theme.background }]}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Categorias</Text>
      <FlatList
        horizontal
        data={categorias}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(300 + index * 100).duration(500)}>
            <TouchableOpacity style={styles.categoriaItem}>
              <View style={[styles.categoriaIcon, { backgroundColor: item.cor + '20' }]}>
                <Text style={styles.categoriaIconText}>{item.icone}</Text>
              </View>
              <Text style={[styles.categoriaNome, { color: theme.textSecondary }]}>{item.nome}</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriasList}
      />
    </Animated.View>
  );
});

export default function HomeScreen() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const translateX = useSharedValue(-SIDEBAR_WIDTH);
  const { theme } = useTheme();
  const flatListRef = useScrollToTop<FlatList<any>>();

  const abrirWhatsApp = useCallback((produto: Produto) => {
    const numero = '5516997923532';
    const mensagem = `Olá! Gostaria de reservar: ${produto.nome} - R$ ${produto.preco} - Tamanho: [insira o tamanho]`;
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

  const produtosDestaque = produtos.slice(0, 2);

  const ProdutoCard = useCallback(({ item }: { item: Produto }) => (
    <Animated.View entering={FadeInDown.delay(400).duration(600)}>
      <Pressable onPress={() => router.push(`/produto/${item.id}`)}>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Image source={{ uri: item.imagemUrl }} style={styles.cardImage} />
          <View style={styles.cardInfo}>
            <Text style={[styles.cardNome, { color: theme.text }]}>{item.nome}</Text>
            <Text style={[styles.cardDescricao, { color: theme.textSecondary }]} numberOfLines={2}>{item.descricao}</Text>
            <View style={styles.cardFooter}>
              <Text style={[styles.cardPreco, { color: theme.primary }]}>R$ {item.preco.toFixed(2)}</Text>
              <TouchableOpacity style={[styles.cardButton, { backgroundColor: theme.accent }]} onPress={() => abrirWhatsApp(item)} activeOpacity={0.8}>
                <Feather name="phone" size={18} color="#fff" />
                <Text style={styles.cardButtonText}>Reservar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  ), [abrirWhatsApp, theme]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.statusBarStyle} backgroundColor={theme.headerBackground} />
      <CustomHeader
        onMenuPress={openSidebar}
        logoSource={require('../../assets/images/Logo.png')} // CAMINHO DA LOGO
      />
      <FlatList
        ref={flatListRef}
        data={produtosDestaque}
        renderItem={({ item }) => <ProdutoCard item={item} />}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <>
            <BannerCarrossel />
            <Categorias />
            <View style={[styles.produtosHeader, { backgroundColor: theme.background }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Destaques</Text>
              <TouchableOpacity onPress={() => router.push('/produtos')}>
                <Text style={[styles.verTodos, { color: theme.primary }]}>Ver todos</Text>
              </TouchableOpacity>
            </View>
          </>
        }
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
  listContent: { paddingBottom: 0 },
  produtosHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginTop: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 20, fontWeight: '700' },
  verTodos: { fontSize: 14, fontWeight: '600' },
  carrosselContainer: { height: 220, marginBottom: 16 },
  pagerView: { flex: 1 },
  page: { flex: 1, borderRadius: 12, overflow: 'hidden', marginHorizontal: 16 },
  carrosselImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'flex-end', padding: 16 },
  carrosselTitulo: { color: '#fff', fontSize: 24, fontWeight: 'bold', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 4 },
  carrosselSubtitulo: { color: '#fff', fontSize: 16, marginTop: 4, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 4 },
  pagination: { flexDirection: 'row', position: 'absolute', bottom: 10, alignSelf: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 4 },
  dotActive: { backgroundColor: '#fff', width: 20 },
  dotInactive: { backgroundColor: 'rgba(255,255,255,0.5)' },
  categoriasContainer: { marginBottom: 16, paddingHorizontal: 16 },
  categoriasList: {},
  categoriaItem: { alignItems: 'center', marginRight: 16, width: 70 },
  categoriaIcon: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  categoriaIconText: { fontSize: 24 },
  categoriaNome: { fontSize: 12, fontWeight: '500', textAlign: 'center' },
  card: { borderRadius: 16, marginHorizontal: 16, marginBottom: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  cardImage: { width: '100%', height: 200, resizeMode: 'cover' },
  cardInfo: { padding: 12 },
  cardNome: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  cardDescricao: { fontSize: 14, marginBottom: 8 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  cardPreco: { fontSize: 18, fontWeight: '700' },
  cardButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 24, gap: 6 },
  cardButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999 },
});