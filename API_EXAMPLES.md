# API Kullanım Örnekleri

Bu dosya, uygulamadaki tüm Supabase API işlemlerinin çalışan örneklerini içerir.

## 1. Authentication (Kimlik Doğrulama)

### Login Fonksiyonu
```typescript
import { authService } from '../services/authService';

async function handleLogin(email: string, password: string) {
  try {
    const { session, user } = await authService.signIn(email, password);
    console.log('Logged in user:', user);
    console.log('Session token:', session.access_token);
    return { session, user };
  } catch (error) {
    console.error('Login error:', error.message);
    throw error;
  }
}

// Kullanım
await handleLogin('user@example.com', 'password123');
```

### Kayıt Olma Fonksiyonu
```typescript
import { authService } from '../services/authService';

async function handleSignUp(email: string, password: string, fullName: string) {
  try {
    const { session, user } = await authService.signUp(email, password, fullName);

    // Kullanıcı profili otomatik oluşturuldu
    const profile = await authService.getUserProfile(user.id);
    console.log('User profile:', profile);

    return { session, user, profile };
  } catch (error) {
    console.error('Signup error:', error.message);
    throw error;
  }
}

// Kullanım
await handleSignUp('newuser@example.com', 'securepass123', 'Ahmet Yılmaz');
```

## 2. Event Operations (Etkinlik İşlemleri)

### Event Oluşturma
```typescript
import { eventService } from '../services/eventService';
import type { Event } from '../types';

async function createNewEvent(workshopId: string, categoryId: string) {
  try {
    const newEvent: Partial<Event> = {
      workshop_id: workshopId,
      category_id: categoryId,
      title: 'Seramik Başlangıç Kursu',
      description: 'Çömlek yapımı temellerini öğreneceğiniz 3 saatlik atölye çalışması',
      start_date: new Date('2024-06-15T14:00:00').toISOString(),
      end_date: new Date('2024-06-15T17:00:00').toISOString(),
      price: 450,
      original_price: 600,
      capacity: 15,
      level: 'beginner',
      materials_included: true,
      is_active: true,
    };

    const event = await eventService.createEvent(newEvent);
    console.log('Created event:', event);
    return event;
  } catch (error) {
    console.error('Error creating event:', error.message);
    throw error;
  }
}
```

### Etkinlikleri Listeleme
```typescript
import { eventService } from '../services/eventService';

async function loadEvents() {
  try {
    // Tüm etkinlikler
    const allEvents = await eventService.listEvents(20);
    console.log('All events:', allEvents);

    // Kategoriye göre
    const ceramicEvents = await eventService.listEventsByCategory('category-id', 10);
    console.log('Ceramic events:', ceramicEvents);

    return allEvents;
  } catch (error) {
    console.error('Error loading events:', error.message);
    throw error;
  }
}
```

### Konum Bazlı Etkinlik Arama
```typescript
import { eventService } from '../services/eventService';
import * as Location from 'expo-location';

async function findNearbyEvents() {
  try {
    // Kullanıcının konumunu al
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Location permission denied');
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    // 10km yarıçapındaki etkinlikler
    const nearbyEvents = await eventService.listEventsByLocation(
      latitude,
      longitude,
      10,
      20
    );

    console.log(`Found ${nearbyEvents.length} events nearby`);
    return nearbyEvents;
  } catch (error) {
    console.error('Error finding nearby events:', error.message);
    throw error;
  }
}
```

### Etkinliğe Kayıt Olma
```typescript
import { eventService } from '../services/eventService';
import { supabase } from '../services/supabase';

async function registerForEvent(eventId: string, numParticipants: number = 1) {
  try {
    // Kullanıcı ID'sini al
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Rezervasyon oluştur
    const booking = await eventService.registerToEvent(
      eventId,
      user.id,
      numParticipants
    );

    console.log('Booking created:', booking);
    console.log('Total price:', booking.total_price);

    return booking;
  } catch (error) {
    console.error('Registration error:', error.message);
    throw error;
  }
}
```

## 3. Image Upload (Görsel Yükleme)

### Etkinlik Görseli Yükleme
```typescript
import { storageService } from '../services/storageService';

async function uploadEventImage(eventId: string) {
  try {
    // Kullanıcıdan fotoğraf seç
    const imageUri = await storageService.pickImage();
    if (!imageUri) {
      console.log('No image selected');
      return null;
    }

    // Supabase Storage'a yükle
    const imageUrl = await storageService.uploadEventImage(eventId, imageUri);
    console.log('Image uploaded:', imageUrl);

    // Event'i güncelle
    await eventService.updateEvent(eventId, { image_url: imageUrl });

    return imageUrl;
  } catch (error) {
    console.error('Upload error:', error.message);
    throw error;
  }
}
```

### Kamera ile Fotoğraf Çekme
```typescript
import { storageService } from '../services/storageService';
import { authService } from '../services/authService';

async function takeAndUploadAvatar() {
  try {
    // Kamera ile fotoğraf çek
    const photoUri = await storageService.takePhoto();
    if (!photoUri) {
      console.log('No photo taken');
      return null;
    }

    // Avatar olarak yükle
    const avatarUrl = await storageService.uploadAvatar(photoUri);

    // Kullanıcı profilini güncelle
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await authService.updateUserProfile(user.id, { avatar_url: avatarUrl });
    }

    return avatarUrl;
  } catch (error) {
    console.error('Photo error:', error.message);
    throw error;
  }
}
```

## 4. Realtime Subscription (Canlı Güncelleme)

### Etkinlik Güncellemelerini Dinleme
```typescript
import { eventService } from '../services/eventService';
import { useEffect, useState } from 'react';

function EventDetailComponent({ eventId }: { eventId: string }) {
  const [event, setEvent] = useState(null);

  useEffect(() => {
    // İlk veriyi yükle
    eventService.getEvent(eventId).then(setEvent);

    // Realtime güncellemeleri dinle
    const subscription = eventService.subscribeToEventUpdates(
      eventId,
      (updatedEvent) => {
        console.log('Event updated in realtime:', updatedEvent);
        setEvent(updatedEvent);
      }
    );

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, [eventId]);

  return event;
}
```

### Tüm Etkinlikler için Realtime
```typescript
import { supabase } from '../services/supabase';
import { Event } from '../types';

function useRealtimeEvents() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // İlk veriyi yükle
    loadEvents();

    // Realtime kanal oluştur
    const channel = supabase
      .channel('public:events')
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'events',
        },
        (payload) => {
          console.log('Change received:', payload);

          if (payload.eventType === 'INSERT') {
            setEvents((prev) => [...prev, payload.new as Event]);
          } else if (payload.eventType === 'UPDATE') {
            setEvents((prev) =>
              prev.map((e) => (e.id === payload.new.id ? payload.new as Event : e))
            );
          } else if (payload.eventType === 'DELETE') {
            setEvents((prev) => prev.filter((e) => e.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return events;
}

async function loadEvents() {
  const { data } = await supabase
    .from('events')
    .select('*')
    .eq('is_active', true);
  setEvents(data || []);
}
```

## 5. Complete Screen Example

### HomeScreen ile Tam Entegrasyon
```typescript
import React, { useEffect, useState } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { eventService } from '../services/eventService';
import { workshopService } from '../services/workshopService';
import { EventCard } from '../components/events/EventCard';

export default function HomeScreen() {
  const [events, setEvents] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      // Paralel veri yükleme
      const [eventsData, workshopsData] = await Promise.all([
        eventService.listEvents(10),
        workshopService.listWorkshops(5),
      ]);

      setEvents(eventsData);
      setWorkshops(workshopsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onPress={() => navigation.navigate('EventDetail', { eventId: event.id })}
        />
      ))}
    </ScrollView>
  );
}
```

## 6. Error Handling (Hata Yönetimi)

### Try-Catch ile Hata Yakalama
```typescript
import { eventService } from '../services/eventService';

async function safeRegisterToEvent(eventId: string, userId: string) {
  try {
    const booking = await eventService.registerToEvent(eventId, userId, 1);

    // Başarılı - kullanıcıya bildirim göster
    Alert.alert('Başarılı', 'Etkinliğe kaydınız oluşturuldu!');
    return booking;

  } catch (error: any) {
    // Hata türüne göre kullanıcı dostu mesaj
    if (error.message.includes('Not enough spots')) {
      Alert.alert('Üzgünüz', 'Etkinlikte yeterli yer yok.');
    } else if (error.message.includes('already registered')) {
      Alert.alert('Bilgi', 'Bu etkinliğe zaten kayıtlısınız.');
    } else {
      Alert.alert('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    }

    console.error('Registration error:', error);
    throw error;
  }
}
```

## 7. Advanced Queries (Gelişmiş Sorgular)

### Filtreleme ve Sıralama
```typescript
import { supabase } from '../services/supabase';

async function searchEventsAdvanced(
  searchTerm: string,
  categoryId?: string,
  minPrice?: number,
  maxPrice?: number
) {
  let query = supabase
    .from('events')
    .select(`
      *,
      workshop:workshops(*),
      category:categories(*)
    `)
    .eq('is_active', true)
    .gte('start_date', new Date().toISOString());

  // Arama terimi
  if (searchTerm) {
    query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
  }

  // Kategori filtresi
  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  // Fiyat aralığı
  if (minPrice !== undefined) {
    query = query.gte('price', minPrice);
  }
  if (maxPrice !== undefined) {
    query = query.lte('price', maxPrice);
  }

  // Sıralama
  query = query.order('start_date', { ascending: true });

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

// Kullanım
const events = await searchEventsAdvanced('seramik', undefined, 100, 500);
```

## 8. Pagination (Sayfalama)

### Infinite Scroll İçin Sayfalama
```typescript
import { useState } from 'react';
import { eventService } from '../services/eventService';

function useInfiniteEvents() {
  const [events, setEvents] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 20;

  async function loadMore() {
    if (!hasMore) return;

    try {
      const newEvents = await eventService.listEvents(LIMIT, offset);

      if (newEvents.length < LIMIT) {
        setHasMore(false);
      }

      setEvents((prev) => [...prev, ...newEvents]);
      setOffset((prev) => prev + LIMIT);
    } catch (error) {
      console.error('Error loading more events:', error);
    }
  }

  return { events, loadMore, hasMore };
}
```
