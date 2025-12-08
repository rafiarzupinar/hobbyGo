# Atölye Keşif - Proje Özeti

## Genel Bakış

**Atölye Keşif**, şehirdeki tüm bağımsız hobi atölyelerini (seramik, resim, müzik, dans, el sanatları vb.) tek bir platformda toplayan, kullanıcıların yakınlarındaki etkinlikleri keşfedip kayıt olabildiği bir mobil uygulamadır.

## Teknoloji Stack

| Katman | Teknoloji | Açıklama |
|--------|-----------|----------|
| **Frontend** | React Native + Expo | Cross-platform mobil uygulama |
| **Backend** | Supabase | Auth, Database, Storage, Realtime |
| **Veritabanı** | PostgreSQL (Supabase) | İlişkisel veritabanı |
| **Harita** | react-native-maps | Google Maps entegrasyonu |
| **Navigasyon** | React Navigation v6 | Stack + Bottom Tabs |
| **Bildirimler** | Expo Notifications | Push notifications |
| **Konum** | Expo Location | GPS ve konum servisleri |
| **Görsel Yönetimi** | Supabase Storage | Bulut depolama |

## Proje Özellikleri

### 1. Kullanıcı Özellikleri
- ✅ Email/password ile kayıt ve giriş
- ✅ Profil yönetimi (avatar, bio, iletişim bilgileri)
- ✅ Konum bazlı atölye keşfi
- ✅ 6 kategori desteği (Seramik, Resim, Müzik, Dans, El Sanatları, Fotoğraf)
- ✅ Harita görünümü ile yakındaki atölyeler
- ✅ Takvim görünümü ile etkinlik planlama
- ✅ Etkinlik detay sayfası ve fiyat bilgisi
- ✅ Favori atölyeler sistemi
- ✅ Etkinlik rezervasyonu

### 2. Atölye Sahibi Özellikleri
- Atölye profili oluşturma (isim, açıklama, konum, iletişim)
- Etkinlik oluşturma ve yönetimi
- Fiyatlandırma ve indirim sistemi
- Kapasite kontrolü
- Rezervasyon takibi
- Katılımcı listesi

### 3. Teknik Özellikler
- **Realtime Updates**: Supabase realtime ile etkinlik güncellemeleri
- **Push Notifications**: Yeni etkinlik, rezervasyon onayı, hatırlatıcılar
- **Offline Support**: Temel veriler için offline erişim
- **Image Upload**: Atölye ve etkinlik görselleri
- **Location Services**: GPS ile yakındaki atölyeler
- **Dark Mode**: Modern dark theme tasarım
- **Type Safety**: TypeScript ile tip güvenliği

## Veritabanı Yapısı

### Ana Tablolar (8 Tablo)

1. **users** - Kullanıcı profilleri
   - Supabase Auth ile entegre
   - user_type: 'user' | 'workshop_owner'

2. **categories** - Etkinlik kategorileri
   - 6 öntanımlı kategori
   - İkon ve renk desteği

3. **workshops** - Atölye bilgileri
   - Konum (latitude, longitude)
   - Rating ve review sistemi
   - Owner ilişkisi

4. **events** - Etkinlik ve dersler
   - Tarih, saat, fiyat, kapasite
   - Kategori ve atölye ilişkisi
   - Materyal dahil mi?

5. **event_bookings** - Rezervasyonlar
   - Kullanıcı ve etkinlik ilişkisi
   - Durum: pending, confirmed, cancelled, completed
   - Ödeme durumu

6. **favorites** - Favori atölyeler
   - Kullanıcı-Atölye ilişkisi

7. **notifications** - Bildirimler
   - Tip bazlı bildirimler
   - Okunma durumu

8. **reviews** - Değerlendirmeler
   - 1-5 yıldız rating
   - Yorum desteği

### İlişkiler
```
users ─┬─> workshops (owner_id)
       ├─> event_bookings (user_id)
       ├─> favorites (user_id)
       ├─> notifications (user_id)
       └─> reviews (user_id)

workshops ─┬─> events (workshop_id)
           └─> reviews (workshop_id)

events ─> event_bookings (event_id)

categories ─> events (category_id)
```

## Ekran Yapısı

### Auth Flow
1. **OnboardingScreen** - İlk açılış ekranı
2. **LoginScreen** - Giriş/Kayıt ekranı

### Ana Ekranlar (Bottom Tabs)
1. **HomeScreen** - Ana sayfa
   - Kategoriler (horizontal scroll)
   - Yakındaki atölyeler (harita preview + liste)
   - Yaklaşan etkinlikler

2. **MapScreen** - Harita görünümü
   - Google Maps entegrasyonu
   - Marker'lar ile atölye konumları
   - Filtreleme (tarih, kategori, mesafe)
   - Event preview card

3. **CalendarScreen** - Takvim
   - Aylık takvim görünümü
   - Tarih seçimi
   - Seçili tarihteki etkinlikler

4. **ProfileScreen** - Profil
   - Kullanıcı bilgileri
   - İstatistikler (etkinlik, favori, değerlendirme)
   - Menü (Etkinliklerim, Favoriler, Ayarlar)

### Detay Ekranları
1. **EventDetailScreen** - Etkinlik detayı
   - Hero image
   - Tarih, saat, konum
   - Atölye bilgisi
   - Açıklama ve etiketler
   - Fiyat ve indirim
   - Kayıt ol butonu

2. **WorkshopDetailScreen** - Atölye detayı (Gelecek)
3. **CreateEventScreen** - Etkinlik oluştur (Gelecek)

## API Servisleri

### 1. authService
- signUp, signIn, signOut
- getUserProfile, updateUserProfile
- resetPassword, updatePassword

### 2. eventService
- listEvents, listEventsByLocation, listEventsByCategory
- getEvent, createEvent, updateEvent, deleteEvent
- searchEvents
- registerToEvent, cancelBooking
- getUserBookings
- subscribeToEventUpdates (realtime)

### 3. workshopService
- listWorkshops, getNearbyWorkshops
- getWorkshop, createWorkshop, updateWorkshop
- getWorkshopsByOwner
- searchWorkshops
- getWorkshopReviews, addReview

### 4. storageService
- uploadWorkshopImage, uploadEventImage, uploadAvatar
- pickImage, takePhoto
- deleteImage

## Tasarım Sistemi

### Renk Paleti
```typescript
colors: {
  background: '#000000',    // Siyah arka plan
  foreground: '#ffffff',    // Beyaz yazı
  primary: '#10b981',       // Yeşil (ana renk)
  card: '#111111',          // Koyu gri kartlar
  border: '#262626',        // Border rengi
  muted: '#a1a1aa',         // Soluk yazılar
}
```

### Kategoriler için Gradient Renkler
- Seramik: Purple (#a855f7 → #9333ea)
- Resim: Pink (#ec4899 → #db2777)
- Müzik: Blue (#60a5fa → #3b82f6)
- Dans: Orange (#fb923c → #f97316)
- El Sanatları: Green (#4ade80 → #22c55e)
- Fotoğraf: Yellow (#facc15 → #eab308)

### Tipografi
- **Font Family**: Plus Jakarta Sans
- **Font Sizes**: 12, 14, 16, 18, 20, 24, 30
- **Font Weights**: 400, 500, 600, 700, 800

### Spacing & Border Radius
- **Spacing**: 4, 8, 12, 16, 20, 24, 32, 40
- **Border Radius**: 8, 12, 16, 20, 24

## Potansiyel Büyüme Özellikleri

### Kısa Vadeli (3-6 ay)
1. **Ödeme Sistemi Entegrasyonu**
   - Stripe veya Iyzico ile online ödeme
   - QR kod ile hızlı ödeme
   - Kredi kartı kaydetme

2. **Sosyal Özellikler**
   - Kullanıcı arkadaş sistemi
   - Etkinlik paylaşımı
   - Fotoğraf galerisi
   - Yorumlar ve değerlendirmeler

3. **Gelişmiş Filtreleme**
   - Fiyat aralığı
   - Seviye (başlangıç, orta, ileri)
   - Tarih aralığı
   - Mesafe ayarı

4. **Favoriler ve Koleksiyonlar**
   - Özel koleksiyon oluşturma
   - Favori kategoriler
   - Takip edilen atölyeler

### Orta Vadeli (6-12 ay)
1. **Video İçerik**
   - Atölye tanıtım videoları
   - Etkinlik highlights
   - Eğitmen profil videoları

2. **Mesajlaşma Sistemi**
   - Atölye ile direkt mesajlaşma
   - Soru-cevap bölümü
   - Grup sohbetleri

3. **Abonelik Sistemi**
   - Aylık/yıllık abonelik planları
   - Sınırsız etkinlik erişimi
   - Premium üyelik avantajları

4. **Etkinlik Önerileri (AI)**
   - Kullanıcı geçmişine göre öneri
   - Benzer etkinlikler
   - Trend olan atölyeler

### Uzun Vadeli (12+ ay)
1. **Web Platformu**
   - React web uygulaması
   - Atölye yönetim paneli
   - Admin dashboard

2. **Çoklu Dil Desteği**
   - İngilizce, Almanca, Fransızca
   - Turist odaklı özellikler

3. **B2B Çözümler**
   - Kurumsal etkinlik organizasyonu
   - Toplu rezervasyon
   - Şirket anlaşmaları

4. **Online Atölyeler**
   - Canlı video yayın entegrasyonu
   - Online ders satışı
   - Hibrit etkinlikler

## Gelir Modeli Fikirleri

### 1. Komisyon Modeli
- Her rezervasyondan %10-15 komisyon
- Ödeme sistemi ücreti
- Atölyeler için freemium model

### 2. Abonelik Planları

**Kullanıcılar için:**
- **Ücretsiz**: Temel özellikler
- **Premium** (₺49/ay): Sınırsız rezervasyon, öncelikli destek
- **Gold** (₺99/ay): Premium + indirimler, özel etkinlikler

**Atölyeler için:**
- **Basic** (₺299/ay): 10 etkinlik/ay, temel analitik
- **Pro** (₺599/ay): Sınırsız etkinlik, gelişmiş analitik, öncelik
- **Enterprise** (₺1299/ay): Tüm özellikler, API erişimi, özel destek

### 3. Reklam ve Sponsorluk
- Öne çıkan atölye listelemeleri
- Banner reklamları
- Sponsored etkinlikler
- Email marketing

### 4. Ek Hizmetler
- Fotoğraf çekimi hizmeti
- Profesyonel video prodüksiyon
- Sosyal medya yönetimi
- SEO optimizasyonu

## Deployment Stratejisi

### Faz 1: Beta Test (1-2 ay)
- TestFlight (iOS)
- Google Play Internal Testing (Android)
- Seçilmiş kullanıcılar ve atölyeler
- Feedback toplama ve iyileştirmeler

### Faz 2: Soft Launch (İstanbul)
- App Store ve Google Play yayını
- İstanbul'daki 50-100 atölye ile başla
- Lokal pazarlama kampanyaları
- Influencer işbirlikleri

### Faz 3: Ulusal Yayılım
- Diğer büyük şehirler (Ankara, İzmir, Bursa)
- Ölçeklendirme ve performans optimizasyonu
- Müşteri destek ekibi kurulumu

### Faz 4: Uluslararası Genişleme
- Komşu ülkeler (Yunanistan, Bulgaristan)
- Avrupa pazarı
- Çoklu dil desteği

## Metrikler ve KPI'lar

### Kullanıcı Metrikleri
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- User Retention Rate
- Churn Rate
- Session Duration

### İş Metrikleri
- Toplam Rezervasyon Sayısı
- Rezervasyon Başına Gelir (Revenue per Booking)
- Atölye Başına Ortalama Gelir
- Conversion Rate (Görüntüleme → Rezervasyon)

### Teknik Metrikler
- App Crash Rate
- API Response Time
- Database Query Performance
- Storage Usage

## Güvenlik ve Compliance

### Güvenlik Önlemleri
- Supabase Row Level Security (RLS)
- HTTPS/SSL sertifikası
- API rate limiting
- Input validation
- SQL injection koruması

### Veri Koruma
- KVKK uyumluluğu
- Kullanıcı verilerinin şifrelenmesi
- Güvenli ödeme işlemleri
- Veri yedekleme stratejisi

## Sonuç

**Atölye Keşif** projesi, modern teknolojiler kullanılarak geliştirilmiş, ölçeklenebilir ve kullanıcı dostu bir mobil platformdur. React Native + Expo ve Supabase kombinasyonu sayesinde hızlı geliştirme, düşük maliyet ve yüksek performans sağlar.

Proje, hobi ve sanat atölyelerini dijitalleştirerek hem atölye sahiplerine yeni müşteri kanalı, hem de kullanıcılara kolayca erişilebilir bir keşif platformu sunar.

**Başlangıç Hedefi**: İstanbul'da 100 atölye, 1000 aktif kullanıcı
**6 Aylık Hedef**: 500 atölye, 10.000 aktif kullanıcı, aylık 50.000₺ GMV
**1 Yıllık Hedef**: Tüm Türkiye, 2000+ atölye, 50.000+ kullanıcı, aylık 500.000₺ GMV
