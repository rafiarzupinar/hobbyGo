-- =====================================================
-- Subcategories Migration - Tüm Adımlar
-- =====================================================
-- Bu dosyayı Supabase Dashboard'da SQL Editor'de çalıştırın
-- Dashboard: https://app.supabase.com/project/YOUR-PROJECT/sql

-- =====================================================
-- ADIM 1: Subcategories Tablosunu Oluştur
-- =====================================================

CREATE TABLE IF NOT EXISTS public.subcategories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security) Politikaları
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;

-- Mevcut policy'leri kaldır (varsa)
DROP POLICY IF EXISTS "Subcategories are viewable by everyone" ON public.subcategories;
DROP POLICY IF EXISTS "Subcategories are insertable by authenticated users" ON public.subcategories;
DROP POLICY IF EXISTS "Subcategories are updatable by authenticated users" ON public.subcategories;

-- Yeni policy'leri oluştur
CREATE POLICY "Subcategories are viewable by everyone"
    ON public.subcategories FOR SELECT
    USING (true);

CREATE POLICY "Subcategories are insertable by authenticated users"
    ON public.subcategories FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Subcategories are updatable by authenticated users"
    ON public.subcategories FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Index'ler (Performans için)
CREATE INDEX IF NOT EXISTS idx_subcategories_category_id ON public.subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_subcategories_slug ON public.subcategories(slug);

-- =====================================================
-- ADIM 2: Events Tablosuna subcategory_id Kolonu Ekle
-- =====================================================

ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE SET NULL;

-- Index (Performans için)
CREATE INDEX IF NOT EXISTS idx_events_subcategory_id ON public.events(subcategory_id);

-- =====================================================
-- ADIM 3: Örnek Alt Kategoriler Ekle
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
-- DOĞRULAMA: Tabloları Kontrol Et
-- =====================================================

-- Subcategories sayısını kontrol et
SELECT COUNT(*) as toplam_subcategory FROM public.subcategories;

-- Kategori bazında subcategory dağılımını gör
SELECT
    c.name as kategori,
    COUNT(s.id) as subcategory_sayisi
FROM public.categories c
LEFT JOIN public.subcategories s ON s.category_id = c.id
GROUP BY c.name
ORDER BY subcategory_sayisi DESC;

-- Events tablosunda subcategory_id kolonunu kontrol et
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'events' AND column_name = 'subcategory_id';
