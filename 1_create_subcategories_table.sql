-- 1. Create subcategories table
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

-- 2. Add RLS policies
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

-- 3. Add indexes
CREATE INDEX IF NOT EXISTS idx_subcategories_category_id ON public.subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_subcategories_slug ON public.subcategories(slug);
