import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const router = useRouter();
  const { theme } = useTheme();

  const abrirInstagram = () => {
    Linking.openURL('https://instagram.com/santo_presentesc');
  };

  const abrirWhatsApp = () => {
    Linking.openURL('https://wa.me/5516997923532?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20os%20produtos.');
  };

  const irParaAjuda = () => {
    router.push('/ajuda');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.footerBackground, borderTopColor: theme.border }]}>
      <View style={styles.brandSection}>
        <Text style={[styles.logo, { color: theme.text }]}>SANTOPRESENTE</Text>
        <Text style={[styles.slogan, { color: theme.textSecondary }]}>Moda com propósito e fé</Text>
      </View>

      <View style={styles.socialSection}>
        <TouchableOpacity style={styles.socialButton} onPress={abrirInstagram}>
          <View style={[styles.iconCircle, { backgroundColor: '#C13584' }]}>
            <Feather name="instagram" size={20} color="#fff" />
          </View>
          <Text style={[styles.socialText, { color: theme.textSecondary }]}>@santopresente</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton} onPress={abrirWhatsApp}>
          <View style={[styles.iconCircle, { backgroundColor: '#25D366' }]}>
            <Feather name="phone" size={20} color="#fff" />
          </View>
          <Text style={[styles.socialText, { color: theme.textSecondary }]}>(16) 99792-3532</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.infoSection, { backgroundColor: theme.background }]}>
        <Feather name="clock" size={16} color={theme.textSecondary} />
        <Text style={[styles.infoText, { color: theme.text }]}>Atendimento: todos os dias, 7h às 20h</Text>
      </View>

      <View style={styles.linksRow}>
        <TouchableOpacity style={styles.linkItem} onPress={irParaAjuda}>
          <Text style={[styles.linkText, { color: theme.primary }]}>Ajuda</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkItem}>
          <Text style={[styles.linkText, { color: theme.primary }]}>Contato</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />
      <Text style={[styles.copyright, { color: theme.textSecondary }]}>© 2026 SantoPresente. Todos os direitos reservados.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 24, paddingVertical: 32, borderTopWidth: 1 },
  brandSection: { alignItems: 'center', marginBottom: 24 },
  logo: { fontSize: 22, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  slogan: { fontSize: 14, fontWeight: '400' },
  socialSection: { flexDirection: 'row', justifyContent: 'center', gap: 32, marginBottom: 24 },
  socialButton: { alignItems: 'center' },
  iconCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  socialText: { fontSize: 12, fontWeight: '500' },
  infoSection: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 20, paddingVertical: 12, borderRadius: 30, marginHorizontal: 20 },
  infoText: { fontSize: 14, fontWeight: '500' },
  linksRow: { flexDirection: 'row', justifyContent: 'center', gap: 28, marginBottom: 24 },
  linkItem: { paddingVertical: 4 },
  linkText: { fontSize: 14, fontWeight: '500' },
  divider: { height: 1, marginBottom: 16 },
  copyright: { fontSize: 12, textAlign: 'center' },
});

export default Footer;