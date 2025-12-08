import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../utils/theme';
import { CategoryCard } from '../components/common/CategoryCard';
import { EventCard } from '../components/events/EventCard';
import { WorkshopCard } from '../components/workshops/WorkshopCard';
import { eventService } from '../services/eventService';
import { workshopService } from '../services/workshopService';
import type { Event, Workshop, Category } from '../types';

const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Seramik', slug: 'seramik', icon: 'color-palette', color: '#a855f7', created_at: '' },
  { id: '2', name: 'Resim', slug: 'resim', icon: 'brush', color: '#ec4899', created_at: '' },
  { id: '3', name: 'Müzik', slug: 'muzik', icon: 'musical-notes', color: '#3b82f6', created_at: '' },
  { id: '4', name: 'Dans', slug: 'dans', icon: 'walk', color: '#f97316', created_at: '' },
  { id: '5', name: 'El Sanatları', slug: 'el-sanatlari', icon: 'hand-left', color: '#10b981', created_at: '' },
  { id: '6', name: 'Fotoğraf', slug: 'fotograf', icon: 'camera', color: '#eab308', created_at: '' },
];

export default function HomeScreen({ navigation }: any) {
  const [events, setEvents] = useState<Event[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [eventsData, workshopsData] = await Promise.all([
        eventService.listEvents(3),
        workshopService.listWorkshops(2),
      ]);
      setEvents(eventsData);
      setWorkshops(workshopsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.locationButton}>
            <Ionicons name="location" size={20} color={theme.colors.primary.DEFAULT} />
            <Text style={styles.locationText}>İstanbul, Kadıköy</Text>
            <Ionicons
              name="chevron-down"
              size={16}
              color={theme.colors.muted.foreground}
            />
          </View>
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={20} color={theme.colors.foreground} />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kategoriler</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {MOCK_CATEGORIES.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onPress={() => console.log('Category:', category.name)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Nearby Workshops */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Yakındaki Atölyeler</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllButton}>Tümü</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.mapPreview}>
            <Image
              source={{ uri: 'https://picsum.photos/seed/map1/400/160' }}
              style={styles.mapImage}
            />
            <View style={styles.mapBadge}>
              <Text style={styles.mapBadgeText}>12 Atölye</Text>
            </View>
          </View>

          <View style={styles.workshopsList}>
            {workshops.map((workshop) => (
              <WorkshopCard
                key={workshop.id}
                workshop={workshop}
                onPress={() =>
                  navigation.navigate('WorkshopDetail', { workshopId: workshop.id })
                }
              />
            ))}
          </View>
        </View>

        {/* Upcoming Events */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Yaklaşan Etkinlikler</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllButton}>Tümü</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.eventsList}>
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onPress={() =>
                  navigation.navigate('EventDetail', { eventId: event.id })
                }
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing['2xl'],
    paddingTop: theme.spacing['2xl'],
    paddingBottom: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  locationButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.card.DEFAULT,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.xl,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  locationText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.foreground,
  },
  searchButton: {
    backgroundColor: theme.colors.card.DEFAULT,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
  },
  section: {
    paddingTop: theme.spacing['2xl'],
    gap: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing['2xl'],
  },
  sectionTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.foreground,
  },
  seeAllButton: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary.DEFAULT,
  },
  categoriesContainer: {
    paddingHorizontal: theme.spacing['2xl'],
    gap: theme.spacing.md,
  },
  mapPreview: {
    marginHorizontal: theme.spacing['2xl'],
    backgroundColor: theme.colors.card.DEFAULT,
    borderRadius: theme.borderRadius['2xl'],
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  mapImage: {
    width: '100%',
    height: 160,
    backgroundColor: theme.colors.muted.DEFAULT,
  },
  mapBadge: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    backgroundColor: '#fff',
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    ...theme.shadows.lg,
  },
  mapBadgeText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary.DEFAULT,
  },
  workshopsList: {
    paddingHorizontal: theme.spacing['2xl'],
    gap: theme.spacing.md,
  },
  eventsList: {
    paddingHorizontal: theme.spacing['2xl'],
    gap: theme.spacing.lg,
    paddingBottom: theme.spacing['3xl'],
  },
});
