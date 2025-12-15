-- =====================================================
-- TÜM KATEGORİLERİ VE ALT KATEGORİLERİ YENİDEN DÜZENLE
-- =====================================================

DO $$
DECLARE
  -- Kategori ID'leri
  v_sanat_id UUID;
  v_deneyim_id UUID;
  v_aile_id UUID;
  v_doga_id UUID;
  v_kisisel_id UUID;
  v_performans_id UUID;
  v_teknoloji_id UUID;
  v_moda_id UUID;
  v_elisi_id UUID;
  v_kulturel_id UUID;
  v_eglence_id UUID;
BEGIN
  -- Kategori ID'lerini al
  SELECT id INTO v_sanat_id FROM categories WHERE slug = 'sanat-el-sanatlari';
  SELECT id INTO v_deneyim_id FROM categories WHERE slug = 'deneyim-ogrenme';
  SELECT id INTO v_aile_id FROM categories WHERE slug = 'aile-cocuk';
  SELECT id INTO v_doga_id FROM categories WHERE slug = 'doga-outdoor';
  SELECT id INTO v_kisisel_id FROM categories WHERE slug = 'kisisel-gelisim-saglik';
  SELECT id INTO v_performans_id FROM categories WHERE slug = 'performans-sahne';
  SELECT id INTO v_teknoloji_id FROM categories WHERE slug = 'teknoloji-dijital';
  SELECT id INTO v_moda_id FROM categories WHERE slug = 'moda-giyim';
  SELECT id INTO v_elisi_id FROM categories WHERE slug = 'el-isi-zanaat';
  SELECT id INTO v_kulturel_id FROM categories WHERE slug = 'kulturel-geleneksel';

  -- Eğlenceli & Sosyal kategorisi yoksa ekle
  INSERT INTO categories (name, slug, icon, color, description)
  VALUES ('Eğlenceli & Sosyal', 'eglenceli-sosyal', 'happy-outline', '#f59e0b', 'Sosyal etkinlikler ve eğlenceli atölyeler')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO v_eglence_id;

  IF v_eglence_id IS NULL THEN
    SELECT id INTO v_eglence_id FROM categories WHERE slug = 'eglenceli-sosyal';
  END IF;

  -- Tüm mevcut alt kategorileri sil
  DELETE FROM subcategories;

  -- 1. SANAT & EL SANATLARI
  INSERT INTO subcategories (category_id, name, slug, icon) VALUES
  (v_sanat_id, 'Seramik / Çömlek', 'seramik-comlek', 'color-palette-outline'),
  (v_sanat_id, 'Ebru Sanatı', 'ebru-sanati', 'water-outline'),
  (v_sanat_id, 'Cam Füzyon', 'cam-fuzyon', 'sparkles-outline'),
  (v_sanat_id, 'Cam Üfleme', 'cam-ufleme', 'flame-outline'),
  (v_sanat_id, 'Ahşap Oyma', 'ahsap-oyma', 'hammer-outline'),
  (v_sanat_id, 'Mozaik', 'mozaik', 'apps-outline'),
  (v_sanat_id, 'Çini Boyama', 'cini-boyama', 'flower-outline'),
  (v_sanat_id, 'Gravür / Linol Baskı', 'gravur-linol-baski', 'print-outline'),
  (v_sanat_id, 'Takı Tasarımı', 'taki-tasarimi', 'diamond-outline'),
  (v_sanat_id, 'Resin Art (Epoksi)', 'resin-art', 'sparkles-outline'),
  (v_sanat_id, 'Deri İşçiliği', 'deri-isciligi', 'briefcase-outline'),
  (v_sanat_id, 'Kaligrafi', 'kaligrafi', 'text-outline'),
  (v_sanat_id, 'Hat Sanatı', 'hat-sanati', 'create-outline'),
  (v_sanat_id, 'Minyatür', 'miniyatur', 'eye-outline'),
  (v_sanat_id, 'Mandala Çizimi', 'mandala-cizimi', 'radio-button-on-outline'),
  (v_sanat_id, 'Sulu Boya & Guaj Boya', 'sulu-boya-guaj', 'brush-outline'),
  (v_sanat_id, 'Yağlı Boya Resim', 'yagli-boya-resim', 'color-palette-outline'),
  (v_sanat_id, 'Karakalem', 'karakalem', 'pencil-outline'),
  (v_sanat_id, 'Heykel / Kil', 'heykel-kil', 'cube-outline'),
  (v_sanat_id, 'Makrome', 'makrome', 'git-network-outline'),
  (v_sanat_id, 'Patchwork', 'patchwork', 'grid-outline'),
  (v_sanat_id, 'Keçe Tasarım', 'kece-tasarim', 'heart-outline'),
  (v_sanat_id, 'Punch Nakışı', 'punch-nakisi', 'star-outline'),
  (v_sanat_id, 'Quilling (Kağıt Kıvırma)', 'quilling', 'sync-outline');

  -- 2. DENEYİM & ÖĞRENME
  INSERT INTO subcategories (category_id, name, slug, icon) VALUES
  (v_deneyim_id, 'Kokteyl Workshop', 'kokteyl-workshop', 'wine-outline'),
  (v_deneyim_id, 'Kahve Demleme / Barista', 'kahve-barista', 'cafe-outline'),
  (v_deneyim_id, 'Çikolata Yapımı', 'cikolata-yapimi', 'ice-cream-outline'),
  (v_deneyim_id, 'Sabun Yapımı', 'sabun-yapimi', 'water-outline'),
  (v_deneyim_id, 'Mum Yapımı', 'mum-yapimi', 'flame-outline'),
  (v_deneyim_id, 'Parfüm Yapımı', 'parfum-yapimi', 'rose-outline'),
  (v_deneyim_id, 'Bitki Yetiştirme / Teraryum', 'teraryum', 'leaf-outline'),
  (v_deneyim_id, 'Bonsai Eğitimi', 'bonsai', 'git-branch-outline'),
  (v_deneyim_id, 'Doğal Bakım Ürünleri', 'dogal-bakim', 'flower-outline'),
  (v_deneyim_id, 'Fermentasyon (Turşu, Kombucha)', 'fermentasyon', 'nutrition-outline'),
  (v_deneyim_id, 'Ekşi Maya Ekmek', 'eksi-maya-ekmek', 'pizza-outline'),
  (v_deneyim_id, 'Vegan Yemek Workshop', 'vegan-yemek', 'restaurant-outline'),
  (v_deneyim_id, 'Sushi Yapımı', 'sushi-yapimi', 'fish-outline'),
  (v_deneyim_id, 'Peynir Yapımı', 'peynir-yapimi', 'nutrition-outline'),
  (v_deneyim_id, 'Çay Tadımı', 'cay-tadimi', 'cafe-outline');

  -- 3. AİLE & ÇOCUK
  INSERT INTO subcategories (category_id, name, slug, icon) VALUES
  (v_aile_id, 'Çocuk Seramik', 'cocuk-seramik', 'color-palette-outline'),
  (v_aile_id, 'Çocuk Resim', 'cocuk-resim', 'brush-outline'),
  (v_aile_id, 'Çocuktan Aileye Hediye Tasarım', 'cocuk-hediye', 'gift-outline'),
  (v_aile_id, 'Aile Seramik Günü', 'aile-seramik', 'people-outline'),
  (v_aile_id, 'Aile Boyama Etkinliği', 'aile-boyama', 'color-fill-outline'),
  (v_aile_id, 'Çocuk Drama / Yaratıcı Drama', 'cocuk-drama', 'happy-outline'),
  (v_aile_id, 'Kodlama Atölyesi', 'kodlama', 'code-slash-outline'),
  (v_aile_id, 'Robotik', 'robotik', 'hardware-chip-outline'),
  (v_aile_id, 'Bilim Deney Atölyesi', 'bilim-deney', 'flask-outline'),
  (v_aile_id, 'Lego Mühendislik', 'lego-muhendislik', 'build-outline'),
  (v_aile_id, 'Origami', 'origami', 'newspaper-outline'),
  (v_aile_id, 'Kukla Yapımı', 'kukla-yapimi', 'hand-left-outline'),
  (v_aile_id, 'Masal Atölyesi', 'masal-atolyesi', 'book-outline');

  -- 4. DOĞA & OUTDOOR
  INSERT INTO subcategories (category_id, name, slug, icon) VALUES
  (v_doga_id, 'Trekking Grup Etkinlikleri', 'trekking', 'walk-outline'),
  (v_doga_id, 'Kampçılık Başlangıç', 'kampcılık', 'bonfire-outline'),
  (v_doga_id, 'Doğa Fotoğrafçılığı', 'doga-fotografciligi', 'camera-outline'),
  (v_doga_id, 'Kuş Gözlemi Workshop', 'kus-gozlemi', 'binoculars-outline'),
  (v_doga_id, 'Çiftlik Deneyimi', 'ciftlik-deneyimi', 'leaf-outline'),
  (v_doga_id, 'Bahçecilik', 'bahcecilik', 'flower-outline'),
  (v_doga_id, 'Mantar Toplama / Doğa Yürüyüşü', 'mantar-toplama', 'umbrella-outline'),
  (v_doga_id, 'Balık Tutma', 'balik-tutma', 'fish-outline'),
  (v_doga_id, 'Kayak / Snowboard Başlangıç', 'kayak-snowboard', 'snow-outline'),
  (v_doga_id, 'Tırmanış (Kapalı Salon)', 'tirmanis', 'trending-up-outline');

  -- 5. KİŞİSEL GELİŞİM & SAĞLIK
  INSERT INTO subcategories (category_id, name, slug, icon) VALUES
  (v_kisisel_id, 'Yoga Başlangıç', 'yoga-baslangic', 'body-outline'),
  (v_kisisel_id, 'Meditasyon', 'meditasyon', 'moon-outline'),
  (v_kisisel_id, 'Mindfulness', 'mindfulness', 'leaf-outline'),
  (v_kisisel_id, 'Nefes Terapisi', 'nefes-terapisi', 'cloud-outline'),
  (v_kisisel_id, 'Pilates / Esneme', 'pilates-esneme', 'fitness-outline'),
  (v_kisisel_id, 'Ses Terapi (Sound Healing)', 'ses-terapi', 'musical-notes-outline'),
  (v_kisisel_id, 'Qi Gong Atölyesi', 'qi-gong', 'hand-right-outline'),
  (v_kisisel_id, 'Zumba', 'zumba', 'musical-note-outline'),
  (v_kisisel_id, 'Reformer Tanıtım Dersleri', 'reformer', 'barbell-outline'),
  (v_kisisel_id, 'Dans Dersleri (Salsa, Bachata, Tango)', 'dans-dersleri', 'people-outline');

  -- 6. PERFORMANS & SAHNE
  INSERT INTO subcategories (category_id, name, slug, icon) VALUES
  (v_performans_id, 'Tiyatro / Drama', 'tiyatro-drama', 'mic-outline'),
  (v_performans_id, 'Kamera Önü Oyunculuk', 'kamera-onu', 'videocam-outline'),
  (v_performans_id, 'Doğaçlama Tiyatro', 'dogaclama', 'happy-outline'),
  (v_performans_id, 'Şan Eğitimi', 'san-egitimi', 'musical-notes-outline'),
  (v_performans_id, 'DJ Workshop', 'dj-workshop', 'disc-outline'),
  (v_performans_id, 'Müzik Prodüksiyonu', 'muzik-produksiyon', 'musical-note-outline'),
  (v_performans_id, 'Gitar / Piyano Başlangıç', 'gitar-piyano', 'musical-notes-outline'),
  (v_performans_id, 'Ritim Atölyesi (Darbuka / Bateri)', 'ritim-atolyesi', 'headset-outline');

  -- 7. TEKNOLOJİ & DİJİTAL
  INSERT INTO subcategories (category_id, name, slug, icon) VALUES
  (v_teknoloji_id, 'Fotoğrafçılık Workshop (Stüdyo/Portre)', 'fotografcilik-workshop', 'camera-outline'),
  (v_teknoloji_id, 'Mobil Fotoğrafçılık', 'mobil-fotografcilik', 'phone-portrait-outline'),
  (v_teknoloji_id, 'Video Editing (Premiere / CapCut)', 'video-editing', 'film-outline'),
  (v_teknoloji_id, 'TikTok/Reels İçerik Üretimi', 'tiktok-reels', 'videocam-outline'),
  (v_teknoloji_id, '3D Modelleme', '3d-modelleme', 'cube-outline');

  -- 8. MODA & GİYİM
  INSERT INTO subcategories (category_id, name, slug, icon) VALUES
  (v_moda_id, 'Dikiş Atölyesi', 'dikis-atolyesi', 'cut-outline'),
  (v_moda_id, 'Model Çizimi', 'model-cizimi', 'pencil-outline'),
  (v_moda_id, 'Stil Danışmanlığı', 'stil-danismanligi', 'shirt-outline'),
  (v_moda_id, 'Şapka Yapımı', 'sapka-yapimi', 'diamond-outline'),
  (v_moda_id, 'Çanta Tasarımı', 'canta-tasarimi', 'bag-outline'),
  (v_moda_id, 'Geri Dönüşüm Moda', 'geri-donusum-moda', 'leaf-outline'),
  (v_moda_id, 'Batik Boyama', 'batik-boyama', 'color-fill-outline');

  -- 9. EL İŞİ & ZANAAT
  INSERT INTO subcategories (category_id, name, slug, icon) VALUES
  (v_elisi_id, 'Çömlek Tornası', 'comlek-tornasi', 'ellipse-outline'),
  (v_elisi_id, 'Ahşap Mobilya Yapımı (Basit)', 'ahsap-mobilya', 'construct-outline'),
  (v_elisi_id, 'Oyuncak Tasarımı', 'oyuncak-tasarimi', 'game-controller-outline'),
  (v_elisi_id, 'Küçük Ev Dekor Objeleri', 'ev-dekor', 'home-outline'),
  (v_elisi_id, 'Kintsugi (Kırık Seramik Tamiri)', 'kintsugi', 'shapes-outline'),
  (v_elisi_id, 'Metal İşçiliği Başlangıç', 'metal-isciligi', 'hammer-outline'),
  (v_elisi_id, 'Bileklik / Aksesuar Yapımı', 'bileklik-aksesuar', 'diamond-outline');

  -- 10. KÜLTÜREL & GELENEKSEL
  INSERT INTO subcategories (category_id, name, slug, icon) VALUES
  (v_kulturel_id, 'Türk Kahvesi Deneyimi', 'turk-kahvesi', 'cafe-outline'),
  (v_kulturel_id, 'Göçebe Kültürü Workshop', 'gocebe-kulturu', 'home-outline'),
  (v_kulturel_id, 'Osmanlı Tatlıları Yapımı', 'osmanli-tatlilari', 'ice-cream-outline'),
  (v_kulturel_id, 'Çini Sanatı', 'cini-sanati', 'flower-outline'),
  (v_kulturel_id, 'Geleneksel Takı', 'geleneksel-taki', 'diamond-outline'),
  (v_kulturel_id, 'Ebru Sanatı', 'ebru-sanati-kulturel', 'water-outline'),
  (v_kulturel_id, 'Misafir Ağırlama (Anadolu Kültürü)', 'misafir-agirlama', 'people-outline'),
  (v_kulturel_id, 'Türk Yemek Workshopları', 'turk-yemek', 'restaurant-outline');

  -- 11. EĞLENCELİ & SOSYAL
  INSERT INTO subcategories (category_id, name, slug, icon) VALUES
  (v_eglence_id, 'Boya-Şarap Etkinliği (Paint & Sip)', 'boya-sarap', 'wine-outline'),
  (v_eglence_id, 'Kahve Tadımı', 'kahve-tadimi', 'cafe-outline'),
  (v_eglence_id, 'Puzzle Meet-up', 'puzzle-meetup', 'game-controller-outline'),
  (v_eglence_id, 'Oyun Gecesi (Masa Oyunları)', 'oyun-gecesi', 'dice-outline'),
  (v_eglence_id, 'Kokteyl Yap-İç Etkinliği', 'kokteyl-yap-ic', 'wine-outline'),
  (v_eglence_id, 'Sosyal Tanışma Workshopları', 'sosyal-tanisma', 'people-outline'),
  (v_eglence_id, 'Bugün Stres Atalım Temalı Etkinlikler', 'stres-atma', 'happy-outline');

  RAISE NOTICE 'Tüm kategoriler ve alt kategoriler başarıyla güncellendi!';
  RAISE NOTICE 'Toplam % alt kategori eklendi.', (SELECT COUNT(*) FROM subcategories);
END $$;
