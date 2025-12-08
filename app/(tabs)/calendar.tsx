import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontSizes } from '@/constants/theme';
import { useEvents } from '@/hooks/useEvents';
import { Event } from '@/types';
import { format, isSameDay, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';

const colors = Colors.dark;

const DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

// Category color mapping
const getCategoryColor = (categorySlug?: string) => {
  const colorMap: Record<string, string> = {
    seramik: '#a855f7',
    resim: '#ec4899',
    muzik: '#3b82f6',
    dans: '#f97316',
    'el-sanatlari': '#22c55e',
    fotograf: '#eab308',
  };
  return colorMap[categorySlug || ''] || colors.primary;
};

export default function CalendarScreen() {
  const router = useRouter();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  // Fetch events from Supabase
  const { data: events = [], isLoading } = useEvents(50);

  // Build events by date for the current month
  const eventsByDate = useMemo(() => {
    const result: Record<number, { count: number; colors: string[] }> = {};

    events.forEach((event: Event) => {
      const eventDate = parseISO(event.start_date);
      if (eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear) {
        const day = eventDate.getDate();
        const eventColor = getCategoryColor(event.category?.slug);

        if (!result[day]) {
          result[day] = { count: 0, colors: [] };
        }
        result[day].count += 1;
        if (!result[day].colors.includes(eventColor)) {
          result[day].colors.push(eventColor);
        }
      }
    });

    return result;
  }, [events, currentMonth, currentYear]);

  // Filter events for selected date
  const selectedDateEvents = useMemo(() => {
    const selectedDate = new Date(currentYear, currentMonth, selectedDay);
    return events.filter((event: Event) => {
      const eventDate = parseISO(event.start_date);
      return isSameDay(eventDate, selectedDate);
    });
  }, [events, currentYear, currentMonth, selectedDay]);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Convert to Monday-based
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDay(1);
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDay(1);
  };

  const goToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setSelectedDay(today.getDate());
  };

  const formatEventTime = (startDate: string) => {
    return format(parseISO(startDate), 'HH:mm');
  };

  const formatDuration = (startDate: string, endDate: string) => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 1) {
      return `${Math.round(diffHours * 60)} dk`;
    }
    return `${diffHours.toFixed(1)} saat`;
  };

  const renderCalendarDays = () => {
    const days = [];

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = day === selectedDay;
      const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
      const hasEvents = eventsByDate[day];

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.calendarDay,
            isSelected && styles.calendarDaySelected,
            isToday && !isSelected && styles.calendarDayToday,
          ]}
          onPress={() => setSelectedDay(day)}
        >
          <Text
            style={[
              styles.calendarDayText,
              isSelected && styles.calendarDayTextSelected,
              isToday && !isSelected && styles.calendarDayTextToday,
            ]}
          >
            {day}
          </Text>
          {hasEvents && (
            <View style={styles.eventDots}>
              {hasEvents.colors.slice(0, 3).map((color, index) => (
                <View
                  key={index}
                  style={[
                    styles.eventDot,
                    { backgroundColor: isSelected ? '#fff' : color },
                  ]}
                />
              ))}
            </View>
          )}
        </TouchableOpacity>
      );
    }

    return days;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Takvim</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="filter" size={20} color={colors.foreground} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="list" size={20} color={colors.foreground} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Month Navigation */}
        <View style={styles.monthNav}>
          <TouchableOpacity style={styles.monthNavButton} onPress={goToPreviousMonth}>
            <Ionicons name="chevron-back" size={20} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={styles.monthText}>
            {MONTHS[currentMonth]} {currentYear}
          </Text>
          <TouchableOpacity style={styles.monthNavButton} onPress={goToNextMonth}>
            <Ionicons name="chevron-forward" size={20} color={colors.foreground} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Calendar Grid */}
        <View style={styles.calendarContainer}>
          {/* Day Headers */}
          <View style={styles.calendarHeader}>
            {DAYS.map((day) => (
              <View key={day} style={styles.calendarHeaderCell}>
                <Text style={styles.calendarHeaderText}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Calendar Days */}
          <View style={styles.calendarGrid}>{renderCalendarDays()}</View>
        </View>

        {/* Selected Date Events */}
        <View style={styles.eventsSection}>
          <View style={styles.eventsSectionHeader}>
            <Text style={styles.eventsSectionTitle}>
              {selectedDay} {MONTHS[currentMonth]} {currentYear}
            </Text>
            <TouchableOpacity onPress={goToToday}>
              <Text style={styles.todayButton}>Bugün</Text>
            </TouchableOpacity>
          </View>

          {/* Loading */}
          {isLoading && (
            <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 20 }} />
          )}

          {/* Empty State */}
          {!isLoading && selectedDateEvents.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color={colors.mutedForeground} />
              <Text style={styles.emptyStateText}>Bu tarihte etkinlik yok</Text>
            </View>
          )}

          {/* Event Cards */}
          {selectedDateEvents.map((event: Event) => {
            const categoryColor = getCategoryColor(event.category?.slug);
            return (
              <TouchableOpacity
                key={event.id}
                style={styles.eventCard}
                onPress={() => router.push(`/event/${event.id}`)}
              >
                <Image
                  source={{ uri: event.image_url || 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=200' }}
                  style={styles.eventImage}
                />
                <View style={styles.eventInfo}>
                  <View style={styles.eventHeader}>
                    <Text style={styles.eventTitle} numberOfLines={1}>
                      {event.title}
                    </Text>
                    <Text style={[styles.eventTime, { color: categoryColor }]}>
                      {formatEventTime(event.start_date)}
                    </Text>
                  </View>
                  <Text style={styles.eventLocation} numberOfLines={1}>
                    {event.workshop?.name || 'Atölye'}
                  </Text>
                  <View style={styles.eventMeta}>
                    <View
                      style={[
                        styles.categoryBadge,
                        { backgroundColor: categoryColor + '1A' },
                      ]}
                    >
                      <Text style={[styles.categoryText, { color: categoryColor }]}>
                        {event.category?.name || 'Etkinlik'}
                      </Text>
                    </View>
                    <Text style={styles.durationText}>
                      {formatDuration(event.start_date, event.end_date)}
                    </Text>
                    <Text style={styles.priceText}>₺{event.price}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
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
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  headerTitle: {
    fontSize: FontSizes['2xl'],
    fontWeight: '700',
    color: colors.foreground,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  headerButton: {
    backgroundColor: colors.muted,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
  },
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthNavButton: {
    padding: Spacing.sm,
  },
  monthText: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: colors.foreground,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  calendarContainer: {
    backgroundColor: colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: Spacing.lg,
  },
  calendarHeader: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  calendarHeaderCell: {
    flex: 1,
    alignItems: 'center',
  },
  calendarHeaderText: {
    fontSize: FontSizes.xs,
    fontWeight: '500',
    color: colors.mutedForeground,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.sm,
  },
  calendarDaySelected: {
    backgroundColor: colors.primary,
  },
  calendarDayToday: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
  calendarDayText: {
    fontSize: FontSizes.sm,
    color: colors.foreground,
  },
  calendarDayTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  calendarDayTextToday: {
    color: colors.primary,
    fontWeight: '600',
  },
  eventDots: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  eventsSection: {
    marginBottom: Spacing.lg,
  },
  eventsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  eventsSectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: colors.foreground,
  },
  todayButton: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: colors.primary,
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
  eventCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  eventImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.lg,
  },
  eventInfo: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  eventTitle: {
    flex: 1,
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: colors.foreground,
    marginRight: Spacing.sm,
  },
  eventTime: {
    fontSize: FontSizes.xs,
    fontWeight: '500',
  },
  eventLocation: {
    fontSize: FontSizes.xs,
    color: colors.mutedForeground,
    marginBottom: Spacing.sm,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  categoryText: {
    fontSize: FontSizes.xs,
    fontWeight: '500',
  },
  durationText: {
    fontSize: FontSizes.xs,
    color: colors.mutedForeground,
  },
  priceText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    color: colors.primary,
  },
});
