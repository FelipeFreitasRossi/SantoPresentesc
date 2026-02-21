import React, { useState, useEffect } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, withTiming, Easing } from 'react-native-reanimated';

// Componente da Splash personalizada
function CustomSplash({ onFinish }: { onFinish: () => void }) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Animação de fade-in
    opacity.value = withTiming(1, {
      duration: 500,
      easing: Easing.inOut(Easing.ease),
    });

    // Timer de 2 segundos para finalizar
    const timer = setTimeout(() => {
      onFinish();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.splashContainer}>
      <Animated.Text style={[styles.splashText, { opacity }]}>
        SantoPresente
      </Animated.Text>
    </View>
  );
}

export default function RootLayout() {
  const [isSplashFinished, setIsSplashFinished] = useState(false);

  if (!isSplashFinished) {
    return <CustomSplash onFinish={() => setIsSplashFinished(true)} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#000000', // fundo preto
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashText: {
    color: '#FAF9F6', // off-white
    fontSize: 24,
    fontWeight: '300',
    letterSpacing: 2,
  },
});