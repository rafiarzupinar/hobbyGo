import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, BorderRadius, FontSizes } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const USER_TYPE_KEY = '@hobbygo_user_type';

export default function RoleSelectionScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const selectRole = async (role: 'user' | 'workshop_owner') => {
    try {
      await AsyncStorage.setItem(USER_TYPE_KEY, role);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error saving user type:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={styles.logo}
          />
          <Text style={[styles.title, { color: colors.foreground }]}>
            HOBİ ATÖLYESİ
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Yaratıcılığını Keşfet!
          </Text>
        </View>

        {/* Role Selection Cards */}
        <View style={styles.rolesContainer}>
          <Text style={[styles.question, { color: colors.foreground }]}>
            Kim olarak devam etmek istersiniz?
          </Text>

          {/* User Role */}
          <TouchableOpacity
            style={styles.roleCard}
            onPress={() => selectRole('user')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#10b981', '#059669']}
              style={styles.roleGradient}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="person" size={48} color="#fff" />
              </View>
              <Text style={styles.roleTitle}>Kullanıcı</Text>
              <Text style={styles.roleDescription}>
                Etkinliklere katıl, atölyeleri keşfet
              </Text>
              <View style={styles.features}>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#fff" />
                  <Text style={styles.featureText}>Etkinliklere katıl</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#fff" />
                  <Text style={styles.featureText}>Favorilere ekle</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#fff" />
                  <Text style={styles.featureText}>Rezervasyon yap</Text>
                </View>
              </View>
              <View style={styles.arrowButton}>
                <Ionicons name="arrow-forward" size={24} color="#fff" />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Workshop Owner Role */}
          <TouchableOpacity
            style={styles.roleCard}
            onPress={() => selectRole('workshop_owner')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#f97316', '#ea580c']}
              style={styles.roleGradient}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="storefront" size={48} color="#fff" />
              </View>
              <Text style={styles.roleTitle}>Atölye Sahibi</Text>
              <Text style={styles.roleDescription}>
                Atölyeni yönet, etkinlik oluştur
              </Text>
              <View style={styles.features}>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#fff" />
                  <Text style={styles.featureText}>Atölye oluştur</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#fff" />
                  <Text style={styles.featureText}>Etkinlik düzenle</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#fff" />
                  <Text style={styles.featureText}>Rezervasyonları yönet</Text>
                </View>
              </View>
              <View style={styles.arrowButton}>
                <Ionicons name="arrow-forward" size={24} color="#fff" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
            Bu sadece göstermelik bir seçimdir.
          </Text>
          <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
            İstediğiniz zaman değiştirebilirsiniz.
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.xxl,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSizes['3xl'],
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: FontSizes.lg,
    fontWeight: '500',
  },
  rolesContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  question: {
    fontSize: FontSizes.xl,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  roleCard: {
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  roleGradient: {
    padding: Spacing.xl,
    minHeight: 220,
    position: 'relative',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  roleTitle: {
    fontSize: FontSizes['2xl'],
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: Spacing.xs,
  },
  roleDescription: {
    fontSize: FontSizes.md,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: Spacing.lg,
  },
  features: {
    gap: Spacing.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  featureText: {
    fontSize: FontSizes.sm,
    color: '#fff',
    fontWeight: '500',
  },
  arrowButton: {
    position: 'absolute',
    bottom: Spacing.lg,
    right: Spacing.lg,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  footerText: {
    fontSize: FontSizes.sm,
    textAlign: 'center',
  },
});
