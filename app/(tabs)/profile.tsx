import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
  Switch,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { authService } from '@/services/authService';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, BorderRadius, FontSizes } from '@/constants/theme';
import { useUserBookings } from '@/hooks/useEvents';
import { useFavorites } from '@/hooks/useFavorites';
import { EventBooking, Favorite } from '@/types';
import { format, parseISO, isPast } from 'date-fns';
import { tr } from 'date-fns/locale';

const USER_TYPE_KEY = '@hobbygo_user_type';

// Storage wrapper for web/native compatibility
const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return AsyncStorage.getItem(key);
  },
};

type TabType = 'events' | 'favorites' | 'settings';
type UserType = 'user' | 'workshop_owner';

export default function ProfileScreen() {
  const { theme, colors, toggleTheme } = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<TabType>('events');
  const [userType, setUserType] = useState<UserType>('user');

  // Fetch user bookings and favorites
  const { data: bookings = [], isLoading: bookingsLoading } = useUserBookings(user?.id || '');
  const { data: favorites = [], isLoading: favoritesLoading } = useFavorites(user?.id || '');

  // Load user type from storage
  useEffect(() => {
    const loadUserType = async () => {
      try {
        const savedUserType = await storage.getItem(USER_TYPE_KEY);
        if (savedUserType === 'user' || savedUserType === 'workshop_owner') {
          setUserType(savedUserType);
        }
      } catch (error) {
        console.error('Error loading user type:', error);
      }
    };
    loadUserType();
  }, []);

  // Separate upcoming and past events
  const upcomingBookings = bookings.filter((b: EventBooking) =>
    b.event && !isPast(parseISO(b.event.start_date)) && b.status !== 'cancelled'
  );
  const pastBookings = bookings.filter((b: EventBooking) =>
    b.event && isPast(parseISO(b.event.start_date))
  );

  const changeRole = async () => {
    router.push('/role-selection');
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logout());
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const formatEventDate = (dateStr: string) => {
    return format(parseISO(dateStr), "d MMMM yyyy, HH:mm", { locale: tr });
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: 'events', label: 'Kayıtlı Etkinliklerim' },
    { id: 'favorites', label: 'Favoriler' },
    { id: 'settings', label: 'Ayarlar' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Profile Header with Gradient */}
      <LinearGradient
        colors={[colors.primary, colors.primary + 'E6']}
        style={styles.profileHeader}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <View style={styles.profileInfo}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: user?.avatar_url || 'https://i.pravatar.cc/150?img=33' }}
                  style={styles.avatar}
                />
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>
                  {userType === 'workshop_owner' ? 'Atölye Sahibi' : 'Kullanıcı'}
                </Text>
                <Text style={styles.userEmail}>demo@hobbygo.com</Text>
                {userType === 'workshop_owner' && (
                  <View style={styles.ownerBadge}>
                    <Ionicons name="storefront" size={12} color="#fff" />
                    <Text style={styles.ownerBadgeText}>Atölye Sahibi</Text>
                  </View>
                )}
              </View>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="pencil" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{bookings.length}</Text>
              <Text style={styles.statLabel}>Etkinlik</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{favorites.length}</Text>
              <Text style={styles.statLabel}>Favori</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{pastBookings.filter((b: EventBooking) => b.status === 'completed').length}</Text>
              <Text style={styles.statLabel}>Tamamlandı</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Content Section */}
      <View style={styles.contentContainer}>
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.tabActive]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.id && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {activeTab === 'events' && (
            <>
              {bookingsLoading ? (
                <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 40 }} />
              ) : (
                <>
                  {/* Upcoming Events */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Yaklaşan Etkinlikler</Text>
                    {upcomingBookings.length === 0 ? (
                      <View style={styles.emptySection}>
                        <Text style={styles.emptySectionText}>Yaklaşan etkinlik yok</Text>
                      </View>
                    ) : (
                      upcomingBookings.map((booking: EventBooking) => (
                        <TouchableOpacity
                          key={booking.id}
                          style={styles.eventCard}
                          onPress={() => router.push(`/event/${booking.event?.id}`)}
                        >
                          <View style={styles.eventCardContent}>
                            <Image
                              source={{ uri: booking.event?.image_url || 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=200' }}
                              style={styles.eventImage}
                            />
                            <View style={styles.eventInfo}>
                              <Text style={styles.eventTitle} numberOfLines={1}>
                                {booking.event?.title}
                              </Text>
                              <Text style={styles.eventLocation} numberOfLines={1}>
                                {booking.event?.workshop?.name}
                              </Text>
                              <View style={styles.eventDateRow}>
                                <Ionicons name="calendar" size={14} color={colors.mutedForeground} />
                                <Text style={styles.eventDate}>
                                  {booking.event?.start_date && formatEventDate(booking.event.start_date)}
                                </Text>
                              </View>
                            </View>
                            <TouchableOpacity style={styles.qrButton}>
                              <Ionicons name="qr-code" size={20} color={colors.primary} />
                            </TouchableOpacity>
                          </View>
                          <View style={styles.bookingInfo}>
                            <Text style={styles.bookingInfoText}>
                              {booking.num_participants} kişi • ₺{booking.total_price}
                            </Text>
                            <View style={[
                              styles.statusBadge,
                              { backgroundColor: booking.status === 'confirmed' ? '#22c55e20' : '#f9731620' }
                            ]}>
                              <Text style={[
                                styles.statusText,
                                { color: booking.status === 'confirmed' ? '#22c55e' : '#f97316' }
                              ]}>
                                {booking.status === 'confirmed' ? 'Onaylandı' : 'Bekliyor'}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      ))
                    )}
                  </View>

                  {/* Past Events */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Geçmiş Etkinlikler</Text>
                    {pastBookings.length === 0 ? (
                      <View style={styles.emptySection}>
                        <Text style={styles.emptySectionText}>Geçmiş etkinlik yok</Text>
                      </View>
                    ) : (
                      pastBookings.map((booking: EventBooking) => (
                        <TouchableOpacity
                          key={booking.id}
                          style={styles.eventCard}
                          onPress={() => router.push(`/event/${booking.event?.id}`)}
                        >
                          <View style={styles.completedBadge}>
                            <Ionicons name="checkmark-circle" size={16} color="#fff" />
                          </View>
                          <View style={styles.eventCardContent}>
                            <Image
                              source={{ uri: booking.event?.image_url || 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=200' }}
                              style={[styles.eventImage, { opacity: 0.9 }]}
                            />
                            <View style={styles.eventInfo}>
                              <Text style={styles.eventTitle} numberOfLines={1}>
                                {booking.event?.title}
                              </Text>
                              <Text style={styles.eventLocation} numberOfLines={1}>
                                {booking.event?.workshop?.name}
                              </Text>
                              <View style={styles.eventDateRow}>
                                <Ionicons name="calendar" size={14} color={colors.mutedForeground} />
                                <Text style={styles.eventDate}>
                                  {booking.event?.start_date && formatEventDate(booking.event.start_date)}
                                </Text>
                              </View>
                              <View style={styles.completedRow}>
                                <Ionicons name="checkmark-circle" size={14} color="#22c55e" />
                                <Text style={styles.completedText}>Tamamlandı</Text>
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                      ))
                    )}
                  </View>
                </>
              )}
            </>
          )}

          {activeTab === 'favorites' && (
            <>
              {favoritesLoading ? (
                <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 40 }} />
              ) : favorites.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="heart-outline" size={48} color={colors.mutedForeground} />
                  <Text style={styles.emptyStateText}>Henüz favori eklemediniz</Text>
                </View>
              ) : (
                <View style={styles.favoritesGrid}>
                  {favorites.map((favorite: Favorite) => (
                    <TouchableOpacity
                      key={favorite.id}
                      style={styles.favoriteCard}
                      onPress={() => router.push(`/workshop/${favorite.workshop?.id}`)}
                    >
                      <Image
                        source={{ uri: favorite.workshop?.image_url || 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=200' }}
                        style={styles.favoriteImage}
                      />
                      <View style={styles.favoriteInfo}>
                        <Text style={styles.favoriteName} numberOfLines={2}>
                          {favorite.workshop?.name}
                        </Text>
                        <View style={styles.favoriteRating}>
                          <Ionicons name="star" size={12} color="#eab308" />
                          <Text style={styles.favoriteRatingText}>
                            {favorite.workshop?.rating?.toFixed(1) || '0.0'}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity style={styles.heartButton}>
                        <Ionicons name="heart" size={18} color={colors.destructive} />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </>
          )}

          {activeTab === 'settings' && (
            <View style={styles.settingsSection}>
              <TouchableOpacity style={styles.settingsItem}>
                <View style={styles.settingsItemLeft}>
                  <Ionicons name="person-outline" size={20} color={colors.foreground} />
                  <Text style={styles.settingsItemText}>Profili Düzenle</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingsItem} onPress={changeRole}>
                <View style={styles.settingsItemLeft}>
                  <Ionicons name="swap-horizontal" size={20} color={colors.foreground} />
                  <Text style={styles.settingsItemText}>
                    Rol Değiştir ({userType === 'workshop_owner' ? 'Atölye Sahibi' : 'Kullanıcı'})
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
              </TouchableOpacity>

              {/* Workshop owner can add new workshop/event */}
              {userType === 'workshop_owner' && (
                <>
                  <TouchableOpacity
                    style={styles.settingsItem}
                    onPress={() => router.push('/create-workshop')}
                  >
                    <View style={styles.settingsItemLeft}>
                      <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
                      <Text style={[styles.settingsItemText, { color: colors.primary }]}>
                        Yeni Atölye Ekle
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.settingsItem}
                    onPress={() => router.push('/create-event')}
                  >
                    <View style={styles.settingsItemLeft}>
                      <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                      <Text style={[styles.settingsItemText, { color: colors.primary }]}>
                        Yeni Etkinlik Ekle
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.primary} />
                  </TouchableOpacity>
                </>
              )}

              <View style={styles.settingsItem}>
                <View style={styles.settingsItemLeft}>
                  <Ionicons name={theme === 'dark' ? 'moon' : 'sunny'} size={20} color={colors.foreground} />
                  <Text style={styles.settingsItemText}>
                    {theme === 'dark' ? 'Koyu Tema' : 'Açık Tema'}
                  </Text>
                </View>
                <Switch
                  value={theme === 'dark'}
                  onValueChange={toggleTheme}
                  trackColor={{ false: '#d1d5db', true: colors.primary }}
                  thumbColor="#fff"
                />
              </View>

              <TouchableOpacity style={styles.settingsItem}>
                <View style={styles.settingsItemLeft}>
                  <Ionicons name="notifications-outline" size={20} color={colors.foreground} />
                  <Text style={styles.settingsItemText}>Bildirimler</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingsItem}>
                <View style={styles.settingsItemLeft}>
                  <Ionicons name="lock-closed-outline" size={20} color={colors.foreground} />
                  <Text style={styles.settingsItemText}>Gizlilik</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingsItem}>
                <View style={styles.settingsItemLeft}>
                  <Ionicons name="help-circle-outline" size={20} color={colors.foreground} />
                  <Text style={styles.settingsItemText}>Yardım & Destek</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingsItem}>
                <View style={styles.settingsItemLeft}>
                  <Ionicons name="information-circle-outline" size={20} color={colors.foreground} />
                  <Text style={styles.settingsItemText}>Hakkında</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.settingsItem, styles.logoutItem]} onPress={handleLogout}>
                <View style={styles.settingsItemLeft}>
                  <Ionicons name="log-out-outline" size={20} color={colors.destructive} />
                  <Text style={[styles.settingsItemText, { color: colors.destructive }]}>
                    Çıkış Yap
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* Bottom spacing for tab bar */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  profileHeader: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
    paddingTop: Spacing.md,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#fff',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: '#fff',
    marginBottom: Spacing.xs,
  },
  userEmail: {
    fontSize: FontSizes.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  ownerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.xs,
    gap: 4,
    alignSelf: 'flex-start',
  },
  ownerBadgeText: {
    fontSize: FontSizes.xs,
    color: '#fff',
    fontWeight: '500',
  },
  editButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statItem: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSizes['2xl'],
    fontWeight: '700',
    color: '#fff',
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    color: 'rgba(255,255,255,0.8)',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: colors.background,
    marginTop: -Spacing.lg,
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: Spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: colors.mutedForeground,
  },
  tabTextActive: {
    color: colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: Spacing.md,
  },
  emptySection: {
    backgroundColor: colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptySectionText: {
    fontSize: FontSizes.sm,
    color: colors.mutedForeground,
  },
  eventCard: {
    backgroundColor: colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: Spacing.md,
    position: 'relative',
    overflow: 'hidden',
  },
  eventCardContent: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  eventImage: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.lg,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: Spacing.xs,
  },
  eventLocation: {
    fontSize: FontSizes.xs,
    color: colors.mutedForeground,
    marginBottom: Spacing.xs,
  },
  eventDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  eventDate: {
    fontSize: FontSizes.xs,
    color: colors.mutedForeground,
  },
  qrButton: {
    backgroundColor: colors.primary + '1A',
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    height: 36,
  },
  bookingInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  bookingInfoText: {
    fontSize: FontSizes.xs,
    color: colors.mutedForeground,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontWeight: '500',
  },
  completedBadge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: '#22c55e',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  completedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.xs,
  },
  completedText: {
    fontSize: FontSizes.xs,
    color: '#22c55e',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['4xl'],
  },
  emptyStateText: {
    fontSize: FontSizes.sm,
    color: colors.mutedForeground,
    marginTop: Spacing.md,
  },
  favoritesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  favoriteCard: {
    width: '47%',
    backgroundColor: colors.card,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  favoriteImage: {
    width: '100%',
    height: 100,
  },
  favoriteInfo: {
    padding: Spacing.sm,
  },
  favoriteName: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: Spacing.xs,
  },
  favoriteRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  favoriteRatingText: {
    fontSize: FontSizes.xs,
    color: colors.mutedForeground,
  },
  heartButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: BorderRadius.sm,
    padding: 4,
  },
  settingsSection: {
    marginTop: Spacing.md,
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  settingsItemText: {
    fontSize: FontSizes.sm,
    color: colors.foreground,
    fontWeight: '500',
  },
  logoutItem: {
    marginTop: Spacing.lg,
    borderColor: colors.destructive + '33',
  },
});
