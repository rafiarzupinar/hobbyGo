import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, BorderRadius, FontSizes } from '@/constants/theme';
import { format, addDays, addHours } from 'date-fns';
import { tr } from 'date-fns/locale';

const { width } = Dimensions.get('window');

// Mock data - DEMO amaçlı
const MOCK_WORKSHOP = {
  name: 'Dally Seramik Atölyesi',
  subtitle: 'Saatlik hobi atölyesi',
  rating: 4.8,
  totalBookings: 127,
  availableSlots: 8,
  monthlyRevenue: 12450,
};

const MOCK_UPCOMING_BOOKINGS = [
  {
    id: '1',
    customerName: 'Ayşe Yılmaz',
    activity: 'Seramik Tornası',
    date: new Date(),
    time: '14:00 - 16:00',
    participants: 2,
    price: 450,
    status: 'confirmed',
  },
  {
    id: '2',
    customerName: 'Mehmet Kaya',
    activity: 'El Yapımı Çömlek',
    date: addDays(new Date(), 1),
    time: '10:00 - 12:00',
    participants: 1,
    price: 250,
    status: 'confirmed',
  },
  {
    id: '3',
    customerName: 'Zeynep Demir',
    activity: 'Seramik Boyama',
    date: addDays(new Date(), 2),
    time: '15:00 - 17:00',
    participants: 3,
    price: 600,
    status: 'pending',
  },
];

const MOCK_AVAILABLE_SLOTS = [
  { id: '1', date: new Date(), time: '09:00 - 11:00', activity: 'Seramik Tornası' },
  { id: '2', date: new Date(), time: '16:00 - 18:00', activity: 'Çömlek Yapımı' },
  { id: '3', date: addDays(new Date(), 1), time: '14:00 - 16:00', activity: 'Seramik Tornası' },
  { id: '4', date: addDays(new Date(), 2), time: '10:00 - 12:00', activity: 'El Yapımı Çömlek' },
];

export default function WorkshopDashboard() {
  const { colors } = useTheme();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'bookings' | 'slots'>('bookings');

  const formatDate = (date: Date) => {
    return format(date, 'd MMM, eeee', { locale: tr });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <LinearGradient
          colors={['#10b981', '#059669']}
          style={styles.header}
        >
          <TouchableOpacity onPress={() => router.push('/(tabs)')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.workshopName}>{MOCK_WORKSHOP.name}</Text>
            <Text style={styles.workshopSubtitle}>{MOCK_WORKSHOP.subtitle}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#fbbf24" />
              <Text style={styles.ratingText}>{MOCK_WORKSHOP.rating}</Text>
              <Text style={styles.ratingCount}>({MOCK_WORKSHOP.totalBookings} rezervasyon)</Text>
            </View>
          </View>
        </LinearGradient>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: colors.card }]}>
              <Ionicons name="calendar" size={24} color="#10b981" />
              <Text style={[styles.statValue, { color: colors.foreground }]}>
                {MOCK_WORKSHOP.totalBookings}
              </Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                Toplam Rezervasyon
              </Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: colors.card }]}>
              <Ionicons name="time" size={24} color="#f59e0b" />
              <Text style={[styles.statValue, { color: colors.foreground }]}>
                {MOCK_WORKSHOP.availableSlots}
              </Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                Boş Saat
              </Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: colors.card }]}>
              <Ionicons name="cash" size={24} color="#8b5cf6" />
              <Text style={[styles.statValue, { color: colors.foreground }]}>
                ₺{MOCK_WORKSHOP.monthlyRevenue.toLocaleString('tr-TR')}
              </Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                Aylık Gelir
              </Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Hızlı İşlemler
            </Text>
            <View style={styles.actionsGrid}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.primary }]}
                onPress={() => router.push('/create-event')}
              >
                <Ionicons name="add-circle" size={28} color="#fff" />
                <Text style={styles.actionButtonText}>Etkinlik Ekle</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#f59e0b' }]}
                onPress={() => router.push('/add-slot')}
              >
                <Ionicons name="time" size={28} color="#fff" />
                <Text style={styles.actionButtonText}>Saat Ekle</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#8b5cf6' }]}
                onPress={() => router.push('/workshop-stats')}
              >
                <Ionicons name="analytics" size={28} color="#fff" />
                <Text style={styles.actionButtonText}>İstatistikler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#ef4444' }]}
                onPress={() => router.push('/workshop-settings')}
              >
                <Ionicons name="settings" size={28} color="#fff" />
                <Text style={styles.actionButtonText}>Ayarlar</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'bookings' && { borderBottomColor: colors.primary },
              ]}
              onPress={() => setActiveTab('bookings')}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === 'bookings' ? colors.primary : colors.mutedForeground },
                ]}
              >
                Rezervasyonlar ({MOCK_UPCOMING_BOOKINGS.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'slots' && { borderBottomColor: colors.primary },
              ]}
              onPress={() => setActiveTab('slots')}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === 'slots' ? colors.primary : colors.mutedForeground },
                ]}
              >
                Boş Saatler ({MOCK_AVAILABLE_SLOTS.length})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.contentContainer}>
            {activeTab === 'bookings' ? (
              // Rezervasyonlar
              <>
                {MOCK_UPCOMING_BOOKINGS.map((booking) => (
                  <View
                    key={booking.id}
                    style={[styles.bookingCard, { backgroundColor: colors.card }]}
                  >
                    <View style={styles.bookingHeader}>
                      <View>
                        <Text style={[styles.customerName, { color: colors.foreground }]}>
                          {booking.customerName}
                        </Text>
                        <Text style={[styles.activityName, { color: colors.mutedForeground }]}>
                          {booking.activity}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor:
                              booking.status === 'confirmed' ? '#10b98120' : '#f59e0b20',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            { color: booking.status === 'confirmed' ? '#10b981' : '#f59e0b' },
                          ]}
                        >
                          {booking.status === 'confirmed' ? 'Onaylandı' : 'Bekliyor'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.bookingDetails}>
                      <View style={styles.detailRow}>
                        <Ionicons name="calendar-outline" size={16} color={colors.mutedForeground} />
                        <Text style={[styles.detailText, { color: colors.mutedForeground }]}>
                          {formatDate(booking.date)}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Ionicons name="time-outline" size={16} color={colors.mutedForeground} />
                        <Text style={[styles.detailText, { color: colors.mutedForeground }]}>
                          {booking.time}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Ionicons name="people-outline" size={16} color={colors.mutedForeground} />
                        <Text style={[styles.detailText, { color: colors.mutedForeground }]}>
                          {booking.participants} kişi
                        </Text>
                      </View>
                    </View>

                    <View style={styles.bookingFooter}>
                      <Text style={[styles.priceText, { color: colors.primary }]}>
                        ₺{booking.price}
                      </Text>
                      <TouchableOpacity style={styles.viewButton}>
                        <Text style={{ color: colors.primary, fontWeight: '600' }}>
                          Detaylar
                        </Text>
                        <Ionicons name="chevron-forward" size={16} color={colors.primary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </>
            ) : (
              // Boş Saatler
              <>
                <View style={[styles.infoBox, { backgroundColor: '#10b98110', borderColor: '#10b981' }]}>
                  <Ionicons name="information-circle" size={20} color="#10b981" />
                  <Text style={[styles.infoText, { color: '#10b981' }]}>
                    Boş saatleriniz otomatik olarak müşterilere gösterilir
                  </Text>
                </View>

                {MOCK_AVAILABLE_SLOTS.map((slot) => (
                  <View
                    key={slot.id}
                    style={[styles.slotCard, { backgroundColor: colors.card }]}
                  >
                    <View style={styles.slotHeader}>
                      <Ionicons name="time" size={24} color="#f59e0b" />
                      <View style={styles.slotInfo}>
                        <Text style={[styles.slotTime, { color: colors.foreground }]}>
                          {slot.time}
                        </Text>
                        <Text style={[styles.slotDate, { color: colors.mutedForeground }]}>
                          {formatDate(slot.date)}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.slotActivity, { color: colors.mutedForeground }]}>
                      {slot.activity}
                    </Text>
                    <TouchableOpacity
                      style={[styles.slotButton, { backgroundColor: colors.primary + '20' }]}
                    >
                      <Text style={{ color: colors.primary, fontWeight: '600' }}>
                        Düzenle
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </>
            )}
          </View>

          {/* Bottom spacing */}
          <View style={{ height: 80 }} />
        </ScrollView>
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
  backButton: {
    marginBottom: Spacing.md,
  },
  headerContent: {
    gap: Spacing.xs,
  },
  workshopName: {
    fontSize: FontSizes['2xl'],
    fontWeight: 'bold',
    color: '#fff',
  },
  workshopSubtitle: {
    fontSize: FontSizes.md,
    color: 'rgba(255,255,255,0.9)',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  ratingText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: '#fff',
  },
  ratingCount: {
    fontSize: FontSizes.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    gap: Spacing.xs,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: FontSizes.xs,
    textAlign: 'center',
  },
  section: {
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  actionButton: {
    width: (width - Spacing.lg * 2 - Spacing.md) / 2,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  actionButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    alignItems: 'center',
  },
  tabText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  contentContainer: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  bookingCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  customerName: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  activityName: {
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  bookingDetails: {
    gap: Spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  detailText: {
    fontSize: FontSizes.sm,
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  priceText: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
  },
  slotCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
  },
  slotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  slotInfo: {
    flex: 1,
  },
  slotTime: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  slotDate: {
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  slotActivity: {
    fontSize: FontSizes.sm,
  },
  slotButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
});
