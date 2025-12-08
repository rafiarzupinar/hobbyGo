-- Add subcategories table
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

-- Add RLS policies
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Subcategories are viewable by everyone"
    ON public.subcategories FOR SELECT
    USING (true);

CREATE POLICY "Subcategories are insertable by authenticated users"
    ON public.subcategories FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Subcategories are updatable by authenticated users"
    ON public.subcategories FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_subcategories_category_id ON public.subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_subcategories_slug ON public.subcategories(slug);

-- Insert subcategories for "Sanat & El Sanatları Atölyeleri"
INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Seramik / Çömlek', 'seramik-comlek', 'square'
FROM public.categories WHERE slug = 'sanat-el-sanatlari' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Ebru sanatı', 'ebru-sanati', 'water'
FROM public.categories WHERE slug = 'sanat-el-sanatlari' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Cam füzyon', 'cam-fuzyon', 'flame'
FROM public.categories WHERE slug = 'sanat-el-sanatlari' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Takı tasarımı', 'taki-tasarimi', 'diamond'
FROM public.categories WHERE slug = 'sanat-el-sanatlari' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Kaligrafi', 'kaligrafi', 'create'
FROM public.categories WHERE slug = 'sanat-el-sanatlari' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Resim', 'resim', 'brush'
FROM public.categories WHERE slug = 'sanat-el-sanatlari' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Makrome', 'makrome', 'git-network'
FROM public.categories WHERE slug = 'sanat-el-sanatlari' LIMIT 1;

-- Insert subcategories for "Deneyim & Öğrenme Atölyeleri"
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
SELECT id, 'Sabun yapımı', 'sabun-yapimi', 'water'
FROM public.categories WHERE slug = 'deneyim-ogrenme' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Teraryum', 'teraryum', 'leaf'
FROM public.categories WHERE slug = 'deneyim-ogrenme' LIMIT 1;

-- Insert subcategories for "Aile & Çocuk Atölyeleri"
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

-- Insert subcategories for "Kişisel Gelişim & Sağlık"
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

-- Insert subcategories for "Performans & Sahne Atölyeleri"
INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Tiyatro / Drama', 'tiyatro-drama', 'mic'
FROM public.categories WHERE slug = 'performans-sahne' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Şan eğitimi', 'san-egitimi', 'musical-notes'
FROM public.categories WHERE slug = 'performans-sahne' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'DJ workshop', 'dj-workshop', 'disc'
FROM public.categories WHERE slug = 'performans-sahne' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Müzik prodüksiyonu', 'muzik-produksiyonu', 'musical-note'
FROM public.categories WHERE slug = 'performans-sahne' LIMIT 1;

-- Insert subcategories for "Teknoloji & Dijital"
INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Fotoğrafçılık', 'fotografcilik', 'camera'
FROM public.categories WHERE slug = 'teknoloji-dijital' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Video editing', 'video-editing', 'videocam'
FROM public.categories WHERE slug = 'teknoloji-dijital' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Grafik tasarım', 'grafik-tasarim', 'color-palette'
FROM public.categories WHERE slug = 'teknoloji-dijital' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Web tasarım', 'web-tasarim', 'desktop'
FROM public.categories WHERE slug = 'teknoloji-dijital' LIMIT 1;

-- Insert subcategories for "Doğa & Outdoor"
INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Trekking', 'trekking', 'trail-sign'
FROM public.categories WHERE slug = 'doga-outdoor' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Kampçılık', 'kampcilık', 'bonfire'
FROM public.categories WHERE slug = 'doga-outdoor' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Doğa fotoğrafçılığı', 'doga-fotografciligi', 'camera'
FROM public.categories WHERE slug = 'doga-outdoor' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Bahçecilik', 'bahcecilik', 'leaf'
FROM public.categories WHERE slug = 'doga-outdoor' LIMIT 1;

-- Insert subcategories for "Moda & Giyim"
INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Dikiş atölyesi', 'dikis-atolyesi', 'cut'
FROM public.categories WHERE slug = 'moda-giyim' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Stil danışmanlığı', 'stil-danismanligi', 'shirt'
FROM public.categories WHERE slug = 'moda-giyim' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Çanta tasarımı', 'canta-tasarimi', 'bag'
FROM public.categories WHERE slug = 'moda-giyim' LIMIT 1;

-- Insert subcategories for "El İşi & Zanaat"
INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Çömlek tornası', 'comlek-tornasi', 'square'
FROM public.categories WHERE slug = 'el-isi-zanaat' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Ahşap mobilya', 'ahsap-mobilya', 'construct'
FROM public.categories WHERE slug = 'el-isi-zanaat' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Metal işçiliği', 'metal-isciligi', 'hammer'
FROM public.categories WHERE slug = 'el-isi-zanaat' LIMIT 1;

-- Insert subcategories for "Kültürel & Geleneksel"
INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Türk kahvesi', 'turk-kahvesi', 'cafe'
FROM public.categories WHERE slug = 'kulturel-geleneksel' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Osmanlı tatlıları', 'osmanli-tatlilari', 'ice-cream'
FROM public.categories WHERE slug = 'kulturel-geleneksel' LIMIT 1;

INSERT INTO public.subcategories (category_id, name, slug, icon)
SELECT id, 'Ebru sanatı', 'ebru-sanati-geleneksel', 'water'
FROM public.categories WHERE slug = 'kulturel-geleneksel' LIMIT 1;
