import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../utils/theme';
import { Workshop } from '../../types';

interface WorkshopCardProps {
  workshop: Workshop;
  onPress: () => void;
}

export const WorkshopCard: React.FC<WorkshopCardProps> = ({ workshop, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={{
          uri: workshop.image_url || `https://picsum.photos/seed/${workshop.id}/100/100`,
        }}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {workshop.name}
        </Text>
        <View style={styles.infoRow}>
          <Ionicons
            name="location"
            size={16}
            color={theme.colors.muted.foreground}
          />
          <Text style={styles.distance}>
            {workshop.distance ? `${workshop.distance.toFixed(1)} km` : '1.2 km'} uzaklıkta
          </Text>
        </View>
        <View style={styles.rating}>
          <View style={styles.ratingContent}>
            <Ionicons name="star" size={16} color="#eab308" />
            <Text style={styles.ratingText}>{workshop.rating.toFixed(1)}</Text>
          </View>
          <Text style={styles.divider}>•</Text>
          <Text style={styles.reviewCount}>{workshop.review_count} değerlendirme</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card.DEFAULT,
    borderRadius: theme.borderRadius['2xl'],
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.muted.DEFAULT,
  },
  content: {
    flex: 1,
    gap: theme.spacing.sm,
  },
  name: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.foreground,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distance: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.muted.foreground,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  ratingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.foreground,
  },
  divider: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.muted.foreground,
  },
  reviewCount: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.muted.foreground,
  },
});
