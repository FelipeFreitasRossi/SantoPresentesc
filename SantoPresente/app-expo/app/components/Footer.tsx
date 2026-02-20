import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';

const Footer = () => {
  const socialIcons = [
    { name: 'instagram', url: 'https://instagram.com/santopresente' },
    { name: 'facebook', url: 'https://facebook.com/santopresente' },
    { name: 'twitter', url: 'https://twitter.com/santopresente' },
    { name: 'youtube', url: 'https://youtube.com/santopresente' },
  ];

  const links = [
    'Sobre nós',
    'Ajuda',
    'Política de privacidade',
    'Termos de uso',
    'Trocas e devoluções',
  ];

  return (
    <View style={styles.container}>
      {/* Seção de redes sociais */}
      <View style={styles.socialSection}>
        <Text style={styles.sectionTitle}>Siga-nos</Text>
        <View style={styles.socialIcons}>
          {socialIcons.map((icon) => (
            <TouchableOpacity
              key={icon.name}
              style={styles.iconButton}
              onPress={() => Linking.openURL(icon.url)}
            >
              <Feather name={icon.name} size={24} color="#333" />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Linha divisória */}
      <View style={styles.divider} />

      {/* Links rápidos */}
      <View style={styles.linksSection}>
        {links.map((link) => (
          <TouchableOpacity key={link} style={styles.linkButton}>
            <Text style={styles.linkText}>{link}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Linha divisória */}
      <View style={styles.divider} />

      {/* Informações de contato */}
      <View style={styles.contactSection}>
        <Text style={styles.contactText}>Atendimento: seg-sex 9h-18h</Text>
        <Text style={styles.contactText}>WhatsApp: (16) 99792-3532</Text>
        <Text style={styles.contactText}>Email: contato@santopresente.com</Text>
      </View>

      {/* Linha divisória */}
      <View style={styles.divider} />

      {/* Copyright */}
      <Text style={styles.copyright}>
        © 2024 SantoPresente. Todos os direitos reservados.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginTop: 20,
  },
  socialSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  iconButton: {
    padding: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 20,
  },
  linksSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 10,
  },
  linkButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  linkText: {
    fontSize: 14,
    color: '#555',
    textDecorationLine: 'underline',
  },
  contactSection: {
    alignItems: 'center',
    marginBottom: 10,
  },
  contactText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  copyright: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default Footer;