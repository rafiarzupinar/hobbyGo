-- Insert subcategories data
-- This is separated in case you want to run table creation first

-- Sanat & El Sanatları
INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Seramik / Çömlek', 'seramik-comlek', 'square'
FROM public.categories WHERE slug = 'sanat-el-sanatlari' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Ebru sanatı', 'ebru-sanati', 'water'
FROM public.categories WHERE slug = 'sanat-el-sanatlari' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Takı tasarımı', 'taki-tasarimi', 'diamond'
FROM public.categories WHERE slug = 'sanat-el-sanatlari' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Resim', 'resim', 'brush'
FROM public.categories WHERE slug = 'sanat-el-sanatlari' LIMIT 1;

-- Deneyim & Öğrenme
INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Kokteyl workshop', 'kokteyl-workshop', 'wine'
FROM public.categories WHERE slug = 'deneyim-ogrenme' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Kahve demleme', 'kahve-demleme', 'cafe'
FROM public.categories WHERE slug = 'deneyim-ogrenme' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Çikolata yapımı', 'cikolata-yapimi', 'ice-cream'
FROM public.categories WHERE slug = 'deneyim-ogrenme' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Teraryum', 'teraryum', 'leaf'
FROM public.categories WHERE slug = 'deneyim-ogrenme' LIMIT 1;

-- Aile & Çocuk
INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Çocuk seramik', 'cocuk-seramik', 'square'
FROM public.categories WHERE slug = 'aile-cocuk' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Çocuk resim', 'cocuk-resim', 'color-palette'
FROM public.categories WHERE slug = 'aile-cocuk' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Kodlama atölyesi', 'kodlama-atolyesi', 'code'
FROM public.categories WHERE slug = 'aile-cocuk' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Robotik', 'robotik', 'hardware-chip'
FROM public.categories WHERE slug = 'aile-cocuk' LIMIT 1;

-- Kişisel Gelişim & Sağlık
INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Yoga', 'yoga', 'fitness'
FROM public.categories WHERE slug = 'kisisel-gelisim-saglik' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Meditasyon', 'meditasyon', 'flower'
FROM public.categories WHERE slug = 'kisisel-gelisim-saglik' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Pilates', 'pilates', 'fitness'
FROM public.categories WHERE slug = 'kisisel-gelisim-saglik' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Dans dersleri', 'dans-dersleri', 'walk'
FROM public.categories WHERE slug = 'kisisel-gelisim-saglik' LIMIT 1;

-- Performans & Sahne
INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Tiyatro / Drama', 'tiyatro-drama', 'mic'
FROM public.categories WHERE slug = 'performans-sahne' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Şan eğitimi', 'san-egitimi', 'musical-notes'
FROM public.categories WHERE slug = 'performans-sahne' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'DJ workshop', 'dj-workshop', 'disc'
FROM public.categories WHERE slug = 'performans-sahne' LIMIT 1;

-- Teknoloji & Dijital
INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Fotoğrafçılık', 'fotografcilik', 'camera'
FROM public.categories WHERE slug = 'teknoloji-dijital' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Video editing', 'video-editing', 'videocam'
FROM public.categories WHERE slug = 'teknoloji-dijital' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Grafik tasarım', 'grafik-tasarim', 'color-palette'
FROM public.categories WHERE slug = 'teknoloji-dijital' LIMIT 1;

-- Doğa & Outdoor
INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Trekking', 'trekking', 'trail-sign'
FROM public.categories WHERE slug = 'doga-outdoor' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Kampçılık', 'kampcilık', 'bonfire'
FROM public.categories WHERE slug = 'doga-outdoor' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Bahçecilik', 'bahcecilik', 'leaf'
FROM public.categories WHERE slug = 'doga-outdoor' LIMIT 1;

-- Moda & Giyim
INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Dikiş atölyesi', 'dikis-atolyesi', 'cut'
FROM public.categories WHERE slug = 'moda-giyim' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Stil danışmanlığı', 'stil-danismanligi', 'shirt'
FROM public.categories WHERE slug = 'moda-giyim' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Çanta tasarımı', 'canta-tasarimi', 'bag'
FROM public.categories WHERE slug = 'moda-giyim' LIMIT 1;

-- El İşi & Zanaat
INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Çömlek tornası', 'comlek-tornasi', 'square'
FROM public.categories WHERE slug = 'el-isi-zanaat' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Ahşap mobilya', 'ahsap-mobilya', 'construct'
FROM public.categories WHERE slug = 'el-isi-zanaat' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Metal işçiliği', 'metal-isciligi', 'hammer'
FROM public.categories WHERE slug = 'el-isi-zanaat' LIMIT 1;

-- Kültürel & Geleneksel
INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Türk kahvesi', 'turk-kahvesi', 'cafe'
FROM public.categories WHERE slug = 'kulturel-geleneksel' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Osmanlı tatlıları', 'osmanli-tatlilari', 'ice-cream'
FROM public.categories WHERE slug = 'kulturel-geleneksel' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Ebru sanatı', 'ebru-sanati-geleneksel', 'water'
FROM public.categories WHERE slug = 'kulturel-geleneksel' LIMIT 1;
