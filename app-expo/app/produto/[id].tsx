import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable, Alert, ScrollView, FlatList } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { produtos } from '../data/produtos';
import { Feather } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useTheme } from '../context/ThemeContext';

export default function DetalheProduto() {
  const { id } = useLocalSearchParams();
  const produto = produtos.find(p => p.id === Number(id));
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState<string>('');
  const { theme } = useTheme();
  const [imagemAtual, setImagemAtual] = useState(produto?.imagemUrl || '');

  if (!produto) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Produto não encontrado</Text>
      </View>
    );
  }

  const abrirWhatsApp = async () => {
    if (!tamanhoSelecionado) {
      Alert.alert('Selecione um tamanho', 'Por favor, escolha o tamanho desejado antes de reservar.');
      return;
    }

    const numero = '5516997923532';
    const mensagem = `Olá! Gostaria de reservar:\n*${produto.nome}*\nPreço: R$ ${produto.preco.toFixed(2)}\nTamanho: ${tamanhoSelecionado}`;
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível abrir o WhatsApp. Verifique se o aplicativo está instalado.');
    }
  };

  // Lista com todas as imagens (principal + adicionais)
  const todasImagens = [produto.imagemUrl, ...(produto.imagensAdicionais || [])];

  const renderMiniatura = ({ item }: { item: string }) => (
    <Pressable onPress={() => setImagemAtual(item)}>
      <Image
        source={{ uri: item }}
        style={[
          styles.miniatura,
          imagemAtual === item && styles.miniaturaAtiva,
        ]}
      />
    </Pressable>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: produto.nome,
          headerStyle: { backgroundColor: theme.headerBackground },
          headerTintColor: theme.text,
        }}
      />
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        <Image source={{ uri: imagemAtual }} style={styles.image} />

        {/* Miniaturas (só aparece se houver mais de uma imagem) */}
        {todasImagens.length > 1 && (
          <FlatList
            data={todasImagens}
            renderItem={renderMiniatura}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.miniaturasContainer}
          />
        )}

        <View style={styles.info}>
          <Text style={[styles.nome, { color: theme.text }]}>{produto.nome}</Text>
          <Text style={[styles.descricao, { color: theme.textSecondary }]}>{produto.descricao}</Text>
          <Text style={[styles.preco, { color: theme.primary }]}>R$ {produto.preco.toFixed(2)}</Text>

          <Text style={[styles.label, { color: theme.text }]}>Tamanhos disponíveis:</Text>
          <View style={styles.tamanhosContainer}>
            {produto.tamanhos.map((tam) => (
              <Pressable
                key={tam}
                style={[
                  styles.tamanhoBotao,
                  { borderColor: theme.border },
                  tamanhoSelecionado === tam && [styles.tamanhoSelecionado, { backgroundColor: theme.primary, borderColor: theme.primary }],
                ]}
                onPress={() => setTamanhoSelecionado(tam)}
              >
                <Text
                  style={[
                    styles.tamanhoTexto,
                    { color: theme.text },
                    tamanhoSelecionado === tam && styles.tamanhoTextoSelecionado,
                  ]}
                >
                  {tam}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            style={[styles.button, { backgroundColor: '#25D366' }]}
            onPress={abrirWhatsApp}
          >
            <Feather name="phone" size={20} color="#fff" />
            <Text style={styles.buttonText}>Reservar via WhatsApp</Text>
          </Pressable>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: 350, resizeMode: 'cover' },
  miniaturasContainer: { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  miniatura: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  miniaturaAtiva: {
    borderColor: '#25D366',
  },
  info: { padding: 20 },
  nome: { fontSize: 26, fontWeight: 'bold', marginBottom: 8 },
  descricao: { fontSize: 16, marginBottom: 16, lineHeight: 22 },
  preco: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  tamanhosContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 30 },
  tamanhoBotao: {
    borderWidth: 1.5,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  tamanhoSelecionado: { backgroundColor: '#25D366' },
  tamanhoTexto: { fontSize: 16, fontWeight: '600' },
  tamanhoTextoSelecionado: { color: '#fff' },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
});