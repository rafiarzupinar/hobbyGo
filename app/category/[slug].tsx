import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/services/supabase';
import { EventCard } from '@/components/events/EventCard';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { Event, Subcategory } from '@/types';
import { Ionicons } from '@expo/vector-icons';

const colors = Colors.dark;

// Static export için tüm kategori slug'larını oluştur
export async function generateStaticParams() {
  try {
    const { data: categories } = await supabase
      .from('categories')
      .select('slug');

    if (!categories) return [];

    return categories.map((category) => ({
      slug: category.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default function CategoryScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  // Kategori bilgisini al
  const { data: category } = useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Alt kategorileri al
  const { data: subcategories = [] } = useQuery({
    queryKey: ['subcategories', category?.id],
    queryFn: async () => {
      if (!category?.id) return [];

      const { data, error } = await supabase
        .from('subcategories')
        .select('*')
        .eq('category_id', category.id)
        .order('name');

      if (error) throw error;
      return data as Subcategory[];
    },
    enabled: !!category?.id,
  });

  // Bu kategorideki eventleri al (alt kategori filtresi ile)
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['category-events', slug, selectedSubcategory],
    queryFn: async () => {
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', slug)
        .single();

      if (!categoryData) return [];

      let query = supabase
        .from('events')
        .select(`
          *,
          workshop:workshops(*),
          subcategory:subcategories(*)
        `)
        .eq('category_id', categoryData.id)
        .eq('is_active', true)
        .gte('start_date', new Date().toISOString());

      // Alt kategori filtresi varsa ekle
      if (selectedSubcategory) {
        query = query.eq('subcategory_id', selectedSubcategory);
      }

      const { data, error } = await query.order('start_date', { ascending: true });

      if (error) throw error;
      return data as Event[];
    },
  });

  return (
    <>
      <Stack.Screen
        options={{
          title: category?.name || 'Kategori',
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.foreground,
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        {category?.description && (
          <View style={styles.header}>
            <Text style={styles.description}>{category.description}</Text>
          </View>
        )}

        {/* Alt Kategoriler */}
        {subcategories.length > 0 && (
          <View style={styles.subcategoriesSection}>
            <Text style={styles.subcategoriesTitle}>Alt Kategoriler</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.subcategoriesContainer}
            >
              <TouchableOpacity
                style={[
                  styles.subcategoryChip,
                  !selectedSubcategory && styles.subcategoryChipActive
                ]}
                onPress={() => setSelectedSubcategory(null)}
              >
                <Ionicons
                  name="apps"
                  size={16}
                  color={!selectedSubcategory ? colors.primary : colors.foreground}
                />
                <Text style={[
                  styles.subcategoryText,
                  !selectedSubcategory && styles.subcategoryTextActive
                ]}>
                  Tümü
                </Text>
              </TouchableOpacity>

              {subcategories.map((subcat) => (
                <TouchableOpacity
                  key={subcat.id}
                  style={[
                    styles.subcategoryChip,
                    selectedSubcategory === subcat.id && styles.subcategoryChipActive
                  ]}
                  onPress={() => setSelectedSubcategory(subcat.id)}
                >
                  {subcat.icon && (
                    <Ionicons
                      name={subcat.icon as any}
                      size={16}
                      color={selectedSubcategory === subcat.id ? colors.primary : colors.foreground}
                    />
                  )}
                  <Text style={[
                    styles.subcategoryText,
                    selectedSubcategory === subcat.id && styles.subcategoryTextActive
                  ]}>
                    {subcat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : events.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Bu kategoride henüz etkinlik bulunmuyor</Text>
            <Text style={styles.emptySubtext}>Yakında yeni etkinlikler eklenecek!</Text>
          </View>
        ) : (
          <FlatList
            data={events}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <EventCard
                event={item}
                onPress={() => router.push(`/event/${item.id}`)}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  description: {
    fontSize: FontSizes.sm,
    color: colors.mutedForeground,
    lineHeight: 20,
  },
  subcategoriesSection: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  subcategoriesTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: colors.foreground,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  subcategoriesContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  subcategoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  subcategoryChipActive: {
    backgroundColor: colors.primary + '1A',
    borderColor: colors.primary,
  },
  subcategoryText: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: colors.foreground,
  },
  subcategoryTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: colors.foreground,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  emptySubtext: {
    fontSize: FontSizes.sm,
    color: colors.mutedForeground,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
});
