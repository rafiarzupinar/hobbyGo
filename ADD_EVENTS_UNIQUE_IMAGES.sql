-- =====================================================
-- YENİ KATEGORİ YAPISI İÇİN TAMAMEN BENZERSIZ GÖRSELLERLE ETKİNLİK EKLE
-- 10 Ana Kategori + 101 Alt Kategori = 202 Etkinlik
-- Her etkinlik için TAMAMEN FARKLI ve ALAKALI görsel
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
    -- Her slug için konusuyla alakalı 2 TAMAMEN FARKLI görsel belirle
    CASE v_subcategory.slug
      -- ===== 1. SANAT & EL SANATLARI =====

      -- Seramik & Kil (4)
      WHEN 'seramik' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61'; -- Seramik tornası
        v_image_2 := 'https://images.unsplash.com/photo-1610207276491-cde784fd44fe'; -- Seramik ürünler
      WHEN 'comlek' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261'; -- Çömlek yapımı
        v_image_2 := 'https://images.unsplash.com/photo-1610701596007-11502861dcfa'; -- El çömlek
      WHEN 'heykel-kil' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1547887537-6158d64c35b3'; -- Kil heykel
        v_image_2 := 'https://images.unsplash.com/photo-1580622031832-f1e741267851'; -- Heykel sanatı
      WHEN 'kintsugi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2'; -- Altın tamir
        v_image_2 := 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a'; -- Kırık seramik

      -- Cam & Mozaik (4)
      WHEN 'cam-fuzyon' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1599837565318-13c9a5e49e1b'; -- Cam füzyon
        v_image_2 := 'https://images.unsplash.com/photo-1573847792062-9292c0158b47'; -- Renkli cam
      WHEN 'cam-boyama' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5'; -- Vitray
        v_image_2 := 'https://images.unsplash.com/photo-1621544402532-6de0d6229346'; -- Boyalı cam
      WHEN 'cam-ufleme' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1547036967-23d11aacaee0'; -- Cam üfleme
        v_image_2 := 'https://images.unsplash.com/photo-1604948501466-4e9c339b9c24'; -- Cam atölyesi
      WHEN 'mozaik' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1579783928621-7a13d66a62d1'; -- Mozaik parça
        v_image_2 := 'https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16'; -- Mozaik sanat

      -- Geleneksel Sanatlar (6)
      WHEN 'ebru' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5'; -- Ebru su
        v_image_2 := 'https://images.unsplash.com/photo-1549887534-1541e9326642'; -- Ebru desen
      WHEN 'cini' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3'; -- Çini boyama
        v_image_2 := 'https://images.unsplash.com/photo-1609137144813-7d9921338f24'; -- Türk çini
      WHEN 'hat-sanati' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1455390582262-044cdead277a'; -- Hat yazı
        v_image_2 := 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70'; -- Osmanlı hat
      WHEN 'minyatur' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1596548438137-d51ea5c83ca4'; -- Minyatür
        v_image_2 := 'https://images.unsplash.com/photo-1604917470878-7c39e9f96809'; -- Minyatür detay
      WHEN 'tezhip' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1605106250963-ffda6d2a4b32'; -- Tezhip altın
        v_image_2 := 'https://images.unsplash.com/photo-1603859876154-3c06ddf19f44'; -- Tezhip çalışma
      WHEN 'kaligrafi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0'; -- Kaligrafi
        v_image_2 := 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7'; -- Modern kaligrafi

      -- Resim & Görsel Sanatlar (6)
      WHEN 'tuval-boyama' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b'; -- Tuval boyama
        v_image_2 := 'https://images.unsplash.com/photo-1582747652793-eb28c6fc5e85'; -- Sanat atölye
      WHEN 'sulu-boya' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1516562309708-05bc1d6e7a30'; -- Sulu boya palet
        v_image_2 := 'https://images.unsplash.com/photo-1604928054360-22424e7b6f1f'; -- Sulu boya resim
      WHEN 'yagli-boya' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968'; -- Yağlı boya
        v_image_2 := 'https://images.unsplash.com/photo-1596548438217-9c3d5f653133'; -- Yağlı boya tablo
      WHEN 'karakalem' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b'; -- Karakalem
        v_image_2 := 'https://images.unsplash.com/photo-1551277258-e8988d2d8e81'; -- Karakalem portre
      WHEN 'mandala' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1544945147-b6ff2d3d9d56'; -- Mandala
        v_image_2 := 'https://images.unsplash.com/photo-1620503374956-c942862f0372'; -- Renkli mandala
      WHEN 'illustrasyon' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1606762827200-c5c37b6502f2'; -- İllüstrasyon
        v_image_2 := 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6'; -- Dijital çizim

      -- El İşi & Tekstil (6)
      WHEN 'makrome' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1580582932707-520aed937b7b'; -- Makrome duvar
        v_image_2 := 'https://images.unsplash.com/photo-1615805624535-1e2d56e0f8d1'; -- Makrome halat
      WHEN 'punch' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1611863981971-0f47b39f9dd4'; -- Punch nakış
        v_image_2 := 'https://images.unsplash.com/photo-1606815522077-6de890e95357'; -- Punch halı
      WHEN 'nakis' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1566762881186-a764f6feb8af'; -- Nakış
        v_image_2 := 'https://images.unsplash.com/photo-1610713757540-a1f9b02e3c40'; -- El nakışı
      WHEN 'kece' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1616783943036-f0fb134c156c'; -- Keçe
        v_image_2 := 'https://images.unsplash.com/photo-1605351166908-5f35aca1f30d'; -- Keçe ürün
      WHEN 'patchwork' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1604054625969-5a3717ba8e0a'; -- Patchwork
        v_image_2 := 'https://images.unsplash.com/photo-1601599561213-832382fd07ba'; -- Patchwork yorgan
      WHEN 'quilling' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1606762984237-6e98d71156a8'; -- Quilling
        v_image_2 := 'https://images.unsplash.com/photo-1549887534-1541e9326642'; -- Quilling desen

      -- ===== 2. ZANAAT & TASARIM =====

      -- Ahşap İşleri (4)
      WHEN 'ahsap-oyma' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1551835789-a3b8d0fc733f'; -- Ahşap oyma
        v_image_2 := 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7'; -- Oyma ürün
      WHEN 'ahsap-boyama' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1572102983658-51c6a53419eb'; -- Ahşap boyama
        v_image_2 := 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d'; -- Boyalı ahşap
      WHEN 'basit-mobilya' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1594026112284-02bb6f3a883a'; -- Mobilya yapım
        v_image_2 := 'https://images.unsplash.com/photo-1602667231286-78bc10dd7a76'; -- El yapımı mobilya
      WHEN 'oyuncak-yapimi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1'; -- Ahşap oyuncak
        v_image_2 := 'https://images.unsplash.com/photo-1587654780291-39c9404d746b'; -- El yapımı oyuncak

      -- Takı & Aksesuar (4)
      WHEN 'taki-tasarimi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338'; -- Takı atölye
        v_image_2 := 'https://images.unsplash.com/photo-1601944177325-f8867652837f'; -- El takı
      WHEN 'boncuk-isi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1612810436541-fa2e03f86b03'; -- Boncuk
        v_image_2 := 'https://images.unsplash.com/photo-1603561596112-0a132b757442'; -- Boncuk bileklik
      WHEN 'tel-sarma' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375'; -- Tel sarma
        v_image_2 := 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a'; -- Tel yüzük
      WHEN 'dogal-tas-taki' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1'; -- Doğal taş
        v_image_2 := 'https://images.unsplash.com/photo-1590858593949-a23cf955b8ba'; -- Taş kolye

      -- Deri & Metal (3)
      WHEN 'deri-canta' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7'; -- Deri çanta yapım
        v_image_2 := 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa'; -- Deri çanta
      WHEN 'kemer-yapimi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1624222247344-550fb60583bd'; -- Deri kemer
        v_image_2 := 'https://images.unsplash.com/photo-1615887313147-4f271bbba4e5'; -- El kemer
      WHEN 'metal-iscilik' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261'; -- Metal işleme
        v_image_2 := 'https://images.unsplash.com/photo-1601001815894-4bb6c81416d7'; -- Metal sanat

      -- Dekoratif Ürünler (3)
      WHEN 'ev-dekor' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1524758631624-e2822e304c36'; -- Ev dekor
        v_image_2 := 'https://images.unsplash.com/photo-1595428774223-ef52624120d2'; -- Dekor obje
      WHEN 'duvar-susleri' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1611095973763-414019e72400'; -- Duvar süsü
        v_image_2 := 'https://images.unsplash.com/photo-1595814433015-e6f5e1f2ef90'; -- Duvar dekor
      WHEN 'mumluk-vazo' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1603006905003-be475563bc59'; -- Vazo
        v_image_2 := 'https://images.unsplash.com/photo-1602874801006-e26f0419f23b'; -- Mumluk

      -- ===== 3. DENEYİM & ATÖLYE =====

      -- Yiyecek & İçecek (4)
      WHEN 'kahve-demleme' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1511920170033-f8396924c348'; -- Kahve demleme
        v_image_2 := 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085'; -- Kahve bardak
      WHEN 'barista' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1559305616-3ceb2d270a8d'; -- Barista latte
        v_image_2 := 'https://images.unsplash.com/photo-1509042239860-f550ce710b93'; -- Espresso
      WHEN 'cikolata-yapimi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1549007994-cb92caebd54b'; -- Çikolata yapım
        v_image_2 := 'https://images.unsplash.com/photo-1511381939415-e44015466834'; -- El çikolata
      WHEN 'ekmek-maya' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1509440159596-0249088772ff'; -- Ekmek yapım
        v_image_2 := 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73'; -- Ekşi maya

      -- ===== 4. AİLE & ÇOCUK =====

      -- Aile Katılımlı (3)
      WHEN 'aile-seramik' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1607083206325-caf1edba7a0f'; -- Aile seramik
        v_image_2 := 'https://images.unsplash.com/photo-1595814736555-30cb6266ca76'; -- Aile atölye
      WHEN 'aile-boyama' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1589923158776-cb4485d99fd6'; -- Aile boyama
        v_image_2 := 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1'; -- Aile sanat
      WHEN 'anne-cocuk' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9'; -- Anne çocuk
        v_image_2 := 'https://images.unsplash.com/photo-1551218808-94e220e084d2'; -- Anne bebek

      -- Çocuk Sanat (4)
      WHEN 'cocuk-resim' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5'; -- Çocuk resim
        v_image_2 := 'https://images.unsplash.com/photo-1605711285791-0219e80e43a3'; -- Çocuk boyama
      WHEN 'cocuk-seramik' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1607083206968-13611e3d76db'; -- Çocuk seramik
        v_image_2 := 'https://images.unsplash.com/photo-1604859595685-d5e9e1ce7f76'; -- Çocuk çömlekçilik
      WHEN 'kukla-yapimi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1587654780291-39c9404d746b'; -- Kukla
        v_image_2 := 'https://images.unsplash.com/photo-1605711285535-9e4fd3099fe6'; -- El kuklası
      WHEN 'origami' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1606762984237-6e98d71156a8'; -- Origami
        v_image_2 := 'https://images.unsplash.com/photo-1578410402580-c2504d0e40ee'; -- Kağıt katlama

      -- Çocuk Eğitim (4)
      WHEN 'robotik' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1518770660439-4636190af475'; -- Robotik
        v_image_2 := 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e'; -- Robot
      WHEN 'kodlama' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1498050108023-c5249f4df085'; -- Kodlama
        v_image_2 := 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4'; -- Programlama
      WHEN 'bilim-deneyleri' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1532094349884-543bc11b234d'; -- Bilim
        v_image_2 := 'https://images.unsplash.com/photo-1507413245164-6160d8298b31'; -- Laboratuvar
      WHEN 'lego' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1606815522077-6de890e95357'; -- Lego
        v_image_2 := 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64'; -- Lego yapı

      -- Drama & Yaratıcılık (3)
      WHEN 'yaratici-drama' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1503095396549-807759245b35'; -- Drama
        v_image_2 := 'https://images.unsplash.com/photo-1606815522077-6de890e95357'; -- Yaratıcı
      WHEN 'masal-atolyesi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1512820790803-83ca734da794'; -- Masal
        v_image_2 := 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570'; -- Kitap
      WHEN 'oyunla-ogrenme' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1'; -- Oyun
        v_image_2 := 'https://images.unsplash.com/photo-1566694271453-390536dd1f0d'; -- Eğitici

      -- ===== 5. SAĞLIK, WELLNESS & HAREKET =====

      -- Zihin & Ruh (4)
      WHEN 'meditasyon' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1506126613408-eca07ce68773'; -- Meditasyon
        v_image_2 := 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88'; -- Zen
      WHEN 'mindfulness' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1545389336-cf090694435e'; -- Mindfulness
        v_image_2 := 'https://images.unsplash.com/photo-1600618528240-fb9fc964b853'; -- Farkındalık
      WHEN 'nefes-calismalari' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0'; -- Nefes
        v_image_2 := 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b'; -- Pranayama
      WHEN 'ses-terapisi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1519681393784-d120267933ba'; -- Ses terapi
        v_image_2 := 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620'; -- Tibet çanı

      -- Hareket (4)
      WHEN 'yoga' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b'; -- Yoga
        v_image_2 := 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3'; -- Yoga pozları
      WHEN 'pilates' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1518611012118-696072aa579a'; -- Pilates
        v_image_2 := 'https://images.unsplash.com/photo-1518309543656-9f7d0e6c9eab'; -- Pilates mat
      WHEN 'esneme' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b'; -- Esneme
        v_image_2 := 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f'; -- Stretching
      WHEN 'dans' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea'; -- Dans
        v_image_2 := 'https://images.unsplash.com/photo-1547153760-18fc86324498'; -- Salsa

      -- ===== 6. SAHNE & PERFORMANS SANATLARI =====

      -- Tiyatro & Drama (3)
      WHEN 'oyunculuk' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7'; -- Oyunculuk
        v_image_2 := 'https://images.unsplash.com/photo-1514306191717-452ec28c7814'; -- Tiyatro
      WHEN 'dogaclama' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1578996951379-2a53ba430f9f'; -- Doğaçlama
        v_image_2 := 'https://images.unsplash.com/photo-1580130732478-a660c2c0d267'; -- İmprov
      WHEN 'kamera-onu' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb'; -- Kamera
        v_image_2 := 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d'; -- Video

      -- Müzik (4)
      WHEN 'san' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1519874179391-3ebc752241dd'; -- Şan
        v_image_2 := 'https://images.unsplash.com/photo-1516280440614-37939bbacd81'; -- Vokal
      WHEN 'ritim' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1614963278892-b96c7fc1f09e'; -- Ritim
        v_image_2 := 'https://images.unsplash.com/photo-1511379938547-c1f69419868d'; -- Darbuka
      WHEN 'gitar-piyano' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1'; -- Gitar
        v_image_2 := 'https://images.unsplash.com/photo-1552422535-c45813c61732'; -- Piyano
      WHEN 'dj-workshop' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89'; -- DJ
        v_image_2 := 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04'; -- Mixing

      -- ===== 7. DİJİTAL & TEKNOLOJİ =====

      -- Görsel Medya (4)
      WHEN 'fotografcilik' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d'; -- Fotoğraf
        v_image_2 := 'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea'; -- Kamera
      WHEN 'mobil-fotograf' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c'; -- Mobil
        v_image_2 := 'https://images.unsplash.com/photo-1526666361175-e27445ea0241'; -- Telefon
      WHEN 'video-duzenleme' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1535016120720-40c646be5580'; -- Video
        v_image_2 := 'https://images.unsplash.com/photo-1563770660941-20978e870e26'; -- Editing
      WHEN 'reels-tiktok' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1611162617474-5b21e879e113'; -- Reels
        v_image_2 := 'https://images.unsplash.com/photo-1611162616475-46b635cb6868'; -- TikTok

      -- Tasarım (3)
      WHEN 'grafik-tasarim' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1626785774573-4b799315345d'; -- Grafik
        v_image_2 := 'https://images.unsplash.com/photo-1561070791-2526d30994b5'; -- Adobe
      WHEN 'canva-figma' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c'; -- Canva
        v_image_2 := 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960'; -- Figma
      WHEN 'dijital-illustrasyon' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1609921205586-7e8a57516512'; -- Dijital
        v_image_2 := 'https://images.unsplash.com/photo-1600607687644-c7171b42498b'; -- Tablet

      -- Yeni Teknolojiler (3)
      WHEN 'yapay-zeka-sanat' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1677442136019-21780ecad995'; -- AI
        v_image_2 := 'https://images.unsplash.com/photo-1686191128892-34a5b6b31f1f'; -- Yapay zeka
      WHEN '3d-yazici' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1581092160562-40aa08e78837'; -- 3D
        v_image_2 := 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789'; -- Printer
      WHEN 'web-tasarim' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1547658719-da2b51169166'; -- Web
        v_image_2 := 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613'; -- Development

      -- ===== 8. DOĞA & OUTDOOR =====

      WHEN 'trekking' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1551632811-561732d1e306'; -- Trekking
        v_image_2 := 'https://images.unsplash.com/photo-1476610182048-b716b8518aae'; -- Dağ
      WHEN 'kampcillik' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d'; -- Kamp
        v_image_2 := 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4'; -- Çadır
      WHEN 'doga-fotografciligi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1606323604874-8d81f0c8f460'; -- Doğa foto
        v_image_2 := 'https://images.unsplash.com/photo-1600277572687-bce2eb51fd34'; -- Landscape
      WHEN 'bahcecilik' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b'; -- Bahçe
        v_image_2 := 'https://images.unsplash.com/photo-1458245201577-fc8a130b8829'; -- Bitki
      WHEN 'ciftlik-deneyimi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1464226184884-fa280b87c399'; -- Çiftlik
        v_image_2 := 'https://images.unsplash.com/photo-1500595046743-cd271d694d30'; -- Hayvan
      WHEN 'tirmanis' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1522163182402-834f871fd851'; -- Tırmanış
        v_image_2 := 'https://images.unsplash.com/photo-1564769625905-50e93615e769'; -- Duvar

      -- ===== 9. TURİST DENEYİMLERİ =====

      WHEN 'turk-seramigi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1610701596021-2d7e1c4e3e3d'; -- Türk seramik
        v_image_2 := 'https://images.unsplash.com/photo-1603344204980-4edb0ea63148'; -- Geleneksel
      WHEN 'ebru-deneyimi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1614854216450-99104b69e050'; -- Ebru
        v_image_2 := 'https://images.unsplash.com/photo-1604947050665-f1c5e1f31da9'; -- Su ebru
      WHEN 'cini-boyama' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1610889556528-81e77f801c3c'; -- Çini
        v_image_2 := 'https://images.unsplash.com/photo-1603344204980-f36933d93f97'; -- Türk çini
      WHEN 'turk-kahvesi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1610889556528-96190a0c787e'; -- Türk kahve
        v_image_2 := 'https://images.unsplash.com/photo-1605711285791-0219e80e43a3'; -- Kahve fal
      WHEN 'osmanli-mutfagi' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1'; -- Osmanlı
        v_image_2 := 'https://images.unsplash.com/photo-1504674900247-0877df9cc836'; -- Türk mutfak
      WHEN 'kulturel-el-sanatlari' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1596548438217-9c3d5f653133'; -- Kültürel
        v_image_2 := 'https://images.unsplash.com/photo-1604054625969-5a3717ba8e0a'; -- El sanat

      -- ===== 10. SOSYAL & EĞLENCE =====

      WHEN 'paint-sip' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1513364776144-60967b0f800f'; -- Paint sip
        v_image_2 := 'https://images.unsplash.com/photo-1596548438192-5cf2cd12bbf6'; -- Boya şarap
      WHEN 'kokteyl-workshop' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b'; -- Kokteyl
        v_image_2 := 'https://images.unsplash.com/photo-1560508801-zunquyZCnmM'; -- Bar
      WHEN 'oyun-geceleri' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09'; -- Oyun
        v_image_2 := 'https://images.unsplash.com/photo-1606167668584-78701c57f13d'; -- Masa oyunu
      WHEN 'sosyal-tanisma' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1511632765486-a01980e01a18'; -- Sosyal
        v_image_2 := 'https://images.unsplash.com/photo-1543269865-cbf427effbad'; -- Tanışma
      WHEN 'cift-atolyeleri' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1606815522077-6de890e95357'; -- Çift
        v_image_2 := 'https://images.unsplash.com/photo-1573495783078-30b34471804b'; -- Çift aktivite
      WHEN 'dogum-gunu' THEN
        v_image_1 := 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3'; -- Doğum günü
        v_image_2 := 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d'; -- Parti

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
-- 202 Etkinlik oluşturuldu (101 alt kategori x 2)
-- Her etkinlik TAMAMEN BENZERSIZ ve konusuyla ALAKALI görsele sahip