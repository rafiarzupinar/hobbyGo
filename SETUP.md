# Atölye Keşif - Kurulum Rehberi

## Proje Yapısı

Proje, HTML tasarımlarına göre oluşturulmuş ekranlar ve Supabase backend ile çalışan tam özellikli bir React Native + Expo uygulamasıdır.

### Yeni Eklenen Dosyalar

```
src/
├── components/
│   ├── common/          # Button, CategoryCard
│   ├── events/          # EventCard
│   └── workshops/       # WorkshopCard
├── screens/             # Tüm ekranlar (Home, Map, Calendar, vb.)
├── navigation/          # AppNavigator, BottomTabNavigator
├── services/            # Supabase servis katmanı
│   ├── supabase.ts
│   ├── authService.ts
│   ├── eventService.ts
│   ├── workshopService.ts
│   └── storageService.ts
├── utils/
│   └── theme.ts        # HTML tasarımından alınan dark theme
└── types/
    └── index.ts        # TypeScript tipleri
```

## Kurulum

### 1. Bağımlılıkları Yükle

```bash
npm install
```

### 2. Eksik Paketler Eklendi

Yeni eklenen paketler:
- `date-fns` - Tarih formatlama
- `expo-image-picker` - Fotoğraf seçme
- `expo-linear-gradient` - Gradient efektler
- `expo-location` - Konum servisleri
- `react-native-calendars` - Takvim komponenti
- `react-native-maps` - Harita entegrasyonu

### 3. Supabase Kurulumu

`.env` dosyanızda zaten Supabase bilgileriniz var. Veritabanı şemasını kurmak için:

```bash
# Supabase Dashboard'da SQL Editor'ı açın
# SUPABASE_SCHEMA.md dosyasındaki SQL kodlarını çalıştırın
```

### 4. Uygulamayı Başlat

```bash
npm start
```

## Kullanılan Ekranlar

### HTML Tasarımlarından Aktarılanlar:

1. **HomeScreen** (`src/screens/HomeScreen.tsx`)
   - `AtölyeKeşf/ana-sayfa.html` → React Native
   - Kategoriler, yakındaki atölyeler, etkinlikler

2. **MapScreen** (`src/screens/MapScreen.tsx`)
   - `AtölyeKeşf/harita.html` → React Native
   - Google Maps, marker'lar, filtreleme

3. **EventDetailScreen** (`src/screens/EventDetailScreen.tsx`)
   - `AtölyeKeşf/etkinlik-detayı.html` → React Native
   - Tam detay sayfası, kayıt butonu

4. **CalendarScreen** (`src/screens/CalendarScreen.tsx`)
   - Takvim görünümü + etkinlik listesi

5. **ProfileScreen** (`src/screens/ProfileScreen.tsx`)
   - Kullanıcı profili, istatistikler, menü

6. **LoginScreen** & **OnboardingScreen**
   - Auth flow ekranları

## Tema

HTML tasarımındaki dark theme birebir aktarıldı:

```typescript
colors: {
  background: '#000000',
  primary: '#10b981',    // Yeşil
  card: '#111111',
  border: '#262626',
  foreground: '#ffffff',
}
```

## API Servisleri

Tüm Supabase işlemleri için hazır servisler:

```typescript
// Auth
import { authService } from './services/authService';
await authService.signIn(email, password);

// Events
import { eventService } from './services/eventService';
const events = await eventService.listEvents();

// Storage
import { storageService } from './services/storageService';
const imageUrl = await storageService.uploadEventImage(eventId, uri);
```

## Dokümantasyon

- **SUPABASE_SCHEMA.md** - Tam veritabanı şeması
- **API_EXAMPLES.md** - Tüm API kullanım örnekleri
- **PROJECT_SUMMARY.md** - Proje özeti ve gelir modeli
- **project.md** - Orijinal proje planı

## Sonraki Adımlar

1. ✅ Paketleri yükle: `npm install`
2. ✅ Supabase şemasını oluştur
3. ✅ Uygulamayı çalıştır: `npm start`
4. 🔄 Navigasyonu mevcut Expo Router yapısına entegre et
5. 🔄 Mevcut auth sistemini güncelle

## Notlar

- Tüm ekranlar HTML tasarımına sadık kalınarak oluşturuldu
- Dark mode tema kullanılıyor
- TypeScript tip güvenliği mevcut
- Supabase realtime desteği hazır
- Bottom tab navigasyon yapısı kurulu
