import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Button } from '../components/common/Button';
import { theme } from '../utils/theme';
import { authService } from '../services/authService';

export default function LoginScreen({ navigation }: any) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    try {
      setLoading(true);
      if (isLogin) {
        await authService.signIn(email, password);
      } else {
        await authService.signUp(email, password, fullName);
      }
      navigation.replace('Main');
    } catch (error: any) {
      console.error('Auth error:', error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
          </Text>
          <Text style={styles.description}>
            {isLogin
              ? 'Hesabınıza giriş yapın'
              : 'Yeni hesap oluşturun'}
          </Text>
        </View>

        <View style={styles.form}>
          {!isLogin && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Ad Soyad</Text>
              <TextInput
                style={styles.input}
                placeholder="Ad Soyad"
                placeholderTextColor={theme.colors.muted.foreground}
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>E-posta</Text>
            <TextInput
              style={styles.input}
              placeholder="ornek@email.com"
              placeholderTextColor={theme.colors.muted.foreground}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Şifre</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={theme.colors.muted.foreground}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {isLogin && (
            <TouchableOpacity>
              <Text style={styles.forgotPassword}>Şifremi Unuttum</Text>
            </TouchableOpacity>
          )}

          <Button
            title={isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
            onPress={handleAuth}
            variant="primary"
            size="lg"
            loading={loading}
          />

          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>
              {isLogin ? 'Hesabınız yok mu?' : 'Zaten hesabınız var mı?'}
            </Text>
            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
              <Text style={styles.switchButton}>
                {isLogin ? 'Kayıt Ol' : 'Giriş Yap'}
              </Text>
            </TouchableOpacity>
          </View>
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
  },
  header: {
    marginBottom: theme.spacing['4xl'],
  },
  title: {
    fontSize: theme.fontSize['3xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.foreground,
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: theme.fontSize.base,
    color: theme.colors.muted.foreground,
  },
  form: {
    gap: theme.spacing.lg,
  },
  inputContainer: {
    gap: theme.spacing.sm,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.foreground,
  },
  input: {
    backgroundColor: theme.colors.card.DEFAULT,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.xl,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    fontSize: theme.fontSize.base,
    color: theme.colors.foreground,
  },
  forgotPassword: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary.DEFAULT,
    fontWeight: theme.fontWeight.medium,
    textAlign: 'right',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.lg,
  },
  switchText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.muted.foreground,
  },
  switchButton: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary.DEFAULT,
    fontWeight: theme.fontWeight.semibold,
  },
});
