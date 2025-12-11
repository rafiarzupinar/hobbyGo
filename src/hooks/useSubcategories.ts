import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/services/supabase';
import type { Subcategory } from '@/types';

export function useSubcategories(categorySlug?: string) {
  return useQuery({
    queryKey: ['subcategories', categorySlug],
    queryFn: async () => {
      let query = supabase
        .from('subcategories')
        .select('*, category:categories(id, slug)')
        .order('name', { ascending: true });

      if (categorySlug) {
        // First get category by slug
        const { data: category } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', categorySlug)
          .single();

        if (category) {
          query = query.eq('category_id', category.id);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Subcategory[];
    },
    enabled: true,
  });
}
