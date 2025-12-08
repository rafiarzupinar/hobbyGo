import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { theme } from '../utils/theme';
import { EventCard } from '../components/events/EventCard';

export default function CalendarScreen({ navigation }: any) {
  const [selected, setSelected] = useState('');

  // Mock events for selected date
  const mockEvents = [];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={(day) => {
              setSelected(day.dateString);
            }}
            markedDates={{
              [selected]: {
                selected: true,
                selectedColor: theme.colors.primary.DEFAULT,
              },
              '2024-03-24': { marked: true, dotColor: theme.colors.primary.DEFAULT },
              '2024-03-26': { marked: true, dotColor: theme.colors.primary.DEFAULT },
              '2024-03-28': { marked: true, dotColor: theme.colors.primary.DEFAULT },
            }}
            theme={{
              backgroundColor: theme.colors.background,
              calendarBackground: theme.colors.card.DEFAULT,
              textSectionTitleColor: theme.colors.muted.foreground,
              selectedDayBackgroundColor: theme.colors.primary.DEFAULT,
              selectedDayTextColor: '#ffffff',
              todayTextColor: theme.colors.primary.DEFAULT,
              dayTextColor: theme.colors.foreground,
              textDisabledColor: theme.colors.muted.foreground,
              dotColor: theme.colors.primary.DEFAULT,
              selectedDotColor: '#ffffff',
              arrowColor: theme.colors.primary.DEFAULT,
              monthTextColor: theme.colors.foreground,
              textDayFontFamily: 'System',
              textMonthFontFamily: 'System',
              textDayHeaderFontFamily: 'System',
              textDayFontWeight: '400',
              textMonthFontWeight: '700',
              textDayHeaderFontWeight: '600',
              textDayFontSize: 14,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 12,
            }}
            style={styles.calendar}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {selected ? `Seçili Tarih: ${selected}` : 'Tüm Etkinlikler'}
          </Text>

          {mockEvents.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Bu tarihte henüz etkinlik yok
              </Text>
            </View>
          ) : (
            <View style={styles.eventsList}>
              {mockEvents.map((event: any) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onPress={() =>
                    navigation.navigate('EventDetail', { eventId: event.id })
                  }
                />
              ))}
            </View>
          )}
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
  calendarContainer: {
    padding: theme.spacing['2xl'],
  },
  calendar: {
    borderRadius: theme.borderRadius['2xl'],
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  section: {
    paddingHorizontal: theme.spacing['2xl'],
    paddingBottom: theme.spacing['3xl'],
  },
  sectionTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.foreground,
    marginBottom: theme.spacing.lg,
  },
  eventsList: {
    gap: theme.spacing.lg,
  },
  emptyState: {
    paddingVertical: theme.spacing['4xl'],
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.muted.foreground,
  },
});
