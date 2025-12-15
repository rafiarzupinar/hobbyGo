-- =====================================================
-- VERİTABANI YAPISINI YENİ KATEGORİ YAPISINA GÖRE DÜZENLE
-- 10 Ana Kategori + 101 Alt Kategori
-- =====================================================

-- 1. SUBCATEGORIES TABLOSUNU OLUŞTUR
CREATE TABLE IF NOT EXISTS subcategories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_category_subcategory UNIQUE(category_id, slug)
);

-- Enable RLS
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;

-- Public read access (drop if exists to avoid errors)
DROP POLICY IF EXISTS "Subcategories are viewable by everyone" ON subcategories;
CREATE POLICY "Subcategories are viewable by everyone"
  ON subcategories FOR SELECT USING (true);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_subcategories_category ON subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_subcategories_slug ON subcategories(slug);

-- 2. EVENTS TABLOSUNA SUBCATEGORY_ID KOLONU EKLE (eğer yoksa)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'subcategory_id'
  ) THEN
    ALTER TABLE events
    ADD COLUMN subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL;

    -- Index ekle
    CREATE INDEX idx_events_subcategory ON events(subcategory_id);

    RAISE NOTICE 'subcategory_id kolonu events tablosuna eklendi';
  ELSE
    RAISE NOTICE 'subcategory_id kolonu zaten mevcut';
  END IF;
END $$;

-- 3. ESKİ KATEGORİLERİ SİL VE YENİ KATEGORİ YAPISINI OLUŞTUR
DO $$
DECLARE
  -- Kategori ID'leri
  v_sanat_id UUID;
  v_zanaat_id UUID;
  v_deneyim_id UUID;
  v_aile_id UUID;
  v_saglik_id UUID;
  v_sahne_id UUID;
  v_dijital_id UUID;
  v_doga_id UUID;
  v_turist_id UUID;
  v_sosyal_id UUID;
BEGIN
  -- Eski kategorileri temizle
  DELETE FROM categories WHERE slug NOT IN (
    'sanat-el-sanatlari',
    'zanaat-tasarim',
    'deneyim-atolye',
    'aile-cocuk',
    'saglik-wellness-hareket',
    'sahne-performans',
    'dijital-teknoloji',
    'doga-outdoor',
    'turist-deneyimleri',
    'sosyal-eglence'
  );

  -- 1. SANAT & EL SANATLARI
  INSERT INTO categories (name, slug, icon, color, description)
  VALUES ('Sanat & El Sanatları', 'sanat-el-sanatlari', 'color-palette-outline', '#ef4444', 'Üretim, yaratıcılık, geleneksel-modern sanatlar')
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    icon = EXCLUDED.icon,
    color = EXCLUDED.color,
    description = EXCLUDED.description
  RETURNING id INTO v_sanat_id;

  IF v_sanat_id IS NULL THEN
    SELECT id INTO v_sanat_id FROM categories WHERE slug = 'sanat-el-sanatlari';
  END IF;

  -- 2. ZANAAT & TASARIM
  INSERT INTO categories (name, slug, icon, color, description)
  VALUES ('Zanaat & Tasarım', 'zanaat-tasarim', 'hammer-outline', '#f97316', 'El becerisi + fonksiyonel ürün')
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    icon = EXCLUDED.icon,
    color = EXCLUDED.color,
    description = EXCLUDED.description
  RETURNING id INTO v_zanaat_id;

  IF v_zanaat_id IS NULL THEN
    SELECT id INTO v_zanaat_id FROM categories WHERE slug = 'zanaat-tasarim';
  END IF;

  -- 3. DENEYİM & ATÖLYE WORKSHOPLARI
  INSERT INTO categories (name, slug, icon, color, description)
  VALUES ('Deneyim & Atölye', 'deneyim-atolye', 'flask-outline', '#eab308', 'Kısa sürede keyif + sosyal deneyim')
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    icon = EXCLUDED.icon,
    color = EXCLUDED.color,
    description = EXCLUDED.description
  RETURNING id INTO v_deneyim_id;

  IF v_deneyim_id IS NULL THEN
    SELECT id INTO v_deneyim_id FROM categories WHERE slug = 'deneyim-atolye';
  END IF;

  -- 4. AİLE & ÇOCUK
  INSERT INTO categories (name, slug, icon, color, description)
  VALUES ('Aile & Çocuk', 'aile-cocuk', 'people-outline', '#84cc16', 'Aile katılımlı, çocuk sanat ve eğitim')
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    icon = EXCLUDED.icon,
    color = EXCLUDED.color,
    description = EXCLUDED.description
  RETURNING id INTO v_aile_id;

  IF v_aile_id IS NULL THEN
    SELECT id INTO v_aile_id FROM categories WHERE slug = 'aile-cocuk';
  END IF;

  -- 5. SAĞLIK, WELLNESS & HAREKET
  INSERT INTO categories (name, slug, icon, color, description)
  VALUES ('Sağlık, Wellness & Hareket', 'saglik-wellness-hareket', 'fitness-outline', '#22c55e', 'Zihin–beden dengesi')
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    icon = EXCLUDED.icon,
    color = EXCLUDED.color,
    description = EXCLUDED.description
  RETURNING id INTO v_saglik_id;

  IF v_saglik_id IS NULL THEN
    SELECT id INTO v_saglik_id FROM categories WHERE slug = 'saglik-wellness-hareket';
  END IF;

  -- 6. SAHNE & PERFORMANS SANATLARI
  INSERT INTO categories (name, slug, icon, color, description)
  VALUES ('Sahne & Performans Sanatları', 'sahne-performans', 'mic-outline', '#06b6d4', 'İfade, sahne, müzik')
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    icon = EXCLUDED.icon,
    color = EXCLUDED.color,
    description = EXCLUDED.description
  RETURNING id INTO v_sahne_id;

  IF v_sahne_id IS NULL THEN
    SELECT id INTO v_sahne_id FROM categories WHERE slug = 'sahne-performans';
  END IF;

  -- 7. DİJİTAL & TEKNOLOJİ
  INSERT INTO categories (name, slug, icon, color, description)
  VALUES ('Dijital & Teknoloji', 'dijital-teknoloji', 'code-slash-outline', '#3b82f6', 'Üretken dijital beceriler')
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    icon = EXCLUDED.icon,
    color = EXCLUDED.color,
    description = EXCLUDED.description
  RETURNING id INTO v_dijital_id;

  IF v_dijital_id IS NULL THEN
    SELECT id INTO v_dijital_id FROM categories WHERE slug = 'dijital-teknoloji';
  END IF;

  -- 8. DOĞA & OUTDOOR DENEYİMLER
  INSERT INTO categories (name, slug, icon, color, description)
  VALUES ('Doğa & Outdoor', 'doga-outdoor', 'leaf-outline', '#8b5cf6', 'Şehir dışı – hareketli')
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    icon = EXCLUDED.icon,
    color = EXCLUDED.color,
    description = EXCLUDED.description
  RETURNING id INTO v_doga_id;

  IF v_doga_id IS NULL THEN
    SELECT id INTO v_doga_id FROM categories WHERE slug = 'doga-outdoor';
  END IF;

  -- 9. TURİST DENEYİMLERİ (ENGLISH FRIENDLY)
  INSERT INTO categories (name, slug, icon, color, description)
  VALUES ('Turist Deneyimleri', 'turist-deneyimleri', 'globe-outline', '#ec4899', 'Kısa, otantik, kültürel')
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    icon = EXCLUDED.icon,
    color = EXCLUDED.color,
    description = EXCLUDED.description
  RETURNING id INTO v_turist_id;

  IF v_turist_id IS NULL THEN
    SELECT id INTO v_turist_id FROM categories WHERE slug = 'turist-deneyimleri';
  END IF;

  -- 10. SOSYAL & EĞLENCE
  INSERT INTO categories (name, slug, icon, color, description)
  VALUES ('Sosyal & Eğlence', 'sosyal-eglence', 'happy-outline', '#f59e0b', 'Arkadaş grubu, çiftler, hafta sonu')
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    icon = EXCLUDED.icon,
    color = EXCLUDED.color,
    description = EXCLUDED.description
  RETURNING id INTO v_sosyal_id;

  IF v_sosyal_id IS NULL THEN
    SELECT id INTO v_sosyal_id FROM categories WHERE slug = 'sosyal-eglence';
  END IF;

  -- Tüm mevcut alt kategorileri sil
  DELETE FROM subcategories;

  -- ===== 1. SANAT & EL SANATLARI (26 alt kategori) =====

  -- Seramik & Kil (4)
  INSERT INTO subcategories (category_id, name, slug, icon) VALUES
  (v_sanat_id, 'Seramik', 'seramik', 'color-palette-outline'),
  (v_sanat_id, 'Çömlek', 'comlek', 'ellipse-outline'),
  (v_sanat_id, 'Heykel (Kil)', 'heykel-kil', 'cube-outline'),
  (v_sanat_id, 'Kintsugi', 'kintsugi', 'shapes-outline');

  -- Cam & Mozaik (4)
  INSERT INTO subcategories (category_id, name, slug, icon) VALUES
  (v_sanat_id, 'Cam Füzyon', 'cam-fuzyon', 'sparkles-outline'),
  (v_sanat_id, 'Cam Boyama', 'cam-boyama', 'color-fill-outline'),
  (v_sanat_id, 'Cam Üfleme', 'cam-ufleme', 'flame-outline'),
  (v_sanat_id, 'Mozaik', 'mozaik', 'apps-outline');

  -- Geleneksel Sanatlar (6)
  INSERT INTO subcategories (category_id, name, slug, icon) VALUES
  (v_sanat_id, 'Ebru', 'ebru', 'water-outline'),
  (v_sanat_id, 'Çini', 'cini', 'flower-outline'),
  (v_sanat_id, 'Hat Sanatı', 'hat-sanati', 'create-outline'),
  (v_sanat_id, 'Minyatür', 'minyatur', 'eye-outline'),
  (v_sanat_id, 'Tezhip', 'tezhip', 'star-outline'),
  (v_sanat_id, 'Kaligrafi', 'kaligrafi', 'text-outline');

  -- Resim & Görsel Sanatlar (6)
  INSERT INTO subcategories (category_id, name, slug, icon) VALUES
  (v_sanat_id, 'Tuval Boyama', 'tuval-boyama', 'brush-outline'),
  (v_sanat_id, 'Sulu Boya', 'sulu-boya', 'water-outline'),
  (v_sanat_id, 'Yağlı Boya', 'yagli-boya', 'color-palette-outline'),
  (v_sanat_id, 'Karakalem', 'karakalem', 'pencil-outline'),
  (v_sanat_id, 'Mandala', 'mandala', 'radio-button-on-outline'),
  (v_sanat_id, 'İllüstrasyon', 'illustrasyon', 'brush-outline');

  -- El İşi & Tekstil (6)
  INSERT INTO subcategories (category_id, name, slug, icon) VALUES
  (v_sanat_id, 'Makrome', 'makrome', 'git-network-outline'),
  (v_sanat_id, 'Punch', 'punch', 'star-outline'),
  (v_sanat_id, 'Nakış', 'nakis', 'heart-outline'),
  (v_sanat_id, 'Keçe', 'kece', 'diamond-outline'),
  (v_sanat_id, 'Patchwork', 'patchwork', 'grid-outline'),
  (v_sanat_id, 'Quilling', 'quilling', 'sync-outline');

  -- ===== 2. ZANAAT & TASARIM (14 alt kategori) =====

  -- Ahşap İşleri (4)
  INSERT INTO subcategories (category_id, name, slug, icon) VALUES
  (v_zanaat_id, 'Ahşap Oyma', 'ahsap-oyma', 'hammer-outline'),
  (v_zanaat_id, 'Ahşap Boyama', 'ahsap-boyama', 'color-fill-outline'),
  (v_zanaat_id, 'Basit Mobilya', 'basit-mobilya', 'construct-outline'),
  (v_zanaat_id, 'Oyuncak Yapımı', 'oyuncak-yapimi', 'game-controller-outline');

  -- Takı & Aksesuar (4)
  INSERT INTO subcategories (category_id, name, slug, icon) VALUES
  (v_zanaat_id, 'Takı Tasarımı', 'taki-tasarimi', 'diamond-outline'),
  (v_zanaat_id, 'Boncuk İşi', 'boncuk-isi', 'radio-button-on-outline'),
  (v_zanaat_id, 'Tel Sarma', 'tel-sarma', 'git-network-outline'),
  (v_zanaat_id, 'Doğal Taş Takı', 'dogal-tas-taki', 'diamond-outline');

  -- Deri & Metal (3)
  INSERT INTO subcategories (category_id, name, slug, icon) VALUES
  (v_zanaat_id, 'Deri Çanta', 'deri-canta', 'bag-outline'),
  (v_zanaat_id, 'Kemer Yapımı', 'kemer-yapimi', 'remove-outline'),
  (v_zanaat_id, 'Metal İşçiliği', 'metal-iscilik', 'hammer-outline');

  -- Dekoratif Ürünler (3)
  INSERT INTO subcategories (category_id, name, slug, icon) VALUES
  (v_zanaat_id, 'Ev Dekor', 'ev-dekor', 'home-outline'),
  (v_zanaat_id, 'Duvar Süsleri', 'duvar-susleri', 'image-outline'),
  (v_zanaat_id, 'Mumluk / Vazo', 'mumluk-vazo', 'flame-outline');

  -- ===== 3. DENEYİM & ATÖLYE (4 alt kategori) =====

  -- Yiyecek & İçecek (4)
  INSERT INTO subcategories (category_id, name, slug, icon) VALUES
  (v_deneyim_id, 'Kahve Demleme', 'kahve-demleme', 'cafe-outline'),
  (v_deneyim_id, 'Barista', 'barista', 'cafe-outline'),
  (v_deneyim_id, 'Çikolata Yapımı', 'cikolata-yapimi', 'ice-cream-outline'),
  (v_deneyim_id, 'Ekmek / Ekşi Maya', 'ekmek-maya', 'pizza-outline');

  -- ===== 4. AİLE & ÇOCUK (14 alt kategori) =====

  -- Aile Katılımlı (3)
  INSERT INTO subcategories (category_id, name, slug, icon) VALUES
  (v_aile_id, 'Aile Seramik', 'aile-seramik', 'people-outline'),
  (v_aile_id, 'Aile Boyama', 'aile-boyama', 'color-fill-outline'),
  (v_aile_id, 'Anne–Çocuk Atölyeleri', 'anne-cocuk', 'heart-outline');

  -- Çocuk Sanat (4)
  INSERT INTO subcategories (category_id, name, slug, icon) VALUES
  (v_aile_id, 'Çocuk Resim', 'cocuk-resim', 'brush-outline'),
  (v_aile_id, 'Çocuk Seramik', 'cocuk-seramik', 'color-palette-outline'),
  (v_aile_id, 'Kukla Yapımı', 'kukla-yapimi', 'hand-left-outline'),
  (v_aile_id, 'Origami', 'origami', 'newspaper-outline');

  -- Çocuk Eğitim (4)
  INSERT INTO subcategories (category_id, name, slug, icon) VALUES
  (v_aile_id, 'Robotik', 'robotik', 'hardware-chip-outline'),
  (v_aile_id, 'Kodlama', 'kodlama', 'code-slash-outline'),
  (v_aile_id, 'Bilim Deneyleri', 'bilim-deneyleri', 'flask-outline'),
  (v_aile_id, 'Lego Atölyesi', 'lego', 'build-outline');

  -- Drama & Yaratıcılık (3)
  INSERT INTO subcategories (category_id, name, slug, icon) VALUES
  (v_aile_id, 'Yaratıcı Drama', 'yaratici-drama', 'happy-outline'),
  (v_aile_id, 'Masal Atölyesi', 'masal-atolyesi', 'book-outline'),
  (v_aile_id, 'Oyunla Öğrenme', 'oyunla-ogrenme', 'game-controller-outline');

  -- ===== 5. SAĞLIK, WELLNESS & HAREKET (8 alt kategori) =====

  -- Zihin & Ruh (4)
  INSERT INTO subcategories (category_id, name, slug, icon) VALUES
  (v_saglik_id, 'Meditasyon', 'meditasyon', 'moon-outline'),
  (v_saglik_id, 'Mindfulness', 'mindfulness', 'leaf-outline'),
  (v_saglik_id, 'Nefes Çalışmaları', 'nefes-calismalari', 'cloud-outline'),
  (v_saglik_id, 'Ses Terapisi', 'ses-terapisi', 'musical-notes-outline');

  -- Hareket (4)
  INSERT INTO subcategories (category_id, name, slug, icon) VALUES
  (v_saglik_id, 'Yoga', 'yoga', 'body-outline'),
  (v_saglik_id, 'Pilates', 'pilates', 'fitness-outline'),
  (v_saglik_id, 'Esneme', 'esneme', 'fitness-outline'),
  (v_saglik_id, 'Dans', 'dans', 'musical-note-outline');

  -- ===== 6. SAHNE & PERFORMANS SANATLARI (7 alt kategori) =====

  -- Tiyatro & Drama (3)
  INSERT INTO subcategories (category_id, name, slug, icon) VALUES
  (v_sahne_id, 'Oyunculuk', 'oyunculuk', 'mic-outline'),
  (v_sahne_id, 'Doğaçlama', 'dogaclama', 'happy-outline'),
  (v_sahne_id, 'Kamera Önü', 'kamera-onu', 'videocam-outline');

  -- Müzik (4)
  INSERT INTO subcategories (category_id, name, slug, icon) VALUES
  (v_sahne_id, 'Şan', 'san', 'musical-notes-outline'),
  (v_sahne_id, 'Ritim', 'ritim', 'headset-outline'),
  (v_sahne_id, 'Gitar / Piyano', 'gitar-piyano', 'musical-notes-outline'),
  (v_sahne_id, 'DJ Workshop', 'dj-workshop', 'disc-outline');

  -- ===== 7. DİJİTAL & TEKNOLOJİ (10 alt kategori) =====

  -- Görsel Medya (4)
  INSERT INTO subcategories (category_id, name, slug, icon) VALUES
  (v_dijital_id, 'Fotoğrafçılık', 'fotografcilik', 'camera-outline'),
  (v_dijital_id, 'Mobil Fotoğraf', 'mobil-fotograf', 'phone-portrait-outline'),
  (v_dijital_id, 'Video Düzenleme', 'video-duzenleme', 'film-outline'),
  (v_dijital_id, 'Reels/TikTok', 'reels-tiktok', 'videocam-outline');

  -- Tasarım (3)
  INSERT INTO subcategories (category_id, name, slug, icon) VALUES
  (v_dijital_id, 'Grafik Tasarım', 'grafik-tasarim', 'color-palette-outline'),
  (v_dijital_id, 'Canva / Figma', 'canva-figma', 'shapes-outline'),
  (v_dijital_id, 'Dijital İllüstrasyon', 'dijital-illustrasyon', 'brush-outline');

  -- Yeni Teknolojiler (3)
  INSERT INTO subcategories (category_id, name, slug, icon) VALUES
  (v_dijital_id, 'Yapay Zeka ile Sanat', 'yapay-zeka-sanat', 'bulb-outline'),
  (v_dijital_id, '3D Yazıcı', '3d-yazici', 'cube-outline'),
  (v_dijital_id, 'Web Tasarım', 'web-tasarim', 'code-slash-outline');

  -- ===== 8. DOĞA & OUTDOOR (6 alt kategori) =====
  INSERT INTO subcategories (category_id, name, slug, icon) VALUES
  (v_doga_id, 'Trekking', 'trekking', 'walk-outline'),
  (v_doga_id, 'Kampçılık', 'kampcillik', 'bonfire-outline'),
  (v_doga_id, 'Doğa Fotoğrafçılığı', 'doga-fotografciligi', 'camera-outline'),
  (v_doga_id, 'Bahçecilik', 'bahcecilik', 'flower-outline'),
  (v_doga_id, 'Çiftlik Deneyimi', 'ciftlik-deneyimi', 'leaf-outline'),
  (v_doga_id, 'Tırmanış', 'tirmanis', 'trending-up-outline');

  -- ===== 9. TURİST DENEYİMLERİ (6 alt kategori) =====
  INSERT INTO subcategories (category_id, name, slug, icon) VALUES
  (v_turist_id, 'Türk Seramiği', 'turk-seramigi', 'color-palette-outline'),
  (v_turist_id, 'Ebru Deneyimi', 'ebru-deneyimi', 'water-outline'),
  (v_turist_id, 'Çini Boyama', 'cini-boyama', 'flower-outline'),
  (v_turist_id, 'Türk Kahvesi', 'turk-kahvesi', 'cafe-outline'),
  (v_turist_id, 'Osmanlı Mutfağı', 'osmanli-mutfagi', 'restaurant-outline'),
  (v_turist_id, 'Kültürel El Sanatları', 'kulturel-el-sanatlari', 'diamond-outline');

  -- ===== 10. SOSYAL & EĞLENCE (6 alt kategori) =====
  INSERT INTO subcategories (category_id, name, slug, icon) VALUES
  (v_sosyal_id, 'Paint & Sip', 'paint-sip', 'wine-outline'),
  (v_sosyal_id, 'Kokteyl Workshop', 'kokteyl-workshop', 'wine-outline'),
  (v_sosyal_id, 'Oyun Geceleri', 'oyun-geceleri', 'game-controller-outline'),
  (v_sosyal_id, 'Sosyal Tanışma', 'sosyal-tanisma', 'people-outline'),
  (v_sosyal_id, 'Çift Atölyeleri', 'cift-atolyeleri', 'heart-outline'),
  (v_sosyal_id, 'Doğum Günü', 'dogum-gunu', 'gift-outline');

  RAISE NOTICE 'Yeni kategori yapısı başarıyla oluşturuldu!';
  RAISE NOTICE 'Toplam 10 ana kategori ve % alt kategori eklendi.', (SELECT COUNT(*) FROM subcategories);
END $$;

-- =====================================================
-- BAŞARIYLA TAMAMLANDI
-- =====================================================
-- 10 Ana Kategori + 101 Alt Kategori oluşturuldu
-- Etkinlikleri eklemek için ADD_EVENTS_UNIQUE_IMAGES.sql dosyasını çalıştırın.
