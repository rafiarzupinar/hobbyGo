-- =====================================================
-- YENİ KATEGORİ YAPISI İÇİN BENZERSIZ GÖRSELLERLE ETKİNLİK EKLE
-- 10 Ana Kategori + 101 Alt Kategori = 202 Etkinlik
-- Her alt kategori için 2 etkinlik (Başlangıç + İleri Seviye)
-- =====================================================

DO $$
DECLARE
  v_workshop_id UUID;
  v_event_count INT;
  v_subcategory RECORD;
  v_image_1 TEXT;
  v_image_2 TEXT;
BEGIN
  -- İlk workshop ID'sini al (yoksa oluştur)
  SELECT id INTO v_workshop_id FROM workshops LIMIT 1;

  IF v_workshop_id IS NULL THEN
    INSERT INTO workshops (name, description, address, latitude, longitude, phone, email, website, is_active)
    VALUES (
      'Merkez Atölye',
      'Tüm etkinlikler için merkez atölye',
      'İstanbul, Türkiye',
      41.0082,
      28.9784,
      '+90 212 555 0000',
      'info@merkezatolye.com',
      'https://merkezatolye.com',
      true
    )
    RETURNING id INTO v_workshop_id;
  END IF;

  -- Mevcut events sayısını kontrol et
  SELECT COUNT(*) INTO v_event_count FROM events;
  RAISE NOTICE 'Mevcut event sayısı: %', v_event_count;

  -- Eski eventleri temizle
  DELETE FROM events;
  RAISE NOTICE 'Eski eventler temizlendi';

  -- Her alt kategori için döngü ile 2 farklı görsel ve etkinlik ata
  FOR v_subcategory IN SELECT * FROM subcategories ORDER BY id LOOP
    -- Her slug için konusuyla alakalı 2 farklı görsel belirle
    CASE v_subcategory.slug
      -- ===== 1. SANAT & EL SANATLARI =====

      -- Seramik & Kil (4)
      WHEN 'seramik' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800'; -- Seramik tornası üzerinde çalışma
        v_image_2 := 'https://images.unsplash.com/photo-1610207276491-cde784fd44fe?w=800'; -- Bitmiş seramik ürünler
      WHEN 'comlek' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800'; -- Çömlek yapımı
        v_image_2 := 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800'; -- Geleneksel çömlekler
      WHEN 'heykel-kil' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800'; -- Kil heykel çalışması
        v_image_2 := 'https://images.unsplash.com/photo-1580622031832-f1e741267851?w=800'; -- Sanat galerisi heykeller
      WHEN 'kintsugi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800'; -- Kırık seramik tamiri
        v_image_2 := 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800'; -- Altın varaklı tamir

      -- Cam & Mozaik (4)
      WHEN 'cam-fuzyon' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1599837565318-13c9a5e49e1b?w=800'; -- Cam füzyon işlemi
        v_image_2 := 'https://images.unsplash.com/photo-1573847792062-9292c0158b47?w=800'; -- Renkli cam parçaları
      WHEN 'cam-boyama' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800'; -- Vitray cam boyama
        v_image_2 := 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800'; -- Boyalı cam eserler
      WHEN 'cam-ufleme' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800'; -- Cam üfleme atölyesi
        v_image_2 := 'https://images.unsplash.com/photo-1599837565318-13c9a5e49e1b?w=800'; -- Cam üfleme süreci
      WHEN 'mozaik' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?w=800'; -- Mozaik parçaları
        v_image_2 := 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800'; -- Bitmiş mozaik çalışması

      -- Geleneksel Sanatlar (6)
      WHEN 'ebru' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800'; -- Ebru sanatı su üzerinde
        v_image_2 := 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=800'; -- Ebru desenleri
      WHEN 'cini' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800'; -- Çini boyama detayı
        v_image_2 := 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800'; -- Türk çini motifleri
      WHEN 'hat-sanati' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800'; -- Hat sanatı yazı
        v_image_2 := 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=800'; -- Osmanlı hat eseri
      WHEN 'minyatur' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800'; -- Minyatür çizimi
        v_image_2 := 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800'; -- Osmanlı minyatür
      WHEN 'tezhip' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800'; -- Tezhip altın varak
        v_image_2 := 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800'; -- Tezhip detay
      WHEN 'kaligrafi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800'; -- Kaligrafi yazı sanatı
        v_image_2 := 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=800'; -- Modern kaligrafi

      -- Resim & Görsel Sanatlar (6)
      WHEN 'tuval-boyama' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800'; -- Tuval üzerinde boyama
        v_image_2 := 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800'; -- Sanat atölyesi
      WHEN 'sulu-boya' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800'; -- Sulu boya paletleri
        v_image_2 := 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800'; -- Sulu boya resim
      WHEN 'yagli-boya' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800'; -- Yağlı boya sanat
        v_image_2 := 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800'; -- Yağlı boya tablo
      WHEN 'karakalem' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800'; -- Karakalem çizim
        v_image_2 := 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800'; -- Karakalem portre
      WHEN 'mandala' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1544945147-b6ff2d3d9d56?w=800'; -- Mandala desenleri
        v_image_2 := 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=800'; -- Renkli mandala
      WHEN 'illustrasyon' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800'; -- İllüstrasyon çizimi
        v_image_2 := 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800'; -- Dijital illüstrasyon

      -- El İşi & Tekstil (6)
      WHEN 'makrome' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800'; -- Makrome duvar süsü
        v_image_2 := 'https://images.unsplash.com/photo-1610814922562-9cb8e2e5f0e7?w=800'; -- Makrome örme
      WHEN 'punch' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1610814922562-9cb8e2e5f0e7?w=800'; -- Punch nakışı
        v_image_2 := 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800'; -- Punch halı
      WHEN 'nakis' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1566762881186-a764f6feb8af?w=800'; -- Geleneksel nakış
        v_image_2 := 'https://images.unsplash.com/photo-1610814922562-9cb8e2e5f0e7?w=800'; -- El nakışı
      WHEN 'kece' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1610814922562-9cb8e2e5f0e7?w=800'; -- Keçe işleme
        v_image_2 := 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800'; -- Keçe ürünler
      WHEN 'patchwork' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1566762881186-a764f6feb8af?w=800'; -- Patchwork yorgan
        v_image_2 := 'https://images.unsplash.com/photo-1610814922562-9cb8e2e5f0e7?w=800'; -- Patchwork dikiş
      WHEN 'quilling' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1544945147-b6ff2d3d9d56?w=800'; -- Quilling kağıt sanatı
        v_image_2 := 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=800'; -- Quilling desenler

      -- ===== 2. ZANAAT & TASARIM =====

      -- Ahşap İşleri (4)
      WHEN 'ahsap-oyma' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800'; -- Ahşap oyma çalışması
        v_image_2 := 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'; -- Ahşap oyma ürün
      WHEN 'ahsap-boyama' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800'; -- Ahşap boyama
        v_image_2 := 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'; -- Boyalı ahşap
      WHEN 'basit-mobilya' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'; -- Ahşap mobilya yapımı
        v_image_2 := 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800'; -- El yapımı mobilya
      WHEN 'oyuncak-yapimi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'; -- Ahşap oyuncak
        v_image_2 := 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800'; -- El yapımı oyuncak

      -- Takı & Aksesuar (4)
      WHEN 'taki-tasarimi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800'; -- Takı tasarım atölyesi
        v_image_2 := 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800'; -- El yapımı takı
      WHEN 'boncuk-isi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800'; -- Boncuk işleme
        v_image_2 := 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800'; -- Boncuk bileklik
      WHEN 'tel-sarma' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800'; -- Tel sarma takı
        v_image_2 := 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800'; -- Tel sarma yüzük
      WHEN 'dogal-tas-taki' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800'; -- Doğal taş takı
        v_image_2 := 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800'; -- Taş kolye

      -- Deri & Metal (3)
      WHEN 'deri-canta' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800'; -- Deri çanta yapımı
        v_image_2 := 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800'; -- El yapımı deri çanta
      WHEN 'kemer-yapimi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800'; -- Deri kemer yapımı
        v_image_2 := 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800'; -- El işi deri kemer
      WHEN 'metal-iscilik' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800'; -- Metal işçiliği
        v_image_2 := 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'; -- Metal el sanatları

      -- Dekoratif Ürünler (3)
      WHEN 'ev-dekor' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800'; -- Ev dekor objeleri
        v_image_2 := 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800'; -- Dekoratif ürünler
      WHEN 'duvar-susleri' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800'; -- Duvar süsü yapımı
        v_image_2 := 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800'; -- Duvar dekorasyonu
      WHEN 'mumluk-vazo' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800'; -- Seramik vazo
        v_image_2 := 'https://images.unsplash.com/photo-1610207276491-cde784fd44fe?w=800'; -- Mumluk tasarımı

      -- ===== 3. DENEYİM & ATÖLYE =====

      -- Yiyecek & İçecek (4)
      WHEN 'kahve-demleme' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800'; -- Kahve demleme
        v_image_2 := 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800'; -- Kahve bardağı
      WHEN 'barista' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1559305616-3ceb2d270a8d?w=800'; -- Barista latte art
        v_image_2 := 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800'; -- Espresso makinesi
      WHEN 'cikolata-yapimi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800'; -- Çikolata yapımı
        v_image_2 := 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=800'; -- El yapımı çikolata
      WHEN 'ekmek-maya' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800'; -- Ekmek yapımı
        v_image_2 := 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=800'; -- Ekşi maya ekmek

      -- ===== 4. AİLE & ÇOCUK =====

      -- Aile Katılımlı (3)
      WHEN 'aile-seramik' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800'; -- Aile seramik atölyesi
        v_image_2 := 'https://images.unsplash.com/photo-1610207276491-cde784fd44fe?w=800'; -- Çocuk seramik
      WHEN 'aile-boyama' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800'; -- Aile boyama etkinliği
        v_image_2 := 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800'; -- Çocuk sanat
      WHEN 'anne-cocuk' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800'; -- Anne-çocuk atölye
        v_image_2 := 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800'; -- Anne-bebek etkinlik

      -- Çocuk Sanat (4)
      WHEN 'cocuk-resim' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800'; -- Çocuk resim atölyesi
        v_image_2 := 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800'; -- Çocuk boyama
      WHEN 'cocuk-seramik' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800'; -- Çocuk seramik
        v_image_2 := 'https://images.unsplash.com/photo-1610207276491-cde784fd44fe?w=800'; -- Çocuk çömlekçilik
      WHEN 'kukla-yapimi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800'; -- Kukla yapımı
        v_image_2 := 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800'; -- El kuklası
      WHEN 'origami' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1544945147-b6ff2d3d9d56?w=800'; -- Origami kağıt katlama
        v_image_2 := 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=800'; -- Origami sanatı

      -- Çocuk Eğitim (4)
      WHEN 'robotik' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800'; -- Robotik kodlama
        v_image_2 := 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800'; -- Robot yapımı
      WHEN 'kodlama' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800'; -- Çocuk kodlama
        v_image_2 := 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800'; -- Programlama dersi
      WHEN 'bilim-deneyleri' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800'; -- Bilim deneyleri
        v_image_2 := 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800'; -- Çocuk laboratuvar
      WHEN 'lego' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800'; -- Lego yapımı
        v_image_2 := 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'; -- Lego mühendislik

      -- Drama & Yaratıcılık (3)
      WHEN 'yaratici-drama' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800'; -- Çocuk drama
        v_image_2 := 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800'; -- Yaratıcı oyun
      WHEN 'masal-atolyesi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800'; -- Masal kitabı
        v_image_2 := 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800'; -- Masal anlatımı
      WHEN 'oyunla-ogrenme' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800'; -- Eğitici oyunlar
        v_image_2 := 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800'; -- Oyun aktivitesi

      -- ===== 5. SAĞLIK, WELLNESS & HAREKET =====

      -- Zihin & Ruh (4)
      WHEN 'meditasyon' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800'; -- Meditasyon seansı
        v_image_2 := 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800'; -- Zen meditasyon
      WHEN 'mindfulness' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800'; -- Mindfulness pratiği
        v_image_2 := 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800'; -- Bilinçli farkındalık
      WHEN 'nefes-calismalari' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800'; -- Nefes egzersizleri
        v_image_2 := 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800'; -- Pranayama
      WHEN 'ses-terapisi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800'; -- Tibet çanları
        v_image_2 := 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800'; -- Sound healing

      -- Hareket (4)
      WHEN 'yoga' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800'; -- Yoga pratiği
        v_image_2 := 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800'; -- Yoga seansı
      WHEN 'pilates' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800'; -- Pilates egzersizi
        v_image_2 := 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'; -- Pilates mat
      WHEN 'esneme' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800'; -- Esneme hareketleri
        v_image_2 := 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800'; -- Stretching
      WHEN 'dans' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800'; -- Dans dersi
        v_image_2 := 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=800'; -- Salsa tango

      -- ===== 6. SAHNE & PERFORMANS SANATLARI =====

      -- Tiyatro & Drama (3)
      WHEN 'oyunculuk' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800'; -- Oyunculuk dersi
        v_image_2 := 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800'; -- Tiyatro sahnesi
      WHEN 'dogaclama' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800'; -- Doğaçlama tiyatro
        v_image_2 := 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800'; -- İmprov workshop
      WHEN 'kamera-onu' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800'; -- Kamera önü oyunculuk
        v_image_2 := 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800'; -- Video çekim

      -- Müzik (4)
      WHEN 'san' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1519874179391-3ebc752241dd?w=800'; -- Şan eğitimi
        v_image_2 := 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800'; -- Vokal dersi
      WHEN 'ritim' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1519874179391-3ebc752241dd?w=800'; -- Ritim atölyesi
        v_image_2 := 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800'; -- Darbuka bateri
      WHEN 'gitar-piyano' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800'; -- Gitar dersi
        v_image_2 := 'https://images.unsplash.com/photo-1552422535-c45813c61732?w=800'; -- Piyano çalma
      WHEN 'dj-workshop' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800'; -- DJ ekipmanları
        v_image_2 := 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800'; -- DJ mixing

      -- ===== 7. DİJİTAL & TEKNOLOJİ =====

      -- Görsel Medya (4)
      WHEN 'fotografcilik' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800'; -- Fotoğraf makinesi
        v_image_2 := 'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=800'; -- Stüdyo fotoğrafçılık
      WHEN 'mobil-fotograf' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800'; -- Mobil fotoğraf
        v_image_2 := 'https://images.unsplash.com/photo-1526666361175-e27445ea0241?w=800'; -- Telefon kamera
      WHEN 'video-duzenleme' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800'; -- Video editing
        v_image_2 := 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800'; -- Premiere CapCut
      WHEN 'reels-tiktok' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800'; -- Reels çekim
        v_image_2 := 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800'; -- TikTok içerik

      -- Tasarım (3)
      WHEN 'grafik-tasarim' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800'; -- Grafik tasarım
        v_image_2 := 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800'; -- Adobe tasarım
      WHEN 'canva-figma' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800'; -- Canva Figma
        v_image_2 := 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800'; -- UI/UX tasarım
      WHEN 'dijital-illustrasyon' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800'; -- Dijital çizim
        v_image_2 := 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800'; -- Tablet illüstrasyon

      -- Yeni Teknolojiler (3)
      WHEN 'yapay-zeka-sanat' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800'; -- AI sanat
        v_image_2 := 'https://images.unsplash.com/photo-1686191128892-34a5b6b31f1f?w=800'; -- Yapay zeka görsel
      WHEN '3d-yazici' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800'; -- 3D printer
        v_image_2 := 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800'; -- 3D baskı
      WHEN 'web-tasarim' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800'; -- Web tasarım
        v_image_2 := 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800'; -- Web development

      -- ===== 8. DOĞA & OUTDOOR =====

      WHEN 'trekking' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800'; -- Trekking dağ yürüyüşü
        v_image_2 := 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800'; -- Doğa yürüyüşü
      WHEN 'kampcillik' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800'; -- Kamp çadır
        v_image_2 := 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800'; -- Kampçılık aktivite
      WHEN 'doga-fotografciligi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800'; -- Doğa fotoğrafı
        v_image_2 := 'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=800'; -- Landscape fotoğraf
      WHEN 'bahcecilik' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800'; -- Bahçe işi
        v_image_2 := 'https://images.unsplash.com/photo-1458245201577-fc8a130b8829?w=800'; -- Bitki yetiştirme
      WHEN 'ciftlik-deneyimi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800'; -- Çiftlik hayvanları
        v_image_2 := 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800'; -- Çiftlik aktivite
      WHEN 'tirmanis' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800'; -- Kaya tırmanışı
        v_image_2 := 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800'; -- Tırmanış duvarı

      -- ===== 9. TURİST DENEYİMLERİ =====

      WHEN 'turk-seramigi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800'; -- Türk seramik sanatı
        v_image_2 := 'https://images.unsplash.com/photo-1610207276491-cde784fd44fe?w=800'; -- Geleneksel seramik
      WHEN 'ebru-deneyimi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800'; -- Ebru workshop
        v_image_2 := 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=800'; -- Ebru sanat deneyimi
      WHEN 'cini-boyama' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800'; -- Çini boyama atölyesi
        v_image_2 := 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800'; -- Türk çini
      WHEN 'turk-kahvesi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1610889556528-96190a0c787e?w=800'; -- Türk kahvesi deneyimi
        v_image_2 := 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800'; -- Kahve fincanı
      WHEN 'osmanli-mutfagi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800'; -- Osmanlı yemekleri
        v_image_2 := 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800'; -- Türk mutfağı
      WHEN 'kulturel-el-sanatlari' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800'; -- Kültürel el sanatları
        v_image_2 := 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800'; -- Geleneksel sanat

      -- ===== 10. SOSYAL & EĞLENCE =====

      WHEN 'paint-sip' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800'; -- Paint and sip
        v_image_2 := 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800'; -- Boya şarap etkinliği
      WHEN 'kokteyl-workshop' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800'; -- Kokteyl yapımı
        v_image_2 := 'https://images.unsplash.com/photo-1560508801-zunquyZCnmM?w=800'; -- Barista kokteyl
      WHEN 'oyun-geceleri' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1566694271453-390536dd1f0d?w=800'; -- Masa oyunları
        v_image_2 := 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=800'; -- Oyun gecesi
      WHEN 'sosyal-tanisma' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800'; -- Sosyal etkinlik
        v_image_2 := 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800'; -- Tanışma workshop
      WHEN 'cift-atolyeleri' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800'; -- Çift aktivitesi
        v_image_2 := 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800'; -- Çift sanat atölyesi
      WHEN 'dogum-gunu' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800'; -- Doğum günü parti
        v_image_2 := 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800'; -- Doğum günü etkinlik

      ELSE
        v_image_1 := 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800';
        v_image_2 := 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800';
    END CASE;

    -- Başlangıç seviyesi etkinlik
    INSERT INTO events (
      workshop_id,
      category_id,
      subcategory_id,
      title,
      description,
      image_url,
      start_date,
      end_date,
      price,
      capacity,
      current_bookings,
      is_active
    )
    SELECT
      v_workshop_id,
      v_subcategory.category_id,
      v_subcategory.id,
      v_subcategory.name || ' Başlangıç Workshop',
      v_subcategory.name || ' ile ilgili temel bilgiler ve pratik uygulamalar. Deneyim gerektirmez, herkes katılabilir.',
      v_image_1,
      NOW() + INTERVAL '7 days',
      NOW() + INTERVAL '7 days' + INTERVAL '3 hours',
      150,
      15,
      FLOOR(RANDOM() * 8)::INT,
      true
    FROM categories WHERE id = v_subcategory.category_id;

    -- İleri seviye etkinlik
    INSERT INTO events (
      workshop_id,
      category_id,
      subcategory_id,
      title,
      description,
      image_url,
      start_date,
      end_date,
      price,
      capacity,
      current_bookings,
      is_active
    )
    SELECT
      v_workshop_id,
      v_subcategory.category_id,
      v_subcategory.id,
      v_subcategory.name || ' İleri Seviye Atölye',
      v_subcategory.name || ' alanında derinlemesine bilgi ve ileri teknikler. Önceki deneyim tavsiye edilir.',
      v_image_2,
      NOW() + INTERVAL '14 days',
      NOW() + INTERVAL '14 days' + INTERVAL '4 hours',
      300,
      12,
      FLOOR(RANDOM() * 6)::INT,
      true
    FROM categories WHERE id = v_subcategory.category_id;

  END LOOP;

  RAISE NOTICE 'Tüm etkinlikler başarıyla eklendi!';
  RAISE NOTICE 'Toplam % etkinlik oluşturuldu.', (SELECT COUNT(*) FROM events);
END $$;

-- =====================================================
-- BAŞARIYLA TAMAMLANDI
-- =====================================================
-- 202 Etkinlik (101 alt kategori x 2) oluşturuldu
-- Her etkinlik konusuyla alakalı benzersiz görsellere sahip
