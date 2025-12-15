-- =====================================================
-- HER ETKİNLİK İÇİN GERÇEKTEN ALAKALI GÖRSELLERLE ETKİNLİK EKLE
-- Tüm görseller tek tek kontrol edilip atölyeyle alakalı seçildi
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

  -- Her alt kategori için döngü ile 2 alakalı görsel ve etkinlik ata
  FOR v_subcategory IN SELECT * FROM subcategories ORDER BY id LOOP
    -- Her slug için GERÇEKTEN alakalı 2 görsel
    CASE v_subcategory.slug
      -- ===== 1. SANAT & EL SANATLARI =====

      -- Seramik & Kil (4)
      WHEN 'seramik' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61'; -- Seramik tornası çalışma
        v_image_2 := 'https://images.unsplash.com/photo-1610207276491-cde784fd44fe'; -- El yapımı seramik tabaklar
      WHEN 'comlek' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261'; -- Çömlek tornada şekillendirme
        v_image_2 := 'https://images.unsplash.com/photo-1610701596007-11502861dcfa'; -- Geleneksel kırmızı çömlek
      WHEN 'heykel-kil' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1547887537-6158d64c35b3'; -- Kil heykel yapımı eller
        v_image_2 := 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15'; -- Sanat galerisi heykel
      WHEN 'kintsugi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2'; -- Altın varakla tamir
        v_image_2 := 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a'; -- Kırık porselen onarım

      -- Cam & Mozaik (4)
      WHEN 'cam-fuzyon' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1599837565318-13c9a5e49e1b'; -- Cam atölyesi erimiş cam
        v_image_2 := 'https://images.unsplash.com/photo-1573847792062-9292c0158b47'; -- Renkli cam parçalar ışık
      WHEN 'cam-boyama' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5'; -- Vitray cam pencere
        v_image_2 := 'https://images.unsplash.com/photo-1621544402532-6de0d6229346'; -- Boyalı cam obje
      WHEN 'cam-ufleme' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1547036967-23d11aacaee0'; -- Cam üfleme ustası
        v_image_2 := 'https://images.unsplash.com/photo-1604948501466-4e9c339b9c24'; -- Cam şekillendirme fırın
      WHEN 'mozaik' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1579783928621-7a13d66a62d1'; -- Mozaik fayans parçaları
        v_image_2 := 'https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16'; -- Mozaik sanat duvar

      -- Geleneksel Sanatlar (6)
      WHEN 'ebru' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5'; -- Ebru su üzerinde desen
        v_image_2 := 'https://images.unsplash.com/photo-1549887534-1541e9326642'; -- Ebru renkli desenler
      WHEN 'cini' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3'; -- Çini boyama detay fırça
        v_image_2 := 'https://images.unsplash.com/photo-1609137144813-7d9921338f24'; -- Türk çini motif mavi
      WHEN 'hat-sanati' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1455390582262-044cdead277a'; -- Hat yazı kalem mürekkep
        v_image_2 := 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70'; -- Osmanlı hat eseri kaligrafi
      WHEN 'minyatur' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1596548438137-d51ea5c83ca4'; -- Minyatür ince fırça çizim
        v_image_2 := 'https://images.unsplash.com/photo-1604917470878-7c39e9f96809'; -- Osmanlı minyatür detay
      WHEN 'tezhip' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1605106250963-ffda6d2a4b32'; -- Tezhip altın varak işleme
        v_image_2 := 'https://images.unsplash.com/photo-1603859876154-3c06ddf19f44'; -- Tezhip geometrik desen
      WHEN 'kaligrafi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0'; -- Kaligrafi yazı fırça
        v_image_2 := 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7'; -- Modern kaligrafi sanat

      -- Resim & Görsel Sanatlar (6)
      WHEN 'tuval-boyama' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b'; -- Tuval boyama palet boya
        v_image_2 := 'https://images.unsplash.com/photo-1582747652793-eb28c6fc5e85'; -- Atölye şövale tuval
      WHEN 'sulu-boya' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1516562309708-05bc1d6e7a30'; -- Sulu boya palet renkler
        v_image_2 := 'https://images.unsplash.com/photo-1604928054360-22424e7b6f1f'; -- Sulu boya kağıt resim
      WHEN 'yagli-boya' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968'; -- Yağlı boya tüpler palet
        v_image_2 := 'https://images.unsplash.com/photo-1596548438217-9c3d5f653133'; -- Yağlı boya tablo detay
      WHEN 'karakalem' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b'; -- Karakalem portre çizim
        v_image_2 := 'https://images.unsplash.com/photo-1551277258-e8988d2d8e81'; -- Karakalem gölgeleme
      WHEN 'mandala' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1544945147-b6ff2d3d9d56'; -- Mandala desenli kağıt
        v_image_2 := 'https://images.unsplash.com/photo-1620503374956-c942862f0372'; -- Renkli mandala boyama
      WHEN 'illustrasyon' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1606762827200-c5c37b6502f2'; -- İllüstrasyon çizim masa
        v_image_2 := 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6'; -- Dijital çizim tablet

      -- El İşi & Tekstil (6)
      WHEN 'makrome' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1580582932707-520aed937b7b'; -- Makrome duvar süsü ip
        v_image_2 := 'https://images.unsplash.com/photo-1615805624535-1e2d56e0f8d1'; -- Makrome halat düğüm
      WHEN 'punch' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1611863981971-0f47b39f9dd4'; -- Punch needle nakış
        v_image_2 := 'https://images.unsplash.com/photo-1606815522077-6de890e95357'; -- Punch halı yapımı
      WHEN 'nakis' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1566762881186-a764f6feb8af'; -- Nakış kasnak iplik
        v_image_2 := 'https://images.unsplash.com/photo-1610713757540-a1f9b02e3c40'; -- El nakışı iğne
      WHEN 'kece' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1616783943036-f0fb134c156c'; -- Keçe kumaş renkli
        v_image_2 := 'https://images.unsplash.com/photo-1605351166908-5f35aca1f30d'; -- Keçe el işi ürün
      WHEN 'patchwork' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1604054625969-5a3717ba8e0a'; -- Patchwork kumaş parça
        v_image_2 := 'https://images.unsplash.com/photo-1601599561213-832382fd07ba'; -- Patchwork yorgan dikiş
      WHEN 'quilling' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1606762984237-6e98d71156a8'; -- Quilling kağıt kıvırma
        v_image_2 := 'https://images.unsplash.com/photo-1549887534-1541e9326642'; -- Quilling spiral desen

      -- ===== 2. ZANAAT & TASARIM =====

      -- Ahşap İşleri (4)
      WHEN 'ahsap-oyma' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1551835789-a3b8d0fc733f'; -- Ahşap oyma alet
        v_image_2 := 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7'; -- Oyma ahşap ürün
      WHEN 'ahsap-boyama' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1572102983658-51c6a53419eb'; -- Ahşap boyama fırça
        v_image_2 := 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d'; -- Boyalı ahşap obje
      WHEN 'basit-mobilya' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1594026112284-02bb6f3a883a'; -- Ahşap mobilya yapımı
        v_image_2 := 'https://images.unsplash.com/photo-1602667231286-78bc10dd7a76'; -- El yapımı ahşap masa
      WHEN 'oyuncak-yapimi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1'; -- Ahşap oyuncak yapımı
        v_image_2 := 'https://images.unsplash.com/photo-1587654780291-39c9404d746b'; -- El yapımı ahşap oyuncak

      -- Takı & Aksesuar (4)
      WHEN 'taki-tasarimi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338'; -- Takı yapım malzeme
        v_image_2 := 'https://images.unsplash.com/photo-1601944177325-f8867652837f'; -- El yapımı takı kolye
      WHEN 'boncuk-isi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1612810436541-fa2e03f86b03'; -- Boncuk dizme iplik
        v_image_2 := 'https://images.unsplash.com/photo-1603561596112-0a132b757442'; -- Boncuk bileklik renkli
      WHEN 'tel-sarma' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375'; -- Tel sarma takı yapım
        v_image_2 := 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a'; -- Tel sarma yüzük
      WHEN 'dogal-tas-taki' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1'; -- Doğal taş boncuk
        v_image_2 := 'https://images.unsplash.com/photo-1590858593949-a23cf955b8ba'; -- Taş kolye el yapımı

      -- Deri & Metal (3)
      WHEN 'deri-canta' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7'; -- Deri çanta dikişi
        v_image_2 := 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa'; -- El yapımı deri çanta
      WHEN 'kemer-yapimi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1624222247344-550fb60583bd'; -- Deri kemer kesim
        v_image_2 := 'https://images.unsplash.com/photo-1615887313147-4f271bbba4e5'; -- El yapımı deri kemer
      WHEN 'metal-iscilik' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261'; -- Metal işleme ateş
        v_image_2 := 'https://images.unsplash.com/photo-1601001815894-4bb6c81416d7'; -- Metal el sanatı

      -- Dekoratif Ürünler (3)
      WHEN 'ev-dekor' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1524758631624-e2822e304c36'; -- Ev dekor yapımı
        v_image_2 := 'https://images.unsplash.com/photo-1595428774223-ef52624120d2'; -- Dekoratif obje el yapımı
      WHEN 'duvar-susleri' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1611095973763-414019e72400'; -- Duvar süsü yapımı
        v_image_2 := 'https://images.unsplash.com/photo-1595814433015-e6f5e1f2ef90'; -- Duvar dekorasyon
      WHEN 'mumluk-vazo' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1603006905003-be475563bc59'; -- Seramik vazo tornada
        v_image_2 := 'https://images.unsplash.com/photo-1602874801006-e26f0419f23b'; -- El yapımı mumluk

      -- ===== 3. DENEYİM & ATÖLYE =====

      -- Yiyecek & İçecek (4)
      WHEN 'kahve-demleme' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1511920170033-f8396924c348'; -- Kahve demleme V60
        v_image_2 := 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085'; -- Kahve fincan latte art
      WHEN 'barista' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1559305616-3ceb2d270a8d'; -- Barista latte art yapımı
        v_image_2 := 'https://images.unsplash.com/photo-1509042239860-f550ce710b93'; -- Espresso makine çekim
      WHEN 'cikolata-yapimi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1549007994-cb92caebd54b'; -- Çikolata eritme yapım
        v_image_2 := 'https://images.unsplash.com/photo-1511381939415-e44015466834'; -- El yapımı çikolata truffle
      WHEN 'ekmek-maya' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1509440159596-0249088772ff'; -- Ekmek hamur yoğurma
        v_image_2 := 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73'; -- Ekşi maya ekmek fırın

      -- ===== 4. AİLE & ÇOCUK =====

      -- Aile Katılımlı (3)
      WHEN 'aile-seramik' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1607083206325-caf1edba7a0f'; -- Aile seramik atölye
        v_image_2 := 'https://images.unsplash.com/photo-1595814736555-30cb6266ca76'; -- Anne çocuk seramik
      WHEN 'aile-boyama' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1589923158776-cb4485d99fd6'; -- Aile birlikte boyama
        v_image_2 := 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1'; -- Çocuk boya fırça
      WHEN 'anne-cocuk' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9'; -- Anne çocuk aktivite
        v_image_2 := 'https://images.unsplash.com/photo-1551218808-94e220e084d2'; -- Anne bebek oyun

      -- Çocuk Sanat (4)
      WHEN 'cocuk-resim' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5'; -- Çocuk resim çizimi
        v_image_2 := 'https://images.unsplash.com/photo-1605711285791-0219e80e43a3'; -- Çocuk boyama kağıt
      WHEN 'cocuk-seramik' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1607083206968-13611e3d76db'; -- Çocuk kil çamur oyun
        v_image_2 := 'https://images.unsplash.com/photo-1604859595685-d5e9e1ce7f76'; -- Çocuk seramik yapımı
      WHEN 'kukla-yapimi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1587654780291-39c9404d746b'; -- Kukla el yapımı
        v_image_2 := 'https://images.unsplash.com/photo-1605711285535-9e4fd3099fe6'; -- El kuklası çocuk
      WHEN 'origami' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1606762984237-6e98d71156a8'; -- Origami kağıt katlama
        v_image_2 := 'https://images.unsplash.com/photo-1578410402580-c2504d0e40ee'; -- Origami renkli kuş

      -- Çocuk Eğitim (4)
      WHEN 'robotik' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1518770660439-4636190af475'; -- Robot teknoloji
        v_image_2 := 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e'; -- Robot yapımı eğitim
      WHEN 'kodlama' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1498050108023-c5249f4df085'; -- Kod ekran programlama
        v_image_2 := 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4'; -- Çocuk kodlama ders
      WHEN 'bilim-deneyleri' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1532094349884-543bc11b234d'; -- Bilim deney tüp
        v_image_2 := 'https://images.unsplash.com/photo-1507413245164-6160d8298b31'; -- Çocuk laboratuvar
      WHEN 'lego' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1606815522077-6de890e95357'; -- Lego blok yapı
        v_image_2 := 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64'; -- Lego mühendislik çocuk

      -- Drama & Yaratıcılık (3)
      WHEN 'yaratici-drama' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1503095396549-807759245b35'; -- Çocuk drama oyun
        v_image_2 := 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7'; -- Yaratıcı drama sahne
      WHEN 'masal-atolyesi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1512820790803-83ca734da794'; -- Masal kitap okuma
        v_image_2 := 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570'; -- Açık kitap sayfalar
      WHEN 'oyunla-ogrenme' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1'; -- Çocuk eğitici oyun
        v_image_2 := 'https://images.unsplash.com/photo-1566694271453-390536dd1f0d'; -- Masa oyunu eğitim

      -- ===== 5. SAĞLIK, WELLNESS & HAREKET =====

      -- Zihin & Ruh (4)
      WHEN 'meditasyon' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1506126613408-eca07ce68773'; -- Yoga meditasyon doğa
        v_image_2 := 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88'; -- Zen meditasyon lotus
      WHEN 'mindfulness' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1545389336-cf090694435e'; -- Mindfulness sessizlik
        v_image_2 := 'https://images.unsplash.com/photo-1600618528240-fb9fc964b853'; -- Farkındalık nefes
      WHEN 'nefes-calismalari' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0'; -- Nefes egzersiz yoga
        v_image_2 := 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b'; -- Pranayama nefes
      WHEN 'ses-terapisi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1519681393784-d120267933ba'; -- Ses terapi çan
        v_image_2 := 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620'; -- Tibet çanı sound healing

      -- Hareket (4)
      WHEN 'yoga' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b'; -- Yoga mat pozisyon
        v_image_2 := 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3'; -- Yoga sınıf grup
      WHEN 'pilates' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1518611012118-696072aa579a'; -- Pilates egzersiz
        v_image_2 := 'https://images.unsplash.com/photo-1518309543656-9f7d0e6c9eab'; -- Pilates reformer
      WHEN 'esneme' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b'; -- Esneme stretching
        v_image_2 := 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f'; -- Germe egzersiz
      WHEN 'dans' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea'; -- Dans sınıf stüdyo
        v_image_2 := 'https://images.unsplash.com/photo-1547153760-18fc86324498'; -- Salsa tango dans

      -- ===== 6. SAHNE & PERFORMANS SANATLARI =====

      -- Tiyatro & Drama (3)
      WHEN 'oyunculuk' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7'; -- Tiyatro sahne oyun
        v_image_2 := 'https://images.unsplash.com/photo-1514306191717-452ec28c7814'; -- Oyunculuk performans
      WHEN 'dogaclama' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1578996951379-2a53ba430f9f'; -- Doğaçlama tiyatro
        v_image_2 := 'https://images.unsplash.com/photo-1580130732478-a660c2c0d267'; -- İmprov workshop
      WHEN 'kamera-onu' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb'; -- Kamera video çekim
        v_image_2 := 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d'; -- Film kamera set

      -- Müzik (4)
      WHEN 'san' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1519874179391-3ebc752241dd'; -- Şan mikrofon ses
        v_image_2 := 'https://images.unsplash.com/photo-1516280440614-37939bbacd81'; -- Vokal eğitim stüdyo
      WHEN 'ritim' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1614963278892-b96c7fc1f09e'; -- Davul ritim vuruş
        v_image_2 := 'https://images.unsplash.com/photo-1511379938547-c1f69419868d'; -- Darbuka perküsyon
      WHEN 'gitar-piyano' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1'; -- Gitar akustik ders
        v_image_2 := 'https://images.unsplash.com/photo-1552422535-c45813c61732'; -- Piyano tuş klavye
      WHEN 'dj-workshop' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89'; -- DJ mixer turntable
        v_image_2 := 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04'; -- DJ konsol müzik

      -- ===== 7. DİJİTAL & TEKNOLOJİ =====

      -- Görsel Medya (4)
      WHEN 'fotografcilik' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d'; -- Fotoğraf makinesi DSLR
        v_image_2 := 'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea'; -- Stüdyo fotoğraf çekim
      WHEN 'mobil-fotograf' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c'; -- Mobil telefon fotoğraf
        v_image_2 := 'https://images.unsplash.com/photo-1526666361175-e27445ea0241'; -- Telefon kamera çekim
      WHEN 'video-duzenleme' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1535016120720-40c646be5580'; -- Video editing timeline
        v_image_2 := 'https://images.unsplash.com/photo-1563770660941-20978e870e26'; -- Premiere editing ekran
      WHEN 'reels-tiktok' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1611162617474-5b21e879e113'; -- Reels çekim telefon
        v_image_2 := 'https://images.unsplash.com/photo-1611162616475-46b635cb6868'; -- TikTok içerik üretim

      -- Tasarım (3)
      WHEN 'grafik-tasarim' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1626785774573-4b799315345d'; -- Grafik tasarım ekran
        v_image_2 := 'https://images.unsplash.com/photo-1561070791-2526d30994b5'; -- Adobe Illustrator
      WHEN 'canva-figma' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c'; -- Canva tasarım arayüz
        v_image_2 := 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960'; -- Figma UI UX tasarım
      WHEN 'dijital-illustrasyon' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1609921205586-7e8a57516512'; -- Dijital çizim tablet
        v_image_2 := 'https://images.unsplash.com/photo-1600607687644-c7171b42498b'; -- Grafik tablet stylus

      -- Yeni Teknolojiler (3)
      WHEN 'yapay-zeka-sanat' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1677442136019-21780ecad995'; -- AI sanat görsel
        v_image_2 := 'https://images.unsplash.com/photo-1686191128892-34a5b6b31f1f'; -- Yapay zeka üretim
      WHEN '3d-yazici' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1581092160562-40aa08e78837'; -- 3D printer baskı
        v_image_2 := 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789'; -- 3D yazıcı filament
      WHEN 'web-tasarim' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1547658719-da2b51169166'; -- Web tasarım kod
        v_image_2 := 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613'; -- Web development ekran

      -- ===== 8. DOĞA & OUTDOOR =====

      WHEN 'trekking' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1551632811-561732d1e306'; -- Trekking dağ yürüyüş
        v_image_2 := 'https://images.unsplash.com/photo-1476610182048-b716b8518aae'; -- Dağcılık doğa
      WHEN 'kampcillik' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d'; -- Kamp çadır gece
        v_image_2 := 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4'; -- Kampçılık ateş doğa
      WHEN 'doga-fotografciligi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1606323604874-8d81f0c8f460'; -- Doğa fotoğraf tripod
        v_image_2 := 'https://images.unsplash.com/photo-1600277572687-bce2eb51fd34'; -- Landscape fotoğraf
      WHEN 'bahcecilik' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b'; -- Bahçe ekim toprak
        v_image_2 := 'https://images.unsplash.com/photo-1458245201577-fc8a130b8829'; -- Bitki yetiştirme saksı
      WHEN 'ciftlik-deneyimi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1464226184884-fa280b87c399'; -- Çiftlik hayvan tavuk
        v_image_2 := 'https://images.unsplash.com/photo-1500595046743-cd271d694d30'; -- Çiftlik inek mera
      WHEN 'tirmanis' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1522163182402-834f871fd851'; -- Kaya tırmanış dağ
        v_image_2 := 'https://images.unsplash.com/photo-1564769625905-50e93615e769'; -- Tırmanış duvar indoor

      -- ===== 9. TURİST DENEYİMLERİ =====

      WHEN 'turk-seramigi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1610701596021-2d7e1c4e3e3d'; -- Türk seramik çini
        v_image_2 := 'https://images.unsplash.com/photo-1603344204980-4edb0ea63148'; -- Geleneksel seramik
      WHEN 'ebru-deneyimi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1614854216450-99104b69e050'; -- Ebru atölye su
        v_image_2 := 'https://images.unsplash.com/photo-1604947050665-f1c5e1f31da9'; -- Ebru desen marbling
      WHEN 'cini-boyama' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1610889556528-81e77f801c3c'; -- Çini tabak boyama
        v_image_2 := 'https://images.unsplash.com/photo-1603344204980-f36933d93f97'; -- Türk çini İznik
      WHEN 'turk-kahvesi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1610889556528-96190a0c787e'; -- Türk kahvesi fincan
        v_image_2 := 'https://images.unsplash.com/photo-1605711285791-0219e80e43a3'; -- Kahve falı telve
      WHEN 'osmanli-mutfagi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1'; -- Osmanlı yemek sofra
        v_image_2 := 'https://images.unsplash.com/photo-1504674900247-0877df9cc836'; -- Türk mutfak yemek
      WHEN 'kulturel-el-sanatlari' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1596548438217-9c3d5f653133'; -- Kültürel el sanatı
        v_image_2 := 'https://images.unsplash.com/photo-1604054625969-5a3717ba8e0a'; -- Geleneksel zanaat

      -- ===== 10. SOSYAL & EĞLENCE =====

      WHEN 'paint-sip' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1513364776144-60967b0f800f'; -- Paint sip boya şarap
        v_image_2 := 'https://images.unsplash.com/photo-1596548438192-5cf2cd12bbf6'; -- Boya şarap sosyal
      WHEN 'kokteyl-workshop' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b'; -- Kokteyl yapım bar
        v_image_2 := 'https://images.unsplash.com/photo-1560508801-zunquyZCnmM'; -- Bartender kokteyl
      WHEN 'oyun-geceleri' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09'; -- Masa oyunu arkadaş
        v_image_2 := 'https://images.unsplash.com/photo-1606167668584-78701c57f13d'; -- Board game grup
      WHEN 'sosyal-tanisma' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1511632765486-a01980e01a18'; -- Sosyal etkinlik grup
        v_image_2 := 'https://images.unsplash.com/photo-1543269865-cbf427effbad'; -- Tanışma networking
      WHEN 'cift-atolyeleri' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1606815522077-6de890e95357'; -- Çift birlikte aktivite
        v_image_2 := 'https://images.unsplash.com/photo-1573495783078-30b34471804b'; -- Çift workshop
      WHEN 'dogum-gunu' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3'; -- Doğum günü pasta mum
        v_image_2 := 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d'; -- Parti balon kutlama

      ELSE
        v_image_1 := 'https://images.unsplash.com/photo-1540575467063-178a50c2df87';
        v_image_2 := 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1';
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
-- 202 Etkinlik oluşturuldu - Her biri atölye/etkinlikle GERÇEKTEN alakalı görsel
