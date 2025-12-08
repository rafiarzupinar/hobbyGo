import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Image,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, CategoryColors, Spacing, BorderRadius, FontSizes } from '@/constants/theme';
import { useCategories } from '@/hooks/useCategories';
import { useWorkshops } from '@/hooks/useWorkshops';
import { useEvents } from '@/hooks/useEvents';
import { Category, Workshop, Event } from '@/types';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const { width } = Dimensions.get('window');
const colors = Colors.dark;

// Category color mapping by slug
const getCategoryColors = (slug: string) => {
  // Return the color from CategoryColors if it exists, otherwise use a default gradient
  const categoryColor = (CategoryColors as any)[slug];
  if (categoryColor) {
    return categoryColor;
  }

  // Default fallback colors if slug not found
  const fallbackColors = [
    { from: '#a855f7', to: '#9333ea' }, // purple
    { from: '#3b82f6', to: '#2563eb' }, // blue
    { from: '#22c55e', to: '#16a34a' }, // green
    { from: '#f97316', to: '#ea580c' }, // orange
    { from: '#ec4899', to: '#db2777' }, // pink
    { from: '#eab308', to: '#ca8a04' }, // yellow
  ];

  // Use hash of slug to deterministically select a color
  const hash = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return fallbackColors[hash % fallbackColors.length];
};

export default function HomeScreen() {
  const router = useRouter();
  const [selectedLocation] = useState('İstanbul, Kadıköy');

  // Fetch data from Supabase
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: workshops = [], isLoading: workshopsLoading } = useWorkshops(10);
  const { data: events = [], isLoading: eventsLoading } = useEvents(10);

  const formatEventDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      month: format(date, 'MMM', { locale: tr }).toUpperCase(),
      day: format(date, 'd'),
    };
  };

  const formatEventTime = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.locationButton}>
          <Ionicons name="location" size={20} color={colors.primary} />
          <Text style={styles.locationText}>{selectedLocation}</Text>
          <Ionicons name="chevron-down" size={16} color={colors.mutedForeground} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={20} color={colors.foreground} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kategoriler</Text>
          {categoriesLoading ? (
            <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 20 }} />
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
            >
              {categories.map((category: Category) => (
                <Pressable
                  key={category.id}
                  style={({ pressed }) => [
                    styles.categoryItem,
                    pressed && { opacity: 0.7 }
                  ]}
                  onPress={() => {
                    console.log('Category clicked:', category.slug);
                    router.push(`/category/${category.slug}`);
                  }}
                >
                  <LinearGradient
                    colors={[getCategoryColors(category.slug).from, getCategoryColors(category.slug).to]}
                    style={styles.categoryIcon}
                  >
                    <Ionicons name={category.icon as any} size={28} color="#fff" />
                  </LinearGradient>
                  <Text style={styles.categoryName}>{category.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Nearby Workshops */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Yakındaki Atölyeler</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/map')}>
              <Text style={styles.seeAllText}>Tümü</Text>
            </TouchableOpacity>
          </View>

          {/* Mini Map Card */}
          <TouchableOpacity
            style={styles.mapCard}
            onPress={() => router.push('/(tabs)/map')}
          >
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800' }}
              style={styles.mapImage}
            />
            <View style={styles.mapBadge}>
              <Text style={styles.mapBadgeText}>{workshops.length} Atölye</Text>
            </View>
          </TouchableOpacity>

          {/* Workshop Cards */}
          {workshopsLoading ? (
            <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 20 }} />
          ) : (
            workshops.slice(0, 3).map((workshop: Workshop) => (
              <TouchableOpacity
                key={workshop.id}
                style={styles.workshopCard}
                onPress={() => router.push(`/workshop/${workshop.id}`)}
              >
                <Image
                  source={{ uri: workshop.image_url || 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=200' }}
                  style={styles.workshopImage}
                />
                <View style={styles.workshopInfo}>
                  <Text style={styles.workshopName}>{workshop.name}</Text>
                  <View style={styles.workshopMeta}>
                    <Ionicons name="location" size={14} color={colors.mutedForeground} />
                    <Text style={styles.workshopDistance} numberOfLines={1}>
                      {workshop.address?.split(',')[0]}
                    </Text>
                  </View>
                  <View style={styles.workshopRating}>
                    <Ionicons name="star" size={14} color="#eab308" />
                    <Text style={styles.ratingText}>{workshop.rating?.toFixed(1) || '0.0'}</Text>
                    <Text style={styles.reviewCount}>• {workshop.review_count || 0} değerlendirme</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Upcoming Events */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Yaklaşan Etkinlikler</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/calendar')}>
              <Text style={styles.seeAllText}>Tümü</Text>
            </TouchableOpacity>
          </View>

          {eventsLoading ? (
            <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 20 }} />
          ) : events.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color={colors.mutedForeground} />
              <Text style={styles.emptyStateText}>Henüz etkinlik bulunmuyor</Text>
            </View>
          ) : (
            events.map((event: Event) => {
              const dateInfo = formatEventDate(event.start_date);
              return (
                <TouchableOpacity
                  key={event.id}
                  style={styles.eventCard}
                  onPress={() => router.push(`/event/${event.id}`)}
                >
                  <Image
                    source={{ uri: event.image_url || 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800' }}
                    style={styles.eventImage}
                  />
                  <View style={styles.eventContent}>
                    <View style={styles.eventHeader}>
                      <View style={styles.eventDateBadge}>
                        <Text style={styles.eventMonth}>{dateInfo.month}</Text>
                        <Text style={styles.eventDay}>{dateInfo.day}</Text>
                      </View>
                      <View style={styles.eventDetails}>
                        <Text style={styles.eventTitle} numberOfLines={1}>{event.title}</Text>
                        <View style={styles.eventMeta}>
                          <Ionicons name="time" size={14} color={colors.mutedForeground} />
                          <Text style={styles.eventMetaText}>
                            {formatEventTime(event.start_date, event.end_date)}
                          </Text>
                        </View>
                        <View style={styles.eventMeta}>
                          <Ionicons name="location" size={14} color={colors.mutedForeground} />
                          <Text style={styles.eventMetaText} numberOfLines={1}>
                            {event.workshop?.name || 'Atölye'}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.eventFooter}>
                      <View style={styles.participantsContainer}>
                        <View style={styles.capacityBadge}>
                          <Ionicons name="people" size={14} color={colors.primary} />
                          <Text style={styles.capacityText}>
                            {event.current_bookings}/{event.capacity}
                          </Text>
                        </View>
                        {event.level && (
                          <View style={styles.levelBadge}>
                            <Text style={styles.levelText}>
                              {event.level === 'beginner' ? 'Başlangıç' :
                               event.level === 'intermediate' ? 'Orta' :
                               event.level === 'advanced' ? 'İleri' : 'Tüm Seviyeler'}
                            </Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.priceContainer}>
                        {event.original_price && event.original_price > event.price && (
                          <Text style={styles.originalPrice}>₺{event.original_price}</Text>
                        )}
                        <Text style={styles.eventPrice}>₺{event.price}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* Bottom spacing for tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  locationButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginRight: Spacing.sm,
    gap: Spacing.sm,
  },
  locationText: {
    flex: 1,
    color: colors.foreground,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  searchButton: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: colors.foreground,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  seeAllText: {
    color: colors.primary,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  categoriesContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: Spacing.md,
    width: 80,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  categoryName: {
    color: colors.foreground,
    fontSize: FontSizes.xs,
    fontWeight: '500',
    textAlign: 'center',
  },
  mapCard: {
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: Spacing.md,
  },
  mapImage: {
    width: '100%',
    height: 140,
  },
  mapBadge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: '#fff',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  mapBadgeText: {
    color: colors.primary,
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  workshopCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: Spacing.md,
    gap: Spacing.lg,
  },
  workshopImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.lg,
  },
  workshopInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  workshopName: {
    color: colors.foreground,
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  workshopMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: Spacing.sm,
  },
  workshopDistance: {
    color: colors.mutedForeground,
    fontSize: FontSizes.xs,
    flex: 1,
  },
  workshopRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    color: colors.foreground,
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  reviewCount: {
    color: colors.mutedForeground,
    fontSize: FontSizes.xs,
  },
  eventCard: {
    backgroundColor: colors.card,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: Spacing.lg,
  },
  eventImage: {
    width: '100%',
    height: 180,
  },
  eventContent: {
    padding: Spacing.lg,
  },
  eventHeader: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  eventDateBadge: {
    backgroundColor: colors.primary,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    minWidth: 60,
  },
  eventMonth: {
    color: '#fff',
    fontSize: FontSizes.xs,
    fontWeight: '500',
  },
  eventDay: {
    color: '#fff',
    fontSize: FontSizes['2xl'],
    fontWeight: '700',
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    color: colors.foreground,
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  eventMetaText: {
    color: colors.mutedForeground,
    fontSize: FontSizes.xs,
    flex: 1,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  capacityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  capacityText: {
    color: colors.primary,
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  levelBadge: {
    backgroundColor: colors.muted,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  levelText: {
    color: colors.mutedForeground,
    fontSize: FontSizes.xs,
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  originalPrice: {
    color: colors.mutedForeground,
    fontSize: FontSizes.xs,
    textDecorationLine: 'line-through',
  },
  eventPrice: {
    color: colors.primary,
    fontSize: FontSizes.md,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl * 2,
  },
  emptyStateText: {
    color: colors.mutedForeground,
    fontSize: FontSizes.sm,
    marginTop: Spacing.md,
  },
});
