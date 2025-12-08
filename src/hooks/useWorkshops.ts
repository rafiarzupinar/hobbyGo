import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workshopService } from '@services/workshopService';
import { Workshop } from '@types';

export const useWorkshops = (limit = 20, offset = 0) => {
  return useQuery({
    queryKey: ['workshops', limit, offset],
    queryFn: () => workshopService.listWorkshops(limit, offset),
  });
};

export const useNearbyWorkshops = (
  latitude: number,
  longitude: number,
  radiusKm = 10,
  enabled = true
) => {
  return useQuery({
    queryKey: ['workshops', 'nearby', latitude, longitude, radiusKm],
    queryFn: () => workshopService.getNearbyWorkshops(latitude, longitude, radiusKm),
    enabled: enabled && !!latitude && !!longitude,
  });
};

export const useWorkshop = (workshopId: string) => {
  return useQuery({
    queryKey: ['workshop', workshopId],
    queryFn: () => workshopService.getWorkshop(workshopId),
    enabled: !!workshopId,
  });
};

export const useWorkshopsByOwner = (ownerId: string) => {
  return useQuery({
    queryKey: ['workshops', 'owner', ownerId],
    queryFn: () => workshopService.getWorkshopsByOwner(ownerId),
    enabled: !!ownerId,
  });
};

export const useSearchWorkshops = (query: string) => {
  return useQuery({
    queryKey: ['workshops', 'search', query],
    queryFn: () => workshopService.searchWorkshops(query),
    enabled: query.length >= 2,
  });
};

export const useWorkshopReviews = (workshopId: string) => {
  return useQuery({
    queryKey: ['workshop', workshopId, 'reviews'],
    queryFn: () => workshopService.getWorkshopReviews(workshopId),
    enabled: !!workshopId,
  });
};

export const useCreateWorkshop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workshop: Partial<Workshop>) => workshopService.createWorkshop(workshop),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workshops'] });
    },
  });
};

export const useUpdateWorkshop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workshopId, updates }: { workshopId: string; updates: Partial<Workshop> }) =>
      workshopService.updateWorkshop(workshopId, updates),
    onSuccess: (_, { workshopId }) => {
      queryClient.invalidateQueries({ queryKey: ['workshop', workshopId] });
      queryClient.invalidateQueries({ queryKey: ['workshops'] });
    },
  });
};

export const useAddReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workshopId,
      userId,
      rating,
      comment,
    }: {
      workshopId: string;
      userId: string;
      rating: number;
      comment?: string;
    }) => workshopService.addReview(workshopId, userId, rating, comment),
    onSuccess: (_, { workshopId }) => {
      queryClient.invalidateQueries({ queryKey: ['workshop', workshopId, 'reviews'] });
      queryClient.invalidateQueries({ queryKey: ['workshop', workshopId] });
    },
  });
};
