import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '@services/eventService';
import { Event } from '@types';

export const useEvents = (limit = 20, offset = 0) => {
  return useQuery({
    queryKey: ['events', limit, offset],
    queryFn: () => eventService.listEvents(limit, offset),
  });
};

export const useEventsByCategory = (categoryId: string, limit = 20) => {
  return useQuery({
    queryKey: ['events', 'category', categoryId, limit],
    queryFn: () => eventService.listEventsByCategory(categoryId, limit),
    enabled: !!categoryId,
  });
};

export const useEvent = (eventId: string) => {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: () => eventService.getEvent(eventId),
    enabled: !!eventId,
  });
};

export const useSearchEvents = (query: string, limit = 20) => {
  return useQuery({
    queryKey: ['events', 'search', query, limit],
    queryFn: () => eventService.searchEvents(query, limit),
    enabled: query.length >= 2,
  });
};

export const useUserBookings = (userId: string) => {
  return useQuery({
    queryKey: ['bookings', userId],
    queryFn: () => eventService.getUserBookings(userId),
    enabled: !!userId,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (event: Partial<Event>) => eventService.createEvent(event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, updates }: { eventId: string; updates: Partial<Event> }) =>
      eventService.updateEvent(eventId, updates),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useRegisterToEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      eventId,
      userId,
      numParticipants = 1,
    }: {
      eventId: string;
      userId: string;
      numParticipants?: number;
    }) => eventService.registerToEvent(eventId, userId, numParticipants),
    onSuccess: (_, { eventId, userId }) => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['bookings', userId] });
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => eventService.cancelBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};
