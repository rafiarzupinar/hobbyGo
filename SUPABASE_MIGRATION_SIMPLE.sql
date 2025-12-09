-- =====================================================
-- Subcategories Migration - Basit Versiyon
-- =====================================================
-- Bu versiyon sadece eksik olan kısımları ekler
-- Zaten var olan şeyleri tekrar oluşturmaya çalışmaz

-- =====================================================
-- Subcategories tablosu zaten varsa, sadece alt kategorileri ekle
-- =====================================================

-- Sanat & El Sanatları Alt Kategorileri
INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Seramik / Çömlek', 'seramik-comlek', 'square'
FROM public.categories WHERE slug = 'sanat-el-sanatlari' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Ebru sanatı', 'ebru-sanati', 'water'
FROM public.categories WHERE slug = 'sanat-el-sanatlari' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Cam füzyon', 'cam-fuzyon', 'flame'
FROM public.categories WHERE slug = 'sanat-el-sanatlari' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Takı tasarımı', 'taki-tasarimi', 'diamond'
FROM public.categories WHERE slug = 'sanat-el-sanatlari' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Kaligrafi', 'kaligrafi', 'brush'
FROM public.categories WHERE slug = 'sanat-el-sanatlari' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Ahşap oymacılık', 'ahsap-oymacilik', 'hammer'
FROM public.categories WHERE slug = 'sanat-el-sanatlari' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Mozaik', 'mozaik', 'grid'
FROM public.categories WHERE slug = 'sanat-el-sanatlari' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Metal işleme', 'metal-isleme', 'build'
FROM public.categories WHERE slug = 'sanat-el-sanatlari' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

-- Yemek & Gastronomi Alt Kategorileri
INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Pasta & Kek', 'pasta-kek', 'cafe'
FROM public.categories WHERE slug = 'yemek-gastronomi' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Dünya Mutfağı', 'dunya-mutfagi', 'restaurant'
FROM public.categories WHERE slug = 'yemek-gastronomi' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Makarna & İtalyan', 'makarna-italyan', 'nutrition'
FROM public.categories WHERE slug = 'yemek-gastronomi' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Sushi & Asya', 'sushi-asya', 'fish'
FROM public.categories WHERE slug = 'yemek-gastronomi' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Ekmek & Fırın', 'ekmek-firin', 'storefront'
FROM public.categories WHERE slug = 'yemek-gastronomi' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

-- Müzik Alt Kategorileri
INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Gitar', 'gitar', 'musical-notes'
FROM public.categories WHERE slug = 'muzik' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Piyano', 'piyano', 'musical-note'
FROM public.categories WHERE slug = 'muzik' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Vokal & Şan', 'vokal-san', 'mic'
FROM public.categories WHERE slug = 'muzik' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Davul & Perküsyon', 'davul-perkusyon', 'play'
FROM public.categories WHERE slug = 'muzik' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

-- Spor & Fitness Alt Kategorileri
INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Yoga', 'yoga', 'body'
FROM public.categories WHERE slug = 'spor-fitness' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Pilates', 'pilates', 'fitness'
FROM public.categories WHERE slug = 'spor-fitness' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Dans', 'dans', 'man'
FROM public.categories WHERE slug = 'spor-fitness' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Boks & Dövüş Sanatları', 'boks-dovus', 'trophy'
FROM public.categories WHERE slug = 'spor-fitness' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

-- Teknoloji & Dijital Alt Kategorileri
INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Web Geliştirme', 'web-gelistirme', 'code-slash'
FROM public.categories WHERE slug = 'teknoloji-dijital' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Mobil Uygulama', 'mobil-uygulama', 'phone-portrait'
FROM public.categories WHERE slug = 'teknoloji-dijital' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Grafik Tasarım', 'grafik-tasarim', 'color-palette'
FROM public.categories WHERE slug = 'teknoloji-dijital' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Video Editing', 'video-editing', 'videocam'
FROM public.categories WHERE slug = 'teknoloji-dijital' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- KONTROL: Eklenen alt kategorileri listele
-- =====================================================
SELECT
    c.name as kategori,
    s.name as alt_kategori,
    s.slug,
    s.icon
FROM public.subcategories s
JOIN public.categories c ON s.category_id = c.id
ORDER BY c.name, s.name;
