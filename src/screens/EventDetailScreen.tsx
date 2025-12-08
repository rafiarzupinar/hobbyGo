import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../utils/theme';
import { Button } from '../components/common/Button';

export default function EventDetailScreen({ route, navigation }: any) {
  const { eventId } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: 'https://picsum.photos/seed/event-detail/430/400' }}
            style={styles.heroImage}
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.foreground} />
          </TouchableOpacity>
          <View style={styles.heroActions}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="share" size={20} color={theme.colors.foreground} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="heart" size={20} color={theme.colors.primary.DEFAULT} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Seramik Atölyesi: Çömlek Yapımı</Text>

          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={20} color={theme.colors.primary.DEFAULT} />
            <Text style={styles.infoText}>15 Haziran 2024, Cumartesi</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time" size={20} color={theme.colors.primary.DEFAULT} />
            <Text style={styles.infoText}>14:00 - 17:00</Text>
          </View>

          {/* Workshop Info */}
          <View style={styles.workshopCard}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?img=25' }}
              style={styles.workshopAvatar}
            />
            <View style={styles.workshopInfo}>
              <Text style={styles.workshopName}>Sanat Atölyesi</Text>
              <Text style={styles.workshopLabel}>Atölye Sahibi</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.muted.foreground} />
          </View>

          {/* Participants */}
          <View style={styles.participantsContainer}>
            <View style={styles.participantBox}>
              <Ionicons name="people" size={20} color={theme.colors.primary.DEFAULT} />
              <View>
                <Text style={styles.participantLabel}>Katılımcı</Text>
                <Text style={styles.participantValue}>12/15 Kişi</Text>
              </View>
            </View>
            <View style={styles.spotsLeft}>
              <Text style={styles.spotsLeftText}>3 Kişi Kaldı</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Açıklama</Text>
            <Text style={styles.description}>
              Geleneksel çömlek yapımı tekniklerini öğreneceğiniz bu atölyede, kendi seramik
              eserinizi oluşturacaksınız. Çamur hazırlama, şekillendirme ve dekorasyon
              süreçlerini deneyimleyeceksiniz. Tüm malzemeler dahildir.
            </Text>
          </View>

          {/* Tags */}
          <View style={styles.tags}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Sanat</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>El Sanatları</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Seramik</Text>
            </View>
          </View>

          {/* Location */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Konum</Text>
            <View style={styles.locationCard}>
              <Image
                source={{ uri: 'https://picsum.photos/seed/map-location/430/200' }}
                style={styles.mapImage}
              />
              <View style={styles.locationInfo}>
                <Ionicons name="location" size={20} color={theme.colors.primary.DEFAULT} />
                <View style={styles.locationText}>
                  <Text style={styles.locationName}>Sanat Atölyesi</Text>
                  <Text style={styles.locationAddress}>
                    Kadıköy, İstanbul - Moda Cad. No:45
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Price */}
          <View style={styles.priceCard}>
            <View>
              <Text style={styles.priceLabel}>Etkinlik Ücreti</Text>
              <Text style={styles.price}>₺450</Text>
              <Text style={styles.priceUnit}>Kişi başı</Text>
            </View>
            <View style={styles.discountInfo}>
              <Text style={styles.originalPrice}>₺600</Text>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>%25 İndirim</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomAction}>
        <Button
          title="Kayıt Ol"
          onPress={() => console.log('Register')}
          variant="primary"
          size="lg"
          icon={<Ionicons name="ticket" size={20} color="#fff" />}
        />
      </View>
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
  heroContainer: {
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: 400,
    backgroundColor: theme.colors.muted.DEFAULT,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroActions: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: theme.spacing['2xl'],
    gap: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.foreground,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  infoText: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.foreground,
  },
  workshopCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.card.DEFAULT,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius['2xl'],
    padding: theme.spacing.lg,
  },
  workshopAvatar: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
  },
  workshopInfo: {
    flex: 1,
  },
  workshopName: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.foreground,
  },
  workshopLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.muted.foreground,
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  participantBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.muted.DEFAULT,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
  },
  participantLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.muted.foreground,
  },
  participantValue: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.foreground,
  },
  spotsLeft: {
    backgroundColor: `${theme.colors.primary.DEFAULT}20`,
    borderRadius: theme.borderRadius.xl,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  spotsLeftText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.primary.DEFAULT,
  },
  section: {
    gap: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.foreground,
  },
  description: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.muted.foreground,
    lineHeight: 22,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  tag: {
    backgroundColor: `${theme.colors.primary.DEFAULT}20`,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  tagText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.primary.DEFAULT,
  },
  locationCard: {
    backgroundColor: theme.colors.card.DEFAULT,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius['2xl'],
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: 200,
    backgroundColor: theme.colors.muted.DEFAULT,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
  },
  locationText: {
    flex: 1,
  },
  locationName: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.foreground,
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.muted.foreground,
  },
  priceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: `${theme.colors.primary.DEFAULT}10`,
    borderWidth: 1,
    borderColor: `${theme.colors.primary.DEFAULT}30`,
    borderRadius: theme.borderRadius['2xl'],
    padding: theme.spacing.xl,
  },
  priceLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.muted.foreground,
    marginBottom: 4,
  },
  price: {
    fontSize: 30,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary.DEFAULT,
  },
  priceUnit: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.muted.foreground,
    marginTop: 4,
  },
  discountInfo: {
    alignItems: 'flex-end',
  },
  originalPrice: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.muted.foreground,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: theme.colors.primary.DEFAULT,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    marginTop: 4,
  },
  discountText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: '#fff',
  },
  bottomAction: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
});
