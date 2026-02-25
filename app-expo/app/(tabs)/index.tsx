import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Linking,
} from 'react-native';
import { produtos } from '../data/produtos';
import { looks } from '../data/looks';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { useSharedValue, withTiming, Easing, runOnJS, FadeInDown } from 'react-native-reanimated';
import CustomHeader from '../components/CustomHeader';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';
import { useScrollToTop } from '../hooks/useScrollToTop';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75;

// Dados mockados para benefícios
const beneficios = [
  { id: 'b1', icone: 'truck', texto: 'Frete Grátis*' },
  { id: 'b2', icone: 'refresh-cw', texto: 'Troca Fácil' },
  { id: 'b3', icone: 'phone', texto: 'Atendimento via WhatsApp' },
  { id: 'b4', icone: 'heart', texto: 'Qualidade Garantida' },
];

const depoimentos = [
  { id: 'd1', nome: 'Pedro Alves', texto: 'Amei minha camisa! Super confortável e entrega rápida.', nota: 5 },
  { id: 'd2', nome: 'João Pedro', texto: 'Produto de excelente qualidade, já quero comprar mais!', nota: 5 },
  { id: 'd3', nome: 'Gustavo Henrique', texto: 'Atendimento maravilhoso e tecidos incríveis.', nota: 5 },
];

const categorias = [
  { id: '1', nome: 'Oversized', imagem: 'https://i.postimg.cc/cJ5pzQSh/Oversized-King.jpg', rota: 'oversized' },
  { id: '2', nome: 'Moletons', imagem: 'https://i.postimg.cc/0NhrGKb2/Moletom.jpg', rota: 'moletom' },
  { id: '3', nome: 'Camisas', imagem: 'https://i.postimg.cc/7ZDn2V67/Camisa-Logo-Pai.jpg', rota: 'camisa' },
  { id: '4', nome: 'Babylooks', imagem: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=200&h=200&fit=crop', rota: 'babylook' },
];

// ==================== COMPONENTES ====================

// Carrossel de looks adaptado para web (sem PagerView)
const LooksCarrossel = memo(() => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!looks.length) return;
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % looks.length;
      setActiveIndex(nextIndex);
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
        viewPosition: 0.5,
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [activeIndex, looks.length]);

  if (!looks.length) return null;

  const renderItem = ({ item }: { item: typeof looks[0] }) => (
    <View style={styles.lookItem}>
      <Image source={{ uri: item.imagemUrl }} style={styles.lookImage} />
    </View>
  );

  const onScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / (width - 32));
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  return (
    <View style={styles.looksCarrosselContainer}>
      <FlatList
        ref={flatListRef}
        data={looks}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.looksList}
      />
      <View style={styles.looksPagination}>
        {looks.map((_, index) => (
          <View
            key={index}
            style={[
              styles.looksDot,
              { backgroundColor: theme.border },
              index === activeIndex && [styles.looksDotActive, { backgroundColor: theme.primary }],
            ]}
          />
        ))}
      </View>
    </View>
  );
});

// Seção de Benefícios
const Beneficios = memo(() => {
  const { theme } = useTheme();
  return (
    <View style={styles.beneficiosContainer}>
      <FlatList
        horizontal
        data={beneficios}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.beneficioItem}>
            <View style={[styles.beneficioIcone, { backgroundColor: theme.primary + '20' }]}>
              <Feather name={item.icone} size={24} color={theme.primary} />
            </View>
            <Text style={[styles.beneficioTexto, { color: theme.textSecondary }]}>{item.texto}</Text>
          </View>
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.beneficiosList}
      />
    </View>
  );
});

// Seção de Depoimentos (centralizada)
const Depoimentos = memo(() => {
  const { theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = (activeIndex + 1) % depoimentos.length;
      setActiveIndex(next);
      flatListRef.current?.scrollToIndex({
        index: next,
        animated: true,
        viewPosition: 0.5,
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  const renderItem = ({ item }: { item: typeof depoimentos[0] }) => (
    <View style={[styles.depoimentoCard, { backgroundColor: theme.card }]}>
      <View style={[styles.depoimentoAvatar, { backgroundColor: theme.primary + '20' }]}>
        <Feather name="user" size={28} color={theme.primary} />
      </View>
      <Text style={[styles.depoimentoNome, { color: theme.text }]}>{item.nome}</Text>
      <View style={styles.depoimentoEstrelas}>
        {[...Array(5)].map((_, i) => (
          <Feather
            key={i}
            name="star"
            size={16}
            color={i < item.nota ? '#FFD700' : theme.border}
          />
        ))}
      </View>
      <Text style={[styles.depoimentoTexto, { color: theme.textSecondary }]}>
        "{item.texto}"
      </Text>
    </View>
  );

  const onScroll = (e: any) => {
    const offset = e.nativeEvent.contentOffset.x;
    const index = Math.round(offset / width);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  return (
    <View style={styles.depoimentosContainer}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>O que nossos clientes dizem</Text>
      <FlatList
        ref={flatListRef}
        data={depoimentos}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onScroll={onScroll}
        scrollEventThrottle={16}
      />
      <View style={styles.depoimentoPagination}>
        {depoimentos.map((_, index) => (
          <View
            key={index}
            style={[
              styles.depoimentoDot,
              { backgroundColor: theme.border },
              index === activeIndex && [styles.depoimentoDotActive, { backgroundColor: theme.primary }],
            ]}
          />
        ))}
      </View>
    </View>
  );
});

// Banner único com imagem e texto sobreposto
const BannerUnico = memo(() => {
  return (
    <View style={styles.bannerUnico}>
      <Image
        source={{ uri: 'https://i.postimg.cc/Y90Cyh2j/10-de-Desconto-na-primeira-compra.png' }}
        style={styles.bannerUnicoImage}
      />
      <View style={styles.bannerUnicoOverlay}>
        <Text style={styles.bannerUnicoTitulo}>GANHE 10% OFF</Text>
        <Text style={styles.bannerUnicoSubtitulo}>na primeira compra</Text>
      </View>
    </View>
  );
});

// Categorias
const Categorias = memo(() => {
  const { theme } = useTheme();

  const handleCategoriaPress = (rota: string) => {
    router.push(`/produtos?categoria=${rota}`);
  };

  return (
    <Animated.View entering={FadeInDown.delay(200).duration(600)} style={[styles.categoriasContainer, { backgroundColor: theme.background }]}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Categorias</Text>
      <FlatList
        horizontal
        data={categorias}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(300 + index * 100).duration(500)}>
            <TouchableOpacity style={styles.categoriaItem} onPress={() => handleCategoriaPress(item.rota)}>
              <Image source={{ uri: item.imagem }} style={styles.categoriaImagem} />
              <Text style={[styles.categoriaNome, { color: theme.text }]}>{item.nome}</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriasList}
      />
    </Animated.View>
  );
});

// Carrossel de produtos em destaque
const DestaquesCarrossel = memo(() => {
  const { theme } = useTheme();
  const destaques = produtos.slice(0, 5);

  if (!destaques.length) return null;

  return (
    <View style={styles.destaquesContainer}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Destaques</Text>
      <FlatList
        horizontal
        data={destaques}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.destaqueCard}
            onPress={() => router.push(`/produto/${item.id}`)}
          >
            <Image source={{ uri: item.imagemUrl }} style={styles.destaqueImage} />
            <Text style={[styles.destaqueNome, { color: theme.text }]} numberOfLines={1}>
              {item.nome}
            </Text>
            <Text style={[styles.destaquePreco, { color: theme.primary }]}>
              R$ {item.preco.toFixed(2)}
            </Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.destaquesList}
      />
    </View>
  );
});

// ==================== TELA PRINCIPAL ====================

export default function HomeScreen() {
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

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.statusBarStyle} backgroundColor={theme.headerBackground} />
      <CustomHeader
        onMenuPress={openSidebar}
        logoSource={require('../../assets/images/Logo.png')}
      />
      <FlatList
        ref={flatListRef}
        data={[]}
        renderItem={null}
        ListHeaderComponent={
          <>
            <LooksCarrossel />
            <Beneficios />
            <Categorias />
            <BannerUnico />
            <Depoimentos />
            <DestaquesCarrossel />
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

// ==================== ESTILOS ====================

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { paddingBottom: 0 },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 999,
  },

  // Looks Carrossel (novo estilo)
  looksCarrosselContainer: { height: 220, marginBottom: 16 },
  lookItem: { width: width - 32, marginHorizontal: 16, borderRadius: 12, overflow: 'hidden' },
  lookImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  looksList: { alignItems: 'center' },
  looksPagination: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
  looksDot: { width: 6, height: 6, borderRadius: 3, marginHorizontal: 4 },
  looksDotActive: { width: 12 },

  // Benefícios
  beneficiosContainer: { marginBottom: 16 },
  beneficiosList: { paddingHorizontal: 16, gap: 16 },
  beneficioItem: { alignItems: 'center', width: 100 },
  beneficioIcone: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  beneficioTexto: { fontSize: 12, textAlign: 'center' },

  // Categorias
  categoriasContainer: { marginBottom: 16, paddingHorizontal: 16 },
  categoriasList: {},
  categoriaItem: { alignItems: 'center', marginRight: 16, width: 80 },
  categoriaImagem: { width: 70, height: 70, borderRadius: 35, marginBottom: 8, borderWidth: 2, borderColor: '#fff' },
  categoriaNome: { fontSize: 12, fontWeight: '500', textAlign: 'center' },

  // Banner único
  bannerUnico: {
    height: 250,
    marginHorizontal: 15,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  bannerUnicoImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  bannerUnicoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerUnicoTitulo: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  bannerUnicoSubtitulo: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },

  // Depoimentos
  depoimentosContainer: { marginBottom: 16, paddingHorizontal: 16 },
  depoimentoCard: {
    width: width - 32,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  depoimentoAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  depoimentoNome: { fontSize: 16, fontWeight: '600', marginBottom: 4, textAlign: 'center' },
  depoimentoEstrelas: { flexDirection: 'row', marginBottom: 12 },
  depoimentoTexto: { fontSize: 14, fontStyle: 'italic', textAlign: 'center', lineHeight: 20 },
  depoimentoPagination: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
  depoimentoDot: { width: 6, height: 6, borderRadius: 3, marginHorizontal: 4 },
  depoimentoDotActive: { width: 12 },

  // Destaques carrossel
  destaquesContainer: { marginBottom: 16, paddingHorizontal: 16 },
  destaquesList: { gap: 12 },
  destaqueCard: { width: 140, marginRight: 8 },
  destaqueImage: { width: 140, height: 140, borderRadius: 12, marginBottom: 8 },
  destaqueNome: { fontSize: 14, fontWeight: '500', marginBottom: 4 },
  destaquePreco: { fontSize: 14, fontWeight: '600' },

  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
});