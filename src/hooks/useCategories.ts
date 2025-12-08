import { useQuery } from '@tanstack/react-query';
import { categoryService } from '@services/categoryService';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.listCategories(),
    staleTime: 1000 * 60 * 30, // 30 minutes - categories rarely change
  });
};

export const useCategory = (categoryId: string) => {
  return useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => categoryService.getCategory(categoryId),
    enabled: !!categoryId,
  });
};
