-- =====================================================
-- TÜM ALT KATEGORİLER İÇİN ETKİNLİK EKLE (KESİN ÇALIŞIR)
-- =====================================================

DO $$
DECLARE
  v_workshop_id UUID;
  v_event_count INT;
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

  -- Her alt kategori için 2 etkinlik ekle
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
    materials_included,
    is_active
  )
  SELECT
    v_workshop_id,
    s.category_id,
    s.id,
    s.name || ' Başlangıç Workshop',
    'Bu ' || s.name || ' atölyesinde temel teknikleri öğrenecek ve kendi eserinizi oluşturacaksınız. Tüm malzemeler dahil, deneyim gerekmez.',
    CASE
      -- Seramik & Çömlek
      WHEN s.slug LIKE '%seramik%' OR s.slug LIKE '%comlek%' THEN 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800'
      -- Resim & Boya
      WHEN s.slug LIKE '%resim%' OR s.slug LIKE '%boya%' OR s.slug LIKE '%sulu-boya%' OR s.slug LIKE '%yagli%' THEN 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800'
      WHEN s.slug LIKE '%karakalem%' OR s.slug LIKE '%cizim%' OR s.slug LIKE '%mandala%' THEN 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800'
      -- Ebru
      WHEN s.slug LIKE '%ebru%' THEN 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800'
      -- Cam İşleri
      WHEN s.slug LIKE '%cam%' THEN 'https://images.unsplash.com/photo-1599837565318-13c9a5e49e1b?w=800'
      -- Ahşap
      WHEN s.slug LIKE '%ahsap%' THEN 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800'
      -- Mozaik & Çini
      WHEN s.slug LIKE '%mozaik%' OR s.slug LIKE '%cini%' THEN 'https://images.unsplash.com/photo-1582753369402-f5cd065e3f95?w=800'
      -- Takı
      WHEN s.slug LIKE '%taki%' OR s.slug LIKE '%bileklik%' OR s.slug LIKE '%aksesuar%' THEN 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800'
      -- Resin Art
      WHEN s.slug LIKE '%resin%' THEN 'https://images.unsplash.com/photo-1579762715459-5a068c289fda?w=800'
      -- Deri
      WHEN s.slug LIKE '%deri%' THEN 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800'
      -- Hat & Kaligrafi
      WHEN s.slug LIKE '%hat%' OR s.slug LIKE '%kaligrafi%' THEN 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800'
      -- Heykel & Kil
      WHEN s.slug LIKE '%heykel%' OR s.slug LIKE '%kil%' THEN 'https://images.unsplash.com/photo-1609619385002-f40f0f13f2dd?w=800'
      -- Makrome
      WHEN s.slug LIKE '%makrome%' THEN 'https://images.unsplash.com/photo-1611069377992-4b7671f0c7e8?w=800'
      -- El İşi (Keçe, Punch, Quilling)
      WHEN s.slug LIKE '%kece%' OR s.slug LIKE '%punch%' OR s.slug LIKE '%quilling%' THEN 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800'
      -- Çocuk Etkinlikleri
      WHEN s.slug LIKE '%cocuk%' THEN 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800'
      -- Aile Etkinlikleri
      WHEN s.slug LIKE '%aile%' THEN 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800'
      -- Drama & Tiyatro
      WHEN s.slug LIKE '%drama%' OR s.slug LIKE '%tiyatro%' THEN 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800'
      -- Kodlama & Robotik
      WHEN s.slug LIKE '%kodlama%' OR s.slug LIKE '%robotik%' THEN 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800'
      -- Bilim
      WHEN s.slug LIKE '%bilim%' THEN 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800'
      -- Origami
      WHEN s.slug LIKE '%origami%' THEN 'https://images.unsplash.com/photo-1554009975-d74653b879f1?w=800'
      -- Yoga
      WHEN s.slug LIKE '%yoga%' THEN 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800'
      -- Meditasyon
      WHEN s.slug LIKE '%meditasyon%' OR s.slug LIKE '%mindfulness%' THEN 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800'
      -- Pilates
      WHEN s.slug LIKE '%pilates%' THEN 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800'
      -- Dans & Zumba
      WHEN s.slug LIKE '%dans%' OR s.slug LIKE '%zumba%' THEN 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800'
      -- Kokteyl & Şarap
      WHEN s.slug LIKE '%kokteyl%' OR s.slug LIKE '%sarap%' THEN 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800'
      -- Kahve & Barista
      WHEN s.slug LIKE '%kahve%' OR s.slug LIKE '%barista%' THEN 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800'
      -- Çay
      WHEN s.slug LIKE '%cay%' THEN 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800'
      -- Çikolata & Tatlı
      WHEN s.slug LIKE '%cikolata%' OR s.slug LIKE '%tatli%' THEN 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=800'
      -- Sabun & Mum
      WHEN s.slug LIKE '%sabun%' OR s.slug LIKE '%mum%' THEN 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800'
      -- Parfüm
      WHEN s.slug LIKE '%parfum%' THEN 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800'
      -- Teraryum & Bonsai
      WHEN s.slug LIKE '%teraryum%' OR s.slug LIKE '%bonsai%' OR s.slug LIKE '%bahce%' THEN 'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=800'
      -- Yemek & Mutfak
      WHEN s.slug LIKE '%yemek%' OR s.slug LIKE '%mutfak%' OR s.slug LIKE '%vegan%' THEN 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800'
      WHEN s.slug LIKE '%sushi%' THEN 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800'
      WHEN s.slug LIKE '%ekmek%' THEN 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800'
      WHEN s.slug LIKE '%peynir%' THEN 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=800'
      -- Doğa & Outdoor
      WHEN s.slug LIKE '%trekking%' OR s.slug LIKE '%yurus%' THEN 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800'
      WHEN s.slug LIKE '%kamp%' THEN 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800'
      WHEN s.slug LIKE '%fotograf%' THEN 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800'
      WHEN s.slug LIKE '%kus%' THEN 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800'
      WHEN s.slug LIKE '%ciftlik%' THEN 'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800'
      WHEN s.slug LIKE '%balik%' THEN 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'
      WHEN s.slug LIKE '%kayak%' OR s.slug LIKE '%snowboard%' THEN 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800'
      WHEN s.slug LIKE '%tirmanis%' THEN 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800'
      -- Müzik
      WHEN s.slug LIKE '%muzik%' OR s.slug LIKE '%gitar%' OR s.slug LIKE '%piyano%' THEN 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800'
      WHEN s.slug LIKE '%san%' THEN 'https://images.unsplash.com/photo-1519873344727-523f0ceb3030?w=800'
      WHEN s.slug LIKE '%dj%' OR s.slug LIKE '%produksiyon%' THEN 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800'
      -- Fotoğrafçılık
      WHEN s.slug LIKE '%mobil-fotografcilik%' THEN 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800'
      WHEN s.slug LIKE '%video%' THEN 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800'
      WHEN s.slug LIKE '%3d%' THEN 'https://images.unsplash.com/photo-1551808525-51a94da548ce?w=800'
      -- Moda & Dikiş
      WHEN s.slug LIKE '%dikis%' THEN 'https://images.unsplash.com/photo-1597010402031-8e6c4f9f5534?w=800'
      WHEN s.slug LIKE '%model-cizimi%' THEN 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800'
      WHEN s.slug LIKE '%stil%' THEN 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800'
      WHEN s.slug LIKE '%sapka%' THEN 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800'
      WHEN s.slug LIKE '%canta%' THEN 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800'
      WHEN s.slug LIKE '%batik%' THEN 'https://images.unsplash.com/photo-1522424427542-e4b44604aecd?w=800'
      -- Oyun & Eğlence
      WHEN s.slug LIKE '%oyun%' OR s.slug LIKE '%puzzle%' THEN 'https://images.unsplash.com/photo-1611891487272-ce988a0054d4?w=800'
      -- Default
      ELSE 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800'
    END,
    CURRENT_TIMESTAMP + INTERVAL '3 days',
    CURRENT_TIMESTAMP + INTERVAL '3 days' + INTERVAL '3 hours',
    CASE
      WHEN s.slug LIKE '%cocuk%' THEN 150
      WHEN s.slug LIKE '%ileri%' OR s.slug LIKE '%profesyonel%' THEN 450
      ELSE 280
    END,
    CASE
      WHEN s.slug LIKE '%cocuk%' THEN 20
      ELSE 15
    END,
    FLOOR(RANDOM() * 8 + 3)::INT,
    true,
    true
  FROM subcategories s;

  -- İkinci etkinlikleri ekle (farklı tarihler ve fiyatlar)
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
    materials_included,
    is_active
  )
  SELECT
    v_workshop_id,
    s.category_id,
    s.id,
    s.name || ' İleri Seviye Atölye',
    'İleri seviye ' || s.name || ' teknikleri. Bu atölyede daha detaylı çalışmalar yapacak ve kendinizi geliştireceksiniz.',
    CASE
      -- Seramik & Çömlek (farklı açıdan)
      WHEN s.slug LIKE '%seramik%' OR s.slug LIKE '%comlek%' THEN 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800'
      -- Resim & Boya (farklı açıdan)
      WHEN s.slug LIKE '%resim%' OR s.slug LIKE '%boya%' OR s.slug LIKE '%sulu-boya%' OR s.slug LIKE '%yagli%' THEN 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800'
      WHEN s.slug LIKE '%karakalem%' OR s.slug LIKE '%cizim%' OR s.slug LIKE '%mandala%' THEN 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800'
      -- Ebru (farklı)
      WHEN s.slug LIKE '%ebru%' THEN 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=800'
      -- Cam İşleri (farklı)
      WHEN s.slug LIKE '%cam%' THEN 'https://images.unsplash.com/photo-1545128485-c400e7702796?w=800'
      -- Ahşap (farklı)
      WHEN s.slug LIKE '%ahsap%' THEN 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800'
      -- Mozaik & Çini (farklı)
      WHEN s.slug LIKE '%mozaik%' OR s.slug LIKE '%cini%' THEN 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800'
      -- Takı (farklı)
      WHEN s.slug LIKE '%taki%' OR s.slug LIKE '%bileklik%' OR s.slug LIKE '%aksesuar%' THEN 'https://images.unsplash.com/photo-1611652022419-a9419f74343a?w=800'
      -- Resin Art (farklı)
      WHEN s.slug LIKE '%resin%' THEN 'https://images.unsplash.com/photo-1607619662634-3ac55ec0e216?w=800'
      -- Deri (farklı)
      WHEN s.slug LIKE '%deri%' THEN 'https://images.unsplash.com/photo-1623955276999-45e26c7b8374?w=800'
      -- Hat & Kaligrafi (farklı)
      WHEN s.slug LIKE '%hat%' OR s.slug LIKE '%kaligrafi%' THEN 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=800'
      -- Heykel & Kil (farklı)
      WHEN s.slug LIKE '%heykel%' OR s.slug LIKE '%kil%' THEN 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=800'
      -- Makrome (farklı)
      WHEN s.slug LIKE '%makrome%' THEN 'https://images.unsplash.com/photo-1601985705806-5b9a71f6004f?w=800'
      -- El İşi (farklı)
      WHEN s.slug LIKE '%kece%' OR s.slug LIKE '%punch%' OR s.slug LIKE '%quilling%' THEN 'https://images.unsplash.com/photo-1611652022419-a9419f74343a?w=800'
      -- Çocuk (farklı)
      WHEN s.slug LIKE '%cocuk%' THEN 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800'
      -- Aile (farklı)
      WHEN s.slug LIKE '%aile%' THEN 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800'
      -- Drama & Tiyatro (farklı)
      WHEN s.slug LIKE '%drama%' OR s.slug LIKE '%tiyatro%' THEN 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800'
      -- Kodlama & Robotik (farklı)
      WHEN s.slug LIKE '%kodlama%' OR s.slug LIKE '%robotik%' THEN 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800'
      -- Bilim (farklı)
      WHEN s.slug LIKE '%bilim%' THEN 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800'
      -- Origami (farklı)
      WHEN s.slug LIKE '%origami%' THEN 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800'
      -- Yoga (farklı)
      WHEN s.slug LIKE '%yoga%' THEN 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800'
      -- Meditasyon (farklı)
      WHEN s.slug LIKE '%meditasyon%' OR s.slug LIKE '%mindfulness%' THEN 'https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?w=800'
      -- Pilates (farklı)
      WHEN s.slug LIKE '%pilates%' THEN 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800'
      -- Dans & Zumba (farklı)
      WHEN s.slug LIKE '%dans%' OR s.slug LIKE '%zumba%' THEN 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800'
      -- Kokteyl & Şarap (farklı)
      WHEN s.slug LIKE '%kokteyl%' OR s.slug LIKE '%sarap%' THEN 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800'
      -- Kahve & Barista (farklı)
      WHEN s.slug LIKE '%kahve%' OR s.slug LIKE '%barista%' THEN 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800'
      -- Çay (farklı)
      WHEN s.slug LIKE '%cay%' THEN 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800'
      -- Çikolata & Tatlı (farklı)
      WHEN s.slug LIKE '%cikolata%' OR s.slug LIKE '%tatli%' THEN 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=800'
      -- Sabun & Mum (farklı)
      WHEN s.slug LIKE '%sabun%' OR s.slug LIKE '%mum%' THEN 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800'
      -- Parfüm (farklı)
      WHEN s.slug LIKE '%parfum%' THEN 'https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=800'
      -- Teraryum & Bonsai (farklı)
      WHEN s.slug LIKE '%teraryum%' OR s.slug LIKE '%bonsai%' OR s.slug LIKE '%bahce%' THEN 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800'
      -- Yemek & Mutfak (farklı)
      WHEN s.slug LIKE '%yemek%' OR s.slug LIKE '%mutfak%' OR s.slug LIKE '%vegan%' THEN 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=800'
      WHEN s.slug LIKE '%sushi%' THEN 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=800'
      WHEN s.slug LIKE '%ekmek%' THEN 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800'
      WHEN s.slug LIKE '%peynir%' THEN 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800'
      -- Doğa & Outdoor (farklı)
      WHEN s.slug LIKE '%trekking%' OR s.slug LIKE '%yurus%' THEN 'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=800'
      WHEN s.slug LIKE '%kamp%' THEN 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=800'
      WHEN s.slug LIKE '%fotograf%' THEN 'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=800'
      WHEN s.slug LIKE '%kus%' THEN 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?w=800'
      WHEN s.slug LIKE '%ciftlik%' THEN 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800'
      WHEN s.slug LIKE '%balik%' THEN 'https://images.unsplash.com/photo-1547558840-8ad3f8ab72c0?w=800'
      WHEN s.slug LIKE '%kayak%' OR s.slug LIKE '%snowboard%' THEN 'https://images.unsplash.com/photo-1486496146582-9ffcd0b2b2b7?w=800'
      WHEN s.slug LIKE '%tirmanis%' THEN 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=800'
      -- Müzik (farklı)
      WHEN s.slug LIKE '%muzik%' OR s.slug LIKE '%gitar%' OR s.slug LIKE '%piyano%' THEN 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800'
      WHEN s.slug LIKE '%san%' THEN 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800'
      WHEN s.slug LIKE '%dj%' OR s.slug LIKE '%produksiyon%' THEN 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800'
      -- Fotoğrafçılık (farklı)
      WHEN s.slug LIKE '%mobil-fotografcilik%' THEN 'https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=800'
      WHEN s.slug LIKE '%video%' THEN 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800'
      WHEN s.slug LIKE '%3d%' THEN 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800'
      -- Moda & Dikiş (farklı)
      WHEN s.slug LIKE '%dikis%' THEN 'https://images.unsplash.com/photo-1611564265205-7dabb6c5c0dd?w=800'
      WHEN s.slug LIKE '%model-cizimi%' THEN 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=800'
      WHEN s.slug LIKE '%stil%' THEN 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800'
      WHEN s.slug LIKE '%sapka%' THEN 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=800'
      WHEN s.slug LIKE '%canta%' THEN 'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=800'
      WHEN s.slug LIKE '%batik%' THEN 'https://images.unsplash.com/photo-1558769132-92e717d613dc?w=800'
      -- Oyun & Eğlence (farklı)
      WHEN s.slug LIKE '%oyun%' OR s.slug LIKE '%puzzle%' THEN 'https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=800'
      -- Default
      ELSE 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800'
    END,
    CURRENT_TIMESTAMP + INTERVAL '10 days',
    CURRENT_TIMESTAMP + INTERVAL '10 days' + INTERVAL '4 hours',
    CASE
      WHEN s.slug LIKE '%cocuk%' THEN 200
      WHEN s.slug LIKE '%ileri%' OR s.slug LIKE '%profesyonel%' THEN 550
      ELSE 380
    END,
    CASE
      WHEN s.slug LIKE '%cocuk%' THEN 15
      ELSE 12
    END,
    FLOOR(RANDOM() * 6 + 2)::INT,
    true,
    true
  FROM subcategories s;

  -- Sonuçları göster
  SELECT COUNT(*) INTO v_event_count FROM events;
  RAISE NOTICE 'Toplam % etkinlik eklendi!', v_event_count;
  RAISE NOTICE 'Her alt kategori için 2 etkinlik oluşturuldu';
END $$;
