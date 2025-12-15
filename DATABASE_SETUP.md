# Veritabanı Kurulumu

Bu dosya, Supabase veritabanını kategoriler ve etkinliklerle doldurmak için gerekli adımları açıklar.

## Adım 1: Kategorileri ve Alt Kategorileri Ekle

Supabase SQL Editor'da şu dosyayı çalıştır:

```
FULL_CATEGORY_RESTRUCTURE.sql
```

Bu SQL:
- 11 ana kategori oluşturur/günceller
- 135+ alt kategori ekler
- Mevcut alt kategorileri temizler ve yeniden oluşturur

## Adım 2: Etkinlikleri Ekle

Supabase SQL Editor'da şu dosyayı çalıştır:

```
ADD_EVENTS_FINAL.sql
```

Bu SQL:
- Eğer yoksa bir workshop oluşturur
- Mevcut etkinlikleri temizler
- Her alt kategori için 2 etkinlik ekler (Başlangıç + İleri Seviye)
- Toplam 270+ etkinlik oluşturur
- Tüm etkinlikler gelecek tarihlerde olacak şekilde ayarlanır

## Kategoriler

1. **Sanat & El Sanatları** - 24 alt kategori
2. **Deneyim & Öğrenme** - 15 alt kategori
3. **Aile & Çocuk** - 13 alt kategori
4. **Doğa & Outdoor** - 10 alt kategori
5. **Kişisel Gelişim & Sağlık** - 10 alt kategori
6. **Performans & Sahne** - 8 alt kategori
7. **Teknoloji & Dijital** - 5 alt kategori
8. **Moda & Giyim** - 7 alt kategori
9. **El İşi & Zanaat** - 7 alt kategori
10. **Kültürel & Geleneksel** - 8 alt kategori
11. **Eğlenceli & Sosyal** - 7 alt kategori

## Notlar

- Her etkinlik 3 gün ve 10 gün sonrası için oluşturulur
- Görseller Unsplash'ten otomatik seçilir
- Fiyatlar kategori türüne göre ayarlanır (150-550 TL)
- Tüm etkinlikler aktif ve görünür durumdadır
