import { useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';
import { FlatList, ScrollView } from 'react-native';

export function useScrollToTop<T extends FlatList<any> | ScrollView>() {
  const ref = useRef<T>(null);

  useFocusEffect(
    useCallback(() => {
      const timeout = setTimeout(() => {
        if (ref.current) {
          if ('scrollToOffset' in ref.current) {
            // FlatList
            ref.current.scrollToOffset({ offset: 0, animated: false });
          } else if ('scrollTo' in ref.current) {
            // ScrollView
            ref.current.scrollTo({ y: 0, animated: false });
          }
        }
      }, 50);
      return () => clearTimeout(timeout);
    }, [])
  );

  return ref;
}