import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CategoryScreen() {
  const { slug } = useLocalSearchParams();

  return (
    <>
      <Stack.Screen
        options={{
          title: String(slug) || 'Kategori',
          headerShown: true,
        }}
      />
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>
          Kategori Slug: {slug}
        </Text>
        <Text style={styles.text}>
          Bu sayfa çalışıyor! 🎉
        </Text>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'center',
  },
});
