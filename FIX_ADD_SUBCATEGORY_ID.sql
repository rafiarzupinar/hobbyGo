-- =====================================================
-- Events Tablosuna subcategory_id Kolonu Ekle
-- =====================================================
-- Bu SQL'i Supabase Dashboard'da SQL Editor'de çalıştırın

-- Events tablosuna subcategory_id kolonu ekle
ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE SET NULL;

-- Index ekle (Performans için)
CREATE INDEX IF NOT EXISTS idx_events_subcategory_id ON public.events(subcategory_id);

-- Kontrol: Kolonun eklendiğini doğrula
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'events'
  AND column_name = 'subcategory_id';

-- Başarılı olursa şunu göreceksiniz:
-- column_name      | data_type | is_nullable
-- subcategory_id   | uuid      | YES
