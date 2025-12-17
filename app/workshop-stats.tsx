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
import { Spacing, BorderRadius, FontSizes, Colors } from '@/constants/theme';

const { width } = Dimensions.get('window');
const staticColors = Colors.dark;

// Mock data
const STATS_DATA = {
  totalRevenue: 124500,
  totalBookings: 127,
  averageRating: 4.8,
  totalCustomers: 89,
  monthlyRevenue: [8500, 9200, 10500, 12400, 11800, 13200],
  monthlyBookings: [18, 22, 24, 28, 26, 31],
  popularActivities: [
    { name: 'Seramik Tornası', bookings: 45, revenue: 56250 },
    { name: 'El Yapımı Çömlek', bookings: 38, revenue: 38000 },
    { name: 'Seramik Boyama', bookings: 28, revenue: 22400 },
    { name: 'Çömlek Yapımı', bookings: 16, revenue: 7850 },
  ],
};

export default function WorkshopStatsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz'];
  const maxRevenue = Math.max(...STATS_DATA.monthlyRevenue);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <LinearGradient
          colors={['#8b5cf6', '#7c3aed']}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>İstatistikler</Text>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="share-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerSubtitle}>
            Atölyenizin performansını takip edin
          </Text>
        </LinearGradient>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Period Selector */}
          <View style={styles.periodSelector}>
            {(['week', 'month', 'year'] as const).map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  { backgroundColor: colors.card },
                  selectedPeriod === period && { backgroundColor: colors.primary },
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    { color: selectedPeriod === period ? '#fff' : colors.foreground },
                  ]}
                >
                  {period === 'week' ? 'Hafta' : period === 'month' ? 'Ay' : 'Yıl'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Overview Stats */}
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: colors.card }]}>
              <View style={[styles.statIcon, { backgroundColor: '#10b98120' }]}>
                <Ionicons name="cash" size={24} color="#10b981" />
              </View>
              <Text style={[styles.statValue, { color: colors.foreground }]}>
                ₺{STATS_DATA.totalRevenue.toLocaleString('tr-TR')}
              </Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                Toplam Gelir
              </Text>
              <View style={styles.statChange}>
                <Ionicons name="trending-up" size={14} color="#10b981" />
                <Text style={styles.statChangeText}>+12.5%</Text>
              </View>
            </View>

            <View style={[styles.statCard, { backgroundColor: colors.card }]}>
              <View style={[styles.statIcon, { backgroundColor: '#f59e0b20' }]}>
                <Ionicons name="calendar" size={24} color="#f59e0b" />
              </View>
              <Text style={[styles.statValue, { color: colors.foreground }]}>
                {STATS_DATA.totalBookings}
              </Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                Rezervasyon
              </Text>
              <View style={styles.statChange}>
                <Ionicons name="trending-up" size={14} color="#10b981" />
                <Text style={styles.statChangeText}>+8.2%</Text>
              </View>
            </View>

            <View style={[styles.statCard, { backgroundColor: colors.card }]}>
              <View style={[styles.statIcon, { backgroundColor: '#8b5cf620' }]}>
                <Ionicons name="star" size={24} color="#8b5cf6" />
              </View>
              <Text style={[styles.statValue, { color: colors.foreground }]}>
                {STATS_DATA.averageRating}
              </Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                Ortalama Puan
              </Text>
              <View style={styles.statChange}>
                <Ionicons name="trending-up" size={14} color="#10b981" />
                <Text style={styles.statChangeText}>+0.3</Text>
              </View>
            </View>

            <View style={[styles.statCard, { backgroundColor: colors.card }]}>
              <View style={[styles.statIcon, { backgroundColor: '#ec489920' }]}>
                <Ionicons name="people" size={24} color="#ec4899" />
              </View>
              <Text style={[styles.statValue, { color: colors.foreground }]}>
                {STATS_DATA.totalCustomers}
              </Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                Müşteri
              </Text>
              <View style={styles.statChange}>
                <Ionicons name="trending-up" size={14} color="#10b981" />
                <Text style={styles.statChangeText}>+15</Text>
              </View>
            </View>
          </View>

          {/* Revenue Chart */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Aylık Gelir Trendi
            </Text>
            <View style={[styles.chartCard, { backgroundColor: colors.card }]}>
              <View style={styles.chart}>
                {STATS_DATA.monthlyRevenue.map((revenue, index) => {
                  const height = (revenue / maxRevenue) * 120;
                  return (
                    <View key={index} style={styles.chartBar}>
                      <View
                        style={[
                          styles.bar,
                          { height, backgroundColor: colors.primary },
                        ]}
                      />
                      <Text style={[styles.chartLabel, { color: colors.mutedForeground }]}>
                        {months[index]}
                      </Text>
                    </View>
                  );
                })}
              </View>
              <View style={styles.chartLegend}>
                <Text style={[styles.chartLegendText, { color: colors.mutedForeground }]}>
                  En yüksek: ₺{maxRevenue.toLocaleString('tr-TR')}
                </Text>
              </View>
            </View>
          </View>

          {/* Popular Activities */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Popüler Etkinlikler
            </Text>
            {STATS_DATA.popularActivities.map((activity, index) => {
              const percentage = (activity.bookings / STATS_DATA.totalBookings) * 100;
              return (
                <View
                  key={index}
                  style={[styles.activityCard, { backgroundColor: colors.card }]}
                >
                  <View style={styles.activityHeader}>
                    <View style={styles.activityRank}>
                      <Text style={styles.activityRankText}>#{index + 1}</Text>
                    </View>
                    <View style={styles.activityInfo}>
                      <Text style={[styles.activityName, { color: colors.foreground }]}>
                        {activity.name}
                      </Text>
                      <Text style={[styles.activityStats, { color: colors.mutedForeground }]}>
                        {activity.bookings} rezervasyon • ₺{activity.revenue.toLocaleString('tr-TR')}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.progressBar, { backgroundColor: staticColors.border }]}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${percentage}%`, backgroundColor: colors.primary },
                      ]}
                    />
                  </View>
                  <Text style={[styles.percentageText, { color: colors.mutedForeground }]}>
                    %{percentage.toFixed(1)}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Bottom spacing */}
          <View style={{ height: 40 }} />
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
  headerButton: {
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
  periodSelector: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  periodButton: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  periodButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    width: (width - Spacing.lg * 2 - Spacing.md) / 2,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  statValue: {
    fontSize: FontSizes['2xl'],
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    marginBottom: Spacing.sm,
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statChangeText: {
    fontSize: FontSizes.xs,
    color: '#10b981',
    fontWeight: '600',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  chartCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 140,
    marginBottom: Spacing.md,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '70%',
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.xs,
  },
  chartLabel: {
    fontSize: FontSizes.xs,
  },
  chartLegend: {
    borderTopWidth: 1,
    borderTopColor: staticColors.border,
    paddingTop: Spacing.md,
  },
  chartLegendText: {
    fontSize: FontSizes.sm,
  },
  activityCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  activityRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: staticColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  activityRankText: {
    fontSize: FontSizes.sm,
    fontWeight: 'bold',
    color: '#fff',
  },
  activityInfo: {
    flex: 1,
  },
  activityName: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginBottom: 4,
  },
  activityStats: {
    fontSize: FontSizes.sm,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: Spacing.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentageText: {
    fontSize: FontSizes.xs,
    textAlign: 'right',
  },
});
