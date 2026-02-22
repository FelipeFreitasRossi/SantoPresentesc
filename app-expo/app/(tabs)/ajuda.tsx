import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { useSharedValue, withTiming, Easing, runOnJS } from 'react-native-reanimated';
import CustomHeader from '../components/CustomHeader';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';
import { useScrollToTop } from '../hooks/useScrollToTop';

const SIDEBAR_WIDTH = 250;

export default function AjudaScreen() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const translateX = useSharedValue(-SIDEBAR_WIDTH);
  const { theme } = useTheme();
  const scrollRef = useScrollToTop<ScrollView>();

  const openSidebar = useCallback(() => {
    setSidebarOpen(true);
    translateX.value = withTiming(0, { duration: 300, easing: Easing.inOut(Easing.ease) });
  }, []);

  const closeSidebar = useCallback(() => {
    translateX.value = withTiming(-SIDEBAR_WIDTH, { duration: 300, easing: Easing.inOut(Easing.ease) }, (finished) => {
      if (finished) runOnJS(setSidebarOpen)(false);
    });
  }, []);

  const abrirWhatsApp = useCallback(() => {
    Linking.openURL('https://wa.me/5516997923532?text=Olá!%20Preciso%20de%20ajuda');
  }, []);

  const perguntas = [
    {
      pergunta: 'Como faço para comprar?',
      resposta: 'Escolha o produto desejado, clique em "Reservar via WhatsApp" e você será direcionado para nosso atendimento. Envie a mensagem e finalizaremos sua compra por lá.',
    },
    {
      pergunta: 'Quais as formas de pagamento?',
      resposta: 'Aceitamos PIX, cartão de crédito (via link de pagamento) e transferência bancária. O atendente irá passar as instruções.',
    },
    {
      pergunta: 'Qual o prazo de entrega?',
      resposta: 'O prazo varia de acordo com sua localização. Após a confirmação do pagamento, enviamos o código de rastreio por WhatsApp.',
    },
    {
      pergunta: 'Posso trocar ou devolver um produto?',
      resposta: 'Sim, você tem até 7 dias após o recebimento para solicitar troca ou devolução. Entre em contato pelo WhatsApp.',
    },
    {
      pergunta: 'Como saber meu tamanho?',
      resposta: 'Temos uma tabela de medidas disponível. Fale conosco no WhatsApp que enviamos as orientações.',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.statusBarStyle} backgroundColor={theme.headerBackground} />
      <CustomHeader
        onMenuPress={openSidebar}
        logoSource={require('../../assets/images/Logo.png')} // CAMINHO DA LOGO
      />
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[styles.content, { flexGrow: 1, backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: theme.background }}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Ajuda</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Como podemos ajudar você?</Text>
        </View>

        <TouchableOpacity style={[styles.whatsappCard, { backgroundColor: theme.card }]} onPress={abrirWhatsApp}>
          <View style={styles.whatsappIcon}>
            <Feather name="phone" size={24} color="#fff" />
          </View>
          <View style={styles.whatsappText}>
            <Text style={[styles.whatsappTitle, { color: theme.text }]}>Fale conosco no WhatsApp</Text>
            <Text style={[styles.whatsappDesc, { color: theme.textSecondary }]}>Clique aqui para tirar dúvidas</Text>
          </View>
          <Feather name="arrow-right" size={20} color={theme.accent} />
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Perguntas frequentes</Text>
        {perguntas.map((item, index) => (
          <View key={index} style={[styles.faqItem, { backgroundColor: theme.card }]}>
            <Text style={[styles.pergunta, { color: theme.text }]}>{item.pergunta}</Text>
            <Text style={[styles.resposta, { color: theme.textSecondary }]}>{item.resposta}</Text>
          </View>
        ))}

        <View style={[styles.infoBox, { backgroundColor: theme.background, borderColor: theme.border }]}>
          <Feather name="info" size={20} color={theme.textSecondary} />
          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            Atendimento de segunda a sábado, das 9h às 18h. Fora desse horário, retornaremos no próximo dia útil.
          </Text>
        </View>

        {/* Espaço flexível para empurrar o footer para o final */}
        <View style={{ height: 20 }} />
        <Footer />
      </ScrollView>

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
  content: { padding: 16 },
  header: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold' },
  subtitle: { fontSize: 16, marginTop: 4 },
  whatsappCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: 16, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  whatsappIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#25D366', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  whatsappText: { flex: 1 },
  whatsappTitle: { fontSize: 16, fontWeight: '600' },
  whatsappDesc: { fontSize: 14, marginTop: 2 },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  faqItem: { borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  pergunta: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  resposta: { fontSize: 14, lineHeight: 20 },
  infoBox: { flexDirection: 'row', borderRadius: 8, padding: 12, marginTop: 16, alignItems: 'center', borderWidth: 1 },
  infoText: { fontSize: 14, marginLeft: 8, flex: 1 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999 },
});