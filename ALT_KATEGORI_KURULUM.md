# Alt Kategori ve Etkinlik Yapısını Kurma Kılavuzu

## Sorun
Alt kategorilerde etkinlikler gözükmüyordu çünkü:
1. **subcategories** tablosu yoktu
2. **events** tablosunda **subcategory_id** kolonu yoktu
3. Etkinlikler alt kategorilere bağlı değildi

## Çözüm
Bu sorunları düzeltmek için aşağıdaki adımları takip edin:

---

## Adım 1: Veritabanı Yapısını Düzelt

Supabase SQL Editor'a gidin ve **COMPLETE_DATABASE_FIX.sql** dosyasını çalıştırın:

```bash
# Dosya yolu: hobby-main/COMPLETE_DATABASE_FIX.sql
```

Bu SQL dosyası şunları yapacak:
- ✅ **subcategories** tablosunu oluşturacak
- ✅ **events** tablosuna **subcategory_id** kolonu ekleyecek
- ✅ Tüm kategorileri ve 120+ alt kategoriyi ekleyecek
- ✅ Gerekli index'leri ve policy'leri kuracak

---

## Adım 2: Etkinlikleri Alt Kategorilere Bağla

**COMPLETE_DATABASE_FIX.sql** çalıştırıldıktan sonra, **ADD_EVENTS_FINAL.sql** dosyasını çalıştırın:

```bash
# Dosya yolu: hobby-main/ADD_EVENTS_FINAL.sql
```

Bu SQL dosyası:
- ✅ Her alt kategori için 2 etkinlik oluşturacak (Başlangıç + İleri Seviye)
- ✅ Toplam 240+ etkinlik ekleyecek
- ✅ Tüm etkinlikleri doğru alt kategorilere bağlayacak
- ✅ Uygun resimler, fiyatlar ve tarihler atayacak

---

## Adım 3: Kontrol Edin

SQL çalıştırıldıktan sonra kontrol sorguları:

### Alt kategorileri kontrol et
```sql
SELECT
  c.name as kategori,
  COUNT(s.id) as alt_kategori_sayisi
FROM categories c
LEFT JOIN subcategories s ON s.category_id = c.id
GROUP BY c.id, c.name
ORDER BY c.name;
```

### Etkinlikleri kontrol et
```sql
SELECT
  c.name as kategori,
  s.name as alt_kategori,
  COUNT(e.id) as etkinlik_sayisi
FROM subcategories s
LEFT JOIN categories c ON c.id = s.category_id
LEFT JOIN events e ON e.subcategory_id = s.id
GROUP BY c.name, s.name
ORDER BY c.name, s.name;
```

### Alt kategoriye göre etkinlik listele
```sql
SELECT
  s.name as alt_kategori,
  e.title as etkinlik_adi,
  e.price as fiyat,
  e.start_date as tarih
FROM events e
JOIN subcategories s ON s.id = e.subcategory_id
WHERE s.slug = 'seramik-comlek'
ORDER BY e.start_date;
```

---

## Kategori ve Alt Kategori Yapısı

### Ana Kategoriler (11 adet)
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

**Toplam:** 114 alt kategori

---

## API Kullanımı

### Alt kategorileri kategoriye göre getir
```typescript
const { data: subcategories } = await supabase
  .from('subcategories')
  .select('*')
  .eq('category_id', categoryId);
```

### Alt kategorideki etkinlikleri getir
```typescript
const { data: events } = await supabase
  .from('events')
  .select(`
    *,
    workshop:workshops(*),
    category:categories(*),
    subcategory:subcategories(*)
  `)
  .eq('subcategory_id', subcategoryId)
  .eq('is_active', true);
```

### Kategoriye göre alt kategori ve etkinlik sayılarını getir
```typescript
const { data: categories } = await supabase
  .from('categories')
  .select(`
    *,
    subcategories:subcategories(
      id,
      name,
      slug,
      events:events(count)
    )
  `);
```

---

## Önemli Notlar

1. **Sıralama:** SQL dosyalarını sırasıyla çalıştırın:
   - Önce `COMPLETE_DATABASE_FIX.sql`
   - Sonra `ADD_EVENTS_FINAL.sql`

2. **Veri Kaybı:** `ADD_EVENTS_FINAL.sql` eski etkinlikleri siler! Eğer mevcut etkinliklerinizi korumak istiyorsanız, önce yedek alın.

3. **Workshop Gereksinimi:** Etkinlik oluşturmak için en az bir workshop gereklidir. SQL dosyası yoksa otomatik olarak "Merkez Atölye" adında bir workshop oluşturur.

4. **Owner ID:** Gerçek kullanıma geçmeden önce, workshop'ların `owner_id` değerlerini gerçek kullanıcı ID'leri ile güncelleyin.

---

## Sorun Giderme

### "subcategories tablosu bulunamadı" hatası
**Çözüm:** `COMPLETE_DATABASE_FIX.sql` dosyasını çalıştırın.

### "column subcategory_id does not exist" hatası
**Çözüm:** `COMPLETE_DATABASE_FIX.sql` dosyasını tekrar çalıştırın. Dosya güvenli olarak kolon ekler (IF NOT EXISTS kontrolü var).

### Etkinlikler gözükmüyor
**Çözüm:**
1. Alt kategorilerin var olduğunu kontrol edin: `SELECT COUNT(*) FROM subcategories;`
2. Etkinliklerin subcategory_id değerlerinin dolu olduğunu kontrol edin: `SELECT COUNT(*) FROM events WHERE subcategory_id IS NOT NULL;`

---

## İletişim

Sorun yaşarsanız veya yardıma ihtiyacınız olursa, DATABASE_SETUP.md dosyasına bakın veya Supabase loglarını kontrol edin.
