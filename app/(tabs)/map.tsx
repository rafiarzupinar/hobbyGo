import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Colors, Spacing, BorderRadius, FontSizes } from '@/constants/theme';
import { useWorkshops } from '@/hooks/useWorkshops';
import { Workshop } from '@/types';

const { width, height } = Dimensions.get('window');
const colors = Colors.dark;

export default function MapScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('date');
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);

  // Fetch workshops from Supabase
  const { data: workshops = [], isLoading } = useWorkshops(20);

  const filters = [
    { id: 'date', label: 'Tarih', icon: 'calendar' },
    { id: 'category', label: 'Kategori', icon: 'pricetag' },
    { id: 'distance', label: 'Mesafe', icon: 'location' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Web Placeholder */}
      <View style={[styles.map, styles.webMapPlaceholder]}>
        <Ionicons name="map" size={64} color={colors.mutedForeground} />
        <Text style={styles.webMapText}>
          Harita özelliği sadece mobil cihazlarda kullanılabilir
        </Text>
        <Text style={styles.webMapSubtext}>
          Lütfen iOS veya Android uygulamasını kullanın
        </Text>
      </View>

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}

      {/* Search Bar */}
      <SafeAreaView style={styles.searchContainer} edges={['top']}>
        <View style={styles.searchRow}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color={colors.mutedForeground} />
            <TextInput
              style={styles.searchInput}
              placeholder="Etkinlik veya konum ara..."
              placeholderTextColor={colors.mutedForeground}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="options" size={20} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        {/* Filters */}
        <View style={styles.filtersRow}>
          <View style={styles.filtersLeft}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterButton,
                  selectedFilter === filter.id && styles.filterButtonActive,
                ]}
                onPress={() => setSelectedFilter(filter.id)}
              >
                <Ionicons
                  name={filter.icon as any}
                  size={14}
                  color={selectedFilter === filter.id ? '#fff' : colors.foreground}
                />
                <Text
                  style={[
                    styles.filterText,
                    selectedFilter === filter.id && styles.filterTextActive,
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.gpsButton}>
            <Ionicons name="navigate" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Workshop List for Web */}
      <ScrollView
        style={styles.workshopList}
        contentContainerStyle={styles.workshopListContent}
      >
        {workshops.map((workshop) => (
          <TouchableOpacity
            key={workshop.id}
            style={styles.workshopCardHorizontal}
            onPress={() => router.push(`/workshop/${workshop.id}`)}
          >
            <Image
              source={{ uri: workshop.image_url || 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=200' }}
              style={styles.workshopImageHorizontal}
            />
            <View style={styles.workshopInfo}>
              <Text style={styles.workshopTitle} numberOfLines={1}>
                {workshop.name}
              </Text>
              <View style={styles.addressBadge}>
                <Ionicons name="location" size={12} color={colors.primary} />
                <Text style={styles.addressText} numberOfLines={1}>
                  {workshop.address?.split(',')[0]}
                </Text>
              </View>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={14} color="#eab308" />
                <Text style={styles.ratingText}>{workshop.rating?.toFixed(1) || '0.0'}</Text>
                <Text style={styles.reviewCountText}>• {workshop.review_count || 0} değerlendirme</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  searchContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    zIndex: 20,
  },
  searchRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card + 'F2',
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: colors.foreground,
    fontSize: FontSizes.sm,
  },
  settingsButton: {
    backgroundColor: colors.card + 'F2',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filtersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filtersLeft: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card + 'F2',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    color: colors.foreground,
    fontSize: FontSizes.xs,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
  },
  gpsButton: {
    backgroundColor: colors.card + 'F2',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  webMapPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.xl,
  },
  webMapText: {
    color: colors.foreground,
    fontSize: FontSizes.lg,
    fontWeight: '600',
    textAlign: 'center',
  },
  webMapSubtext: {
    color: colors.mutedForeground,
    fontSize: FontSizes.sm,
    textAlign: 'center',
  },
  workshopList: {
    position: 'absolute',
    top: 150,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  workshopListContent: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  workshopCardHorizontal: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    gap: Spacing.md,
  },
  workshopImageHorizontal: {
    width: 120,
    height: 120,
  },
  workshopInfo: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'center',
  },
  workshopTitle: {
    color: colors.foreground,
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  addressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    gap: 4,
    alignSelf: 'flex-start',
    marginBottom: Spacing.xs,
  },
  addressText: {
    color: colors.primary,
    fontSize: FontSizes.xs,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    color: colors.foreground,
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  reviewCountText: {
    color: colors.mutedForeground,
    fontSize: FontSizes.xs,
  },
});