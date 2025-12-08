import React, { useState, useRef, useEffect } from 'react';
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
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { Colors, Spacing, BorderRadius, FontSizes } from '@/constants/theme';
import { useWorkshops } from '@/hooks/useWorkshops';
import { Workshop } from '@/types';

const { width, height } = Dimensions.get('window');
const colors = Colors.dark;

// İstanbul Kadıköy merkezi
const INITIAL_REGION = {
  latitude: 40.9903,
  longitude: 29.0297,
  latitudeDelta: 0.03,
  longitudeDelta: 0.03,
};

// Dark map style for Google Maps (Android)
const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#212121' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#757575' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#181818' }] },
  { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
  { featureType: 'road', elementType: 'geometry.fill', stylers: [{ color: '#2c2c2c' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#8a8a8a' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#373737' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3c3c3c' }] },
  { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
  { featureType: 'transit', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#000000' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#3d3d3d' }] },
];

// Marker colors based on index for variety
const markerColors = [
  colors.primary,
  '#ec4899',
  '#3b82f6',
  '#f97316',
  '#22c55e',
  '#eab308',
  '#a855f7',
];

export default function MapScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('date');
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);

  // Fetch workshops from Supabase
  const { data: workshops = [], isLoading } = useWorkshops(20);

  // Set initial selected workshop when data loads
  useEffect(() => {
    if (workshops.length > 0 && !selectedWorkshop) {
      setSelectedWorkshop(workshops[0]);
    }
  }, [workshops]);

  const filters = [
    { id: 'date', label: 'Tarih', icon: 'calendar' },
    { id: 'category', label: 'Kategori', icon: 'pricetag' },
    { id: 'distance', label: 'Mesafe', icon: 'location' },
  ];

  const handleMarkerPress = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    mapRef.current?.animateToRegion({
      latitude: Number(workshop.latitude),
      longitude: Number(workshop.longitude),
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 300);
  };

  const handleMyLocation = () => {
    mapRef.current?.animateToRegion(INITIAL_REGION, 500);
  };

  const getMarkerColor = (index: number) => {
    return markerColors[index % markerColors.length];
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={INITIAL_REGION}
        customMapStyle={darkMapStyle}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
        userInterfaceStyle="dark"
      >
        {workshops.map((workshop, index) => (
          <Marker
            key={workshop.id}
            coordinate={{
              latitude: Number(workshop.latitude),
              longitude: Number(workshop.longitude),
            }}
            onPress={() => handleMarkerPress(workshop)}
          >
            <View style={styles.customMarker}>
              <View style={[styles.markerPin, { backgroundColor: getMarkerColor(index) }]}>
                <Ionicons name="location" size={18} color="#fff" />
              </View>
              <View style={[styles.markerTriangle, { borderTopColor: getMarkerColor(index) }]} />
            </View>
          </Marker>
        ))}
      </MapView>

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
          <TouchableOpacity style={styles.gpsButton} onPress={handleMyLocation}>
            <Ionicons name="navigate" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Bottom Workshop Card */}
      {selectedWorkshop && (
        <View style={styles.workshopCardContainer}>
          <BlurView intensity={90} tint="dark" style={styles.workshopCard}>
            <TouchableOpacity
              style={styles.workshopCardContent}
              onPress={() => router.push(`/workshop/${selectedWorkshop.id}`)}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: selectedWorkshop.image_url || 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=200' }}
                style={styles.workshopImage}
              />
              <View style={styles.workshopInfo}>
                <View style={styles.workshopHeader}>
                  <Text style={styles.workshopTitle} numberOfLines={1}>
                    {selectedWorkshop.name}
                  </Text>
                  <TouchableOpacity>
                    <Ionicons name="heart-outline" size={20} color={colors.mutedForeground} />
                  </TouchableOpacity>
                </View>
                <View style={styles.workshopMeta}>
                  <View style={styles.addressBadge}>
                    <Ionicons name="location" size={12} color={colors.primary} />
                    <Text style={styles.addressText} numberOfLines={1}>
                      {selectedWorkshop.address?.split(',')[0]}
                    </Text>
                  </View>
                </View>
                <View style={styles.workshopFooter}>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={14} color="#eab308" />
                    <Text style={styles.ratingText}>{selectedWorkshop.rating?.toFixed(1) || '0.0'}</Text>
                    <Text style={styles.reviewCountText}>• {selectedWorkshop.review_count || 0} değerlendirme</Text>
                  </View>
                  <View style={styles.viewButton}>
                    <Text style={styles.viewButtonText}>Görüntüle</Text>
                    <Ionicons name="chevron-forward" size={14} color={colors.primary} />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </BlurView>
        </View>
      )}
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
  customMarker: {
    alignItems: 'center',
  },
  markerPin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -2,
  },
  workshopCardContainer: {
    position: 'absolute',
    bottom: 100,
    left: Spacing.lg,
    right: Spacing.lg,
    zIndex: 30,
  },
  workshopCard: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  workshopCardContent: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  workshopImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.lg,
  },
  workshopInfo: {
    flex: 1,
  },
  workshopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  workshopTitle: {
    flex: 1,
    color: colors.foreground,
    fontSize: FontSizes.sm,
    fontWeight: '600',
    marginRight: Spacing.sm,
  },
  workshopMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  addressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  addressText: {
    color: colors.primary,
    fontSize: FontSizes.xs,
    fontWeight: '500',
  },
  workshopFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewButtonText: {
    color: colors.primary,
    fontSize: FontSizes.xs,
    fontWeight: '500',
  },
});