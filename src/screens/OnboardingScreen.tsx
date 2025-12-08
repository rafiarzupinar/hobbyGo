import React from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView } from 'react-native';
import { Button } from '../components/common/Button';
import { theme } from '../utils/theme';

export default function OnboardingScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://picsum.photos/seed/onboarding/400/400' }}
            style={styles.image}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>Hobi Atölyelerini Keşfet</Text>
          <Text style={styles.description}>
            Şehrindeki tüm sanat atölyelerini, etkinlikleri ve kursları tek bir yerde keşfet.
            Seramik, resim, müzik, dans ve daha fazlası!
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Başla"
            onPress={() => navigation.navigate('Login')}
            variant="primary"
            size="lg"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing['2xl'],
    paddingVertical: theme.spacing['3xl'],
    justifyContent: 'space-between',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: theme.spacing['4xl'],
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: theme.borderRadius['2xl'],
  },
  textContainer: {
    gap: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize['3xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.foreground,
    textAlign: 'center',
  },
  description: {
    fontSize: theme.fontSize.base,
    color: theme.colors.muted.foreground,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    gap: theme.spacing.md,
  },
});
