import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCategories } from '@/hooks/useCategories';
import { useSubcategories } from '@/hooks/useSubcategories';
import { useEvents } from '@/hooks/useEvents';
import { useTheme } from '@/contexts/ThemeContext';
import { CategoryColors, Spacing, BorderRadius, FontSizes, Colors } from '@/constants/theme';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import type { Event } from '@/types';

const { width } = Dimensions.get('window');

export default function CategoryScreen() {
  const { colors } = useTheme();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);

  // Fetch data
  const { data: categories = [] } = useCategories();
  const { data: subcategories = [], isLoading: subcategoriesLoading } = useSubcategories(slug);
  const { data: allEvents = [], isLoading: eventsLoading } = useEvents(1000); // Fetch more events

  // Find current category
  const category = categories.find((cat) => cat.slug === slug);

  // Get category colors
  const categoryColors = useMemo(() => {
    if (!slug) return { from: '#3b82f6', to: '#2563eb' };
    const colorConfig = (CategoryColors as any)[slug];
    return colorConfig || { from: '#3b82f6', to: '#2563eb' };
  }, [slug]);

  // Filter events by category and optionally by subcategory
  const filteredEvents = useMemo(() => {
    if (!category) return [];

    let events = allEvents.filter((event: Event) => {
      return event.category_id === category.id;
    });

    if (selectedSubcategoryId) {
      events = events.filter((event: Event) => {
        return event.subcategory_id === selectedSubcategoryId;
      });
    }

    return events;
  }, [allEvents, category, selectedSubcategoryId]);

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

  if (!category) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Kategori',
            headerShown: true,
          }}
        />
        <SafeAreaView style={styles.container}>
          <Text style={styles.errorText}>Kategori bulunamadı</Text>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: category.name,
          headerShown: true,
          headerStyle: {
            backgroundColor: staticColors.background,
          },
          headerTintColor: colors.foreground,
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Category Header */}
          <LinearGradient
            colors={[categoryColors.from, categoryColors.to]}
            style={styles.categoryHeader}
          >
            <Ionicons name={category.icon as any} size={48} color="#fff" />
            <Text style={styles.categoryTitle}>{category.name}</Text>
            {category.description && (
              <Text style={styles.categoryDescription}>{category.description}</Text>
            )}
          </LinearGradient>

          {/* Subcategories */}
          {subcategoriesLoading ? (
            <ActivityIndicator size="small" color={colors.primary} style={styles.loader} />
          ) : subcategories.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Alt Kategoriler</Text>
              <View style={styles.subcategoriesGrid}>
                <TouchableOpacity
                  style={styles.subcategoryGridItem}
                  onPress={() => setSelectedSubcategoryId(null)}
                >
                  <View
                    style={[
                      styles.subcategoryCircle,
                      !selectedSubcategoryId && styles.subcategoryCircleActive,
                    ]}
                  >
                    <Ionicons
                      name="grid-outline"
                      size={32}
                      color={!selectedSubcategoryId ? '#fff' : colors.mutedForeground}
                    />
                  </View>
                  <Text
                    style={[
                      styles.subcategoryName,
                      !selectedSubcategoryId && styles.subcategoryNameActive,
                    ]}
                  >
                    Tümü
                  </Text>
                </TouchableOpacity>
                {subcategories.map((subcategory) => (
                  <TouchableOpacity
                    key={subcategory.id}
                    style={styles.subcategoryGridItem}
                    onPress={() => setSelectedSubcategoryId(subcategory.id)}
                  >
                    <View
                      style={[
                        styles.subcategoryCircle,
                        selectedSubcategoryId === subcategory.id &&
                          styles.subcategoryCircleActive,
                      ]}
                    >
                      <Ionicons
                        name={(subcategory.icon as any) || 'apps-outline'}
                        size={32}
                        color={
                          selectedSubcategoryId === subcategory.id
                            ? '#fff'
                            : colors.mutedForeground
                        }
                      />
                    </View>
                    <Text
                      style={[
                        styles.subcategoryName,
                        selectedSubcategoryId === subcategory.id &&
                          styles.subcategoryNameActive,
                      ]}
                      numberOfLines={2}
                    >
                      {subcategory.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : null}

          {/* Events */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Etkinlikler ({filteredEvents.length})
            </Text>
            {eventsLoading ? (
              <ActivityIndicator size="small" color={colors.primary} style={styles.loader} />
            ) : filteredEvents.length > 0 ? (
              filteredEvents.map((event: Event) => {
                const dateInfo = formatEventDate(event.start_date);
                const timeInfo = formatEventTime(event.start_date, event.end_date);

                return (
                  <TouchableOpacity
                    key={event.id}
                    style={styles.eventCard}
                    onPress={() => router.push(`/event/${event.id}`)}
                  >
                    <View style={styles.eventDateBadge}>
                      <Text style={styles.eventDateMonth}>{dateInfo.month}</Text>
                      <Text style={styles.eventDateDay}>{dateInfo.day}</Text>
                    </View>
                    <Image
                      source={{
                        uri:
                          event.image_url ||
                          'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
                      }}
                      style={styles.eventImage}
                    />
                    <View style={styles.eventInfo}>
                      <Text style={styles.eventTitle} numberOfLines={2}>
                        {event.title}
                      </Text>
                      <View style={styles.eventMeta}>
                        <Ionicons name="time-outline" size={14} color={colors.mutedForeground} />
                        <Text style={styles.eventMetaText}>{timeInfo}</Text>
                      </View>
                      {event.workshop && (
                        <View style={styles.eventMeta}>
                          <Ionicons
                            name="location-outline"
                            size={14}
                            color={colors.mutedForeground}
                          />
                          <Text style={styles.eventMetaText} numberOfLines={1}>
                            {event.workshop.name}
                          </Text>
                        </View>
                      )}
                      <View style={styles.eventFooter}>
                        <Text style={styles.eventPrice}>
                          {event.price === 0 ? 'Ücretsiz' : `${event.price} TL`}
                        </Text>
                        <Text style={styles.eventCapacity}>
                          {event.current_bookings}/{event.capacity} kişi
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="calendar-outline" size={48} color={colors.mutedForeground} />
                <Text style={styles.emptyStateText}>
                  {selectedSubcategoryId
                    ? 'Bu alt kategoride etkinlik bulunamadı'
                    : 'Bu kategoride henüz etkinlik yok'}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

// Static colors for StyleSheet
const staticColors = Colors.dark;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: staticColors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  categoryHeader: {
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  categoryTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: Spacing.md,
  },
  categoryDescription: {
    fontSize: FontSizes.sm,
    color: 'rgba(255,255,255,0.9)',
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: staticColors.foreground,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  subcategoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  subcategoryGridItem: {
    width: (width - Spacing.lg * 2 - Spacing.md * 2) / 3,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  subcategoryCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: staticColors.card,
    borderWidth: 2,
    borderColor: staticColors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  subcategoryCircleActive: {
    backgroundColor: staticColors.primary,
    borderColor: staticColors.primary,
  },
  subcategoryName: {
    fontSize: FontSizes.xs,
    color: staticColors.foreground,
    textAlign: 'center',
    fontWeight: '500',
  },
  subcategoryNameActive: {
    color: staticColors.primary,
    fontWeight: '600',
  },
  loader: {
    marginVertical: Spacing.xl,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: staticColors.card,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: staticColors.border,
  },
  eventDateBadge: {
    width: 60,
    backgroundColor: staticColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
  },
  eventDateMonth: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    color: '#fff',
  },
  eventDateDay: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: '#fff',
  },
  eventImage: {
    width: 100,
    height: 120,
  },
  eventInfo: {
    flex: 1,
    padding: Spacing.md,
  },
  eventTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: staticColors.foreground,
    marginBottom: Spacing.xs,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  eventMetaText: {
    fontSize: FontSizes.sm,
    color: staticColors.mutedForeground,
    flex: 1,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  eventPrice: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: staticColors.primary,
  },
  eventCapacity: {
    fontSize: FontSizes.sm,
    color: staticColors.mutedForeground,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyStateText: {
    fontSize: FontSizes.md,
    color: staticColors.mutedForeground,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  errorText: {
    fontSize: FontSizes.lg,
    color: staticColors.mutedForeground,
    textAlign: 'center',
  },
});
