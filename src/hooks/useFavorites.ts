import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoriteService } from '@services/favoriteService';

export const useFavorites = (userId: string) => {
  return useQuery({
    queryKey: ['favorites', userId],
    queryFn: () => favoriteService.getUserFavorites(userId),
    enabled: !!userId,
  });
};

export const useIsFavorited = (userId: string, workshopId: string) => {
  return useQuery({
    queryKey: ['favorite', userId, workshopId],
    queryFn: () => favoriteService.isFavorited(userId, workshopId),
    enabled: !!userId && !!workshopId,
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, workshopId }: { userId: string; workshopId: string }) =>
      favoriteService.toggleFavorite(userId, workshopId),
    onSuccess: (_, { userId, workshopId }) => {
      queryClient.invalidateQueries({ queryKey: ['favorite', userId, workshopId] });
      queryClient.invalidateQueries({ queryKey: ['favorites', userId] });
    },
  });
};
