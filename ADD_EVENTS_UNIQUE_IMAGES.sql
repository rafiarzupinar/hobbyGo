-- =====================================================
-- TÜM ALT KATEGORİLER İÇİN BENZERSIZ GÖRSELLERLE ETKİNLİK EKLE
-- Her etkinlik için farklı görsel kullanılır
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

  -- Her alt kategori için döngü ile 2 farklı görsel ata
  FOR v_subcategory IN SELECT * FROM subcategories ORDER BY id LOOP
    -- Her slug için konusuyla alakalı 2 farklı görsel belirle
    CASE v_subcategory.slug
      -- SANAT & EL SANATLARI
      WHEN 'seramik-comlek' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800'; -- Seramik tornası
        v_image_2 := 'https://images.unsplash.com/photo-1610207276491-cde784fd44fe?w=800'; -- Seramik işleme
      WHEN 'ebru-sanati' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800'; -- Ebru sanatı
        v_image_2 := 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=800'; -- Ebru desenleri
      WHEN 'cam-fuzyon' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1599837565318-13c9a5e49e1b?w=800'; -- Cam işçiliği
        v_image_2 := 'https://images.unsplash.com/photo-1604871000636-074fa5117945?w=800'; -- Cam sanatı
      WHEN 'cam-ufleme' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1612808820846-8b6b2dfea6e8?w=800'; -- Cam üfleme
        v_image_2 := 'https://images.unsplash.com/photo-1545128485-c400e7702796?w=800'; -- Cam yapımı
      WHEN 'ahsap-oyma' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800'; -- Ahşap işçiliği
        v_image_2 := 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800'; -- Ahşap oyma
      WHEN 'mozaik' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1582753369402-f5cd065e3f95?w=800'; -- Mozaik sanatı
        v_image_2 := 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800'; -- Mozaik desenler
      WHEN 'cini-boyama' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1582746781614-94f13e0d5afe?w=800'; -- Çini boyama
        v_image_2 := 'https://images.unsplash.com/photo-1607619662634-3ac55ec0e216?w=800'; -- Çini sanatı
      WHEN 'gravur-linol-baski' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1596548438137-d51ea5c83ca4?w=800'; -- Baskı sanatı
        v_image_2 := 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800'; -- Gravür
      WHEN 'taki-tasarimi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800'; -- Takı yapımı
        v_image_2 := 'https://images.unsplash.com/photo-1611652022419-a9419f74343a?w=800'; -- Takı tasarımı
      WHEN 'resin-art' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1579762715459-5a068c289fda?w=800'; -- Resin art
        v_image_2 := 'https://images.unsplash.com/photo-1607619662634-3ac55ec0e216?w=800'; -- Epoksi sanatı
      WHEN 'deri-isciligi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800'; -- Deri işçiliği
        v_image_2 := 'https://images.unsplash.com/photo-1623955276999-45e26c7b8374?w=800'; -- Deri ürünler
      WHEN 'kaligrafi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800'; -- Kaligrafi
        v_image_2 := 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=800'; -- Kaligrafi sanatı
      WHEN 'hat-sanati' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1576280637268-03c99c18e939?w=800'; -- Hat sanatı
        v_image_2 := 'https://images.unsplash.com/photo-1606307728580-a09d56e9f3e7?w=800'; -- Hat yazısı
      WHEN 'miniyatur' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800'; -- Minyatür
        v_image_2 := 'https://images.unsplash.com/photo-1579541592524-23f1fbc9e75e?w=800'; -- Minyatür sanatı
      WHEN 'mandala-cizimi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800'; -- Mandala çizimi
        v_image_2 := 'https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=800'; -- Mandala desenleri
      WHEN 'sulu-boya-guaj' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800'; -- Sulu boya
        v_image_2 := 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800'; -- Boya paleti
      WHEN 'yagli-boya-resim' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1506433531439-41a8c9e969d7?w=800'; -- Yağlı boya
        v_image_2 := 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800'; -- Resim yapma
      WHEN 'karakalem' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1611244419377-b0a760c19a82?w=800'; -- Karakalem çizim
        v_image_2 := 'https://images.unsplash.com/photo-1604002484999-db22e2ab3c11?w=800'; -- Karakalem sanatı
      WHEN 'heykel-kil' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1609619385002-f40f0f13f2dd?w=800'; -- Heykel yapımı
        v_image_2 := 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=800'; -- Kil işleme
      WHEN 'makrome' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1611069377992-4b7671f0c7e8?w=800'; -- Makrome
        v_image_2 := 'https://images.unsplash.com/photo-1601985705806-5b9a71f6004f?w=800'; -- Makrome düğümler
      WHEN 'patchwork' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1606170793733-8c90b7f7778e?w=800'; -- Patchwork kumaş
        v_image_2 := 'https://images.unsplash.com/photo-1587388641233-d1fcbf79c08a?w=800'; -- Patchwork deseni
      WHEN 'kece-tasarim' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1604871000636-074fa5117945?w=800'; -- Keçe malzeme
        v_image_2 := 'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800'; -- Keçe ürünler
      WHEN 'punch-nakisi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1604390965410-4ec55d9f2e3e?w=800'; -- Nakış işleme
        v_image_2 := 'https://images.unsplash.com/photo-1588320404681-e2469da3685b?w=800'; -- El nakışı
      WHEN 'quilling' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800'; -- Quilling kağıt
        v_image_2 := 'https://images.unsplash.com/photo-1554009975-d74653b879f1?w=800'; -- Quilling sanatı
      -- DENEYİM & ÖĞRENME
      WHEN 'kokteyl-workshop' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800'; -- Kokteyl yapımı
        v_image_2 := 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800'; -- Kokteyl bardakları
      WHEN 'kahve-barista' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800'; -- Kahve hazırlama
        v_image_2 := 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800'; -- Barista sanatı
      WHEN 'cikolata-yapimi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=800'; -- Çikolata üretimi
        v_image_2 := 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=800'; -- Çikolata ürünleri
      WHEN 'sabun-yapimi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800'; -- Sabun yapımı
        v_image_2 := 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800'; -- Doğal sabunlar
      WHEN 'mum-yapimi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1602874801006-c221cba3f6b8?w=800'; -- Mum yapımı
        v_image_2 := 'https://images.unsplash.com/photo-1603006904146-b5e6ff561e58?w=800'; -- Aromaterapi mumları
      WHEN 'parfum-yapimi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800'; -- Parfüm şişeleri
        v_image_2 := 'https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=800'; -- Parfüm yapımı
      WHEN 'teraryum' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=800'; -- Teraryum cam
        v_image_2 := 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800'; -- Bitki teraryumu
      WHEN 'bonsai' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1507878866276-a947ef722fee?w=800'; -- Bonsai ağacı 1
        v_image_2 := 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800'; -- Bonsai ağacı 2
      WHEN 'dogal-bakim' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800'; -- Doğal kozmetik
        v_image_2 := 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800'; -- Bitkisel bakım
      WHEN 'fermentasyon' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=800'; -- Fermente gıdalar
        v_image_2 := 'https://images.unsplash.com/photo-1528750997573-59f7a9c20137?w=800'; -- Kombucha
      WHEN 'eksi-maya-ekmek' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800'; -- Ekmek yapımı
        v_image_2 := 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800'; -- Sourdough ekmek
      WHEN 'vegan-yemek' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800'; -- Vegan yemek 1
        v_image_2 := 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=800'; -- Vegan yemek 2
      WHEN 'sushi-yapimi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800'; -- Sushi yapımı
        v_image_2 := 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=800'; -- Sushi tabağı
      WHEN 'peynir-yapimi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=800'; -- Peynir yapımı
        v_image_2 := 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800'; -- Çeşitli peynirler
      WHEN 'cay-tadimi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800'; -- Çay demleme
        v_image_2 := 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800'; -- Çay servisi
      -- AİLE & ÇOCUK
      WHEN 'cocuk-seramik' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800'; -- Çocuk seramik yapıyor
        v_image_2 := 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800'; -- Çocuk etkinliği
      WHEN 'cocuk-resim' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1612036781124-847f8939b154?w=800'; -- Çocuk resim yapıyor
        v_image_2 := 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800'; -- Çocuk sanat
      WHEN 'cocuk-hediye' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1549931319-a545dcf2ec5f?w=800'; -- Hediye yapımı
        v_image_2 := 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800'; -- Hediye kutuları
      WHEN 'aile-seramik' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800'; -- Aile seramik
        v_image_2 := 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800'; -- Aile etkinliği
      WHEN 'aile-boyama' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=800'; -- Aile boyama
        v_image_2 := 'https://images.unsplash.com/photo-1612548396127-e87819d1e559?w=800'; -- Aile sanatı
      WHEN 'cocuk-drama' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800'; -- Çocuk tiyatrosu
        v_image_2 := 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800'; -- Drama atölyesi
      WHEN 'kodlama' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800'; -- Çocuk kodlama
        v_image_2 := 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800'; -- Programlama dersi
      WHEN 'robotik' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1546776230-bb3f4682cb96?w=800'; -- Robot yapımı
        v_image_2 := 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=800'; -- Robotik çalışma
      WHEN 'bilim-deney' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800'; -- Bilim deneyi
        v_image_2 := 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800'; -- Laboratuvar
      WHEN 'lego-muhendislik' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800'; -- Lego yapımı
        v_image_2 := 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'; -- Lego bloklar
      WHEN 'origami' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1554009975-d74653b879f1?w=800'; -- Origami kağıtları
        v_image_2 := 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800'; -- Origami sanatı
      WHEN 'kukla-yapimi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1602252431654-52d0f345e16d?w=800'; -- Kukla
        v_image_2 := 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800'; -- Kukla gösterisi
      WHEN 'masal-atolyesi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800'; -- Kitap okuma
        v_image_2 := 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800'; -- Masal kitapları
      -- DOĞA & OUTDOOR
      WHEN 'trekking' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800'; -- Trekking yürüyüşü
        v_image_2 := 'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=800'; -- Dağ tırmanışı
      WHEN 'kampcılık' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800'; -- Kamp çadırı
        v_image_2 := 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=800'; -- Kamp ateşi
      WHEN 'doga-fotografciligi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800'; -- Doğa fotoğrafı
        v_image_2 := 'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=800'; -- Fotoğrafçı
      WHEN 'kus-gozlemi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800'; -- Kuş gözlemi
        v_image_2 := 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?w=800'; -- Dürbün
      WHEN 'ciftlik-deneyimi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800'; -- Çiftlik
        v_image_2 := 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800'; -- Çiftlik hayvanları
      WHEN 'bahcecilik' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800'; -- Bahçe işi
        v_image_2 := 'https://images.unsplash.com/photo-1523301343968-6a6ebf63c672?w=800'; -- Bitki bakımı
      WHEN 'mantar-toplama' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800'; -- Mantar
        v_image_2 := 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=800'; -- Orman mantarları
      WHEN 'balik-tutma' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'; -- Balık tutma
        v_image_2 := 'https://images.unsplash.com/photo-1547558840-8ad3f8ab72c0?w=800'; -- Oltayla balık
      WHEN 'kayak-snowboard' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800'; -- Kayak
        v_image_2 := 'https://images.unsplash.com/photo-1486496146582-9ffcd0b2b2b7?w=800'; -- Snowboard
      WHEN 'tirmanis' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800'; -- Kaya tırmanışı
        v_image_2 := 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=800'; -- İç mekan tırmanış
      -- KİŞİSEL GELİŞİM & SAĞLIK
      WHEN 'yoga-baslangic' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800'; -- Yoga yapan kişi
        v_image_2 := 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800'; -- Yoga pozu
      WHEN 'meditasyon' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800'; -- Meditasyon
        v_image_2 := 'https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?w=800'; -- Huzurlu ortam
      WHEN 'mindfulness' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=800'; -- Mindfulness
        v_image_2 := 'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?w=800'; -- Zihni içerik
      WHEN 'nefes-terapisi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800'; -- Nefes egzersizi
        v_image_2 := 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800'; -- Yoga nefes
      WHEN 'pilates-esneme' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800'; -- Pilates egzersizi
        v_image_2 := 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800'; -- Esneme hareketi
      WHEN 'ses-terapi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?w=800'; -- Ses terapisi
        v_image_2 := 'https://images.unsplash.com/photo-1545159728-5c17f32a8eb2?w=800'; -- Terapi çanı
      WHEN 'qi-gong' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1591228127791-8e2eaef098d3?w=800'; -- Qi Gong
        v_image_2 := 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=800'; -- Qi Gong hareketi
      WHEN 'zumba' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800'; -- Zumba dans
        v_image_2 := 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800'; -- Grup zumba
      WHEN 'reformer' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'; -- Reformer pilates
        v_image_2 := 'https://images.unsplash.com/photo-1518310952931-b1de897abd40?w=800'; -- Reformer cihazı
      WHEN 'dans-dersleri' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800'; -- Dans dersi
        v_image_2 := 'https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=800'; -- Salsa dans
      -- PERFORMANS & SAHNE
      WHEN 'tiyatro-drama' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800'; -- Tiyatro sahnesi
        v_image_2 := 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800'; -- Drama dersi
      WHEN 'kamera-onu' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800'; -- Kamera önü
        v_image_2 := 'https://images.unsplash.com/photo-1533928298208-27ff66555d8d?w=800'; -- Film çekimi
      WHEN 'dogaclama' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800'; -- Doğaçlama
        v_image_2 := 'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?w=800'; -- İmprov tiyatro
      WHEN 'san-egitimi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1519873344727-523f0ceb3030?w=800'; -- Şan dersi
        v_image_2 := 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800'; -- Mikrofon
      WHEN 'dj-workshop' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800'; -- DJ ekipmanı
        v_image_2 := 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800'; -- DJ çalışma
      WHEN 'muzik-produksiyon' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=800'; -- Müzik stüdyosu
        v_image_2 := 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800'; -- Prodüksiyon
      WHEN 'gitar-piyano' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800'; -- Gitar çalma
        v_image_2 := 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800'; -- Piyano dersi
      WHEN 'ritim-atolyesi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=800'; -- Darbuka
        v_image_2 := 'https://images.unsplash.com/photo-1514320292840-7a872d9e8f99?w=800'; -- Davul
      -- TEKNOLOJİ & DİJİTAL
      WHEN 'fotografcilik-workshop' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800'; -- Fotoğraf makinesi
        v_image_2 := 'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=800'; -- Stüdyo fotoğraf
      WHEN 'mobil-fotografcilik' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800'; -- Telefon fotoğrafı
        v_image_2 := 'https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=800'; -- Mobil çekim
      WHEN 'video-editing' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800'; -- Video editörlüğü
        v_image_2 := 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800'; -- Montaj
      WHEN 'tiktok-reels' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800'; -- TikTok çekim
        v_image_2 := 'https://images.unsplash.com/photo-1611162616305-c69b3037c6f6?w=800'; -- Reels yapımı
      WHEN '3d-modelleme' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1551808525-51a94da548ce?w=800'; -- 3D modelleme
        v_image_2 := 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800'; -- 3D tasarım
      -- MODA & GİYİM
      WHEN 'dikis-atolyesi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1597010402031-8e6c4f9f5534?w=800'; -- Dikiş makinesi
        v_image_2 := 'https://images.unsplash.com/photo-1611564265205-7dabb6c5c0dd?w=800'; -- Dikiş atölyesi
      WHEN 'model-cizimi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800'; -- Model çizimi
        v_image_2 := 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=800'; -- Moda tasarım
      WHEN 'stil-danismanligi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800'; -- Stil danışmanlığı
        v_image_2 := 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800'; -- Kıyafet seçimi
      WHEN 'sapka-yapimi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800'; -- Şapka
        v_image_2 := 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=800'; -- Şapka yapımı
      WHEN 'canta-tasarimi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800'; -- Çanta tasarımı
        v_image_2 := 'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=800'; -- El çantası
      WHEN 'geri-donusum-moda' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=800'; -- Geri dönüşüm moda
        v_image_2 := 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800'; -- Sürdürülebilir moda
      WHEN 'batik-boyama' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1522424427542-e4b44604aecd?w=800'; -- Batik boyama
        v_image_2 := 'https://images.unsplash.com/photo-1558769132-92e717d613dc?w=800'; -- Batik kumaş
      -- EL İŞİ & ZANAAT
      WHEN 'comlek-tornasi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1578926375605-eaf7559b6377?w=800'; -- Çömlek tornası
        v_image_2 := 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800'; -- Torna çalışması
      WHEN 'ahsap-mobilya' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800'; -- Mobilya yapımı
        v_image_2 := 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800'; -- Ahşap çalışma
      WHEN 'oyuncak-tasarimi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800'; -- Oyuncak tasarımı
        v_image_2 := 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800'; -- Oyuncaklar
      WHEN 'ev-dekor' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800'; -- Ev dekorasyonu
        v_image_2 := 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=800'; -- Dekor objeleri
      WHEN 'kintsugi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800'; -- Kintsugi sanatı
        v_image_2 := 'https://images.unsplash.com/photo-1607619662634-3ac55ec0e216?w=800'; -- Seramik tamiri
      WHEN 'metal-isciligi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800'; -- Metal işçiliği
        v_image_2 := 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800'; -- Metal çalışma
      WHEN 'bileklik-aksesuar' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1611652022419-a9419f74343a?w=800'; -- Bileklik yapımı
        v_image_2 := 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800'; -- Aksesuar tasarımı
      -- KÜLTÜREL & GELENEKSEL
      WHEN 'turk-kahvesi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1514481538271-cf9f99627ab4?w=800'; -- Türk kahvesi
        v_image_2 := 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800'; -- Kahve fincanı
      WHEN 'gocebe-kulturu' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800'; -- Göçebe kültürü
        v_image_2 := 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800'; -- Geleneksel yaşam
      WHEN 'osmanli-tatlilari' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1587241321921-91a834d82ffc?w=800'; -- Osmanlı tatlıları
        v_image_2 := 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800'; -- Türk tatlıları
      WHEN 'cini-sanati' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1582746781614-94f13e0d5afe?w=800'; -- Çini sanatı
        v_image_2 := 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800'; -- Çini desenler
      WHEN 'geleneksel-taki' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1611652022419-a9419f74343a?w=800'; -- Geleneksel takı
        v_image_2 := 'https://images.unsplash.com/photo-1601618461615-196b2957d77c?w=800'; -- Antika takılar
      WHEN 'ebru-sanati-kulturel' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=800'; -- Ebru yapımı
        v_image_2 := 'https://images.unsplash.com/photo-1607619662634-3ac55ec0e216?w=800'; -- Ebru desenleri
      WHEN 'misafir-agirlama' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800'; -- Misafir ağırlama
        v_image_2 := 'https://images.unsplash.com/photo-1484659619207-9165d119dafe?w=800'; -- Türk sofrası
      WHEN 'turk-yemek' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800'; -- Türk yemekleri 1
        v_image_2 := 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800'; -- Türk yemekleri 2
      -- EĞLENCELİ & SOSYAL
      WHEN 'boya-sarap' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800'; -- Boyama etkinliği
        v_image_2 := 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800'; -- Şarap ile boyama
      WHEN 'kahve-tadimi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800'; -- Kahve tadımı
        v_image_2 := 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800'; -- Kahve çeşitleri
      WHEN 'puzzle-meetup' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1611891487272-ce988a0054d4?w=800'; -- Puzzle yapımı
        v_image_2 := 'https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=800'; -- Puzzle etkinliği
      WHEN 'oyun-gecesi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800'; -- Masa oyunları
        v_image_2 := 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800'; -- Oyun gecesi
      WHEN 'kokteyl-yap-ic' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800'; -- Kokteyl yapımı
        v_image_2 := 'https://images.unsplash.com/photo-1560508801-e8e1ca0e8f73?w=800'; -- Kokteyl içme
      WHEN 'sosyal-tanisma' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800'; -- Sosyal etkinlik
        v_image_2 := 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800'; -- Tanışma etkinliği
      WHEN 'stres-atma' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800'; -- Stres atma yoga
        v_image_2 := 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800'; -- Rahatlama
      ELSE
        -- Varsayılan görseller
        v_image_1 := 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800';
        v_image_2 := 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800';
    END CASE;

    -- İlk etkinliği ekle (Başlangıç)
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
    ) VALUES (
      v_workshop_id,
      v_subcategory.category_id,
      v_subcategory.id,
      v_subcategory.name || ' Başlangıç Workshop',
      'Bu ' || v_subcategory.name || ' atölyesinde temel teknikleri öğrenecek ve kendi eserinizi oluşturacaksınız. Tüm malzemeler dahil, deneyim gerekmez.',
      v_image_1,
      CURRENT_TIMESTAMP + INTERVAL '3 days',
      CURRENT_TIMESTAMP + INTERVAL '3 days' + INTERVAL '3 hours',
      CASE
        WHEN v_subcategory.slug LIKE '%cocuk%' THEN 150
        WHEN v_subcategory.slug LIKE '%ileri%' OR v_subcategory.slug LIKE '%profesyonel%' THEN 450
        ELSE 280
      END,
      CASE
        WHEN v_subcategory.slug LIKE '%cocuk%' THEN 20
        ELSE 15
      END,
      FLOOR(RANDOM() * 8 + 3)::INT,
      true,
      true
    );

    -- İkinci etkinliği ekle (İleri Seviye)
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
    ) VALUES (
      v_workshop_id,
      v_subcategory.category_id,
      v_subcategory.id,
      v_subcategory.name || ' İleri Seviye Atölye',
      'İleri seviye ' || v_subcategory.name || ' teknikleri. Bu atölyede daha detaylı çalışmalar yapacak ve kendinizi geliştireceksiniz.',
      v_image_2,
      CURRENT_TIMESTAMP + INTERVAL '10 days',
      CURRENT_TIMESTAMP + INTERVAL '10 days' + INTERVAL '4 hours',
      CASE
        WHEN v_subcategory.slug LIKE '%cocuk%' THEN 200
        WHEN v_subcategory.slug LIKE '%ileri%' OR v_subcategory.slug LIKE '%profesyonel%' THEN 550
        ELSE 380
      END,
      CASE
        WHEN v_subcategory.slug LIKE '%cocuk%' THEN 15
        ELSE 12
      END,
      FLOOR(RANDOM() * 6 + 2)::INT,
      true,
      true
    );
  END LOOP;

  -- Sonuçları göster
  SELECT COUNT(*) INTO v_event_count FROM events;
  RAISE NOTICE 'Toplam % etkinlik eklendi!', v_event_count;
  RAISE NOTICE 'Her alt kategori için 2 farklı görsel ile etkinlik oluşturuldu';
END $$;
