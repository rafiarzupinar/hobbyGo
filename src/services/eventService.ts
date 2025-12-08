import { supabase } from './supabase';
import { Event } from '../types';

export const eventService = {
  // List all active events
  async listEvents(limit = 20, offset = 0): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        workshop:workshops(*),
        category:categories(*)
      `)
      .eq('is_active', true)
      .gte('start_date', new Date().toISOString())
      .order('start_date', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data || [];
  },

  // List events by location (nearby)
  async listEventsByLocation(
    latitude: number,
    longitude: number,
    radiusKm = 10,
    limit = 20
  ): Promise<Event[]> {
    // Using PostGIS earthdistance extension
    const { data, error } = await supabase.rpc('nearby_events', {
      lat: latitude,
      long: longitude,
      radius_km: radiusKm,
      limit_count: limit,
    });

    if (error) throw error;
    return data || [];
  },

  // List events by category
  async listEventsByCategory(categoryId: string, limit = 20): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        workshop:workshops(*),
        category:categories(*)
      `)
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .gte('start_date', new Date().toISOString())
      .order('start_date', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  // Get event by ID
  async getEvent(eventId: string): Promise<Event | null> {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        workshop:workshops(*),
        category:categories(*)
      `)
      .eq('id', eventId)
      .single();

    if (error) throw error;
    return data;
  },

  // Create event (workshop owner only)
  async createEvent(event: Partial<Event>): Promise<Event> {
    const { data, error } = await supabase
      .from('events')
      .insert(event)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update event
  async updateEvent(eventId: string, updates: Partial<Event>): Promise<Event> {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', eventId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete event
  async deleteEvent(eventId: string) {
    const { error } = await supabase
      .from('events')
      .update({ is_active: false })
      .eq('id', eventId);

    if (error) throw error;
  },

  // Search events
  async searchEvents(query: string, limit = 20): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        workshop:workshops(*),
        category:categories(*)
      `)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .eq('is_active', true)
      .gte('start_date', new Date().toISOString())
      .order('start_date', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  // Register to event
  async registerToEvent(eventId: string, userId: string, numParticipants = 1) {
    // First, check capacity
    const event = await this.getEvent(eventId);
    if (!event) throw new Error('Event not found');

    const availableSpots = event.capacity - event.current_bookings;
    if (availableSpots < numParticipants) {
      throw new Error('Not enough spots available');
    }

    // Create booking
    const { data, error } = await supabase
      .from('event_bookings')
      .insert({
        event_id: eventId,
        user_id: userId,
        num_participants: numParticipants,
        total_price: event.price * numParticipants,
        status: 'confirmed',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get user's bookings
  async getUserBookings(userId: string) {
    const { data, error } = await supabase
      .from('event_bookings')
      .select(`
        *,
        event:events(
          *,
          workshop:workshops(*),
          category:categories(*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Cancel booking
  async cancelBooking(bookingId: string) {
    const { data, error } = await supabase
      .from('event_bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Subscribe to event updates (realtime)
  subscribeToEventUpdates(eventId: string, callback: (event: Event) => void) {
    return supabase
      .channel(`event:${eventId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'events',
          filter: `id=eq.${eventId}`,
        },
        (payload) => callback(payload.new as Event)
      )
      .subscribe();
  },
};
