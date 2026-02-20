import { View, Text, Image, StyleSheet, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { produtos } from '../data/produtos';
import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { Linking } from 'expo-linking';

export default function DetalheProduto() {
  const { id } = useLocalSearchParams();
  const produto = produtos.find(p => p.id === Number(id));
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState<string>('');

  if (!produto) {
    return (
      <View style={styles.centered}>
        <Text>Produto não encontrado</Text>
      </View>
    );
  }

  const abrirWhatsApp = () => {
    if (!tamanhoSelecionado) {
      Alert.alert('Selecione um tamanho', 'Por favor, escolha o tamanho desejado.');
      return;
    }
    const numero = "5516996167381";
    const mensagem = `Olá! Gostaria de reservar: ${produto.nome} - R$ ${produto.preco} - Tamanho: ${tamanhoSelecionado}`;
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    Linking.openURL(url);
  };

  return (
    <>
      <Stack.Screen options={{ title: produto.nome }} />
      <View style={styles.container}>
        <Image source={{ uri: produto.imagemUrl }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.nome}>{produto.nome}</Text>
          <Text style={styles.descricao}>{produto.descricao}</Text>
          <Text style={styles.preco}>R$ {produto.preco.toFixed(2)}</Text>

          <Text style={styles.label}>Tamanhos disponíveis:</Text>
          <View style={styles.tamanhosContainer}>
            {produto.tamanhos.map(tam => (
              <Pressable
                key={tam}
                style={[
                  styles.tamanhoBotao,
                  tamanhoSelecionado === tam && styles.tamanhoSelecionado,
                ]}
                onPress={() => setTamanhoSelecionado(tam)}
              >
                <Text style={[
                  styles.tamanhoTexto,
                  tamanhoSelecionado === tam && styles.tamanhoTextoSelecionado,
                ]}>{tam}</Text>
              </Pressable>
            ))}
          </View>

          <Pressable style={styles.button} onPress={abrirWhatsApp}>
            <Feather name="phone" size={20} color="white" />
            <Text style={styles.buttonText}>Reservar via WhatsApp</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: 300, resizeMode: 'cover' },
  info: { padding: 16 },
  nome: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  descricao: { fontSize: 16, color: '#666', marginBottom: 12 },
  preco: { fontSize: 20, fontWeight: '600', color: '#2ecc71', marginBottom: 16 },
  label: { fontSize: 16, fontWeight: '500', marginBottom: 8 },
  tamanhosContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  tamanhoBotao: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  tamanhoSelecionado: {
    backgroundColor: '#2ecc71',
    borderColor: '#2ecc71',
  },
  tamanhoTexto: { fontSize: 14, fontWeight: '500' },
  tamanhoTextoSelecionado: { color: '#fff' },
  button: {
    backgroundColor: '#25D366',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: { color: 'white', fontWeight: '600', fontSize: 18 },
});