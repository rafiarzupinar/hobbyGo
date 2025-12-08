import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, BorderRadius, FontSizes } from '@/constants/theme';
import { useEvent, useRegisterToEvent, useEventsByCategory } from '@/hooks/useEvents';
import { useAppSelector } from '@/store/hooks';
import { Event } from '@/types';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';

const { width } = Dimensions.get('window');
const colors = Colors.dark;

export default function EventDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAppSelector((state) => state.auth);
  const [isFavorite, setIsFavorite] = useState(false);

  // Fetch event data
  const { data: event, isLoading, error } = useEvent(id || '');

  // Fetch related events by category
  const { data: relatedEvents = [] } = useEventsByCategory(event?.category_id || '', 5);

  // Register mutation
  const registerMutation = useRegisterToEvent();

  const handleRegister = async () => {
    if (!user) {
      Alert.alert('Giriş Gerekli', 'Etkinliğe kayıt olmak için giriş yapmalısınız.', [
        { text: 'İptal', style: 'cancel' },
        { text: 'Giriş Yap', onPress: () => router.push('/login') },
      ]);
      return;
    }

    if (!event) return;

    try {
      await registerMutation.mutateAsync({
        eventId: event.id,
        userId: user.id,
        numParticipants: 1,
      });
      Alert.alert('Başarılı', 'Etkinliğe kaydınız alındı!');
    } catch (err: any) {
      Alert.alert('Hata', err.message || 'Kayıt sırasında bir hata oluştu.');
    }
  };

  const formatEventDate = (dateStr: string) => {
    const date = parseISO(dateStr);
    return format(date, "d MMMM yyyy, EEEE", { locale: tr });
  };

  const formatEventTime = (startDate: string, endDate: string) => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    return `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`;
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !event) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Ionicons name="warning-outline" size={48} color={colors.mutedForeground} />
        <Text style={{ color: colors.mutedForeground, marginTop: 16 }}>
          Etkinlik bulunamadı
        </Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: colors.primary }}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const spotsLeft = event.capacity - event.current_bookings;
  const hasDiscount = event.original_price && event.original_price > event.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - event.price / event.original_price!) * 100)
    : 0;

  // Filter out current event from related
  const filteredRelated = relatedEvents.filter((e: Event) => e.id !== event.id).slice(0, 4);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: event.image_url || 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800' }}
            style={styles.heroImage}
          />

          {/* Navigation Buttons */}
          <SafeAreaView style={styles.navButtons} edges={['top']}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={colors.foreground} />
            </TouchableOpacity>
            <View style={styles.navButtonsRight}>
              <TouchableOpacity style={styles.navButton}>
                <Ionicons name="share-social" size={20} color={colors.foreground} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navButton}
                onPress={() => setIsFavorite(!isFavorite)}
              >
                <Ionicons
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={20}
                  color={isFavorite ? colors.destructive : colors.foreground}
                />
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          {/* Level Badge */}
          {event.level && (
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>
                {event.level === 'beginner' ? 'Başlangıç' :
                 event.level === 'intermediate' ? 'Orta' :
                 event.level === 'advanced' ? 'İleri' : 'Tüm Seviyeler'}
              </Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title & Date */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{event.title}</Text>
            <View style={styles.dateRow}>
              <Ionicons name="calendar" size={20} color={colors.primary} />
              <Text style={styles.dateText}>{formatEventDate(event.start_date)}</Text>
            </View>
            <View style={styles.dateRow}>
              <Ionicons name="time" size={20} color={colors.primary} />
              <Text style={styles.dateText}>{formatEventTime(event.start_date, event.end_date)}</Text>
            </View>
          </View>

          {/* Workshop Info */}
          {event.workshop && (
            <TouchableOpacity
              style={styles.workshopCard}
              onPress={() => router.push(`/workshop/${event.workshop?.id}`)}
            >
              <View style={styles.workshopInfo}>
                <Image
                  source={{ uri: event.workshop.image_url || 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=200' }}
                  style={styles.workshopAvatar}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.workshopName}>{event.workshop.name}</Text>
                  <View style={styles.workshopRating}>
                    <Ionicons name="star" size={14} color="#eab308" />
                    <Text style={styles.workshopRatingText}>
                      {event.workshop.rating?.toFixed(1) || '0.0'} • {event.workshop.review_count || 0} değerlendirme
                    </Text>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}

          {/* Participants */}
          <View style={styles.participantsSection}>
            <View style={styles.participantsInfo}>
              <Ionicons name="people" size={20} color={colors.primary} />
              <View>
                <Text style={styles.participantsLabel}>Katılımcı</Text>
                <Text style={styles.participantsCount}>
                  {event.current_bookings}/{event.capacity} Kişi
                </Text>
              </View>
            </View>
            <View style={[
              styles.spotsLeftBadge,
              spotsLeft <= 3 && { backgroundColor: colors.destructive + '1A' }
            ]}>
              <Text style={[
                styles.spotsLeftText,
                spotsLeft <= 3 && { color: colors.destructive }
              ]}>
                {spotsLeft > 0 ? `${spotsLeft} Kişi Kaldı` : 'Dolu'}
              </Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Açıklama</Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>

          {/* Requirements */}
          {event.requirements && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Gereksinimler</Text>
              <Text style={styles.description}>{event.requirements}</Text>
            </View>
          )}

          {/* Tags */}
          <View style={styles.tagsContainer}>
            {event.category && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>{event.category.name}</Text>
              </View>
            )}
            {event.materials_included && (
              <View style={[styles.tag, { backgroundColor: '#22c55e1A' }]}>
                <Ionicons name="checkmark-circle" size={14} color="#22c55e" />
                <Text style={[styles.tagText, { color: '#22c55e' }]}>Malzemeler Dahil</Text>
              </View>
            )}
          </View>

          {/* Location */}
          {event.workshop && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Konum</Text>
              <View style={styles.locationCard}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800' }}
                  style={styles.locationMap}
                />
                <View style={styles.locationInfo}>
                  <Ionicons name="location" size={20} color={colors.primary} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.locationName}>{event.workshop.name}</Text>
                    <Text style={styles.locationAddress}>{event.workshop.address}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Price */}
          <View style={styles.priceCard}>
            <View style={styles.priceInfo}>
              <Text style={styles.priceLabel}>Etkinlik Ücreti</Text>
              <Text style={styles.priceValue}>₺{event.price}</Text>
              <Text style={styles.pricePerPerson}>Kişi başı</Text>
            </View>
            {hasDiscount && (
              <View style={styles.discountInfo}>
                <Text style={styles.originalPrice}>₺{event.original_price}</Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>%{discountPercent} İndirim</Text>
                </View>
              </View>
            )}
          </View>

          {/* Related Events */}
          {filteredRelated.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Diğer Etkinlikler</Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/calendar')}>
                  <Text style={styles.seeAllText}>Tümünü Gör</Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.relatedEventsContainer}
              >
                {filteredRelated.map((relatedEvent: Event) => (
                  <TouchableOpacity
                    key={relatedEvent.id}
                    style={styles.relatedEventCard}
                    onPress={() => router.push(`/event/${relatedEvent.id}`)}
                  >
                    <Image
                      source={{ uri: relatedEvent.image_url || 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400' }}
                      style={styles.relatedEventImage}
                    />
                    <View style={styles.relatedEventInfo}>
                      <Text style={styles.relatedEventTitle} numberOfLines={1}>
                        {relatedEvent.title}
                      </Text>
                      <Text style={styles.relatedEventDate}>
                        {formatEventDate(relatedEvent.start_date)}
                      </Text>
                      <Text style={styles.relatedEventPrice}>₺{relatedEvent.price}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Bottom spacing */}
          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <LinearGradient
        colors={['transparent', colors.background, colors.background]}
        style={styles.bottomGradient}
      >
        <SafeAreaView edges={['bottom']}>
          <TouchableOpacity
            style={[
              styles.registerButton,
              (spotsLeft <= 0 || registerMutation.isPending) && styles.registerButtonDisabled
            ]}
            onPress={handleRegister}
            disabled={spotsLeft <= 0 || registerMutation.isPending}
          >
            {registerMutation.isPending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="ticket" size={20} color="#fff" />
                <Text style={styles.registerButtonText}>
                  {spotsLeft <= 0 ? 'Dolu' : 'Kayıt Ol'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    </View>
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
  scrollContent: {
    paddingBottom: 0,
  },
  heroContainer: {
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: 400,
  },
  navButtons: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  navButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  navButtonsRight: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  levelBadge: {
    position: 'absolute',
    bottom: Spacing.lg,
    left: Spacing.lg,
    backgroundColor: colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  levelBadgeText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    color: '#fff',
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  titleSection: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes['2xl'],
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: Spacing.md,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  dateText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: colors.foreground,
  },
  workshopCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: Spacing.lg,
  },
  workshopInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  workshopAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  workshopName: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: colors.foreground,
  },
  workshopRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  workshopRatingText: {
    fontSize: FontSizes.xs,
    color: colors.mutedForeground,
  },
  participantsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  participantsInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.muted,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  participantsLabel: {
    fontSize: FontSizes.xs,
    color: colors.mutedForeground,
  },
  participantsCount: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: colors.foreground,
  },
  spotsLeftBadge: {
    backgroundColor: colors.primary + '1A',
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  spotsLeftText: {
    fontSize: FontSizes.xs,
    fontWeight: '500',
    color: colors.primary,
  },
  section: {
    marginBottom: Spacing.lg,
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
  seeAllText: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: colors.primary,
  },
  description: {
    fontSize: FontSizes.sm,
    color: colors.mutedForeground,
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '1A',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  tagText: {
    fontSize: FontSizes.xs,
    fontWeight: '500',
    color: colors.primary,
  },
  locationCard: {
    backgroundColor: colors.card,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  locationMap: {
    width: '100%',
    height: 150,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  locationName: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: colors.foreground,
  },
  locationAddress: {
    fontSize: FontSizes.xs,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  priceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary + '0D',
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: colors.primary + '33',
    marginBottom: Spacing.lg,
  },
  priceInfo: {},
  priceLabel: {
    fontSize: FontSizes.xs,
    color: colors.mutedForeground,
    marginBottom: Spacing.xs,
  },
  priceValue: {
    fontSize: FontSizes['3xl'],
    fontWeight: '700',
    color: colors.primary,
  },
  pricePerPerson: {
    fontSize: FontSizes.xs,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  discountInfo: {
    alignItems: 'flex-end',
  },
  originalPrice: {
    fontSize: FontSizes.sm,
    color: colors.mutedForeground,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.xs,
  },
  discountText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    color: '#fff',
  },
  relatedEventsContainer: {
    gap: Spacing.md,
  },
  relatedEventCard: {
    width: 200,
    backgroundColor: colors.card,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  relatedEventImage: {
    width: '100%',
    height: 120,
  },
  relatedEventInfo: {
    padding: Spacing.md,
  },
  relatedEventTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: Spacing.xs,
  },
  relatedEventDate: {
    fontSize: FontSizes.xs,
    color: colors.mutedForeground,
    marginBottom: Spacing.sm,
  },
  relatedEventPrice: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
    color: colors.primary,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing['3xl'],
    paddingBottom: Spacing.lg,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  registerButtonDisabled: {
    backgroundColor: colors.muted,
    shadowOpacity: 0,
  },
  registerButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: '#fff',
  },
});
