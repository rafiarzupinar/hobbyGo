-- Add subcategory_id column to events table
ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE SET NULL;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_events_subcategory_id ON public.events(subcategory_id);

-- Optional: Update existing events with subcategory
-- You can manually assign subcategories to events later
-- Example:
-- UPDATE public.events
-- SET subcategory_id = (SELECT id FROM subcategories WHERE slug = 'seramik-comlek' LIMIT 1)
-- WHERE title LIKE '%seramik%' OR description LIKE '%seramik%';
