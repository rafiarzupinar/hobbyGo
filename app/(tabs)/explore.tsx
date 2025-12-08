import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function ExploreScreen() {
  const { t } = useTranslation();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t('profile.title')}</Text>

        <View style={[styles.card, styles.mb]}>
          <Text style={styles.cardTitle}>Tech Stack</Text>
          <Text style={styles.cardText}>• React Native 0.81.5</Text>
          <Text style={styles.cardText}>• Expo SDK ~54.0</Text>
          <Text style={styles.cardText}>• Expo Router v6</Text>
          <Text style={styles.cardText}>• Redux Toolkit</Text>
          <Text style={styles.cardText}>• React Query</Text>
          <Text style={styles.cardText}>• i18next (i18n)</Text>
        </View>

        <View style={[styles.card, styles.mb]}>
          <Text style={styles.cardTitle}>Features</Text>
          <Text style={styles.cardText}>✓ Complete Authentication System</Text>
          <Text style={styles.cardText}>✓ Biometric Authentication</Text>
          <Text style={styles.cardText}>✓ State Management (Redux)</Text>
          <Text style={styles.cardText}>✓ Internationalization (i18n)</Text>
          <Text style={styles.cardText}>✓ Protected Routes</Text>
          <Text style={styles.cardText}>✓ Dark Mode Support</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Backend</Text>
          <Text style={styles.cardText}>• Node.js + Express</Text>
          <Text style={styles.cardText}>• Supabase Authentication</Text>
          <Text style={styles.cardText}>• TypeScript</Text>
          <Text style={styles.cardText}>• JWT Token Management</Text>
          <Text style={styles.cardText}>• Security Middlewares</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#F9FAFB',
    padding: 24,
    borderRadius: 12,
  },
  mb: {
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  cardText: {
    color: '#374151',
    marginBottom: 8,
    fontSize: 16,
  },
});
