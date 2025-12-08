import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../utils/theme';
import * as Location from 'expo-location';

export default function MapScreen({ navigation }: any) {
  const [region, setRegion] = useState({
    latitude: 40.9913,
    longitude: 29.0233,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const markers = [
    { id: '1', latitude: 40.9913, longitude: 29.0233, count: 8, color: theme.colors.primary.DEFAULT },
    { id: '2', latitude: 41.0013, longitude: 29.0333, color: '#ef4444' },
    { id: '3', latitude: 40.9813, longitude: 29.0133, color: '#22c55e' },
    { id: '4', latitude: 41.0113, longitude: 29.0433, color: '#f97316' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        customMapStyle={darkMapStyle}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            onPress={() => setSelectedEvent(marker)}
          >
            <View style={[styles.markerContainer, { backgroundColor: marker.color }]}>
              {marker.count ? (
                <Text style={styles.markerText}>{marker.count}</Text>
              ) : (
                <Ionicons name="location" size={20} color="#fff" />
              )}
              <View style={[styles.markerArrow, { borderTopColor: marker.color }]} />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={theme.colors.muted.foreground} />
          <TextInput
            style={styles.searchInput}
            placeholder="Etkinlik veya konum ara..."
            placeholderTextColor={theme.colors.muted.foreground}
          />
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={20} color={theme.colors.foreground} />
        </TouchableOpacity>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButtonActive}>
          <Ionicons name="calendar-outline" size={16} color="#fff" />
          <Text style={styles.filterTextActive}>Tarih</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="pricetag-outline" size={16} color={theme.colors.foreground} />
          <Text style={styles.filterText}>Kategori</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="location-outline" size={16} color={theme.colors.foreground} />
          <Text style={styles.filterText}>Mesafe</Text>
        </TouchableOpacity>
      </View>

      {/* GPS Button */}
      <TouchableOpacity
        style={styles.gpsButton}
        onPress={getCurrentLocation}
      >
        <Ionicons name="navigate" size={24} color={theme.colors.primary.DEFAULT} />
      </TouchableOpacity>

      {/* Event Preview Card */}
      {selectedEvent && (
        <View style={styles.previewCard}>
          <View style={styles.previewContent}>
            <Image
              source={{ uri: 'https://picsum.photos/seed/workshop-ceramic/120/120' }}
              style={styles.previewImage}
            />
            <View style={styles.previewInfo}>
              <View style={styles.previewHeader}>
                <Text style={styles.previewTitle} numberOfLines={1}>
                  Seramik Atölyesi
                </Text>
                <TouchableOpacity>
                  <Ionicons name="heart-outline" size={20} color={theme.colors.muted.foreground} />
                </TouchableOpacity>
              </View>
              <View style={styles.previewDetail}>
                <Ionicons name="calendar-outline" size={16} color={theme.colors.muted.foreground} />
                <Text style={styles.previewDetailText}>24 Ocak, Cuma</Text>
              </View>
              <View style={styles.previewFooter}>
                <View style={styles.avatarGroup}>
                  {[1, 2, 3].map((i) => (
                    <Image
                      key={i}
                      source={{ uri: `https://i.pravatar.cc/150?img=${i}` }}
                      style={[styles.avatar, { marginLeft: i > 1 ? -8 : 0 }]}
                    />
                  ))}
                  <Text style={styles.avatarCount}>+12</Text>
                </View>
                <View style={styles.distanceTag}>
                  <Ionicons name="location-outline" size={16} color={theme.colors.primary.DEFAULT} />
                  <Text style={styles.distanceText}>2.4 km</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#1a1a1a' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a1a' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#a1a1aa' }] },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#262626' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#10b981' }],
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  map: {
    flex: 1,
  },
  searchContainer: {
    position: 'absolute',
    top: 20,
    left: 16,
    right: 16,
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: `${theme.colors.card.DEFAULT}F0`,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.xl,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    ...theme.shadows.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.foreground,
  },
  settingsButton: {
    backgroundColor: `${theme.colors.card.DEFAULT}F0`,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  },
  filterContainer: {
    position: 'absolute',
    top: 90,
    left: 16,
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    backgroundColor: `${theme.colors.card.DEFAULT}F0`,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  filterButtonActive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.primary.DEFAULT,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  filterText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.foreground,
  },
  filterTextActive: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.medium,
    color: '#fff',
  },
  gpsButton: {
    position: 'absolute',
    top: 90,
    right: 16,
    backgroundColor: `${theme.colors.card.DEFAULT}F0`,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.lg,
  },
  markerText: {
    color: '#fff',
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
  },
  markerArrow: {
    position: 'absolute',
    bottom: -4,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  previewCard: {
    position: 'absolute',
    bottom: 90,
    left: 16,
    right: 16,
    backgroundColor: `${theme.colors.card.DEFAULT}F0`,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius['2xl'],
    ...theme.shadows.xl,
  },
  previewContent: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.xl,
  },
  previewInfo: {
    flex: 1,
    gap: theme.spacing.sm,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewTitle: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.foreground,
  },
  previewDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  previewDetailText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.muted.foreground,
  },
  previewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: theme.borderRadius.full,
    borderWidth: 2,
    borderColor: theme.colors.card.DEFAULT,
  },
  avatarCount: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.muted.foreground,
    marginLeft: theme.spacing.sm,
  },
  distanceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.primary.DEFAULT,
  },
});
