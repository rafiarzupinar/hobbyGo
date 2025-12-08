import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontSizes } from '@/constants/theme';
import { useWorkshop } from '@/hooks/useWorkshops';
import { useEventsByWorkshop } from '@/hooks/useEvents';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const colors = Colors.dark;

export default function WorkshopDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Fetch workshop data
  const { data: workshop, isLoading, error } = useWorkshop(id || '');

  // Fetch workshop events
  const { data: events = [] } = useEventsByWorkshop(id || '');

  const handleCall = () => {
    if (workshop?.phone) {
      Linking.openURL(`tel:${workshop.phone}`);
    }
  };

  const handleWebsite = () => {
    if (workshop?.website) {
      Linking.openURL(workshop.website);
    }
  };

  const handleInstagram = () => {
    if (workshop?.instagram) {
      const username = workshop.instagram.replace('@', '');
      Linking.openURL(`https://instagram.com/${username}`);
    }
  };

  const handleGetDirections = () => {
    if (workshop) {
      const url = `https://www.google.com/maps/search/?api=1&query=${workshop.latitude},${workshop.longitude}`;
      Linking.openURL(url);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !workshop) {
    return (
      <>
        <Stack.Screen options={{ title: 'Atölye', headerShown: true }} />
        <View style={[styles.container, { alignItems: 'center', justifyContent: 'center', padding: Spacing.xl }]}>
          <Ionicons name="warning-outline" size={48} color={colors.mutedForeground} />
          <Text style={styles.errorText}>Atölye bulunamadı</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Geri Dön</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: workshop.name,
          headerShown: true,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
          headerTitleStyle: { fontWeight: '600' },
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Hero Image */}
          <Image
            source={{ uri: workshop.image_url || 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800' }}
            style={styles.heroImage}
          />

          {/* Workshop Info */}
          <View style={styles.content}>
            <Text style={styles.title}>{workshop.name}</Text>

            {/* Rating */}
            <View style={styles.ratingContainer}>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={16} color="#eab308" />
                <Text style={styles.ratingText}>
                  {workshop.rating?.toFixed(1) || '0.0'}
                </Text>
              </View>
              <Text style={styles.reviewCount}>
                {workshop.review_count || 0} değerlendirme
              </Text>
            </View>

            {/* Description */}
            <Text style={styles.description}>{workshop.description}</Text>

            {/* Contact Buttons */}
            <View style={styles.contactSection}>
              <Text style={styles.sectionTitle}>İletişim</Text>
              <View style={styles.contactButtons}>
                {workshop.phone && (
                  <TouchableOpacity style={styles.contactButton} onPress={handleCall}>
                    <Ionicons name="call" size={20} color={colors.primary} />
                    <Text style={styles.contactButtonText}>Ara</Text>
                  </TouchableOpacity>
                )}
                {workshop.website && (
                  <TouchableOpacity style={styles.contactButton} onPress={handleWebsite}>
                    <Ionicons name="globe" size={20} color={colors.primary} />
                    <Text style={styles.contactButtonText}>Website</Text>
                  </TouchableOpacity>
                )}
                {workshop.instagram && (
                  <TouchableOpacity style={styles.contactButton} onPress={handleInstagram}>
                    <Ionicons name="logo-instagram" size={20} color={colors.primary} />
                    <Text style={styles.contactButtonText}>Instagram</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Location */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Konum</Text>
              <TouchableOpacity style={styles.locationCard} onPress={handleGetDirections}>
                <View style={styles.locationInfo}>
                  <Ionicons name="location" size={20} color={colors.primary} />
                  <Text style={styles.locationText}>{workshop.address}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>

            {/* Events */}
            {events.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Yaklaşan Etkinlikler</Text>
                  <Text style={styles.eventCount}>{events.length} etkinlik</Text>
                </View>
                {events.slice(0, 5).map((event: any) => (
                  <TouchableOpacity
                    key={event.id}
                    style={styles.eventCard}
                    onPress={() => router.push(`/event/${event.id}`)}
                  >
                    <Image
                      source={{ uri: event.image_url || 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400' }}
                      style={styles.eventImage}
                    />
                    <View style={styles.eventInfo}>
                      <Text style={styles.eventTitle} numberOfLines={2}>
                        {event.title}
                      </Text>
                      <View style={styles.eventMeta}>
                        <Ionicons name="calendar" size={14} color={colors.mutedForeground} />
                        <Text style={styles.eventDate}>
                          {format(new Date(event.start_date), 'd MMM', { locale: tr })}
                        </Text>
                      </View>
                      <Text style={styles.eventPrice}>₺{event.price}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={{ height: 40 }} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  heroImage: {
    width: '100%',
    height: 300,
    backgroundColor: colors.muted,
  },
  content: {
    padding: Spacing.lg,
  },
  title: {
    fontSize: FontSizes['2xl'],
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: Spacing.md,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.muted,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  ratingText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: colors.foreground,
  },
  reviewCount: {
    fontSize: FontSizes.sm,
    color: colors.mutedForeground,
  },
  description: {
    fontSize: FontSizes.sm,
    color: colors.mutedForeground,
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  contactSection: {
    marginBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: Spacing.md,
  },
  eventCount: {
    fontSize: FontSizes.sm,
    color: colors.mutedForeground,
  },
  contactButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  contactButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: colors.foreground,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  locationInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  locationText: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: colors.foreground,
    lineHeight: 20,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  eventImage: {
    width: 100,
    height: 100,
    backgroundColor: colors.muted,
  },
  eventInfo: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'space-between',
  },
  eventTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: Spacing.xs,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: Spacing.xs,
  },
  eventDate: {
    fontSize: FontSizes.xs,
    color: colors.mutedForeground,
  },
  eventPrice: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
    color: colors.primary,
  },
  errorText: {
    color: colors.mutedForeground,
    marginTop: Spacing.md,
    fontSize: FontSizes.md,
  },
  backButton: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: colors.primary,
    borderRadius: BorderRadius.lg,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
