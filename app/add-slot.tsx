import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, BorderRadius, FontSizes, Colors } from '@/constants/theme';
import { format, addDays } from 'date-fns';
import { tr } from 'date-fns/locale';

const staticColors = Colors.dark;

export default function AddSlotScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedActivity, setSelectedActivity] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [capacity, setCapacity] = useState('');
  const [price, setPrice] = useState('');

  // Mock activities
  const activities = [
    'Seramik Tornası',
    'El Yapımı Çömlek',
    'Seramik Boyama',
    'Çömlek Yapımı',
    'Kil Şekillendirme',
  ];

  // Generate next 7 days
  const upcomingDays = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  const handleSave = () => {
    // Mock save functionality
    console.log('Saving slot:', {
      date: selectedDate,
      activity: selectedActivity,
      startTime,
      endTime,
      capacity,
      price,
    });
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <LinearGradient
          colors={['#f59e0b', '#d97706']}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Boş Saat Ekle</Text>
            <View style={{ width: 40 }} />
          </View>
          <Text style={styles.headerSubtitle}>
            Yeni bir boş saat oluşturun ve müşterilerin rezervasyon yapmasını sağlayın
          </Text>
        </LinearGradient>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Date Selection */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Tarih Seçin
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.datesContainer}
            >
              {upcomingDays.map((date, index) => {
                const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dateCard,
                      { backgroundColor: colors.card },
                      isSelected && { backgroundColor: colors.primary },
                    ]}
                    onPress={() => setSelectedDate(date)}
                  >
                    <Text
                      style={[
                        styles.dateDayName,
                        { color: isSelected ? '#fff' : colors.mutedForeground },
                      ]}
                    >
                      {format(date, 'EEE', { locale: tr }).toUpperCase()}
                    </Text>
                    <Text
                      style={[
                        styles.dateDay,
                        { color: isSelected ? '#fff' : colors.foreground },
                      ]}
                    >
                      {format(date, 'd')}
                    </Text>
                    <Text
                      style={[
                        styles.dateMonth,
                        { color: isSelected ? '#fff' : colors.mutedForeground },
                      ]}
                    >
                      {format(date, 'MMM', { locale: tr }).toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Activity Selection */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Etkinlik
            </Text>
            <View style={styles.activitiesGrid}>
              {activities.map((activity) => (
                <TouchableOpacity
                  key={activity}
                  style={[
                    styles.activityChip,
                    { backgroundColor: colors.card },
                    selectedActivity === activity && { backgroundColor: colors.primary },
                  ]}
                  onPress={() => setSelectedActivity(activity)}
                >
                  <Text
                    style={[
                      styles.activityChipText,
                      { color: selectedActivity === activity ? '#fff' : colors.foreground },
                    ]}
                  >
                    {activity}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Time Selection */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Saat Aralığı
            </Text>
            <View style={styles.timeRow}>
              <View style={styles.timeInput}>
                <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>
                  Başlangıç
                </Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.card, color: colors.foreground }]}
                  placeholder="09:00"
                  placeholderTextColor={colors.mutedForeground}
                  value={startTime}
                  onChangeText={setStartTime}
                />
              </View>
              <Ionicons name="arrow-forward" size={24} color={colors.mutedForeground} style={{ marginTop: 28 }} />
              <View style={styles.timeInput}>
                <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>
                  Bitiş
                </Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.card, color: colors.foreground }]}
                  placeholder="11:00"
                  placeholderTextColor={colors.mutedForeground}
                  value={endTime}
                  onChangeText={setEndTime}
                />
              </View>
            </View>
          </View>

          {/* Capacity & Price */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Detaylar
            </Text>
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>
                  Kapasite
                </Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.card, color: colors.foreground }]}
                  placeholder="4"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="numeric"
                  value={capacity}
                  onChangeText={setCapacity}
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>
                  Fiyat (TL)
                </Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.card, color: colors.foreground }]}
                  placeholder="250"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="numeric"
                  value={price}
                  onChangeText={setPrice}
                />
              </View>
            </View>
          </View>

          {/* Info Box */}
          <View style={[styles.infoBox, { backgroundColor: '#f59e0b20', borderColor: '#f59e0b' }]}>
            <Ionicons name="information-circle" size={20} color="#f59e0b" />
            <Text style={[styles.infoText, { color: '#f59e0b' }]}>
              Oluşturduğunuz boş saatler otomatik olarak müşterilere gösterilecek ve rezervasyon alabileceksiniz.
            </Text>
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
            <Text style={styles.saveButtonText}>Kaydet</Text>
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
    lineHeight: 20,
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
  datesContainer: {
    gap: Spacing.sm,
  },
  dateCard: {
    width: 70,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  dateDayName: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  dateDay: {
    fontSize: FontSizes['2xl'],
    fontWeight: 'bold',
    marginVertical: 4,
  },
  dateMonth: {
    fontSize: FontSizes.xs,
  },
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  activityChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  activityChipText: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  timeInput: {
    flex: 1,
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
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  infoBox: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    borderWidth: 1,
  },
  infoText: {
    fontSize: FontSizes.sm,
    flex: 1,
    lineHeight: 20,
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
