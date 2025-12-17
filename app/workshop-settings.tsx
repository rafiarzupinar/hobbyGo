import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, BorderRadius, FontSizes, Colors } from '@/constants/theme';

const staticColors = Colors.dark;

export default function WorkshopSettingsScreen() {
  const { colors, theme, toggleTheme } = useTheme();
  const router = useRouter();

  // Settings state
  const [workshopName, setWorkshopName] = useState('Dally Seramik Atölyesi');
  const [description, setDescription] = useState('Saatlik hobi atölyesi');
  const [phone, setPhone] = useState('+90 555 123 4567');
  const [email, setEmail] = useState('info@dallyatolye.com');
  const [address, setAddress] = useState('Kadıköy, İstanbul');

  const [notifications, setNotifications] = useState({
    newBooking: true,
    cancelBooking: true,
    reviews: true,
    marketing: false,
  });

  const handleSave = () => {
    console.log('Saving settings...');
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <LinearGradient
          colors={['#ef4444', '#dc2626']}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Ayarlar</Text>
            <View style={{ width: 40 }} />
          </View>
          <Text style={styles.headerSubtitle}>
            Atölye bilgilerinizi ve tercihlerinizi yönetin
          </Text>
        </LinearGradient>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Workshop Info */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Atölye Bilgileri
            </Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>
                Atölye Adı
              </Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.foreground }]}
                value={workshopName}
                onChangeText={setWorkshopName}
                placeholder="Atölye adını girin"
                placeholderTextColor={colors.mutedForeground}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>
                Açıklama
              </Text>
              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: colors.card, color: colors.foreground }]}
                value={description}
                onChangeText={setDescription}
                placeholder="Kısa açıklama"
                placeholderTextColor={colors.mutedForeground}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          {/* Contact Info */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              İletişim Bilgileri
            </Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>
                Telefon
              </Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.foreground }]}
                value={phone}
                onChangeText={setPhone}
                placeholder="+90 5XX XXX XXXX"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>
                E-posta
              </Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.foreground }]}
                value={email}
                onChangeText={setEmail}
                placeholder="ornek@email.com"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>
                Adres
              </Text>
              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: colors.card, color: colors.foreground }]}
                value={address}
                onChangeText={setAddress}
                placeholder="Tam adresiniz"
                placeholderTextColor={colors.mutedForeground}
                multiline
                numberOfLines={2}
              />
            </View>
          </View>

          {/* Notifications */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Bildirimler
            </Text>

            <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
              <View style={styles.settingItemLeft}>
                <Ionicons name="calendar" size={20} color={colors.foreground} />
                <View style={styles.settingItemText}>
                  <Text style={[styles.settingItemTitle, { color: colors.foreground }]}>
                    Yeni Rezervasyon
                  </Text>
                  <Text style={[styles.settingItemDesc, { color: colors.mutedForeground }]}>
                    Yeni rezervasyon geldiğinde bildirim al
                  </Text>
                </View>
              </View>
              <Switch
                value={notifications.newBooking}
                onValueChange={(value) => setNotifications({ ...notifications, newBooking: value })}
                trackColor={{ false: staticColors.border, true: staticColors.primary }}
                thumbColor="#fff"
              />
            </View>

            <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
              <View style={styles.settingItemLeft}>
                <Ionicons name="close-circle" size={20} color={colors.foreground} />
                <View style={styles.settingItemText}>
                  <Text style={[styles.settingItemTitle, { color: colors.foreground }]}>
                    İptal Bildirimi
                  </Text>
                  <Text style={[styles.settingItemDesc, { color: colors.mutedForeground }]}>
                    Rezervasyon iptal edildiğinde bildirim al
                  </Text>
                </View>
              </View>
              <Switch
                value={notifications.cancelBooking}
                onValueChange={(value) => setNotifications({ ...notifications, cancelBooking: value })}
                trackColor={{ false: staticColors.border, true: staticColors.primary }}
                thumbColor="#fff"
              />
            </View>

            <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
              <View style={styles.settingItemLeft}>
                <Ionicons name="star" size={20} color={colors.foreground} />
                <View style={styles.settingItemText}>
                  <Text style={[styles.settingItemTitle, { color: colors.foreground }]}>
                    Yorumlar
                  </Text>
                  <Text style={[styles.settingItemDesc, { color: colors.mutedForeground }]}>
                    Yeni yorum geldiğinde bildirim al
                  </Text>
                </View>
              </View>
              <Switch
                value={notifications.reviews}
                onValueChange={(value) => setNotifications({ ...notifications, reviews: value })}
                trackColor={{ false: staticColors.border, true: staticColors.primary }}
                thumbColor="#fff"
              />
            </View>

            <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
              <View style={styles.settingItemLeft}>
                <Ionicons name="megaphone" size={20} color={colors.foreground} />
                <View style={styles.settingItemText}>
                  <Text style={[styles.settingItemTitle, { color: colors.foreground }]}>
                    Pazarlama
                  </Text>
                  <Text style={[styles.settingItemDesc, { color: colors.mutedForeground }]}>
                    Kampanya ve duyurular için bildirim al
                  </Text>
                </View>
              </View>
              <Switch
                value={notifications.marketing}
                onValueChange={(value) => setNotifications({ ...notifications, marketing: value })}
                trackColor={{ false: staticColors.border, true: staticColors.primary }}
                thumbColor="#fff"
              />
            </View>
          </View>

          {/* Appearance */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Görünüm
            </Text>

            <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
              <View style={styles.settingItemLeft}>
                <Ionicons name={theme === 'dark' ? 'moon' : 'sunny'} size={20} color={colors.foreground} />
                <View style={styles.settingItemText}>
                  <Text style={[styles.settingItemTitle, { color: colors.foreground }]}>
                    {theme === 'dark' ? 'Koyu Tema' : 'Açık Tema'}
                  </Text>
                  <Text style={[styles.settingItemDesc, { color: colors.mutedForeground }]}>
                    Arayüz temasını değiştir
                  </Text>
                </View>
              </View>
              <Switch
                value={theme === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{ false: staticColors.border, true: staticColors.primary }}
                thumbColor="#fff"
              />
            </View>
          </View>

          {/* Danger Zone */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Tehlikeli Alan
            </Text>

            <TouchableOpacity style={[styles.dangerButton, { borderColor: colors.destructive }]}>
              <Ionicons name="log-out-outline" size={20} color={colors.destructive} />
              <Text style={[styles.dangerButtonText, { color: colors.destructive }]}>
                Çıkış Yap
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.dangerButton, { borderColor: colors.destructive }]}>
              <Ionicons name="trash-outline" size={20} color={colors.destructive} />
              <Text style={[styles.dangerButtonText, { color: colors.destructive }]}>
                Hesabı Sil
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bottom spacing */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Save Button */}
        <View style={[styles.footer, { backgroundColor: colors.background }]}>
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleSave}
          >
            <Ionicons name="checkmark-circle" size={24} color="#fff" />
            <Text style={styles.saveButtonText}>Değişiklikleri Kaydet</Text>
          </TouchableOpacity>
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
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    paddingTop: Spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FontSizes['2xl'],
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: FontSizes.sm,
    color: 'rgba(255,255,255,0.9)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.xs,
  },
  input: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    fontSize: FontSizes.md,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.md,
  },
  settingItemText: {
    flex: 1,
  },
  settingItemTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingItemDesc: {
    fontSize: FontSizes.sm,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  dangerButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: staticColors.border,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  saveButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: '#fff',
  },
});
