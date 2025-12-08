import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/services/supabase';
import { EventCard } from '@/components/common/EventCard';
import { Colors, Spacing, FontSizes } from '@/constants/theme';
import { Event } from '@/types';

const colors = Colors.dark;

export default function CategoryScreen() {
  const { slug } = useLocalSearchParams();

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

  // Bu kategorideki eventleri al
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['category-events', slug],
    queryFn: async () => {
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', slug)
        .single();

      if (!categoryData) return [];

      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          workshop:workshops(*)
        `)
        .eq('category_id', categoryData.id)
        .eq('is_active', true)
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true });

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
            renderItem={({ item }) => <EventCard event={item} />}
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
