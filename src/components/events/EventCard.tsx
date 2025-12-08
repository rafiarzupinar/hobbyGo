import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../utils/theme';
import { Event } from '../../types';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface EventCardProps {
  event: Event;
  onPress: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
  const eventDate = new Date(event.start_date);
  const monthShort = format(eventDate, 'MMM', { locale: tr }).toUpperCase();
  const day = format(eventDate, 'd');
  const timeRange = `${format(new Date(event.start_date), 'HH:mm')} - ${format(
    new Date(event.end_date),
    'HH:mm'
  )}`;

  const participantsCount = event.current_bookings + Math.floor(Math.random() * 5) + 8;
  const hasDiscount = event.original_price && event.original_price > event.price;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={{
          uri: event.image_url || `https://picsum.photos/seed/${event.id}/400/200`,
        }}
        style={styles.image}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.dateBox}>
            <Text style={styles.dateMonth}>{monthShort}</Text>
            <Text style={styles.dateDay}>{day}</Text>
          </View>
          <View style={styles.eventInfo}>
            <Text style={styles.title} numberOfLines={1}>
              {event.title}
            </Text>
            <View style={styles.infoRow}>
              <Ionicons
                name="time-outline"
                size={16}
                color={theme.colors.muted.foreground}
              />
              <Text style={styles.infoText}>{timeRange}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons
                name="location-outline"
                size={16}
                color={theme.colors.muted.foreground}
              />
              <Text style={styles.infoText} numberOfLines={1}>
                {event.workshop?.name || 'Atölye'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.participants}>
            <View style={styles.avatarGroup}>
              {[1, 2, 3].map((i) => (
                <Image
                  key={i}
                  source={{ uri: `https://i.pravatar.cc/150?img=${i}` }}
                  style={[styles.avatar, { marginLeft: i > 1 ? -8 : 0 }]}
                />
              ))}
            </View>
            <Text style={styles.participantsText}>+{participantsCount} katılımcı</Text>
          </View>
          <Text style={styles.price}>₺{event.price}</Text>
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
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 192,
    backgroundColor: theme.colors.muted.DEFAULT,
  },
  content: {
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  dateBox: {
    backgroundColor: theme.colors.primary.DEFAULT,
    borderRadius: theme.borderRadius.xl,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    minWidth: 60,
  },
  dateMonth: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.medium,
    color: '#fff',
  },
  dateDay: {
    fontSize: 24,
    fontWeight: theme.fontWeight.bold,
    color: '#fff',
  },
  eventInfo: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.foreground,
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.muted.foreground,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  participants: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  avatarGroup: {
    flexDirection: 'row',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: theme.borderRadius.full,
    borderWidth: 2,
    borderColor: theme.colors.card.DEFAULT,
  },
  participantsText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.muted.foreground,
  },
  price: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary.DEFAULT,
  },
});
