import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Spacing, BorderRadius, FontSizes } from '@/constants/theme';

const USER_TYPE_KEY = '@hobbygo_user_type';

// Storage wrapper for web/native compatibility
const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return AsyncStorage.getItem(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    return AsyncStorage.setItem(key, value);
  },
};

export default function WelcomeScreen() {
  const router = useRouter();

  // Check if user has already selected a role
  useEffect(() => {
    const checkUserType = async () => {
      try {
        const savedUserType = await storage.getItem(USER_TYPE_KEY);
        if (savedUserType) {
          // User has already selected a role, redirect based on type
          if (savedUserType === 'workshop_owner') {
            router.replace('/workshop-dashboard');
          } else {
            router.replace('/(tabs)');
          }
        }
      } catch (error) {
        console.error('Error checking user type:', error);
      }
    };
    checkUserType();
  }, []);

  const handleLogin = async (userType: 'user' | 'workshop_owner') => {
    try {
      await storage.setItem(USER_TYPE_KEY, userType);
      // Redirect based on user type
      if (userType === 'workshop_owner') {
        router.replace('/workshop-dashboard');
      } else {
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Error saving user type:', error);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#10b981', '#059669', '#047857']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Logo and Title */}
          <View style={styles.header}>
            <Image
              source={require('../assets/images/icon.png')}
              style={styles.logo}
            />
            <Text style={styles.title}>HOBİ ATÖLYESİ</Text>
            <Text style={styles.subtitle}>Yaratıcılığını Keşfet!</Text>
            <Text style={styles.description}>
              Hobilerini geliştir, yeni beceriler öğren ve yaratıcı atölyelerde keyifli vakit geçir
            </Text>
          </View>

          {/* Login Options */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginTitle}>Hoş Geldiniz!</Text>
            <Text style={styles.loginSubtitle}>
              Devam etmek için bir seçenek seçin
            </Text>

            {/* User Login */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => handleLogin('user')}
              activeOpacity={0.9}
            >
              <View style={styles.buttonContent}>
                <View style={styles.iconCircle}>
                  <Ionicons name="person" size={32} color="#10b981" />
                </View>
                <View style={styles.buttonTextContainer}>
                  <Text style={styles.buttonTitle}>Kullanıcı Girişi</Text>
                  <Text style={styles.buttonSubtitle}>
                    Etkinliklere katıl, atölyeleri keşfet
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#10b981" />
              </View>
            </TouchableOpacity>

            {/* Workshop Owner Login */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => handleLogin('workshop_owner')}
              activeOpacity={0.9}
            >
              <View style={styles.buttonContent}>
                <View style={[styles.iconCircle, { backgroundColor: '#fff5f0' }]}>
                  <Ionicons name="storefront" size={32} color="#f97316" />
                </View>
                <View style={styles.buttonTextContainer}>
                  <Text style={styles.buttonTitle}>Atölye Sahibi Girişi</Text>
                  <Text style={styles.buttonSubtitle}>
                    Atölyeni yönet, etkinlik oluştur
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#f97316" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Bu sadece göstermelik bir seçimdir.
            </Text>
            <Text style={styles.footerText}>
              İstediğiniz zaman değiştirebilirsiniz.
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginTop: Spacing.xxl,
    marginBottom: Spacing.xl,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes['4xl'],
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: Spacing.xs,
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSizes.xl,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.95)',
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  description: {
    fontSize: FontSizes.sm,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: Spacing.md,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: -Spacing.xxl,
  },
  loginTitle: {
    fontSize: FontSizes['2xl'],
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  loginSubtitle: {
    fontSize: FontSizes.md,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  loginButton: {
    backgroundColor: '#fff',
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  buttonSubtitle: {
    fontSize: FontSizes.sm,
    color: '#6b7280',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: 4,
  },
  footerText: {
    fontSize: FontSizes.xs,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
});
