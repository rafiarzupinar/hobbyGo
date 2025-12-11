-- =====================================================
-- Örnek Etkinlikler Ekle (Düzeltilmiş Versiyon)
-- =====================================================

DO $$
DECLARE
  v_aile_cocuk_id UUID;
  v_deneyim_ogrenme_id UUID;
  v_doga_outdoor_id UUID;
  v_el_isi_zanaat_id UUID;
  v_kisisel_gelisim_id UUID;
  v_moda_giyim_id UUID;
  v_performans_sahne_id UUID;
  v_teknoloji_dijital_id UUID;

  -- Alt kategoriler
  v_cocuk_etkinlikleri_id UUID;
  v_dil_ogrenme_id UUID;
  v_doga_yuruyu_id UUID;
  v_orgu_orme_id UUID;
  v_yoga_id UUID;
  v_dikis_id UUID;
  v_muzik_enstruman_id UUID;
  v_programlama_id UUID;

  v_workshop_id UUID;

BEGIN
  -- Kategori ID'lerini al
  SELECT id INTO v_aile_cocuk_id FROM categories WHERE slug = 'aile-cocuk';
  SELECT id INTO v_deneyim_ogrenme_id FROM categories WHERE slug = 'deneyim-ogrenme';
  SELECT id INTO v_doga_outdoor_id FROM categories WHERE slug = 'doga-outdoor';
  SELECT id INTO v_el_isi_zanaat_id FROM categories WHERE slug = 'el-isi-zanaat';
  SELECT id INTO v_kisisel_gelisim_id FROM categories WHERE slug = 'kisisel-gelisim-saglik';
  SELECT id INTO v_moda_giyim_id FROM categories WHERE slug = 'moda-giyim';
  SELECT id INTO v_performans_sahne_id FROM categories WHERE slug = 'performans-sahne';
  SELECT id INTO v_teknoloji_dijital_id FROM categories WHERE slug = 'teknoloji-dijital';

  -- Alt kategori ID'lerini al
  SELECT id INTO v_cocuk_etkinlikleri_id FROM subcategories WHERE slug = 'cocuk-etkinlikleri';
  SELECT id INTO v_dil_ogrenme_id FROM subcategories WHERE slug = 'dil-ogrenme';
  SELECT id INTO v_doga_yuruyu_id FROM subcategories WHERE slug = 'doga-yuruyusu';
  SELECT id INTO v_orgu_orme_id FROM subcategories WHERE slug = 'orgu-orme';
  SELECT id INTO v_yoga_id FROM subcategories WHERE slug = 'yoga';
  SELECT id INTO v_dikis_id FROM subcategories WHERE slug = 'dikis';
  SELECT id INTO v_muzik_enstruman_id FROM subcategories WHERE slug = 'muzik-enstruman-kursu';
  SELECT id INTO v_programlama_id FROM subcategories WHERE slug = 'yazilim-programlama';

  -- İlk workshop ID'sini al
  SELECT id INTO v_workshop_id FROM workshops LIMIT 1;

  -- Aile & Çocuk
  INSERT INTO events (workshop_id, category_id, subcategory_id, title, description, image_url, start_date, end_date, price, capacity, current_bookings, materials_included, is_active) VALUES
  (v_workshop_id, v_aile_cocuk_id, v_cocuk_etkinlikleri_id, 'Çocuklar İçin Yaratıcı Drama Atölyesi', 'Çocukların hayal gücünü geliştiren, oyun ve drama teknikleriyle desteklenen eğlenceli bir atölye. 6-12 yaş arası çocuklar için. Kadıköy Kültür Merkezi.', 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days' + INTERVAL '2 hours', 150, 20, 8, true, true),
  (v_workshop_id, v_aile_cocuk_id, v_cocuk_etkinlikleri_id, 'Aile Resim Günü - Birlikte Sanat', 'Ailecek katılabileceğiniz, çocuklarla birlikte resim yapabileceğiniz özel bir etkinlik. Tüm malzemeler dahil. Moda Sanat Atölyesi.', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800', NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days' + INTERVAL '3 hours', 200, 15, 12, true, true);

  -- Deneyim & Öğrenme
  INSERT INTO events (workshop_id, category_id, subcategory_id, title, description, image_url, start_date, end_date, price, capacity, current_bookings, materials_included, is_active) VALUES
  (v_workshop_id, v_deneyim_ogrenme_id, v_dil_ogrenme_id, 'İngilizce Konuşma Kulübü - Kahve Sohbetleri', 'Rahat bir ortamda İngilizce pratik yapabileceğiniz, yeni insanlarla tanışabileceğiniz konuşma kulübü. Starbucks Kadıköy.', 'https://images.unsplash.com/photo-1543269664-76bc3997d9ea?w=800', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days' + INTERVAL '2 hours', 0, 12, 7, false, true),
  (v_workshop_id, v_deneyim_ogrenme_id, v_dil_ogrenme_id, 'Yabancı Dil Öğrenme Teknikleri Workshop', 'Dil öğrenmeyi kolaylaştıran modern teknikler, hafıza yöntemleri ve pratik uygulamalar. Beyoğlu Eğitim Merkezi.', 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800', NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days' + INTERVAL '3 hours', 250, 25, 18, false, true);

  -- Doğa & Outdoor
  INSERT INTO events (workshop_id, category_id, subcategory_id, title, description, image_url, start_date, end_date, price, capacity, current_bookings, materials_included, is_active) VALUES
  (v_workshop_id, v_doga_outdoor_id, v_doga_yuruyu_id, 'Polonezköy Doğa Yürüyüşü ve Fotoğraf Turu', 'Polonezköy''ün muhteşem doğasında rehberli yürüyüş ve fotoğraf çekimi. Kahvaltı dahil.', 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800', NOW() + INTERVAL '6 days', NOW() + INTERVAL '6 days' + INTERVAL '6 hours', 180, 30, 22, false, true),
  (v_workshop_id, v_doga_outdoor_id, v_doga_yuruyu_id, 'Belgrad Ormanı Sabah Yürüyüşü', 'Hafta sonu sabah erken başlayan, kahvaltılı doğa yürüyüşü. Tüm seviyelere uygun. Belgrad Ormanı Giriş.', 'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=800', NOW() + INTERVAL '4 days', NOW() + INTERVAL '4 days' + INTERVAL '4 hours', 100, 25, 15, false, true);

  -- El İşi & Zanaat
  INSERT INTO events (workshop_id, category_id, subcategory_id, title, description, image_url, start_date, end_date, price, capacity, current_bookings, materials_included, is_active) VALUES
  (v_workshop_id, v_el_isi_zanaat_id, v_orgu_orme_id, 'Başlangıç Seviye Örgü Atölyesi', 'Hiç örgü bilmeyenler için temel teknikler. Şiş ve yumak dahil. İlk ürününüzü yapacaksınız! Karaköy El Sanatları Atölyesi.', 'https://images.unsplash.com/photo-1597010402031-8e6c4f9f5534?w=800', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days' + INTERVAL '3 hours', 220, 12, 9, true, true),
  (v_workshop_id, v_el_isi_zanaat_id, v_orgu_orme_id, 'Amigurumi - Örgü Oyuncak Yapımı', 'Sevimli amigurumi karakterler örmeyi öğrenin. Malzemeler dahil, kendi oyuncağınızı eve götürün. Moda Hobi Merkezi.', 'https://images.unsplash.com/photo-1611564265205-7dabb6c5c0dd?w=800', NOW() + INTERVAL '8 days', NOW() + INTERVAL '8 days' + INTERVAL '4 hours', 280, 10, 6, true, true);

  -- Kişisel Gelişim & Sağlık
  INSERT INTO events (workshop_id, category_id, subcategory_id, title, description, image_url, start_date, end_date, price, capacity, current_bookings, materials_included, is_active) VALUES
  (v_workshop_id, v_kisisel_gelisim_id, v_yoga_id, 'Sabah Yoga ve Meditasyon Seansı', 'Güne enerjik başlamak için sabah yoga seansı. Tüm seviyelere uygun, matlar mevcut. Nişantaşı Yoga Studio.', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800', NOW() + INTERVAL '1 days', NOW() + INTERVAL '1 days' + INTERVAL '1.5 hours', 120, 20, 16, false, true),
  (v_workshop_id, v_kisisel_gelisim_id, v_yoga_id, 'Hafta Sonu Yoga Kampı', 'Agva''da doğayla iç içe 2 günlük yoga kampı. Konaklama ve yemekler dahil. Agva Yoga Merkezi.', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800', NOW() + INTERVAL '10 days', NOW() + INTERVAL '12 days', 1200, 15, 11, true, true);

  -- Moda & Giyim
  INSERT INTO events (workshop_id, category_id, subcategory_id, title, description, image_url, start_date, end_date, price, capacity, current_bookings, materials_included, is_active) VALUES
  (v_workshop_id, v_moda_giyim_id, v_dikis_id, 'Dikiş Makinesi Kullanımı ve Temel Dikiş', 'Dikiş makinesini kullanmayı öğrenin ve ilk dikişinizi atın. Kendi çantanızı dikin! Beyoğlu Dikiş Atölyesi.', 'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=800', NOW() + INTERVAL '4 days', NOW() + INTERVAL '4 days' + INTERVAL '3 hours', 300, 10, 7, true, true),
  (v_workshop_id, v_moda_giyim_id, v_dikis_id, 'Kendi Elbiseni Dik Workshop', 'Ölçü alma, kalıp çıkarma ve dikim teknikleriyle kendi elbisenizi yapın. 2 gün sürer. Kadıköy Moda Atölyesi.', 'https://images.unsplash.com/photo-1558769132-cb1aea3c11b8?w=800', NOW() + INTERVAL '9 days', NOW() + INTERVAL '10 days', 850, 8, 5, true, true);

  -- Performans & Sahne
  INSERT INTO events (workshop_id, category_id, subcategory_id, title, description, image_url, start_date, end_date, price, capacity, current_bookings, materials_included, is_active) VALUES
  (v_workshop_id, v_performans_sahne_id, v_muzik_enstruman_id, 'Gitar Başlangıç Kursu - 4 Hafta', 'Hiç gitar bilmeyenler için temel akorlar ve şarkı çalma teknikleri. Gitar getirin. Beşiktaş Müzik Okulu.', 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800', NOW() + INTERVAL '5 days', NOW() + INTERVAL '33 days', 1200, 12, 9, false, true),
  (v_workshop_id, v_performans_sahne_id, v_muzik_enstruman_id, 'Ukulele Workshop - Eğlenerek Öğren', 'Tek günde ukulele çalmayı öğren! Eğlenceli ve kolay. Enstrüman temin edilecek. Kadıköy Sahne Sanatları.', 'https://images.unsplash.com/photo-1596679593377-d1b95c3b6e1e?w=800', NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days' + INTERVAL '4 hours', 350, 15, 10, true, true);

  -- Teknoloji & Dijital
  INSERT INTO events (workshop_id, category_id, subcategory_id, title, description, image_url, start_date, end_date, price, capacity, current_bookings, materials_included, is_active) VALUES
  (v_workshop_id, v_teknoloji_dijital_id, v_programlama_id, 'Web Geliştirme Bootcamp - 8 Hafta', 'HTML, CSS, JavaScript öğren, kendi web siteni yap. Sıfırdan yazılıma başla. İTÜ Teknokent.', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800', NOW() + INTERVAL '14 days', NOW() + INTERVAL '70 days', 3500, 25, 20, false, true),
  (v_workshop_id, v_teknoloji_dijital_id, v_programlama_id, 'Çocuklar İçin Kodlama - Scratch', 'Scratch ile oyun yaparak kodlama öğrenen çocuklar için 7-14 yaş. Bilgisayar deneyimi gerekmez. Levent Teknoloji Atölyesi.', 'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=800', NOW() + INTERVAL '6 days', NOW() + INTERVAL '6 days' + INTERVAL '2 hours', 200, 18, 14, false, true);

  RAISE NOTICE 'Etkinlikler başarıyla eklendi!';
END $$;
