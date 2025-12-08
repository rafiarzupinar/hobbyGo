Aşağıdaki teknolojilere göre bir proje tasarlamanı istiyorum:

- **Frontend:** React Native + Expo
- **Backend:** Supabase (Auth, Database, Storage)
- **Platform:** iOS + Android
- **Gerçek Zamanlılık:** Supabase real-time stream

Proje adı: **Ortak Hobi Atölyeleri Takvimi**

Bu proje; şehirdeki seramik, cam, resim, ahşap, yoga, dans, müzik, dil kursu gibi tüm bağımsız atölyeleri tek bir takvim ve harita görünümünde listeleyen bir uygulamadır. Kullanıcılar yakınlarındaki etkinliklere kayıt olur, atölyeler kendi etkinliklerini ekler.

Aşağıdaki başlıklara göre **tam bir proje planı** oluştur:

---

## **1. Özellik Listesi**

- Kullanıcı kayıt/login (Supabase Auth)
- Konuma göre etkinlik listeleme
- Kategori filtreleme
- Harita görünümü (Expo + react-native-maps)
- Takvim görünümü
- Etkinlik detay sayfası
- Etkinliğe kayıt olma (Supabase DB insert)
- Atölye sahibinin etkinlik oluşturabilmesi
- Supabase Storage’a görsel yükleme
- Favori atölyeler
- Bildirim sistemi (Expo Notifications)

---

## **2. Supabase Veri Tabanı Şeması**

Aşağıdaki tabloların tüm kolonlarını detaylı şekilde üret:

- **users**
- **workshops**
- **events**
- **event_bookings**
- **categories**
- **favorites**
- **notifications**

Tüm tablo kolonlarında:
`id, created_at, updated_at, user_id, title, description, location(lat,long), price, capacity, image_url` gibi uygun alanları sen belirle.

---

## **3. Expo + React Native Ekranları**

Her ekran için UI/UX açıklaması ve komponent listesi ver:

1. Onboarding
2. Login / Register
3. Ana Menü (kategoriler + popüler atölyeler)
4. Harita ekranı
5. Takvim ekranı
6. Etkinlik detay ekranı
7. Atölye profil ekranı
8. Etkinlik oluştur ekranı
9. Kullanıcı profil ekranı

---

## **4. Supabase API İşlemleri**

Her özellik için gerekli Supabase fonksiyonlarını ve SQL işlemlerini yaz:

- createEvent()
- listEvents()
- listEventsByLocation()
- registerToEvent()
- uploadImageToStorage()
- getWorkshopsByUser()
- createWorkshop()

Supabase realtime ile etkinlik değişikliklerinin canlı güncellenmesini açıklayın.

---

## **5. Proje Dosya Yapısı**

React Native + Expo için uygun modern dosya yapısını üret:

```
/src
  /components
  /screens
  /hooks
  /services
  /contexts
  /utils
  /types
```

---

## **6. Task List (Yol Haritası)**

Aşağıdaki aşamalara göre maddeler halinde bir görev listesi çıkar:

### Aşama 1 – Auth + Temel Setup

### Aşama 2 – Kullanıcı Tarafı Ekranlar

### Aşama 3 – Atölye Sahibi Paneli

### Aşama 4 – Harita & Takvim

### Aşama 5 – Storage + Görsel Yükleme

### Aşama 6 – Realtime & Bildirimler

### Aşama 7 – Test & Publish (Expo EAS)

Her aşamada yapılacak maddeleri tek tek yaz.

---

## **7. Kod Örnekleri**

React Native + Expo + Supabase için:

- Login fonksiyonu
- Event oluşturma fonksiyonu
- Image upload örneği
- Realtime subscription kodu

Bu dört örneği tam ve çalışır şekilde üret.

---

## **8. Sonuç**

En sonda bana:

- Proje özeti
- Potansiyel büyüme özellikleri
- Gelir modeli fikirleri

çıkar.
