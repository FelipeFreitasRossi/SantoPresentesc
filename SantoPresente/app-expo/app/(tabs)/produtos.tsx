import React, { useState } from 'react';
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
import Animated, { useSharedValue, withTiming, Easing, runOnJS } from 'react-native-reanimated';
import CustomHeader from '../components/CustomHeader';
import Sidebar from '../components/Sidebar';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75;
const numColumns = 2;
const cardWidth = (width - 48) / numColumns;

export default function ProdutosScreen() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const translateX = useSharedValue(-SIDEBAR_WIDTH);

  const abrirWhatsApp = (produto: Produto) => {
    const numero = '5516997923532';
    const mensagem = `Olá! Gostaria de reservar: ${produto.nome} - R$ ${produto.preco} - Tamanho: [insira o tamanho]`;
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    Linking.openURL(url);
  };

  const openSidebar = () => {
    setSidebarOpen(true);
    translateX.value = withTiming(0, { duration: 300, easing: Easing.inOut(Easing.ease) });
  };

  const closeSidebar = () => {
    translateX.value = withTiming(-SIDEBAR_WIDTH, { duration: 300, easing: Easing.inOut(Easing.ease) }, (finished) => {
      if (finished) runOnJS(setSidebarOpen)(false);
    });
  };

  const renderItem = ({ item }: { item: Produto }) => (
    <Pressable onPress={() => router.push(`/produto/${item.id}`)} style={styles.cardContainer}>
      <View style={styles.card}>
        <Image source={{ uri: item.imagemUrl }} style={styles.cardImage} />
        <View style={styles.cardInfo}>
          <Text style={styles.cardNome} numberOfLines={1}>{item.nome}</Text>
          <Text style={styles.cardPreco}>R$ {item.preco.toFixed(2)}</Text>
          <TouchableOpacity
            style={styles.cardButton}
            onPress={() => abrirWhatsApp(item)}
            activeOpacity={0.8}
          >
            <Feather name="phone" size={16} color="#fff" />
            <Text style={styles.cardButtonText}>Reservar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      <View style={styles.footerRow}>
        <Text style={styles.footerLogo}>SANTOPRESENTE</Text>
        <View style={styles.socialIcons}>
          {['instagram', 'facebook', 'twitter', 'youtube'].map((social) => (
            <TouchableOpacity key={social} style={styles.socialIcon} onPress={() => Linking.openURL(`https://${social}.com`)}>
              <Feather name={social} size={20} color="#555" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.footerLinks}>
        {['Ajuda', 'Status do pedido', 'Devoluções', 'Contato'].map((item) => (
          <TouchableOpacity key={item} style={styles.footerLink}>
            <Text style={styles.footerLinkText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.footerContact}>
        <View style={styles.contactItem}>
          <Feather name="phone" size={14} color="#888" />
          <Text style={styles.contactText}> (16) 99792-3532</Text>
        </View>
        <View style={styles.contactItem}>
          <Feather name="mail" size={14} color="#888" />
          <Text style={styles.contactText}> contato@santopresente.com</Text>
        </View>
      </View>
      <Text style={styles.copyright}>© 2026 SantoPresente. Todos os direitos reservados.</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <CustomHeader onMenuPress={openSidebar} />
      <FlatList
        data={produtos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={
          <View style={styles.headerTitle}>
            <Text style={styles.headerText}>Todos os Produtos</Text>
          </View>
        }
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  listContent: { paddingBottom: 0 },
  headerTitle: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  headerText: { fontSize: 24, fontWeight: 'bold', color: '#222' },
  row: { justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 16 },
  cardContainer: { width: cardWidth },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: { width: '100%', height: 150, resizeMode: 'cover' },
  cardInfo: { padding: 8 },
  cardNome: { fontSize: 14, fontWeight: '600', color: '#222', marginBottom: 4 },
  cardPreco: { fontSize: 14, fontWeight: '700', color: '#2ecc71', marginBottom: 6 },
  cardButton: {
    backgroundColor: '#25D366',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  cardButtonText: { color: '#fff', fontWeight: '600', fontSize: 12 },

  // Footer
  footer: { backgroundColor: '#fff', paddingVertical: 24, paddingHorizontal: 16, borderTopWidth: 1, borderTopColor: '#eee', marginTop: 8 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  footerLogo: { fontSize: 18, fontWeight: '700', color: '#222' },
  socialIcons: { flexDirection: 'row' },
  socialIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f2f2f2', justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  footerLinks: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  footerLink: { marginRight: 24, marginBottom: 8 },
  footerLinkText: { fontSize: 14, color: '#555' },
  footerContact: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  contactItem: { flexDirection: 'row', alignItems: 'center', marginRight: 24, marginBottom: 8 },
  contactText: { fontSize: 14, color: '#888' },
  copyright: { fontSize: 12, color: '#aaa', textAlign: 'center', marginTop: 8 },

  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999,
  },
});